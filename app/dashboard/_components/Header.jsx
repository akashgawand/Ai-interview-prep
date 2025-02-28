"use client"
import React, { useEffect } from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from "next/link";
const Header = () => {

  const path=usePathname()
  useEffect(() => {
    console.log(path)
  },[])
  
  return (
    <div className='flex justify-between mx-4 items-center'>
      <Image
        src={"/ai prep logo 2.png"} // Assuming the image is in the public directory
        alt="AI Prep Logo"
        width={140}
        height={80}
      />
      <ul className='hidden md:flex gap-5'>

        <Link href={'/dashboard'}>
        <li className={` hover:text-purple-600 font-semibold  text-xl transition-all cursor-pointer
          ${path==='/dashboard' && 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'} `}>Dashboard </li>
       
        </Link>
       <Link href="/dashboard/history">
          <li className={`hover:text-purple-600 font-semibold text-xl transition-all cursor-pointer
            ${path === '/questions' && 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'}`}>
            History
          </li>
        </Link>
        {/* <li className={` hover:text-purple-600 font-semibold  text-xl transition-all cursor-pointer
          ${path==='/upgrade' && 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'} `}>Upgrade </li>
        */}
        <Link href="/dashboard/howItWorks">
          <li className={`hover:text-purple-600 font-semibold text-xl transition-all cursor-pointer
            ${path === '/howItWorks' && 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'}`}>
            How it works?
          </li>
        </Link>
      </ul>
      <UserButton />
    </div>
  );
};

export default Header;
