import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Nome do contador (ex: "userId")
  seq: { type: Number, default: 0 }, // Número sequencial
});

export default mongoose.models.Counter || mongoose.model("Counter", CounterSchema);
