import app from "./app";

const port = Number(process.env["PORT"] || 3000);
const host = "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
