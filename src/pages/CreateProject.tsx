import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faFile,
  faImage,
  faFileAudio,
  faVideo
} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface CreateProjectPayload {
  title: string;
  description: string;
  files: UploadedFile[];
}

interface CreateProjectResponse {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const token = localStorage.getItem('apiToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      
      // Append each file to the FormData
      uploadedFiles.forEach(file => {
        // We need to fetch the actual File object from the URL
        fetch(file.url!)
          .then(res => res.blob())
          .then(blob => {
            const fileObject = new File([blob], file.name, { type: file.type });
            formData.append('files', fileObject);
          });
      });

      const response = await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }

      const data: CreateProjectResponse = await response.json();
      
      // Clean up object URLs
      uploadedFiles.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });

      // Navigate to the editor with the new project ID
      navigate(`/editor?id=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileUpload = (type: 'documents' | 'images' | 'audio' | 'video') => {
    const input = document.createElement('input');
    input.type = 'file';
    
    switch (type) {
      case 'documents':
        input.accept = '.pdf,.doc,.docx,.txt';
        break;
      case 'images':
        input.accept = '.jpg,.jpeg,.png,.gif';
        break;
      case 'audio':
        input.accept = '.mp3,.wav,.m4a';
        break;
      case 'video':
        input.accept = '.mp4,.mov,.avi';
        break;
    }

    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      files.forEach(file => {
        setUploadedFiles(prev => [...prev, {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file)
        }]);
      });
    };
    input.click();
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.url) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-rose-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-white mb-6 flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Create New Project</h1>

          {/* Project Details */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
            <div className="mb-6">
              <label className="block text-white text-sm font-semibold mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                className="w-full bg-white/5 border border-red-200/20 rounded-lg px-4 py-2 
                         text-white placeholder-red-200/50 focus:outline-none focus:ring-2 
                         focus:ring-red-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white text-sm font-semibold mb-2">
                Project Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                rows={4}
                className="w-full bg-white/5 border border-red-200/20 rounded-lg px-4 py-2 
                         text-white placeholder-red-200/50 focus:outline-none focus:ring-2 
                         focus:ring-red-500 resize-none"
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Add Files</h2>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <button
                  onClick={() => handleFileUpload('documents')}
                  className="p-4 bg-white/10 rounded-lg hover:bg-white/20 
                           transition-all duration-300 flex flex-col items-center gap-2"
                >
                  <FontAwesomeIcon icon={faFile} className="text-2xl text-white" />
                  <span className="text-white">Add Documents</span>
                </button>
                <button
                  onClick={() => handleFileUpload('images')}
                  className="p-4 bg-white/10 rounded-lg hover:bg-white/20 
                           transition-all duration-300 flex flex-col items-center gap-2"
                >
                  <FontAwesomeIcon icon={faImage} className="text-2xl text-white" />
                  <span className="text-white">Add Images</span>
                </button>
                <button
                  onClick={() => handleFileUpload('audio')}
                  className="p-4 bg-white/10 rounded-lg hover:bg-white/20 
                           transition-all duration-300 flex flex-col items-center gap-2"
                >
                  <FontAwesomeIcon icon={faFileAudio} className="text-2xl text-white" />
                  <span className="text-white">Add Audio</span>
                </button>
                <button
                  onClick={() => handleFileUpload('video')}
                  className="p-4 bg-white/10 rounded-lg hover:bg-white/20 
                           transition-all duration-300 flex flex-col items-center gap-2"
                >
                  <FontAwesomeIcon icon={faVideo} className="text-2xl text-white" />
                  <span className="text-white">Add Video</span>
                </button>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map(file => (
                    <div 
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon 
                          icon={
                            file.type.includes('image') ? faImage :
                            file.type.includes('audio') ? faFileAudio :
                            file.type.includes('video') ? faVideo : faFile
                          }
                          className="text-white"
                        />
                        <div>
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Create Button */}
          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              disabled={!title.trim() || isCreating}
              className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-8 py-3 
                       rounded-lg hover:shadow-red-500/50 hover:scale-105 
                       transition-all duration-300 disabled:opacity-50 
                       disabled:hover:scale-100 disabled:hover:shadow-none
                       flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject; 