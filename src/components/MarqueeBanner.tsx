'use client';

import React, { useRef, useEffect, useState } from 'react';

/* Types */
interface MarqueeBannerProps {
  text?: string;
  speed?: number;
  variant?: 'dark' | 'orange' | 'glass';
}

const Separator = React.memo(function Separator() {
  return (
    <span
      aria-hidden="true"
      className="mx-6 text-[#ffa800] opacity-80 select-none"
      style={{ fontSize: 'inherit', lineHeight: 1 }}
    >
      &#10022;
    </span>
  );
});

const MarqueeTrack = React.memo(function MarqueeTrack({
  text,
  speed,
  variant,
  isPaused,
}: {
  text: string;
  speed: number;
  variant: 'dark' | 'orange' | 'glass';
  isPaused: boolean;
}) {
  const REPEAT = 8;
  const items = Array.from({ length: REPEAT }, (_, i) => i);

  const textStyle: React.CSSProperties =
    variant === 'orange'
      ? {
          background: 'linear-gradient(90deg, #fff 0%, #ffe0a0 40%, #ffa800 70%, #fff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }
      : {
          background: 'linear-gradient(90deg, #ffffff 0%, #ffe0a0 45%, #ffa800 75%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        };

  return (
    <div className="overflow-hidden w-full">
      <div
        className="marquee-track flex items-center whitespace-nowrap"
        style={{
          width: 'max-content',
          animation: `marquee-scroll ${speed}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {items.map((i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className="text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase tracking-[0.18em] select-none"
              style={textStyle}
            >
              {text}
            </span>
            <Separator />
          </span>
        ))}
      </div>
    </div>
  );
});

function getBgStyle(variant: 'dark' | 'orange' | 'glass'): React.CSSProperties {
  if (variant === 'orange') {
    return {
      background: 'linear-gradient(135deg, #ff8c00 0%, #ffa800 40%, #ff6b00 100%)',
      borderTop: '1px solid rgba(255,255,255,0.15)',
      borderBottom: '1px solid rgba(255,255,255,0.15)',
    };
  }
  if (variant === 'glass') {
    return {
      background: 'rgba(26, 26, 46, 0.82)',
      borderTop: '1px solid rgba(255,168,0,0.25)',
      borderBottom: '1px solid rgba(255,168,0,0.25)',
    };
  }
  return {
    background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #0d0d1a 100%)',
    borderTop: '1px solid rgba(255,168,0,0.2)',
    borderBottom: '1px solid rgba(255,168,0,0.2)',
  };
}

function MarqueeBanner({
  text = "INDIA'S LARGEST STUDENT COMMUNITY",
  speed = 30,
  variant = 'dark',
}: MarqueeBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPaused(!entry.isIntersecting || document.hidden);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    const handleVisibility = () => {
      if (document.hidden) setIsPaused(true);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes marquee-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation-play-state: paused !important;
          }
        }
      `}</style>
      <div
        ref={containerRef}
        role="marquee"
        aria-label={text}
        className="marquee-wrapper relative w-full overflow-hidden py-3 sm:py-3.5 md:py-4"
        style={{
          ...getBgStyle(variant),
          boxShadow:
            variant === 'dark' || variant === 'glass'
              ? '0 0 24px 0 rgba(255,168,0,0.12), inset 0 1px 0 rgba(255,168,0,0.08)'
              : '0 4px 24px 0 rgba(255,140,0,0.35)',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10"
          style={{
            background:
              variant === 'orange'
                ? 'linear-gradient(90deg, #ff8c00, transparent)'
                : variant === 'glass'
                ? 'linear-gradient(90deg, rgba(13,13,26,0.9), transparent)'
                : 'linear-gradient(90deg, #0d0d1a, transparent)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10"
          style={{
            background:
              variant === 'orange'
                ? 'linear-gradient(270deg, #ff6b00, transparent)'
                : variant === 'glass'
                ? 'linear-gradient(270deg, rgba(13,13,26,0.9), transparent)'
                : 'linear-gradient(270deg, #0d0d1a, transparent)',
          }}
        />

        <MarqueeTrack text={text} speed={speed} variant={variant} isPaused={isPaused} />
      </div>
    </>
  );
}

export default React.memo(MarqueeBanner);
