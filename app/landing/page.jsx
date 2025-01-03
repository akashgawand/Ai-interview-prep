"use client";

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Users, Zap, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

const Header = memo(() => (
  <header className="container mx-auto px-4 py-6 flex justify-between items-center shadow-sm">
    <div className="flex items-center">
      <Image src="/ai prep logo 2.png" alt="AI Prep Logo" width={140} height={80} priority />
      <span className="ml-2 text-3xl font-bold text-purple-500">AI Prep</span>
    </div>
    <nav>
      <ul className="flex space-x-8">
        {['Features', 'About', 'Contact'].map((item) => (
          <li key={item}>
            <a href={`#${item.toLowerCase()}`} className="text-purple-800 hover:text-pink-600 transition-colors text-lg font-medium">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </header>
));

const HeroSection = () => (
  <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
    <motion.div
      className="md:w-1/2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Image
        src="/interview.png"
        alt="AI Interview Preparation"
        width={600}
        height={400}
        className="rounded-lg shadow-2xl object-cover object-right ml-14"
        priority
      />
    </motion.div>
    <motion.div
      className="md:w-1/2 mb-10 md:mb-0"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-5xl md:text-6xl font-bold text-purple-900 mb-4">
        Master Your Interviews with AI
      </h1>
      <p className="text-xl text-purple-700 mb-8">
        Boost your confidence and land your dream job with personalized AI-powered interview preparation.
      </p>
      <Link href="/dashboard" passHref>
        <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all flex items-center">
          Get Started Free
          <ChevronRight className="ml-2" />
        </button>
      </Link>
    </motion.div>
  </section>
);

const FeaturesSection = () => (
  <section id="features" className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center text-purple-900 mb-12">Our Cutting-Edge Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map(({ icon, title, description }, index) => (
          <FeatureCard key={index} icon={icon} title={title} description={description} />
        ))}
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section id="about" className="container mx-auto px-4 py-20">
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h2 className="text-4xl font-bold mb-4">About AI Prep</h2>
        <p className="text-lg mb-4">
          At AI Prep, we're passionate about helping job seekers succeed. Our team of AI experts and career coaches have developed a cutting-edge platform that combines the power of artificial intelligence with proven interview techniques.
        </p>
        <p className="text-lg">
          We believe that everyone deserves the opportunity to showcase their best selves in interviews, and we're here to make that happen.
        </p>
      </div>
      <div className="md:w-1/2 md:pl-8">
        <Image
          src="/interview3.png"
          alt="About AI Prep"
          width={400}
          height={300}
          className="rounded-lg shadow-xl"
          loading="lazy"
        />
      </div>
    </div>
  </section>
);

const Footer = memo(() => (
  <footer className="bg-gradient-to-r from-purple-800 to-pink-700 text-white py-8">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 flex items-center">
          <Image src="/ai prep logo 2.png" alt="AI Prep Logo" width={50} height={50} />
          <span className="ml-2 text-2xl font-bold">AI Prep</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-pink-300 transition-colors text-lg">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mt-8 text-center text-sm">&copy; 2023 AI Prep. All rights reserved.</div>
    </div>
  </footer>
));

const FeatureCard = memo(({ icon, title, description }) => (
  <motion.div
    className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-2xl font-semibold text-purple-900 ml-4">{title}</h3>
    </div>
    <p className="text-purple-700 text-lg">{description}</p>
  </motion.div>
));

const features = [
  { icon: <Zap className="w-12 h-12 text-purple-500" />, title: 'AI-Powered Practice', description: 'Experience realistic interview scenarios tailored to your industry and role.' },
  { icon: <Users className="w-12 h-12 text-pink-500" />, title: 'Personalized Feedback', description: 'Receive instant, detailed feedback on your responses to improve your performance.' },
  { icon: <Star className="w-12 h-12 text-purple-500" />, title: 'Progress Tracking', description: 'Monitor your improvement over time with detailed analytics and insights.' },
];

export default LandingPage;
