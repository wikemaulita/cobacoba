import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div className='container bg-red-500'>
        <h1>Halo</h1>
      </div>
    </div>
  );
};

export default App
