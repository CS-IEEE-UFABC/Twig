import { Schema, model } from "mongoose";

export default model("guild", new Schema({
  guild_id: String,
  settings: {
    auto_role: [String],
  },
}));
