import { createContext, useContext, useState, useEffect } from 'react';

const ServicesContext = createContext();
const API_URL = 'http://localhost:5000/api/services';

export function ServicesProvider({ children }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from API
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();

      if (result.success) {
        // Map MongoDB _id to id for compatibility with existing frontend
        const servicesWithId = result.data.map(service => ({
          ...service,
          id: service._id
        }));
        setServices(servicesWithId);
      } else {
        setError('Failed to fetch services');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const addService = async (service) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });

      const result = await response.json();

      if (result.success) {
        const newService = { ...result.data, id: result.data._id };
        setServices([...services, newService]);
        return newService;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Error adding service:', err);
      throw err;
    }
  };

  const updateService = async (id, updatedService) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedService),
      });

      const result = await response.json();

      if (result.success) {
        const updated = { ...result.data, id: result.data._id };
        setServices(services.map(s => s.id === id ? updated : s));
        return updated;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Error updating service:', err);
      throw err;
    }
  };

  const deleteService = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setServices(services.filter(s => s.id !== id));
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      throw err;
    }
  };

  return (
    <ServicesContext.Provider value={{
      services,
      loading,
      error,
      addService,
      updateService,
      deleteService,
      refreshServices: fetchServices,
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
