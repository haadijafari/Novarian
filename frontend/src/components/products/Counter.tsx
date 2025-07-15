'use client'
import React, { useState } from 'react'

const Counter = () => {
  const [num, setNum] = useState(0)
  return (
    <div className='flex'>
      <button onClick={() => { setNum(num + 1) }}>+</button>
      <p>{num}</p>
      <button onClick={() => { setNum(num - 1) }}>-</button>
    </div>
  )
}

export default Counter
