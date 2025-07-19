import bcrypt from 'bcrypt'
import {Router} from 'express'
import User from '../models/user.model.js'
import logger from '../utils/logger.js';

const userRouter = Router()

userRouter.get('/', async (request, response) => {
  //.populate('blogs') replaces every blog id stored in user.blogs with the actual blog.
  // within the options object we have chosen to display some fields of the blog document
  const users = await User.find({},{username: 1, name:1, passwordHash:1}).populate('blogs', {
    id: 1, title: 1, author: 1, likes: 1
  })
  response.json(users)
})

userRouter.post('/', async (request, response) => {
  const {username, password, name} = request.body;

  // TODO this check is not working, Suggestion: change Model method
  const isUniqueUsername = async (username) => {
    try {
      const usernameCheck = await User.findOne({username: username}).exec();
      return !usernameCheck ;
    } catch (err) {
      return false;
    }
  }

  // Validate input function
  const validateUserData = async (data) => {
    const errors = []

    // Required fields check
    if (!data.username?.trim()) {
      errors.push('Username is required');
    }
    if (data.username) {
      const isUnique = await isUniqueUsername(data.username);
      if (!isUnique) {
        errors.push('Username already exists');
      }
    }
    if (!data.password?.trim()) {
      errors.push('Password is required');
    }
    // Data format validation
    if (data.username && (data.username.length < 3 || data.username.length > 24)) {
      errors.push('Username must be between 3 - 24 characters');
    }
    if (data.password && data.password.length <= 7) {
      errors.push('Password must be at least 8 characters');
    }
    return errors
  }

  // Validate input data
  try {
    const validationErrors = await validateUserData({
      username, password, name
    })
    if (validationErrors.length > 0) {
      logger.info({
        error: 'Validation Errors: ',
        details: validationErrors.toString()})
      return response.status(400).json({
        error: 'Validation Error',
        details: validationErrors
      })
    }
  } catch (error) {
    if (error.name === 'Validation Error') {
      logger.info(error);
      return response.status(400).json({
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message)
      })
    }
  }

  // Save to Database
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username, name, passwordHash
    });

    const savedUser = await user.save();
    logger.info('User saved successfully')
    return response.status(201).json(savedUser);

  } catch (error) {
    if (error.code === 11000) {
      logger.error('Duplicate Error', error.message)
      return response.status(400).json({
        error: 'Database Duplicate Username Error'
      })
    }
    logger.error('Registration Error', error)
    return response.status(400).json({
      message: 'Registration Error',
      details: error.message
    })
  }
})

export default userRouter