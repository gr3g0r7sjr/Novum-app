import { useState } from "react"; 

export const SearchInput = () => {
    const [search, setSearch] = useState("");

    const handleInputChange = (event) => {
    setSearch(event.target.value);
  }

    return(
        <form>
            <input
                type="search" 
                placeholder="Buscar vacantes..."
                value={search} 
                onChange={handleInputChange} 
            />
        </form>
    )
}