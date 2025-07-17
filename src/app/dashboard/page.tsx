"use client";
import ClassCard from "@/components/Card";
import { useAcademicStore } from "@/store/useAcademicStore";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
const DashboardPage = () => {
  const { data } = useAcademicStore((state) => state);
  return (
    <div className="w-full flex gap-4">
      <div className="w-full">
        <div className="bg-blue-violet-600 w-full p-8 rounded-2xl">
          <h1 className="text-white text-xl">
            Good Morning, <span className="font-semibold">Salim Sulaiman</span>
          </h1>
          <h4 className="text-slate-200 mt-2">Have a nice day</h4>
        </div>
        <div className="w-full mt-8 mb-4">
          <div className="flex gap-4 justify-between">
            <h4 className="text-lg font-semibold">Last Edited</h4>
            <div className="flex gap-2 items-center">
              <button className="h-6 w-6 bg-white rounded-full flex items-center justify-center p-4 hover:bg-blue-violet-600 hover:text-white cursor-pointer dark:text-slate-700">
                <NavigateBeforeIcon className="h-6 w-6" />
              </button>
              <button className="h-6 w-6 bg-white rounded-full flex items-center justify-center p-4 hover:bg-blue-violet-600 hover:text-white cursor-pointer dark:text-slate-700">
                <NavigateNextIcon className="h-6 w-6" />
              </button>
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
    </div>
  );
};

export default DashboardPage;
