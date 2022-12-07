import express from "express";
import "express-async-errors";
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import * as dotenv from "dotenv";
import connectDb from "./db/connect.js";
import authRouter from "./routers/authRouter.js";
import jobsRouter from "./routers/jobsRouter.js";
import cors from "cors";
import morgan from "morgan";
import authenticateUser from "./middleware/auth.js";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import xss from "xss-clean";
import monogoSanitize from "express-mongo-sanitize";

const app = express();
dotenv.config();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(monogoSanitize());
app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

//middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build/index.html"));
});
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`port is litening to ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
