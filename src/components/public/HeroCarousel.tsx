import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroSlide } from '../../lib/types';

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const displaySlides = slides.length > 0 ? slides : [];

  useEffect(() => {
    if (displaySlides.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [displaySlides.length, isPaused]);

  if (displaySlides.length === 0) return null;

  const currentSlide = displaySlides[currentIndex] || displaySlides[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  };

  return (
    <section
      className="bg-gradient-to-b from-primary-light/40 via-white to-surface px-4 pt-6 pb-10 border-b border-border-subtle overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-border-medium/60 shadow-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-[12px] font-bold text-primary tracking-wide uppercase">
            {currentSlide.badgeText || 'Learn. Build. Create. Grow.'}
          </span>
        </div>

        {/* Carousel Headline & Subtitle */}
        <div className="min-h-[120px] sm:min-h-[140px] flex flex-col justify-center transition-all duration-300">
          <h1 className="font-heading font-extrabold text-[28px] sm:text-[38px] md:text-[44px] leading-[34px] sm:leading-[46px] md:leading-[52px] tracking-tight text-on-surface">
            {currentSlide.title}
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-3 max-w-2xl leading-relaxed mx-auto">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-row items-center justify-center gap-3 pt-4 w-full max-w-md">
          {currentSlide.ctaLink.startsWith('#') ? (
            <a
              href={currentSlide.ctaLink}
              className="flex-1 h-12 px-6 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <span>{currentSlide.ctaText || 'Explore Courses'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          ) : (
            <Link
              to={currentSlide.ctaLink}
              className="flex-1 h-12 px-6 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <span>{currentSlide.ctaText || 'Explore Courses'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          )}

          {currentSlide.secondaryCtaText && (
            currentSlide.secondaryCtaLink?.startsWith('#') ? (
              <a
                href={currentSlide.secondaryCtaLink}
                className="flex-1 h-12 px-6 rounded-full bg-white hover:bg-surface-subtle text-primary border border-primary/30 font-semibold text-xs sm:text-sm flex items-center justify-center active:scale-95 transition-all shadow-xs"
              >
                <span>{currentSlide.secondaryCtaText}</span>
              </a>
            ) : (
              <Link
                to={currentSlide.secondaryCtaLink || '/contact'}
                className="flex-1 h-12 px-6 rounded-full bg-white hover:bg-surface-subtle text-primary border border-primary/30 font-semibold text-xs sm:text-sm flex items-center justify-center active:scale-95 transition-all shadow-xs"
              >
                <span>{currentSlide.secondaryCtaText}</span>
              </Link>
            )
          )}
        </div>

        {/* Carousel Pagination & Controls */}
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="w-8 h-8 rounded-full border border-border-medium hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          <div className="flex items-center gap-2">
            {displaySlides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-7 h-2 rounded-full bg-secondary'
                    : 'w-2 h-2 rounded-full bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="w-8 h-8 rounded-full border border-border-medium hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        {/* Institute Visual Showcase Card */}
        <div className="w-full max-w-3xl mt-8 rounded-2xl overflow-hidden border border-border-subtle shadow-md bg-white relative">
          <img
            src={currentSlide.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuByluUiQUyemMe5OdVxt8WQXfkbbyJLvEC2NjWEG10aqNLhU3BQ9duZeEPv-XYkLp9MjjNjQ3pEvIQ0vFPAUdDeQMTcQwkjoSQqqXEJyV3jbz4I9OnhHGnqcv8FUnqPNdwIICRCOTkWNrluaed_CndAHKMHGc4spEghJmuJsZ5onj-tSMNZHK1YW9gqs0dgMEvehUD8C7QAwZyrtxbZvgL3MLpF7f8FlpN1hGEu2x6TScIG67ha03IhNQ'}
            alt="NAVIORAA Institute of Technology Learning Hub"
            className="w-full h-48 sm:h-64 object-cover"
          />
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-border-subtle flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </span>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-on-surface">Practical Learning & Project Incubator</p>
                <p className="text-[11px] text-text-muted">100% Hands-On Mentored Engineering Sprints</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-secondary bg-secondary-soft px-3 py-1 rounded-full">
              Active Labs
            </span>
          </div>
        </div>

        {/* 3 Highlight Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mt-4">
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-primary text-[22px]">terminal</span>
            <span className="font-bold text-xs text-on-surface mt-1">100% Practical</span>
            <span className="text-[11px] text-text-muted">Live Code Drills & Terminal Labs</span>
          </div>
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-secondary text-[22px]">diversity_3</span>
            <span className="font-bold text-xs text-on-surface mt-1">1:1 Mentorship</span>
            <span className="text-[11px] text-text-muted">Senior Tech Leads & Code Reviews</span>
          </div>
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-primary text-[22px]">workspace_premium</span>
            <span className="font-bold text-xs text-on-surface mt-1">Real Projects</span>
            <span className="text-[11px] text-text-muted">Production Portfolios & GitHub Proof</span>
          </div>
        </div>
      </div>
    </section>
  );
};
