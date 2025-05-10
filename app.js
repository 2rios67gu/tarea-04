import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Candidato from "./models/candidato.js";
import Voto from "./models/voto.js";
import Votacion from "./models/votacion.js";
import Ganadores from "./models/ganadores.js";

dotenv.config();

const app = express();
const { MONGO_URI, PORT } = process.env;

app.use(express.json());

// Conexiones a la base de datos
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) => console.log("Error al conectar la base de datos", err));


// Crear un candidato
app.post("/candidato", async (req, res) => {
  try {
    const candidato = new Candidato(req.body);
    const savedCandidato = await candidato.save();
    res.status(201).json(savedCandidato);
  } catch (error) {
    res.status(400).json({ message: "Error al crear candidato", error });
  }
});

// Obtener todos los candidatos
app.get("/candidatos", async (req, res) => {
  try {
    const candidatos = await Candidato.find();
    res.json(candidatos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los candidatos", error });
  }
});

// Crear una votación
app.post("/votacion", async (req, res) => {
  try {
    const votacion = new Votacion(req.body);
    const savedVotacion = await votacion.save();
    res.status(201).json(savedVotacion);
  } catch (error) {
    res.status(400).json({ message: "Error al crear votación", error });
  }
});

// Votar por un candidato
app.post("/voto", async (req, res) => {
  try {
    const voto = new Voto(req.body);
    const savedVoto = await voto.save();

    // Actualizar votos del candidato
    await Candidato.findByIdAndUpdate(voto.candidato, {
      $inc: { votos: 1 },
    });

    res.status(201).json(savedVoto);
  } catch (error) {
    res.status(400).json({ message: "Error al registrar el voto", error });
  }
});

// Obtener los ganadores de una votación
app.get("/ganadores/:votacionId", async (req, res) => {
  try {
    const votacion = await Votacion.findById(req.params.votacionId);
    if (!votacion) return res.status(404).json({ message: "Votación no encontrada" });

    // Obtener los candidatos de la votación y ordenarlos por los votos
    const candidatos = await Candidato.find({ _id: { $in: votacion.candidatos } }).sort({ votos: -1 });

    // Obtener el máximo de votos
    const maxVotos = candidatos[0]?.votos || 0;

    // Obtener todos los candidatos con el máximo de votos
    const ganadores = candidatos.filter(c => c.votos === maxVotos);

    const savedGanadores = new Ganadores({
      votacion: votacion._id,
      candidatos: ganadores.map(g => g._id),
    });

    await savedGanadores.save();

    res.json({ ganadores });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los ganadores", error });
  }
});


