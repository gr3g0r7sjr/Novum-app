import { memo, useMemo } from "react"
import { NavLink, useLocation } from "react-router-dom"
import novumLogo from "../assets/novum-logo.png"
import bgNav from "../assets/bg-home.jpg"

export const NavHeader = memo(({ routesGroups }) => {
  console.log("NavHeader renderizado:", new Date().toISOString()) // Para depurar

  const location = useLocation()
  const currentPath = location.pathname

  const routesToDisplay = useMemo(() => {
    // Primera comprobación: routesGroups debe ser un objeto válido.
    if (typeof routesGroups !== "object" || routesGroups === null) {
      console.error("NavHeader Error: routesGroups no es un objeto válido o es undefined/null.");
      return []; // Devuelve un array vacío para evitar errores al mapear
    }

    // Lógica para determinar qué grupo de rutas mostrar
    // ¡Asegúrate de que tus rutas de administrador estén descomentadas si las necesitas!
    // Aquí puedes implementar la lógica para mostrar rutas 'admin' si el usuario está en /admin
    // Por ahora, solo usaremos 'main' como lo tenías.
    // Si descomentas la lógica de admin, asegúrate de que routesGroups.admin exista
    /*
    if (currentPath.startsWith("/admin")) {
      if (Array.isArray(routesGroups.admin)) {
        return routesGroups.admin;
      } else {
        console.error("NavHeader Error: routesGroups.admin no es un array o es undefined.");
        return [];
      }
    } else {
      // ... el resto de la lógica para 'main'
    }
    */

    // Como tu lógica de admin está comentada, siempre devolvemos 'main'.
    // Aseguramos que 'main' sea un array o devolvemos un array vacío.
    if (Array.isArray(routesGroups.main)) {
      return routesGroups.main
    } else {
      console.error("NavHeader Error: routesGroups.main no es un array o es undefined.")
      // Si routesGroups.main no es un array, pero esperas un solo objeto,
      // esto lo envolvería en un array. Si no, debería ser un array vacío.
      // Para seguridad al mapear, preferiblemente [] si no es un array esperado.
      return Array.isArray(routesGroups.main) ? routesGroups.main : [];
    }
  }, [routesGroups, currentPath]) // <--- ¡IMPORTANTE: AHORA DEPENDE DE routesGroups Y currentPath!

  const imageNavBg = bgNav

  return (
    <section
      className="flex w-full py-2.5 px-10 items-center justify-center"
      style={{ backgroundImage: `url('${imageNavBg}')` }}
    >
      <div className="flex w-full items-center justify-between px-5">
        <figure className="w-32">
          <img src={novumLogo || "/placeholder.svg"} alt="Logo de Novumideas" />
        </figure>
        <nav className="w-auto">
          <ul className="flex justify-between gap-7 text-slate-50">
            {routesToDisplay.length > 0 ? (
              routesToDisplay.map((route, index) => (
                <li key={`${route.path}-${index}`}>
                  <NavLink
                    to={route.path}
                    className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "white" : "#B0B0B0",
                      fontWeight: isActive ? "bold" : "normal",
                    })}
                  >
                    {route.name}
                  </NavLink>
                </li>
              ))
            ) : (
              <li>No hay rutas disponibles</li>
            )}
          </ul>
        </nav>
      </div>
    </section>
  )
})

NavHeader.displayName = "NavHeader"