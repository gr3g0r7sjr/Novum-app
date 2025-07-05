// generateHash.js
import bcrypt from 'bcryptjs';

async function generateHash() {
    const simplePassword = "python1007"; // <-- ¡Tu contraseña simple aquí!
    const saltRounds = 10; // El mismo "costo" que usarías en tu ruta de registro

    try {
        const hashedPassword = await bcrypt.hash(simplePassword, saltRounds);
        console.log("Contraseña original:", simplePassword);
        console.log("Hash generado (copia esto):", hashedPassword);
    } catch (error) {
        console.error("Error al generar hash:", error);
    }
}

generateHash();