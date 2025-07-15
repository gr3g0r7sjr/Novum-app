SELECT
             v.id_vacante,
                v.titulo_cargo,
                v.area,
                v.descripcion_corta,
                v.responsabilidades,
                v.requisitos,
                v.beneficios,
                v.salario,
                v.fecha_publicacion,
                v.estado,
                v.creado_por_usuario_id,
                u.correo_electronico AS creado_por_correo,
                v.id_servicio_interes,
                ie.nombre_interes AS nombre_servicio_interes
            FROM
                vacantes v
            JOIN
                usuarios u ON v.creado_por_usuario_id = u.id_usuario
            LEFT JOIN
                intereses_empresa ie ON v.id_servicio_interes = ie.id_interes
            WHERE
                v.estado = 'activa'
            ORDER BY
                v.fecha_publicacion DESC