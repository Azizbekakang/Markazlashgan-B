import type { Handler } from "@netlify/functions";

const subjects = [
  { id: "math", name: "Matematika", grade: 8, color: "#625bf6", icon: "calculator", lessons: 24 },
  { id: "uzbek", name: "Ona tili", grade: 8, color: "#f59e0b", icon: "book-open", lessons: 18 },
  { id: "english", name: "Ingliz tili", grade: 8, color: "#16a085", icon: "languages", lessons: 20 },
  { id: "history", name: "O'zbekiston tarixi", grade: 8, color: "#e76f51", icon: "landmark", lessons: 16 },
  { id: "physics", name: "Fizika", grade: 8, color: "#4385f5", icon: "atom", lessons: 14 },
  { id: "biology", name: "Biologiya", grade: 8, color: "#35a66f", icon: "leaf", lessons: 15 }
];

export const handler: Handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const path = event.path.replace("/.netlify/functions/api", "").replace(/^\/api/, "");
  if (path === "/health" || path === "" || path === "/") {
    return { statusCode: 200, headers, body: JSON.stringify({ status: "ok", service: "markazlashgan-b-api", version: "1.0.0" }) };
  }

  if (path === "/subjects") {
    return { statusCode: 200, headers, body: JSON.stringify({ data: subjects }) };
  }

  return { statusCode: 404, headers, body: JSON.stringify({ error: "Endpoint not found" }) };
};
