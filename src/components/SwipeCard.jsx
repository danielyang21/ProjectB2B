import { useState } from 'react';

function SwipeCard({ company, onSwipe, style, zIndex }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    const swipeThreshold = 100;
    if (Math.abs(dragOffset.x) > swipeThreshold) {
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    }

    setDragOffset({ x: 0, y: 0 });
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

  const cardStyle = {
    ...style,
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
    opacity: isDragging ? opacity : 1,
    transition: isDragging ? 'none' : 'all 0.3s ease',
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
        {/* Like/Pass Overlays */}
        {showLikeOverlay && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center z-10">
            <div className="text-6xl font-bold text-green-600 border-8 border-green-600 rounded-2xl px-8 py-4 rotate-12">
              LIKE
            </div>
          </div>
        )}
        {showPassOverlay && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center z-10">
            <div className="text-6xl font-bold text-red-600 border-8 border-red-600 rounded-2xl px-8 py-4 -rotate-12">
              PASS
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
              {company.verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                  ✓ Verified
                </span>
              )}
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
