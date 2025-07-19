import assert from 'node:assert'
import { after, beforeEach, describe, test } from 'node:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import User from '../models/user.model.js'
import app from '../app.js'

const api = supertest(app)

beforeEach(async () => {
  const user = new User({
    username: 'MasterMind',
    name: 'Jason Wyngarde',
    password: 'Wyngarde'
  })
  // Clear the database
  await User.deleteMany({})
  console.log('Database Cleared')

  await user.save()
  console.log('User created')

})

describe('User POST', () => {
  test('Should create a new user', async () => {
    const user = {
      username: 'MisterMind',
      password: 'GrayBother',
      name: 'Jaden Gray'
    }

    const response = await api.post('/api/users')
      .send(user)
      .expect(201).expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.username, user.username)
    assert.strictEqual(response.body.name, user.name)
    assert.ok(response.body.hasOwnProperty('blogs'))
  })
  test('If username is missing throws error: Username is required', async () => {
    const user = {
      password: 'GrayBother',
      name: 'Jaden Gray'
    }
    const response = await api.post('/api/users')
      .send(user)
      .expect(400).expect('Content-Type', /application\/json/)
    console.log('response error: ', response.body.details)
    assert.equal(response.body.details, 'Username is required')
  })

  test('If password is missing throws error: Password is required', async () => {
    const user = {
      'username': 'SisterMind',
      'name': 'Sandy Gray'
    }
    const response = await api.post('/api/users')
      .send(user)
      .expect(400).expect('Content-Type', /application\/json/)
    console.log('response error: ', response.body.details)
    assert.equal(response.body.details, 'Password is required')
  })

  test('If username exists throws error: Validation Error', async () => {
    const user = {
      'username': 'MasterMind',
      'name': 'Watson Garden',
      'password': 'Watgarden'
    }
    const response = await api.post('/api/users')
      .send(user)
      .expect(400).expect('Content-Type', /application\/json/)
    console.log('response invalid username: ', response.body.error)
    assert.equal(response.body.error, 'Validation Error')
  })



})


after(async () => {
  await mongoose.connection.close()
})