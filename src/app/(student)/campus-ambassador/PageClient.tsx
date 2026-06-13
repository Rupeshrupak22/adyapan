'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Users, Target, Award, Briefcase, DollarSign, Clock, CheckCircle,
  Globe, TrendingUp, Shield, BookOpen, Zap, ChevronRight, Star
} from 'lucide-react';
import MarqueeBanner from '@/components/MarqueeBanner';

const customEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: customEase } },
};

const staggerContainer = (stagger = 0.12, delayChildren = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

const hoverPop = {
  scale: 1.04,
  y: -6,
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};

export default function CampusAmbassadorPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* â”€â”€â”€ Hero Section â”€â”€â”€ */}
      <section className="relative pt-16 pb-24 sm:pb-32 px-6 overflow-hidden">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src="/videos/7969486-uhd_3840_2160_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" style={{ zIndex: 1 }} />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-[1.1]">
              Become a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffa800] to-[#ff6b00]">
                Campus Ambassador
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
              Bridge the gap between students and industry. Empower your campus with Adyapan and earn up to â‚¹15,000/month while making a real impact.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <motion.a
                href="https://internshala.com/internship/detail/work-from-home-lead-generation-internship-at-srs-adypan-edutech-private-limited1781263141"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -4, boxShadow: '0 20px 40px rgba(255,168,0,0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#ffa800] to-[#ff8c00] text-white rounded-full font-bold text-base shadow-lg shadow-orange-500/25 hover:from-[#ff8c00] hover:to-[#ff6b00] transition-all duration-300"
              >
                Apply on Internshala
                <ChevronRight className="w-5 h-5 ml-2" />
              </motion.a>
              <motion.a
                href="/campus-ambassador/apply"
                whileHover={{ scale: 1.1, y: -4, boxShadow: '0 20px 40px rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur border border-white/30 text-white rounded-full font-bold text-base hover:bg-[#ffa800] hover:border-[#ffa800] hover:text-white transition-all duration-300"
              >
                Apply Directly
                <ChevronRight className="w-5 h-5 ml-2" />
              </motion.a>
            </div>

            {/* Key Stats */}
            <motion.div
              variants={staggerContainer(0.1, 0.3)}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { value: 'â‚¹1Kâ€“15K', label: 'Monthly Stipend', sub: 'Incentive Based' },
                { value: 'All', label: 'Academic Programs', sub: 'Engineering, Management & More' },
                { value: 'Flexible', label: 'Work Schedule', sub: 'Balance with Studies' },
                { value: '100%', label: 'Remote Friendly', sub: 'Work from Anywhere' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ scale: 1.08, y: -8, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-5 text-center cursor-pointer hover:bg-white/20 hover:border-white/30 transition-colors"
                >
                  <div className="text-2xl sm:text-3xl font-black text-[#ffa800] mb-1">{stat.value}</div>
                  <p className="text-white font-semibold text-sm">{stat.label}</p>
                  <p className="text-white/60 text-xs mt-0.5">{stat.sub}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <MarqueeBanner variant="orange" speed={30} />

      {/* â”€â”€â”€ About Section â”€â”€â”€ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: customEase }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">About Adyapan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Bridging the gap between academic learning and industry-ready skills since day one.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {[
              { title: 'Who We Are', text: 'SR\'s Adyapan Edutech Private Limited is a dynamic e-learning organization dedicated to bridging the gap between academic learning and industry skills.' },
              { title: 'Our Vision', text: 'To empower individuals with accessible, quality, and skill-based learning solutions that enhance employability and career growth.' },
              { title: 'Our Approach', text: 'Learner-centric focus with strong industry alignment helps create meaningful pathways for students to transition into the workforce.' },
              { title: 'Why Join Us', text: 'Be part of a mission to transform education. Make a real impact on your campus while building experience and earning competitive incentives.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={hoverPop}
                className="bg-gray-50 rounded-2xl p-7 border border-gray-100 cursor-default hover:shadow-lg hover:border-orange-100 transition-all"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ffa800] rounded-full" />
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* â”€â”€â”€ The Role Section â”€â”€â”€ */}
      <section className="py-20 px-6 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: customEase }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">The Role</h2>
            <p className="text-gray-600 max-w-xl mx-auto">What you&apos;ll do as an Adyapan Campus Ambassador</p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Users, title: 'Bridge Students & Company', desc: 'Serve as the primary connection between students interested in training or internships and Adyapan Edutech.' },
              { icon: Target, title: 'Gather Student Insights', desc: 'Collect valuable feedback regarding academic programs, campus life, and internship expectations.' },
              { icon: Zap, title: 'Promote Initiatives', desc: 'Facilitate webinars, grassroots development, and encourage student participation in programs.' },
              { icon: Globe, title: 'Distribute Information', desc: 'Help share important updates and information with the student community effectively.' },
              { icon: TrendingUp, title: 'Drive Engagement', desc: 'Represent student interests and drive meaningful engagement across your campus.' },
              { icon: Shield, title: 'Maintain Communication', desc: 'Ensure clear and consistent communication between students, peers, and company staff.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={hoverPop}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm cursor-default hover:shadow-xl hover:border-orange-100 transition-all"
              >
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-[#ffa800] to-[#ff6b00] rounded-xl flex items-center justify-center mb-5"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* â”€â”€â”€ Requirements & Skills â”€â”€â”€ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: customEase }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">Requirements & Skills</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: customEase }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#ffa800]" />
                Requirements
              </h3>
              <div className="space-y-3">
                {[
                  'Currently enrolled in a relevant academic program',
                  'Interest in student affairs and community engagement',
                  'Passion for campus representation',
                  'Ability to work independently and as part of a team',
                  'Commitment to making a positive impact',
                ].map((req, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 6, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors cursor-default"
                  >
                    <CheckCircle className="w-5 h-5 text-[#ffa800] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium text-sm">{req}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: customEase }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ffa800]" />
                Key Skills
              </h3>
              <div className="space-y-3">
                {[
                  'Excellent interpersonal and communication skills',
                  'Strong organizational abilities with attention to detail',
                  'Collaborative approach to problem-solving',
                  'Ability to engage and inspire diverse groups',
                  'Self-motivated and proactive mindset',
                ].map((skill, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 6, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors cursor-default"
                  >
                    <CheckCircle className="w-5 h-5 text-[#ffa800] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium text-sm">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ Eligibility Section â”€â”€â”€ */}
      <section className="py-20 px-6 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: customEase }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">Who Can Apply?</h2>
            <p className="text-gray-600">Open to students across all disciplines and levels</p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-3 gap-6"
          >
            {[
              { title: 'Engineering Students', items: ['Undergraduates', 'Postgraduates', 'Freshers'] },
              { title: 'Management Students', items: ['MBA Students', 'BBA Students', 'All Levels'] },
              { title: 'Other Disciplines', items: ['Arts', 'Commerce', 'Sciences', 'All Programs'] },
            ].map((category, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={hoverPop}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm cursor-default hover:shadow-xl hover:border-orange-100 transition-all"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-5 text-center">{category.title}</h3>
                <div className="space-y-3 w-fit mx-auto">
                  {category.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 bg-[#ffa800] rounded-full flex-shrink-0" />
                      <span className="font-medium text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* â”€â”€â”€ Final CTA â”€â”€â”€ */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#111827] to-[#1f2937] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ffa800] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#ff6b00] rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-5">
              Ready to Make an Impact?
            </h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-xl mx-auto">
              Join our community of campus ambassadors and become the bridge between students and industry.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <motion.a
                href="https://internshala.com/internship/detail/work-from-home-lead-generation-internship-at-srs-adypan-edutech-private-limited1781263141"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-[#ffa800] to-[#ff8c00] text-white rounded-full font-bold text-base shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-shadow"
              >
                Apply on Internshala
                <ChevronRight className="w-5 h-5 ml-2" />
              </motion.a>
              <motion.a
                href="/campus-ambassador/apply"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center px-10 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-full font-bold text-base hover:bg-white/20 transition-all"
              >
                Apply Directly
                <ChevronRight className="w-5 h-5 ml-2" />
              </motion.a>
            </div>

            <p className="text-gray-400 text-sm">
              Stipend: â‚¹1,000 â€“ â‚¹15,000/Month (Incentive Based) Â· Flexible Schedule Â· Remote Friendly
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
