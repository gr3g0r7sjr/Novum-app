import { memo, useMemo } from "react"
import { NavLink, useLocation } from "react-router-dom"
import novumLogo from "../assets/novum-logo.png"
import bgNav from "../assets/bg-home.jpg"

export const NavHeader = memo(({ routesGroups }) => {
  console.log("NavHeader renderizado:", new Date().toISOString()) // Para depurar

  const location = useLocation()
  const currentPath = location.pathname

  const routesToDisplay = useMemo(() => {
    
    if (typeof routesGroups !== "object" || routesGroups === null) {
      console.error("NavHeader Error: routesGroups no es un objeto válido o es undefined/null.");
      return []; 
    }

    
    if (currentPath.startsWith("/admin")) {
      if (Array.isArray(routesGroups.admin)) {
        return routesGroups.admin;
      } else {
        console.error("NavHeader Error: routesGroups.admin no es un array o es undefined.");
        return [];
      }
    } 
    
    if (Array.isArray(routesGroups.main)) {
      return routesGroups.main
    } else {
      console.error("NavHeader Error: routesGroups.main no es un array o es undefined.")
      return Array.isArray(routesGroups.main) ? routesGroups.main : [];
    }
  }, [routesGroups, currentPath])

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
                      color: isActive ? "white" : "#fafaf9",
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