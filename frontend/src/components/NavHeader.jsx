import { useState } from 'react'


export const NavHeader = () => {
    
    return (
        <div>
            <figure>
                <img src="../assets/novum-logo.png" alt="" />
            </figure>
            <nav>
                <ul>
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
        </div>
    )
}

