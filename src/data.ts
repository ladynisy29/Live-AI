import type { CodeTemplate, LearningPath, QuizQuestion, TutorialLesson } from "./types";

export const tutorials: TutorialLesson[] = [
  {
    id: "html-foundations",
    title: "HTML Foundations",
    level: "Beginner",
    duration: "42 min",
    topic: "Web Development",
    description: "Structure pages with semantic tags and accessible markup.",
    concepts: ["Headings", "Paragraphs", "Links", "Semantic layout"],
    exampleHtml: `<main>
  <h1>Welcome</h1>
  <p>This is your first semantic page.</p>
  <a href="#">Read more</a>
</main>`,
    exampleCss: `main { max-width: 560px; margin: 2rem auto; font-family: sans-serif; }\na { color: #b44d00; }`,
    exampleJs: `console.log("HTML lesson loaded");`,
    exercisePrompt: `<h1>_____ World</h1>`,
    exerciseAnswer: "Hello",
    exerciseHint: "The expected output starts with H."
  },
  {
    id: "css-layout-studio",
    title: "CSS Layout Studio",
    level: "Beginner",
    duration: "58 min",
    topic: "Web Development",
    description: "Build responsive layouts using Flexbox and Grid.",
    concepts: ["Box model", "Flexbox", "Grid", "Responsive breakpoints"],
    exampleHtml: `<section class="wrap">\n  <article>Card 1</article>\n  <article>Card 2</article>\n  <article>Card 3</article>\n</section>`,
    exampleCss: `.wrap { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }\narticle { padding: 12px; border: 1px solid #ccc; }`,
    exampleJs: `console.log("Try switching to 1 column on mobile");`,
    exercisePrompt: `display: _____;`,
    exerciseAnswer: "flex",
    exerciseHint: "Use the CSS layout system for one-dimensional alignment."
  },
  {
    id: "javascript-essentials",
    title: "JavaScript Essentials",
    level: "Beginner",
    duration: "75 min",
    topic: "Programming Languages",
    description: "Learn variables, functions, arrays, objects, and APIs.",
    concepts: ["Variables", "Functions", "Arrays", "Objects", "Fetch API"],
    exampleHtml: `<button id="sumBtn">Run</button>\n<p id="out"></p>`,
    exampleCss: `body { font-family: sans-serif; padding: 24px; }`,
    exampleJs: `const nums = [2, 4, 6];\ndocument.getElementById("sumBtn")?.addEventListener("click", () => {\n  const total = nums.reduce((a, b) => a + b, 0);\n  const out = document.getElementById("out");\n  if (out) out.textContent = String(total);\n});`,
    exercisePrompt: `const greeting = "_____";`,
    exerciseAnswer: "Hello",
    exerciseHint: "Use the most common first greeting used in examples."
  },
  {
    id: "node-api-kickstart",
    title: "Node.js API Kickstart",
    level: "Intermediate",
    duration: "64 min",
    topic: "Backend Development",
    description: "Create your first REST API with Express patterns.",
    concepts: ["Routes", "Request/response", "Middleware", "JSON APIs"],
    exampleHtml: `<h2>Node.js API Notes</h2>\n<pre>app.get('/api/users', handler)</pre>`,
    exampleCss: `pre { background: #111; color: #f8f8f2; padding: 12px; }`,
    exampleJs: `console.log("Backend concepts are taught with examples and diagrams");`,
    exercisePrompt: `app._____("/api/users", handler);`,
    exerciseAnswer: "get",
    exerciseHint: "Use the HTTP verb for fetching data."
  },
  {
    id: "sql-query-lab",
    title: "SQL Query Lab",
    level: "Beginner",
    duration: "50 min",
    topic: "Databases",
    description: "Write SELECT, JOIN, and GROUP BY queries with confidence.",
    concepts: ["SELECT", "WHERE", "JOIN", "GROUP BY"],
    exampleHtml: `<h2>SQL Practice</h2>\n<pre>SELECT name FROM users WHERE active = 1;</pre>`,
    exampleCss: `h2 { font-family: sans-serif; }`,
    exampleJs: `console.log("Practice SQL in the quiz and exercises");`,
    exercisePrompt: `SELECT _____ FROM users;`,
    exerciseAnswer: "*",
    exerciseHint: "Use the wildcard to return all columns."
  }
];

export const learningPaths: LearningPath[] = [
  {
    name: "Web Development Path",
    steps: ["HTML", "CSS", "JavaScript", "Git", "React", "Node.js", "Databases"],
    level: "Beginner to Job-Ready"
  },
  {
    name: "Python Developer Path",
    steps: ["Python Basics", "Data Structures", "APIs", "Flask", "SQL", "Testing"],
    level: "Beginner to Intermediate"
  },
  {
    name: "Backend Engineer Path",
    steps: ["Node.js", "Express", "SQL", "MongoDB", "Auth", "Deployment"],
    level: "Intermediate"
  }
];

