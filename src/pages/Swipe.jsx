import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../context/ServicesContext';
import { useMatch } from '../context/MatchContext';
import SwipeCard from '../components/SwipeCard';

function Swipe() {
  const navigate = useNavigate();
  const { services, loading } = useServices();
  const { userPreferences, swipedCompanies, addMatch, addPass } = useMatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const previousSwipedCount = useRef(0);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // If no preferences, redirect to quiz
    if (!userPreferences) {
      navigate('/quiz');
      return;
    }

    // Filter companies based on preferences and exclude already swiped ones
    let filtered = services.filter(service => {
      // Exclude already swiped companies
      if (swipedCompanies.liked.includes(service.id) ||
          swipedCompanies.passed.includes(service.id)) {
        return false;
      }

      // Filter by service type if specified
      if (userPreferences.serviceType && userPreferences.serviceType !== 'other') {
        const serviceTypeMap = {
          'communications': ['UCaaS', 'VoIP', 'Communications', 'Phone Systems'],
          'marketing': ['Marketing', 'Growth', 'CRM', 'Analytics'],
          'it-consulting': ['IT', 'Consulting', 'Technology', 'Software Development'],
          'hr': ['HR', 'Recruiting', 'Talent', 'Payroll'],
          'finance': ['Finance', 'Accounting', 'Payments', 'Invoicing']
        };

        const keywords = serviceTypeMap[userPreferences.serviceType] || [];
        const hasMatchingService = service.services?.some(svc =>
          keywords.some(keyword => svc.toLowerCase().includes(keyword.toLowerCase()))
        ) || keywords.some(keyword =>
          service.industry?.toLowerCase().includes(keyword.toLowerCase())
        );

        if (!hasMatchingService) return false;
      }

      // Filter by company size
      if (userPreferences.companySize) {
        if (service.companySize !== userPreferences.companySize) {
          return false;
        }
      }

      return true;
    });

    // Sort by priority
    if (userPreferences.priority === 'price') {
      // In a real app, you'd have pricing data
      filtered = filtered.sort((a, b) => a.rating - b.rating);
    } else if (userPreferences.priority === 'reputation') {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    } else if (userPreferences.priority === 'support') {
      filtered = filtered.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    }

    const totalSwiped = swipedCompanies.liked.length + swipedCompanies.passed.length;
    const justSwiped = totalSwiped > previousSwipedCount.current;

    setFilteredCompanies(filtered);

    // Always keep currentIndex at 0 since we filter out swiped cards
    // The "current" card is always the first one in the filtered array
    setCurrentIndex(0);

    // Only auto-navigate if we just swiped (not on initial load or navigation)
    // and we've already initialized (to prevent redirect on mount)
    if (hasInitialized.current && justSwiped && filtered.length === 0) {
      navigate('/matches');
    }

    // Mark as initialized after first render
    if (!hasInitialized.current && services.length > 0) {
      hasInitialized.current = true;
    }

    previousSwipedCount.current = totalSwiped;
  }, [services, userPreferences, swipedCompanies, navigate]);

  const handleSwipe = (direction) => {
    const currentCompany = filteredCompanies[currentIndex];

    if (direction === 'right') {
      addMatch(currentCompany);
    } else {
      addPass(currentCompany.id);
    }

    // Don't increment currentIndex - the useEffect will re-filter and
    // remove the swiped card, so the next card becomes index 0
    // The filtering happens automatically when swipedCompanies updates
  };

  const handleButtonSwipe = (direction) => {
    handleSwipe(direction);
  };

  if (!userPreferences) {
    return null;
  }

  // Show loading state while services are being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors pt-20">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (filteredCompanies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors pt-20">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            No More Companies
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            You've seen all available companies matching your preferences.
          </p>
          <button
            onClick={() => navigate('/matches')}
            className="px-8 py-3 bg-brand-blue-600 text-white rounded-xl hover:bg-brand-blue-700 transition-colors font-medium"
          >
            View Your Matches
          </button>
        </div>
      </div>
    );
  }

  const cardsToShow = filteredCompanies.slice(currentIndex, currentIndex + 3);
  const remaining = filteredCompanies.length - currentIndex;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Find Your Perfect Match
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {remaining} {remaining === 1 ? 'company' : 'companies'} remaining
          </p>
        </div>

        {/* Card Stack */}
        <div className="relative w-full max-w-2xl mx-auto" style={{ height: '600px' }}>
          {cardsToShow.map((company, idx) => {
            const isTop = idx === 0;
            const scale = 1 - (idx * 0.05);
            const yOffset = idx * 10;

            return (
              <SwipeCard
                key={company.id}
                company={company}
                onSwipe={isTop ? handleSwipe : () => {}}
                zIndex={cardsToShow.length - idx}
                style={{
                  transform: `scale(${scale}) translateY(${yOffset}px)`,
                  pointerEvents: isTop ? 'auto' : 'none'
                }}
              />
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-8 mt-8">
          <button
            onClick={() => handleButtonSwipe('left')}
            className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-red-500 text-red-500 flex items-center justify-center text-3xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all hover:scale-110 shadow-lg"
            aria-label="Pass"
          >
            ✕
          </button>
          <button
            onClick={() => navigate('/matches')}
            className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-brand-blue-500 text-brand-blue-500 flex items-center justify-center text-2xl hover:bg-brand-blue-50 dark:hover:bg-brand-blue-900/20 transition-all hover:scale-110 shadow-lg"
            aria-label="View Matches"
          >
            ★
          </button>
          <button
            onClick={() => handleButtonSwipe('right')}
            className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-green-500 text-green-500 flex items-center justify-center text-3xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all hover:scale-110 shadow-lg"
            aria-label="Like"
          >
            ♥
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Swipe right or click ♥ to match • Swipe left or click ✕ to pass
          </p>
        </div>
      </div>
    </div>
  );
}

export default Swipe;
