import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGO

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable')
}

async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) return mongoose;
    
    try {
      await mongoose.connect(MONGODB_URI as string, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000
      });
      console.log("Conectado ao MongoDB!");
      return mongoose;
    } catch (error) {
      console.error("Erro ao conectar ao MongoDB:", error);
      throw error;
    }
  }

export default connectToDatabase;