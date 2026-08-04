'use client';

import React from 'react';

const features = [
  {
    icon: '',
    title: 'Verified Skills',
    description: 'Every skill you earn is blockchain-verified and trusted by top companies',
  },
  {
    icon: '',
    title: 'Real Projects',
    description: 'Work on actual business tasks from companies and build your portfolio',
  },
  {
    icon: '',
    title: 'Direct Placement',
    description: 'Top performers get flagged for full-time interviews by the same companies',
  },
];

const WhyAdyapanSection = () => {
  return (
    <section className="bg-[#f5f0eb] py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#1a1a2e] mb-6 leading-tight">
              Where India's Students
              <br />
              <span style={{ color: '#ff9900' }}>Learn Skills, Earn Income</span>
              <br />
              & Get Hired<span style={{ color: '#ff9900' }}>.</span>
            </h2>

            <p className="text-lg text-[#666] mb-8 leading-relaxed">
              The modern job market demands more than a degree. Adyapan gives you verified skills, real project experience, and a direct path to employment.
            </p>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-[#ff9900] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-lg">{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1a2e] text-lg mb-1">{feature.title}</h3>
                    <p className="text-[#666] text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            {/* Stats Badge */}
            <div className="absolute top-6 right-6 bg-[#c8e6c9] rounded-2xl px-6 py-3 z-10">
              <div className="flex gap-8">
                <div>
                  <div className="font-extrabold text-[#1a1a2e] text-xl">20K</div>
                  <div className="text-xs text-[#666] font-semibold">ACTIVE LEARNERS</div>
                </div>
                <div>
                  <div className="font-extrabold text-[#1a1a2e] text-xl">250+</div>
                  <div className="text-xs text-[#666] font-semibold">PARTNER COMPANIES</div>
                </div>
              </div>
            </div>

            {/* Main Video */}
            <div
              className="rounded-3xl overflow-hidden shadow-2xl relative w-full hover:-translate-y-1 transition-transform"
              style={{ paddingBottom: '56.25%', height: 0 }}
            >
              <iframe
                src="https://player.vimeo.com/video/1184352906"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                }}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(WhyAdyapanSection);
