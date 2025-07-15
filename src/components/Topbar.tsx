"use client";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import { useSidebar } from "@/contexts/SidebarContext";
import { useThemeMode } from "@/contexts/ThemeContext";

export default function Topbar() {
  const { theme, toggleTheme } = useThemeMode();
  const { open, setOpen } = useSidebar();

  return (
    <header
      className={`flex items-center justify-between bg-white dark:bg-slate-800 dark:md:bg-transparent md:bg-transparent  p-4 sticky top-0 z-20 md:pl-24`}
    >
      {/* Mobile menu button */}
      <button onClick={() => setOpen(!open)} className="md:hidden text-gray-600 dark:text-gray-300">
        <MenuIcon />
      </button>

      <div className="flex items-center gap-4 ml-auto">
        <NotificationsNoneIcon className="text-gray-700 dark:text-gray-300" />
        <button onClick={toggleTheme} className="text-gray-700 dark:text-white">
          {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </button>
        <img src="https://i.pravatar.cc/30" alt="User" className="w-8 h-8 rounded-full object-cover" />
      </div>
    </header>
  );
}
