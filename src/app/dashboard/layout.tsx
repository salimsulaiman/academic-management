"use client";

import Topbar from "@/components/Topbar";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAcademicStore } from "@/store/useAcademicStore";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();
  const setData = useAcademicStore((state) => state.setData);

  useEffect(() => {
    fetch("/academic-data.json")
      .then((res) => res.json())
      .then(setData);
  }, []);
  return (
    <main className={`flex flex-col flex-1 transition-all duration-300 ${open ? "ml-0 md:ml-64" : "ml-0 md:ml-20"}`}>
      <Topbar />
      <div className="p-5 sm:p-8">{children}</div>
    </main>
  );
}
