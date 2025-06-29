-- Tabla de usuarios (postulantes y administradores)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'postulante' CHECK (role IN ('postulante', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de candidatos (perfil extendido)
CREATE TABLE candidatos (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    tipo_documento VARCHAR(20),
    identificacion VARCHAR(20) UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    edad INT CHECK (edad >= 18),
    nacionalidad VARCHAR(50),
    genero VARCHAR(10) CHECK (genero IN ('masculino', 'femenino', 'otro')),
    estado_civil VARCHAR(20),
    servicio_interes VARCHAR(100),
    nivel_educativo VARCHAR(100),
    profesion VARCHAR(100),
    especialidad VARCHAR(100),
    tiempo_graduado VARCHAR(50),
    disponibilidad VARCHAR(50),
    ultima_experiencia TEXT,
    telefono VARCHAR(20),
    direccion_detallada TEXT,
    -- Campos para guardar el archivo PDF del CV
    cv_file BYTEA,
    cv_filename VARCHAR(255),
    cv_mimetype VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Relación con users
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Tabla de vacantes
CREATE TABLE vacantes (
    id SERIAL PRIMARY KEY,
    titulo_cargo VARCHAR(100) NOT NULL,
    area VARCHAR(100),
    descripcion_corta TEXT,
    responsabilidades TEXT,
    requisitos TEXT,
    beneficios TEXT,
    sueldo VARCHAR(50),
    fecha_publicacion DATE DEFAULT CURRENT_DATE,
    estado VARCHAR(20) DEFAULT 'abierta' CHECK (estado IN ('abierta', 'cerrada')),
    created_by INT,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Relación con users (admin que creó la vacante)
    CONSTRAINT fk_created_by
        FOREIGN KEY (created_by) 
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Tabla de postulaciones (registro de aplicación por candidato)
CREATE TABLE postulaciones (
    id SERIAL PRIMARY KEY,
    candidato_id INT NOT NULL,
    vacante_id INT NOT NULL,
    fecha_postulacion TIMESTAMP DEFAULT NOW(),
    estatus VARCHAR(20) DEFAULT 'pendiente' 
        CHECK (estatus IN ('pendiente', 'rechazado', 'entrevistado', 'seleccionado', 'contratado')),
    
    -- Relación con candidates
    CONSTRAINT fk_candidato
        FOREIGN KEY (candidato_id) 
        REFERENCES candidates(id)
        ON DELETE CASCADE,
    
    -- Relación con vacantes
    CONSTRAINT fk_vacante
        FOREIGN KEY (vacante_id) 
        REFERENCES vacantes(id)
        ON DELETE CASCADE,
    
    -- Restricción para evitar postulaciones duplicadas
    CONSTRAINT unique_postulacion
        UNIQUE (candidato_id, vacante_id)
);

-- Historial de cambios de estatus en las postulaciones
CREATE TABLE postulacion_historial (
    id SERIAL PRIMARY KEY,
    postulacion_id INT NOT NULL,
    estatus_anterior VARCHAR(20),
    estatus_nuevo VARCHAR(20) NOT NULL,
    comentario_rrhh TEXT,
    fecha_cambio TIMESTAMP DEFAULT NOW(),
    
    -- Relación con postulaciones
    CONSTRAINT fk_postulacion
        FOREIGN KEY (postulacion_id) 
        REFERENCES postulaciones(id)
        ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_candidates_user_id ON candidates(user_id);
CREATE INDEX idx_vacantes_estado ON vacantes(estado);
CREATE INDEX idx_postulaciones_candidato ON postulaciones(candidato_id);
CREATE INDEX idx_postulaciones_vacante ON postulaciones(vacante_id);
CREATE INDEX idx_postulaciones_estatus ON postulaciones(estatus);
CREATE INDEX idx_postulacion_historial_postulacion ON postulacion_historial(postulacion_id);

-- Datos iniciales (opcional)
-- Insertar un usuario administrador
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@empresa.com', 'hashed_password', 'admin');