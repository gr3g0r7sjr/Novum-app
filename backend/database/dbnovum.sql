--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-08-01 01:19:37

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
-- TOC entry 217 (class 1259 OID 49388)
-- Name: candidatos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidatos (
    id_candidato integer NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido character varying(50) NOT NULL,
    correo_electronico character varying(50) NOT NULL,
    numero_telefono character varying(11),
    direccion text,
    educacion text[],
    experiencia_laboral text[],
    cursos_certificaciones text[],
    habilidades text[],
    servicio_interes integer,
    vehiculo character varying(20),
    fecha_postulacion_inicial timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    tipo_identificacion character varying(1),
    cedula character varying(50),
    fecha_nacimiento date,
    CONSTRAINT chk_vehiculo_valido CHECK (((vehiculo)::text = ANY (ARRAY[('si'::character varying)::text, ('no'::character varying)::text])))
);


ALTER TABLE public.candidatos OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 49395)
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
-- TOC entry 4854 (class 0 OID 0)
-- Dependencies: 218
-- Name: candidatos_id_candidato_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidatos_id_candidato_seq OWNED BY public.candidatos.id_candidato;


--
-- TOC entry 219 (class 1259 OID 49396)
-- Name: intereses_empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.intereses_empresa (
    id_interes integer NOT NULL,
    nombre_interes character varying(100) NOT NULL
);


ALTER TABLE public.intereses_empresa OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 49399)
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
-- TOC entry 4855 (class 0 OID 0)
-- Dependencies: 220
-- Name: intereses_empresa_id_interes_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.intereses_empresa_id_interes_seq OWNED BY public.intereses_empresa.id_interes;


--
-- TOC entry 221 (class 1259 OID 49400)
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
-- TOC entry 222 (class 1259 OID 49405)
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
-- TOC entry 4856 (class 0 OID 0)
-- Dependencies: 222
-- Name: postulaciones_id_postulacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.postulaciones_id_postulacion_seq OWNED BY public.postulaciones.id_postulacion;


--
-- TOC entry 223 (class 1259 OID 49406)
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
-- TOC entry 224 (class 1259 OID 49413)
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
-- TOC entry 4857 (class 0 OID 0)
-- Dependencies: 224
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 225 (class 1259 OID 49414)
-- Name: vacantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vacantes (
    id_vacante integer NOT NULL,
    titulo_cargo character varying(255) NOT NULL,
    descripcion_corta text NOT NULL,
    responsabilidades text[],
    requisitos text[] NOT NULL,
    beneficios text[],
    salario character varying(100),
    fecha_publicacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(50) DEFAULT 'activa'::character varying NOT NULL,
    creado_por_usuario_id integer NOT NULL,
    id_servicio_interes integer,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vacantes OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 49422)
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
-- TOC entry 4858 (class 0 OID 0)
-- Dependencies: 226
-- Name: vacantes_id_vacante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vacantes_id_vacante_seq OWNED BY public.vacantes.id_vacante;


--
-- TOC entry 4661 (class 2604 OID 49423)
-- Name: candidatos id_candidato; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatos ALTER COLUMN id_candidato SET DEFAULT nextval('public.candidatos_id_candidato_seq'::regclass);


--
-- TOC entry 4663 (class 2604 OID 49424)
-- Name: intereses_empresa id_interes; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intereses_empresa ALTER COLUMN id_interes SET DEFAULT nextval('public.intereses_empresa_id_interes_seq'::regclass);


--
-- TOC entry 4664 (class 2604 OID 49425)
-- Name: postulaciones id_postulacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones ALTER COLUMN id_postulacion SET DEFAULT nextval('public.postulaciones_id_postulacion_seq'::regclass);


--
-- TOC entry 4667 (class 2604 OID 49426)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 4670 (class 2604 OID 49427)
-- Name: vacantes id_vacante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes ALTER COLUMN id_vacante SET DEFAULT nextval('public.vacantes_id_vacante_seq'::regclass);


