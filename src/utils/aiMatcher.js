/**
 * AI-Powered Matching Algorithm
 * Calculates a match score (0-100) based on user preferences and company attributes
 */

/**
 * Calculate match score between user preferences and a company
 * @param {Object} userPreferences - User's quiz responses
 * @param {Object} company - Company data
 * @returns {number} Match score from 0-100
 */
export function calculateMatchScore(userPreferences, company) {
  if (!userPreferences || !company) return 0;

  let score = 0;
  let weights = {
    serviceType: 30,
    companySize: 20,
    budget: 15,
    priority: 25,
    verified: 10
  };

  // 1. Service Type Match (30 points)
  if (userPreferences.serviceType && userPreferences.serviceType !== 'other') {
    const serviceTypeMap = {
      'communications': ['UCaaS', 'VoIP', 'Communications', 'Phone Systems', 'Video Conferencing', 'Collaboration'],
      'marketing': ['Marketing', 'Growth', 'CRM', 'Analytics', 'SEO', 'Social Media', 'Email Marketing'],
      'it-consulting': ['IT', 'Consulting', 'Technology', 'Software Development', 'Cloud', 'DevOps', 'Cybersecurity'],
      'hr': ['HR', 'Recruiting', 'Talent', 'Payroll', 'Benefits', 'Employee Management'],
      'finance': ['Finance', 'Accounting', 'Payments', 'Invoicing', 'Bookkeeping', 'Tax']
    };

    const keywords = serviceTypeMap[userPreferences.serviceType] || [];

    // Check if company services match user's desired service type
    const matchingServices = company.services?.filter(svc =>
      keywords.some(keyword => svc.toLowerCase().includes(keyword.toLowerCase()))
    ) || [];

    const industryMatch = keywords.some(keyword =>
      company.industry?.toLowerCase().includes(keyword.toLowerCase())
    );

    if (matchingServices.length > 0 || industryMatch) {
      // Full points if multiple services match
      const matchPercentage = Math.min(matchingServices.length / 2, 1);
      score += weights.serviceType * (industryMatch ? 1 : matchPercentage);
    }
  } else {
    // If user selected "other", give partial credit
    score += weights.serviceType * 0.5;
  }

  // 2. Company Size Match (20 points)
  if (userPreferences.companySize) {
    if (company.companySize === userPreferences.companySize) {
      score += weights.companySize;
    } else {
      // Partial credit for adjacent sizes
      const sizeOrder = ['Small', 'Medium', 'Large'];
      const userSizeIndex = sizeOrder.indexOf(userPreferences.companySize);
      const companySizeIndex = sizeOrder.indexOf(company.companySize);
      const difference = Math.abs(userSizeIndex - companySizeIndex);

      if (difference === 1) {
        score += weights.companySize * 0.5; // 50% if one size off
      }
    }
  }

  // 3. Budget Alignment (15 points)
  // This is a simplified version - in a real app, you'd have pricing data
  if (userPreferences.budget) {
    const budgetMap = {
      'low': ['Small'],
      'medium': ['Small', 'Medium'],
      'high': ['Medium', 'Large'],
      'flexible': ['Small', 'Medium', 'Large']
    };

    const appropriateSizes = budgetMap[userPreferences.budget] || [];
    if (appropriateSizes.includes(company.companySize)) {
      score += weights.budget;
    } else if (userPreferences.budget === 'flexible') {
      score += weights.budget * 0.7;
    }
  }

  // 4. Priority-Based Scoring (25 points)
  if (userPreferences.priority) {
    switch (userPreferences.priority) {
      case 'price':
        // Lower company size typically means lower cost
        if (company.companySize === 'Small') {
          score += weights.priority;
        } else if (company.companySize === 'Medium') {
          score += weights.priority * 0.6;
        }
        break;

      case 'features':
        // Larger companies typically have more features
        if (company.companySize === 'Large') {
          score += weights.priority;
        } else if (company.companySize === 'Medium') {
          score += weights.priority * 0.6;
        }
        // More services = more features
        const serviceBonus = Math.min((company.services?.length || 0) / 5, 1) * 0.3;
        score += weights.priority * serviceBonus;
        break;

      case 'support':
        // Verified companies likely have better support
        if (company.verified) {
          score += weights.priority * 0.7;
        }
        // Larger companies often have dedicated support
        if (company.companySize === 'Large' || company.companySize === 'Medium') {
          score += weights.priority * 0.3;
        }
        break;

      case 'reputation':
        // Rating-based scoring
        const ratingScore = (company.rating / 5) * 0.6;
        score += weights.priority * ratingScore;

        // Verified badge adds to reputation
        if (company.verified) {
          score += weights.priority * 0.4;
        }
        break;

      default:
        score += weights.priority * 0.5;
    }
  }

  // 5. Verified Badge Bonus (10 points)
  if (company.verified) {
    score += weights.verified;
  }

  // 6. Rating Boost (additional modifier)
  // High ratings boost the final score
  const ratingMultiplier = 1 + ((company.rating - 3) / 10); // -0.2 to +0.2
  score = score * ratingMultiplier;

  // Ensure score is between 0 and 100
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Get match level label based on score
 * @param {number} score - Match score (0-100)
 * @returns {Object} Label and color information
 */
export function getMatchLevel(score) {
  if (score >= 85) {
    return {
      label: 'Excellent Match',
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800',
      emoji: '🔥'
    };
  } else if (score >= 70) {
    return {
      label: 'Great Match',
      color: 'blue',
      bgColor: 'bg-brand-blue-50 dark:bg-brand-blue-900/30',
      textColor: 'text-brand-blue-700 dark:text-brand-blue-400',
      borderColor: 'border-brand-blue-200 dark:border-brand-blue-700',
      emoji: '✨'
    };
  } else if (score >= 55) {
    return {
      label: 'Good Match',
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
      textColor: 'text-yellow-700 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      emoji: '👍'
    };
  } else {
    return {
      label: 'Fair Match',
      color: 'gray',
      bgColor: 'bg-slate-100 dark:bg-slate-700',
      textColor: 'text-slate-700 dark:text-slate-300',
      borderColor: 'border-slate-300 dark:border-slate-600',
      emoji: '💡'
    };
  }
}

/**
 * Sort companies by match score (highest first)
 * @param {Array} companies - Array of companies with match scores
 * @returns {Array} Sorted companies
 */
export function sortByMatchScore(companies) {
  return [...companies].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

/**
 * Get match explanation for why a company matched
 * @param {Object} userPreferences - User's quiz responses
 * @param {Object} company - Company data
 * @returns {Array} Array of reason strings
 */
export function getMatchReasons(userPreferences, company) {
  const reasons = [];

  if (!userPreferences || !company) return reasons;

  // Service type match
  if (userPreferences.serviceType && userPreferences.serviceType !== 'other') {
    const serviceTypeMap = {
      'communications': ['UCaaS', 'VoIP', 'Communications', 'Phone Systems'],
      'marketing': ['Marketing', 'Growth', 'CRM', 'Analytics'],
      'it-consulting': ['IT', 'Consulting', 'Technology', 'Software Development'],
      'hr': ['HR', 'Recruiting', 'Talent', 'Payroll'],
      'finance': ['Finance', 'Accounting', 'Payments', 'Invoicing']
    };

    const keywords = serviceTypeMap[userPreferences.serviceType] || [];
    const matchingServices = company.services?.filter(svc =>
      keywords.some(keyword => svc.toLowerCase().includes(keyword.toLowerCase()))
    ) || [];

    if (matchingServices.length > 0) {
      reasons.push(`Offers ${matchingServices[0]} services you need`);
    }
  }

  // Company size match
  if (userPreferences.companySize === company.companySize) {
    reasons.push(`Perfect size match for ${company.companySize} companies`);
  }

  // Priority match
  if (userPreferences.priority === 'reputation' && company.rating >= 4.5) {
    reasons.push(`High rating (${company.rating}/5.0)`);
  }

  if (userPreferences.priority === 'support' && company.verified) {
    reasons.push('Verified provider with reliable support');
  }

  // Verified bonus
  if (company.verified && reasons.length < 3) {
    reasons.push('Verified and trusted provider');
  }

  // Limit to top 3 reasons
  return reasons.slice(0, 3);
}
