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
app.use(express.urlencoded({ extended: true })); // IMPORTANT
app.use(morgan("dev"));

app.use(cors());

app.use("/flowdesk-api", swaggerUi.serve, swaggerUi.setup(openApiDocument));

createExpressEndpoints(contract, router, app);
export default app;
