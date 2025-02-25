import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faShare, faCheck, faTimes, faUserPlus, faFile, faFileAudio, faFileVideo, faFileImage, faDownload, faTrashAlt, faFileAlt, faSpinner, faChartLine, faPlus } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';

interface Project {
  id: string;
  title: string;
  description: string;
  updated_at: Date;
  ownerId: number;
  shared_with?: SharedUser[];
  files?: ProjectFile[];
  reports?: ProjectReport[];
}

interface SharedUser {
  id: number;
  username: string;
  email: string;
  role: 'viewer' | 'editor';
}

interface ProjectFile {
  id: string;
  filename: string;
  type: string;
  size: number;
  uploaded_at: Date;
  url: string;
}

interface ProjectReport {
  id: string;
  title: string;
  type: 'analysis' | 'summary' | 'transcript';
  status: 'pending' | 'completed' | 'failed';
  created_at: Date;
  completed_at?: Date;
  url?: string;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor'>('viewer');
  const [shareError, setShareError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:8000/projects/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }

        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  const handleShare = async () => {
    try {
      setShareError(null);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`http://localhost:8000/projects/${id}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          role
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to share project');
      }

      // Refresh project data to get updated shared_with list
      const updatedProject = await response.json();
      setProject(updatedProject);
      setEmail('');
      setIsSharing(false);
    } catch (err) {
      setShareError(err instanceof Error ? err.message : 'Failed to share project');
    }
  };

  const removeAccess = async (userId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/projects/${id}/share/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove access');
      }

      // Update the project data locally
      setProject(prev => 
        prev ? {
          ...prev,
          shared_with: prev.shared_with?.filter(user => user.id !== userId)
        } : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove access');
    }
  };

  const updateUserRole = async (userId: number, newRole: 'viewer' | 'editor') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/projects/${id}/share/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      // Update the project data locally
      setProject(prev => 
        prev ? {
          ...prev,
          shared_with: prev.shared_with?.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
          )
        } : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('audio')) return faFileAudio;
    if (type.includes('video')) return faFileVideo;
    if (type.includes('image')) return faFileImage;
    return faFile;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/projects/${id}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      // Update project data locally
      setProject(prev => 
        prev ? {
          ...prev,
          files: prev.files?.filter(f => f.id !== fileId)
        } : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  const generateReport = async () => {
    try {
      setIsGenerating(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`http://localhost:8000/projects/${id}/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const newReport = await response.json();
      setProject(prev => prev ? {
        ...prev,
        reports: [...(prev.reports || []), newReport]
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // TODO: Implement file upload logic
    console.log('Files to upload:', files);
  };

  const handleUpdateProject = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const updatedProject = await response.json();
      setProject(updatedProject);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-rose-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 relative">
        <button
          onClick={() => navigate(-1)}
          className="text-white mb-6 flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>

        {error ? (
          <div className="max-w-4xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        ) : project ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div className="flex-1 mr-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-white/5 border border-red-200/20 rounded-lg px-4 py-2 
                               text-white text-3xl font-bold focus:outline-none focus:ring-2 
                               focus:ring-red-500"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full bg-white/5 border border-red-200/20 rounded-lg px-4 py-2 
                               text-white focus:outline-none focus:ring-2 focus:ring-red-500 
                               min-h-[100px] resize-none"
                      placeholder="Add a description..."
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
                    <p className="text-gray-300">
                      Last modified: {new Date(project.updated_at).toLocaleString()}
                    </p>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdateProject}
                      className="bg-green-500/10 hover:bg-green-500/20 text-green-400 px-4 py-2 
                               rounded-lg transition-all duration-300 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditTitle(project.title);
                        setEditDescription(project.description);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg 
                               transition-all duration-300 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate(`/projects/${project.id}/edit`)}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg 
                               transition-all duration-300 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg 
                               transition-all duration-300 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                <p className="text-gray-300">
                  {project.description || 'No description provided.'}
                </p>
              </div>
            )}

            {/* Files Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Files</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Supported formats: PDF, DOC, JPG, PNG, MP3, WAV, MP4.
                  </p>
                </div>
                <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg 
                               transition-all duration-300 flex items-center gap-2 cursor-pointer">
                  <FontAwesomeIcon icon={faPlus} />
                  Add Files
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.wav,.mp4,.mov"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="space-y-2">
                {project?.files?.length ? (
                  project.files.map(file => (
                    <div 
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded">
                          <FontAwesomeIcon 
                            icon={getFileIcon(file.type)} 
                            className="text-white text-xl"
                          />
                        </div>
                        <div>
                          <p className="text-white font-medium">{file.filename}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400">
                              {formatFileSize(file.size)}
                            </span>
                            <span className="text-gray-400">
                              Uploaded {new Date(file.uploaded_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={file.url}
                          download
                          className="p-2 text-white hover:bg-white/10 rounded transition-colors"
                          title="Download"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </a>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-2 text-red-400 hover:bg-white/10 rounded transition-colors"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No files have been uploaded yet.
                  </p>
                )}
              </div>
            </div>

            {/* Reports Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Reports</h2>
                <button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg 
                           transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faChartLine} />
                  Generate Report
                </button>
              </div>

              <div className="space-y-2">
                {project?.reports?.length ? (
                  project.reports.map(report => (
                    <div 
                      key={report.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded">
                          <FontAwesomeIcon 
                            icon={report.status === 'pending' ? faSpinner : faFileAlt}
                            className={`text-white text-xl ${report.status === 'pending' ? 'animate-spin' : ''}`}
                          />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {report.title || `${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report`}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`px-2 py-0.5 rounded ${
                              report.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                              report.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                              'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {report.status}
                            </span>
                            <span className="text-gray-400">
                              Generated {new Date(report.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {report.status === 'completed' && report.url && (
                        <a
                          href={report.url}
                          download
                          className="p-2 text-white hover:bg-white/10 rounded transition-colors"
                          title="Download Report"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No reports have been generated yet.
                  </p>
                )}
              </div>
            </div>

            {/* Sharing Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Shared With</h2>
                <button
                  onClick={() => setIsSharing(!isSharing)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg 
                           transition-all duration-300 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  Share Project
                </button>
              </div>

              {/* Share Form */}
              {isSharing && (
                <div className="mb-6 p-4 bg-white/5 rounded-lg">
                  <div className="flex gap-4 mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 bg-white/5 border border-red-200/20 rounded-lg px-4 py-2 
                             text-white placeholder-red-200/50 focus:outline-none focus:ring-2 
                             focus:ring-red-500"
                    />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'viewer' | 'editor')}
                      className="bg-white/5 border border-red-200/20 rounded-lg px-4 py-2 
                             text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                    </select>
                    <button
                      onClick={handleShare}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg 
                             transition-all duration-300"
                    >
                      <FontAwesomeIcon icon={faShare} />
                    </button>
                  </div>
                  {shareError && (
                    <p className="text-red-400 text-sm">{shareError}</p>
                  )}
                </div>
              )}

              {/* Shared Users List */}
              <div className="space-y-2">
                {project?.shared_with?.length ? (
                  project.shared_with.map(user => (
                    <div 
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as 'viewer' | 'editor')}
                          className="bg-white/5 border border-red-200/20 rounded-lg px-2 py-1 
                                   text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                        </select>
                        <button
                          onClick={() => removeAccess(user.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Remove access"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    This project hasn't been shared with anyone yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-lg text-center">
            <p className="text-white text-lg">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails; 