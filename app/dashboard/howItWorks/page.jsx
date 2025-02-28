// app/how-it-works/page.jsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, MessageSquare, Award, Clock, BarChart } from 'lucide-react';
import Link from 'next/link';
import Header from '../_components/Header';
const HowItWorks = () => {
  return (
    <div className="min-h-screen ">
        <Header/>
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
        >
          How AI Prep Works
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-purple-800">{step.title}</h3>
              </div>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

const steps = [
  {
    icon: <BookOpen className="w-6 h-6 text-purple-600" />,
    title: "Create Your Profile",
    description: "Enter your job position, experience level, and preferred interview focus areas."
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
    title: "AI Question Generation",
    description: "Our AI generates personalized interview questions based on your profile and industry standards."
  },
  {
    icon: <Video className="w-6 h-6 text-purple-600" />,
    title: "Practice Interview",
    description: "Engage in a realistic interview simulation with our AI interviewer."
  },
  {
    icon: <Award className="w-6 h-6 text-purple-600" />,
    title: "Receive Feedback",
    description: "Get detailed feedback on your responses, including areas for improvement."
  },
  {
    icon: <BarChart className="w-6 h-6 text-purple-600" />,
    title: "Track Progress",
    description: "Monitor your improvement over time with detailed performance analytics."
  },
  {
    icon: <Clock className="w-6 h-6 text-purple-600" />,
    title: "Practice Anytime",
    description: "Access unlimited practice sessions 24/7 to perfect your interview skills."
  }
];

export default HowItWorks;

