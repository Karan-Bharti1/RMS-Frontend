import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../url';



interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  requiredSkills: string[];
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
  managerId: string;
}

interface ProjectsContextType {
  projects: Project[];
  fetchProjects: () => Promise<void>;
  addProject: (project: Project) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) throw new Error('useProjects must be used within a ProjectsProvider');
  return context;
};

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);

 const fetchProjects = async () => {
    try {
      const storedUserData = localStorage.getItem('userdata');
      const userData = storedUserData ? JSON.parse(storedUserData) : null;
      const managerId = userData?.userId;

      if (!managerId) {
        console.warn('Manager ID not found in localStorage');
        return;
      }

      const res = await axios.get(`${baseUrl}/projects/${managerId}`);
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectsContext.Provider value={{ projects, fetchProjects, addProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};
