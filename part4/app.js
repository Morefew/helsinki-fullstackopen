/**
 * @fileoverview Main module for the Blog Express Application.
 * Sets up the Express application, connects to MongoDB, and configures middleware and routes.
 *
 * @requires express
 * @requires mongoose
 * @requires ./utils/config.js
 * @requires ./utils/logger.js
 * @requires cors
 * @requires ./controllers/blogs.controller.js
 * @requires ./utils/middlewares.js
 */
import express from 'express'
import mongoose from 'mongoose'
import config from './utils/config.js'
import logger from './utils/logger.js'
import cors from 'cors'
import blogsRouter from './controllers/blogs.controller.js'
import middlewares from './utils/middlewares.js'
import userRouter from './controllers/user.controller.js'
import loginRouter from './controllers/login.controller.js'

/**
 * Main module for the Blog Express Application.
 * Initializes an Express application instance.
 * This instance can be used to define routes, middleware, and other application logic.
 */
const app = express()

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middlewares.requestLogger)

app.use(middlewares.getTokenFrom)
// app.use(middlewares.userExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', middlewares.userExtractor, blogsRouter)
app.use('/api/users', userRouter)

// // Middleware for handling errors
app.use(middlewares.errorHandler)

// Middleware for handling unknown endpoints
app.use(middlewares.unknownEndPoint)

export default app
