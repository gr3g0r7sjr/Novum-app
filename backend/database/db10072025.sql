--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-19 12:18:55

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16738)
-- Name: candidatos; Type: TABLE; Schema: public; Owner: postgres
--

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
    CONSTRAINT chk_vehiculo_valido CHECK (((vehiculo)::text = ANY (ARRAY[('si'::character varying)::text, ('no'::character varying)::text])))
);


ALTER TABLE public.candidatos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16745)
-- Name: candidatos_id_candidato_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidatos_id_candidato_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidatos_id_candidato_seq OWNER TO postgres;

--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 222
-- Name: candidatos_id_candidato_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidatos_id_candidato_seq OWNED BY public.candidatos.id_candidato;


--
-- TOC entry 217 (class 1259 OID 16726)
-- Name: intereses_empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.intereses_empresa (
    id_interes integer NOT NULL,
    nombre_interes character varying(100) NOT NULL
);


ALTER TABLE public.intereses_empresa OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16729)
-- Name: intereses_empresa_id_interes_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.intereses_empresa_id_interes_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.intereses_empresa_id_interes_seq OWNER TO postgres;

--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 218
-- Name: intereses_empresa_id_interes_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.intereses_empresa_id_interes_seq OWNED BY public.intereses_empresa.id_interes;


--
-- TOC entry 225 (class 1259 OID 16755)
-- Name: postulaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postulaciones (
    id_postulacion integer NOT NULL,
    id_candidato integer NOT NULL,
    id_vacante integer NOT NULL,
    fecha_postulacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    estado_postulacion character varying(50) DEFAULT 'recibida'::character varying NOT NULL
);


ALTER TABLE public.postulaciones OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16760)
-- Name: postulaciones_id_postulacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.postulaciones_id_postulacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.postulaciones_id_postulacion_seq OWNER TO postgres;

--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 226
-- Name: postulaciones_id_postulacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.postulaciones_id_postulacion_seq OWNED BY public.postulaciones.id_postulacion;


--
-- TOC entry 219 (class 1259 OID 16730)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    rol character varying(50) DEFAULT 'recursos_humanos'::character varying NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16737)
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 220
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 223 (class 1259 OID 16746)
-- Name: vacantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vacantes (
    id_vacante integer NOT NULL,
    titulo_cargo character varying(255) NOT NULL,
    area character varying(100) NOT NULL,
    descripcion_corta text NOT NULL,
    responsabilidades text,
    requisitos text NOT NULL,
    beneficios text,
    salario character varying(100),
    fecha_publicacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(50) DEFAULT 'activa'::character varying NOT NULL,
    creado_por_usuario_id integer NOT NULL,
    id_servicio_interes integer,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vacantes OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16754)
-- Name: vacantes_id_vacante_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vacantes_id_vacante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vacantes_id_vacante_seq OWNER TO postgres;

--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 224
-- Name: vacantes_id_vacante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vacantes_id_vacante_seq OWNED BY public.vacantes.id_vacante;


--
-- TOC entry 4766 (class 2604 OID 16761)
-- Name: candidatos id_candidato; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatos ALTER COLUMN id_candidato SET DEFAULT nextval('public.candidatos_id_candidato_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 16762)
-- Name: intereses_empresa id_interes; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intereses_empresa ALTER COLUMN id_interes SET DEFAULT nextval('public.intereses_empresa_id_interes_seq'::regclass);


--
-- TOC entry 4772 (class 2604 OID 16763)
-- Name: postulaciones id_postulacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones ALTER COLUMN id_postulacion SET DEFAULT nextval('public.postulaciones_id_postulacion_seq'::regclass);


--
-- TOC entry 4763 (class 2604 OID 16764)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 4768 (class 2604 OID 16765)
-- Name: vacantes id_vacante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes ALTER COLUMN id_vacante SET DEFAULT nextval('public.vacantes_id_vacante_seq'::regclass);


--
-- TOC entry 4946 (class 0 OID 16738)
-- Dependencies: 221
-- Data for Name: candidatos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidatos (id_candidato, nombre, apellido, correo_electronico, numero_telefono, direccion, educacion, experiencia_laboral, cursos_certificaciones, habilidades, servicio_interes, vehiculo, fecha_expiracion_datos, fecha_postulacion_inicial) FROM stdin;
\.


--
-- TOC entry 4942 (class 0 OID 16726)
-- Dependencies: 217
-- Data for Name: intereses_empresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.intereses_empresa (id_interes, nombre_interes) FROM stdin;
1	Tecnología 
2	Marketing
3	Recursos Humanos
4	Administración
\.


--
-- TOC entry 4950 (class 0 OID 16755)
-- Dependencies: 225
-- Data for Name: postulaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.postulaciones (id_postulacion, id_candidato, id_vacante, fecha_postulacion, estado_postulacion) FROM stdin;
\.


--
-- TOC entry 4944 (class 0 OID 16730)
-- Dependencies: 219
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, email, password_hash, rol, fecha_creacion) FROM stdin;
1	gsubero@gmail.com	$2b$10$Nxiu6PpULX/a2JdvsafFq..O.IYobIj5FsxaZuWb2aNP0qDdpACLO	admin	2025-07-13 11:40:02.945656-04
\.


