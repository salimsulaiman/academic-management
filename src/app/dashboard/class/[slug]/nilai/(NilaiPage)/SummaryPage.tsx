import { ClassData } from "@/types/academic";

interface SummaryPageProps {
  classData: ClassData;
  calculateCompletionPercentage: () => string | number;
  calculateFinalGrade: (studentId: number) => string;
  getLetterGrade: (score: string) => string;
}

const SummaryPage = ({
  classData,
  calculateCompletionPercentage,
  calculateFinalGrade,
  getLetterGrade,
}: SummaryPageProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Class Statistics</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Total Students:</span>
            <span className="font-medium dark:text-white">{classData?.students.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Completion Rate:</span>
            <span className="font-medium dark:text-white">{calculateCompletionPercentage()}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Components:</span>
            <span className="font-medium dark:text-white">{classData?.gradeConfig.components.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Chapters:</span>
            <span className="font-medium dark:text-white">{classData?.gradeConfig.chapters.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Distribution</h3>
        {classData && (
          <div className="space-y-2">
            {["A", "B", "C", "D", "E"].map((grade) => {
              const count = classData.students.filter((student) =>
                getLetterGrade(calculateFinalGrade(student.id)).startsWith(grade)
              ).length;

              const percentage =
                classData.students.length > 0 ? ((count / classData.students.length) * 100).toFixed(1) : "0.0";

              return (
                <div key={grade} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Grade {grade}:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium dark:text-white">{count}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Component Weights</h3>
        <div className="space-y-2">
          {classData?.gradeConfig.components.map((component) => (
            <div key={component.id} className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">{component.name}:</span>
              <span className="font-medium dark:text-white">{component.weight}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