--
-- TOC entry 4839 (class 0 OID 49388)
-- Dependencies: 217
-- Data for Name: candidatos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidatos (id_candidato, nombre, apellido, correo_electronico, numero_telefono, direccion, educacion, experiencia_laboral, cursos_certificaciones, habilidades, servicio_interes, vehiculo, fecha_postulacion_inicial, tipo_identificacion, cedula, fecha_nacimiento) FROM stdin;
6	Gregory	Subero	gsubero@gmail.com	04129722981	Carrizal, calle el parque ramal 1, casa san antonio	{"{\\"institucion\\":\\"IUTA\\",\\"titulo\\":\\"Tsu Informatica\\",\\"fechaInicio\\":\\"2024-01\\",\\"fechaFin\\":\\"2025-08\\"}"}	{"{\\"empresa\\":\\"AvilaTek\\",\\"puesto\\":\\"Frontend Developer\\",\\"fechaInicio\\":\\"2025-01\\",\\"fechaFin\\":\\"2025-08\\"}"}	{"{\\"nombre\\":\\"React.js\\",\\"institucion\\":\\"Platzi\\",\\"fechaObtencion\\":\\"2025-01\\"}"}	{React.js,Tailwind,Next.js,Git}	1	si	2025-07-30 00:25:09.762073-04	V	28307003	2002-03-07
7	Richard 	Sosa	rsosa@gmail.com	04129722971	San antonio de los altos edif. loma alegre	{"{\\"institucion\\":\\"IUTA\\",\\"titulo\\":\\"Tsu Informatica\\",\\"fechaInicio\\":\\"2023-09\\",\\"fechaFin\\":\\"2025-08\\"}"}	{"{\\"empresa\\":\\"Inter\\",\\"puesto\\":\\"Frontend Developer\\",\\"fechaInicio\\":\\"2025-01\\",\\"fechaFin\\":\\"2025-08\\"}"}	{"{\\"nombre\\":\\"Frontend Developer\\",\\"institucion\\":\\"Platzi\\",\\"fechaObtencion\\":\\"2025-05\\"}"}	{React.js,Git}	1	no	2025-07-30 00:39:08.711285-04	V	30111222	2004-11-01
8	Fabricio 	Favrin	favrinps4@gmail.com	04149020248	Carrizal, colinas de carrizal, sector el golf, qta regimar	{"{\\"institucion\\":\\"Universidad Santa Maria\\",\\"titulo\\":\\"Ing. Sistemas\\",\\"fechaInicio\\":\\"2023-09\\",\\"fechaFin\\":\\"2025-04\\"}"}	{"{\\"empresa\\":\\"Movistar\\",\\"puesto\\":\\"Backend Developer\\",\\"fechaInicio\\":\\"2024-01\\",\\"fechaFin\\":\\"2025-01\\"}"}	{"{\\"nombre\\":\\"Express.js\\",\\"institucion\\":\\"Udemy\\",\\"fechaObtencion\\":\\"2025-01\\"}"}	{Express.js,Git,Postgresql}	1	si	2025-07-30 14:54:24.992004-04	V	29765859	2002-05-24
9	Juan	Perez	juan.perez@email.com	04121234567	\N	{"Ingeniero en Sistemas"}	{"6 a¤os en desarrollo backend con Node.js y PostgreSQL"}	{"Certificaci¢n AWS Developer","Curso de Node.js Avanzado"}	{Node.js,Express.js,PostgreSQL,"APIs RESTful",Microservicios}	1	si	2025-08-01 01:13:47.740098-04	\N	\N	\N
10	Maria	Rodriguez	maria.rodriguez@email.com	04242345678	\N	{"Ingeniero en Computaci¢n"}	{"4 a¤os en desarrollo web full-stack"}	{"Curso de SQL Fundamentos"}	{Node.js,Express.js,MongoDB,Python}	1	no	2025-08-01 01:13:47.769901-04	\N	\N	\N
11	Pedro	Sanchez	pedro.sanchez@email.com	04163456789	\N	{"TSU en Dise¤o Gr fico"}	{"2 a¤os en dise¤o web"}	{"Curso de Ilustraci¢n Digital"}	{HTML,CSS,"Dise¤o Gr fico"}	1	no	2025-08-01 01:13:47.800634-04	\N	\N	\N
12	Ana	Gomez	ana.gomez@email.com	04144567890	\N	{"TSU en Inform tica"}	{"1 a¤o de experiencia profesional con React.js"}	{"Curso de React para Principiantes","Certificaci¢n Frontend"}	{React.js,HTML5,CSS3,JavaScript,"Tailwind CSS"}	1	si	2025-08-01 01:13:47.83896-04	\N	\N	\N
13	Carlos	Torres	carlos.torres@email.com	04265678901	\N	{"Ingeniero en Computaci¢n"}	{"2 a¤os de desarrollo con Vue.js y JavaScript"}	{"Bootcamp de Desarrollo Web"}	{JavaScript,HTML,CSS,Vue.js}	1	no	2025-08-01 01:13:47.860158-04	\N	\N	\N
14	Laura	D¡az	laura.diaz@email.com	04126789012	\N	{"TSU en Inform tica"}	{"0 a¤os de experiencia profesional"}	{"Curso de Dise¤o Web"}	{HTML,CSS,Bootstrap}	1	no	2025-08-01 01:13:47.888081-04	\N	\N	\N
15	Daniela	Castro	daniela.castro@email.com	04167890123	\N	{"Estudiante Universitario"}	{"0 a¤os de experiencia profesional"}	{"Curso de ES6"}	{React.js,JavaScript}	1	si	2025-08-01 01:13:47.915078-04	\N	\N	\N
16	Luis	Mendoza	luis.mendoza@email.com	04248901234	\N	{"Ingeniero en Sistemas"}	{"5 a¤os de experiencia con Java"}	{"Certificaci¢n Oracle"}	{Java,"Spring Boot","SQL Server"}	1	si	2025-08-01 01:13:47.937452-04	\N	\N	\N
\.


