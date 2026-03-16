import { useEffect, useMemo, useState } from "react";
import {
  certificationExam as fallbackCertificationExam,
  certifications as fallbackCertifications,
  codeTemplates as fallbackCodeTemplates,
  learningPaths as fallbackLearningPaths,
  quizzes as fallbackQuizzes,
  references as fallbackReferences,
  tutorials as fallbackTutorials
} from "./data";
import type { CodeTemplate, LearningPath, QuizQuestion, SavedSnippet, TutorialLesson } from "./types";

type NavSection = "home" | "tutorial" | "playground" | "certification" | "admin";
type CodeTab = "html" | "css" | "js";

type UiText = {
  navHome: string;
  navTutorial: string;
  navPlayground: string;
  navCertification: string;
  navAdmin: string;
  searchPlaceholder: string;
};

const STORAGE_KEY = "learnwithladynisy:snippets:v1";
const USER_KEY = "learnwithladynisy:userId:v1";
const TOKEN_KEY = "learnwithladynisy:token:v1";
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

type ApiSnippet = {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  created_at: number;
};

type BootstrapPayload = {
  tutorials: TutorialLesson[];
  learningPaths: LearningPath[];
  quizzes: QuizQuestion[];
  certificationExam: QuizQuestion[];
  references: Record<string, string[]>;
  certifications: string[];
  codeTemplates: CodeTemplate[];
};

const texts: Record<string, UiText> = {
  en: {
    navHome: "Home",
    navTutorial: "Tutorial Page",
    navPlayground: "Playground",
    navCertification: "Certification",
    navAdmin: "Admin",
    searchPlaceholder: "Search HTML, CSS, JavaScript, SQL, Python..."
  },
  es: {
    navHome: "Inicio",
    navTutorial: "Tutorial",
    navPlayground: "Laboratorio",
    navCertification: "Certificacion",
    navAdmin: "Admin",
    searchPlaceholder: "Buscar HTML, CSS, JavaScript, SQL, Python..."
  },
  fr: {
    navHome: "Accueil",
    navTutorial: "Tutoriel",
    navPlayground: "Aire de code",
    navCertification: "Certification",
    navAdmin: "Admin",
    searchPlaceholder: "Rechercher HTML, CSS, JavaScript, SQL, Python..."
  }
};

