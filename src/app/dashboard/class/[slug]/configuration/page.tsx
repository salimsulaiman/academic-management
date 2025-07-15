"use client";
import { useAcademicStore } from "@/store/useAcademicStore";
import { Slider, TextField } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ConfigurationPage = () => {
  const params = useParams();
  const { data } = useAcademicStore((state) => state);
  const { slug } = params;

  const classData = data?.classes.find((item) => item.slug === slug);
  const initialComponents = classData?.gradeConfig?.components ?? [];

  console.log(initialComponents);

  const [gradeComponents, setGradeComponents] = useState<Record<string, number>>({});

  useEffect(() => {
    if (initialComponents.length > 0) {
      const mapped = Object.fromEntries(initialComponents.map((comp) => [comp.name, comp.weight]));
      setGradeComponents(mapped);
    }
  }, [initialComponents]);

  const handleChange = (component: string, value: number) => {
    setGradeComponents((prev) => ({
      ...prev,
      [component]: value,
    }));
  };

  const total = Object.values(gradeComponents).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full">
      <div className="bg-blue-violet-600 w-full p-8 rounded-2xl">
        <div className="flex gap-4 flex-col md:flex-row justify-between items-start md:items-center">
          <div className="">
            <h1 className="text-white text-xl">Konfigurasi Komponen Nilai</h1>
            <h4 className="text-slate-200 mt-2">
              <span className="font-medium">{classData?.name}</span> - {classData?.semester}
            </h4>
          </div>
          <button className="rounded-full bg-white px-4 py-2 text-blue-violet-600 text-sm cursor-pointer hover:bg-slate-100">
            Simpan
          </button>
        </div>
      </div>
      <div className="flex w-full gap-4 mt-8">
        <div className="w-1/2">
          <div className="w-full rounded-2xl bg-white dark:bg-gray-800 shadow-sm p-8">
            <h4 className="font-medium">Persentase Komponen Nilai</h4>
            <div className="w-full">
              {Object.entries(gradeComponents).map(([component, percentage]) => (
                <div key={component} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                    {component}
                  </label>

                  <div className="flex items-center gap-3">
                    <Slider
                      value={percentage}
                      onChange={(_, value) => handleChange(component, value as number)}
                      min={0}
                      max={100}
                      step={1}
                      className="flex-1"
                      size="small"
                      sx={{ color: "#6C5DD3" }}
                    />

                    <input
                      type="number"
                      value={percentage}
                      onChange={(e) => handleChange(component, parseInt(e.target.value) || 0)}
                      className="w-10 focus:outline-none"
                    />

                    <span className="text-sm text-gray-600 dark:text-gray-300">%</span>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700 dark:text-white">Total Persentase:</span>
                  <span className={`font-bold ${total === 100 ? "text-green-600" : "text-red-600"}`}>{total}%</span>
                </div>
                {total !== 100 && (
                  <p className="text-sm text-red-600 mt-2">Total persentase harus 100%. Saat ini: {total}%</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="w-1/2">
          <div className="w-full rounded-2xl bg-white dark:bg-gray-800 shadow-sm p-4"></div>
        </div> */}
      </div>
    </div>
  );
};

export default ConfigurationPage;
