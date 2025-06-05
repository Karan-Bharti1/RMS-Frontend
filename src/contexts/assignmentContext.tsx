import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../url';

// Define types for better type safety
interface Assignment {
  _id: string;
  engineerId: string | { _id: string; username?: string; name?: string; firstName?: string; email?: string };
  projectId: string;
  role: string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string;
}

interface AssignmentContextType {
  assignments: Assignment[];
  fetchAssignments: () => Promise<void>;
  createAssignment: (data: Omit<Assignment, '_id'>) => Promise<void>;
  updateAssignment: (id: string, data: Partial<Assignment>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

export const AssignmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch assignments from backend
  const fetchAssignments = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${baseUrl}/assignments`);
      
      setAssignments(response.data);
      console.log('Assignments fetched:', response.data);
      
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      
      if (error.response) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        setError(error.response?.data?.message || 'Failed to fetch assignments');
      } else {
        setError('Failed to fetch assignments');
      }
    } finally {
      setLoading(false);
    }
  };

  // Create a new assignment & refresh list
  const createAssignment = async (data: Omit<Assignment, '_id'>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${baseUrl}/assignments`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log('Assignment created:', response.data);
      await fetchAssignments(); // Refresh the list
      
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      
      if (error.response) {
        const errorMessage = error.response?.data?.message || 'Failed to create assignment';
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        const errorMessage = 'Failed to create assignment';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update an existing assignment & refresh list
  const updateAssignment = async (id: string, data: Partial<Assignment>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`${baseUrl}/assignments/update/${id}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log('Assignment updated successfully:', response.data);
      await fetchAssignments(); // Refresh the list
      
    } catch (error: any) {
      console.error('Error updating assignment:', error);
      
      if (error.response) {
        const errorMessage = error.response?.data?.message || `Failed to update assignment: ${error.response?.status}`;
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        const errorMessage = 'Failed to update assignment';
        setError(errorMessage);
        throw new Error(errorMessage);
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