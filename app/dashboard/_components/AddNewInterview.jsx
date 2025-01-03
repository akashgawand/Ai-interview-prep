"use client";

import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/button"; // Adjusted import path
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { chatSession } from "@/utils/GeminiAiModel";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { useUser } from '@clerk/nextjs';
import moment from "moment";
import { db } from '@/utils/db';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [questions, setQuestions] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const inputPrompt = `${jobPosition}, Job Description: ${jobDesc}, 
        Years of Experience: ${jobExperience}, and any relevant past information.
        Generate ${questions} interview questions and answers tailored to the role, 
        experience level, and individual's past background. Format in JSON and ensure 
        not exceeding specified question count and ask questions based on most aksed questions in industry.`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const mockJsonResponse = await result.response.text();
      const cleanedJsonResp = mockJsonResponse.replace(/```json|```/g, '').trim();
      const parsedResp = JSON.parse(cleanedJsonResp);

      if (parsedResp) {
        const createdByEmail = user?.primaryEmailAddress?.emailAddress || 'unknown';
        const res = await db.insert(MockInterview).values({
          mockId: uuidv4(),
          jsonMockResp: cleanedJsonResp,
          jobPosition,
          jobDesc,
          jobExperience,
          createdBy: createdByEmail,
          createdAt: moment().format('DD-MM-YY'),
        }).returning({ mockId: MockInterview.mockId });

        if (res && res.length > 0 && res[0]?.mockId) {
          router.push(`/dashboard/interview/${res[0]?.mockId}`);
        }
      }
    } catch (error) {
      console.error("Error during chat session:", error);
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <button onClick={() => setOpenDialog(true)} className="w-full p-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl hover:scale-105 hover:shadow-xl transition-all cursor-pointer transform duration-200 group focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75">
        <div className="flex items-center justify-center space-x-2">
          <PlusCircle className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors duration-500" />
          <h2 className="font-semibold text-lg text-purple-700 group-hover:text-purple-800 transition-colors duration-500">
            Add New Interview
          </h2>
        </div>
      </button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg bg-white rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl text-purple-700 mb-2">
              Tell us about your job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Please include details such as your job position, key responsibilities, and years of experience.</p>

                  <label htmlFor="jobPosition" className="block mb-2 text-sm font-medium text-gray-800">
                    Job Role / Job Position
                  </label>

                  <Input id="jobPosition"
                    placeholder="Ex. Full Stack Developer"
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                    required />
                  <label htmlFor="jobDesc" className="block mb-2 text-sm font-medium text-gray-800">
                    Job Description / Tech Stack
                  </label>

                  <Textarea
                    id="jobDesc"
                    placeholder="Ex. React, Angular, Node.js, Java"
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    required rows={4} />

                  <label htmlFor="jobExperience" className="block mb-2 text-sm font-medium text-gray-800">
                    Years of Experience
                  </label>
                  <Input
                    id="jobExperience"
                    placeholder="Ex. 5"
                    type="number"
                    max="50"
                    value={jobExperience}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(50, parseInt(e.target.value) || 0)); // Clamp between 0 and 50
                      setJobExperience(value);
                    }}
                    required
                  />

                  <label htmlFor="questions" className="block mb-2 text-sm font-medium text-gray-800">
                    Number of Questions
                  </label>
                  <Input
                    id="questions"
                    placeholder="Ex. 5"
                    type="number"
                    max="50"
                    value={questions}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(50, parseInt(e.target.value) || 0)); // Clamp between 0 and 50
                      setQuestions(value);
                    }}
                    required
                  />

                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)} className="px-4 py-2">Cancel</Button>
                  <Button type="submit" disabled={loading} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600">{loading ? <LoaderCircle className="w-5 h-5 animate-spin mr-2" /> : 'Start Interview'}</Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;

