// app/history/page.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import Header from '../_components/Header';

const History = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    user && getInterviewList();
  }, [user]);

  const getInterviewList = async () => {
    const result = await db.select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(MockInterview.id));
    setInterviewList(result);
  };

  return (
    <div>
        <Header/>
    <div className="min-h-screen ">
      <div className="mx-5 md:mx-20 lg:mx-36 py-16">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-900 mb-8">
          Interview History
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewList && interviewList.map((interview, index) => (
            <HistoryCard key={index} interview={interview} />
          ))}
        </div>

        {interviewList.length === 0 && (
          <div className="text-center text-gray-600 mt-10">
            <p>No interview history found.</p>
            <Link href="/dashboard">
              <Button className="bg-purple-500 mt-4">
                Start Your First Interview
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

const HistoryCard = ({ interview }) => {
    return (
    <div className='flex flex-col rounded-lg border border-gray-200 p-4 hover:border-purple-300 hover:scale-105 transition-transform duration-300'>
      <h1 className='text-lg font-bold text-purple-500'>
        Job Position: {interview?.jobPosition}
      </h1>
      <h1 className='text-sm font-bold text-gray-700'>
        Years of Experience: {interview?.jobExperience}
      </h1>
      <h1 className='text-sm font-bold text-gray-500'>
        Date: {interview?.createdAt}
      </h1>

      <Link href={`/dashboard/interview/${interview?.mockId}/feedback`}>
        <Button className="bg-purple-500 mt-4 w-full">
          View Feedback
        </Button>
      </Link>
    </div>
  );
};


export default History;