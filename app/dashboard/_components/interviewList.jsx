'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq , desc} from 'drizzle-orm';
import InterviewItemCard from './interviewItemCard';


const InterviewLists = () => {

    const {user} = useUser();
    const [interviewList, setInterviewList] = useState([]);
    useEffect(() => {
      user && getInterviewList();
    },
    [user]
    )


    const getInterviewList = async () => {
      const result = await db.select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(MockInterview.id))
      console.log(result)
      setInterviewList(result);
    }
    
  return (
    <div className='mt-10'>
    <div>
      <h1 className='text-2xl font-bold text-purple-500 '>Mock Interview List</h1>
    </div>
    <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 hover:border-purple-300'>
        {
          
            interviewList && interviewList.map((interview,index)=>(
                <InterviewItemCard key={index} interview={interview}/>
            ))
        }

    </div>
    </div>
  )
}

export default InterviewLists;
