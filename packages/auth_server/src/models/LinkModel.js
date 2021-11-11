import mongoose from 'mongoose'

const LinkSchema = new mongoose.Schema(
  {
    linkdropUrl: {
      type: String,
      unique: true
    },
     used: {
      type: Boolean,
    }
  }
)

const Link = mongoose.model('Link', LinkSchema)
export default Link