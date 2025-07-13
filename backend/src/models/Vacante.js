import pool from '../db.js';

export async function insertarVacante(data) {
  const {
    titulo_cargo,
    area,
    descripcion_corta,
    responsabilidades,
    requisitos,
    beneficios,
    salario,
    creado_por_usuario_id,
    id_servicio_interes,
  } = data;

  const query = `
    INSERT INTO vacantes (
      titulo_cargo, area, descripcion_corta,
      responsabilidades, requisitos, beneficios,
      salario, creado_por_usuario_id, id_servicio_interes
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *;
  `;

  const values = [
    titulo_cargo,
    area,
    descripcion_corta,
    responsabilidades,
    requisitos,
    beneficios,
    salario,
    creado_por_usuario_id,
    id_servicio_interes
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}
