import React, { useEffect, useState } from 'react'

function Component() {
    const [count, setCount] = useState(64);

useEffect (()=>{
    const interval = setInterval(()=>{
    setCount (count/2)
},2000)

return () => {
    clearInterval(interval)
}
},[count])

return (
    <div></div>
)
}
export default Component