// eslint-disable-next-line @typescript-eslint/no-unused-vars
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IStory extends Document {
  theme: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  image: string;
  publicationDate?: Date;
  difficulty?: string;
}

const StorySchema = new Schema({
  theme: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  publicationDate: { type: Date, default: Date.now },
  difficulty: { type: String, default: "beginner" },
});

export default mongoose.models.Story || mongoose.model<IStory>("Story", StorySchema);
