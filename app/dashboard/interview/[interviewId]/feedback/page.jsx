'use client';

import React, { useEffect, useState, memo } from 'react';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Loader2, TrendingUp, Star, CheckCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Memoized CustomCard Component
const CustomCard = memo(({ header, children, className }) => (
  <div className={`rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-2xl bg-white ${className}`}>
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4 rounded-t-lg">
      <h3 className="text-lg font-semibold text-white">{header}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
));

// Feedback Component
const Feedback = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params?.interviewId) {
      fetchFeedbackData(params.interviewId);
    }
  }, [params]);

  const fetchFeedbackData = async (interviewId) => {
    try {
      setLoading(true);
      const data = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId));

      setFeedbackData(data);
    } catch (err) {
      setError('Failed to fetch feedback. Please try again later.');
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const bestRating = feedbackData.length
    ? Math.max(...feedbackData.map((item) => item.rating))
    : 'N/A';
  const averageRating = feedbackData.length > 0
    ? Number((feedbackData.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / feedbackData.length).toFixed(1))
    : 'N/A';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" aria-label="Loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <p className="text-red-600 font-bold" role="alert">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 min-h-screen p-6">
      <h1 className="
        text-4xl font-extrabold text-center mb-8 
        bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 
        bg-clip-text text-transparent tracking-tight py-2 relative
      ">
        Interview Performance Analysis
      </h1>

      {/* Performance Overview Chart */}
      <CustomCard header="Performance Overview" className="mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={feedbackData.map((item, index) => ({
              question: `Q${index + 1}`,
              rating: item.rating,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="question" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="rating" stroke="#5b21b6" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CustomCard>

      {/* Overall Performance Summary */}
      <CustomCard header="Overall Performance" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center bg-indigo-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <TrendingUp class Name="w-8 h-8 text-indigo-600 hover:text-indigo-800 transition-colors duration-200" />
            <h3 className="font-semibold text-indigo-700 mb-2">Average Rating</h3>
            <p className="text-2xl font-bold text-indigo-800">{averageRating}/10</p>
          </div>
          <div className="flex flex-col items-center bg-purple-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <Star className="w-8 h-8 text-purple-600 hover:text-purple-800 transition-colors duration-200" />
            <h3 className="font-semibold text-purple-700 mb-2">Questions Answered</h3>
            <p className="text-2xl font-bold text-purple-800">{feedbackData.length}</p>
          </div>
          <div className="flex flex-col items-center bg-green-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <CheckCircle className="w-8 h-8 text-green-600 hover:text-green-800 transition-colors duration-200" />
            <h3 className="font-semibold text-green-700 mb-2">Best Performance</h3>
            <p className="text-2xl font-bold text-green-800">{bestRating}/10</p>
          </div>
        </div>
      </CustomCard>

      {/* Detailed Feedback Cards */}
      <div className="grid grid-cols-1 gap-6">
        {feedbackData.map((answer, index) => (
          <CustomCard key={index} header={`Question ${index + 1}`} className="hover:shadow-2xl transition-shadow duration-300">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-indigo-700 mb-2">Question:</h3>
                <p className="text-gray-700">{answer.question}</p>
              </div>
              <div>
                <h3 className="font-semibold text-indigo-700 mb-2">Your Answer:</h3>
                <p className="text-gray-700 bg-indigo-50 p-3 rounded-lg">{answer.userAnswer}</p>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-indigo-700">Rating:</h3>
                <div className="flex items-center bg-indigo-200 px-3 py-1 rounded-full">
                  <span className="text-indigo-800 font-bold">{answer.rating}/10</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-indigo-700 mb-2">Ideal Answer:</h3>
                <p className="text-gray-700 bg-purple-50 p-3 rounded-lg">{answer.correctAnswer}</p>
              </div>
              <div>
                <h3 className="font-semibold text-indigo-700 mb-2">Feedback:</h3>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg">
                  <p className="text-gray-700">{answer.feedBack}</p>
                </div>
              </div>
            </div>
          </CustomCard>
        ))}
      </div>
    </div>
  );
};

export default Feedback;