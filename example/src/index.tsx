import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'jotai'

ReactDOM.render(
    // <React.StrictMode>
        <Provider>
            <App />
        </Provider>,
    // </React.StrictMode>,
    document.getElementById('root'),
)
