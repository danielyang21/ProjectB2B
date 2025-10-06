import { useState } from 'react';
import { useServices } from '../context/ServicesContext';
import CompanyForm from '../components/CompanyForm';

function Admin() {
  const { services, loading, error, addService, updateService, deleteService, refreshServices } = useServices();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNew = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteService(id);
      } catch (error) {
        alert('Failed to delete company: ' + error.message);
      }
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingService) {
        await updateService(editingService.id, formData);
      } else {
        await addService(formData);
      }
      setShowForm(false);
      setEditingService(null);
    } catch (error) {
      alert('Failed to save company: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Manage service provider listings
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Error: {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleAddNew}
            className="px-6 py-3 text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 font-medium transition-colors"
            disabled={loading}
          >
            + Add New Company
          </button>
          <button
            onClick={refreshServices}
            className="px-6 py-3 text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 font-medium transition-colors"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              {editingService ? 'Edit Company' : 'Add New Company'}
            </h2>
            <CompanyForm
              initialData={editingService}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading companies...</p>
          </div>
        )}

        {/* Companies Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{service.companyName}</div>
                        <div className="flex flex-col gap-0.5">
                          {service.website && (
                            <a
                              href={service.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-brand-blue-600 hover:underline"
                            >
                              Website
                            </a>
                          )}
                          {service.quoteUrl && (
                            <a
                              href={service.quoteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-green-600 hover:underline"
                            >
                              Quote URL
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {service.services?.slice(0, 3).map((svc, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-blue-50 text-brand-blue-700"
                          >
                            {svc}
                          </span>
                        ))}
                        {service.services?.length > 3 && (
                          <span className="text-xs text-slate-500">
                            +{service.services.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {service.industry}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {service.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      ⭐ {service.rating}
                    </td>
                    <td className="px-6 py-4">
                      {service.verified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-brand-blue-600 hover:text-brand-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No companies added yet.</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-sm font-medium text-slate-600">Total Companies</div>
            <div className="text-3xl font-semibold text-slate-900 mt-2">{services.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-sm font-medium text-slate-600">Verified</div>
            <div className="text-3xl font-semibold text-green-600 mt-2">
              {services.filter(s => s.verified).length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-sm font-medium text-slate-600">Average Rating</div>
            <div className="text-3xl font-semibold text-slate-900 mt-2">
              {services.length > 0
                ? (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1)
                : '0.0'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
