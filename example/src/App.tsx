import React from 'react'

import { useAtom, atom } from 'jotai'
import { useJotaiDevtools, JotaiDevtools } from '@c0d3t3k/jotai-devtools'


const countAtom = atom(0)

const App: React.FC = () => {

    const [count, setCount] = useAtom(countAtom)

    useJotaiDevtools({
        name: "Count Atom (Hook)",
        atom: countAtom
    });

    const increment = () => {
        setCount(count + 1);
    }

    const decrement = () => {
        setCount(count - 1);
    }

    return (
        <>
            <JotaiDevtools atom={countAtom} name="Count Atom (Component)"/>
            <div>
                <h1>Count is {count}</h1>
                <button onClick={increment}>Increment Count</button>
                <button onClick={decrement}>Decrement Count</button>
            </div>
        </>
    )
}

export default App
