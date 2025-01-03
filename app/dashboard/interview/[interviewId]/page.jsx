"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from "drizzle-orm";
import { WebcamIcon, Loader2 } from "lucide-react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/utils/GeminiAiModel";
import Link from 'next/link';

export default function InterviewPage({ params }) {
    const { interviewId } = params;
    const [interviewData, setInterviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [recording, setRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [summarizedJobDesc, setSummarizedJobDesc] = useState("");
    const router = useRouter();
    const info = process.env.NEXT_PUBLIC_INFORMATION;

    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    // Fetch interview data
    useEffect(() => {
        const fetchInterviewData = async () => {
            try {
                const data = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewId));
                if (data.length > 0) {
                    setInterviewData(data[0]);
                } else {
                    console.error('Interview not found');
                }
            } catch (error) {
                console.error('Error fetching interview data:', error);
                router.replace('/dashboard');
            }
        };

        if (interviewId) {
            fetchInterviewData();
        }
    }, [interviewId, router]);

    // Summarize job description
    useEffect(() => {
        if (interviewData) {
            const summarizeJobDesc = async () => {
                const inputPrompt = `Summarize the job description in 10 words: ${interviewData.jobDesc}`;
                try {
                    const result = await chatSession.sendMessage(inputPrompt);
                    const summarizedJobDesc = await result.response.text();
                    setSummarizedJobDesc(summarizedJobDesc);
                } catch (error) {
                    console.error("Error summarizing job description:", error);
                }
            };
            summarizeJobDesc();
            setLoading(false);
        }
    }, [interviewData]);

    // Start recording
    // const handleStartRecording = async () => {
    //     setRecordedChunks([]);
    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    //         if (!stream.getAudioTracks().length) {
    //             console.error("No audio tracks found. Ensure the microphone is enabled.");
    //             return;
    //         }

    //         const options = { mimeType: "video/webm; codecs=vp8,opus" };
    //         mediaRecorderRef.current = new MediaRecorder(stream, options);

    //         // Prevent audio loopback
    //         stream.getAudioTracks().forEach(track => (track.enabled = false));

    //         mediaRecorderRef.current.ondataavailable = (event) => {
    //             if (event.data.size > 0) {
    //                 setRecordedChunks((prev) => [...prev, event.data]);
    //             }
    //         };

    //         mediaRecorderRef.current.start();
    //         setRecording(true);
    //     } catch (error) {
    //         console.error("Error accessing webcam and microphone:", error);
    //     }
    // };

    // // Stop recording
    // const handleStopRecording = () => {
    //     if (mediaRecorderRef.current) {
    //         mediaRecorderRef.current.stop();
    //         setRecording(false);

    //         // Restore audio track playback
    //         const stream = mediaRecorderRef.current.stream;
    //         stream.getAudioTracks().forEach(track => (track.enabled = true));
    //     }
    // };

    // // Download recorded video
    // const handleDownload = () => {
    //     const blob = new Blob(recordedChunks, { type: "video/webm" });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.download = "recording.webm";
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-50 to-pink-50">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    // If no interview data found
    if (!interviewData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-purple-50 p-4 md:p-8 lg:p-12">
            <div className="max-w-6xl mx-auto mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-purple-100 hover:border-purple-300">
                            <h2 className="text-xl font-semibold text-purple-800 mb-4">Interview Details</h2>
                            <div className="space-y-3">
                                <p><span className="font-semibold">Job Role:</span> {interviewData.jobPosition}</p>
                                <p><span className="font-semibold">Job Description:</span> {summarizedJobDesc}</p>
                                <p><span className="font-semibold">Years of Experience:</span> {interviewData.jobExperience}</p>
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-blue-100 hover:border-blue-300">
                            <h2 className="text-xl font-semibold text-blue-800 mb-4">💡 Information</h2>
                            <p className="text-gray-700">{info}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        {webCamEnabled ? (
                            <>
                                <Webcam
                                    audio={false} // Prevent loopback
                                    ref={webcamRef}
                                    mirrored={true}
                                    onUserMedia={() => setWebCamEnabled(true)}
                                    onUserMediaError={(error) => console.error("Webcam error:", error)}
                                    className="rounded-xl shadow-lg w-full max-w-md aspect-video"
                                />
                                
                            </>
                        ) : (
                            <>
                                <div className="bg-purple-100 rounded-xl border-2 border-purple-200 p-8 transition-all duration-300 hover:shadow-lg hover:border-purple-300 w-full max-w-md aspect-video flex items-center justify-center">
                                    <WebcamIcon className="w-24 h-24 text-purple-400" />
                                </div>
                                <Button
                                    className="text-lg bg-gradient-to-r from-blue-500 to-purple-400 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
                                    onClick={() => setWebCamEnabled(true)}
                                >
                                    Enable Web Cam and Microphone
                                </Button>
                            </>
                        )}
                        <Link href={`/dashboard/interview/${interviewId}/start`}>
                            <Button className="text-lg bg-gradient-to-r
                             from-blue-500 to-purple-400
                              hover:from-purple-700 hover:to-purple-900
                               text-white font-semibold py-3 px-6
                                rounded-lg shadow-lg">
                                    
                                Start
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
