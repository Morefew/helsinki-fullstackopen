import e, { Router } from "express";
import Blog from "../models/blog.model.js";
import logger from "../utils/logger.js";

const blogRouter = Router();

/**
 *GET all blogs
 */
blogRouter.get("/", async (request, response) => {
  //.populate('user') replaces every user id stored in blog.user with the actual user.
  // within the options object we have chosen to display some fields of the user document
  // TODO this endpoint should Get all from AUTH user

  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 });
  response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  // TODO this endpoint should Get only blogs from AUTH user
  const blog = await Blog.findById(request.params.id);
  response.json(blog);
});

blogRouter.post("/", async (request, response) => {
  // Default likes to 0 if not provided
  const { title, author, url, likes = 0 } = request.body;

  const user = request.user;

  // URL format validation helper
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate Blog input data
  const validateBlogData = (data) => {
    const errors = [];

    // Required fields check
    if (!data.title?.trim()) {
      errors.push("Title is required");
    }
    if (!data.author?.trim()) {
      errors.push("Author is required");
    }
    if (!data.url?.trim()) {
      errors.push("URL is required");
    }
    if (!data.userId) {
      errors.push("User is required");
    }

    // Data format validation
    if (data.title && data.title.length > 100) {
      errors.push("Title must be 100 characters or less");
    }
    if (data.url && !isValidUrl(data.url)) {
      errors.push("Invalid URL format");
    }
    if (data.likes && (!Number.isInteger(data.likes) || data.likes < 0)) {
      errors.push("Likes must be a non-negative integer");
    }
    if (data.author && data.author.length > 50) {
      errors.push("Author name must be 50 characters or less");
    }

    return errors;
  };

  try {
    // Validate input data
    const validationErrors = validateBlogData({
      title,
      author,
      url,
      likes,
      userId: user._id,
    });
    if (validationErrors.length > 0) {
      return response.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    // Create new blog instance
    const blog = new Blog({
      title: title.trim(),
      author: author?.trim(),
      url: url.trim(),
      likes,
      user: user._id,
    });

    // Save to database and update user blogs list
    try {
      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.updateOne({
        $push: { blogs: savedBlog._id },
      });
      response.status(201).json(savedBlog);
    } catch (error) {
      console.error("Error adding blog ID:", error);
      response.status(400).json({ error: error });
    }
  } catch (error) {
    // Handle specific database errors
    if (error.name === "ValidationError") {
      console.log(error);
      return response.status(400).json({
        error: "Database validation failed",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }

    // Handle other errors
    console.error("Blog creation error:", error);
    response.status(500).json({
      error: "Internal server error",
      message: "Failed to create blog post",
    });
  }
});

blogRouter.delete("/:id", async (request, response) => {
  const user = request.user;
  
  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "No blog found" });
    }
    
    console.log("Blog from DB:", blog);
    console.log("Blog user from request:", blog.user._id);
    console.log("User ID from request:", user._id);
    
    if (!blog.user._id.equals(user._id)) {
      logger.error(
        "--- UNAUTHORIZED ACTION : user does not have the credentials to delete this resource ---"
      );
      return response
        .status(401)
        .json({ error: "ACTION NOT ALLOW: NOT VALID CREDENTIALS" });
    }

    const dbResp = await Blog.findByIdAndDelete({ _id: blog.id });
    if (!dbResp) {
      return response
        .status(500)
        .json({ message: "Server error, delete unsuccessful" });
    }
    response.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Blog deletion error:", error.message);
    return response.status(500).json({ error: "Internal server error" });
  }
});

/*
 * @function updateBlogLikes
 * @description Updates the likes of a blog post.
 * It validates the input data and updates the likes count.
 * Only authorized users can update the likes.
 * @param {Object} request - The request object containing the blog ID and likes.
 * @param {Object} response - The response object to send the result.
 * @returns {Object} - Returns the updated blog or an error message.
 * @example
 * updateBlogLikes({params: {id: '123'}, body: {likes: 5}}, response);
 * @memberof module:controllers/blogs.controller
 * @throws {Error} - Throws an error if:
 * - the blog ID is invalid or if the likes are not a valid non-negative integer.
 * - the blog is not found in the database.
 * - the update operation fails.
 * - the user is not authorized to update the blog.
 */
blogRouter.put("/:id", async (request, response) => {
  const likes = request.body.likes;
  const id = request.params.id;

  // TODO FIX: Only AUTHORIZED users can update
  // Validate input data
  if (likes !== undefined && (!Number.isInteger(likes) || likes < 0)) {
    return response.status(400).json({
      error:
        "Likes must be a non-negative integer greater than cero and less than or equal to 5",
    });
  }

  let updatedLikes = 0;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(400).json({ error: "No blog found" });
    }
    updatedLikes = likes + blog.likes;
  } catch (error) {
    return response.status(400).json(error);
  }

  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id },
      { likes: updatedLikes },
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedBlog) {
      return response.status(404).json({ error: "Blog not found" });
    }
    return response.status(200).json({
      updatedBlog,
      message: "Blog updated successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return response.status(400).json({ error: "Invalid blog ID" });
    }
    return response.status(500).json({ error: "Server error" });
  }
});

/*
 * @module controllers/blogs.controller
 * This module defines the routes for managing blogs in the application.
 */
export default blogRouter;
