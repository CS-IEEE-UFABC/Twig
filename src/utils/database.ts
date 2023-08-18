
import mongoose from "mongoose"

export default () => mongoose.connect(Buffer.from(process.env.MONGODB_URI, 'base64').toString('utf-8'), {})
