# Jotai Devtools

## About

[Redux Devtools](https://github.com/reduxjs/redux-devtools) integration for [Jotai](https://github.com/pmndrs/jotai). This library only supports the Redux Devtools browser extensions ([Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd), [Edge](https://microsoftedge.microsoft.com/addons/detail/redux-devtools/nnkgneoiohoecpdiaponcejilbhhikei) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)). It does not currently support the standalone app or the embedded component.

## Installation

NPM Package is coming soon. In the meantime, use the following to install:

```shell
yarn add https://github.com/c0d3t3k/jotai-devtools.git
```

## How to use

The Jotai Devtools library creates devtools integration instances on an [atom](https://github.com/pmndrs/jotai/blob/master/docs/core.md#atom) by atom basis. To create a devtools instance, two parameters are required:

```tsx
{
    // The display name for the atom
    name: "Count Atom (Hook)",

    // The atom to be mapped to a devtools instance
    atom: countAtom,
}
```

Also see the [Dev.to Article](https://dev.to/c0d3t3k/recoil-vs-jotai-using-typescript-4678) and [Sample Code](https://github.com/c0d3t3k/jotai-devtools).

The library provides two methods to enable a devtools instance:

### Hook Method 

```tsx
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
            <div>
                <h1>Count is {count}</h1>
                <button onClick={increment}>Increment Count</button>
                <button onClick={decrement}>Decrement Count</button>
            </div>
        </>
    )
}
```

### Component Method

```tsx
import React from 'react'

import { useAtom, atom } from 'jotai'
import { useJotaiDevtools, JotaiDevtools } from '@c0d3t3k/jotai-devtools'

// The atom to be monitored by the devtools.
const countAtom = atom(0)

const App: React.FC = () => {

    const [count, setCount] = useAtom(countAtom)

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
```

## Development

To compile the code once, run

- `npm run build`.

To compile the code once and refresh on file change, run

- `npm run start`.

To publish the package to npm, make sure you're logged in the correct account by running

- `npm login`.

Compile the package by running

- `npm run build`

Update the package version accordingly by using

- [`npm version [patch | minor | major]`](https://docs.npmjs.com/about-semantic-versioning)

Then publish the package by running

- `npm publish`


