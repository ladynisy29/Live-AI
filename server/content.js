export const tutorials = [
  {
    id: "html-foundations",
    title: "HTML Foundations",
    level: "Beginner",
    duration: "42 min",
    topic: "Web Development",
    description: "Structure pages with semantic tags and accessible markup.",
    concepts: ["Headings", "Paragraphs", "Links", "Semantic layout"],
    exampleHtml: "<main>\n  <h1>Welcome</h1>\n  <p>This is your first semantic page.</p>\n  <a href='#'>Read more</a>\n</main>",
    exampleCss: "main { max-width: 560px; margin: 2rem auto; font-family: sans-serif; }\na { color: #9333ea; }",
    exampleJs: "console.log('HTML lesson loaded');",
    exercisePrompt: "<h1>_____ World</h1>",
    exerciseAnswer: "Hello",
    exerciseHint: "The expected output starts with H."
  },
  {
    id: "html-forms",
    title: "HTML Forms & Inputs",
    level: "Beginner",
    duration: "35 min",
    topic: "Web Development",
    description: "Build accessible forms with labels, inputs, selects, and validation attributes.",
    concepts: ["<form>", "<input> types", "<label>", "<select>", "required / placeholder"],
    exampleHtml: "<form>\n  <label for='name'>Name</label>\n  <input id='name' type='text' placeholder='Your name' required />\n  <label for='role'>Role</label>\n  <select id='role'>\n    <option>Developer</option>\n    <option>Designer</option>\n  </select>\n  <button type='submit'>Submit</button>\n</form>",
    exampleCss: "form { display: grid; gap: 8px; max-width: 320px; margin: 2rem auto; font-family: sans-serif; }\ninput, select { padding: 6px 10px; border: 1px solid #9333ea; border-radius: 6px; }\nbutton { background: #9333ea; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; }",
    exampleJs: "document.querySelector('form').addEventListener('submit', e => { e.preventDefault(); alert('Form submitted!'); });",
    exercisePrompt: "<input type='_____' placeholder='Enter email' />",
    exerciseAnswer: "email",
    exerciseHint: "Use the email input type for email addresses."
  },
  {
    id: "css-flexbox",
    title: "CSS Flexbox",
    level: "Beginner",
    duration: "38 min",
    topic: "Web Development",
    description: "Master one-dimensional layouts using the Flexbox model.",
    concepts: ["display: flex", "flex-direction", "justify-content", "align-items", "gap"],
    exampleHtml: "<div class='container'>\n  <div class='box'>1</div>\n  <div class='box'>2</div>\n  <div class='box'>3</div>\n</div>",
    exampleCss: ".container { display: flex; gap: 12px; justify-content: center; align-items: center; min-height: 160px; background: #0d0c1a; }\n.box { background: #9333ea; color: #fff; width: 60px; height: 60px; display: grid; place-content: center; border-radius: 8px; font-weight: bold; }",
    exampleJs: "",
    exercisePrompt: "/* Center items horizontally */\n.container { display: flex; _____-content: center; }",
    exerciseAnswer: "justify",
    exerciseHint: "The property is justify-content."
  },
  {
    id: "css-grid",
    title: "CSS Grid Layout",
    level: "Intermediate",
    duration: "45 min",
    topic: "Web Development",
    description: "Build powerful two-dimensional layouts with CSS Grid.",
    concepts: ["grid-template-columns", "grid-gap", "auto-fit / minmax", "grid-area"],
    exampleHtml: "<div class='grid'>\n  <header>Header</header>\n  <aside>Sidebar</aside>\n  <main>Content</main>\n  <footer>Footer</footer>\n</div>",
    exampleCss: ".grid { display: grid; grid-template-columns: 200px 1fr; grid-template-rows: auto 1fr auto; grid-template-areas: 'header header' 'sidebar content' 'footer footer'; gap: 8px; min-height: 200px; font-family: sans-serif; }\nheader { grid-area: header; background: #9333ea; color: #fff; padding: 12px; border-radius: 8px; }\naside { grid-area: sidebar; background: #1e1c35; color: #edeaf8; padding: 12px; border-radius: 8px; }\nmain { grid-area: content; background: #16142a; color: #edeaf8; padding: 12px; border-radius: 8px; }\nfooter { grid-area: footer; background: #2e2b52; color: #edeaf8; padding: 12px; border-radius: 8px; }",
    exampleJs: "",
    exercisePrompt: "/* Repeat 3 equal columns */\n.grid { display: grid; grid-template-columns: _____(3, 1fr); }",
    exerciseAnswer: "repeat",
    exerciseHint: "Use the repeat() function."
  },
  {
    id: "js-variables",
    title: "JavaScript Variables",
    level: "Beginner",
    duration: "30 min",
    topic: "Programming Languages",
    description: "Learn how to declare, initialize and update variables using var, let, and const.",
    concepts: ["var", "let", "const", "Hoisting", "Block scope"],
    exampleHtml: "<h1 id='out'>Result: ?</h1>",
    exampleCss: "body { font-family: sans-serif; display: grid; place-content: center; min-height: 100px; background: #0d0c1a; color: #edeaf8; }",
    exampleJs: "const greeting = 'Hello';\nlet name = 'World';\ndocument.getElementById('out').textContent = `Result: ${greeting}, ${name}!`;",
    exercisePrompt: "Declare a constant: _____ PI = 3.14;",
    exerciseAnswer: "const",
    exerciseHint: "Use const for values that do not change."
  },
  {
    id: "js-functions",
    title: "JavaScript Functions",
    level: "Beginner",
    duration: "35 min",
    topic: "Programming Languages",
    description: "Write reusable blocks of code with function declarations, expressions, and arrow functions.",
    concepts: ["Function declaration", "Arrow functions", "Parameters & return", "Default params"],
    exampleHtml: "<pre id='out'></pre>",
    exampleCss: "body { font-family: monospace; background: #0d0c1a; color: #c9b8f5; padding: 1rem; }",
    exampleJs: "const greet = (name = 'World') => `Hello, ${name}!`;\ndocument.getElementById('out').textContent = greet('Developer');",
    exercisePrompt: "const add = (a, b) _____ a + b;",
    exerciseAnswer: "=>",
    exerciseHint: "Arrow functions use => instead of the function keyword."
  },
  {
    id: "js-dom",
    title: "JavaScript DOM Manipulation",
    level: "Beginner",
    duration: "40 min",
    topic: "Programming Languages",
    description: "Select, modify, and react to HTML elements using the Document Object Model.",
    concepts: ["querySelector", "textContent / innerHTML", "addEventListener", "classList"],
    exampleHtml: "<button id='btn'>Click me</button>\n<p id='msg'></p>",
    exampleCss: "body { font-family: sans-serif; display: grid; place-content: center; gap: 12px; min-height: 120px; background: #0d0c1a; color: #edeaf8; }\nbutton { background: #9333ea; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; font-size: 1rem; }",
    exampleJs: "let count = 0;\ndocument.getElementById('btn').addEventListener('click', () => {\n  count++;\n  document.getElementById('msg').textContent = `Clicked ${count} time(s)`;\n});",
    exercisePrompt: "document.___('btn').addEventListener('click', handler);",
    exerciseAnswer: "getElementById",
    exerciseHint: "Use getElementById to select by ID."
  },
  {
    id: "js-promises",
    title: "Async JavaScript & Promises",
    level: "Intermediate",
    duration: "45 min",
    topic: "Programming Languages",
    description: "Handle asynchronous operations using Promises, async/await, and the Fetch API.",
    concepts: ["Promise", "async/await", "fetch()", "Error handling with try/catch"],
    exampleHtml: "<pre id='out'>Loading...</pre>",
    exampleCss: "body { font-family: monospace; background: #0d0c1a; color: #c9b8f5; padding: 1rem; }",
    exampleJs: "async function getData() {\n  try {\n    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');\n    const data = await res.json();\n    document.getElementById('out').textContent = JSON.stringify(data, null, 2);\n  } catch (err) {\n    document.getElementById('out').textContent = 'Error: ' + err.message;\n  }\n}\ngetData();",
    exercisePrompt: "const res = _____ fetch(url);",
    exerciseAnswer: "await",
    exerciseHint: "Use await before fetch() inside an async function."
  },
  {
    id: "python-intro",
    title: "Python Introduction",
    level: "Beginner",
    duration: "30 min",
    topic: "Programming Languages",
    description: "Get started with Python syntax, variables, and print statements.",
    concepts: ["Variables", "print()", "Data types", "Comments"],
    exampleHtml: "<pre id='out'>Run the code to see output</pre>",
    exampleCss: "body { font-family: monospace; background: #0d0c1a; color: #c9b8f5; padding: 1rem; }",
    exampleJs: "// Python runs server-side; this simulates the output\nconst output = `name = 'Alice'\\nage = 30\\nprint(f'Hello, {name}! You are {age} years old.')`;\ndocument.getElementById('out').textContent = output;",
    exercisePrompt: "_____(\"Hello, Python!\")",
    exerciseAnswer: "print",
    exerciseHint: "Python uses print() to display output."
  },
  {
    id: "sql-select",
    title: "SQL SELECT Statements",
    level: "Beginner",
    duration: "25 min",
    topic: "Databases",
    description: "Query databases using SELECT, WHERE, ORDER BY, and LIMIT.",
    concepts: ["SELECT", "FROM", "WHERE", "ORDER BY", "LIMIT"],
    exampleHtml: "<pre id='out'></pre>",
    exampleCss: "body { font-family: monospace; background: #0d0c1a; color: #c9b8f5; padding: 1rem; }",
    exampleJs: "// Simulated SQL result\nconst rows = [\n  { id: 1, name: 'Alice', role: 'admin' },\n  { id: 2, name: 'Bob', role: 'user' },\n  { id: 3, name: 'Carol', role: 'user' }\n];\nconst query = 'SELECT * FROM users WHERE role = \"user\" ORDER BY name';\nconst result = rows.filter(r => r.role === 'user').sort((a,b) => a.name.localeCompare(b.name));\ndocument.getElementById('out').textContent = query + '\\n\\n' + JSON.stringify(result, null, 2);",
    exercisePrompt: "_____ * FROM users WHERE id = 1;",
    exerciseAnswer: "SELECT",
    exerciseHint: "SQL queries start with SELECT."
  },
  {
    id: "node-express",
    title: "Node.js & Express",
    level: "Intermediate",
    duration: "50 min",
    topic: "Backend Development",
    description: "Build RESTful APIs with Node.js and the Express framework.",
    concepts: ["require / import", "express()", "app.get / post", "req & res", "Middleware"],
    exampleHtml: "<pre id='out'></pre>",
    exampleCss: "body { font-family: monospace; background: #0d0c1a; color: #c9b8f5; padding: 1rem; }",
    exampleJs: "// Express server example (runs Node.js server-side)\nconst example = `import express from 'express';\nconst app = express();\n\napp.get('/hello', (req, res) => {\n  res.json({ message: 'Hello World' });\n});\n\napp.listen(3000, () => console.log('Server on port 3000'));`;\ndocument.getElementById('out').textContent = example;",
    exercisePrompt: "app.___('/users', handler);",
    exerciseAnswer: "get",
    exerciseHint: "Use app.get() to handle GET requests."
  }
];

