// import * as R from 'ramda';

import { useAtom, WritableAtom } from 'jotai'
import { Observable, Subject, from, of } from 'rxjs';
import { map, switchMap, filter, catchError } from 'rxjs/operators';
import { useObservable, useSubscription } from 'observable-hooks'

import moment from 'moment';
import { useState } from 'react';
import { useLifecycles } from 'react-use';

interface Config {
    instanceID?: number,
    name?: string,
    serialize?: boolean,
    actionCreators?: any,
    latency?: number,
    predicate?: any,
    autoPause?: boolean
}

interface Message {
    type: string,
    payload?: any,
    state?: any
}

interface IConnectionResult {
    subscribe: (dispatch: any) => {};
    unsubscribe: () => {};
    send: (action: string, state: any) => {};
    error: (payload: any) => {};
}

type ConnectionResult = IConnectionResult & Observable<Message>

interface Extension {
    connect: (options?: Config) => ConnectionResult;
}



interface JotaiDevtoolsProps {
    atom: WritableAtom<any, any>,
    name?: string,
    config?: Config
}

const wrapConnectionResult = (result: ConnectionResult) => {
    const subject = new Subject<Message>()

    result.subscribe(
        (x: any) => subject.next(x),
        (x: any) => subject.error(x),
        () => {subject.complete()}
    );

    return subject;
}

export const useJotaiDevtools = ({ atom, name, config, ...props }: JotaiDevtoolsProps) => {

    const options = {
        ...config,
        name
    }

    const [atomCurrentValue, setAtom] = useAtom(atom);

    // Use hook to pipe value of atom to observable.
    const atom$ = useObservable((input$) => input$.pipe(
        map(([x]) => x)
    ), [atomCurrentValue]);
 
    // Flag determines whether the last state update was a 'Time Travel' event
    const [wasTriggeredByDevtools, setWasTriggeredByDevtools] = useState(() => false);

    // Flag determines whether initial state has already been sent to DevTools extension
    const [sentInitialState, setSentInitialState] = useState(() => false);

    const [devTools, setDevTools] = useState<ConnectionResult>();

    // This observable hook provides a sanitized observable of DevTools extension events
    const devTools$ = useObservable((input$) => input$.pipe(
        filter(([x]) => !!x),
        switchMap(([x]) => wrapConnectionResult(x as ConnectionResult)),
        catchError((error, observable) => {
            console.error(error);
            return observable;
        })
    ), [devTools]);

    // Function handles State Jumps and Time Traveling
    const jumpToState = (newState: any) => {
        setWasTriggeredByDevtools(true)
        // var oldState = atomCurrentValue();
        setAtom(newState);
        // setWasTriggeredByDevtools(false);
    };

    // Hook for subscribing to DevTools extension events
    useSubscription(devTools$, (message) => {
        switch (message.type) {
            case 'START':
                console.log("Atom Devtools Start", options.name, atomCurrentValue)
                if(!sentInitialState) {
                    // devTools.send("\"" + options.name + "\" - Initial State", atom.getState());
                    devTools?.send(name + " - Initial State", atomCurrentValue);
                    setSentInitialState(true);
                }
                return;
            case 'DISPATCH':
                if (!message.state) {
                    return;
                }
                switch (message.payload.type) {
                    case 'JUMP_TO_ACTION':
                    case 'JUMP_TO_STATE':
                        jumpToState(JSON.parse(message.state));
                        return;
                }
                return;
        }
    });

    // Subscription to Atom state changes
    useSubscription(atom$, (state) => {
        if (wasTriggeredByDevtools) {
            setWasTriggeredByDevtools(false);
            return;
        }
        devTools?.send(name + " - " + moment().toISOString(), state);
    })

    // Initial life cycle event to connect to DevTools Extension
    const initDevtools = () => {
        const devtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__ as Extension;
        // const options = config;
        const name = options.name || window.document.title;

        if (!devtools) {
            console.error('Jotai Devtools plugin: Cannot find Redux Devtools browser extension. Is it installed?');
            return atom;
        }

        const devTools = devtools.connect(options);
        
        console.log("Get Dev Tools", devTools, of(devTools));

        setDevTools(devTools);

        // setTimeout(() => devTools.send(name + " - Initial State", atomCurrentValue), 50)

        return atom;
    }

    // [React Use Hook]() that fires initialization
    useLifecycles(() => {
        initDevtools();
    });
}

export const JotaiDevtools: React.FC<JotaiDevtoolsProps> = (props) => {
    useJotaiDevtools(props);

    return null;
}