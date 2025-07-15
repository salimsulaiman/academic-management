import { create } from "zustand";

type Student = {
  id: number;
  name: string;
  nim: string;
};

type Grade = {
  studentId: number;
  components: Record<string, Record<string, number>>;
};

type GradeComponent = {
  name: string;
  weight: number;
};

type Chapter = {
  name: string;
  contribution: Record<string, number>;
};

type GradeConfig = {
  components: GradeComponent[];
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
};

type ClassData = {
  id: number;
  name: string;
  slug: string;
  semester: string;
  createdAt: string;
  updatedAt: string;
  students: Student[];
  gradeConfig: GradeConfig;
  configStatus: "completed" | "incomplete";
  grades: Grade[];
};

type AcademicData = {
  classes: ClassData[];
};

type AcademicStore = {
  data: AcademicData | null;
  setData: (data: AcademicData) => void;
};

export const useAcademicStore = create<AcademicStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
