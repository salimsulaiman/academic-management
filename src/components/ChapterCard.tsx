import { Slider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type ComponentType = {
  id: number;
  name: string;
};

type ChapterType = {
  id: number;
  name: string;
  contribution: Record<string, number>;
};

type ChapterCardProps = {
  chapter: ChapterType;
  initialComponents: ComponentType[];
  updateChapterWeight: (chapterId: number, componentName: string, weight: number) => void;
  removeChapter: (chapterId: number) => void;
  getChapterTotalWeight: (chapterId: number) => number;
};

const ChapterCard = ({
  chapter,
  initialComponents,
  updateChapterWeight,
  removeChapter,
  getChapterTotalWeight,
}: ChapterCardProps) => {
  return (
    <div
      key={chapter?.id}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{chapter.name}</h3>
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              getChapterTotalWeight(chapter.id) === 100
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            Total: {getChapterTotalWeight(chapter.id)}%
          </div>
          <button
            onClick={() => removeChapter(chapter.id)}
            className="p-2 text-red-600 dark:text-red-400 rounded-lg transition-colors"
          >
            <DeleteIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full">
        {initialComponents.map((component) => (
          <div
            key={component.id}
            className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-100">{component.name}</label>
            </div>

            <div className="flex items-center gap-1">
              <Slider
                value={chapter.contribution?.[component.name] || 0}
                onChange={(_, value) => updateChapterWeight(chapter.id, component.name, value as number)}
                min={0}
                max={100}
                step={1}
                className="flex-1"
                size="small"
                sx={{ color: "#6C5DD3" }}
              />

              <input
                type="number"
                value={chapter.contribution?.[component.name] || 0}
                onChange={(e) => updateChapterWeight(chapter.id, component.name, parseInt(e.target.value) || 0)}
                className="w-12 px-2 py-1 rounded focus:outline-none text-sm text-gray-900 dark:text-white"
              />

              <span className="text-sm text-gray-600 dark:text-gray-300">%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${
            getChapterTotalWeight(chapter.id) === 100 ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ width: `${Math.min(getChapterTotalWeight(chapter.id), 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ChapterCard;
