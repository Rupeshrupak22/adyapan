'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

/* Data */
const STATS = [
  '50K+ Students',
  '100+ Courses',
  'AI Powered Learning',
  'Career Support',
  'Industry Mentors',
  'Live Projects',
  '100+ Hiring Partners',
  'Adyapan Certificates',
];

const SHAPES = [
  { type: 'dot',    x: '8%',  y: '18%', size: 8,  color: 'rgba(255,153,0,0.35)' },
  { type: 'ring',   x: '5%',  y: '55%', size: 14, color: 'rgba(255,153,0,0.3)'  },
  { type: 'plus',   x: '14%', y: '78%', size: 12, color: 'rgba(180,100,255,0.3)'},
  { type: 'dot',    x: '22%', y: '12%', size: 5,  color: 'rgba(255,153,0,0.25)' },
  { type: 'ring',   x: '88%', y: '20%', size: 12, color: 'rgba(180,100,255,0.3)'},
  { type: 'dot',    x: '92%', y: '50%', size: 8,  color: 'rgba(180,100,255,0.35)'},
  { type: 'plus',   x: '78%', y: '75%', size: 10, color: 'rgba(255,153,0,0.25)' },
  { type: 'dot',    x: '75%', y: '10%', size: 5,  color: 'rgba(255,153,0,0.2)'  },
  { type: 'ring',   x: '50%', y: '88%', size: 10, color: 'rgba(180,100,255,0.2)'},
  { type: 'dot',    x: '35%', y: '5%',  size: 4,  color: 'rgba(255,153,0,0.2)'  },
  { type: 'plus',   x: '60%', y: '15%', size: 8,  color: 'rgba(180,100,255,0.2)'},
];

/* Soft background blobs (static pre-blurred CSS gradients) */
const Blobs = React.memo(function Blobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute rounded-full"
        style={{
          width: 560, height: 560,
          top: '-20%', left: '-15%',
          background: 'radial-gradient(circle, rgba(255,180,80,0.18) 0%, rgba(255,140,40,0.06) 50%, transparent 75%)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 480, height: 480,
          bottom: '-15%', right: '-12%',
          background: 'radial-gradient(circle, rgba(180,130,255,0.14) 0%, rgba(140,90,240,0.04) 50%, transparent 75%)',
        }}
      />
    </div>
  );
});

/* Static scattered shapes */
const DecorShapes = React.memo(function DecorShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {SHAPES.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: s.x, top: s.y, opacity: 0.8 }}
        >
          {s.type === 'dot' && (
            <div style={{ width: s.size, height: s.size, borderRadius: '50%', background: s.color }} />
          )}
          {s.type === 'ring' && (
            <div style={{
              width: s.size, height: s.size, borderRadius: '50%',
              border: `2px solid ${s.color}`, background: 'transparent',
            }} />
          )}
          {s.type === 'plus' && (
            <svg width={s.size} height={s.size} viewBox="0 0 12 12">
              <line x1="6" y1="1" x2="6" y2="11" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
              <line x1="1" y1="6" x2="11" y2="6" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
});

/* Heading */
const Heading = React.memo(function Heading() {
  const shadow3dDark = [
    '0 1px 0 #888','0 2px 0 #777','0 3px 0 #666',
    '0 4px 0 #555','0 5px 0 #444',
    '0 8px 18px rgba(0,0,0,0.18)',
  ].join(', ');

  const shadow3dBig = [
    '0 1px 0 #999','0 2px 0 #888','0 3px 0 #777',
    '0 4px 0 #666','0 5px 0 #555','0 6px 0 #444',
    '0 10px 22px rgba(0,0,0,0.22)',
  ].join(', ');

  const shadow3dOrange = [
    '0 1px 0 #c06000','0 2px 0 #a85400','0 3px 0 #904800',
    '0 4px 0 #783c00',
    '0 8px 18px rgba(200,100,0,0.25)',
  ].join(', ');

  return (
    <div className="text-center mb-8 select-none w-full">
      <div>
        <div className="flex flex-wrap items-baseline justify-center gap-x-4 leading-tight">
          <span className="font-black" style={{
            fontSize: 'clamp(1.8rem, 4vw, 3.8rem)',
            letterSpacing: '-0.03em',
            color: '#1a1a2e',
            textShadow: shadow3dDark,
          }}>
            INDIA'S
          </span>
          <span className="font-black" style={{
            fontSize: 'clamp(1.8rem, 4vw, 3.8rem)',
            letterSpacing: '-0.03em',
            color: '#ff9900',
            textShadow: shadow3dOrange,
          }}>
            LARGEST
          </span>
        </div>

        <div className="relative flex justify-center leading-tight">
          <svg
            aria-hidden
            className="absolute pointer-events-none"
            style={{ bottom: '-2px', left: '50%', transform: 'translateX(-50%)', width: '55%', height: '10px' }}
            viewBox="0 0 400 10" preserveAspectRatio="none"
          >
            <path d="M 0 8 Q 200 0 400 8" fill="none" stroke="url(#arcGradLight)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <defs>
              <linearGradient id="arcGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="30%" stopColor="#ff9900" />
                <stop offset="70%" stopColor="#ffcc00" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-black" style={{
            fontSize: 'clamp(2.8rem, 7.5vw, 7rem)',
            letterSpacing: '-0.04em',
            color: '#1a1a2e',
            textShadow: shadow3dBig,
          }}>
            STUDENT
          </span>
        </div>

        <div className="leading-tight">
          <span className="font-black" style={{
            fontSize: 'clamp(1.8rem, 4.2vw, 4rem)',
            letterSpacing: '-0.03em',
            color: '#ff9900',
            textShadow: shadow3dOrange,
          }}>
            COMMUNITY
          </span>
        </div>
      </div>
    </div>
  );
});

