"use client";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useRouter } from "next/navigation";

interface ClassCardProps {
  className: string;
  semester: string;
  studentCount: number;
  isConfigured: boolean;
  classId: string;
  gradedCount: number;
  slug: string;
}

export default function ClassCard({
  className,
  semester,
  studentCount,
  isConfigured,
  classId,
  slug,
  gradedCount,
}: ClassCardProps) {
  const router = useRouter();

  const progressPercentage = studentCount > 0 ? Math.round((gradedCount / studentCount) * 100) : 0;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-4xl shadow-sm p-4 flex flex-col justify-between min-h-[180px] relative">
      <div className="w-full aspect-video rounded-3xl bg-slate-200"></div>
      <div className="my-4">
        <div className="flex justify-between items-start w-full">
          <div className="w-full">
            <div className="flex gap-2 justify-between items-center w-full">
              <h2 className="text-lg font-medium line-clamp-1">{className}</h2>
              <CheckCircleIcon className="text-emerald-400" />
            </div>
            <p className="text-sm text-gray-500 mt-1">{semester}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 flex items-center gap-2">
          <span>
            <PeopleIcon className="text-slate-400" />
          </span>
          {studentCount} Mahasiswa
        </p>
        <div className="space-y-2 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-white">Progress Nilai</span>
            <span className="font-medium">
              {gradedCount}/{studentCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-violet-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-auto items-center justify-center">
        <Button
          onClick={() => router.push(`/dashboard/class/${slug}/configuration`)}
          disableElevation
          disableRipple
          className="flex-1 bg-blue-violet-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-white hover:bg-blue-violet-200 dark:hover:bg-violet-600 normal-case rounded-full flex items-center gap-1 py-2 justify-center"
        >
          <span>
            <SettingsIcon className="h-4" />
          </span>
          Konfigurasi
        </Button>
        <Button
          onClick={() => router.push(`/dashboard/class/${slug}/nilai`)}
          disableElevation
          disableRipple
          className="flex-1 bg-emerald-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-white hover:bg-emerald-200 dark:hover:bg-emerald-600 normal-case rounded-full flex items-center gap-1 py-2 justify-center"
        >
          <span>
            <BarChartIcon className="h-4" />
          </span>
          Nilai
        </Button>
      </div>
    </div>
  );
}
