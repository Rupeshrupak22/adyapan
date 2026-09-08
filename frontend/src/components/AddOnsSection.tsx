'use client';

import React from 'react';

const addOns = [
  {
    number: '01',
    icon: '',
    title: 'Access to top company networks and collaborations.',
  },
  {
    number: '02',
    icon: '',
    title: 'Real industry insights you won\'t find in textbooks.',
  },
  {
    number: '03',
    icon: '',
    title: 'Become placement-ready with our training, backed by lifetime job support.',
  },
  {
    number: '04',
    icon: '',
    title: 'Mock interviews & resume-building workshops.',
  },
  {
    number: '05',
    icon: '',
    title: '6-month content access - lifetime career impact.',
  },
];

const AddOnsSection = () => {
  return (
    <section className="bg-[#f5f0eb] py-20 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 border-4 border-[#8b4513]/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-[#8b4513]/10 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header with Logo */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-16 h-16 rounded-full bg-[#ff9900] flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-[#5a1a00]">ady.</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-[#1a1a2e]">
            Add-Ons Along the<br />Way
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {addOns.map((addon, i) => (
            <div
              key={i}
              className="bg-[#ff9900] rounded-3xl p-6 flex flex-col justify-between min-h-[240px] cursor-default shadow-md hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="text-3xl mb-3">{addon.icon}</div>
                <div className="text-5xl font-extrabold text-white/30 mb-4">
                  {addon.number}
                </div>
                <p className="text-white font-semibold text-base leading-relaxed">
                  {addon.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(AddOnsSection);
