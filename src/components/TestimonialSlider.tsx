import React, { useState, useEffect } from 'react';
import { SEED_TESTIMONIALS } from '../lib/supabase';
import { ironAudio } from '../lib/ironAudio';
import { Star, ChevronLeft, ChevronRight, Quote, Flame, ShieldCheck } from 'lucide-react';

export const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = SEED_TESTIMONIALS;

  const nextSlide = () => {
    ironAudio.playClick();
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    ironAudio.playClick();
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="relative py-28 bg-iron-900 border-t border-iron-800 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Flame className="w-3.5 h-3.5" />
            <span>ATHLETE REPUTATION & RESULTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-white mb-4">
            TESTED BY TITANS
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Verified transformations from executive leaders, competitive powerlifters, and longevity enthusiasts who train under the IRONVEX banner.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative max-w-4xl mx-auto bg-iron-950 rounded-3xl border border-gold-500/30 shadow-2xl shadow-gold-500/10 p-8 sm:p-12 overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Testimonial Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 animate-fadeIn key={current.id}">
            {/* Member Avatar */}
            <div className="shrink-0 relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-gold-500/60 shadow-xl relative">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-gradient-gold text-black p-2 rounded-xl shadow-gold-glow">
                <Quote className="w-4 h-4" />
              </div>
            </div>

            {/* Quote & Credentials */}
            <div className="space-y-4 text-center md:text-left flex-1">
              {/* Stars */}
              <div className="flex items-center justify-center md:justify-start space-x-1 text-gold-400">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400" />
                ))}
                <span className="text-xs font-mono text-gray-400 ml-2">5.0 Verified Athlete</span>
              </div>

              {/* Transformation Pill */}
              <div className="inline-block bg-gold-500/15 border border-gold-500/40 text-gold-300 text-xs font-mono px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                ⚡ Result: {current.transformation}
              </div>

              {/* Quote text */}
              <blockquote className="text-base sm:text-lg text-gray-200 italic font-serif leading-relaxed">
                "{current.quote}"
              </blockquote>

              {/* Author */}
              <div className="pt-2 border-t border-iron-800">
                <h4 className="font-heading font-black text-lg text-white">{current.name}</h4>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs text-gray-400 font-mono mt-0.5">
                  <span className="text-gold-400">{current.role}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{current.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mt-8 pt-6 border-t border-iron-800 flex items-center justify-between">
            {/* Slide Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    ironAudio.playClick();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === idx
                      ? 'w-8 bg-gradient-gold shadow-gold-glow'
                      : 'w-2 bg-iron-800 hover:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={prevSlide}
                className="p-2.5 rounded-xl bg-iron-900 border border-iron-700 text-gray-300 hover:text-gold-400 hover:border-gold-500 transition-all active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="p-2.5 rounded-xl bg-iron-900 border border-iron-700 text-gray-300 hover:text-gold-400 hover:border-gold-500 transition-all active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
