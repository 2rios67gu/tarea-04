import mongoose from "mongoose";

const candidatoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    votos: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Candidato = mongoose.model("Candidato", candidatoSchema);
export default Candidato;
