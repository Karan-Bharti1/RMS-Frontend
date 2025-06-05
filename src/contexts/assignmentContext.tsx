import { baseUrl } from '@/url';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface Assignment {
  _id: string;
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
  createAssignment: (data: Omit<Assignment, '_id'>) => Promise<void>;
  updateAssignment: (id: string, data: Omit<Assignment, '_id'>) => Promise<void>;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

export const AssignmentProvider = ({ children }: { children: ReactNode }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Fetch assignments from backend
  const fetchAssignments = async () => {
    try {
      // Fixed: Using axios properly
      const res = await axios.get(`${baseUrl}/assignments`);
      
      // Fixed: axios response data is directly accessible via res.data
      setAssignments(res.data);
      console.log('Assignments fetched:', res.data);
      
    } catch (error) {
      console.error('Error fetching assignments:', error);
      // Optional: You might want to handle specific error cases
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
    }
  };

  // Create a new assignment & refresh list
  const createAssignment = async (data: Omit<Assignment, '_id'>) => {
    try {
      const res = await fetch(`${baseUrl}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create assignment');
      await fetchAssignments();
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  // Update an existing assignment & refresh list
  const updateAssignment = async (id: string, data: Omit<Assignment, '_id'>) => {
    try {
      const res = await fetch(`${baseUrl}/assignments/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to update assignment: ${res.status}`);
      }
      
      console.log('Assignment updated successfully');
      await fetchAssignments(); // Refresh the list
      
    } catch (error) {
      console.error('Error updating assignment:', error);
      // You might want to show a user-friendly error message here
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <AssignmentContext.Provider value={{ 
      assignments, 
      fetchAssignments, 
      createAssignment, 
      updateAssignment 
    }}>
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