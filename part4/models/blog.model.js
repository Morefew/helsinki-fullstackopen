import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  author: {
    type: String,
    maxlength: 50,
    trim: true
  },
  url: { type: String, trim: true, required: true },
  likes: { type: Number, min: 0, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Transform _id to id in JSON output
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // Convert _id to id
    delete returnedObject._id // Remove _id
    delete returnedObject.__v // Remove Mongoose version key (optional)
  },
})

export default mongoose.model('Blog', blogSchema)