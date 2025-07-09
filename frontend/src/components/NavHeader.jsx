import { memo, useMemo, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import novumLogo from "../assets/novum-logo.png"
import bgNav from "../assets/bg-home.jpg"
import { Menu, X } from "lucide-react"

export const NavHeader = memo(({ routesGroups }) => {
  const location = useLocation()
  const currentPath = location.pathname

  const [menuOpen, setMenuOpen] = useState(false)

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
      return []
    }
  }, [routesGroups, currentPath])

  const imageNavBg = bgNav

  return (
    <section
      className="flex flex-col w-full py-2.5 px-4 md:px-10 box-border"
      style={{ backgroundImage: `url('${imageNavBg}')` }}
    >
      <div className="flex w-full items-center justify-between">
        <figure className="w-32">
          <a href="../">
            <img src={novumLogo || "/placeholder.svg"} alt="Logo de Novumideas" />
          </a>
        </figure>

        {/* Botón hamburguesa solo en móviles */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú de escritorio */}
        <nav className="hidden md:flex w-auto">
          <ul className="flex justify-between text-slate-50 w-full">
            {routesToDisplay.length > 0 ? (
              routesToDisplay.map((route, index) => (
                <li key={`${route.path}-${index}`} className= "pl-2">
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

      {/* Menú desplegable para móviles */}
      {menuOpen && (
        <nav className="md:hidden mt-3">
          <ul className="flex flex-col gap-2 text-slate-50 bg-blue-800 rounded p-4">
            {routesToDisplay.length > 0 ? (
              routesToDisplay.map((route, index) => (
                <li key={`mobile-${route.path}-${index}`}>
                  <NavLink
                    to={route.path}
                    onClick={() => setMenuOpen(false)} // Cierra el menú al hacer clic
                    className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
                    style={({ isActive }) => ({
                      display: "block",
                      textDecoration: "none",
                      color: isActive ? "white" : "#fafaf9",
                      fontWeight: isActive ? "bold" : "normal",
                      padding: "0.5rem",
                      borderRadius: "0.375rem",
                    })}
                  >
                    {route.name}
                  </NavLink>
                </li>
              ))
            ) : (
              <li className="text-white">No hay rutas disponibles</li>
            )}
          </ul>
        </nav>
      )}
    </section>
  )
})

NavHeader.displayName = "NavHeader"
