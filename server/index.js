import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import {
  addCustomTutorial,
  countAdmins,
  countRegisteredUsers,
  createUser,
  createSession,
  deleteCustomTutorial,
  deleteSession,
  findCertificate,
  findSession,
  findUserByEmail,
  findUserById,
  getProgress,
  insertCertificate,
  insertSnippet,
  listCustomTutorials,
  listSnippets,
  removeSnippet,
  updateCustomTutorial,
  upsertProgress
} from "./db.js";
import {
  certificationExam,
  certifications,
  codeTemplates,
  learningPaths,
  quizzes,
  references,
  tutorials
} from "./content.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function now() {
  return Date.now();
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

function makePasswordRecord(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);
  return `${salt}:${hash}`;
}

function verifyPassword(password, passwordRecord) {
  const [salt, expectedHash] = String(passwordRecord || "").split(":");
  if (!salt || !expectedHash) {
    return false;
  }
  const actual = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expectedHash));
}

function getTokenFromReq(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return null;
  }
  return header.slice(7);
}

function requireAuth(req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const session = findSession(token);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = findUserById(session.userId);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.user = user;
  req.token = token;
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((value) => typeof value !== "string" || value.trim().length === 0)) {
    res.status(400).json({ error: "name, email, and password are required" });
    return;
  }

  if (findUserByEmail(email)) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const role = countAdmins() === 0 || countRegisteredUsers() === 0 ? "admin" : "student";

  const user = createUser({
    id: uid("user"),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: makePasswordRecord(password),
    role,
    createdAt: now()
  });

  const token = uid("token");
  createSession({ token, userId: user.id, createdAt: now() });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.post("/api/auth/dev-seed-admin", (_req, res) => {
  const allowDevAdmin = process.env.ALLOW_DEV_ADMIN !== "false";
  if (!allowDevAdmin) {
    res.status(403).json({ error: "Dev admin endpoint disabled" });
    return;
  }

  const email = "admin@learnwithladynisy.local";
  const password = "Admin123!";
  const existing = findUserByEmail(email);

  const user =
    existing ||
    createUser({
      id: uid("user"),
      name: "Platform Admin",
      email,
      passwordHash: makePasswordRecord(password),
      role: "admin",
      createdAt: now()
    });

  const token = uid("token");
  createSession({ token, userId: user.id, createdAt: now() });

  res.json({
    token,
    seeded: !existing,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    credentials: {
      email,
      password
    }
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = uid("token");
  createSession({ token, userId: user.id, createdAt: now() });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

app.post("/api/auth/logout", requireAuth, (req, res) => {
  deleteSession(req.token);
  res.json({ ok: true });
});

app.get("/api/content/bootstrap", (_req, res) => {
  res.json({
    tutorials: [...tutorials, ...listCustomTutorials()],
    learningPaths,
    quizzes,
    certificationExam,
    references,
    certifications,
    codeTemplates
  });
});

app.post("/api/admin/tutorials", requireAuth, requireAdmin, (req, res) => {
  const tutorial = req.body;
  if (!tutorial || typeof tutorial.id !== "string" || typeof tutorial.title !== "string") {
    res.status(400).json({ error: "Invalid tutorial payload" });
    return;
  }
  const created = addCustomTutorial(tutorial);
  res.status(201).json({ tutorial: created });
});

app.put("/api/admin/tutorials/:tutorialId", requireAuth, requireAdmin, (req, res) => {
  const { tutorialId } = req.params;
  const updated = updateCustomTutorial(tutorialId, req.body || {});
  if (!updated) {
    res.status(404).json({ error: "Tutorial not found" });
    return;
  }
  res.json({ tutorial: updated });
});

app.delete("/api/admin/tutorials/:tutorialId", requireAuth, requireAdmin, (req, res) => {
  const { tutorialId } = req.params;
  const deleted = deleteCustomTutorial(tutorialId);
  if (!deleted) {
    res.status(404).json({ error: "Tutorial not found" });
    return;
  }
  res.json({ ok: true });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "learnwithladynisy-api" });
});

app.post("/api/users/guest", (_req, res) => {
  const userId = uid("user");
  const name = "Guest";
  createUser({ id: userId, name, email: null, passwordHash: null, role: "guest", createdAt: now() });
  res.status(201).json({ userId, name });
});

app.get("/api/users/:userId/progress", (req, res) => {
  const { userId } = req.params;
  const completedLessons = getProgress(userId);
  res.json({ completedLessons });
});

app.post("/api/users/:userId/progress", (req, res) => {
  const { userId } = req.params;
  const { lessonId } = req.body;

  if (typeof lessonId !== "string" || lessonId.length === 0) {
    res.status(400).json({ error: "lessonId is required" });
    return;
  }

  upsertProgress(userId, lessonId, now());

  res.status(201).json({ ok: true });
});

app.get("/api/users/:userId/snippets", (req, res) => {
  const { userId } = req.params;
  res.json({ snippets: listSnippets(userId) });
});

app.post("/api/users/:userId/snippets", (req, res) => {
  const { userId } = req.params;
  const { name, html, css, js } = req.body;

  if ([name, html, css, js].some((v) => typeof v !== "string")) {
    res.status(400).json({ error: "name, html, css, and js are required" });
    return;
  }

  const snippetId = uid("snippet");
  const createdAt = now();

  const snippet = insertSnippet({
    id: snippetId,
    userId,
    name: name.trim(),
    html,
    css,
    js,
    created_at: createdAt
  });

  res.status(201).json({
    snippet
  });
});

app.delete("/api/users/:userId/snippets/:snippetId", (req, res) => {
  const { userId, snippetId } = req.params;
  removeSnippet(userId, snippetId);
  res.json({ ok: true });
});

app.post("/api/exams/submit", (req, res) => {
  const { userId, score, total } = req.body;

  if (typeof userId !== "string" || typeof score !== "number" || typeof total !== "number") {
    res.status(400).json({ error: "userId, score and total are required" });
    return;
  }

  const passed = total > 0 ? score / total >= 0.7 : false;
  let certId = null;

  if (passed) {
    certId = `LWLN-${new Date().getFullYear()}-${Math.random().toString().slice(2, 8)}`;
    insertCertificate({
      id: certId,
      userId,
      score,
      total,
      issuedAt: now()
    });
  }

  res.json({ passed, certId, score, total });
});

app.get("/api/certificates/:certId", (req, res) => {
  const { certId } = req.params;
  const row = findCertificate(certId);

  if (!row) {
    res.status(404).json({ verified: false });
    return;
  }

  res.json({
    verified: true,
    certificate: {
      id: row.id,
      userId: row.userId,
      score: row.score,
      total: row.total,
      issuedAt: row.issuedAt
    }
  });
});

app.listen(port, () => {
  console.log(`learnwithladynisy API running on http://localhost:${port}`);
});