--
-- TOC entry 4841 (class 0 OID 49396)
-- Dependencies: 219
-- Data for Name: intereses_empresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.intereses_empresa (id_interes, nombre_interes) FROM stdin;
1	Tecnologia
2	Marketing
3	Recursos Humanos
4	Administración
\.


--
-- TOC entry 4843 (class 0 OID 49400)
-- Dependencies: 221
-- Data for Name: postulaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.postulaciones (id_postulacion, id_candidato, id_vacante, fecha_postulacion, estado_postulacion) FROM stdin;
6	6	13	2025-07-30 00:25:09.762073-04	recibida
7	7	13	2025-07-30 00:39:08.711285-04	recibida
8	8	14	2025-07-30 14:54:24.992004-04	recibida
9	9	14	2025-08-01 00:00:00-04	recibida
10	10	14	2025-08-01 00:00:00-04	recibida
11	11	14	2025-08-01 00:00:00-04	recibida
12	12	13	2025-08-01 00:00:00-04	recibida
13	13	13	2025-08-01 00:00:00-04	recibida
14	14	13	2025-08-01 00:00:00-04	recibida
15	15	13	2025-08-01 00:00:00-04	recibida
16	16	13	2025-08-01 00:00:00-04	recibida
\.


--
-- TOC entry 4845 (class 0 OID 49406)
-- Dependencies: 223
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, email, password_hash, rol, fecha_creacion) FROM stdin;
1	gsubero@gmail.com	$2b$10$JyMGuT762bIcScn0Qcurye5MVSRKqZyxJ7kJfYV2jGwbAnEc7ACey	admin	2025-07-13 11:40:02.945656-04
2	rsosa@gmail.com	$2b$10$ZYVJ/zJOpgQCa3tCimqOTewCPv1lr9zhr/VQVgG9Y063KsH6XI9PO	admin	2025-07-25 22:21:06.164608-04
3	novumideasrrhh@gmail.com	$2b$10$vy6iW4OnXmORBRV6X4B5n./kIj51INhnLeqi3.r5Vrg4M6EgCLTqi	usuario	2025-07-27 15:24:54.735329-04
\.


