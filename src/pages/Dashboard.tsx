import React, { useState } from 'react';
import Header from '../components/Header';

interface UploadResponse {
  success: boolean;
  message: string;
  fileUrl?: string;
}

interface FilePreview {
  file: File;
  type: 'document' | 'audio' | 'media';
  preview: string;
}

const Dashboard: React.FC = () => {
  const [context, setContext] = useState('');
  const [status, setStatus] = useState('');
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);

  const getFileIcon = (type: 'document' | 'audio' | 'media') => {
    switch (type) {
      case 'document':
        return '📄';
      case 'audio':
        return '🎵';
      case 'media':
        return '🖼️';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (file: File, type: 'document' | 'audio' | 'media') => {
    try {
      // Create preview
      let preview = '';
      if (type === 'media' && file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      } else {
        preview = getFileIcon(type);
      }
      
      setFilePreview({ file, type, preview });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('context', context);
      formData.append('type', type);

      const token = localStorage.getItem('apiToken');
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data: UploadResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setStatus(`${type} uploaded successfully!`);
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const handleButtonClick = (type: 'document' | 'audio' | 'media') => {
    const input = document.createElement('input');
    input.type = 'file';
    
    // Set accepted file types based on upload type
    switch (type) {
      case 'document':
        input.accept = '.pdf,.doc,.docx,.txt';
        break;
      case 'audio':
        input.accept = '.mp3,.wav,.m4a';
        break;
      case 'media':
        input.accept = '.jpg,.jpeg,.png,.mp4,.mov';
        break;
    }

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file, type);
      }
    };

    input.click();
  };

  const clearPreview = () => {
    if (filePreview?.preview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview.preview);
    }
    setFilePreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-rose-900">
      {/* Header Component */}
      <Header />

      <div className="container mx-auto px-4">
        {status && (
          <div className="max-w-md mx-auto mt-4 p-4 bg-white/10 rounded-lg text-white text-center">
            {status}
          </div>
        )}

        {filePreview && (
          <div className="max-w-md mx-auto mt-4 p-4 bg-white/10 rounded-lg text-white">
            <div className="flex items-start space-x-4">
              {filePreview.type === 'media' && filePreview.preview.startsWith('blob:') ? (
                <img 
                  src={filePreview.preview} 
                  alt="Preview" 
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center text-4xl bg-white/5 rounded-lg">
                  {filePreview.preview}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold truncate">{filePreview.file.name}</h3>
                <p className="text-sm text-gray-300">{formatFileSize(filePreview.file.size)}</p>
                <p className="text-sm text-gray-300">{filePreview.type}</p>
              </div>
              <button 
                onClick={clearPreview}
                className="text-red-300 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center p-8 mt-8">
          {/* Main Circular Interface */}
          <div className="relative w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full 
                        border-2 border-red-200/20 backdrop-blur-lg bg-white/10
                        transition-all duration-300">
            {/* Center Button */}
            <button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        bg-gradient-to-r from-red-600 to-rose-700 text-white py-6 px-12 
                        rounded-full text-2xl hover:shadow-red-500/50 hover:scale-105 
                        transition-all duration-300"
            >
              Generate Report
            </button>

            {/* Upload Buttons */}
            <button
              onClick={() => handleButtonClick('document')}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 
                        bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 px-4 
                        rounded-full hover:shadow-red-500/50 hover:scale-105 
                        transition-all duration-300"
            >
              Upload Documents
            </button>

            <button
              onClick={() => handleButtonClick('media')}
              className="absolute top-1/2 right-0 transform translate-x-[20px] -translate-y-1/2 
                        bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 px-4 
                        rounded-full hover:shadow-red-500/50 hover:scale-105 
                        transition-all duration-300"
            >
              Upload Media
            </button>

            <button
              onClick={() => handleButtonClick('audio')}
              className="absolute top-1/2 left-0 transform -translate-x-[20px] -translate-y-1/2 
                        bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 px-4 
                        rounded-full hover:shadow-red-500/50 hover:scale-105 
                        transition-all duration-300"
            >
              Upload Audio
            </button>

            {/* Context Input */}
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Add context to your uploads..."
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                        bg-white/10 border border-red-200/20 rounded-lg p-2 resize-none
                        w-64 h-16 text-white placeholder-red-200/50 focus:outline-none 
                        focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
