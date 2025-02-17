import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBold, 
  faItalic, 
  faUnderline, 
  faAlignLeft, 
  faAlignCenter, 
  faAlignRight,
  faListUl,
  faListOl,
} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';

interface EditorState {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

interface CursorPosition {
  start: number;
  end: number;
}

interface CollaboratorInfo {
  id: string;
  username: string;
  color: string;
  cursorPosition?: CursorPosition;
  isTyping?: boolean;
  lastTypingTime?: number;
}

interface WebSocketMessagePayload {
  userId: string;
  username: string;
  documentId?: string;
  content: string;
  title: string;
  cursorPosition?: CursorPosition;
  isTyping?: boolean;
}

interface WebSocketMessage {
  type: 'update' | 'join' | 'leave' | 'cursor' | 'typing';
  payload: WebSocketMessagePayload;
}

const Editor: React.FC = () => {
  const [editorState, setEditorState] = useState<EditorState>({
    id: crypto.randomUUID(),
    title: 'Untitled Document',
    content: '',
    lastModified: new Date()
  });

  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([]);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const lastContent = useRef(editorState.content);

  // Set up WebSocket connection
  useEffect(() => {
    const userDataStr = localStorage.getItem('user');
    if (!userDataStr) return;

    const userData = JSON.parse(userDataStr);
    const ws = new WebSocket('ws://localhost:8000/editor');

    ws.onopen = () => {
      // Join the editing session
      ws.send(JSON.stringify({
        type: 'join',
        payload: {
          userId: userData.id,
          username: userData.username,
          documentId: editorState.id,
          content: editorState.content,
          title: editorState.title
        }
      }));
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'update':
          setEditorState(prev => ({
            ...prev,
            content: message.payload.content,
            title: message.payload.title,
            lastModified: new Date()
          }));
          break;

        case 'join':
          setCollaborators(prev => [
            ...prev,
            {
              id: message.payload.userId,
              username: message.payload.username,
              color: getRandomColor()
            }
          ]);
          break;

        case 'leave':
          setCollaborators(prev => 
            prev.filter(c => c.id !== message.payload.userId)
          );
          break;

        case 'cursor':
          if (message.payload.cursorPosition) {
            setCollaborators(prev => prev.map(c => 
              c.id === message.payload.userId
                ? { ...c, cursorPosition: message.payload.cursorPosition }
                : c
            ));
            setCursorPosition(message.payload.cursorPosition, message.payload.userId);
          }
          break;

        case 'typing':
          setCollaborators(prev => prev.map(c => 
            c.id === message.payload.userId
              ? { 
                  ...c, 
                  isTyping: message.payload.isTyping,
                  lastTypingTime: message.payload.isTyping ? Date.now() : undefined
                }
              : c
          ));
          break;
      }
    };

    setWsConnection(ws);

    return () => {
      ws.close();
    };
  }, [editorState.id]);

