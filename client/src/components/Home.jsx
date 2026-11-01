import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const teachers = [
    { name: "Jenny Mam — Physics", path: "/alakh" },
    { name: "Rahul Sir — Mathematics", path: "/rahul" },
    { name: "Priya Mam — Chemistry", path: "/priya" },
    { name: "Amit Sir — Biology", path: "/amit" },
    { name: "Sneha Mam — English", path: "/sneha" },
    { name: "Vikram Sir — Computer Science", path: "/vikram" },
    { name: "Anita Mam — History", path: "/anita" },
  ];

  return (
    <div className="flex min-h-[calc(100dvh-64px)] flex-col items-center bg-gradient-to-br from-gray-900 via-black to-gray-950 p-4 font-inter text-white sm:p-8">
      <nav className="mb-6 flex w-full max-w-6xl flex-wrap justify-center gap-2 sm:justify-end sm:gap-3">
        <Link
          to="/pdf-tutor"
          className="rounded-full bg-gray-800 px-4 py-2 text-center text-sm font-semibold text-white shadow-md hover:bg-gray-700 sm:px-5 sm:text-base"
        >
          📄 Ask a PDF
        </Link>
        <Link
          to="/viva"
          className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 px-4 py-2 text-center text-sm font-semibold text-white shadow-md hover:opacity-90 sm:px-5 sm:text-base"
        >
          🎤 Personalized Viva
        </Link>
      </nav>

      <h1 className="mb-8 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 bg-clip-text text-center text-3xl font-bold text-transparent drop-shadow-md sm:mb-10 sm:text-4xl md:text-5xl">
        Choose Your AI Tutor
      </h1>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {teachers.map((teacher, idx) => (
          <div
            key={idx}
            onClick={() => navigate(teacher.path)}
            className="group relative cursor-pointer rounded-3xl bg-gradient-to-br from-[#1b1b2f] to-[#2b2b45] p-5 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-indigo-700/40 sm:p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold shadow-lg sm:h-20 sm:w-20">
                {teacher.name.split(" ")[0][0]}
              </div>
              <h2 className="text-xl md:text-2xl font-semibold">{teacher.name}</h2>
              <p className="text-gray-400 text-sm">
                Click to start learning with {teacher.name.split(" ")[0]}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-gray-500 text-sm text-center">
        © 2026 DevilTutor — Your Smart AI Learning Assistant
      </div>
    </div>
  );
}
