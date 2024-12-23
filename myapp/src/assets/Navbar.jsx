import React from 'react';
import logo from '../assets/logo.png';
const Navbar = () => {
    return (
        <div className="bg-black w-full h-20 flex items-center justify-between px-6">
            <div className="text-white text-3xl font-semibold flex flex-row">
                <img src={logo} className='w-12 h-12 mr-4'/>
                Cohere
            </div>
            <button className="text-black font-semibold bg-white hover:bg-slate-200 px-4 py-2 m-4 rounded-md">
                Log in
            </button>
        </div>
    );
};

export default Navbar;
