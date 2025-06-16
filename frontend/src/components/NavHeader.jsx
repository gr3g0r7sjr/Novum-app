import React from 'react';
import novumLogo from '../assets/novum-logo.png';
import bgNav from '../assets/bg-home.jpg';
import { NavLink, useLocation } from 'react-router-dom';

export const NavHeader = ({ routesGroups }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    let routesToDisplay = []; // Renombrado para mayor claridad

    // *** ¡AQUÍ ESTÁN LAS COMPROBACIONES CLAVE! ***
    // 1. Asegúrate de que routesGroups sea un objeto antes de acceder a sus propiedades.
    if (typeof routesGroups === 'object' && routesGroups !== null) {
        if (currentPath.startsWith("/admin")) {
            // 2. Asegúrate de que routesGroups.admin exista y sea un array.
            if (Array.isArray(routesGroups.admin)) {
                routesToDisplay = routesGroups.admin;
            } else {
                console.error("NavHeader Error: routesGroups.admin no es un array o es undefined.");
            }
        } else {
            // 3. Asegúrate de que routesGroups.main exista y sea un array.
            // Esta es la línea 17 que te está dando problemas.
            if (Array.isArray(routesGroups.main)) {
                routesToDisplay = routesGroups.main;
            } else {
                console.error("NavHeader Error: routesGroups.main no es un array o es undefined.");
            }
        }
    } else {
        console.error("NavHeader Error: routesGroups no es un objeto válido o es undefined/null.");
    }

    // Validación final para asegurarse de que tenemos un array válido para renderizar.
    if (!Array.isArray(routesToDisplay) || routesToDisplay.length === 0) {
        return <p>No se han proporcionado rutas válidas para la navegación.</p>;
    }

    const imageNavBg = bgNav;

    return (
        <section className="flex w-full py-2.5 px-10 items-center justify-center" style={{ backgroundImage: `url('${imageNavBg}')` }}>
            <div className="flex w-full items-center justify-between px-5">
                <figure className="w-32">
                    <img src={novumLogo} alt="Logo de Novumideas" />
                </figure>
                <nav className="w-auto">
                    <ul className="flex justify-between gap-7 text-slate-50">
                        {
                            routesToDisplay.map((route, index) => (
                                <li key={index}>
                                    <NavLink
                                        to={route.path}
                                        className={({ isActive }) =>
                                            isActive
                                            ? 'nav-link active-link'
                                            : 'nav-link'
                                        }
                                        style={({ isActive }) => ({
                                            textDecoration: "none",
                                            color: isActive ? 'white' : '#B0B0B0',
                                            fontWeight: isActive ? 'bold' : 'normal',
                                        })}
                                    >
                                        {route.name}
                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>
                </nav>
            </div>
        </section>
    );
};
