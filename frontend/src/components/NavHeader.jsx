import novumLogo from '../assets/novum-logo.png'
import bgNav from '../assets/bg-home.jpg'; 


export const NavHeader = ({links}) => {
    const imageNavBg = bgNav; 
    
    return (
        <section className = "flex w-full py-2.5 px-10 items-center justify-center" style={{ backgroundImage: `url('${imageNavBg}')` }}>
            <div className= "flex w-full items-center justify-between px-5">
                <figure className="w-32">
                    <img src={novumLogo} alt="Logo de Novumideas" />
                </figure>
                <nav className="w-auto">
                    <ul className="flex justify-between gap-7 text-slate-50">
                        {links.map((link) => (
                            <li key={link.path}>
                                <NavLink to={link.path} className={({isActive}) => isActive ? 'font-bold text-blue-300 transition-colors duration-300' 
                                            : 'hover:text-blue-200 transition-colors duration-300'}>
                                                {link.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </section>
    )
}

