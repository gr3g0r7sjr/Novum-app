import novumLogo from '../assets/novum-logo.png'
import bgNav from '../assets/bg-home.jpg'; 


export const NavHeader = () => {
    const imageNavBg = bgNav; 
    
    return (
        <section className = "flex w-full py-2.5 px-5 items-center justify-between" style={{ backgroundImage: `url('${imageNavBg}')` }}>
            <figure className="w-44">
                <img src={novumLogo} alt="Logo de Novumideas" />
            </figure>
            <nav className="w-auto">
                <ul className="flex justify-between gap-7 text-slate-50">
                    <li>
                        <a href="">Vacantes</a>
                    </li>
                    <li>
                        <a href="">Nosotros</a>
                    </li>
                    <li>
                        <a href="">Contacto</a>
                    </li>
                    <li>
                        <a href="">LogIn</a>
                    </li>
                </ul>
            </nav>
        </section>
    )
}

