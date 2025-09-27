import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

// Serve static files from the public directory.
app.use("/*", serveStatic({ root: "./public" }));

app.post("/my-form", async (c) => {
  const formData = await c.req.formData();
  const color = formData.get("color");
  console.log("color =", color);
  return c.body(null);
});

export default app;