--
-- TOC entry 4948 (class 0 OID 16746)
-- Dependencies: 223
-- Data for Name: vacantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vacantes (id_vacante, titulo_cargo, area, descripcion_corta, responsabilidades, requisitos, beneficios, salario, fecha_publicacion, estado, creado_por_usuario_id, id_servicio_interes, fecha_creacion) FROM stdin;
9	Frontend Developer	Tecnologia	Frontend Developer con mas de 3 años	["React","Tailwind"]	["+3 años experiencia","React"]	["20 vacaciones","remoto"]	1.8	2025-07-14 21:08:02.006456-04	activa	1	1	2025-07-14 21:08:02.006456-04
10	Especialista en Marketing Digital	Marketing	Buscamos un experto en estrategias de marketing online y SEO.	["Desarrollar campañas de marketing","Analizar métricas de rendimiento.","Optimizar contenido para motores de búsqueda."]	["3+ años de experiencia en marketing digital.","Conocimiento en SEO"]	["Plan de carrera.","Bono por rendimiento","Vacaciones 20 dias anuales"]	1800	2025-07-15 15:53:09.544346-04	activa	1	2	2025-07-15 15:53:09.544346-04
\.


--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 222
-- Name: candidatos_id_candidato_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidatos_id_candidato_seq', 1, false);


--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 218
-- Name: intereses_empresa_id_interes_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.intereses_empresa_id_interes_seq', 4, true);


--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 226
-- Name: postulaciones_id_postulacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.postulaciones_id_postulacion_seq', 1, false);


--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 220
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 1, true);


--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 224
-- Name: vacantes_id_vacante_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vacantes_id_vacante_seq', 10, true);


--
-- TOC entry 4785 (class 2606 OID 16767)
-- Name: candidatos candidatos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatos
    ADD CONSTRAINT candidatos_pkey PRIMARY KEY (id_candidato);


--
-- TOC entry 4777 (class 2606 OID 16777)
-- Name: intereses_empresa intereses_empresa_nombre_interes_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intereses_empresa
    ADD CONSTRAINT intereses_empresa_nombre_interes_key UNIQUE (nombre_interes);


--
-- TOC entry 4779 (class 2606 OID 16769)
-- Name: intereses_empresa intereses_empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intereses_empresa
    ADD CONSTRAINT intereses_empresa_pkey PRIMARY KEY (id_interes);


--
-- TOC entry 4789 (class 2606 OID 16779)
-- Name: postulaciones postulaciones_id_candidato_id_vacante_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_id_candidato_id_vacante_key UNIQUE (id_candidato, id_vacante);


--
-- TOC entry 4791 (class 2606 OID 16771)
-- Name: postulaciones postulaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_pkey PRIMARY KEY (id_postulacion);


--
-- TOC entry 4781 (class 2606 OID 16781)
-- Name: usuarios usuarios_correo_electronico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_electronico_key UNIQUE (email);


--
-- TOC entry 4783 (class 2606 OID 16773)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4787 (class 2606 OID 16775)
-- Name: vacantes vacantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_pkey PRIMARY KEY (id_vacante);


--
-- TOC entry 4792 (class 2606 OID 16782)
-- Name: candidatos candidatos_servicio_interes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatos
    ADD CONSTRAINT candidatos_servicio_interes_fkey FOREIGN KEY (servicio_interes) REFERENCES public.intereses_empresa(id_interes) ON DELETE SET NULL;


--
-- TOC entry 4795 (class 2606 OID 16787)
-- Name: postulaciones postulaciones_id_candidato_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_id_candidato_fkey FOREIGN KEY (id_candidato) REFERENCES public.candidatos(id_candidato) ON DELETE CASCADE;


--
-- TOC entry 4796 (class 2606 OID 16792)
-- Name: postulaciones postulaciones_id_vacante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_id_vacante_fkey FOREIGN KEY (id_vacante) REFERENCES public.vacantes(id_vacante) ON DELETE CASCADE;


--
-- TOC entry 4793 (class 2606 OID 16797)
-- Name: vacantes vacantes_creado_por_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_creado_por_usuario_id_fkey FOREIGN KEY (creado_por_usuario_id) REFERENCES public.usuarios(id_usuario) ON DELETE RESTRICT;


--
-- TOC entry 4794 (class 2606 OID 16802)
-- Name: vacantes vacantes_id_servicio_interes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_id_servicio_interes_fkey FOREIGN KEY (id_servicio_interes) REFERENCES public.intereses_empresa(id_interes) ON DELETE SET NULL;


-- Completed on 2025-07-19 12:18:55

--
-- PostgreSQL database dump complete
--

