-- Eliminar tablas y secuencias si existen para evitar errores al recrearlas
-- El orden de eliminación es importante debido a las dependencias de claves foráneas
DROP TABLE IF EXISTS postulaciones CASCADE;
DROP TABLE IF EXISTS vacantes CASCADE;
DROP TABLE IF EXISTS candidatos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS intereses_empresa CASCADE;

-- Eliminar secuencias si existen
DROP SEQUENCE IF EXISTS public.candidatos_id_candidato_seq;
DROP SEQUENCE IF EXISTS public.intereses_empresa_id_interes_seq;
DROP SEQUENCE IF EXISTS public.postulaciones_id_postulacion_seq;
DROP SEQUENCE IF EXISTS public.usuarios_id_usuario_seq;
DROP SEQUENCE IF EXISTS public.vacantes_id_vacante_seq;

-- *****************************************************************************
-- Creación de la tabla intereses_empresa y su secuencia
-- *****************************************************************************
CREATE TABLE public.intereses_empresa (
    id_interes integer NOT NULL,
    nombre_interes character varying(100) NOT NULL
);

CREATE SEQUENCE public.intereses_empresa_id_interes_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.intereses_empresa_id_interes_seq OWNED BY public.intereses_empresa.id_interes;

-- *****************************************************************************
-- Creación de la tabla usuarios y su secuencia
-- *****************************************************************************
CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    correo_electronico character varying(255) NOT NULL,
    contrasena_hash text NOT NULL,
    rol character varying(50) DEFAULT 'recursos_humanos'::character varying NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;

-- *****************************************************************************
-- Creación de la tabla candidatos y su secuencia
-- *****************************************************************************
CREATE TABLE public.candidatos (
    id_candidato integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    correo_electronico character varying(255) NOT NULL,
    numero_telefono character varying(50),
    direccion text,
    educacion text,
    experiencia_laboral text,
    cursos_certificaciones text,
    habilidades text,
    servicio_interes integer,
    vehiculo character varying(20),
    fecha_expiracion_datos date,
    fecha_postulacion_inicial timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_vehiculo_valido CHECK (((vehiculo)::text = ANY ((ARRAY['si'::character varying, 'no'::character varying])::text[])))
);

CREATE SEQUENCE public.candidatos_id_candidato_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.candidatos_id_candidato_seq OWNED BY public.candidatos.id_candidato;

-- *****************************************************************************
-- Creación de la tabla vacantes y su secuencia
-- *****************************************************************************
CREATE TABLE public.vacantes (
    id_vacante integer NOT NULL,
    titulo_cargo character varying(255) NOT NULL,
    area character varying(100) NOT NULL,
    descripcion_corta text NOT NULL,
    responsabilidades text,
    requisitos text NOT NULL,
    beneficios text,
    salario character varying(100), -- Cambiado a VARCHAR(100) para flexibilidad, si es numérico puro, usar NUMERIC o DECIMAL
    fecha_publicacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(50) DEFAULT 'activa'::character varying NOT NULL,
    creado_por_usuario_id integer NOT NULL,
    id_servicio_interes integer,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.vacantes_id_vacante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.vacantes_id_vacante_seq OWNED BY public.vacantes.id_vacante;

-- *****************************************************************************
-- Creación de la tabla postulaciones y su secuencia
-- *****************************************************************************
CREATE TABLE public.postulaciones (
    id_postulacion integer NOT NULL,
    id_candidato integer NOT NULL,
    id_vacante integer NOT NULL,
    fecha_postulacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    estado_postulacion character varying(50) DEFAULT 'recibida'::character varying NOT NULL
);

CREATE SEQUENCE public.postulaciones_id_postulacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.postulaciones_id_postulacion_seq OWNED BY public.postulaciones.id_postulacion;

-- *****************************************************************************
-- Asignación de valores por defecto para las columnas seriales
-- *****************************************************************************
ALTER TABLE ONLY public.candidatos ALTER COLUMN id_candidato SET DEFAULT nextval('public.candidatos_id_candidato_seq'::regclass);
ALTER TABLE ONLY public.intereses_empresa ALTER COLUMN id_interes SET DEFAULT nextval('public.intereses_empresa_id_interes_seq'::regclass);
ALTER TABLE ONLY public.postulaciones ALTER COLUMN id_postulacion SET DEFAULT nextval('public.postulaciones_id_postulacion_seq'::regclass);
ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);
ALTER TABLE ONLY public.vacantes ALTER COLUMN id_vacante SET DEFAULT nextval('public.vacantes_id_vacante_seq'::regclass);

