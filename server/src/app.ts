import express, { type ErrorRequestHandler, type Express } from "express";
import cors from "cors";
import { config } from "./config";
import { booksRouter } from "./routes/books";
import { errorHandler } from "./lib/ErrorHandler";


export function createApp(): Express {
  const app = express();
  app.use(
    cors({
      origin: config.corsOrigins.includes('*') ? true : config.corsOrigins,
    }),
  );

  app.use(express.json());

  app.use(`${config.baseApiVersion}/books`, booksRouter);

  app.use(errorHandler);

  return app;
}
