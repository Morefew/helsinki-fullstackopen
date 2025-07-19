// These functions are used to calculate various statistics about a list of blogs.
// they appear in the project just to demonstrate how to create tests for the backend
// this tests don't represent a comprehensive test suite, they are just an introduction to testing


/**
 * Function to calculate the total number of likes in a list of blogs.
 * @param blogs
 * @returns a number, the total number of likes in the list of blogs
 */
const totalLikes = (blogs) => {
  const aggregate = (sum, blog) => sum + blog.likes
  if (blogs.length === 0) return 0
  return blogs.length === 1 ? blogs[0].likes : blogs.reduce(aggregate, 0)
}

/**
 * Function to find the blog with the most likes.
 * @param blogs
 * @returns the title of the blog with the most likes
 */
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return ''
  if (blogs.length === 1) return blogs[0].title
  blogs.sort((a, b) => b.likes - a.likes)
  return blogs[0].title
}

/**
 * Function to calculate the author with most blogs
 * @param blogs
 * @returns object with author and total count of blogs posted
 */
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  let participationTally = new Map()

  for (const blog of blogs) {
    if (!participationTally.has(blog.author)) {
      participationTally.set(blog.author, 1)
    } else if (participationTally.has(blog.author)) {
      let increment = participationTally.get(blog.author)
      participationTally.set(blog.author, increment + 1)
    }
  }

  let tally = new Array(...participationTally).sort((a, b) => b[1] - a[1])
  return {
    author: tally[0][0],
    blogs: tally[0][1],
  }
}

/**
 * Determines the author with the highest total number of likes across their blogs.
 *
 * @param {Object[]} blogs - An array of blog objects.
 * @param {string} blogs[].author - The author of the blog.
 * @param {number} blogs[].likes - The number of likes for the blog (non-negative integer).
 * @returns {Object} An object containing the author with the most likes and their total likes.
 * @returns {string} returns.author - The name of the author with the highest total likes.
 * @returns {number} returns.likes - The total number of likes for that author.
 * @returns {} returns - An empty object if the input array is empty.
 *
 * @example
 * const blogs = [
 *   { author: 'Alice', likes: 10 },
 *   { author: 'Bob', likes: 15 },
 *   { author: 'Alice', likes: 5 }
 * ];
 * mostLikes(blogs); // Returns { author: 'Alice', likes: 15 }
 *
 * @remarks
 * - If multiple authors have the same highest total likes, one is returned arbitrarily.
 * - Assumes each blog object has valid `author` (string) and `likes` (non-negative integer) properties.
 * - Throws no errors for invalid inputs; behavior is undefined if properties are missing or invalid.
 */
const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  let likesTally = new Map()

  for (const blog of blogs) {
    if (!likesTally.has(blog.author)) {
      likesTally.set(blog.author, blog.likes)
    } else {
      let increment = likesTally.get(blog.author)
      likesTally.set(blog.author, increment + element.likes)
    }
  }

  let maxLikes = 0
  let topAuthor = ''

  for (const [author, likes] of likesTally) {
    if (likes > maxLikes) {
      maxLikes = likes
      topAuthor = author
    }
  }

  return { author: topAuthor, likes: maxLikes }
}

export default { totalLikes, favoriteBlog, mostBlogs, mostLikes }
