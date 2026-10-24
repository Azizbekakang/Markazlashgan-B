import type { Handler } from "@netlify/functions";

const subjects = [
  { id: "math", name: "Matematika", grade: 8, color: "#625bf6", icon: "calculator", lessons: 24 },
  { id: "uzbek", name: "Ona tili", grade: 8, color: "#f59e0b", icon: "book-open", lessons: 18 },
  { id: "english", name: "Ingliz tili", grade: 8, color: "#16a085", icon: "languages", lessons: 20 },
  { id: "history", name: "O'zbekiston tarixi", grade: 8, color: "#e76f51", icon: "landmark", lessons: 16 },
  { id: "physics", name: "Fizika", grade: 8, color: "#4385f5", icon: "atom", lessons: 14 },
  { id: "biology", name: "Biologiya", grade: 8, color: "#35a66f", icon: "leaf", lessons: 15 }
] as const;

const json = (statusCode: number, payload: unknown, headers: Record<string, string>) => ({
  statusCode,
  headers,
  body: JSON.stringify(payload)
});

const getConfig = () => {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing");
  return { url, key };
};

const readBody = (body: string | null): Record<string, unknown> => {
  if (!body) return {};
  try {
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    return parsed as Record<string, unknown>;
  } catch {
    throw new TypeError("Request body must be a valid JSON object");
  }
};

const handler: Handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  const path = event.path.replace("/.netlify/functions/api", "").replace(/^\/api/, "") || "/";
  if (path === "/health" || path === "/") {
    return json(200, { status: "ok", service: "markazlashgan-b-api", version: "1.1.0" }, headers);
  }
  if (path === "/subjects" && event.httpMethod === "GET") {
    return json(200, { data: subjects }, headers);
  }

  if (!["GET", "POST"].includes(event.httpMethod)) {
    return json(405, { error: "Method not allowed" }, headers);
  }

  const authorization = event.headers.authorization ?? event.headers.Authorization;
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return json(401, { error: "Authentication required" }, headers);

  let config: ReturnType<typeof getConfig>;
  try {
    config = getConfig();
  } catch {
    return json(503, { error: "Backend is not configured" }, headers);
  }

  // Validate the caller's access token with Supabase Auth; never trust a client-supplied user ID.
  let authResponse: Response;
  try {
    authResponse = await fetch(`${config.url}/auth/v1/user`, {
      headers: { apikey: config.key, Authorization: `Bearer ${token}` }
    });
  } catch {
    return json(502, { error: "Authentication provider unavailable" }, headers);
  }
  if (!authResponse.ok) return json(401, { error: "Invalid or expired access token" }, headers);
  const user = await authResponse.json() as { id?: unknown; email?: unknown };
  if (typeof user.id !== "string") return json(401, { error: "Invalid authenticated user" }, headers);

  if (path === "/me" && event.httpMethod === "GET") {
    return json(200, { user: { id: user.id, ...(typeof user.email === "string" ? { email: user.email } : {}) } }, headers);
  }

  const resources: Record<string, string> = {
    "/progress": "lesson_progress",
    "/quiz-attempts": "quiz_attempts"
  };
  const table = resources[path];
  if (!table) return json(404, { error: "Endpoint not found" }, headers);

  if (event.httpMethod === "GET") {
    const query = new URLSearchParams({
      select: path === "/progress" ? "lesson_id,completed_at" : "id,subject_id,score,total_questions,answers,completed_at",
      order: path === "/progress" ? "completed_at.desc" : "completed_at.desc",
      limit: "100"
    });
    let response: Response;
    try {
      response = await fetch(`${config.url}/rest/v1/${table}?${query}`, {
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });
    } catch {
      return json(502, { error: "Database unavailable" }, headers);
    }
    const payload = await response.json().catch(() => null);
    if (!response.ok) return json(response.status === 401 ? 401 : 502, { error: "Could not load data" }, headers);
    return json(200, { data: payload }, headers);
  }

  let body: Record<string, unknown>;
  try {
    body = readBody(event.body);
  } catch (error) {
    return json(400, { error: error instanceof Error ? error.message : "Invalid request body" }, headers);
  }

  let row: Record<string, unknown>;
  if (path === "/progress") {
    const lessonId = body.lesson_id;
    if (typeof lessonId !== "string" || lessonId.trim().length < 1 || lessonId.length > 120) {
      return json(400, { error: "lesson_id must be a string of 1–120 characters" }, headers);
    }
    row = { user_id: user.id, lesson_id: lessonId.trim() };
  } else {
    const { subject_id, score, total_questions, answers } = body;
    if (typeof subject_id !== "string" || !subjects.some((subject) => subject.id === subject_id)) {
      return json(400, { error: "subject_id is not supported" }, headers);
    }
    if (!Number.isInteger(score) || !Number.isInteger(total_questions) ||
      (score as number) < 0 || (total_questions as number) < 1 ||
      (score as number) > (total_questions as number)) {
      return json(400, { error: "score and total_questions must be valid integers and score cannot exceed total_questions" }, headers);
    }
    if (answers !== undefined && (!Array.isArray(answers) || answers.length > 200)) {
      return json(400, { error: "answers must be an array with at most 200 items" }, headers);
    }
    row = {
      user_id: user.id,
      subject_id,
      score,
      total_questions,
      answers: answers ?? []
    };
  }

  let response: Response;
  try {
    response = await fetch(`${config.url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: path === "/progress" ? "resolution=merge-duplicates,return=representation" : "return=representation"
      },
      body: JSON.stringify(row)
    });
  } catch {
    return json(502, { error: "Database unavailable" }, headers);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) return json(response.status === 401 ? 401 : response.status === 403 ? 403 : 502, { error: "Could not save data" }, headers);
  return json(201, { data: payload }, headers);
};

export { handler };
