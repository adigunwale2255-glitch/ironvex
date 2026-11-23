import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { SEED_GALLERY } from '../lib/supabase';
import { ironAudio } from '../lib/ironAudio';
import { Maximize2, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export const FitnessGallery: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'facilities' | 'olympic' | 'cardio' | 'spa'>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const filteredItems = React.useMemo(() => {
    if (filter === 'all') return SEED_GALLERY;
    return SEED_GALLERY.filter(item => item.category === filter);
  }, [filter]);

  const openLightbox = (index: number) => {
    ironAudio.playClick();
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    ironAudio.playClick(600);
    setActiveLightboxIndex(null);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    ironAudio.playClick(900);
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => 
        prev! === 0 ? filteredItems.length - 1 : prev! - 1
      );
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    ironAudio.playClick(900);
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => 
        prev! === filteredItems.length - 1 ? 0 : prev! + 1
      );
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  return (
    <section id="gallery" className="relative py-28 bg-iron-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL & APPARATUS SHOWCASE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-white mb-4">
            SANCTUARY OF IRON & RECOVERY
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Explore our competition-spec hardwood platforms, custom machined plate sets, cardio theater, and biometric hydrotherapy suites.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'All Arenas' },
              { id: 'facilities', label: 'Cast Iron & Turf' },
              { id: 'olympic', label: 'Olympic Platforms' },
              { id: 'cardio', label: 'Cardio Deck' },
              { id: 'spa', label: 'Hydro & Recovery' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  ironAudio.playClick();
                  setFilter(tab.id as any);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                  filter === tab.id
                    ? 'bg-gradient-gold text-black font-bold shadow-gold-glow'
                    : 'bg-iron-900 text-gray-400 hover:text-white border border-iron-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-2xl overflow-hidden bg-iron-900 border border-iron-800 hover:border-gold-500/60 transition-all duration-500 cursor-pointer shadow-lg aspect-4/3"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

              {/* Hover Badge */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-gold-500/40 flex items-center justify-center text-gold-400 opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Title & Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 bg-black/60 px-2 py-0.5 rounded border border-gold-500/30">
                  {item.category}
                </span>
                <h3 className="text-base sm:text-lg font-heading font-bold text-white mt-2 group-hover:text-gold-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {activeLightboxIndex !== null && filteredItems[activeLightboxIndex] && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 animate-fadeIn"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-full bg-iron-900/80 border border-iron-700 transition-colors z-50"
            aria-label="Close image viewer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation controls */}
          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 text-gold-400 hover:text-white p-3 rounded-full bg-iron-900/80 border border-gold-500/30 hover:border-gold-400 transition-all z-50 active:scale-90"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 text-gold-400 hover:text-white p-3 rounded-full bg-iron-900/80 border border-gold-500/30 hover:border-gold-400 transition-all z-50 active:scale-90"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Description Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center bg-iron-950 border border-gold-500/40 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="relative w-full overflow-hidden flex items-center justify-center bg-black">
              <img
                src={filteredItems[activeLightboxIndex].url}
                alt={filteredItems[activeLightboxIndex].title}
                className="max-h-[68vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="w-full p-4 sm:p-6 bg-iron-900/95 border-t border-iron-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">
                  {filteredItems[activeLightboxIndex].category} • {activeLightboxIndex + 1} of {filteredItems.length}
                </span>
                <h4 className="text-lg font-heading font-bold text-white">
                  {filteredItems[activeLightboxIndex].title}
                </h4>
                <p className="text-xs text-gray-300 mt-1 max-w-2xl">
                  {filteredItems[activeLightboxIndex].caption}
                </p>
              </div>

              <div className="text-xs font-mono text-gray-400">
                Use <kbd className="px-1.5 py-0.5 bg-iron-800 rounded text-gold-400 border border-iron-700">←</kbd> <kbd className="px-1.5 py-0.5 bg-iron-800 rounded text-gold-400 border border-iron-700">→</kbd> to navigate
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
