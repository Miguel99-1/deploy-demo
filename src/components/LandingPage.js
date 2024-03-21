// LandingPage.js
import React from "react";
import { Link } from "react-router-dom";
import { LuArrowRight, LuUser } from "react-icons/lu";
import { HiOutlineLightBulb } from "react-icons/hi";

const LandingPage = ({ user }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <header className="max-w-xl w-full bg-blue-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-1">
          Bem-vindo ao NBATracker
        </h1>
        <p className="text-lg text-center text-gray-300 mb-3">
          O site número um para notícias, estatísticas e análises sobre a NBA.
        </p>
        {user ? (
          <div className="flex justify-center">
            <Link to={"/profile"}>
              <button className="p-2 bg-white text-black rounded-lg text-sm px-4 flex gap-1">
                <LuUser className="h-4 w-4 mt-0.5" />
                Ver perfil
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-row gap-5 justify-center">
              <Link to={"/register"}>
                <button className="p-2 bg-white text-black rounded-lg text-sm px-4 flex">
                  <HiOutlineLightBulb className="h-4 w-4 mt-0.5 mr-1" />
                  Learn More
                </button>
              </Link>
              <Link to={"/login"}>
                <button className="p-2 bg-white text-black rounded-lg text-sm px-4 flex">
                  Get Started
                  <LuArrowRight className="h-4 w-4 mt-0.5 ml-1" />
                </button>
              </Link>
            </div>
          </>
        )}
      </header>
    </div>
  );
};

export default LandingPage;
