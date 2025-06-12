import { useState } from "react"


export const ToggleButton = () => {
    const [isActive, setIsActive] = useState(false); 

    return (
        <>
        <button onClick={()=> setIsActive(!isActive)}>Toggle {isActive}</button>
        </>
    )
}