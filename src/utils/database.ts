import mongoose from 'mongoose'

export default async (): Promise<typeof mongoose> => {
  return await mongoose.connect(Buffer.from(process.env.MONGODB_URI, 'base64').toString('utf-8'), {})
}
