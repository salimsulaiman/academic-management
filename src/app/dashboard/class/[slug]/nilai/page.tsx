"use client";
import { useAcademicStore } from "@/store/useAcademicStore";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import InputPage from "./(NilaiPage)/InputPage";
import CalculationPage from "./(NilaiPage)/CalculationPage";
import SummaryPage from "./(NilaiPage)/SummaryPage";

const NilaiPage = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const { data } = useAcademicStore((state) => state);

  const classData = useMemo(() => {
    return data?.classes.find((item) => item.slug === slug);
  }, [data, slug]);

  const [grades, setGrades] = useState<Record<number, Record<string, Record<string, number | string>>>>({});
  const [selectedChapter, setSelectedChapter] = useState<string>(classData?.gradeConfig.chapters[0]?.name || "");
  const [viewMode, setViewMode] = useState<"input" | "calculation" | "summary">("input");
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showContributions, setShowContributions] = useState<boolean>(false);

  useEffect(() => {
    const initialGrades: Record<number, Record<string, Record<string, string>>> = {};

    classData?.students.forEach((student) => {
      initialGrades[student.id] = {};
      classData.gradeConfig.components.forEach((component) => {
        initialGrades[student.id][component.name] = {};
        classData.gradeConfig.chapters.forEach((chapter) => {
          initialGrades[student.id][component.name][chapter.name] = "";
        });
      });
    });

    setGrades(initialGrades);
  }, [classData]);

  const calculateFinalGrade = (studentId: number): string => {
    const studentGrades = grades[studentId] || {};
    let totalScore = 0;

    classData?.gradeConfig.components.forEach((component) => {
      const componentGrades = studentGrades[component.name] || {};
      let componentScore = 0;
      let totalContribution = 0;

      classData.gradeConfig.chapters.forEach((chapter) => {
        const contribution = chapter.contribution[component.name] || 0;
        totalContribution += contribution;
      });

      if (totalContribution > 0) {
        classData.gradeConfig.chapters.forEach((chapter) => {
          const grade = parseFloat(String(componentGrades[chapter.name])) || 0;
          const contribution = chapter.contribution[component.name] || 0;
          const normalizedContribution = (contribution / totalContribution) * 100;
          componentScore += (grade * normalizedContribution) / 100;
        });

        totalScore += (componentScore * component.weight) / 100;
      }
    });

    return totalScore.toFixed(1);
  };

  const calculateCompletionPercentage = () => {
    if (!classData) return 0;
    const totalFields =
      classData?.students.length * classData?.gradeConfig.components.length * classData?.gradeConfig.chapters.length;
    let filledFields = 0;

    classData?.students.forEach((student) => {
      classData?.gradeConfig.components.forEach((component) => {
        classData?.gradeConfig.chapters.forEach((chapter) => {
          if (grades[student.id]?.[component.name]?.[chapter.name]) {
            filledFields++;
          }
        });
      });
    });

    return totalFields > 0 ? ((filledFields / totalFields) * 100).toFixed(1) : "0.0";
  };

  const getLetterGrade = (score: string) => {
    const num = parseFloat(score);
    if (num >= 85) return "A";
    if (num >= 80) return "A-";
    if (num >= 75) return "B+";
    if (num >= 70) return "B";
    if (num >= 65) return "B-";
    if (num >= 60) return "C+";
    if (num >= 55) return "C";
    if (num >= 50) return "C-";
    if (num >= 45) return "D";
    return "E";
  };

  useEffect(() => {
    if (!classData) return;

    const initialGrades: Record<number, Record<string, Record<string, number | string>>> = {};

    classData.students.forEach((student) => {
      initialGrades[student.id] = {};
      classData.gradeConfig.components.forEach((component) => {
        initialGrades[student.id][component.name] = {};
        classData.gradeConfig.chapters.forEach((chapter) => {
          initialGrades[student.id][component.name][chapter.name] = "";
        });
      });
    });

    classData.grades.forEach((gradeEntry) => {
      const studentId = gradeEntry.studentId;
      Object.entries(gradeEntry.components).forEach(([componentName, chapters]) => {
        Object.entries(chapters).forEach(([chapterName, value]) => {
          if (
            initialGrades[studentId] &&
            initialGrades[studentId][componentName] &&
            chapterName in initialGrades[studentId][componentName]
          ) {
            initialGrades[studentId][componentName][chapterName] = value;
          }
        });
      });
    });

    setGrades(initialGrades);
  }, [classData]);

  return (
    <div className="w-full">
      <div className="bg-blue-violet-600 w-full p-8 rounded-2xl">
        <div className="flex gap-4 flex-col md:flex-row justify-between items-start md:items-center">
          <div className="">
            <h1 className="text-white text-xl">Student Grade Input</h1>
            <h4 className="text-slate-200 mt-2">
              <span className="font-medium">{classData?.name}</span> - {classData?.semester}
            </h4>
            <div className="flex gap-2 mt-4 items-center">
              <PeopleIcon className="text-white" />
              <h5 className="text-white">{classData?.students?.length} Students</h5>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 mt-8">
            <div className="flex flex-col lg:flex-row items-start md:items-center justify-between">
              <div className="flex flex-col lg:flex-row items-center gap-4 w-full md:w-auto">
                <button
                  onClick={() => setViewMode("input")}
                  className={`px-4 py-2 rounded-lg w-full md:w-fit ${
                    viewMode === "input"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  Input Mode
                </button>
                <button
                  onClick={() => setViewMode("calculation")}
                  className={`px-4 py-2 rounded-lg w-full md:w-fit ${
                    viewMode === "calculation"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  Calculation View
                </button>
                <button
                  onClick={() => setViewMode("summary")}
                  className={`px-4 py-2 rounded-lg w-full md:w-fit ${
                    viewMode === "summary"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  Summary
                </button>
              </div>
            </div>
          </div>

          {viewMode === "input" && classData && (
            <InputPage
              classData={classData}
              grades={grades}
              setGrades={setGrades}
              autoSave={autoSave}
              setLastSaved={setLastSaved}
              showContributions={showContributions}
              selectedChapter={selectedChapter}
              setSelectedChapter={setSelectedChapter}
            />
          )}
          {viewMode === "calculation" && classData && (
            <CalculationPage
              grades={grades}
              classData={classData}
              calculateFinalGrade={calculateFinalGrade}
              getLetterGrade={getLetterGrade}
            />
          )}
          {viewMode === "summary" && classData && (
            <SummaryPage
              classData={classData}
              calculateCompletionPercentage={calculateCompletionPercentage}
              calculateFinalGrade={calculateFinalGrade}
              getLetterGrade={getLetterGrade}
            />
          )}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-100">Input Progress</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{calculateCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NilaiPage;
