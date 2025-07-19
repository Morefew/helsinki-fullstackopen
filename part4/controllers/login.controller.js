import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {Router} from 'express'
import UserModel from '../models/user.model.js'
import config from '../utils/config.js'
import logger from "../utils/logger.js";

let SECRET = config.SECRET

const loginRouter = Router()

loginRouter.post('/', async (req, res) => {
  const {username, password} = req.body

  if (!username || !password) {
    return res.status(400).json({error: 'Username and password are required'});
  }

  try {
    const user = await UserModel.findOne({username})
    if (!user) {
      logger.info(`Login attempt with non-existent username: ${username}`)
      return res.status(401).json({error: 'Invalid username or password'})
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!passwordCorrect) {
      logger.info(`Failed login attempt for user: ${username}`);
      return res.status(401).json({error: 'Invalid username or password'});
    }
    const userForToken = {
      username: user.username,
      id: user._id,
    }
    const token = jwt.sign(userForToken, SECRET, {algorithm: 'HS256'})
    logger.info(`User ${username} logged in successfully`);
    res.status(200).send({token, username: user.username, name: user.name})
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
})

export default loginRouter