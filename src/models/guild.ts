import { Schema, model } from 'mongoose'

export default model('guild', new Schema({
  guild_id: String,
  settings: {
    roles: [String]
  },
  invites: [{
    code: String,
    ra: String
  }]
}))
