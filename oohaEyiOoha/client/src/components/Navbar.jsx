import React from 'react';
import { FaPowerOff } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="bg-orange-950 text-white flex items-center justify-between px-4 py-2">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="block">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <span className="flex text-xl font-bold ">Logo</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className='text-2xl'>
          <FaPowerOff className='mr-4'/>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
