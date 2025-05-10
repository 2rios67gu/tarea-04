import mongoose from "mongoose";

const ganadoresSchema = new mongoose.Schema(
  {
    votacion: { type: mongoose.Schema.Types.ObjectId, ref: "Votacion", required: true },
    candidatos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidato" }],
  },
  { timestamps: true }
);

const Ganadores = mongoose.model("Ganadores", ganadoresSchema);
export default Ganadores;
