'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ALL_PROGRAMS } from '@/lib/courseData';
import { Search, X } from 'lucide-react';

const programs = [
  {
    title: 'CSE / IT DOMAINS',
    count: '26 COURSES',
    color: '#ff9900',
    courses: [
      'Artificial Intelligence',
      'AI Engineering',
      'Generative AI',
      'Machine Learning',
      'Data Science',
      'Data Engineering',
      'Data Analytics',
      'Database Management (DBMS)',
      'Data Structures & Algorithms',
      'Web Development',
      'Web 3.0',
      'App Development',
      'Python Full Stack',
      'Python programming curriculum',
      'Java Programming',
      'Java Full Stack',
      'Selenium Testing with Java',
      'DevOps Engineering',
      'Cloud Computing',
      'AWS',
      'Cyber Security',
      'Blockchain & Bitcoin',
      'AR/VR Development',
      'UI/UX Design',
      'Graphic Design',
      'VFX',
    ],
  },
  {
    title: 'MANAGEMENT & COMMERCE',
    count: '15 COURSES',
    color: '#ff9900',
    courses: [
      'Finance',
      'Investment Banking',
      'Business Analytics',
      'Marketing Management',
      'Digital Marketing & Growth Strategy',
      'Social Media Marketing',
      'HRM',
      'Management Consultancy',
      'Supply Chain Management',
      'SAP FICA',
      'Salesforce',
      'Stock Marketing',
      'ACCA F4 (Business & Corporate Law)',
      'Chartered Accountancy / CFA',
      'Spoken English & Communication',
    ],
  },
  {
    title: 'ECE DOMAINS',
    count: '5 COURSES',
    color: '#ff9900',
    courses: [
      'Embedded Systems',
      'Hybrid & Electric Vehicle',
      'VLSI',
      'IoT & Robotics',
      'Power Systems',
    ],
  },
  {
    title: 'ECONOMICS',
    count: '4 COURSES',
    color: '#ff9900',
    courses: [
      'Business & Financial Economics',
      'Investment Analysis',
      'Data Analysis for Economics',
      'Financial Economics',
    ],
  },
  {
    title: 'MECHANICAL ENGINEERING',
    count: '4 COURSES',
    color: '#ff9900',
    courses: [
      'AutoCAD',
      'CATIA',
      'Car Design',
      'Quality & Safety Professionals',
    ],
  },
  {
    title: 'BIO & LIFE SCIENCES',
    count: '10 COURSES',
    color: '#ff9900',
    courses: [
      'Bioinformatics',
      'Microbiology',
      'Molecular Biology',
      'Genetic Engineering',
      'Pharmacovigilance',
      'Nano Technology',
      'Food Science & Technology',
      'Nutrition & Health Management',
      'Sensory Science',
      'Medical Coding',
    ],
  },
  {
    title: 'CIVIL ENGINEERING',
    count: '1 COURSE',
    color: '#ff9900',
    courses: [
      'Construction Planning',
    ],
  },
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const courseSlugByTitle = new Map(
  ALL_PROGRAMS.map((course) => [normalize(course.title), course.slug])
);

function getCourseHref(courseTitle: string) {
  const slug = courseSlugByTitle.get(normalize(courseTitle));
  return slug ? `/courses/${slug}` : '/programs';
}

export default function ProgramsPageClient() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrograms = searchQuery.trim()
    ? programs
        .map((program) => ({
          ...program,
          courses: program.courses.filter((course) =>
            course.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((program) => program.courses.length > 0)
    : programs;

  return (
    <section className="bg-[#1a1a2e] min-h-screen py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            All Programs
          </h1>
          <p className="text-base sm:text-lg text-gray-400 mb-8">
            Explore our comprehensive range of courses across multiple domains
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffa800] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {filteredPrograms.length === 0 && (
          <p className="text-center text-gray-400 text-lg">
            No courses found for &quot;{searchQuery}&quot;
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredPrograms.map((program, i) => (
            <div
              key={program.title}40`, transition: { duration: 0.3 } }}
              className="rounded-3xl p-6 sm:p-8 border-2"
              style={{ borderColor: program.color, background: 'rgba(255, 153, 0, 0.05)' }}
            >
              <div className="mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-gray-600">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                  {program.title}
                </h2>
                <p className="text-base sm:text-lg font-bold" style={{ color: program.color }}>
                  {program.count}
                </p>
              </div>

              <ul className="space-y-2 sm:space-y-3">
                {program.courses.map((course, j) => (
                  <li
                    key={course}
                    className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                      style={{ background: program.color }}
                    />
                    <Link
                      href={getCourseHref(course)}
                      className="text-sm leading-relaxed underline hover:no-underline"
                    >
                      {course}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
