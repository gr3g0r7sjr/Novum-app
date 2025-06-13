import novumLogo from '../assets/novum-logo.png'
import bgNav from '../assets/bg-home.jpg'; 


export const NavHeader = () => {
    const imageNavBg = bgNav; 
    
    return (
        <section className = "flex w-full p-5 items-center justify-between" style={{ backgroundImage: `url('${imageNavBg}')` }}>
            <figure className="w-3xs">
                <img src={novumLogo} alt="Logo de Novumideas" />
            </figure>
            <nav className="w-5/6">
                <ul className="flex justify-between">
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

