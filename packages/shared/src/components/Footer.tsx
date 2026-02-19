import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container text-center">
        <h3 className="text-xl font-bold mb-4">Trespics School</h3>
        <p className="mb-4 text-gray-400">Empowering minds, shaping futures with excellence in education.</p>
        <div className="flex justify-center gap-4 mb-8">
           <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
           <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
           <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
        </div>
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Trespics School. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
