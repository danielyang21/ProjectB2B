import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyForm from '../components/CompanyForm';

const API_URL = import.meta.env.VITE_API_URL;

function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingServices, setPendingServices] = useState([]);
  const [approvedServices, setApprovedServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
  const [error, setError] = useState('');

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Load services when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadServices();
    }
  }, [isAuthenticated]);

  const checkAuth = () => {
    const isAuth = localStorage.getItem('adminAuth');

    if (!isAuth || isAuth !== 'true') {
      navigate('/admin/login');
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);
  };

  const loadServices = async () => {
    try {
      // Load pending services
      const pendingResponse = await fetch(`${API_URL}/api/services/admin/pending`);
      const pendingData = await pendingResponse.json();
      if (pendingData.success) {
        setPendingServices(pendingData.data.map(s => ({ ...s, id: s._id })));
      }

      // Load all services
      const allResponse = await fetch(`${API_URL}/api/services/admin/all?approved=true`);
      const allData = await allResponse.json();
      if (allData.success) {
        setApprovedServices(allData.data.map(s => ({ ...s, id: s._id })));
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setError('Failed to load services');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/services/admin/${id}/approve`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error('Failed to approve service');
      }

      // Reload services
      await loadServices();
      alert('Company approved successfully!');
    } catch (error) {
      console.error('Error approving service:', error);
      alert('Failed to approve company');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject and delete this submission?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/services/admin/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to reject service');
      }

      // Reload services
      await loadServices();
      alert('Company rejected and removed');
    } catch (error) {
      console.error('Error rejecting service:', error);
      alert('Failed to reject company');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/services/admin/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      // Reload services
      await loadServices();
      alert('Company deleted successfully');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete company');
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/services/admin/${editingService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update service');
      }

      setShowForm(false);
      setEditingService(null);
      await loadServices();
      alert('Company updated successfully');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const displayServices = activeTab === 'pending' ? pendingServices : approvedServices;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Manage company submissions and listings
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            Error: {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Submissions</div>
            <div className="text-3xl font-semibold text-orange-600 dark:text-orange-500 mt-2">
              {pendingServices.length}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Approved Companies</div>
            <div className="text-3xl font-semibold text-green-600 dark:text-green-500 mt-2">
              {approvedServices.length}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Verified Companies</div>
            <div className="text-3xl font-semibold text-brand-blue-600 dark:text-brand-blue-500 mt-2">
              {approvedServices.filter(s => s.verified).length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`pb-4 px-1 font-medium transition-colors relative ${
                activeTab === 'pending'
                  ? 'text-brand-blue-600 dark:text-brand-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pending Submissions
              {pendingServices.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full">
                  {pendingServices.length}
                </span>
              )}
              {activeTab === 'pending' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue-600 dark:bg-brand-blue-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`pb-4 px-1 font-medium transition-colors relative ${
                activeTab === 'approved'
                  ? 'text-brand-blue-600 dark:text-brand-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Approved Companies
              {activeTab === 'approved' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue-600 dark:bg-brand-blue-400" />
              )}
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && editingService && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
              Edit Company
            </h2>
            <CompanyForm
              initialData={editingService}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* Services Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {displayServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{service.companyName}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{service.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {service.services?.slice(0, 2).map((svc, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-blue-50 dark:bg-brand-blue-900/30 text-brand-blue-700 dark:text-brand-blue-300"
                          >
                            {svc}
                          </span>
                        ))}
                        {service.services?.length > 2 && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            +{service.services.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {service.industry}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {service.companySize}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {activeTab === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApprove(service.id)}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(service.id)}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(service)}
                              className="px-3 py-1.5 text-sm font-medium text-brand-blue-600 dark:text-brand-blue-400 hover:bg-brand-blue-50 dark:hover:bg-brand-blue-900/30 rounded-lg transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {displayServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                {activeTab === 'pending' ? 'No pending submissions' : 'No approved companies'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
