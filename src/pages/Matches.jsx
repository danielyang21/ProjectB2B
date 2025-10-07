import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import MatchCard from '../components/MatchCard';
import CompanyDetailModal from '../components/CompanyDetailModal';
import ComparisonModal from '../components/ComparisonModal';

function Matches() {
  const navigate = useNavigate();
  const { matches, resetMatches } = useMatch();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);

  const handleReset = () => {
    if (window.confirm('This will clear all your matches and let you start over. Continue?')) {
      resetMatches();
      navigate('/quiz');
    }
  };

  const exportToCSV = () => {
    if (matches.length === 0) {
      alert('No matches to export!');
      return;
    }

    // Create CSV header
    const headers = ['Company Name', 'Match Score', 'Rating', 'Location', 'Company Size', 'Industry', 'Services', 'Website', 'Email', 'Phone', 'Verified'];

    // Create CSV rows
    const rows = matches.map(company => [
      company.companyName,
      `${company.matchScore || 0}%`,
      company.rating,
      company.location,
      company.companySize,
      company.industry,
      company.services?.join('; ') || '',
      company.website || '',
      company.email || '',
      company.phone || '',
      company.verified ? 'Yes' : 'No'
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `my-matches-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    setSelectedForComparison([]);
  };

  const toggleCompanySelection = (company) => {
    if (selectedForComparison.find(c => c.id === company.id)) {
      setSelectedForComparison(selectedForComparison.filter(c => c.id !== company.id));
    } else {
      if (selectedForComparison.length < 4) {
        setSelectedForComparison([...selectedForComparison, company]);
      } else {
        alert('You can compare up to 4 companies at once');
      }
    }
  };

  const handleCardClick = (company) => {
    if (compareMode) {
      toggleCompanySelection(company);
    } else {
      setSelectedCompany(company);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Your Matches
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Companies you've liked and want to explore further
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => navigate('/swipe')}
            className="px-6 py-3 text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 font-medium transition-colors"
          >
            Continue Swiping
          </button>
          {matches.length > 1 && (
            <button
              onClick={toggleCompareMode}
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 rounded-lg ${
                compareMode
                  ? 'text-white bg-brand-blue-600 hover:bg-brand-blue-700'
                  : 'text-brand-blue-700 dark:text-brand-blue-300 bg-brand-blue-50 dark:bg-brand-blue-900/30 border border-brand-blue-200 dark:border-brand-blue-700 hover:bg-brand-blue-100 dark:hover:bg-brand-blue-900/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {compareMode ? `Compare (${selectedForComparison.length})` : 'Compare Companies'}
            </button>
          )}
          {matches.length > 0 && (
            <button
              onClick={exportToCSV}
              className="px-6 py-3 text-brand-blue-700 dark:text-brand-blue-300 bg-brand-blue-50 dark:bg-brand-blue-900/30 border border-brand-blue-200 dark:border-brand-blue-700 rounded-lg hover:bg-brand-blue-100 dark:hover:bg-brand-blue-900/50 font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to CSV
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-6 py-3 text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 font-medium transition-colors"
          >
            Start Over
          </button>
        </div>

        {/* Compare Mode Info Banner */}
        {compareMode && (
          <div className="mb-6 p-4 bg-brand-blue-50 dark:bg-brand-blue-900/30 border border-brand-blue-200 dark:border-brand-blue-700 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-brand-blue-600 dark:text-brand-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-brand-blue-700 dark:text-brand-blue-300">
                Select 2-4 companies to compare side-by-side. ({selectedForComparison.length} selected)
              </p>
            </div>
            {selectedForComparison.length >= 2 && (
              <button
                onClick={() => setCompareMode(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors"
              >
                View Comparison
              </button>
            )}
          </div>
        )}

        {/* Matches Grid */}
        {matches.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              No matches yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Start swiping to find companies that match your needs
            </p>
            <button
              onClick={() => navigate('/swipe')}
              className="px-8 py-3 bg-brand-blue-600 text-white rounded-xl hover:bg-brand-blue-700 transition-colors font-medium"
            >
              Start Swiping
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-slate-600 dark:text-slate-400">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((company) => {
                const isSelected = selectedForComparison.find(c => c.id === company.id);

                return (
                  <div key={company.id} className="relative">
                    {compareMode && isSelected && (
                      <div className="absolute -top-2 -left-2 z-20">
                        <div className="w-8 h-8 rounded-full bg-brand-blue-600 border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className={compareMode && isSelected ? 'ring-4 ring-brand-blue-500 rounded-xl' : ''}>
                      <MatchCard
                        service={company}
                        onClick={() => handleCardClick(company)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Company Detail Modal */}
      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}

      {/* Comparison Modal */}
      {selectedForComparison.length >= 2 && !compareMode && (
        <ComparisonModal
          companies={selectedForComparison}
          onClose={() => {
            setSelectedForComparison([]);
          }}
        />
      )}
    </div>
  );
}

export default Matches;
