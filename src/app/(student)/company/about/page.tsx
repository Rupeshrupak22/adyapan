'use client';

import { s3Url } from '@/lib/s3Url';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Award, Users, Zap, Target, Heart, Globe, BookOpen, TrendingUp } from 'lucide-react';
import AuthNavButtons from '@/components/AuthNavButtons';

const customEase = [0.22, 1, 0.36, 1] as const;

export default function CompanyAboutPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo) return;
    
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.error('Autoplay failed:', error));
      }
    };

    const handleError = (e: any) => {
      console.error('Video error:', e);
      setVideoError(true);
    };

    const handleLoadedData = () => {
      setVideoLoaded(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);

    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [shouldLoadVideo]);

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Hero Section */}
      <section ref={sectionRef} className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-[#1a2a4e] via-[#0f1419] to-[#0f1419]">
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          {shouldLoadVideo && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${
                videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ zIndex: 1 }}
            >
              <source src={s3Url('/videos/15415747_3840_2160_25fps.mp4')} type="video/mp4" />
            </video>
          )}
          
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-[#1a2a4e] via-[#0f1419] to-[#0f1419] transition-opacity duration-2000 ${
              videoLoaded && !videoError ? 'opacity-30' : 'opacity-100'
            }`}
            style={{ zIndex: 0 }}
          />
        </div>

        {shouldLoadVideo && !videoLoaded && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
            <div className="text-white text-sm opacity-70 bg-black/20 px-4 py-2 rounded-lg">
              Loading high-quality video...
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/40" style={{ zIndex: 3 }} />

        <div className="absolute inset-0" style={{ zIndex: 4 }}>
          <div 
            className="absolute top-20 right-10 w-96 h-96 bg-[#f90]/5 rounded-full blur-3xl"
          />
          <div 
            className="absolute bottom-0 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-50 py-20 text-center">
          <div
            className="max-w-3xl mx-auto"
          >
            <p 
              className="text-[#f90] text-lg mb-4 font-medium"
            >
              Our Vision
            </p>
            <h1 
              className="text-5xl md:text-6xl font-extrabold text-[#f90] leading-[1.2] mb-6"
            >
              Crafting Futures, Not Just Careers.
            </h1>
            <p 
              className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto"
            >
              At Adyapan, we are more than an education platform. We are the bridge between learning and professional launching. Our mission is to empower individuals with the real-world skills and connections to forge their own paths to success.
            </p>
          </div>
        </div>
      </section>

      {/* The Adyapan Pillars Section */}
      <section className="py-20 bg-[#0f1419] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The <span style={{ color: '#f90' }}>Adyapan</span> Pillars
            </h2>
            <p className="text-gray-400 text-lg">
              Three core principles that guide everything we do
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Empowerment through Practice',
                description: 'We believe in learn-by-doing, providing practical skills that apply to today\'s industries.',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=85'
              },
              {
                title: 'The Human Connection',
                description: 'We connect you to a network of mentors and industry leaders who guide your growth.',
                image: s3Url('/images/humanconnection.png')
              },
              {
                title: 'Launch Ready',
                description: 'We are committed to making you not just skilled, but launch-ready for your career.',
                image: s3Url('/images/ready.png')
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="w-full h-full"
                  >
                    {item.image.startsWith('/') ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
                </div>
                <div className="p-8 text-white relative z-10">
                  <h3 
                    className="text-2xl font-bold mb-3"
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-gray-400 leading-relaxed"
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-[#1a2a4e]/30 border-t border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-10 right-10 w-72 h-72 bg-[#f90]/5 rounded-full blur-3xl"
          />
          <div
            className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div
            className="text-center mb-16"
          >
            <p
              className="text-[#f90] text-lg mb-4 font-medium"
            >
              Our Story:
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Crafting Futures, Not Just Careers.
            </h2>
            <p
              className="text-gray-400 text-lg max-w-3xl mx-auto"
            >
              At Adyapan, we are more than an education platform. We are the bridge between learning and professional launching. Our mission is to empower individuals with the real-world skills and connections to forge their own paths to success.
            </p>
          </div>

          {/* Founder Cards Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          >
            {/* Founder Card */}
            <div
              className="relative group"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:border-[#f90]/30">
                <div className="absolute top-0 left-1/4 w-1 h-12 bg-gradient-to-b from-[#f90] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-1/4 w-1 h-12 bg-gradient-to-t from-[#f90] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex-shrink-0">
                    <div
                      className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#f90] shadow-lg flex-shrink-0"
                    >
                      <Image src={s3Url('/images/sai-charan.jpeg')} alt="Founder - Sai Charan" width={160} height={160} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3
                      className="text-2xl font-bold text-white mb-1"
                    >
                      SAI CHARAN
                    </h3>
                    <p
                      className="text-[#f90] font-semibold mb-3"
                    >
                      Founder
                    </p>
                    <p
                      className="text-gray-400 leading-relaxed text-sm"
                    >
                      "Upskilling isn't optional anymore. Adyapan ensures every student learns with purpose, practices with mentors, and grows with confidence."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Co-Founder Card */}
            <div
              className="relative group"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:border-[#f90]/30">
                <div className="absolute top-0 right-1/4 w-1 h-12 bg-gradient-to-b from-[#f90] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-1/4 w-1 h-12 bg-gradient-to-t from-[#f90] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex-shrink-0">
                    <div
                      className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#f90] shadow-lg flex-shrink-0"
                    >
                      <Image src={s3Url('/images/niranjan-reddy.jpeg')} alt="Co-Founder - Niranjan Reddy" width={160} height={160} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3
                      className="text-2xl font-bold text-white mb-1"
                    >
                      NIRANJAN REDDY
                    </h3>
                    <p
                      className="text-[#f90] font-semibold mb-3"
                    >
                      Co-Founder
                    </p>
                    <p
                      className="text-gray-400 leading-relaxed text-sm"
                    >
                      "The world is full of opportunities, but students need the right direction. Adyapan helps them access global careers without feeling lost."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Leadership Section */}
      <section className="py-20 bg-[#0f1419] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span style={{ color: '#f90' }}>Leadership</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Visionary leaders driving innovation in EdTech
            </p>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
          >
            {[
              { name: 'Sai Charan', role: 'Founder', image: s3Url('/images/sai-charan.jpeg') },
              { name: 'Niranjan Reddy', role: 'Co-Founder', image: s3Url('/images/niranjan-reddy.jpeg') },
              { name: 'Gunjan Avasthi', role: 'Human Resource Manager', image: 'https://static.vecteezy.com/system/resources/thumbnails/046/654/168/small/a-smiling-young-indian-businesswoman-in-a-light-grey-suit-stands-with-her-arms-crossed-in-a-modern-office-building-photo.jpeg' },
              { name: 'Monika Y', role: 'Core Team', image: s3Url('/images/monika-y.jpeg') },
              { name: 'Dr. Dhiraj Singh', role: 'Head, Training & Placement Cell', image: s3Url('/images/Dr. Dhiraj Singh.jpeg') }
            ].map((member, i) => (
              <div key={i} className="text-center group">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-[#f90] transition-all relative">
                  <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-[#f90] text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#1a2a4e]/30 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { number: '20K+', label: 'Students Trained' },
              { number: '70+', label: 'Programs Offered' },
              { number: '95%*', label: 'Placement Rate' },
              { number: '250+', label: 'Partner Companies' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div 
                  className="text-5xl font-bold mb-2" 
                  style={{ color: '#f90' }}
                >
                  {stat.number}
                </div>
                <p 
                  className="text-gray-400 font-medium"
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 bg-[#0f1419] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span style={{ color: '#f90' }}>Learning Approach</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Learn  Practice  Build  Launch
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { step: '01', title: 'Learn', description: 'Master industry-relevant concepts through expert-led courses' },
              { step: '02', title: 'Practice', description: 'Apply knowledge with hands-on projects and real scenarios' },
              { step: '03', title: 'Build', description: 'Create portfolio-worthy projects that impress employers' },
              { step: '04', title: 'Launch', description: 'Get placed with top companies or start your own venture' }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-[#f90]/50 transition-all"
              >
                <div className="text-4xl font-bold mb-4" style={{ color: '#f90' }}>{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Adyapan Section */}
      <section className="py-20 bg-[#1a2a4e]/30 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Partner with <span style={{ color: '#f90' }}>Adyapan?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We're not just an EdTech platform. We're your partner in career transformation and talent acquisition.
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: BookOpen, title: 'Industry-Aligned Curriculum', description: 'Learn skills that companies actually need, designed with industry experts' },
              { icon: Users, title: 'Expert Mentorship', description: 'Learn from professionals with 5-10+ years of real-world experience' },
              { icon: Zap, title: 'Real-World Projects', description: 'Build a portfolio with actual projects that impress employers' },
              { icon: Award, title: 'Recognized Credentials', description: 'Earn certifications valued by top companies worldwide' },
              { icon: TrendingUp, title: 'Career Support', description: 'Get placement assistance, interview prep, and career guidance' },
              { icon: Heart, title: 'Flexible Learning', description: 'Learn at your own pace with lifetime access to course materials' }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-[#f90]/50 hover:shadow-lg transition-all group"
              >
                <div 
                  className="mb-4"
                >
                  <div className="w-12 h-12 bg-[#f90]/10 rounded-lg flex items-center justify-center group-hover:bg-[#f90]/20 transition-colors">
                    <item.icon className="w-6 h-6" style={{ color: '#f90' }} />
                  </div>
                </div>
                <h3 
                  className="text-white font-bold text-lg mb-2"
                >
                  {item.title}
                </h3>
                <p 
                  className="text-gray-400 text-sm leading-relaxed"
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0f1419] border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Hire <span style={{ color: '#f90' }}>Job-Ready Talent?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of companies who have already transformed their teams with Adyapan
            </p>
            <div>
              <Link
                href="/auth"
                className="inline-block px-10 py-4 bg-[#f90] text-white rounded-lg font-bold text-lg hover:bg-[#e07000] transition-colors"
              >
                Start Hiring 
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
