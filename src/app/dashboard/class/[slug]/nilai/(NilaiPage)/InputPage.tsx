"use client";
import { ClassData } from "@/types/academic";
import { useParams } from "next/navigation";
import SaveIcon from "@mui/icons-material/Save";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import * as XLSX from "xlsx";
import { useState } from "react";

interface InputPageProps {
  classData: ClassData;
  grades: Record<number, Record<string, Record<string, number | string>>>;
  setGrades: React.Dispatch<React.SetStateAction<Record<number, Record<string, Record<string, number | string>>>>>;
  autoSave: boolean;
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>;
  showContributions: boolean;
  selectedChapter: string;
  setSelectedChapter: React.Dispatch<React.SetStateAction<string>>;
}

const InputPage = ({
  classData,
  grades,
  setGrades,
  autoSave,
  setLastSaved,
  selectedChapter,
  setSelectedChapter,
}: InputPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedComponent, setSelectedComponent] = useState<string>(classData?.gradeConfig.components[0]?.name ?? "");
  const [bulkGrade, setBulkGrade] = useState("");
  const handleGradeChange = (studentId: number, component: string, chapter: string, value: string): void => {
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      setGrades((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [component]: {
            ...prev[studentId]?.[component],
            [chapter]: value,
          },
        },
      }));

      const errorKey = `${studentId}-${component}-${chapter}`;
      if (validationErrors[errorKey]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }

      if (autoSave) {
        setLastSaved(new Date());
      }
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        [`${studentId}-${component}-${chapter}`]: "Nilai harus antara 0-100",
      }));
    }
  };

  const handleBulkInput = (): void => {
    const value = parseFloat(bulkGrade);

    if (bulkGrade !== "" && selectedComponent && selectedChapter && !isNaN(value) && value >= 0 && value <= 100) {
      setGrades((prev) => {
        const newGrades = { ...prev };
        classData?.students.forEach((student) => {
          newGrades[student.id] = {
            ...newGrades[student.id],
            [selectedComponent]: {
              ...newGrades[student.id]?.[selectedComponent],
              [selectedChapter]: value.toString(),
            },
          };
        });
        return newGrades;
      });

      setBulkGrade("");
      if (autoSave) {
        setLastSaved(new Date());
      }
    }
  };

  const exportToExcel = () => {
    const worksheetData: any[][] = [];

    // Header
    const headerRow = ["NIM", "Nama"];
    classData.gradeConfig.components.forEach((component) => {
      classData.gradeConfig.chapters.forEach((chapter) => {
        headerRow.push(`${component.name} - ${chapter.name}`);
      });
    });
    worksheetData.push(headerRow);

    // Data
    classData.students.forEach((student) => {
      const row: any[] = [student.nim, student.name];

      classData.gradeConfig.components.forEach((component) => {
        classData.gradeConfig.chapters.forEach((chapter) => {
          const value = grades[student.id]?.[component.name]?.[chapter.name] ?? "";
          row.push(value);
        });
      });

      worksheetData.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Grades");

    const filename = `Grades_${classData.name}_AllChapters.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-center gap-2 w-full md:w-fit mb-4">
        <button className="flex items-center w-full md:w-fit gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <SaveIcon className="w-4 h-4" />
          Save All
        </button>
        <button
          className="flex items-center w-full md:w-fit gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={exportToExcel}
        >
          <CloudDownloadIcon className="w-4 h-4" />
          Export
        </button>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {classData.gradeConfig.chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => setSelectedChapter(chapter.name)}
            className={`px-4 py-2 text-sm rounded-lg font-medium border transition ${
              selectedChapter === chapter.name
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {chapter.name}
          </button>
        ))}
      </div>
      <div className="w-full">
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
          <div className="flex flex-col lg:flex-row items-center gap-2 w-full md:w-fit">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Bulk Input:</label>
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md text-sm w-full md:w-auto"
            >
              {classData?.gradeConfig.components.map((component) => (
                <option key={component.id} value={component.name}>
                  {component.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={bulkGrade}
              onChange={(e) => setBulkGrade(e.target.value)}
              placeholder="Grade (0-100)"
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md text-sm w-full lg:w-24"
              min="0"
              max="100"
            />
            <button
              onClick={handleBulkInput}
              className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-sm w-full lg:w-auto"
            >
              Apply to All
            </button>
          </div>
        </div>
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
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm">
        <div className="w-full overflow-x-auto">
          <div className="max-w-1">
            <table className="table-auto w-full border border-slate-100 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-800 z-10">
                    Student
                  </th>
                  {classData?.gradeConfig.components.map((component) => (
                    <th
                      key={component.id}
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                    >
                      {component.name} ({component.weight}%)
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {classData?.students
                  .filter(
                    (student) =>
                      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      student.nim.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white dark:bg-gray-900 z-10 border-r border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{student.nim}</div>
                      </td>
                      {classData?.gradeConfig.components.map((component) => {
                        const errorKey = `${student.id}-${component.name}-${selectedChapter}`;
                        const hasError = validationErrors[errorKey];
                        return (
                          <td
                            key={`${student.id}-${component.id}-${selectedChapter}`}
                            className="px-3 py-4 text-center border-l border-gray-200 dark:border-gray-700 whitespace-nowrap"
                          >
                            <input
                              type="number"
                              value={grades[student.id]?.[component.name]?.[selectedChapter] || ""}
                              onChange={(e) =>
                                handleGradeChange(student.id, component.name, selectedChapter, e.target.value)
                              }
                              className={`w-16 px-2 py-1 text-sm border rounded-md text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                                hasError
                                  ? "border-red-500 bg-red-50 dark:bg-red-950"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                              min="0"
                              max="100"
                            />
                            {hasError && <div className="text-xs text-red-500 mt-1">{hasError}</div>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPage;