export const learningPaths = [
  {
    name: "Web Development Path",
    steps: ["HTML", "CSS", "JavaScript", "Git", "React", "Node.js", "Databases"],
    level: "Beginner to Job-Ready"
  },
  {
    name: "Python Developer Path",
    steps: ["Python Basics", "Data Structures", "OOP", "File I/O", "APIs", "Django/Flask"],
    level: "Beginner to Intermediate"
  },
  {
    name: "Data & SQL Path",
    steps: ["SQL Basics", "Joins", "Aggregations", "Indexes", "PostgreSQL", "Python + Pandas"],
    level: "Beginner to Intermediate"
  },
  {
    name: "Full-Stack Path",
    steps: ["HTML/CSS", "JavaScript", "React", "Node.js", "SQL", "DevOps Basics"],
    level: "Intermediate to Advanced"
  }
];

export const quizzes = [
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
    question: "Which CSS property controls the text size?",
    options: ["font-weight", "text-size", "font-size", "letter-spacing"],
    answer: 2,
    explanation: "font-size controls how large the text is rendered."
  },
  {
    id: 3,
    question: "What keyword declares a block-scoped variable in JavaScript?",
    options: ["var", "define", "let", "dim"],
    answer: 2,
    explanation: "let declares a block-scoped variable. const is also block-scoped but immutable."
  },
  {
    id: 4,
    question: "Which SQL clause filters rows?",
    options: ["HAVING", "WHERE", "FILTER", "SELECT"],
    answer: 1,
    explanation: "WHERE filters rows before grouping. HAVING filters after GROUP BY."
  },
  {
    id: 5,
    question: "Which CSS layout model arranges items in a single line or column?",
    options: ["Grid", "Flexbox", "Float", "Table"],
    answer: 1,
    explanation: "Flexbox is a one-dimensional layout model. Grid is two-dimensional."
  }
];

