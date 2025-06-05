import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../url';

const AssignmentContext = createContext(undefined);

export const AssignmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch assignments from backend
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${baseUrl}/assignments`);
      
      setAssignments(response.data);
      console.log('Assignments fetched:', response.data);
      
    } catch (error:any) {
      console.error('Error fetching assignments:', error);
      
      if (error.response) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        setError(error.response?.data?.message || 'Failed to fetch assignments');
      } 
    } finally {
      setLoading(false);
    }
  };

  // Create a new assignment & refresh list
  const createAssignment = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${baseUrl}/assignments`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log('Assignment created:', response.data);
      await fetchAssignments(); // Refresh the list
      
    } catch (error) {
      console.error('Error creating assignment:', error);
      
      if (error.response) {
        const errorMessage = error.response?.data?.message || 'Failed to create assignment';
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  // Update an existing assignment & refresh list
  const updateAssignment = async (id: any, data: any) => {
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
        
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const contextValue = {
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

export const useAssignments = () => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error('useAssignments must be used within AssignmentProvider');
  }
  return context;
};