'use client';

import { Volume2 } from "lucide-react";
import { useState, useEffect } from "react";

function QuestionSection({ mockInterviewQuestions = [], activeQuestionIndex , setActiveQuestionIndex }) {
  // State to track if the speech is currently speaking
  const [isSpeaking, setIsSpeaking] = useState(false);

  const textTOSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);

      // When speech starts, set isSpeaking to true
      speech.onstart = () => setIsSpeaking(true);

      // When speech ends, set isSpeaking to false
      speech.onend = () => setIsSpeaking(false);

      if (isSpeaking) {
        // If already speaking, cancel the current speech and reset the state
        window.speechSynthesis.cancel();
        setIsSpeaking(false);  // Ensure the state is reset
      } else {
        // Start speaking the new text
        window.speechSynthesis.speak(speech);
      }
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };

  // Check if `mockInterviewQuestions` is undefined or empty
  const hasQuestions = Array.isArray(mockInterviewQuestions) && mockInterviewQuestions.length > 0;

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-gray-50 max-w-4xl mx-auto">
      {/* Grid for questions */}
      <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-3 lg:grid-cols-4 mb-6">
        {hasQuestions ? (
          mockInterviewQuestions.map((question, index) => (
            <div key={index}
             className="cursor-pointer"
             onClick={() => setActiveQuestionIndex(index)}
             >
              <h2
                className={`${
                  activeQuestionIndex === index
                    ? 'bg-purple-600 text-white border-transparent p-4 font-semibold rounded-full shadow-lg transform hover:scale-105 transition duration-300'
                    : 'bg-gray-200 text-black border-gray-300 p-4 font-semibold rounded-full hover:bg-gray-300 transition duration-300 transform hover:scale-105'
                }`}
              >
                Question #{index + 1}
              </h2>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No questions available.</p>
        )}
      </div>

      {/* Display active question */}
      <div className="flex items-center justify-center mt-8">
        {hasQuestions && (
          <h2 className="text-lg font-medium text-gray-800 md:text-xl max-w-2xl mb-6">
            {mockInterviewQuestions[activeQuestionIndex]?.question || "No active question."}
          </h2>
        )}
      </div>

      {/* Volume icon that triggers text-to-speech or stops it */}
      <div className="flex justify-center mt-4">
        <Volume2
          className={`w-10 h-10 text-gray-600 cursor-pointer transition-transform duration-300 ${isSpeaking ? 'text-red-500 animate-pulse' : 'hover:text-purple-600'}`}
          onClick={() => textTOSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)}
        />
      </div>
    </div>
  );
}

export default QuestionSection;
