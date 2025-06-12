import {Counter} from './componentes/Counter'
import './App.css'

function App() {

  return (
    <section className='flex flex-col gap-1 justify-center items-center'>
      <Counter />

      <div>
        <h2>Seccion de Toggle</h2>
      </div>
    </section>
  );
}

export default App
