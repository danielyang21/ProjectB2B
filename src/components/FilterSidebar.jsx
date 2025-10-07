import { commonServiceTags, industries, companySizes } from '../data/mockData';
import { useState, useMemo } from 'react';
import { useServices } from '../context/ServicesContext';

function FilterSidebar({ filters, onFilterChange }) {
  const { services } = useServices();
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');

  // Get all unique services from actual companies
  const allServices = useMemo(() => {
    const serviceSet = new Set();
    services.forEach(service => {
      service.services?.forEach(s => serviceSet.add(s));
    });
    return Array.from(serviceSet).sort();
  }, [services]);

  // Filter services based on search
  const filteredServices = useMemo(() => {
    if (!serviceSearchTerm) return allServices;
    return allServices.filter(service =>
      service.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    );
  }, [allServices, serviceSearchTerm]);
  const handleCheckboxChange = (category, value) => {
    const currentValues = filters[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFilterChange(category, newValues);
  };

  const clearAllFilters = () => {
    onFilterChange('services', []);
    onFilterChange('industry', []);
    onFilterChange('companySize', []);
  };

  const hasActiveFilters =
    (filters.services?.length > 0) ||
    (filters.industry?.length > 0) ||
    (filters.companySize?.length > 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 sticky top-24">
      <div className="p-6 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-brand-blue-600 dark:text-brand-blue-400 hover:text-brand-blue-700 dark:hover:text-brand-blue-300 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Services Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Services</h4>

          {/* Search Services */}
          <input
            type="text"
            placeholder="Search services..."
            value={serviceSearchTerm}
            onChange={(e) => setServiceSearchTerm(e.target.value)}
            className="w-full px-3 py-2 mb-3 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500"
          />

          <div
            className="space-y-2 max-h-48 overflow-y-auto pr-2 filter-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#60a5fa transparent'
            }}
          >
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <label key={service} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.services?.includes(service) || false}
                    onChange={() => handleCheckboxChange('services', service)}
                    className="w-4 h-4 text-brand-blue-600 border-slate-300 rounded focus:ring-brand-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                    {service}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No services found</p>
            )}
          </div>
        </div>

        {/* Industry Filter */}
        <div className="mb-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Industry</h4>
          <div className="space-y-2">
            {industries.map((industry) => (
              <label key={industry} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.industry?.includes(industry) || false}
                  onChange={() => handleCheckboxChange('industry', industry)}
                  className="w-4 h-4 text-brand-blue-600 border-slate-300 dark:border-slate-600 rounded focus:ring-brand-blue-500"
                />
                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  {industry}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Company Size Filter */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Company Size</h4>
          <div className="space-y-2">
            {companySizes.map((size) => (
              <label key={size} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.companySize?.includes(size) || false}
                  onChange={() => handleCheckboxChange('companySize', size)}
                  className="w-4 h-4 text-brand-blue-600 border-slate-300 dark:border-slate-600 rounded focus:ring-brand-blue-500"
                />
                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  {size}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;
