import mongoose from "mongoose";

const votoSchema = new mongoose.Schema(
  {
    candidato: { type: mongoose.Schema.Types.ObjectId, ref: "Candidato", required: true },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Voto = mongoose.model("Voto", votoSchema);
export default Voto;
