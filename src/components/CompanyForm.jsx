import { useState, useEffect } from 'react';
import { commonServiceTags } from '../data/mockData';

function CompanyForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    companyName: '',
    services: [],
    industry: '',
    location: '',
    companySize: 'Medium',
    description: '',
    rating: 4.5,
    website: '',
    quoteUrl: '',
    email: '',
    phone: '',
    founded: '',
    employees: '',
    certifications: '',
    linkedin: '',
    ...initialData
  });

  const [serviceInput, setServiceInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addService = (service) => {
    if (service && !formData.services.includes(service)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));
      setServiceInput('');
      setShowSuggestions(false);
    }
  };

  const removeService = (serviceToRemove) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== serviceToRemove)
    }));
  };

  const handleServiceInputChange = (e) => {
    setServiceInput(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleServiceKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (serviceInput.trim()) {
        addService(serviceInput.trim());
      }
    }
  };

  const filteredSuggestions = commonServiceTags.filter(tag =>
    tag.toLowerCase().includes(serviceInput.toLowerCase()) &&
    !formData.services.includes(tag)
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate at least one service
    if (formData.services.length === 0) {
      alert('Please add at least one service');
      return;
    }

    // Convert certifications string to array
    const processedData = {
      ...formData,
      rating: parseFloat(formData.rating),
      certifications: formData.certifications
        ? formData.certifications.split(',').map(c => c.trim()).filter(Boolean)
        : []
    };

    onSubmit(processedData);
  };

  // Convert certifications array to string for display
  useEffect(() => {
    if (initialData?.certifications && Array.isArray(initialData.certifications)) {
      setFormData(prev => ({
        ...prev,
        certifications: initialData.certifications.join(', ')
      }));
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
          />
        </div>

        {/* Services Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Services * (Type and press Enter, or select from suggestions)
          </label>

          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.services.map((service) => (
              <span
                key={service}
                className="inline-flex items-center gap-1 px-3 py-1 bg-brand-blue-100 dark:bg-brand-blue-900/30 text-brand-blue-800 dark:text-brand-blue-300 rounded-full text-sm"
              >
                {service}
                <button
                  type="button"
                  onClick={() => removeService(service)}
                  className="hover:text-brand-blue-900 dark:hover:text-brand-blue-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Input with Autocomplete */}
          <div className="relative">
            <input
              type="text"
              value={serviceInput}
              onChange={handleServiceInputChange}
              onKeyDown={handleServiceKeyDown}
              onFocus={() => setShowSuggestions(serviceInput.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Type a service... (e.g., IT Consulting, Cybersecurity)"
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addService(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-sm text-slate-900 dark:text-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {formData.services.length === 0 && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">At least one service is required</p>
          )}
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Industry *
          </label>
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            placeholder="e.g., Technology"
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g., San Francisco, CA"
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Company Size */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Company Size *
          </label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Rating (1-5)
          </label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            step="0.1"
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Quote Request URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Quote Request URL
          </label>
          <input
            type="url"
            name="quoteUrl"
            value={formData.quoteUrl}
            onChange={handleChange}
            placeholder="https://example.com/request-quote"
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Link to the company's quote request or contact page
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@example.com"
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Founded */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Founded Year
          </label>
          <input
            type="text"
            name="founded"
            value={formData.founded}
            onChange={handleChange}
            placeholder="2015"
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Employees */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Employee Count
          </label>
          <input
            type="text"
            name="employees"
            value={formData.employees}
            onChange={handleChange}
            placeholder="50-100"
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            LinkedIn URL
          </label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/company/..."
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          placeholder="Brief description of the company and services offered..."
          className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Certifications (comma-separated)
        </label>
        <input
          type="text"
          name="certifications"
          value={formData.certifications}
          onChange={handleChange}
          placeholder="ISO 27001, SOC 2, HIPAA"
          className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Company' : 'Add Company')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CompanyForm;
