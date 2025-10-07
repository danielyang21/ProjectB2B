import { useState, useEffect } from 'react';
import { getMatchLevel } from '../utils/aiMatcher';

function SwipeCard({ company, onSwipe, style, zIndex, showMatchPercentage = true, triggerSwipe = null }) {
  const matchLevel = getMatchLevel(company.matchScore || 0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSwipingAway, setIsSwipingAway] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Handle button-triggered swipes
  useEffect(() => {
    if (triggerSwipe) {
      setSwipeDirection(triggerSwipe);
      setIsSwipingAway(true);

      setTimeout(() => {
        onSwipe(triggerSwipe);
      }, 300);
    }
  }, [triggerSwipe, onSwipe]);

  const handleDragStart = (clientX, clientY) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX, clientY) => {
    if (!isDragging) return;

    const offset = {
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    };

    // Apply elastic resistance when dragging beyond threshold
    const maxDrag = 300;
    const resistance = 0.5;

    if (Math.abs(offset.x) > maxDrag) {
      const excess = Math.abs(offset.x) - maxDrag;
      const sign = offset.x > 0 ? 1 : -1;
      offset.x = sign * (maxDrag + excess * resistance);
    }

    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    const swipeThreshold = 100;
    if (Math.abs(dragOffset.x) > swipeThreshold) {
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      setSwipeDirection(direction);
      setIsSwipingAway(true);

      // Wait for animation to complete before calling onSwipe
      setTimeout(() => {
        onSwipe(direction);
      }, 300);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse events
  const handleMouseDown = (e) => {
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const rotation = dragOffset.x * 0.1;
  const opacity = 1 - Math.abs(dragOffset.x) / 300;

  // Calculate flyaway position if swiping away
  const flyawayX = isSwipingAway ? (swipeDirection === 'right' ? 1000 : -1000) : dragOffset.x;
  const flyawayRotation = isSwipingAway ? (swipeDirection === 'right' ? 30 : -30) : rotation;

  const cardStyle = {
    ...style,
    transform: `translate(${flyawayX}px, ${dragOffset.y}px) rotate(${flyawayRotation}deg)`,
    opacity: isSwipingAway ? 0 : (isDragging ? opacity : 1),
    transition: isSwipingAway ? 'all 0.3s cubic-bezier(0.4, 0, 1, 1)' : (isDragging ? 'none' : 'all 0.3s ease'),
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex
  };

  const showLikeOverlay = dragOffset.x > 50;
  const showPassOverlay = dragOffset.x < -50;

  return (
    <div
      className="absolute inset-0 select-none"
      style={cardStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full h-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 relative">
        {/* Like/Pass Overlays - Glassmorphism Style */}
        {showLikeOverlay && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="backdrop-blur-xl bg-green-500/20 dark:bg-green-400/20 border-4 border-green-500/60 dark:border-green-400/60 rounded-3xl px-12 py-6 rotate-12 shadow-2xl">
              <div className="flex items-center gap-3">
                <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-5xl font-bold text-green-600 dark:text-green-400">LIKE</span>
              </div>
            </div>
          </div>
        )}
        {showPassOverlay && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="backdrop-blur-xl bg-red-500/20 dark:bg-red-400/20 border-4 border-red-500/60 dark:border-red-400/60 rounded-3xl px-12 py-6 -rotate-12 shadow-2xl">
              <div className="flex items-center gap-3">
                <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-5xl font-bold text-red-600 dark:text-red-400">PASS</span>
              </div>
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className="h-full flex flex-col p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                {company.companyName}
              </h2>
              <div className="flex flex-col gap-2 items-end">
                {/* Match Score Badge - shown when AI matching or quiz-based */}
                {showMatchPercentage && company.matchScore !== undefined && (
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${matchLevel.bgColor} ${matchLevel.textColor} border ${matchLevel.borderColor}`}>
                    <span className="mr-1">{matchLevel.emoji}</span>
                    <span>{company.matchScore}% Match</span>
                  </div>
                )}
                {company.verified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 mb-3">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="font-semibold">{company.rating}</span>
              </span>
              <span>•</span>
              <span>{company.location}</span>
              <span>•</span>
              <span>{company.companySize}</span>
            </div>

            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              {company.description}
            </p>

            {/* AI Match Reason */}
            {company.matchReason && (
              <div className="mt-4 p-3 bg-brand-blue-50 dark:bg-brand-blue-900/20 border border-brand-blue-200 dark:border-brand-blue-800 rounded-lg">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-brand-blue-700 dark:text-brand-blue-400">Why this match: </span>
                  {company.matchReason}
                </p>
              </div>
            )}
          </div>

          {/* Services */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase mb-3">
              Services
            </h3>
            <div className="flex flex-wrap gap-2">
              {company.services?.map((service, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-blue-50 dark:bg-brand-blue-900/30 text-brand-blue-700 dark:text-brand-blue-300 border border-brand-blue-200 dark:border-brand-blue-700"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Company Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
                Industry
              </h3>
              <p className="text-slate-900 dark:text-white">{company.industry}</p>
            </div>
            {company.founded && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
                  Founded
                </h3>
                <p className="text-slate-900 dark:text-white">{company.founded}</p>
              </div>
            )}
            {company.employees && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
                  Employees
                </h3>
                <p className="text-slate-900 dark:text-white">{company.employees}</p>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-3">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue-600 dark:text-brand-blue-400 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  🌐 Website
                </a>
              )}
              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="text-brand-blue-600 dark:text-brand-blue-400 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  ✉️ Email
                </a>
              )}
              {company.linkedin && (
                <a
                  href={company.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue-600 dark:text-brand-blue-400 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  💼 LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwipeCard;