export const certificationExam = [
  ...quizzes,
  {
    id: 2,
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

export const codeTemplates = [
  {
    id: "portfolio",
    name: "Portfolio Website",
    category: "Template",
    html: "<main class='hero'>\n  <h1>Alex Doe</h1>\n  <p>Frontend Developer</p>\n  <a href='#contact'><button>Contact</button></a>\n</main>",
    css: "body { margin: 0; font-family: sans-serif; }\n.hero { min-height: 100vh; display: grid; place-content: center; text-align: center; gap: 8px; background: linear-gradient(135deg, #1a0f2e, #0d0c1a); color: #edeaf8; }\nh1 { font-size: 3rem; color: #a855f7; margin: 0; }\nbutton { background: #9333ea; color: #fff; border: none; padding: 12px 32px; border-radius: 8px; font-size: 1rem; cursor: pointer; }",
    js: "console.log('Portfolio template loaded');"
  },
  {
    id: "landing-page",
    name: "Landing Page",
    category: "Template",
    html: "<nav class='nav'><span class='logo'>Brand</span><div><a href='#'>Home</a><a href='#'>About</a><button>Get Started</button></div></nav>\n<section class='hero'>\n  <h1>Build Something Great</h1>\n  <p>The fastest way to launch your idea.</p>\n  <button class='cta'>Start Free Trial</button>\n</section>",
    css: "* { box-sizing: border-box; margin: 0; }\nbody { font-family: sans-serif; background: #0d0c1a; color: #edeaf8; }\n.nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; border-bottom: 1px solid #2e2b52; }\n.logo { font-weight: 800; color: #a855f7; font-size: 1.2rem; }\n.nav a { color: #9490b8; text-decoration: none; margin: 0 0.75rem; }\n.nav button { background: #9333ea; color: #fff; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; }\n.hero { min-height: calc(100vh - 60px); display: grid; place-content: center; text-align: center; gap: 1rem; padding: 2rem; }\nh1 { font-size: clamp(2rem, 6vw, 3.5rem); background: linear-gradient(135deg, #c084fc, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }\n.cta { background: #9333ea; color: #fff; border: none; padding: 14px 36px; border-radius: 8px; font-size: 1.1rem; cursor: pointer; }",
    js: "document.querySelector('.cta').addEventListener('click', () => alert('Welcome aboard!'));"
  },
  {
    id: "card-component",
    name: "Card Component",
    category: "Component",
    html: "<div class='cards'>\n  <div class='card'>\n    <div class='card-img'>🚀</div>\n    <h3>Launch Fast</h3>\n    <p>Get your project live in minutes with our starter kit.</p>\n    <button>Learn More</button>\n  </div>\n  <div class='card'>\n    <div class='card-img'>🎨</div>\n    <h3>Beautiful Design</h3>\n    <p>Pre-built components that look great out of the box.</p>\n    <button>Learn More</button>\n  </div>\n  <div class='card'>\n    <div class='card-img'>⚡</div>\n    <h3>Fast Performance</h3>\n    <p>Optimized for speed so your users stay happy.</p>\n    <button>Learn More</button>\n  </div>\n</div>",
    css: "* { box-sizing: border-box; }\nbody { font-family: sans-serif; background: #0d0c1a; display: grid; place-content: center; min-height: 100vh; padding: 1rem; }\n.cards { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }\n.card { background: #16142a; border: 1px solid #2e2b52; border-radius: 12px; padding: 1.5rem; max-width: 220px; text-align: center; transition: transform 200ms, box-shadow 200ms; }\n.card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(147,51,234,0.25); border-color: #9333ea; }\n.card-img { font-size: 2.5rem; margin-bottom: 0.75rem; }\nh3 { color: #a855f7; margin: 0 0 0.5rem; }\np { color: #9490b8; font-size: 0.9rem; }\nbutton { background: #9333ea; color: #fff; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; margin-top: 0.75rem; font-size: 0.85rem; }",
    js: "document.querySelectorAll('.card button').forEach(btn => btn.addEventListener('click', () => alert('Opening: ' + btn.closest('.card').querySelector('h3').textContent)));"
  },
  {
    id: "dark-table",
    name: "Data Table",
    category: "Component",
    html: "<div class='wrap'>\n  <h2>User Directory</h2>\n  <input id='search' placeholder='Search...' />\n  <table>\n    <thead><tr><th>Name</th><th>Role</th><th>Status</th></tr></thead>\n    <tbody id='tbody'></tbody>\n  </table>\n</div>",
    css: "* { box-sizing: border-box; }\nbody { font-family: sans-serif; background: #0d0c1a; color: #edeaf8; padding: 2rem; }\n.wrap h2 { color: #a855f7; margin: 0 0 1rem; }\ninput { background: #1e1c35; border: 1px solid #2e2b52; color: #edeaf8; padding: 8px 12px; border-radius: 6px; width: 100%; margin-bottom: 1rem; font-size: 0.9rem; }\ntable { width: 100%; border-collapse: collapse; }\nth { background: #1e1c35; color: #a855f7; text-align: left; padding: 10px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }\ntd { padding: 10px; border-bottom: 1px solid #2e2b52; font-size: 0.9rem; }\ntr:hover td { background: #1e1c35; }\n.badge { padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }\n.badge-green { background: #14532d; color: #22c55e; }\n.badge-gray { background: #1e1c35; color: #9490b8; }",
    js: "const users = [{name:'Alice',role:'Admin',status:'active'},{name:'Bob',role:'User',status:'inactive'},{name:'Carol',role:'User',status:'active'},{name:'Dan',role:'Moderator',status:'active'}];\nconst tbody = document.getElementById('tbody');\nfunction render(list) {\n  tbody.innerHTML = list.map(u => `<tr><td>${u.name}</td><td>${u.role}</td><td><span class='badge ${u.status==='active'?'badge-green':'badge-gray'}'>${u.status}</span></td></tr>`).join('');\n}\nrender(users);\ndocument.getElementById('search').addEventListener('input', e => render(users.filter(u => u.name.toLowerCase().includes(e.target.value.toLowerCase()))));"
  }
];
