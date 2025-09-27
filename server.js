import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

// Serve static files from the public directory.
app.use("/*", serveStatic({ root: "./public" }));

app.post("/my-form", async (c) => {
  const formData = await c.req.formData();
  const primary = formData.get("primaryColor");
  const secondary = formData.get("secondaryColor");
  return c.html(`<p>You selected ${primary} and ${secondary}.</p>`);
});

export default app;
