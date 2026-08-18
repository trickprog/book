import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*'],
  googleBookApiKey: process.env.GOOGLE_BOOK_API_KEY || '',
  baseApiVersion: process.env.API_VERSION || '',
  openlibrarySearchUrl: process.env.SEARCH_URL || '',
  bookCoverUrl: process.env.COVER_URL || '',
  googleBooksUrl: process.env.GOOGLE_BOOKS_URL || '',
};

export type Config = typeof config;
