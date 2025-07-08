
export const CardsContacto = (props) => {

    const {titulo, imageUrl, parrafo, parrafo2} = props; 

    return (
        <div>
            <div>
                <figure className="rounded-full bg-sky-200">
                    <img src={imageUrl} alt="" />
                </figure>
                <h4 className="font-bold">{titulo}</h4>
                <p>{parrafo}</p>
                <p>{parrafo2}</p>
            </div>
        </div>
    )
}