"use client";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSidebar } from "@/contexts/SidebarContext";
import Link from "next/link";
import { useEffect } from "react";

const menu = [
  { label: "Home", icon: DashboardIcon, link: "/dashboard" },
  { label: "Class", icon: SchoolIcon, link: "/dashboard/class" },
];

export default function Sidebar() {
  const { open, setOpen } = useSidebar();

  // Close sidebar when screen resized above md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen]);

  return (
    <>
      {/* Backdrop for mobile */}
      {open && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed z-40 top-0 left-0 inset-y-0 h-full bg-white dark:bg-gray-800 shadow-md transition-all duration-300 rounded-e-2xl
        ${open ? "w-64" : "w-0 md:w-20"}  md:block overflow-hidden md:overflow-visible`}
      >
        {/* Header Logo + Toggle */}
        <div className={`flex items-center ${open ? "justify-between" : "justify-center"} px-4 py-4`}>
          {open ? (
            <div className="text-base font-semibold whitespace-nowrap text-gray-700 dark:text-white h-11 flex items-center">
              Academic System
            </div>
          ) : (
            <div className="aspect-square p-2 rounded-lg bg-blue-violet-600 flex items-center justify-center text-white">
              AMS
            </div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-500 dark:text-gray-300 hidden md:flex items-center justify-center absolute -right-3 top-6 rounded-full bg-slate-300 dark:bg-slate-700"
          >
            {open ? <ChevronLeftIcon fontSize="medium" /> : <ChevronRightIcon fontSize="medium" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-2 space-y-2">
          {menu.map(({ label, icon: Icon, link }) => (
            <Link
              key={label}
              href={link}
              className={`flex items-center ${
                open ? "justify-start gap-3" : "justify-center"
              } px-3 py-2 rounded-md hover:bg-indigo-100 dark:hover:bg-gray-700 transition-all`}
            >
              <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span
                className={`text-gray-800 dark:text-white transition-all duration-300 
                  ${open ? "opacity-100 ml-1" : "opacity-0 w-0 overflow-hidden"}`}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
