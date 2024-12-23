import React from 'react';
import logo from '../assets/logo.png';
const Footer = () => {
    return (
        <footer className="bg-black text-white py-12">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 px-6">
                <div className="text-lg font-semibold flex flex-row">
                    <img src={logo} className='h-12 w-12 mx-6'/> Cohere © {new Date().getFullYear()}
                </div>
                <div className="flex space-x-6">
                    <a href="#" className="hover:text-gray-400">
                        About
                    </a>
                    <a href="#" className="hover:text-gray-400">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-gray-400">
                        Terms of Service
                    </a>
                    <a href="#" className="hover:text-gray-400">
                        Contact
                    </a>
                </div>
                <div className="flex space-x-4 mr-8">
                    <a href="#" className="hover:text-gray-400">
                        <i className="fab fa-facebook"></i>
                    </a>
                    <a href="#" className="hover:text-gray-400">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="hover:text-gray-400">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="hover:text-gray-400">
                        <i className="fab fa-linkedin"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
