"use client"
import React, { useEffect } from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

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

        <li className={`hover:text-purple-600  font-semibold  text-xl transition-all cursor-pointer
         ${path==='/interview' && 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'} `}>Interview </li>
        
        <li className={` hover:text-purple-600 font-semibold  text-xl transition-all cursor-pointer
          ${path==='/dashboard' && 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'} `}>Dashboard </li>
       
        <li className={` hover:text-purple-600 font-semibold  text-xl transition-all cursor-pointer
          ${path==='/questions' && 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'} `}>Questions </li>
       
        <li className={` hover:text-purple-600 font-semibold  text-xl transition-all cursor-pointer
          ${path==='/upgrade' && 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'} `}>Upgrade </li>
       
        <li className={` hover:text-purple-600 font-semibold  text-xl transition-all cursor-pointer 
          ${path==='/HowItWorks' && 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'}`}>How it works? </li>
        
      </ul>
      <UserButton />
    </div>
  );
};

export default Header;
