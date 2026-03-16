import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "learnwithladynisy-db.json");

function initialData() {
  return {
    users: [],
    sessions: [],
    progress: [],
    snippets: [],
    certificates: [],
    customTutorials: []
  };
}

function ensureDbFile() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(initialData(), null, 2), "utf8");
  }
}

function readDb() {
  ensureDbFile();
  const raw = fs.readFileSync(dbPath, "utf8");
  const parsed = JSON.parse(raw);
  const base = initialData();
  return {
    ...base,
    ...parsed,
    users: Array.isArray(parsed.users) ? parsed.users : [],
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    progress: Array.isArray(parsed.progress) ? parsed.progress : [],
    snippets: Array.isArray(parsed.snippets) ? parsed.snippets : [],
    certificates: Array.isArray(parsed.certificates) ? parsed.certificates : [],
    customTutorials: Array.isArray(parsed.customTutorials) ? parsed.customTutorials : []
  };
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
}

export function createUser(user) {
  const db = readDb();
  db.users.push(user);
  writeDb(db);
  return user;
}

export function findUserByEmail(email) {
  const db = readDb();
  return db.users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) || null;
}

export function findUserById(id) {
  const db = readDb();
  return db.users.find((user) => user.id === id) || null;
}

export function countRegisteredUsers() {
  const db = readDb();
  return db.users.filter((user) => user.role && user.role !== "guest").length;
}

export function countAdmins() {
  const db = readDb();
  return db.users.filter((user) => user.role === "admin").length;
}

export function createSession(session) {
  const db = readDb();
  db.sessions.push(session);
  writeDb(db);
  return session;
}

export function findSession(token) {
  const db = readDb();
  return db.sessions.find((session) => session.token === token) || null;
}

export function deleteSession(token) {
  const db = readDb();
  db.sessions = db.sessions.filter((session) => session.token !== token);
  writeDb(db);
}

export function getProgress(userId) {
  const db = readDb();
  return db.progress.filter((row) => row.userId === userId).map((row) => row.lessonId);
}

export function upsertProgress(userId, lessonId, completedAt) {
  const db = readDb();
  const existing = db.progress.find((row) => row.userId === userId && row.lessonId === lessonId);
  if (existing) {
    existing.completedAt = completedAt;
  } else {
    db.progress.push({ userId, lessonId, completedAt });
  }
  writeDb(db);
}

export function listSnippets(userId) {
  const db = readDb();
  return db.snippets
    .filter((snippet) => snippet.userId === userId)
    .sort((a, b) => b.created_at - a.created_at);
}

export function insertSnippet(snippet) {
  const db = readDb();
  db.snippets.push(snippet);
  writeDb(db);
  return snippet;
}

export function removeSnippet(userId, snippetId) {
  const db = readDb();
  db.snippets = db.snippets.filter((snippet) => !(snippet.userId === userId && snippet.id === snippetId));
  writeDb(db);
}

export function insertCertificate(certificate) {
  const db = readDb();
  db.certificates.push(certificate);
  writeDb(db);
  return certificate;
}

export function findCertificate(certId) {
  const db = readDb();
  return db.certificates.find((cert) => cert.id === certId) || null;
}

export function listCustomTutorials() {
  const db = readDb();
  return db.customTutorials;
}

export function addCustomTutorial(tutorial) {
  const db = readDb();
  const existingIdx = db.customTutorials.findIndex((item) => item.id === tutorial.id);
  if (existingIdx >= 0) {
    db.customTutorials[existingIdx] = tutorial;
  } else {
    db.customTutorials.push(tutorial);
  }
  writeDb(db);
  return tutorial;
}

export function updateCustomTutorial(tutorialId, tutorialPatch) {
  const db = readDb();
  const idx = db.customTutorials.findIndex((item) => item.id === tutorialId);
  if (idx < 0) {
    return null;
  }
  db.customTutorials[idx] = {
    ...db.customTutorials[idx],
    ...tutorialPatch,
    id: tutorialId
  };
  writeDb(db);
  return db.customTutorials[idx];
}

export function deleteCustomTutorial(tutorialId) {
  const db = readDb();
  const initial = db.customTutorials.length;
  db.customTutorials = db.customTutorials.filter((item) => item.id !== tutorialId);
  writeDb(db);
  return db.customTutorials.length !== initial;
}
