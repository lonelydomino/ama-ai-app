import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash,
  faBook,
  faUsers,
  faChartLine 
} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';

interface Project {
  id: string;
  title: string;
  lastModified: Date;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;

        const response = await fetch(`http://localhost:8000/users/${userId}/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        console.log(data);
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setStatus('Failed to load projects');
      }
    };

    fetchProjects();
  }, []);

  const createNewProject = () => {
    navigate('/create-project');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-rose-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <FontAwesomeIcon icon={faBook} className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Total Projects</h3>
                <p className="text-2xl text-white font-bold">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <FontAwesomeIcon icon={faUsers} className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Collaborators</h3>
                <p className="text-2xl text-white font-bold">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <FontAwesomeIcon icon={faChartLine} className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Active Projects</h3>
                <p className="text-2xl text-white font-bold">
                  {projects.filter(p => new Date(p.lastModified).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">My Projects</h2>
            <button
              onClick={createNewProject}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg 
                       transition-all duration-300 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              Create New Project
            </button>
          </div>

          {/* Projects List */}
          <div className="grid gap-4">
            {projects.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-center">
                <p className="text-white text-lg mb-4">No projects yet</p>
                <button
                  onClick={createNewProject}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg 
                           transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Create Your First Project
                </button>
              </div>
            ) : (
              projects.map(project => (
                <div
                  key={project.id}
                  className="bg-white/10 backdrop-blur-lg rounded-lg p-4 
                           hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl text-white font-semibold">{project.title}</h3>
                      <p className="text-gray-300 text-sm">
                        Last modified: {new Date(project.lastModified).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/editor?id=${project.id}`}
                        className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                        title="Edit Project"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this project?')) {
                            setProjects(prev => prev.filter(p => p.id !== project.id));
                          }
                        }}
                        className="p-2 text-red-400 hover:bg-white/20 rounded transition-colors"
                        title="Delete Project"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {status && (
          <div className="max-w-md mx-auto mt-4 p-4 bg-white/10 rounded-lg text-white text-center">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
