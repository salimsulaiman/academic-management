"use client";
import { useAcademicStore } from "@/store/useAcademicStore";
import { Box, Slider, Tab, Tabs } from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import ChapterCard from "@/components/ChapterCard";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface FormValues {
  chapter: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ mt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ConfigurationPage = () => {
  const params = useParams();

  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    addChapter(data.chapter);
    reset();
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { data } = useAcademicStore((state) => state);
  const { slug } = params;

  const classData = useMemo(() => {
    return data?.classes.find((item) => item.slug === slug);
  }, [data, slug]);
  const initialComponents = useMemo(() => {
    return classData?.gradeConfig?.components ?? [];
  }, [classData]);
  const [chapters, setChapters] = useState(classData?.gradeConfig?.chapters ?? []);

  console.log(chapters);

  const [gradeComponents, setGradeComponents] = useState<Record<string, number>>({});

  useEffect(() => {
    if (initialComponents.length > 0) {
      const mapped = Object.fromEntries(initialComponents.map((comp) => [comp.name, comp.weight]));
      setGradeComponents(mapped);
    }
  }, [initialComponents]);

  useEffect(() => {
    if (classData?.gradeConfig?.chapters) {
      setChapters(classData.gradeConfig.chapters);
    }
  }, [classData]);

  const handleChange = (component: string, value: number) => {
    setGradeComponents((prev) => ({
      ...prev,
      [component]: value,
    }));
  };

  const total = Object.values(gradeComponents).reduce((a, b) => a + b, 0);

  const preview = useMemo(() => {
    const total = Object.values(gradeComponents).reduce((a, b) => a + b, 0);

    const chaptersPreview =
      chapters.map((chapter) => {
        const sum = Object.entries(chapter.contribution).reduce((acc, [, val]) => acc + val, 0);
        return {
          name: chapter.name,
          total: sum,
          isValid: sum === 100,
        };
      }) ?? [];

    const overallValid =
      total === 100 &&
      chapters.every((c) => {
        const sum = Object.values(c.contribution).reduce((a, b) => a + b, 0);
        return sum === 100;
      });

    return {
      totalPercentage: total,
      validComponents: total === 100,
      chapters: chaptersPreview,
      overallValid,
    };
  }, [gradeComponents, chapters]);

  const addChapter = (chapterName: string) => {
    if (!chapterName.trim()) return;

    const newId = Math.max(...chapters.map((c) => c.id), 0) + 1;

    const defaultContribution: Record<string, number> = {};
    initialComponents.forEach((comp) => {
      defaultContribution[comp.name] = 20;
    });

    setChapters((prev) => [
      ...prev,
      {
        id: newId,
        name: chapterName,
        contribution: defaultContribution,
      },
    ]);
  };

  const getChapterTotalWeight = (chapterId: number) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return 0;
    return Object.values(chapter.contribution).reduce((sum, weight) => sum + weight, 0);
  };

  const removeChapter = (chapterId: number) => {
    setChapters((prev) => prev.filter((c) => c.id !== chapterId));
  };

  const updateChapterWeight = (chapterId: number, componentName: string, weight: number) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              contribution: {
                ...chapter.contribution,
                [componentName.toString()]: Math.max(0, Math.min(100, weight)),
              },
            }
          : chapter
      )
    );
  };

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
      <Box className="mt-4" sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
            <Tab
              label="Grade Component"
              {...a11yProps(0)}
              sx={{
                textTransform: "none",
                color: theme.palette.mode === "dark" ? "#fff" : "inherit",
              }}
            />
            <Tab
              label="Chapter Weigth"
              {...a11yProps(1)}
              sx={{
                textTransform: "none",
                color: theme.palette.mode === "dark" ? "#fff" : "inherit",
              }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <div className="w-full rounded-2xl bg-white dark:bg-gray-800 shadow-sm p-8">
            <h4 className="font-medium">Persentase Komponen Nilai</h4>
            <div className="w-full mt-4">
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
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border-2 border-dashed border-blue-300 dark:border-gray-600 mt-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Total Configuration</h3>
                  <span
                    className={`text-3xl font-bold ${
                      total === 100 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {total}%
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        total === 100 ? "bg-green-500" : total > 100 ? "bg-red-500" : "bg-yellow-500"
                      }`}
                      style={{ width: `${Math.min(total, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {total === 100 ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Configuration is valid</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span>{total > 100 ? `Exceeds by ${total - 100}%` : `Missing ${100 - total}%`}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <div className="mb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter chapter name"
                {...register("chapter", { required: "Chapter name is required" })}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <AddIcon className="w-4 h-4" />
                Add Chapter
              </button>
            </form>
            {errors.chapter && <p className="text-red-500 text-sm mt-4">{errors.chapter.message}</p>}
          </div>
          <div className="space-y-6">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
              {chapters.map((chapter) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  initialComponents={initialComponents}
                  updateChapterWeight={updateChapterWeight}
                  removeChapter={removeChapter}
                  getChapterTotalWeight={getChapterTotalWeight}
                />
              ))}
            </div>
          </div>
        </CustomTabPanel>
      </Box>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="w-full sm:w-fit">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Configuration Status</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              <div
                className={`flex items-center gap-2 ${
                  preview.validComponents ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${preview.validComponents ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm">Components: {preview.totalPercentage}%</span>
              </div>

              <div
                className={`flex items-center gap-2 ${
                  preview.chapters.every((c) => c.isValid)
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    preview.chapters.every((c) => c.isValid) ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm">
                  Chapters: {preview.chapters.filter((c) => c.isValid).length}/{preview.chapters.length} valid
                </span>
              </div>
            </div>
          </div>
          <div
            className={`px-6 py-3 rounded-lg w-full sm:w-fit mt-4 sm:mt-0 font-medium ${
              preview.overallValid
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {preview.overallValid ? "Configuration Valid" : "Configuration Invalid"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