export const quizzes: QuizQuestion[] = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks Text Management Language"
    ],
    answer: 0,
    explanation: "HTML means Hyper Text Markup Language."
  },
  {
    id: 2,
    question: "Which CSS property creates a flexible row layout?",
    options: ["position", "display: flex", "float"],
    answer: 1,
    explanation: "Set display to flex on a container to create a flexible layout."
  },
  {
    id: 3,
    question: "Which JavaScript object is used to make HTTP requests in modern browsers?",
    options: ["Promise", "Set", "fetch"],
    answer: 2,
    explanation: "fetch() is the modern browser API for HTTP requests."
  }
];

export const certificationExam: QuizQuestion[] = [
  ...quizzes,
  {
    id: 4,
    question: "Which SQL keyword combines rows from two tables based on a related column?",
    options: ["GROUP", "JOIN", "ORDER"],
    answer: 1,
    explanation: "JOIN combines rows from multiple tables using relationships."
  },
  {
    id: 5,
    question: "Which statement best describes React?",
    options: [
      "A backend framework for SQL databases",
      "A JavaScript library for building user interfaces",
      "A CSS preprocessor"
    ],
    answer: 1,
    explanation: "React is a JavaScript library focused on building user interfaces."
  }
];

export const references = {
  HTML: ["<a>", "<p>", "<div>", "<section>", "<header>", "<footer>", "<nav>", "<form>", "<input>", "<button>"],
  CSS: ["display", "position", "flex", "grid", "gap", "margin", "padding", "border", "color", "font-size"],
  JavaScript: ["Array", "Object", "Promise", "async/await", "fetch()", "Map", "Set", "localStorage", "JSON"],
  Python: ["print()", "def", "list", "dict", "for", "while", "import", "class", "try/except"],
  SQL: ["SELECT", "FROM", "WHERE", "JOIN", "GROUP BY", "ORDER BY", "INSERT", "UPDATE", "DELETE"],
  Node: ["require()", "import", "fs", "path", "http", "express", "process.env", "Buffer"]
};

export const certifications = [
  "HTML Developer",
  "CSS Developer",
  "JavaScript Developer",
  "Python Developer",
  "SQL Developer"
];

export const codeTemplates: CodeTemplate[] = [
  {
    id: "portfolio",
    name: "Portfolio Website",
    category: "Template",
    html: `<main class="hero">\n  <h1>Alex Doe</h1>\n  <p>Frontend Developer</p>\n  <button>Contact</button>\n</main>`,
    css: `body { margin: 0; font-family: sans-serif; }\n.hero { min-height: 100vh; display: grid; place-content: center; text-align: center; gap: 8px; background: linear-gradient(135deg, #ffe6cf, #fffaf5); }\nbutton { padding: 10px 16px; border-radius: 999px; border: 1px solid #d46324; background: #d46324; color: #fff; }`,
    js: `console.log("Portfolio template loaded");`
  },
  {
    id: "landing",
    name: "Landing Page",
    category: "Template",
    html: `<header class="hero">\n  <h1>Build Better Apps</h1>\n  <p>Ship quickly with reusable components.</p>\n</header>`,
    css: `.hero { padding: 72px 24px; text-align: center; font-family: system-ui; background: linear-gradient(135deg, #ffd1a8, #fff); }\n.hero h1 { margin: 0; font-size: clamp(2rem, 5vw, 3rem); }`,
    js: `console.log("Landing template loaded");`
  },
  {
    id: "login",
    name: "Login Form",
    category: "Snippet",
    html: `<form class="login">\n  <h2>Sign In</h2>\n  <input placeholder="Email" />\n  <input placeholder="Password" type="password" />\n  <button>Login</button>\n</form>`,
    css: `body { display: grid; place-items: center; min-height: 100vh; margin: 0; font-family: sans-serif; background: #fff7f0; }\n.login { width: min(92vw, 320px); display: grid; gap: 10px; padding: 16px; border-radius: 12px; border: 1px solid #efc39f; background: #fff; }`,
    js: `document.querySelector("form")?.addEventListener("submit", (event) => event.preventDefault());`
  },
  {
    id: "dashboard",
    name: "Dashboard UI",
    category: "Template",
    html: `<section class="dash">\n  <aside>Menu</aside>\n  <main>Analytics</main>\n</section>`,
    css: `.dash { min-height: 100vh; display: grid; grid-template-columns: 220px 1fr; font-family: sans-serif; }\naside { background: #2b1d13; color: white; padding: 20px; }\nmain { padding: 20px; background: #fff8f2; }`,
    js: `console.log("Dashboard template loaded");`
  }
];
