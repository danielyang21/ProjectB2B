import { createContext, useContext, useState } from 'react';

const MatchContext = createContext();

export function MatchProvider({ children }) {
  const [userPreferences, setUserPreferences] = useState(null);
  const [matches, setMatches] = useState([]);
  const [matchedCompanies, setMatchedCompanies] = useState([]); // AI-matched companies from prompt
  const [swipedCompanies, setSwipedCompanies] = useState({
    liked: [],
    passed: []
  });

  const addMatch = (company) => {
    // Check if company is already matched to prevent duplicates
    setMatches(prev => {
      const alreadyMatched = prev.some(m => m.id === company.id);
      if (alreadyMatched) {
        return prev; // Don't add duplicate
      }
      return [...prev, company];
    });

    setSwipedCompanies(prev => {
      // Check if already in liked list
      if (prev.liked.includes(company.id)) {
        return prev; // Don't add duplicate
      }
      return {
        ...prev,
        liked: [...prev.liked, company.id]
      };
    });
  };

  const addPass = (companyId) => {
    setSwipedCompanies(prev => {
      // Check if already in passed list
      if (prev.passed.includes(companyId)) {
        return prev; // Don't add duplicate
      }
      return {
        ...prev,
        passed: [...prev.passed, companyId]
      };
    });
  };

  const resetMatches = () => {
    setMatches([]);
    setSwipedCompanies({ liked: [], passed: [] });
  };

  return (
    <MatchContext.Provider value={{
      userPreferences,
      setUserPreferences,
      matches,
      matchedCompanies,
      setMatchedCompanies,
      addMatch,
      addPass,
      swipedCompanies,
      resetMatches
    }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within MatchProvider');
  }
  return context;
}
