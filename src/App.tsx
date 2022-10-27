import { useState } from "react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Hello, world!</h1>

      <p>Count: {count}</p>
      <button onClick={() => setCount(previousCount => previousCount + 1)}>+</button>
      <button onClick={() => setCount(previousCount => previousCount - 1)}>-</button>
    </>
  )
}

export default App
