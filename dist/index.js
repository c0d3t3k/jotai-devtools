

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var jotai = require('jotai');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var observableHooks = require('observable-hooks');
var moment = _interopDefault(require('moment'));
var react = require('react');
var reactUse = require('react-use');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

// import * as R from 'ramda';
var wrapConnectionResult = function (result) {
    var subject = new rxjs.Subject();
    result.subscribe(function (x) { return subject.next(x); }, function (x) { return subject.error(x); }, function () { subject.complete(); });
    return subject;
};
var useJotaiDevtools = function (_a) {
    var atom = _a.atom, name = _a.name, config = _a.config, props = __rest(_a, ["atom", "name", "config"]);
    var options = __assign(__assign({}, config), { name: name });
    var _b = jotai.useAtom(atom), atomCurrentValue = _b[0], setAtom = _b[1];
    // Use hook to pipe value of atom to observable.
    var atom$ = observableHooks.useObservable(function (input$) { return input$.pipe(operators.map(function (_a) {
        var x = _a[0];
        return x;
    })); }, [atomCurrentValue]);
    // Flag determines whether the last state update was a 'Time Travel' event
    var _c = react.useState(function () { return false; }), wasTriggeredByDevtools = _c[0], setWasTriggeredByDevtools = _c[1];
    // Flag determines whether initial state has already been sent to DevTools extension
    var _d = react.useState(function () { return false; }), sentInitialState = _d[0], setSentInitialState = _d[1];
    var _e = react.useState(), devTools = _e[0], setDevTools = _e[1];
    // This observable hook provides a sanitized observable of DevTools extension events
    var devTools$ = observableHooks.useObservable(function (input$) { return input$.pipe(operators.filter(function (_a) {
        var x = _a[0];
        return !!x;
    }), operators.switchMap(function (_a) {
        var x = _a[0];
        return wrapConnectionResult(x);
    }), operators.catchError(function (error, observable) {
        console.error(error);
        return observable;
    })); }, [devTools]);
    // Function handles State Jumps and Time Traveling
    var jumpToState = function (newState) {
        setWasTriggeredByDevtools(true);
        // var oldState = atomCurrentValue();
        setAtom(newState);
        // setWasTriggeredByDevtools(false);
    };
    // Hook for subscribing to DevTools extension events
    observableHooks.useSubscription(devTools$, function (message) {
        switch (message.type) {
            case 'START':
                console.log("Atom Devtools Start", options.name, atomCurrentValue);
                if (!sentInitialState) {
                    // devTools.send("\"" + options.name + "\" - Initial State", atom.getState());
                    devTools === null || devTools === void 0 ? void 0 : devTools.send(name + " - Initial State", atomCurrentValue);
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
    observableHooks.useSubscription(atom$, function (state) {
        if (wasTriggeredByDevtools) {
            setWasTriggeredByDevtools(false);
            return;
        }
        devTools === null || devTools === void 0 ? void 0 : devTools.send(name + " - " + moment().toISOString(), state);
    });
    // Initial life cycle event to connect to DevTools Extension
    var initDevtools = function () {
        var devtools = window.__REDUX_DEVTOOLS_EXTENSION__;
        // const options = config;
        var name = options.name || window.document.title;
        if (!devtools) {
            console.error('Jotai Devtools plugin: Cannot find Redux Devtools browser extension. Is it installed?');
            return atom;
        }
        var devTools = devtools.connect(options);
        console.log("Get Dev Tools", devTools, rxjs.of(devTools));
        setDevTools(devTools);
        // setTimeout(() => devTools.send(name + " - Initial State", atomCurrentValue), 50)
        return atom;
    };
    // [React Use Hook]() that fires initialization
    reactUse.useLifecycles(function () {
        initDevtools();
    });
};
var JotaiDevtools = function (props) {
    useJotaiDevtools(props);
    return null;
};

exports.JotaiDevtools = JotaiDevtools;
exports.useJotaiDevtools = useJotaiDevtools;
//# sourceMappingURL=index.js.map
