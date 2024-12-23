import React from 'react';
import Navbar from '../assets/Navbar';
import desk from '../assets/Designer Desk.png'; 
import Footer from '../assets/Footer';

const Home = () => {
    return (
        <div className="h-screen w-full">
            <Navbar />
            <div className="flex items-center justify-center h-full space-x-16">
                <div className="text-center">
                    <h1 className="text-5xl font-semibold animate-pulse">
                        Welcome to Cohere
                    </h1>
                    <h2 className="mt-4 text-lg text-black text-3xl font-semibold">
                        Your one-stop solution for collaboration and productivity.
                    </h2>
                    <button class="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 mt-4 rounded">
                    Get started <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
                <div>
                    <img
                        src={desk}
                        alt="Designer Desk"
                        className="max-w-md h-auto object-contain"
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
