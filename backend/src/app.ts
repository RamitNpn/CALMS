import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./modules";
import { contract } from "./contract";
import swaggerUi from "swagger-ui-express";
import { createExpressEndpoints } from "@ts-rest/express";
import morgan from "morgan";
import { openApiDocument } from "./config/swagger";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const allowedOrigins =
  process.env.WHITE_LISTED_ORIGINS?.split(",").map((o) => o.trim()) || [];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("CORS Origin:", origin);
      if (!origin) return callback(null, true);
      if (origin === `http://localhost:${process.env.PORT || 4000}`) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked"), false);
    },
    credentials: true,
  })
);

app.use("/flowdesk-api", swaggerUi.serve, swaggerUi.setup(openApiDocument));

createExpressEndpoints(contract, router, app);
export default app;
