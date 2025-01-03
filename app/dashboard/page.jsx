// import { UserButton } from '@clerk/nextjs'

import React from 'react'
import Header from './_components/Header'
import AddNewInterview from './_components/AddNewInterview'

const Dashboard = () => {
  return (
    <div className=''>
      <Header />
      <div className='mx-5 md:mx-20 lg:mx-36 mt-14'>
        <h1 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-900 ">
          Dashboard
        </h1>
        <h2 className='font-semibold mt-1 text-gray-500'>
          CREATE AND START YOUR  AI MOCK INTREVIEW
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
          <AddNewInterview />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
