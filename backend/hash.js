// generateHash.js
import bcrypt from 'bcryptjs';

async function generateHash() {
    const simplePassword = "python1007";
    const simplePassword2 = "admin123"; // <-- ¡Tu contraseña simple aquí!
     // <-- ¡Tu contraseña simple aquí!
    const saltRounds = 10; // El mismo "costo" que usarías en tu ruta de registro

    try {
        const hashedPassword2 = await bcrypt.hash(simplePassword2, saltRounds);
        console.log("Contraseña original:", simplePassword2);
        console.log("Hash generado (copia esto):", hashedPassword2);
    } catch (error) {
        console.error("Error al generar hash:", error);
    }
}

generateHash();