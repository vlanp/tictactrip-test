import express from "express";
import type { Request, NextFunction } from "express";
import type {
  IInternalServerErrorResponse,
  INotFoundResponse,
  ITypedResponse,
} from "./models/typed-response-models.js";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/api-routes.js";

connectDB();

const app = express();

app.use(express.json());

app.use(express.text());

app.use("/api", apiRouter);

app.all("/*all", (req: Request, res: ITypedResponse<INotFoundResponse>) => {
  res.status(404).json({
    success: false,
    message: `The route ${req.originalUrl} does not exist`,
  });
});

function errorHandler(
  err: Error,
  req: Request,
  res: ITypedResponse<IInternalServerErrorResponse>,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

app.use(errorHandler);

export { app, errorHandler };
