import React from 'react';
import { Link } from 'react-router-dom';

const Portals = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="py-8 flex justify-center rounded-t-lg absolute top-0 left-1/2 transform -translate-x-1/2 w-2/4 rounded-b-full">
        <h1 className="text-secondary text-5xl font-bold font-Italic">AutoHub</h1>
      </div>
      <div className="w-1/5 mt-40  text-center text-gray">
        <div>
          <p className="text-secondary text-2xl font-semibold font-serif mt-20">Best Garage Management System</p>
          <p className="text-lg">Discover a world of efficiency and excellence.</p>
        </div>
      </div>
      {/* Right Side */}
      <div className="w-4/5 mt-40  flex  flex-row relative">
        <div className="w-4/5 h-96 mt-20 mr-8  mx-auto flex  flex-row shadow-2xl rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-10 gap-4 mx-auto p-5 pt-10 mb-10 ">
            <Link to={`/signin?role=Reception`} className="group bg-white shadow-md rounded-lg w-45 p-10 hover:bg-green-600 hover:text-white transition duration-300">
              <img src="/Reception.png" alt="Reception Icon" className="w-20 h-20 lg:w-40 lg:h-40 object-cover rounded-md mb-4 mx-auto" />
              <h3 className="text-center text-lg font-semibold group-hover:text-white">Reception</h3>
            </Link>
            <Link to={`/signin?role=Operations`} className="group bg-white shadow-md rounded-lg  p-10 hover:bg-green-600 hover:text-white transition duration-300">
              <img src="/operations.png" alt="Operations Icon" className="w-20 h-20 lg:w-full lg:h-40 object-cover rounded-md mb-4  mx-auto" />
              <h3 className="text-center text-lg font-semibold group-hover:text-white">Operations</h3>
            </Link>
            <Link to={`/signin?role=Accountant`} className="group bg-white shadow-md rounded-lg p-10  hover:bg-green-600 hover:text-white transition duration-300">
              <img src="/Accountant.png" alt="Accountant Icon" className="w-20 h-20 lg:w-full lg:h-40 object-cover rounded-md mb-4 mx-auto" />
              <h3 className="text-center text-lg font-semibold group-hover:text-white">Accountant</h3>
            </Link>
            <Link to={`/signin?role=Admin`} className="group bg-white shadow-md rounded-lg p-10  hover:bg-green-600 hover:text-white transition duration-300">
              <img src="/user.png" alt="Admin Icon" className="w-20 h-20 lg:w-full lg:h-40 object-cover rounded-md mb-4 mx-auto" />
              <h3 className="text-center text-lg font-semibold group-hover:text-white">Admin</h3>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portals;
