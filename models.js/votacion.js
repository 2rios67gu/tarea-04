import mongoose from "mongoose";

const votacionSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    candidatos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidato" }],
  },
  { timestamps: true }
);

const Votacion = mongoose.model("Votacion", votacionSchema);
export default Votacion;
