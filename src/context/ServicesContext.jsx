import { createContext, useContext, useState, useEffect } from 'react';
import { mockServices } from '../data/mockData';

const ServicesContext = createContext();

export function ServicesProvider({ children }) {
  const [services, setServices] = useState(() => {
    // Load from localStorage or use mock data
    const stored = localStorage.getItem('services');
    return stored ? JSON.parse(stored) : mockServices;
  });

  // Save to localStorage whenever services change
  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  const addService = (service) => {
    const newService = {
      ...service,
      id: Date.now(), // Simple ID generation
      verified: false,
    };
    setServices([...services, newService]);
  };

  const updateService = (id, updatedService) => {
    setServices(services.map(s => s.id === id ? { ...s, ...updatedService } : s));
  };

  const deleteService = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  const resetToDefault = () => {
    setServices(mockServices);
    localStorage.setItem('services', JSON.stringify(mockServices));
  };

  return (
    <ServicesContext.Provider value={{
      services,
      addService,
      updateService,
      deleteService,
      resetToDefault,
    }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return context;
}
