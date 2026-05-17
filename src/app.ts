import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { corsConfig } from "@/config/cors";
import { env } from "@/config/env";
import { globalRateLimit } from "@/config/rate-limit";
import { setupSwagger } from "@/config/swagger";
import { errorMiddleware } from "@/middlewares/error.middleware";
import { notFoundMiddleware } from "@/middlewares/not-found.middleware";
import routes from "@/routes";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors(corsConfig));

if (env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(globalRateLimit());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

setupSwagger(app);

app.use("/api/v1", routes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
