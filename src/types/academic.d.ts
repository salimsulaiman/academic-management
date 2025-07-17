export type Student = {
  id: number;
  name: string;
  nim: string;
};

export type Grade = {
  studentId: number;
  components: Record<string, Record<string, number>>;
};

export type GradeComponent = {
  id: number;
  name: string;
  weight: number;
};

export type Chapter = {
  id: number;
  name: string;
  contribution: Record<string, number>;
};

export type GradeConfig = {
  components: GradeComponent[];
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
};

export type ClassData = {
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

export type AcademicData = {
  classes: ClassData[];
};

export type AcademicStore = {
  data: AcademicData | null;
  setData: (data: AcademicData) => void;
};