--
-- TOC entry 4847 (class 0 OID 49414)
-- Dependencies: 225
-- Data for Name: vacantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vacantes (id_vacante, titulo_cargo, descripcion_corta, responsabilidades, requisitos, beneficios, salario, fecha_publicacion, estado, creado_por_usuario_id, id_servicio_interes, fecha_creacion) FROM stdin;
13	Desarrollador Frontend Junior	Estamos buscando un Desarrollador Frontend Junior entusiasta y con ganas de aprender para unirse a nuestro equipo de desarrollo. Trabajarás bajo la guía de desarrolladores senior, contribuyendo a la construcción de interfaces de usuario y aprendiendo las mejores prácticas de la industria.	{"Asistir en el desarrollo y mantenimiento de componentes de interfaz de usuario utilizando React.js.","Colaborar con el equipo para implementar diseños y funcionalidades básicas.","Aprender y aplicar las mejores prácticas de codificación y optimización.","Participar en la depuración y resolución de problemas de software.","Contribuir a la documentación técnica del proyecto."}	{React.js,Tailwind,Git,Next.js}	{"Salario competitivo para un rol junior.","Oportunidades de capacitación y mentoría directa con desarrolladores senior.","Ambiente de trabajo colaborativo y de apoyo.","Flexibilidad horaria (a discutir)."}	800	2025-07-28 23:08:22.726111-04	activa	1	1	2025-07-28 23:08:22.726111-04
14	Desarrollador Backend Senior	Estamos buscando un Desarrollador Backend Senior experimentado y apasionado por construir sistemas robustos y escalables.	{"Diseñar, desarrollar y mantener APIs RESTful y microservicios utilizando Node.js y Express.","Colaborar con equipos de frontend y otros equipos para integrar servicios y funcionalidades.","Optimizar aplicaciones para máxima velocidad y escalabilidad.","Implementar y gestionar bases de datos (PostgreSQL, MongoDB) y asegurar la integridad de los datos."}	{Node.js,Postgresql,Git,Docker,Express.js}	{"Seguro de salud.","Vacaciones pagadas.","Salario competitivo acorde a la experiencia."}	NaN	2025-07-30 14:44:58.028887-04	activa	1	1	2025-07-30 14:44:58.028887-04
\.


--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 218
-- Name: candidatos_id_candidato_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidatos_id_candidato_seq', 16, true);


--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 220
-- Name: intereses_empresa_id_interes_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.intereses_empresa_id_interes_seq', 4, true);


--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 222
-- Name: postulaciones_id_postulacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.postulaciones_id_postulacion_seq', 16, true);


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 224
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 3, true);


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 226
-- Name: vacantes_id_vacante_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vacantes_id_vacante_seq', 14, true);


--
-- TOC entry 4676 (class 2606 OID 49429)
-- Name: candidatos candidatos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatos
    ADD CONSTRAINT candidatos_pkey PRIMARY KEY (id_candidato);


--
-- TOC entry 4678 (class 2606 OID 49431)
-- Name: intereses_empresa intereses_empresa_nombre_interes_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intereses_empresa
    ADD CONSTRAINT intereses_empresa_nombre_interes_key UNIQUE (nombre_interes);


--
-- TOC entry 4680 (class 2606 OID 49433)
-- Name: intereses_empresa intereses_empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intereses_empresa
    ADD CONSTRAINT intereses_empresa_pkey PRIMARY KEY (id_interes);


--
-- TOC entry 4682 (class 2606 OID 49435)
-- Name: postulaciones postulaciones_id_candidato_id_vacante_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_id_candidato_id_vacante_key UNIQUE (id_candidato, id_vacante);


--
-- TOC entry 4684 (class 2606 OID 49437)
-- Name: postulaciones postulaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_pkey PRIMARY KEY (id_postulacion);


--
-- TOC entry 4686 (class 2606 OID 49439)
-- Name: usuarios usuarios_correo_electronico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_electronico_key UNIQUE (email);


--
-- TOC entry 4688 (class 2606 OID 49441)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4690 (class 2606 OID 49443)
-- Name: vacantes vacantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_pkey PRIMARY KEY (id_vacante);


--
-- TOC entry 4691 (class 2606 OID 49444)
-- Name: candidatos candidatos_servicio_interes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatos
    ADD CONSTRAINT candidatos_servicio_interes_fkey FOREIGN KEY (servicio_interes) REFERENCES public.intereses_empresa(id_interes) ON DELETE SET NULL;


--
-- TOC entry 4692 (class 2606 OID 49449)
-- Name: vacantes vacantes_creado_por_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_creado_por_usuario_id_fkey FOREIGN KEY (creado_por_usuario_id) REFERENCES public.usuarios(id_usuario) ON DELETE RESTRICT;


--
-- TOC entry 4693 (class 2606 OID 49454)
-- Name: vacantes vacantes_id_servicio_interes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_id_servicio_interes_fkey FOREIGN KEY (id_servicio_interes) REFERENCES public.intereses_empresa(id_interes) ON DELETE SET NULL;


-- Completed on 2025-08-01 01:19:41

--
-- PostgreSQL database dump complete
--

