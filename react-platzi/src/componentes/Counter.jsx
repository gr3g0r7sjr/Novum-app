import { useState } from "react";

export const Counter = () => {
    const [count, setCount] = useState(0);

    return (
        <section className="w-1/4 min-w-xs mx-auto bg-blue-200 p-4 flex flex-col justify-center items-center h-56 gap-5">
            <p>El contador esta en: {count}</p>
            <div>
                <button className="text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none " onClick={() => setCount(count + 1)}>Incrementar</button>

                <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 " onClick={() => {
                    if (count > 0) {
                    setCount(count - 1)}
                }}
                >Decrementar</button>
            </div>
        </section>
    )
}