  useEffect(() => {
    if (!isTyping && editorRef.current && editorState.content !== lastContent.current) {
      // Save current selection
      const selection = window.getSelection();
      const savedRange = selection?.getRangeAt(0).cloneRange();
      
      // Update content
      editorRef.current.innerHTML = editorState.content;
      lastContent.current = editorState.content;

      // Restore selection
      if (savedRange && selection) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }
    }
  }, [editorState.content, isTyping]);

  const sendTypingStatus = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (wsConnection?.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'typing',
        payload: {
          userId: userData.id,
          username: userData.username,
          content: editorState.content,
          title: editorState.title,
          isTyping: true
        }
      }));
    }
  };

  const handleContentChange = (newContent: string) => {
    setIsTyping(true);
    sendTypingStatus();
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (wsConnection?.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'update',
        payload: {
          userId: userData.id,
          username: userData.username,
          content: newContent,
          title: editorState.title
        }
      }));
    }

    setEditorState(prev => ({
      ...prev,
      content: newContent,
      lastModified: new Date()
    }));

    // Use RAF to ensure we don't interfere with the current update
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsTyping(false);
        // Send stopped typing status
        if (wsConnection?.readyState === WebSocket.OPEN) {
          wsConnection.send(JSON.stringify({
            type: 'typing',
            payload: {
              userId: userData.id,
              username: userData.username,
              content: newContent,
              title: editorState.title,
              isTyping: false
            }
          }));
        }
      }, 500);
    });
  };

  const handleTitleChange = (newTitle: string) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (wsConnection?.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'update',
        payload: {
          userId: userData.id,
          username: userData.username,
          content: editorState.content,
          title: newTitle
        }
      }));
    }

    setEditorState(prev => ({
      ...prev,
      title: newTitle,
      lastModified: new Date()
    }));
  };

  const getRandomColor = (): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    const content = editorRef.current?.innerHTML || '';
    handleContentChange(content);
    editorRef.current?.focus();
  };

  const isFormatActive = (command: string): boolean => {
    return document.queryCommandState(command);
  };

  const sendCursorPosition = () => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(editorRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;
    const end = start + range.toString().length;

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (wsConnection?.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'cursor',
        payload: {
          userId: userData.id,
          username: userData.username,
          content: editorState.content,
          title: editorState.title,
          cursorPosition: { start, end }
        }
      }));
    }
  };

  const setCursorPosition = (position: CursorPosition, collaboratorId: string) => {
    const content = editorRef.current;
    if (!content) return;

    // Create cursor element
    const cursor = document.createElement('span');
    cursor.className = 'remote-cursor';
    cursor.style.position = 'absolute';
    cursor.style.borderLeft = '2px solid';
    cursor.style.height = '1.2em';
    cursor.style.marginTop = '4px';
    
    // Find collaborator's color
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    if (collaborator) {
      cursor.style.borderColor = collaborator.color;
    }

    // Position cursor
    const textNodes: Node[] = [];
    const walk = document.createTreeWalker(
      content,
      NodeFilter.SHOW_TEXT,
      null
    );

    let currentNode: Node | null = walk.nextNode();
    while (currentNode) {
      textNodes.push(currentNode);
      currentNode = walk.nextNode();
    }

    let currentLength = 0;
    for (const textNode of textNodes) {
      const nodeLength = textNode.textContent?.length || 0;
      if (currentLength + nodeLength >= position.start) {
        const range = document.createRange();
        range.setStart(textNode, position.start - currentLength);
        range.collapse(true);
        
        // Remove existing cursor for this collaborator
        const existingCursor = document.querySelector(`[data-user-id="${collaboratorId}"]`);
        existingCursor?.remove();
        
        // Add new cursor
        cursor.dataset.userId = collaboratorId;
        const rect = range.getBoundingClientRect();
        cursor.style.left = `${rect.left}px`;
        cursor.style.top = `${rect.top}px`;
        document.body.appendChild(cursor);
        break;
      }
      currentLength += nodeLength;
    }
  };

  // Add cursor position tracking
  useEffect(() => {
    const content = editorRef.current;
    if (!content) return;

    const handleSelectionChange = () => {
      sendCursorPosition();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      // Clean up cursors
      document.querySelectorAll('.remote-cursor').forEach(el => el.remove());
    };
  }, [wsConnection]);

  // Add styles for cursors
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .remote-cursor {
        pointer-events: none;
        z-index: 1;
        animation: blink 1s infinite;
      }
      @keyframes blink {
        50% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add typing indicator cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(c => {
        if (c.isTyping && c.lastTypingTime && Date.now() - c.lastTypingTime > 3000) {
          return { ...c, isTyping: false, lastTypingTime: undefined };
        }
        return c;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-rose-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto backdrop-blur-lg bg-white/10 p-6 rounded-xl">
          {/* Title */}
          <input
            type="text"
            value={editorState.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-transparent text-2xl font-bold text-white border-none 
                     outline-none mb-4 focus:ring-2 focus:ring-red-500 rounded-lg px-2"
            placeholder="Document Title"
          />

          {/* Collaborators with Typing Indicators */}
          {collaborators.length > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <div className="flex -space-x-2">
                {collaborators.map(collaborator => (
                  <div
                    key={collaborator.id}
                    className="relative"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: collaborator.color }}
                      title={collaborator.username}
                    >
                      {collaborator.username[0].toUpperCase()}
                    </div>
                    {collaborator.isTyping && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <span className="text-gray-300 text-sm">
                {collaborators.some(c => c.isTyping) 
                  ? `${collaborators.filter(c => c.isTyping).map(c => c.username).join(', ')} ${
                      collaborators.filter(c => c.isTyping).length === 1 ? 'is' : 'are'
                    } typing...`
                  : `${collaborators.length} ${collaborators.length === 1 ? 'person' : 'people'} editing`
                }
              </span>
            </div>
          )}

          {/* Formatting Toolbar */}
          <div className="flex flex-wrap gap-1 mb-4 p-2 bg-white/5 rounded-lg">
            <button
              onClick={() => execCommand('bold')}
              className={`p-2 text-white rounded transition-colors
                ${isFormatActive('bold') ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Bold"
            >
              <FontAwesomeIcon icon={faBold} />
            </button>
            <button
              onClick={() => execCommand('italic')}
              className={`p-2 text-white rounded transition-colors
                ${isFormatActive('italic') ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Italic"
            >
              <FontAwesomeIcon icon={faItalic} />
            </button>
            <button
              onClick={() => execCommand('underline')}
              className={`p-2 text-white rounded transition-colors
                ${isFormatActive('underline') ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Underline"
            >
              <FontAwesomeIcon icon={faUnderline} />
            </button>

            <div className="w-px h-6 bg-white/20 mx-1" />

            <button
              onClick={() => execCommand('justifyLeft')}
              className={`p-2 text-white rounded transition-colors
                ${isFormatActive('justifyLeft') ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Align Left"
            >
              <FontAwesomeIcon icon={faAlignLeft} />
            </button>
            <button
              onClick={() => execCommand('justifyCenter')}
              className={`p-2 text-white rounded transition-colors
                ${isFormatActive('justifyCenter') ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Align Center"
            >
              <FontAwesomeIcon icon={faAlignCenter} />
            </button>
            <button
              onClick={() => execCommand('justifyRight')}
              className={`p-2 text-white rounded transition-colors
                ${isFormatActive('justifyRight') ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Align Right"
            >
              <FontAwesomeIcon icon={faAlignRight} />
            </button>

            <div className="w-px h-6 bg-white/20 mx-1" />

            <button
              onClick={() => execCommand('insertUnorderedList')}
              className={`p-2 text-white rounded transition-colors
                ${isFormatActive('insertUnorderedList') ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Bullet List"
            >
              <FontAwesomeIcon icon={faListUl} />
            </button>
            <button
              onClick={() => execCommand('insertOrderedList')}
              className={`p-2 text-white rounded transition-colors
                ${isFormatActive('insertOrderedList') ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Numbered List"
            >
              <FontAwesomeIcon icon={faListOl} />
            </button>

            <div className="w-px h-6 bg-white/20 mx-1" />

            <select
              onChange={(e) => execCommand('formatBlock', e.target.value)}
              className="bg-white/10 text-white rounded px-2 hover:bg-white/20 transition-colors"
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="pre">Preformatted</option>
            </select>
          </div>

          {/* Editor */}
          <div
            ref={editorRef}
            contentEditable
            className="w-full min-h-[400px] bg-white/5 text-white p-4 rounded-lg 
                     border border-red-200/20 focus:outline-none focus:ring-2 
                     focus:ring-red-500"
            onInput={(e) => handleContentChange(e.currentTarget.innerHTML)}
            suppressContentEditableWarning
          />

          {/* Last Modified */}
          <div className="mt-4 text-gray-300 text-sm">
            Last modified: {editorState.lastModified.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor; 