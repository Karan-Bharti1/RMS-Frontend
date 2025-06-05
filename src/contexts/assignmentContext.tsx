import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { baseUrl } from '../url';

export interface Assignment {
  _id: string;
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string;
  role: 'Developer' | 'Tech Lead' | 'QA' | 'Manager';
}

// Define the input type for creating/updating assignments
export interface AssignmentInput {
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string;
  role: 'Developer' | 'Tech Lead' | 'QA' | 'Manager';
}

interface AssignmentContextType {
  assignments: Assignment[];
  fetchAssignments: () => Promise<void>;
  createAssignment: (data: AssignmentInput) => Promise<void>;
  updateAssignment: (id: string, data: AssignmentInput) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

interface AssignmentProviderProps {
  children: ReactNode;
}

export const AssignmentProvider: React.FC<AssignmentProviderProps> = ({ children }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch assignments from backend
  const fetchAssignments = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get<Assignment[]>(`${baseUrl}/assignments`);
      
      setAssignments(response.data);
      console.log('Assignments fetched:', response.data);
      
    } catch (error) {
      console.error('Error fetching assignments:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        setError(error.response?.data?.message || 'Failed to fetch assignments');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Create a new assignment & refresh list
  const createAssignment = async (data: AssignmentInput): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post<Assignment>(`${baseUrl}/assignments`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log('Assignment created:', response.data);
      await fetchAssignments(); // Refresh the list
      
    } catch (error) {
      console.error('Error creating assignment:', error);
      
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to create assignment');
        throw new Error(error.response?.data?.message || 'Failed to create assignment');
      } else {
        setError('An unexpected error occurred');
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  // Update an existing assignment & refresh list
  const updateAssignment = async (id: string, data: AssignmentInput): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put<Assignment>(`${baseUrl}/assignments/update/${id}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log('Assignment updated successfully:', response.data);
      await fetchAssignments(); // Refresh the list
      
    } catch (error) {
      console.error('Error updating assignment:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || `Failed to update assignment: ${error.response?.status}`;
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        setError('An unexpected error occurred');
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const contextValue: AssignmentContextType = {
    assignments,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    loading,
    error,
  };

  return (
    <AssignmentContext.Provider value={contextValue}>
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignments = (): AssignmentContextType => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error('useAssignments must be used within AssignmentProvider');
  }
  return context;
};