/* Button */
function SimpleButton({
  children, variant = 'primary', href,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
}) {
  const router = useRouter();

  const isPrimary = variant === 'primary';

  return (
    <button
      style={isPrimary ? {
        background: 'linear-gradient(135deg, #ff9900 0%, #ffb733 50%, #ff8800 100%)',
        color: '#fff',
        boxShadow: '0 4px 24px rgba(255,153,0,0.4)',
      } : {
        background: '#ffffff',
        color: '#1a1a2e',
        border: '1.5px solid #e0d8d0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
      onClick={() => {
        if (href) {
          if (href.startsWith('http')) {
            window.open(href, '_blank', 'noopener,noreferrer');
          } else {
            router.push(href);
          }
        }
      }}
      className="relative overflow-hidden px-8 py-3.5 rounded-full font-black text-sm tracking-widest uppercase hover:scale-105 transition-transform"
    >
      {children}
    </button>
  );
}

/* Stats marquee — pauses when scrolled off-screen */
const StatsMarquee = React.memo(function StatsMarquee() {
  const items = useMemo(() => [...STATS, ...STATS], []);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        el.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative overflow-hidden py-3.5 my-10"
      style={{
        background: 'rgba(255,153,0,0.05)',
        borderTop: '1px solid rgba(255,153,0,0.15)',
        borderBottom: '1px solid rgba(255,153,0,0.15)',
      }}>
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #fdf8f3, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #fdf8f3, transparent)' }} />
      <div
        ref={trackRef}
        className="flex gap-10 whitespace-nowrap"
        style={{
          animation: 'stats-marquee 24s linear infinite',
          willChange: 'transform',
        }}
      >
        {items.map((s, i) => (
          <span key={i} className="flex items-center gap-3 text-xs font-black tracking-widest uppercase">
            <span style={{ color: i % 2 === 0 ? '#ff9900' : '#1a1a2e99' }}>{s}</span>
            <span style={{ color: 'rgba(255,153,0,0.4)' }}>|</span>
          </span>
        ))}
      </div>
    </div>
  );
});

function CommunityShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <>
      <style>{`
        @keyframes stats-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="community"
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fdf8f3 0%, #fef9f4 30%, #f8f4ff 65%, #fdf8f3 100%)',
        }}
      >
        <Blobs />
        <DecorShapes />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-6 text-center">

          {/* Badge */}
          <div className="flex justify-center mb-7">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase"
              style={{
                background: 'rgba(255,153,0,0.1)',
                border: '1px solid rgba(255,153,0,0.3)',
                color: '#cc7700',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: '#ff9900' }}
              />
              India's #1 Student Platform
            </span>
          </div>

          {/* Heading */}
          <Heading />

          {/* Subheading */}
          <p
            className="text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)' }}
          >
            Join thousands of students{' '}
            <span style={{ color: '#1a1a2e', fontWeight: 700 }}>building careers</span>,{' '}
            mastering skills, and becoming{' '}
            <span style={{ color: '#ff9900', fontWeight: 700 }}>industry-ready</span>{' '}
            with Adyapan.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <SimpleButton variant="primary" href="https://chat.whatsapp.com/Gh5rXLLOZQOElaF1uR6Tua">
              Join Community
            </SimpleButton>
            <SimpleButton variant="secondary" href="/programs">
              Explore Programs
            </SimpleButton>
          </div>
        </div>

        {/* Stats marquee */}
        <StatsMarquee />

        {/* Bottom accent line */}
        <div className="relative z-10 pb-16 flex justify-center">
          <div
            className="h-px w-48"
            style={{
              background: 'linear-gradient(90deg, transparent, #ff9900, transparent)',
              boxShadow: '0 0 12px rgba(255,153,0,0.4)',
            }}
          />
        </div>
      </section>
    </>
  );
}

export default React.memo(CommunityShowcaseSection);
