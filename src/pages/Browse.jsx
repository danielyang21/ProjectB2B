import { useState, useMemo } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import ServiceCard from '../components/ServiceCard';
import CompanyDetailModal from '../components/CompanyDetailModal';
import { useServices } from '../context/ServicesContext';

function Browse() {
  const { services } = useServices();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    services: [],
    industry: [],
    companySize: [],
  });
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleFilterChange = (category, values) => {
    setFilters(prev => ({
      ...prev,
      [category]: values,
    }));
  };

  // Filter and search logic
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Search query filter (now searches in services array)
      const matchesSearch = searchQuery === '' ||
        service.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.services?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        service.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Services filter - match if company offers ANY of the selected services
      const matchesServices = filters.services.length === 0 ||
        filters.services.some(selectedService =>
          service.services?.includes(selectedService)
        );

      // Industry filter
      const matchesIndustry = filters.industry.length === 0 ||
        filters.industry.includes(service.industry);

      // Company size filter
      const matchesCompanySize = filters.companySize.length === 0 ||
        filters.companySize.includes(service.companySize);

      return matchesSearch && matchesServices && matchesIndustry && matchesCompanySize;
    });
  }, [searchQuery, filters, services]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-900 mb-2">
            Browse Services
          </h1>
          <p className="text-lg text-slate-600">
            Discover verified B2B service providers tailored to your needs
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search by company, service, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pr-12 text-slate-900 placeholder-slate-400 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent shadow-sm"
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Main Content: Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{filteredServices.length}</span> services found
              </p>
            </div>

            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredServices.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onClick={() => setSelectedCompany(service)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-slate-900">No results found</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Detail Modal */}
      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
}

export default Browse;
