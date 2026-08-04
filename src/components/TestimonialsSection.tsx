'use client';

import React from 'react';

const testimonials = [
  {
    initials: 'RR',
    name: 'Rupesh Rupak',
    role: 'Full stack Developer',
    company: 'Razorpay',
    tag: 'Web Development',
    quote:
      'The Career GPS showed me exactly what I was missing. Within 3 months of following the roadmap and completing marketplace tasks, I had my first real job offer.',
  },
  {
    initials: 'RA',
    name: 'Rukhsana Azami',
    role: 'Data Analyst',
    company: 'Swiggy',
    tag: 'Data Science',
    quote:
      'The skills assessment was eye-opening. I thought I knew Python, but the gap analysis showed me I was missing SQL and visualization. Fixed those gaps and landed the role.',
  },
  {
    initials: 'KR',
    name: 'Kavya Reddy',
    role: 'Growth Marketer',
    company: 'Zepto',
    tag: 'Digital Marketing',
    quote:
      'I completed 4 marketplace tasks for a D2C brand. They liked my work so much, they offered me a full-time position. The platform literally created my career.',
  },
  {
    initials: 'RV',
    name: 'Rohan Verma',
    role: 'UX Designer',
    company: 'Meesho',
    tag: 'Design',
    quote:
      'The verified credentials gave me proof beyond certificates. Employers could see my actual project work, not just a badge. That made all the difference.',
  },
];

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="bg-[#f5f0eb] py-16 sm:py-20 px-4 sm:px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* Left Sidebar */}
          <div className="lg:sticky lg:top-20 mb-8 lg:mb-0 flex flex-col justify-between min-h-[700px]">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1a1a2e] mb-6 lg:mb-8 leading-tight">
                What Our<br />Students<br />Say
              </h2>

              <p className="text-lg text-[#666] mb-10 leading-relaxed">
                Our results speak better than words.
              </p>
            </div>

            {/* Full Blend Image */}
            <div className="relative flex-1 flex items-end justify-center lg:justify-start">
              <img
                src="/images/Homereview.png"
                alt="Adyapan Character"
                loading="lazy"
                decoding="async"
                className="w-full max-w-sm lg:max-w-md object-contain mix-blend-multiply opacity-95"
              />
            </div>
          </div>

          {/* Right Testimonials Stack */}
          <div className="lg:col-span-2 space-y-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border-l-4 border-[#ff9900] cursor-default shadow-sm hover:translate-x-1 transition-transform"
              >
                {/* Quote */}
                <p className="text-[#1a1a2e] text-base leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: '#00c9a7' }}
                  >
                    {t.initials}
                  </div>

                  <div className="flex-1">
                    <div className="font-bold text-[#1a1a2e] text-sm">
                      {t.name}
                    </div>

                    <div className="text-xs text-[#666]">
                      {t.role} at {t.company}
                    </div>

                    <div
                      className="text-xs font-semibold mt-1"
                      style={{ color: '#00c9a7' }}
                    >
                      {t.tag}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <p className="text-[#999] text-sm pt-4">
              and many more....
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(TestimonialsSection);
