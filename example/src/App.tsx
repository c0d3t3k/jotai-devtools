import React from 'react'

import { useAtom, atom } from 'jotai'
import { useJotaiDevtools, JotaiDevtools } from '@c0d3t3k/jotai-devtools'

// The atom to be monitored by the devtools.
const countAtom = atom(0)

const App: React.FC = () => {

    const [count, setCount] = useAtom(countAtom)

    // This hook maps the "Count Atom (Hook)" devtools instance to `countAtom`.
    useJotaiDevtools({
        name: "Count Atom (Hook)",
        atom: countAtom
    });

    // Some functions to modify `countAtom`
    const increment = () => {
        setCount(count + 1);
    }

    const decrement = () => {
        setCount(count - 1);
    }

    // The React component tree.
    return (
        <>
            {/* This component maps the "Count Atom (Component)" devtools instance to `countAtom`. */}
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
