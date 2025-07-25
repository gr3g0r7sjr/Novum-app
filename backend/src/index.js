import "dotenv/config";
import { FRONTEND_URL} from "./config/config.js";
import express from "express";
import cors from "cors";

import authenticateToken from "./middlewares/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import vacantesRoutes from "./routes/vacantesRoutes.js";
import postulacionesRoutes from "./routes/postulacionesRoutes.js";
import { vacantesController } from "./controllers/vacantesController.js";
import { postulacionesController } from "./controllers/postulacionesController.js";
import userRoutes from "./routes/userRoutes.js"

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:5174", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
//Hola
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);

app.get("/api/vacantes/servicios-interes", vacantesController.obtenerServiciosInteres,);

app.post("/api/vacantes/:id/postulaciones", postulacionesController.aplicarVacantes,);

app.get("/api/vacantes", vacantesController.obtener);

app.get("/api/vacantes/:id", vacantesController.obtenerVacanteId);

app.use("/api/postulaciones", postulacionesRoutes);

app.use("/api/users", userRoutes);

app.use("/api/vacantes", authenticateToken, vacantesRoutes);

app.get("/", (req, res) => {
  res.send("Hola, el servidor esta corriendo y funcionando en express.");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
