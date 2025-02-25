import mongoose, { Document, Model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Importa UUID para gerar IDs únicos

interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  userId: string; // Agora é uma string UUID
  provider?: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  userId: {
    type: String,
    unique: true, // Garantir que seja único
    required: true,
    default: uuidv4, // Gera automaticamente um UUID
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  provider: {
    type: String,
    required: false,
  },
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
