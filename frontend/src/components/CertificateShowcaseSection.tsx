'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { s3Url } from '@/lib/s3Url';

const certificates = [
  {
    id: 'completion',
    title: 'Certificate of Completion',
    subtitle: 'Course Completion',
    image: s3Url('/images/SAMPLECourse.png'),
    description: 'Awarded to students who successfully completed a course at ADYAPAN. Certifies academic excellence, skill development, and career-oriented learning.',
    points: [
      'Validates successful programme completion',
      'Recognised by 150+ hiring partners',
      'Includes programme name, duration & domain',
      'Signed by Co-Founder with official seal',
      'Stands as a promise of growth and lifelong learning',
    ],
  },
  {
    id: 'internship',
    title: 'Certificate of Internship Completion',
    subtitle: 'Internship Completion',
    image: s3Url('/images/SAMPLEintern.png'),
    description: 'Awarded to interns who successfully complete their internship within the ADYAPAN framework by SR\'S ADYAPAN EDUTECH PVT. LTD.',
    points: [
      'Certifies real-world internship experience',
      'Includes internship role, domain & duration',
      'Demonstrates practical skill application',
      'Boosts job prospects and employability',
      'Stands as a promise of career readiness',
    ],
  },
  {
    id: 'project',
    title: 'Certificate of Project Completion',
    subtitle: 'Project Completion',
    image: s3Url('/images/SampleProject.png'),
    description: 'Awarded to students who successfully deliver a project within ADYAPAN. Certifies practical learning and project execution expertise.',
    points: [
      'Certifies successful project delivery',
      'Includes project name, timeline & domain',
      'Demonstrates hands-on execution skills',
      'Adds real portfolio value for employers',
      'Stands as a promise of practical expertise',
    ],
  },
  {
    id: 'achievement',
    title: 'Certificate of Achievement - Best Performance',
    subtitle: 'Best Performance',
    image: s3Url('/images/SAMPLEPerformer.png'),
    description: 'Awarded to top-performing students recognised as Best Performer at ADYAPAN. Certifies exceptional dedication, leadership, and outstanding results.',
    points: [
      'Recognises exceptional performance & leadership',
      'Highlights outstanding results in relevant domain',
      'Strengthens job and higher study applications',
      'Demonstrates exemplary dedication & commitment',
      'Awarded in recognition of exemplary contribution',
    ],
  },
];

function CertificateShowcaseSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#f5f0eb] py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Adyapan Schools</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1a1a2e] mt-2 mb-3">
            Work-Ready Certification
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
            Every milestone you achieve at Adyapan is recognised with an official, industry-respected certificate.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12 px-2">
          {certificates.map((cert, i) => (
            <button
              key={cert.id}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                active === i
                  ? 'text-white shadow-lg shadow-orange-200 bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-white text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-orange-300'
              }`}
            >
              {cert.subtitle}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Certificate image */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-orange-100 hover:-translate-y-1 transition-transform">
            <Image
              src={certificates[active].image}
              alt={certificates[active].title}
              width={800}
              height={566}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>

          {/* Text content */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-orange-600 bg-orange-100 border border-orange-200 mb-4">
              {certificates[active].subtitle}
            </span>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1a1a2e] mb-4 leading-tight break-words">
              {certificates[active].title}
            </h3>

            <p className="text-gray-500 text-base leading-relaxed mb-6">
              {certificates[active].description}
            </p>

            <ul className="space-y-3 mb-8">
              {certificates[active].points.map((point, j) => (
                <li key={j} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-gradient-to-r from-amber-500 to-orange-500">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            {/* Navigation dots */}
            <div className="flex items-center gap-2">
              {certificates.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="transition-all duration-200 rounded-full"
                  style={{
                    width: active === i ? 24 : 8,
                    height: 8,
                    background: active === i ? '#f97316' : '#d1d5db',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* All certificates thumbnail strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {certificates.map((cert, i) => (
            <button
              key={cert.id}
              onClick={() => setActive(i)}
              className="relative rounded-xl overflow-hidden shadow-md transition-all duration-200 group hover:-translate-y-1"
              style={{
                outline: active === i ? '3px solid #f97316' : '3px solid transparent',
                outlineOffset: 2,
              }}
            >
              <Image
                src={cert.image}
                alt={cert.subtitle}
                width={400}
                height={283}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className={`absolute inset-0 transition-colors ${
                active === i ? 'bg-orange-500/10' : 'bg-black/0 group-hover:bg-black/5'
              }`} />
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                <p className="text-white text-[10px] font-bold leading-tight">{cert.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default React.memo(CertificateShowcaseSection);
