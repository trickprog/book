import { Router } from "express";
import * as bookService from '../services/bookService';

export const booksRouter = Router();

function querycheck(value: unknown): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  return typeof first === 'string' ? first : undefined;
}

booksRouter.get("/", async (req, res) => {
  const result = await bookService.searchBooks({
    query: querycheck(req.query.q) ?? '', // the service rejects an empty query with a 400
    page: Number(querycheck(req.query.page)) || 1,
    pageSize: Number(querycheck(req.query.pageSize)) || 10,
    sort: querycheck(req.query.sort),
  });
  res.json(result);
});

booksRouter.get("/:id", async (req, res) => {
  const book = await bookService.getBookById(String(req.params.id));
  res.json(book);
});
