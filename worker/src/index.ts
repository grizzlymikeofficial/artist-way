import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

app.use(
	"*",
	cors({
		origin: "*",
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type"],
	}),
);


// POST /api/notes
app.post("/api/notes", async (c) => {
	const { note, email } = await c.req.json<{ note: string; email?: string }>();
	if (!note?.trim()) {
		return c.json({ error: "note required" }, 400);
	}

	await c.env.DB.prepare(
		"INSERT INTO notes (note, email) VALUES (?, ?)",
	).bind(note.trim(), email?.trim() || null).run();

	return c.json({ ok: true }, 201);
});

// GET /api/notes — optional ?id=1 or ?email=user@example.com
app.get("/api/notes", async (c) => {
	const id = c.req.query("id");
	const email = c.req.query("email");

	if (id) {
		const note = await c.env.DB.prepare(
			"SELECT * FROM notes WHERE id = ?",
		).bind(Number(id)).first();

		if (!note) {
			return c.json({ error: "not found" }, 404);
		}
		return c.json(note);
	}

	if (email) {
		const { results } = await c.env.DB.prepare(
			"SELECT * FROM notes WHERE email = ? ORDER BY created_at DESC",
		).bind(email).all();
		return c.json(results);
	}

	const { results } = await c.env.DB.prepare(
		"SELECT * FROM notes ORDER BY created_at DESC",
	).all();
	return c.json(results);
});

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.get("/api/tasks", TaskList);
openapi.post("/api/tasks", TaskCreate);
openapi.get("/api/tasks/:taskSlug", TaskFetch);
openapi.delete("/api/tasks/:taskSlug", TaskDelete);

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;
