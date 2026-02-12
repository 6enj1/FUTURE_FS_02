import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./lib/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import followupsRoutes from "./routes/followups.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "100kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/followups", followupsRoutes);
app.use("/api/metrics", metricsRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;