function buildPreviewDoc(html: string, css: string, js: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>${js}<\/script>
  </body>
</html>`;
}

function loadSnippets() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [] as SavedSnippet[];
  }
  try {
    const parsed = JSON.parse(raw) as SavedSnippet[];
    if (!Array.isArray(parsed)) {
      return [] as SavedSnippet[];
    }
    return parsed;
  } catch {
    return [] as SavedSnippet[];
  }
}

function saveSnippets(snippets: SavedSnippet[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

function getInitialLesson() {
  return fallbackTutorials[0] as TutorialLesson;
}

function getInitialHashCode() {
  const hash = window.location.hash;
  if (!hash.startsWith("#code=")) {
    const lesson = getInitialLesson();
    return {
      html: lesson.exampleHtml,
      css: lesson.exampleCss,
      js: lesson.exampleJs
    };
  }
  try {
    const encoded = decodeURIComponent(hash.replace("#code=", ""));
    const decoded = atob(encoded);
    const payload = JSON.parse(decoded) as { html: string; css: string; js: string };
    if (typeof payload.html === "string" && typeof payload.css === "string" && typeof payload.js === "string") {
      return payload;
    }
  } catch {
    // Fall through to default lesson code when hash parsing fails.
  }
  const lesson = getInitialLesson();
  return {
    html: lesson.exampleHtml,
    css: lesson.exampleCss,
    js: lesson.exampleJs
  };
}

function getSectionFromPath(pathname: string): NavSection {
  if (pathname.startsWith("/tutorial")) {
    return "tutorial";
  }
  if (pathname === "/playground") {
    return "playground";
  }
  if (pathname === "/certification") {
    return "certification";
  }
  if (pathname === "/admin") {
    return "admin";
  }
  return "home";
}

function getTutorialIdFromPath(pathname: string): string | null {
  if (!pathname.startsWith("/tutorial/")) {
    return null;
  }
  const slug = pathname.slice("/tutorial/".length);
  return slug || null;
}

function App() {
  const initialCode = getInitialHashCode();
  const initialPathname = window.location.pathname;
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState<"en" | "es" | "fr">("en");
  const [activeSection, setActiveSection] = useState<NavSection>(getSectionFromPath(initialPathname));
  const [activeTopic, setActiveTopic] = useState<string>("All");
  const [selectedTutorialId, setSelectedTutorialId] = useState(
    getTutorialIdFromPath(initialPathname) ?? getInitialLesson().id
  );
  const [activeTab, setActiveTab] = useState<CodeTab>("html");

  const [tutorialsData, setTutorialsData] = useState<TutorialLesson[]>(fallbackTutorials);
  const [learningPathsData, setLearningPathsData] = useState<LearningPath[]>(fallbackLearningPaths);
  const [quizzesData, setQuizzesData] = useState<QuizQuestion[]>(fallbackQuizzes);
  const [certificationExamData, setCertificationExamData] = useState<QuizQuestion[]>(
    fallbackCertificationExam
  );
  const [referencesData, setReferencesData] = useState<Record<string, string[]>>(fallbackReferences);
  const [certificationsData, setCertificationsData] = useState<string[]>(fallbackCertifications);
  const [codeTemplatesData, setCodeTemplatesData] = useState<CodeTemplate[]>(fallbackCodeTemplates);

  const [html, setHtml] = useState(initialCode.html);
  const [css, setCss] = useState(initialCode.css);
  const [js, setJs] = useState(initialCode.js);
  const [previewDoc, setPreviewDoc] = useState(buildPreviewDoc(initialCode.html, initialCode.css, initialCode.js));

  const [exerciseAnswer, setExerciseAnswer] = useState("");
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [snippetName, setSnippetName] = useState("");
  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([]);
  const [editorMessage, setEditorMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Guest");
  const [userRole, setUserRole] = useState<string>("guest");
  const [backendOnline, setBackendOnline] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  const [examStarted, setExamStarted] = useState(false);
  const [examSecondsLeft, setExamSecondsLeft] = useState(300);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examResult, setExamResult] = useState<{ score: number; passed: boolean; certId: string | null } | null>(null);
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState<string>("");

  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [adminTitle, setAdminTitle] = useState("");
  const [adminTopic, setAdminTopic] = useState("Web Development");
  const [adminDescription, setAdminDescription] = useState("");
  const [editingTutorialId, setEditingTutorialId] = useState<string | null>(null);
  const [adminLevel, setAdminLevel] = useState<"Beginner" | "Intermediate">("Beginner");
  const [adminDuration, setAdminDuration] = useState("30 min");
  const [adminConcepts, setAdminConcepts] = useState("");
  const [adminExampleHtml, setAdminExampleHtml] = useState("");
  const [adminExampleCss, setAdminExampleCss] = useState("");
  const [adminExampleJs, setAdminExampleJs] = useState("");
  const [adminExercisePrompt, setAdminExercisePrompt] = useState("");
  const [adminExerciseAnswer, setAdminExerciseAnswer] = useState("");
  const [adminExerciseHint, setAdminExerciseHint] = useState("");

  const ui = texts[language];
  const seedTutorialIds = useMemo(() => new Set(fallbackTutorials.map((item) => item.id)), []);

  const navigateTo = (path: string, section: NavSection) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setActiveSection(section);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await apiRequest<{ ok: boolean }>("/api/health");
        setBackendOnline(true);

        let currentUserId = localStorage.getItem(USER_KEY);
        const token = localStorage.getItem(TOKEN_KEY);

        if (token) {
          try {
            const me = await apiRequest<{
              user: { id: string; name: string; email: string; role: string };
            }>("/api/auth/me", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });
            currentUserId = me.user.id;
            setUserName(me.user.name);
            setUserRole(me.user.role);
          } catch {
            localStorage.removeItem(TOKEN_KEY);
          }
        }

        if (!currentUserId) {
          const userResp = await apiRequest<{ userId: string }>("/api/users/guest", {
            method: "POST"
          });
          currentUserId = userResp.userId;
          localStorage.setItem(USER_KEY, currentUserId);
          setUserRole("guest");
        }

        setUserId(currentUserId);

        try {
          const bootstrap = await apiRequest<BootstrapPayload>("/api/content/bootstrap");
          if (bootstrap.tutorials.length > 0) {
            setTutorialsData(bootstrap.tutorials);
          }
          setLearningPathsData(bootstrap.learningPaths);
          setQuizzesData(bootstrap.quizzes);
          setCertificationExamData(bootstrap.certificationExam);
          setReferencesData(bootstrap.references);
          setCertificationsData(bootstrap.certifications);
          setCodeTemplatesData(bootstrap.codeTemplates);
        } catch {
          // Keep fallback content when bootstrap endpoint is unavailable.
        }

        const [snippetResp, progressResp] = await Promise.all([
          apiRequest<{ snippets: ApiSnippet[] }>(`/api/users/${currentUserId}/snippets`),
          apiRequest<{ completedLessons: string[] }>(`/api/users/${currentUserId}/progress`)
        ]);

        setSavedSnippets(
          snippetResp.snippets.map((snippet) => ({
            id: snippet.id,
            name: snippet.name,
            html: snippet.html,
            css: snippet.css,
            js: snippet.js,
            createdAt: snippet.created_at
          }))
        );

        setCompletedLessons(
          progressResp.completedLessons.reduce<Record<string, boolean>>((acc, lessonId) => {
            acc[lessonId] = true;
            return acc;
          }, {})
        );
      } catch {
        setBackendOnline(false);
        setSavedSnippets(loadSnippets());
      }
    };

    void init();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = window.location.pathname;
      setActiveSection(getSectionFromPath(nextPath));
      const tutorialId = getTutorialIdFromPath(nextPath);
      if (tutorialId) {
        setSelectedTutorialId(tutorialId);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const signIn = async () => {
    if (!backendOnline) {
      setEditorMessage("Backend offline. Authentication unavailable.");
      return;
    }
    if (!authEmail.trim() || !authPassword.trim()) {
      setEditorMessage("Email and password are required.");
      return;
    }

    try {
      const result = await apiRequest<{
        token: string;
        user: { id: string; name: string; email: string; role: string };
      }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });

      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(USER_KEY, result.user.id);
      setUserId(result.user.id);
      setUserName(result.user.name);
      setUserRole(result.user.role);
      setAuthPassword("");
      setEditorMessage(`Signed in as ${result.user.name}.`);
    } catch {
      setEditorMessage("Sign in failed.");
    }
  };

  const register = async () => {
    if (!backendOnline) {
      setEditorMessage("Backend offline. Registration unavailable.");
      return;
    }
    if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
      setEditorMessage("Name, email and password are required.");
      return;
    }

    try {
      const result = await apiRequest<{
        token: string;
        user: { id: string; name: string; email: string; role: string };
      }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: authName, email: authEmail, password: authPassword })
      });

      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(USER_KEY, result.user.id);
      setUserId(result.user.id);
      setUserName(result.user.name);
      setUserRole(result.user.role);
      setAuthName("");
      setAuthPassword("");
      setEditorMessage(`Account created for ${result.user.name}.`);
    } catch {
      setEditorMessage("Registration failed. Email may already exist.");
    }
  };

  const logout = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await apiRequest<{ ok: boolean }>("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
      } catch {
        // noop
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    setUserName("Guest");
    setUserRole("guest");
    setEditorMessage("Signed out.");
  };

  useEffect(() => {
    if (!examStarted) {
      return;
    }
    if (examSecondsLeft <= 0) {
      setExamStarted(false);
      void submitExam();
      return;
    }
    const id = window.setInterval(() => {
      setExamSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [examStarted, examSecondsLeft]);

  const filteredTutorials = useMemo(() => {
    const q = search.toLowerCase().trim();
    return tutorialsData.filter((tutorial) => {
      const matchSearch =
        q.length === 0 ||
        tutorial.title.toLowerCase().includes(q) ||
        tutorial.description.toLowerCase().includes(q) ||
        tutorial.topic.toLowerCase().includes(q);
      const matchTopic = activeTopic === "All" || tutorial.topic === activeTopic;
      return matchSearch && matchTopic;
    });
  }, [search, activeTopic, tutorialsData]);

  const selectedTutorial = useMemo(() => {
    return tutorialsData.find((item) => item.id === selectedTutorialId) ?? tutorialsData[0] ?? fallbackTutorials[0];
  }, [selectedTutorialId, tutorialsData]);

  useEffect(() => {
    if (activeSection === "tutorial") {
      document.title = `${selectedTutorial.title} | learnwithladynisy`;
      return;
    }
    if (activeSection === "playground") {
      document.title = "Code Playground | learnwithladynisy";
      return;
    }
    if (activeSection === "certification") {
      document.title = "Certification | learnwithladynisy";
      return;
    }
    document.title = "learnwithladynisy | Learn to Code by Building";
  }, [activeSection, selectedTutorial.title]);

  const exerciseCorrect =
    exerciseAnswer.trim().toLowerCase() === selectedTutorial.exerciseAnswer.trim().toLowerCase();

  const quizScore = quizzesData.reduce((score, question) => {
    return selectedQuizAnswers[question.id] === question.answer ? score + 1 : score;
  }, 0);

  const completionRate = Math.round(
    (Object.keys(completedLessons).length / Math.max(1, tutorialsData.length)) * 100
  );

  const runCode = () => {
    setPreviewDoc(buildPreviewDoc(html, css, js));
    setEditorMessage("Preview updated.");
  };

  const loadLessonInEditor = (lesson: TutorialLesson) => {
    setSelectedTutorialId(lesson.id);
    navigateTo(`/tutorial/${lesson.id}`, "tutorial");
    setHtml(lesson.exampleHtml);
    setCss(lesson.exampleCss);
    setJs(lesson.exampleJs);
    setPreviewDoc(buildPreviewDoc(lesson.exampleHtml, lesson.exampleCss, lesson.exampleJs));
    setExerciseAnswer("");
    setEditorMessage(`${lesson.title} example loaded.`);
  };

  const resetCode = () => {
    setHtml(selectedTutorial.exampleHtml);
    setCss(selectedTutorial.exampleCss);
    setJs(selectedTutorial.exampleJs);
    setPreviewDoc(
      buildPreviewDoc(selectedTutorial.exampleHtml, selectedTutorial.exampleCss, selectedTutorial.exampleJs)
    );
    setEditorMessage("Editor reset to selected lesson example.");
  };

  const copyCurrentCode = async () => {
    const payload = activeTab === "html" ? html : activeTab === "css" ? css : js;
    try {
      await navigator.clipboard.writeText(payload);
      setEditorMessage(`${activeTab.toUpperCase()} copied.`);
    } catch {
      setEditorMessage("Clipboard unavailable in this browser context.");
    }
  };

  const saveCurrentSnippet = async () => {
    const name = snippetName.trim();
    if (!name) {
      setEditorMessage("Enter a snippet name before saving.");
      return;
    }

    if (backendOnline && userId) {
      try {
        const response = await apiRequest<{ snippet: ApiSnippet }>(`/api/users/${userId}/snippets`, {
          method: "POST",
          body: JSON.stringify({ name, html, css, js })
        });
        const next: SavedSnippet = {
          id: response.snippet.id,
          name: response.snippet.name,
          html: response.snippet.html,
          css: response.snippet.css,
          js: response.snippet.js,
          createdAt: response.snippet.created_at
        };
        setSavedSnippets((prev) => [next, ...prev].slice(0, 25));
        setSnippetName("");
        setEditorMessage("Snippet saved to backend.");
        return;
      } catch {
        setEditorMessage("Backend save failed, saved locally instead.");
      }
    }

    const next: SavedSnippet = { id: `snippet-${Date.now()}`, name, html, css, js, createdAt: Date.now() };
    const updated = [next, ...savedSnippets].slice(0, 25);
    setSavedSnippets(updated);
    saveSnippets(updated);
    setSnippetName("");
  };

  const loadSnippet = (snippet: SavedSnippet) => {
    setHtml(snippet.html);
    setCss(snippet.css);
    setJs(snippet.js);
    setPreviewDoc(buildPreviewDoc(snippet.html, snippet.css, snippet.js));
    navigateTo("/playground", "playground");
    setEditorMessage(`Loaded snippet: ${snippet.name}`);
  };

  const deleteSnippet = async (id: string) => {
    if (backendOnline && userId) {
      try {
        await apiRequest<{ ok: boolean }>(`/api/users/${userId}/snippets/${id}`, {
          method: "DELETE"
        });
      } catch {
        setEditorMessage("Could not delete snippet in backend.");
      }
    }
    setSavedSnippets((prev) => {
      const updated = prev.filter((snippet) => snippet.id !== id);
      if (!backendOnline) {
        saveSnippets(updated);
      }
      return updated;
    });
  };

  const shareSnippet = async () => {
    const payload = {
      html,
      css,
      js
    };
    const encoded = btoa(JSON.stringify(payload));
    const url = `${window.location.origin}${window.location.pathname}#code=${encodeURIComponent(encoded)}`;
    try {
      await navigator.clipboard.writeText(url);
      setEditorMessage("Share link copied.");
    } catch {
      setEditorMessage("Could not copy link automatically. Copy it from address bar.");
    }
    window.history.replaceState({}, "", `#code=${encodeURIComponent(encoded)}`);
  };

  const markLessonComplete = async () => {
    setCompletedLessons((prev) => ({
      ...prev,
      [selectedTutorial.id]: true
    }));

    if (backendOnline && userId) {
      try {
        await apiRequest<{ ok: boolean }>(`/api/users/${userId}/progress`, {
          method: "POST",
          body: JSON.stringify({ lessonId: selectedTutorial.id })
        });
      } catch {
        setEditorMessage("Progress sync failed.");
      }
    }
  };

  const loadTemplate = (templateId: string) => {
    const template = codeTemplatesData.find((item) => item.id === templateId);
    if (!template) {
      return;
    }
    setHtml(template.html);
    setCss(template.css);
    setJs(template.js);
    setPreviewDoc(buildPreviewDoc(template.html, template.css, template.js));
    navigateTo("/playground", "playground");
    setEditorMessage(`${template.name} loaded.`);
  };

  const submitExam = async () => {
    const score = certificationExamData.reduce((acc, question) => {
      return examAnswers[question.id] === question.answer ? acc + 1 : acc;
    }, 0);

    if (backendOnline && userId) {
      try {
        const result = await apiRequest<{ passed: boolean; certId: string | null }>("/api/exams/submit", {
          method: "POST",
          body: JSON.stringify({
            userId,
            score,
            total: certificationExamData.length
          })
        });
        setExamResult({ score, passed: result.passed, certId: result.certId });
        setExamStarted(false);
        return;
      } catch {
        setEditorMessage("Exam backend unavailable, used local scoring.");
      }
    }

    const passed = score / Math.max(1, certificationExamData.length) >= 0.7;
    const certId = passed ? `LWLN-${new Date().getFullYear()}-${Math.random().toString().slice(2, 8)}` : null;
    setExamResult({ score, passed, certId });
    setExamStarted(false);
  };

  const createOrUpdateAdminTutorial = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || userRole !== "admin") {
      setEditorMessage("Admin token required.");
      return;
    }
    if (!adminTitle.trim() || !adminDescription.trim() || !adminExerciseAnswer.trim()) {
      setEditorMessage("Title, description, and exercise answer are required.");
      return;
    }

    const id =
      editingTutorialId ||
      adminTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      `tutorial-${Date.now()}`;

    const parsedConcepts = adminConcepts
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const tutorial: TutorialLesson = {
      id,
      title: adminTitle.trim(),
      topic: adminTopic,
      level: adminLevel,
      duration: adminDuration.trim() || "30 min",
      description: adminDescription.trim(),
      concepts: parsedConcepts.length > 0 ? parsedConcepts : ["Concept 1"],
      exampleHtml: adminExampleHtml || `<h1>${adminTitle.trim()}</h1>`,
      exampleCss: adminExampleCss || "h1 { font-family: sans-serif; }",
      exampleJs: adminExampleJs,
      exercisePrompt: adminExercisePrompt.trim() || "Complete the exercise",
      exerciseAnswer: adminExerciseAnswer.trim(),
      exerciseHint: adminExerciseHint.trim() || ""
    };

    try {
      const endpoint = editingTutorialId ? `/api/admin/tutorials/${editingTutorialId}` : "/api/admin/tutorials";
      const method = editingTutorialId ? "PUT" : "POST";
      await apiRequest<{ tutorial: TutorialLesson }>(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tutorial)
      });
      setTutorialsData((prev) => [tutorial, ...prev.filter((item) => item.id !== tutorial.id)]);
      if (!selectedTutorialId || selectedTutorialId === editingTutorialId) {
        setSelectedTutorialId(tutorial.id);
      }
      setAdminTitle("");
      setAdminDescription("");
      setAdminLevel("Beginner");
      setAdminDuration("30 min");
      setAdminConcepts("");
      setAdminExampleHtml("");
      setAdminExampleCss("");
      setAdminExampleJs("");
      setAdminExercisePrompt("");
      setAdminExerciseAnswer("");
      setAdminExerciseHint("");
      setEditingTutorialId(null);
      setEditorMessage(editingTutorialId ? "Tutorial updated via CMS API." : "Tutorial created via CMS API.");
    } catch {
      setEditorMessage("Failed to save tutorial. Ensure you are logged in as admin.");
    }
  };

  const beginEditTutorial = (tutorial: TutorialLesson) => {
    if (seedTutorialIds.has(tutorial.id)) {
      setEditorMessage("Seed tutorials are read-only.");
      return;
    }
    setEditingTutorialId(tutorial.id);
    setAdminTitle(tutorial.title);
    setAdminTopic(tutorial.topic);
    setAdminDescription(tutorial.description);
    setAdminLevel(tutorial.level);
    setAdminDuration(tutorial.duration);
    setAdminConcepts(tutorial.concepts.join(", "));
    setAdminExampleHtml(tutorial.exampleHtml);
    setAdminExampleCss(tutorial.exampleCss);
    setAdminExampleJs(tutorial.exampleJs);
    setAdminExercisePrompt(tutorial.exercisePrompt);
    setAdminExerciseAnswer(tutorial.exerciseAnswer);
    setAdminExerciseHint(tutorial.exerciseHint);
    navigateTo("/admin", "admin");
  };

  const cancelEditTutorial = () => {
    setEditingTutorialId(null);
    setAdminTitle("");
    setAdminDescription("");
    setAdminLevel("Beginner");
    setAdminDuration("30 min");
    setAdminConcepts("");
    setAdminExampleHtml("");
    setAdminExampleCss("");
    setAdminExampleJs("");
    setAdminExercisePrompt("");
    setAdminExerciseAnswer("");
    setAdminExerciseHint("");
  };

  const deleteAdminTutorial = async (tutorial: TutorialLesson) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || userRole !== "admin") {
      setEditorMessage("Admin token required.");
      return;
    }
    if (seedTutorialIds.has(tutorial.id)) {
      setEditorMessage("Seed tutorials cannot be deleted.");
      return;
    }
    try {
      await apiRequest<{ ok: boolean }>(`/api/admin/tutorials/${tutorial.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      setTutorialsData((prev) => prev.filter((item) => item.id !== tutorial.id));
      if (selectedTutorialId === tutorial.id) {
        const next = tutorialsData.find((item) => item.id !== tutorial.id) ?? fallbackTutorials[0];
        setSelectedTutorialId(next.id);
      }
      if (editingTutorialId === tutorial.id) {
        cancelEditTutorial();
      }
      setEditorMessage("Tutorial deleted.");
    } catch {
      setEditorMessage("Failed to delete tutorial.");
    }
  };

  const verifyCertificate = async () => {
    const id = verifyId.trim();
    if (!id) {
      setVerifyResult("Enter a certificate ID.");
      return;
    }

    if (!backendOnline) {
      setVerifyResult("Backend is offline, cannot verify now.");
      return;
    }

    try {
      const response = await apiRequest<{ verified: boolean }>(`/api/certificates/${encodeURIComponent(id)}`);
      setVerifyResult(response.verified ? "Certificate verified." : "Certificate not found.");
    } catch {
      setVerifyResult("Certificate not found.");
    }
  };

  const startExam = () => {
    setExamResult(null);
    setExamAnswers({});
    setExamSecondsLeft(300);
    setExamStarted(true);
  };

  return (
    <div>
      {/* ── Top navigation bar (W3Schools-style) ── */}
      <header className="top-bar">
        <span className="top-bar-brand">
          learn<span>withladynisy</span>
        </span>
        <nav className="top-bar-nav" aria-label="Primary navigation">
          <button
            onClick={() => navigateTo("/", "home")}
            className={activeSection === "home" ? "active" : ""}
          >
            {ui.navHome}
          </button>
          <button
            onClick={() => navigateTo(`/tutorial/${selectedTutorial.id}`, "tutorial")}
            className={activeSection === "tutorial" ? "active" : ""}
          >
            {ui.navTutorial}
          </button>
          <button
            onClick={() => navigateTo("/playground", "playground")}
            className={activeSection === "playground" ? "active" : ""}
          >
            {ui.navPlayground}
          </button>
          <button
            onClick={() => navigateTo("/certification", "certification")}
            className={activeSection === "certification" ? "active" : ""}
          >
            {ui.navCertification}
          </button>
          {userRole === "admin" && (
            <button
              onClick={() => navigateTo("/admin", "admin")}
              className={activeSection === "admin" ? "active" : ""}
            >
              {ui.navAdmin}
            </button>
          )}
        </nav>

        <div className="top-bar-search">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={ui.searchPlaceholder}
            aria-label="Search tutorials"
          />
        </div>

        <div className="top-bar-user">
          {userName && userName !== "Guest" ? (
            <>
              <span className="user-name">{userName}</span>
              {userRole === "admin" && <span className="role-badge">Admin</span>}
              <button type="button" onClick={() => void logout()}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={authMode === "login" ? "active" : ""}
                onClick={() => { setAuthMode("login"); navigateTo("/", "home"); }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("register"); navigateTo("/", "home"); }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>

      <div className="app-shell">
        {/* ── Hero ── */}
        <header className="hero">
          <div className="hero-content">
            <p className="eyebrow">Interactive Coding Education</p>
            <h1>learnwithladynisy</h1>
            <p>
              Learn programming through hands-on tutorials, interactive coding labs, quizzes,
              and certification tracks — all in your browser.
            </p>
            <div className="hero-stats">
              <span>10,000+ lessons</span>
              <span>{completionRate}% complete</span>
              <span className={backendOnline ? "" : "hint"}>{backendOnline ? "✓ API online" : "⚠ Offline mode"}</span>
            </div>
          </div>
          <div className="hero-panel">
            <h2>
              {userName && userName !== "Guest"
                ? `Welcome back, ${userName}`
                : authMode === "register"
                  ? "Create your account"
                  : "Sign in to your account"}
            </h2>
            {userName && userName !== "Guest" ? (
              <div className="auth-panel">
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${completionRate}%` }} />
                </div>
                <p className="hint">{completionRate}% of lessons completed</p>
                <div className="topic-chips">
                  {["All", "Web Development", "Backend Development", "Databases", "Programming Languages"].map(
                    (topic) => (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => setActiveTopic(topic)}
                        className={activeTopic === topic ? "active" : ""}
                      >
                        {topic}
                      </button>
                    )
                  )}
                </div>
                <div className="language-row">
                  <select
                    id="lang-select"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value as "en" | "es" | "fr")}
                    aria-label="Language"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="auth-panel">
                <div className="chip-row">
                  <button
                    type="button"
                    className={authMode === "login" ? "active" : ""}
                    onClick={() => setAuthMode("login")}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={authMode === "register" ? "active" : ""}
                    onClick={() => setAuthMode("register")}
                  >
                    Register
                  </button>
                </div>
                {authMode === "register" && (
                  <input
                    value={authName}
                    onChange={(event) => setAuthName(event.target.value)}
                    placeholder="Full name"
                    aria-label="Full name"
                  />
                )}
                <input
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  placeholder="Email"
                  type="email"
                  aria-label="Email"
                />
                <input
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  type="password"
                  placeholder="Password"
                  aria-label="Password"
                />
                {authMode === "login" ? (
                  <button type="button" onClick={() => void signIn()}>
                    Sign In
                  </button>
                ) : (
                  <button type="button" onClick={() => void register()}>
                    Create Account
                  </button>
                )}
                {editorMessage && <p className="hint">{editorMessage}</p>}
                <div className="topic-chips">
                  {["All", "Web Development", "Backend Development", "Databases", "Programming Languages"].map(
                    (topic) => (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => setActiveTopic(topic)}
                        className={activeTopic === topic ? "active" : ""}
                      >
                        {topic}
                      </button>
                    )
                  )}
                </div>
                <div className="language-row">
                  <select
                    id="lang-select"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value as "en" | "es" | "fr")}
                    aria-label="Language"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </header>

      <main>
        {activeSection === "home" && (
          <>
            <section className="section" id="tutorials">
              <div className="section-head">
                <h2>Popular Tutorials</h2>
                <p>Step-by-step lessons with examples, exercises, and instant practice.</p>
              </div>
              <div className="grid cards">
                {filteredTutorials.map((tutorial) => (
                  <article key={tutorial.id} className="card tutorial-card">
                    <p className="meta">{tutorial.topic}</p>
                    <h3>{tutorial.title}</h3>
                    <p>{tutorial.description}</p>
                    <div className="card-foot">
                      <span>{tutorial.level}</span>
                      <span>{tutorial.duration}</span>
                    </div>
                    <div className="card-actions">
                      <button type="button" onClick={() => loadLessonInEditor(tutorial)}>
                        Open lesson
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="section split" id="paths">
              <article className="card">
                <h2>Learning Paths</h2>
                <div className="path-stack">
                  {learningPathsData.map((path) => (
                    <div className="path" key={path.name}>
                      <h3>{path.name}</h3>
                      <p>{path.level}</p>
                      <p>{path.steps.join(" -> ")}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="card">
                <h2>Reference Guides</h2>
                <div className="reference-columns">
                  {Object.entries(referencesData).map(([key, items]) => (
                    <div key={key}>
                      <h3>{key}</h3>
                      <ul className="list">
                        {items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="section split">
              <article className="card">
                <h2>Lesson Quiz</h2>
                <div className="grid quiz-grid">
                  {quizzesData.map((question) => (
                    <article key={question.id} className="card inner-card">
                      <h3>
                        Q{question.id}. {question.question}
                      </h3>
                      <div className="options">
                        {question.options.map((option, idx) => (
                          <label key={option}>
                            <input
                              type="radio"
                              name={`q-${question.id}`}
                              checked={selectedQuizAnswers[question.id] === idx}
                              onChange={() =>
                                setSelectedQuizAnswers((prev) => ({
                                  ...prev,
                                  [question.id]: idx
                                }))
                              }
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                      {quizSubmitted && (
                        <p
                          className={
                            selectedQuizAnswers[question.id] === question.answer ? "success" : "hint"
                          }
                        >
                          {question.explanation}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
                <div className="quiz-actions">
                  <button onClick={() => setQuizSubmitted(true)}>Submit Quiz</button>
                  {quizSubmitted && (
                    <p>
                      Score: {quizScore}/{quizzesData.length}
                    </p>
                  )}
                </div>
              </article>

              <article className="card">
                <h2>Certification Snapshot</h2>
                <p>Official paid certifications with verifiable certificate IDs.</p>
                <ul className="list">
                  {certificationsData.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="price">Exam fee from $95</p>
              </article>
            </section>
          </>
        )}

        {activeSection === "tutorial" && (
          <section className="section tutorial-layout">
            <aside className="card tutorial-sidebar">
              <h2>Lessons</h2>
              {filteredTutorials.map((tutorial) => (
                <button
                  key={tutorial.id}
                  type="button"
                  className={selectedTutorial.id === tutorial.id ? "active" : ""}
                  onClick={() => loadLessonInEditor(tutorial)}
                >
                  {tutorial.title}
                </button>
              ))}
            </aside>

            <article className="card tutorial-content">
              <p className="meta">{selectedTutorial.topic}</p>
              <h2>{selectedTutorial.title}</h2>
              <p>{selectedTutorial.description}</p>
              <h3>Concepts</h3>
              <ul className="list">
                {selectedTutorial.concepts.map((concept) => (
                  <li key={concept}>{concept}</li>
                ))}
              </ul>
              <h3>Exercise</h3>
              <pre>{selectedTutorial.exercisePrompt}</pre>
              <input
                value={exerciseAnswer}
                onChange={(event) => setExerciseAnswer(event.target.value)}
                placeholder="Type answer"
                aria-label="Exercise answer"
              />
              <p className={exerciseCorrect ? "success" : "hint"}>
                {exerciseAnswer.length === 0
                  ? selectedTutorial.exerciseHint
                  : exerciseCorrect
                    ? "Correct answer. Nice work."
                    : "Try again."}
              </p>
              <button type="button" onClick={() => void markLessonComplete()}>
                Mark lesson complete
              </button>
            </article>

            <section className="card tutorial-editor">
              <div className="section-head">
                <h2>Try-It-Yourself</h2>
                <p>Code editor and output panel.</p>
              </div>
              <div className="editor-shell compact-editor">
                <div className="editor-pane">
                  <div className="tab-row" role="tablist" aria-label="Code tabs">
                    <button className={activeTab === "html" ? "active" : ""} onClick={() => setActiveTab("html")}>
                      HTML
                    </button>
                    <button className={activeTab === "css" ? "active" : ""} onClick={() => setActiveTab("css")}>
                      CSS
                    </button>
                    <button className={activeTab === "js" ? "active" : ""} onClick={() => setActiveTab("js")}>
                      JavaScript
                    </button>
                  </div>

                  {activeTab === "html" && (
                    <textarea value={html} onChange={(event) => setHtml(event.target.value)} />
                  )}
                  {activeTab === "css" && (
                    <textarea value={css} onChange={(event) => setCss(event.target.value)} />
                  )}
                  {activeTab === "js" && (
                    <textarea value={js} onChange={(event) => setJs(event.target.value)} />
                  )}

                  <div className="control-row wrap">
                    <button onClick={runCode}>Run</button>
                    <button onClick={resetCode}>Reset</button>
                    <button onClick={() => void copyCurrentCode()}>Copy</button>
                    <button onClick={shareSnippet}>Share</button>
                  </div>
                </div>

                <div className="preview-pane" aria-label="Output preview">
                  <iframe title="Live Preview" srcDoc={previewDoc} sandbox="allow-scripts" />
                </div>
              </div>
              {editorMessage && <p className="hint">{editorMessage}</p>}
            </section>
          </section>
        )}

        {activeSection === "playground" && (
          <section className="section split playground-layout">
            <article className="card">
              <h2>Templates and Snippets</h2>
              <div className="template-grid">
                {codeTemplatesData.map((template) => (
                  <div className="path" key={template.id}>
                    <p className="meta">{template.category}</p>
                    <h3>{template.name}</h3>
                    <button type="button" onClick={() => loadTemplate(template.id)}>
                      Load template
                    </button>
                  </div>
                ))}
              </div>

              <h3>Save current snippet</h3>
              <div className="save-row">
                <input
                  value={snippetName}
                  onChange={(event) => setSnippetName(event.target.value)}
                  placeholder="Snippet name"
                  aria-label="Snippet name"
                />
                <button type="button" onClick={() => void saveCurrentSnippet()}>
                  Save
                </button>
              </div>
              <h3>Saved snippets ({savedSnippets.length})</h3>
              <div className="snippet-list">
                {savedSnippets.length === 0 && <p className="hint">No saved snippets yet.</p>}
                {savedSnippets.map((snippet) => (
                  <div className="path" key={snippet.id}>
                    <h4>{snippet.name}</h4>
                    <p className="hint">{new Date(snippet.createdAt).toLocaleString()}</p>
                    <div className="card-actions">
                      <button type="button" onClick={() => loadSnippet(snippet)}>
                        Load
                      </button>
                      <button type="button" onClick={() => void deleteSnippet(snippet.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="card">
              <h2>Code Playground</h2>
              <p>Write code, run instantly, save snippets, and share links.</p>
              <div className="editor-shell compact-editor">
                <div className="editor-pane">
                  <div className="tab-row" role="tablist" aria-label="Code tabs">
                    <button className={activeTab === "html" ? "active" : ""} onClick={() => setActiveTab("html")}>
                      HTML
                    </button>
                    <button className={activeTab === "css" ? "active" : ""} onClick={() => setActiveTab("css")}>
                      CSS
                    </button>
                    <button className={activeTab === "js" ? "active" : ""} onClick={() => setActiveTab("js")}>
                      JavaScript
                    </button>
                  </div>
                  {activeTab === "html" && (
                    <textarea value={html} onChange={(event) => setHtml(event.target.value)} />
                  )}
                  {activeTab === "css" && (
                    <textarea value={css} onChange={(event) => setCss(event.target.value)} />
                  )}
                  {activeTab === "js" && (
                    <textarea value={js} onChange={(event) => setJs(event.target.value)} />
                  )}
                  <div className="control-row wrap">
                    <button onClick={runCode}>Run</button>
                    <button onClick={resetCode}>Reset</button>
                    <button onClick={() => void copyCurrentCode()}>Copy</button>
                    <button onClick={shareSnippet}>Share</button>
                  </div>
                </div>
                <div className="preview-pane" aria-label="Output preview">
                  <iframe title="Playground Preview" srcDoc={previewDoc} sandbox="allow-scripts" />
                </div>
              </div>
              {editorMessage && <p className="hint">{editorMessage}</p>}
            </article>
          </section>
        )}

        {activeSection === "certification" && (
          <section className="section split certification-layout">
            <article className="card">
              <h2>Certification Exam</h2>
              <p>Timed test with multiple-choice questions and instant result.</p>
              {!examStarted && (
                <button type="button" onClick={startExam}>
                  Start 5-Minute Exam
                </button>
              )}
              {examStarted && (
                <p className="price">Time left: {Math.max(examSecondsLeft, 0)}s</p>
              )}
              {(examStarted || examResult) && (
                <div className="grid">
                  {certificationExamData.map((question) => (
                    <article key={question.id} className="card inner-card">
                      <h3>
                        Q{question.id}. {question.question}
                      </h3>
                      <div className="options">
                        {question.options.map((option, idx) => (
                          <label key={option}>
                            <input
                              type="radio"
                              name={`exam-q-${question.id}`}
                              checked={examAnswers[question.id] === idx}
                              disabled={!examStarted}
                              onChange={() =>
                                setExamAnswers((prev) => ({
                                  ...prev,
                                  [question.id]: idx
                                }))
                              }
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
              {examStarted && (
                <button type="button" onClick={() => void submitExam()}>
                  Submit Exam
                </button>
              )}
            </article>

            <article className="card">
              <h2>Result</h2>
              {!examResult && <p>Start the exam to generate a result.</p>}
              {examResult && (
                <>
                  <p>
                    Score: {examResult.score}/{certificationExamData.length}
                  </p>
                  <p className={examResult.passed ? "success" : "hint"}>
                    {examResult.passed ? "Status: Passed" : "Status: Not passed"}
                  </p>
                  {examResult.certId && (
                    <>
                      <p className="price">Certificate ID: {examResult.certId}</p>
                      <p className="hint">Use this ID on the verification endpoint in the backend phase.</p>
                    </>
                  )}
                </>
              )}
              <h3>Verify certificate</h3>
              <div className="save-row">
                <input
                  value={verifyId}
                  onChange={(event) => setVerifyId(event.target.value)}
                  placeholder="Enter certificate ID"
                  aria-label="Certificate ID"
                />
                <button type="button" onClick={() => void verifyCertificate()}>
                  Verify
                </button>
              </div>
              {verifyResult && <p className="hint">{verifyResult}</p>}
            </article>
          </section>
        )}

        {activeSection === "admin" && (
          <section className="section split">
            <article className="card">
              <h2>Admin CMS</h2>
              <p>Create, edit, and publish tutorials to the platform API.</p>
              <div className="auth-panel">
                <label className="cms-label">Title *</label>
                <input
                  value={adminTitle}
                  onChange={(event) => setAdminTitle(event.target.value)}
                  placeholder="Tutorial title"
                  aria-label="Tutorial title"
                />

                <label className="cms-label">Topic</label>
                <select value={adminTopic} onChange={(event) => setAdminTopic(event.target.value)}>
                  <option value="Web Development">Web Development</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="Databases">Databases</option>
                  <option value="Programming Languages">Programming Languages</option>
                </select>

                <label className="cms-label">Level</label>
                <select value={adminLevel} onChange={(event) => setAdminLevel(event.target.value as "Beginner" | "Intermediate")}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                </select>

                <label className="cms-label">Duration (e.g. "30 min")</label>
                <input
                  value={adminDuration}
                  onChange={(event) => setAdminDuration(event.target.value)}
                  placeholder="30 min"
                  aria-label="Duration"
                />

                <label className="cms-label">Description *</label>
                <textarea
                  value={adminDescription}
                  onChange={(event) => setAdminDescription(event.target.value)}
                  placeholder="Short tutorial description"
                  rows={2}
                />

                <label className="cms-label">Concepts (comma-separated)</label>
                <input
                  value={adminConcepts}
                  onChange={(event) => setAdminConcepts(event.target.value)}
                  placeholder="e.g. Variables, Loops, Functions"
                  aria-label="Concepts"
                />

                <label className="cms-label">Example HTML</label>
                <textarea
                  value={adminExampleHtml}
                  onChange={(event) => setAdminExampleHtml(event.target.value)}
                  placeholder="<h1>Hello World</h1>"
                  rows={3}
                  style={{ fontFamily: "monospace", fontSize: "0.85em" }}
                />

                <label className="cms-label">Example CSS</label>
                <textarea
                  value={adminExampleCss}
                  onChange={(event) => setAdminExampleCss(event.target.value)}
                  placeholder="h1 { color: #e44d26; }"
                  rows={3}
                  style={{ fontFamily: "monospace", fontSize: "0.85em" }}
                />

                <label className="cms-label">Example JavaScript</label>
                <textarea
                  value={adminExampleJs}
                  onChange={(event) => setAdminExampleJs(event.target.value)}
                  placeholder="console.log('Hello');"
                  rows={3}
                  style={{ fontFamily: "monospace", fontSize: "0.85em" }}
                />

                <label className="cms-label">Exercise Prompt</label>
                <input
                  value={adminExercisePrompt}
                  onChange={(event) => setAdminExercisePrompt(event.target.value)}
                  placeholder="e.g. Complete the missing keyword: _____"
                  aria-label="Exercise prompt"
                />

                <label className="cms-label">Exercise Answer *</label>
                <input
                  value={adminExerciseAnswer}
                  onChange={(event) => setAdminExerciseAnswer(event.target.value)}
                  placeholder="Correct answer"
                  aria-label="Exercise answer"
                />

                <label className="cms-label">Exercise Hint</label>
                <input
                  value={adminExerciseHint}
                  onChange={(event) => setAdminExerciseHint(event.target.value)}
                  placeholder="Optional hint for the user"
                  aria-label="Exercise hint"
                />

                <button type="button" onClick={() => void createOrUpdateAdminTutorial()}>
                  {editingTutorialId ? "Update Tutorial" : "Publish Tutorial"}
                </button>
                {editingTutorialId && (
                  <button type="button" onClick={cancelEditTutorial} style={{ marginLeft: "0.5rem" }}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </article>
            <article className="card">
              <h2>Published Tutorials</h2>
              <ul className="list">
                {tutorialsData.map((tutorial) => (
                  <li key={tutorial.id}>
                    {tutorial.title} ({tutorial.topic})
                    {userRole === "admin" && (
                      <span className="card-actions">
                        <button type="button" onClick={() => beginEditTutorial(tutorial)}>
                          Edit
                        </button>
                        {!seedTutorialIds.has(tutorial.id) && (
                          <button type="button" onClick={() => void deleteAdminTutorial(tutorial)}>
                            Delete
                          </button>
                        )}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          </section>
        )}
      </main>
      </div>
    </div>
  );
}

export default App;
