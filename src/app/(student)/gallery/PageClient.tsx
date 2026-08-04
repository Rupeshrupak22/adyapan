'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronRight as ArrowR } from 'lucide-react';

const MOMENTS = [
  { src: '/images/TECH-TEAM.jpeg',           alt: 'Team',        area: 'a' },
  { src: '/images/charanfoo.jpeg',     alt: 'Office Visit - Charan', area: 'c' },
  { src: '/images/jag.jpeg',           alt: 'Professional portrait', area: 'b' },
  { src: '/images/HR-team.jpeg',           alt: 'Team office visit', area: 'h' },
  { src: '/images/party.jpeg',           alt: 'Rup',         area: 'i' },
  { src: '/images/team.jpg',  alt: 'Teaching 1',  area: 'g' },
  { src: '/images/room-teaching.jpg', alt: 'Teaching 3',  area: 'd' },
  { src: '/images/Founders.jpeg', alt: 'Teaching 2',  area: 'e' },
  { src: '/images/cricket.jpg',        alt: 'Events',      area: 'f' },
];

const CARDS = [
  { src: '/images/charanfoo.jpeg',        label: 'OFFICE VISIT', bg: 'bg-amber-700',  col: '#b45309' },
  { src: '/images/TECH-TEAM.jpeg',       label: 'TECH TEAM',    bg: 'bg-slate-700',  col: '#334155' },
  { src: '/images/team.jpg',             label: 'TEAM',         bg: 'bg-sky-700',    col: '#0369a1' },
  { src: '/images/HR-team.jpeg',         label: 'HR TEAM',      bg: 'bg-red-600',    col: '#dc2626' },
  { src: '/images/room-teaching.jpg',     label: 'CLASSROOM',    bg: 'bg-green-700',  col: '#15803d' },
  { src: '/images/in-room-teaching01.jpg',label: 'HANDS-ON',     bg: 'bg-yellow-500', col: '#ca8a04' },
  { src: '/images/cricket.jpg',           label: 'EVENTS',       bg: 'bg-purple-700', col: '#7e22ce' },
  { src: '/images/party.jpeg',           label: 'PARTIES',      bg: 'bg-orange-600', col: '#ea580c' },
];

function Lightbox({ images, idx, onClose, onPrev, onNext }: any) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center" onClick={onClose}>
      <button onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:rotate-90 hover:scale-110 transition-all">
        <X className="w-4 h-4" />
      </button>
      <button onClick={e => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#ffa800]/40 transition-colors">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <img src={images[idx].src} alt={images[idx].alt}
        className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()} />
      <button onClick={e => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#ffa800]/40 transition-colors">
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

export default function GalleryPageClient() {
  const [lightbox, setLightbox] = useState<{ open: boolean; idx: number; list: any[] }>({ open: false, idx: 0, list: [] });

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (!lightbox.open) return;
      if (e.key === 'Escape') setLightbox(p => ({ ...p, open: false }));
      if (e.key === 'ArrowLeft') setLightbox(p => ({ ...p, idx: (p.idx - 1 + p.list.length) % p.list.length }));
      if (e.key === 'ArrowRight') setLightbox(p => ({ ...p, idx: (p.idx + 1) % p.list.length }));
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [lightbox]);

  const openAt = (list: any[], idx: number) => setLightbox({ open: true, idx, list });

  return (
    <main className="min-h-screen bg-[#fafafa] font-sans selection:bg-[#ffa800] selection:text-white">
      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#ffa800]/20 text-[#ffa800] border border-[#ffa800]/30 mb-6">
            Life at Adyapan
          </span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight">
            Moments That <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffa800] to-[#ff6b00]">Define Us</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From interactive classrooms to team celebrations, explore life behind the scenes at Adyapan Edutech.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOMENTS.map((item, i) => (
            <div
              key={i}
              onClick={() => openAt(MOMENTS, i)}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <p className="text-white font-bold text-sm">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Cards Section */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Explore by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CARDS.map((card, i) => (
              <div
                key={i}
                onClick={() => openAt(CARDS, i)}
                className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:-translate-y-1 transition-all"
              >
                <Image
                  src={card.src}
                  alt={card.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center p-4">
                  <span className="text-white font-black text-sm tracking-wider uppercase text-center border-b-2 border-[#ffa800] pb-1">
                    {card.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox.open && (
        <Lightbox
          images={lightbox.list}
          idx={lightbox.idx}
          onClose={() => setLightbox(p => ({ ...p, open: false }))}
          onPrev={() => setLightbox(p => ({ ...p, idx: (p.idx - 1 + p.list.length) % p.list.length }))}
          onNext={() => setLightbox(p => ({ ...p, idx: (p.idx + 1) % p.list.length }))}
        />
      )}
    </main>
  );
}
