'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Loader2 } from 'lucide-react';
import QuestionSection from './_components/questionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '../../../../components/ui/button';
import Link from 'next/link';

const StartInterview = ({ params }) => {
    const [loading, setLoading] = useState(true);
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        if (params && params.interviewId) {
            fetchInterviewData(params.interviewId);
        }
    }, [params]);

    const fetchInterviewData = async (interviewId) => {
        try {
            const data = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, interviewId));

            if (data && data.length > 0) {
                // Safely parse jsonMockResp and extract the array
                let questions = [];
                try {
                    const jsonMockResp = JSON.parse(data[0]?.jsonMockResp || "[]");
                    questions = Array.isArray(jsonMockResp)
                        ? jsonMockResp
                        : Array.isArray(jsonMockResp.interviewQuestions)
                            ? jsonMockResp.interviewQuestions
                            : [];
                } catch (err) {
                    console.error("Error parsing jsonMockResp:", err);
                }

                setMockInterviewQuestions(questions);
                setInterviewData(data[0]);
            } else {
                console.log('No data found');
                setMockInterviewQuestions([]);
            }
        } catch (error) {
            console.error('Error fetching interview data:', error);
            setMockInterviewQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Interview Data:', interviewData);
        console.log('Mock Interview Questions Count:', mockInterviewQuestions.length);
    }, [interviewData, mockInterviewQuestions]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-50 to-pink-50">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!interviewData) {
        return <div>No data found</div>;
    }

    return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 h-screen p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
                <QuestionSection
                    mockInterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                    setActiveQuestionIndex={setActiveQuestionIndex}
                />

                <RecordAnswerSection mockInterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData} />

            </div>
            <div className='flex justify-center gap-4 mt-6 '>
                {/* {activeQuestionIndex>0 &&
                 <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}
                 className='rounded-lg px-6 border-2 border-purple-400 bg-white text-black font-semibold transition-all duration-200 transform hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700 hover:text-white hover:shadow-xl hover:scale-105'>
                    Previous Question
                </Button>}

               {mockInterviewQuestions!=activeQuestionIndex<mockInterviewQuestions?.length-1 && 
               <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}
               className='rounded-lg px-6 border-2 border-purple-400 bg-white text-black font-semibold transition-all duration-200 transform hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700 hover:text-white hover:shadow-xl hover:scale-105'>
                    Next Question
                </Button>} */}

                {activeQuestionIndex == mockInterviewQuestions?.length - 1 && 
                <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                    <Button 
                        className='fixed right-16 bottom-44 rounded-lg px-6 border-2 border-purple-400 bg-white text-black font-semibold transition-all duration-200 transform hover:bg-gradient-to-r hover:from-red-500 hover:to-red-700 hover:text-white hover:shadow-xl hover:scale-105'>
                        End Interview
                    </Button>
                </Link>
            }

            </div>
        </div>
    );
};

export default StartInterview;
