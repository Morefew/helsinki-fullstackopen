import assert from 'node:assert'
import { after, beforeEach, describe, test } from 'node:test'
import mongoose from 'mongoose'
import Blog from '../models/blog.model.js'
import helper from './test_helper.js'

// const api = supertest(app)
const api = helper.request

beforeEach(async () => {
  let count = 0
  // Clear the database
  await Blog.deleteMany({})
  console.log('Database Cleared')
  // Seed the database with initial data
  for (let blog of helper.initialBlogs) {
    let blogObj = new Blog(blog)
    await blogObj.save()
    count++
    console.log(`Blog ${count} saved successfully.`)
  }
  console.log('Database Populated')
})

test('auth middleware works', async () => {
  const response = await api.get('/api/blogs') // or any protected route
  console.log('Blogs from token:', response.body)
})

describe('Blog GET', () => {

  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, 2)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs/')
    const content = response.body.map((blog) => blog.title)
    assert(content.includes('Clean Code Practices'))
  })

  test('blog unique identifier is id', async () => {
    const response = await api.get('/api/blogs/')
    response.body.forEach((blog) => {
      assert.ok(blog.id, 'Blog should have an \'id\' property')
      assert.strictEqual(
        blog._id,
        undefined,
        'Blog should not have an \'_id\' property'
      )
    })
  })
})


describe('Blog POST', () => {

  test('a valid blog can be added', async () => {
    await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const content = response.body.map((blog) => blog.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(content.includes('New Blog - Writing Code Practices'))
  })

  test('invalid blog cannot be added', async () => {
    await api
      .post('/api/blogs')
      .send(helper.invalidBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('if likes property is missing should default to the value 0', async () => {
    // Create a new blog
    const postResponse = await api
      .post('/api/blogs')
      .send(helper.missingLikesBlog)
      .expect(201)

    // Get the created blog by its ID
    const blogId = postResponse.body.id
    const response = await api.get(`/api/blogs/${blogId}`)
    const createdBlog = response.body

    // Verify that likes is 0
    assert.strictEqual(createdBlog.likes, 0)
  })

  test('if title is missing will responde with 400 Bad Request', async () => {
    const res = await api
      .post('/api/blogs')
      .send(helper.missingTitleBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.statusCode, 400)
  })

  test('if url is missing will response with 400 Bad Request', async () => {
    const res = await api
      .post('/api/blogs')
      .send(helper.missingUrlBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.statusCode, 400)
  })
})

describe('Blog DELETE', () => {

  test('invalid blog id is rejected successfully', async () => {
    const res = await api
      .delete(`/api/blogs/${helper.invalidBlogId}`)
      .expect(404)
    assert.strictEqual(res.statusCode, 404)
  })

  test('blog is deleted successfully', async () => {
    const randomBlog = await Blog.findOne({}).exec()
    console.log('Blog Id: ' + randomBlog.id)
    const res = await api
      .delete(`/api/blogs/${randomBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.statusCode, 200)
  })
})

describe('Blog UPDATE', () => {
  test('update blog likes', async () => {
    const randomBlog = await Blog.findOne({}).exec()

    const likesToUpdate = 3
    const likesNewTotal = randomBlog.likes + likesToUpdate
    const updateBody = { likes: likesToUpdate }

    const res = await api
      .put(`/api/blogs/${randomBlog._id}`)
      .send(updateBody)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(
      res.body.updatedBlog.likes,
      likesNewTotal,
      `Likes should be updated to ${likesNewTotal}`
    )
    // Verify in database
    const updatedBlog = await Blog.findById(randomBlog._id)

    assert.strictEqual(
      updatedBlog.likes,
      likesNewTotal,
      'Database should reflect updated likes'
    )
  })
})

after(async () => {
  await mongoose.connection.close()
})
