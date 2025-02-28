'use client';

import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../../../../../components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAiModel';
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import { UserAnswer } from "@/utils/schema";
import moment from 'moment';

const RecordAnswerSection = ({ mockInterviewQuestions = [], activeQuestionIndex = 0, interviewData }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Accumulate speech results
  useEffect(() => {
    if (results.length > 0) {
      const lastResult = results[results.length - 1]?.transcript;
      if (lastResult) {
        setUserAnswer(prev => prev + ' ' + lastResult);
      }
    }
  }, [results]);

  // Handle question changes
  useEffect(() => {
    const handleQuestionChange = async () => {
      if (isRecording) {
        await stopSpeechToText();
        
        // Only try to save if there's actually an answer to save
        if (userAnswer?.trim()) {
          try {
            const feedBackPrompt = `Question: ${mockInterviewQuestions[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Based on the user's answer, provide a rating out of 10. Then, provide your ideal answer to the question (limit to 4 lines), followed by a concise 5-line feedback. Respond in JSON format with the following fields: "rating" (integer), "correctanswer" (your ideal answer), and "feedback" (brief evaluation of the user's response). Do not use terms like 'no correct answer' or 'true/false'.`;

            const result = await chatSession.sendMessage(feedBackPrompt);
            const mockJsonResponse = result?.response.text();
            const cleanedJsonResp = mockJsonResponse
              .replace(/```json|```/g, '')
              .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
              .replace(/\\n/g, ' ')
              .replace(/\\r/g, ' ')
              .trim();

            let jsonFeedBack = JSON.parse(cleanedJsonResp);

            const resp = await db.insert(UserAnswer).values({
              mockIdRef: interviewData?.mockId || 'unknownMockId',
              question: mockInterviewQuestions[activeQuestionIndex]?.question || 'No question provided',
              correctAnswer: jsonFeedBack?.correctanswer || 'No correct answer',
              userAnswer: userAnswer.trim(),
              rating: jsonFeedBack?.rating || 0,
              feedBack: jsonFeedBack?.feedback || 'No feedback available',
              userEmail: user?.primaryEmailAddress?.emailAddress || 'No email provided',
              createdAt: moment().format('DD/MM/YYYY'),
            });

            if (resp) {
              toast.success('Answer saved successfully!');
            }
          } catch (error) {
            console.error('Error saving answer:', error);
          }
        }
      }
      setUserAnswer('');
    };

    handleQuestionChange();
  }, [activeQuestionIndex]);

  const handleRecordingToggle = async () => {
    try {
      if (isRecording) {
        await stopSpeechToText();

        if (!userAnswer?.trim()) {
          toast.error('Please record an answer before saving');
          return;
        }

        const feedBackPrompt = `Question: ${mockInterviewQuestions[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Based on the user's answer, provide a rating out of 10. Then, provide your ideal answer to the question (limit to 4 lines), followed by a concise 5-line feedback. Respond in JSON format with the following fields: "rating" (integer), "correctanswer" (your ideal answer), and "feedback" (brief evaluation of the user's response). Do not use terms like 'no correct answer' or 'true/false'.`;

        const result = await chatSession.sendMessage(feedBackPrompt);
        const mockJsonResponse = result?.response.text();
        const cleanedJsonResp = mockJsonResponse
          .replace(/```json|```/g, '')
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
          .replace(/\\n/g, ' ')
          .replace(/\\r/g, ' ')
          .trim();

        let jsonFeedBack = JSON.parse(cleanedJsonResp);

        const resp = await db.insert(UserAnswer).values({
          mockIdRef: interviewData?.mockId || 'unknownMockId',
          question: mockInterviewQuestions[activeQuestionIndex]?.question || 'No question provided',
          correctAnswer: jsonFeedBack?.correctanswer || 'No correct answer',
          userAnswer: userAnswer.trim(),
          rating: jsonFeedBack?.rating || 0,
          feedBack: jsonFeedBack?.feedback || 'No feedback available',
          userEmail: user?.primaryEmailAddress?.emailAddress || 'No email provided',
          createdAt: moment().format('DD/MM/YYYY'),
        });

        if (resp) {
          setUserAnswer('');
          toast.success('Answer saved successfully!');
        }
      } else {
        setUserAnswer('');
        await startSpeechToText();
      }
    } catch (error) {
      console.error('Error:', error);
      if (isRecording) {
        stopSpeechToText();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center justify-center w-full bg-purple-200 rounded-lg p-5 h-[400px]">
        <Webcam
          mirrored
          videoConstraints={{
            width: { ideal: 1280 },
            height: { ideal: 400 },
            aspectRatio: 16 / 9,
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      <div className='flex gap-2'>
        <Button
          onClick={handleRecordingToggle}
          variant="outline"
          className="rounded-lg mt-6 px-6 border hover:border-2 font-semibold border-purple-400 hover:border-purple-600 hover:text-white transition-all hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 duration-200"
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>
      <div className="mt-2">
        {isRecording ? (
          <h1 className="text-red-600">Recording...</h1>
        ) : (
          <h1 className="mb-3">Click "Start Recording" to begin.</h1>
        )}
      </div>
      <div className="mt-4 p-4 bg-white rounded-lg shadow-md w-full max-w-2xl h-24 overflow-y-auto">
        <h2 className="font-semibold text-lg">Live Transcription:</h2>
        <p className="text-gray-700">{userAnswer || 'No transcription yet...'}</p>
      </div>
    </div>
  );
};

export default RecordAnswerSection;