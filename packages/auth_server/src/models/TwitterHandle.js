import mongoose from 'mongoose'

const TwitterHandleSchema = new mongoose.Schema(
  {
    handle: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    linkdropUrl: {
      type: String
    },
    tokenId: {
      type: Number
    },
    txHash: {
      type: String
    },
    tweet: {
      id: {
        type: String
      },
      text: {
        type: String
      }
    },
    },
    
  {
    timestamps: true
  }
)

const TwitterHandle = mongoose.model('TwitterHandle', TwitterHandleSchema)
export default TwitterHandle