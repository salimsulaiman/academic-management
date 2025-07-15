"use client";
import ClassCard from "@/components/Card";
import { useAcademicStore } from "@/store/useAcademicStore";
import { Button, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const ClassesPage = () => {
  const semesterOptions = ["Semua Semester", "Ganjil 2024/2025"];
  const statusOptions = ["Semua Status", "Selesai", "Sebagian", "Belum"];
  const [semester, setSemester] = useState(semesterOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [openSemester, setOpenSemester] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const { data } = useAcademicStore((state) => state);

  const semesterRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (semesterRef.current && !semesterRef.current.contains(event.target as Node)) {
        setOpenSemester(false);
      }

      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setOpenStatus(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full flex gap-4">
      <div className="w-full md:w-4/6">
        <div className="bg-blue-violet-600 w-full p-8 rounded-2xl">
          <div className="flex gap-4 flex-col md:flex-row justify-between items-start md:items-center">
            <div className="">
              <h1 className="text-white text-xl">Grade Management System</h1>
              <h4 className="text-slate-200 mt-2">Kelola nilai mahasiswa dengan mudah dan efisien</h4>
            </div>
            <button className="rounded-full bg-white px-4 py-2 text-blue-violet-600 text-sm cursor-pointer hover:bg-slate-100">
              Enroll Class
            </button>
          </div>
        </div>
        <div className="w-full mt-8 mb-4">
          <div className="flex gap-4 justify-between items-start flex-wrap sm:items-center">
            <h4 className="text-lg font-semibold">All Class</h4>

            {/* Filter Container */}
            <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap w-full sm:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pr-10 pl-4 py-2 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                    />
                  </svg>
                </span>
              </div>

              {/* Semester Dropdown */}
              <div className="relative w-full sm:w-auto" ref={semesterRef}>
                <button
                  onClick={() => {
                    setOpenSemester(!openSemester);
                    setOpenStatus(false);
                  }}
                  className="w-full sm:w-auto text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {semester}
                </button>
                {openSemester && (
                  <div className="absolute mt-2 w-full sm:w-48 text-center sm:text-start bg-white dark:bg-gray-800 shadow rounded-md overflow-hidden z-10">
                    {semesterOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setSemester(option);
                          setOpenSemester(false);
                        }}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 ${
                          semester === option ? "font-semibold text-indigo-600 dark:text-indigo-400" : ""
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Dropdown */}
              <div className="relative w-full sm:w-auto" ref={statusRef}>
                <button
                  onClick={() => {
                    setOpenStatus(!openStatus);
                    setOpenSemester(false);
                  }}
                  className="w-full sm:w-auto text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {status}
                </button>
                {openStatus && (
                  <div className="absolute mt-2  w-full sm:w-48 text-center sm:text-start z-10 bg-white dark:bg-gray-800 shadow rounded-md overflow-hidden">
                    {statusOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setStatus(option);
                          setOpenStatus(false);
                        }}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 ${
                          status === option ? "font-semibold text-indigo-600 dark:text-indigo-400" : ""
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.classes.map((item, index) => (
            <ClassCard
              key={index}
              slug={item?.slug}
              className={item?.name}
              semester={item?.semester}
              studentCount={item?.students.length}
              isConfigured={item?.gradeConfig?.components?.length === 5}
              gradedCount={item?.grades.length}
              classId={`${item?.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;
