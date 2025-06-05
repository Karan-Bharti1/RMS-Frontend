
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/url';

interface Engineer {
  _id: string;
  name: string;
  email: string;
}

interface EngineerContextType {
  engineers: Engineer[];
  fetchEngineers: () => void;
}

const EngineerContext = createContext<EngineerContextType>({
  engineers: [],
  fetchEngineers: () => {},
});

export const useEngineers = () => useContext(EngineerContext);

export const EngineerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [engineers, setEngineers] = useState<Engineer[]>([]);

  const fetchEngineers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/engineers`);
      setEngineers(res.data);
    } catch (error) {
      console.error('Failed to fetch engineers:', error);
    }
  };

  useEffect(() => {
    fetchEngineers();
  }, []);

  return (
    <EngineerContext.Provider value={{ engineers, fetchEngineers }}>
      {children}
    </EngineerContext.Provider>
  );
};
