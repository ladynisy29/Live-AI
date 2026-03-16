export type Tutorial = {
  title: string;
  level: "Beginner" | "Intermediate";
  duration: string;
  description: string;
  topic: string;
};

export type LearningPath = {
  name: string;
  steps: string[];
  level: string;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type TutorialLesson = {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate";
  duration: string;
  description: string;
  topic: string;
  concepts: string[];
  exampleHtml: string;
  exampleCss: string;
  exampleJs: string;
  exercisePrompt: string;
  exerciseAnswer: string;
  exerciseHint: string;
};

export type CodeTemplate = {
  id: string;
  name: string;
  category: string;
  html: string;
  css: string;
  js: string;
};

export type SavedSnippet = {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  createdAt: number;
};
