import React from 'react';
import {NavHeader} from '../components/NavHeader.jsx';     // Importa tu componente de navegación
import {Footer} from '../components/Footer/Footer.jsx'; // Importa tu componente de pie de página

export const Layout = ({ children }) => {

    const navRouteGroups = {
    main: [ // Rutas para la navegación principal (público)
        { path: '/', name: 'Vacantes' }, // La ruta principal ahora muestra las vacantes
        { path: '/nosotros', name: 'Nosotros' },
        { path: '/contacto', name: 'Contacto' },
        { path: '/login', name: 'Login'} // Login para administradores
    ],
    admin: [ // Rutas para el panel de administración
        {path: '/admin/dashboard', name : 'Dashboard'},
        {path: '/admin/vacantes', name:'Vacantes'},
        {path: '/admin/crearVacante', name: 'Crear Vacante'}, // Enlace al formulario de creación
        {path: '/admin/candidatos', name:'Candidatos'},
        {}
    ]
};


    return (
    <div className="flex flex-col min-h-screen"> 
    <NavHeader routesGroups={navRouteGroups} />
        <main className="flex-grow container mx-auto"> 
            {children} 
        </main>
    <Footer routesGroups = {navRouteGroups.main} /> {/* Renderiza el pie de página */}
    </div>
    );
};

