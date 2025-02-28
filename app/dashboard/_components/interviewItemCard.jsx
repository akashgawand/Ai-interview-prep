import Link from 'next/link';
import React from 'react';
import { Button } from '../../components/ui/button';

const InterviewItemCard = ({ interview }) => {
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
        <Button className="bg-purple-500 mt-4">
          Feedback
        </Button>
      </Link>
    </div>
  );
};

export default InterviewItemCard;