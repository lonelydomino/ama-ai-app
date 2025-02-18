import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';

interface Project {
  id: string;
  title: string;
  lastModified: Date;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  const createNewProject = () => {
    const newProject = {
      id: crypto.randomUUID(),
      title: 'Untitled Project',
      lastModified: new Date()
    };
    setProjects(prev => [newProject, ...prev]);
    navigate(`/editor?id=${newProject.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-rose-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Create Button */}
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
            {projects.map(project => (
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
                        // Add delete confirmation
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects; 