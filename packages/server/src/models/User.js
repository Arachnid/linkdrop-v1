import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    address: {
      type: String
    },
    data: {
      type: Object
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', UserSchema)
export default User
