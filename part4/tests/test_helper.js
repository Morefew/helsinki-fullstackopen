import Blog from "../models/blog.model.js";
import supertest from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import config from "../utils/config.js";

// --- AUTHENTICATION SETUP ---

// Test user data
const testUser = {
  id: "687ac97141af659e35277b7e",
  username: "TestUserOne",
};

const invalidBlogId = "68125644f45652f478922c66";

const TOKEN = jwt.sign(testUser, config.SECRET, { algorithm: "HS256" });

// Create a supertest instance with the app and set the authorization header
const hook =
  (method = "post") =>
  (endpoint) =>
    supertest(app)[method](endpoint).set("Authorization", `Bearer ${TOKEN}`);

// Create a request object with methods for different HTTP verbs
const request = {
  post: hook("post"),
  get: hook("get"),
  put: hook("put"),
  delete: hook("delete"),
};

// --- AUTHENTICATION SETUP END ---

const initialBlogs = [
  {
    title: "Clean Code Practices",
    author: "Robert C. Martin",
    url: "https://cleancode.com",
    likes: 10,
    user: testUser.id,
  },
  {
    title: "Refactoring",
    author: "Martin Fowler",
    url: "https://refactoring.com",
    likes: 5,
    user:testUser.id,
  },
];

const newBlog = {
  title: "New Blog - Writing Code Practices",
  author: "Santiago Caballero",
  url: "https://writingcodepractices.com",
  likes: 25,
};


const invalidBlog = {
  title: "Invalid blog title",
  author: "",
  url: "",
  likes: 0,
};

const missingLikesBlog = {
  title: "Software Engineering Practices",
  author: "Shaik Mahlen",
  url: "https://softwareEngineering.practices.com",
};

const missingTitleBlog = {
  author: "Shaik Mahlen",
  url: "https://softwareEngineering.practices.com",
  likes: 3,
};

const missingUrlBlog = {
  title: "The new Paradigm",
  author: "Malouk Louhas",
  likes: 3,
};

// creates a Database object Id that does not belong to any blog object
const nonExistingId = async () => {
  const blog = new Blog({
    title: "Refactoring",
    author: "Martin Fowler",
    url: "https://refactoring.com",
    likes: 5,
  });
  await blog.save();
  await blog.deleteOne();
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

export default {
  initialBlogs,
  newBlog,
  invalidBlog,
  missingLikesBlog,
  missingTitleBlog,
  missingUrlBlog,
  invalidBlogId,
  nonExistingId,
  blogsInDb,
  request,
  testUser,
};
