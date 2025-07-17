"use client";
import { ClassData } from "@/types/academic";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useState } from "react";

interface CalculationPageProps {
  grades: Record<number, Record<string, Record<string, number | string>>>;
  classData: ClassData;
  calculateFinalGrade: (studentId: number) => string;
  getLetterGrade: (score: string) => string;
}
const CalculationPage = ({ grades, classData, calculateFinalGrade, getLetterGrade }: CalculationPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const calculateComponentAverage = (studentId: number, componentName: string): string => {
    const componentGrades = grades[studentId]?.[componentName] || {};
    const component = classData?.gradeConfig.components.find((c) => c.name === componentName);
    if (!component) return "0.0";

    let weightedSum = 0;
    let totalContribution = 0;

    classData?.gradeConfig.chapters.forEach((chapter) => {
      const grade = parseFloat(String(componentGrades[chapter.name])) || 0;
      const contribution = chapter.contribution[componentName] || 0;
      weightedSum += (grade * contribution) / 100;
      totalContribution += contribution;
    });

    return totalContribution > 0 ? ((weightedSum / totalContribution) * 100).toFixed(1) : "0.0";
  };

  const handleExport = () => {
    const exportData = classData?.students.map((student) => {
      const finalScore = calculateFinalGrade(student.id);
      const letter = getLetterGrade(finalScore);
      return {
        Name: student.name,
        NIM: student.nim,
        ...Object.fromEntries(
          classData.gradeConfig.components.map((comp) => [
            comp.name.toUpperCase(),
            calculateComponentAverage(student.id, comp.name),
          ])
        ),
        "Final Score": finalScore,
        "Letter Grade": letter,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `${classData?.name ?? "grades"}-export.xlsx`);
  };

  return (
    <div className="w-full">
      <button
        className="flex items-center w-full md:w-fit gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-6"
        onClick={handleExport}
      >
        <CloudDownloadIcon className="w-4 h-4" />
        Export To Excel
      </button>
      <div className="relative w-full sm:w-64 mb-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="max-w-0">
            <table className="min-w-[800px] w-full text-sm text-left text-gray-900 dark:text-gray-100">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-800 z-10 whitespace-nowrap">
                    Student
                  </th>
                  {classData?.gradeConfig.components.map((component) => (
                    <th
                      key={component.id}
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                    >
                      {component.name}
                      <br />
                      <span className="text-xs text-gray-400 dark:text-gray-400">({component.weight}%)</span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    Final Score
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    Letter Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                {classData?.students
                  .filter((student) =>
                    `${student.name} ${student.nim}`.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((student) => {
                    const finalScore = calculateFinalGrade(student.id);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white dark:bg-gray-900 z-10 border-r border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{student.nim}</div>
                        </td>
                        {classData?.gradeConfig.components.map((component) => (
                          <td key={`${student.id}-${component.id}`} className="px-4 py-4 text-center whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {calculateComponentAverage(student.id, component.name)}
                            </div>
                          </td>
                        ))}
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{finalScore}</div>
                        </td>
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              getLetterGrade(finalScore) === "A"
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                : getLetterGrade(finalScore).startsWith("B")
                                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                                : getLetterGrade(finalScore).startsWith("C")
                                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {getLetterGrade(finalScore)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationPage;