-- *****************************************************************************
-- Definición de claves primarias
-- *****************************************************************************
ALTER TABLE ONLY public.candidatos ADD CONSTRAINT candidatos_pkey PRIMARY KEY (id_candidato);
ALTER TABLE ONLY public.intereses_empresa ADD CONSTRAINT intereses_empresa_pkey PRIMARY KEY (id_interes);
ALTER TABLE ONLY public.postulaciones ADD CONSTRAINT postulaciones_pkey PRIMARY KEY (id_postulacion);
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);
ALTER TABLE ONLY public.vacantes ADD CONSTRAINT vacantes_pkey PRIMARY KEY (id_vacante);

-- *****************************************************************************
-- Definición de restricciones UNIQUE
-- *****************************************************************************
ALTER TABLE ONLY public.intereses_empresa ADD CONSTRAINT intereses_empresa_nombre_interes_key UNIQUE (nombre_interes);
ALTER TABLE ONLY public.postulaciones ADD CONSTRAINT postulaciones_id_candidato_id_vacante_key UNIQUE (id_candidato, id_vacante);
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_correo_electronico_key UNIQUE (correo_electronico);

-- *****************************************************************************
-- Definición de claves foráneas
-- *****************************************************************************
ALTER TABLE ONLY public.candidatos ADD CONSTRAINT candidatos_servicio_interes_fkey FOREIGN KEY (servicio_interes) REFERENCES public.intereses_empresa(id_interes) ON DELETE SET NULL;
ALTER TABLE ONLY public.postulaciones ADD CONSTRAINT postulaciones_id_candidato_fkey FOREIGN KEY (id_candidato) REFERENCES public.candidatos(id_candidato) ON DELETE CASCADE;
ALTER TABLE ONLY public.postulaciones ADD CONSTRAINT postulaciones_id_vacante_fkey FOREIGN KEY (id_vacante) REFERENCES public.vacantes(id_vacante) ON DELETE CASCADE;
ALTER TABLE ONLY public.vacantes ADD CONSTRAINT vacantes_creado_por_usuario_id_fkey FOREIGN KEY (creado_por_usuario_id) REFERENCES public.usuarios(id_usuario) ON DELETE RESTRICT;
ALTER TABLE ONLY public.vacantes ADD CONSTRAINT vacantes_id_servicio_interes_fkey FOREIGN KEY (id_servicio_interes) REFERENCES public.intereses_empresa(id_interes) ON DELETE SET NULL;

-- *****************************************************************************
-- Ajuste de secuencias (si necesitas reiniciarlas o establecer un valor específico)
-- *****************************************************************************
-- Estos comandos son para ajustar el valor actual de la secuencia.
-- Si estás creando la base de datos desde cero, no suelen ser necesarios,
-- pero son útiles si has insertado datos manualmente y quieres que la secuencia
-- continúe desde el valor más alto existente.
-- SELECT pg_catalog.setval('public.candidatos_id_candidato_seq', (SELECT MAX(id_candidato) FROM public.candidatos), true);
-- SELECT pg_catalog.setval('public.intereses_empresa_id_interes_seq', (SELECT MAX(id_interes) FROM public.intereses_empresa), true);
-- SELECT pg_catalog.setval('public.postulaciones_id_postulacion_seq', (SELECT MAX(id_postulacion) FROM public.postulaciones), true);
-- SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', (SELECT MAX(id_usuario) FROM public.usuarios), true);
-- SELECT pg_catalog.setval('public.vacantes_id_vacante_seq', (SELECT MAX(id_vacante) FROM public.vacantes), true);

-- Los valores que tenías (1, false o 2, true) son para inicializar o establecer
-- la secuencia a un valor específico.
-- SELECT pg_catalog.setval('public.candidatos_id_candidato_seq', 1, false);
-- SELECT pg_catalog.setval('public.intereses_empresa_id_interes_seq', 1, false);
-- SELECT pg_catalog.setval('public.postulaciones_id_postulacion_seq', 1, false);
-- SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 2, true);
-- SELECT pg_catalog.setval('public.vacantes_id_vacante_seq', 1, false);