//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"react-meteor-data":{"index.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/react-meteor-data/index.js                                                                      //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
module.link("./useTracker", {
  default: "useTracker"
}, 1);
module.link("./withTracker.tsx", {
  default: "withTracker"
}, 2);

if (Meteor.isDevelopment) {
  const v = React.version.split('.');

  if (v[0] < 16 || v[0] == 16 && v[1] < 8) {
    console.warn('react-meteor-data 2.x requires React version >= 16.8.');
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"useTracker.ts":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/react-meteor-data/useTracker.ts                                                                 //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Tracker;
module.link("meteor/tracker", {
  Tracker(v) {
    Tracker = v;
  }

}, 1);
let useReducer, useEffect, useRef, useMemo;
module.link("react", {
  useReducer(v) {
    useReducer = v;
  },

  useEffect(v) {
    useEffect = v;
  },

  useRef(v) {
    useRef = v;
  },

  useMemo(v) {
    useMemo = v;
  }

}, 2);

// Warns if data is a Mongo.Cursor or a POJO containing a Mongo.Cursor.
function checkCursor(data) {
  let shouldWarn = false;

  if (Package.mongo && Package.mongo.Mongo && data && typeof data === 'object') {
    if (data instanceof Package.mongo.Mongo.Cursor) {
      shouldWarn = true;
    } else if (Object.getPrototypeOf(data) === Object.prototype) {
      Object.keys(data).forEach(key => {
        if (data[key] instanceof Package.mongo.Mongo.Cursor) {
          shouldWarn = true;
        }
      });
    }
  }

  if (shouldWarn) {
    console.warn('Warning: your reactive function is returning a Mongo cursor. ' + 'This value will not be reactive. You probably want to call ' + '`.fetch()` on the cursor before returning it.');
  }
} // Used to create a forceUpdate from useReducer. Forces update by
// incrementing a number whenever the dispatch method is invoked.


const fur = x => x + 1;

const useForceUpdate = () => {
  const [, forceUpdate] = useReducer(fur, 0);
  return forceUpdate;
}; // The follow functions were hoisted out of the closure to reduce allocations.
// Since they no longer have access to the local vars, we pass them in and mutate here.


const dispose = refs => {
  if (refs.computationCleanup) {
    refs.computationCleanup();
    delete refs.computationCleanup;
  }

  if (refs.computation) {
    refs.computation.stop();
    refs.computation = null;
  }
};

const runReactiveFn = Meteor.isDevelopment ? (refs, c) => {
  const data = refs.reactiveFn(c);
  checkCursor(data);
  refs.trackerData = data;
} : (refs, c) => {
  refs.trackerData = refs.reactiveFn(c);
};

const clear = refs => {
  if (refs.disposeId) {
    clearTimeout(refs.disposeId);
    delete refs.disposeId;
  }
};

const track = (refs, forceUpdate, trackedFn) => {
  // Use Tracker.nonreactive in case we are inside a Tracker Computation.
  // This can happen if someone calls `ReactDOM.render` inside a Computation.
  // In that case, we want to opt out of the normal behavior of nested
  // Computations, where if the outer one is invalidated or stopped,
  // it stops the inner one.
  Tracker.nonreactive(() => Tracker.autorun(c => {
    refs.computation = c;
    trackedFn(c, refs, forceUpdate);
  }));
};

const doFirstRun = (refs, c) => {
  // If there is a computationHandler, pass it the computation, and store the
  // result, which may be a cleanup method.
  if (refs.computationHandler) {
    const cleanupHandler = refs.computationHandler(c);

    if (cleanupHandler) {
      if (Meteor.isDevelopment && typeof cleanupHandler !== 'function') {
        console.warn('Warning: Computation handler should return a function ' + 'to be used for cleanup or return nothing.');
      }

      refs.computationCleanup = cleanupHandler;
    }
  } // Always run the reactiveFn on firstRun


  runReactiveFn(refs, c);
};

const tracked = (c, refs, forceUpdate) => {
  if (c.firstRun) {
    doFirstRun(refs, c);
  } else {
    if (refs.isMounted) {
      // Only run the reactiveFn if the component is mounted.
      runReactiveFn(refs, c);
      forceUpdate();
    } else {
      // If we got here, then a reactive update happened before the render was
      // committed - before useEffect has run. We don't want to run the reactiveFn
      // while we are not sure this render will be committed, so we'll dispose of the
      // computation, and set everything up to be restarted in useEffect if needed.
      // NOTE: If we don't run the user's reactiveFn when a computation updates, we'll
      // leave the computation in a non-reactive state - so we need to dispose here
      // and let useEffect recreate the computation later.
      dispose(refs); // Might as well clear the timeout!

      clear(refs);
    }
  }
};

const useTrackerNoDeps = function (reactiveFn) {
  let deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let computationHandler = arguments.length > 2 ? arguments[2] : undefined;
  const {
    current: refs
  } = useRef({
    reactiveFn,
    isMounted: false,
    trackerData: null
  });
  const forceUpdate = useForceUpdate();
  refs.reactiveFn = reactiveFn;

  if (computationHandler) {
    refs.computationHandler = computationHandler;
  } // Without deps, always dispose and recreate the computation with every render.


  dispose(refs);
  track(refs, forceUpdate, c => {
    if (c.firstRun) {
      doFirstRun(refs, c);
    } else {
      // For any reactive change, forceUpdate and let the next render rebuild the computation.
      forceUpdate();
    }
  }); // To avoid creating side effects in render with Tracker when not using deps
  // create the computation, run the user's reactive function in a computation synchronously,
  // then immediately dispose of it. It'll be recreated again after the render is committed.

  if (!refs.isMounted) {
    // We want to forceUpdate in useEffect to support StrictMode.
    // See: https://github.com/meteor/react-packages/issues/278
    dispose(refs);
  }

  useEffect(() => {
    // Let subsequent renders know we are mounted (render is comitted).
    refs.isMounted = true; // Render is committed. Since useTracker without deps always runs synchronously,
    // forceUpdate and let the next render recreate the computation.

    forceUpdate(); // stop the computation on unmount

    return () => dispose(refs);
  }, []);
  return refs.trackerData;
};

const useTrackerWithDeps = (reactiveFn, deps, computationHandler) => {
  const {
    current: refs
  } = useRef({
    reactiveFn,
    isMounted: false,
    trackerData: null
  });
  const forceUpdate = useForceUpdate(); // Always have up to date deps and computations in all contexts

  refs.reactiveFn = reactiveFn;
  refs.deps = deps;

  if (computationHandler) {
    refs.computationHandler = computationHandler;
  } // We are abusing useMemo a little bit, using it for it's deps
  // compare, but not for it's memoization.


  useMemo(() => {
    // stop the old one.
    dispose(refs);
    track(refs, forceUpdate, tracked); // Tracker creates side effect in render, which can be problematic in some cases, such as
    // Suspense or concurrent rendering or if an error is thrown and handled by an error boundary.
    // We still want synchronous rendering for a number of reasons (see readme). useTracker works
    // around memory/resource leaks by setting a time out to automatically clean everything up,
    // and watching a set of references to make sure everything is choreographed correctly.

    if (!refs.isMounted) {
      // Components yield to allow the DOM to update and the browser to paint before useEffect
      // is run. In concurrent mode this can take quite a long time. 1000ms should be enough
      // in most cases.
      refs.disposeId = setTimeout(() => {
        if (!refs.isMounted) {
          dispose(refs);
        }
      }, 1000);
    }
  }, deps);
  useEffect(() => {
    refs.isMounted = true; // Render is committed, clear the dispose timeout

    clear(refs); // If it took longer than 1000ms to get to useEffect, or a reactive update happened
    // before useEffect, restart the computation and forceUpdate.

    if (!refs.computation) {
      // This also runs runReactiveFn
      track(refs, forceUpdate, tracked);
      forceUpdate();
    } // stop the computation on unmount


    return () => dispose(refs);
  }, []);
  return refs.trackerData;
};

const useTrackerClient = function (reactiveFn) {
  let deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let computationHandler = arguments.length > 2 ? arguments[2] : undefined;
  return deps === null || deps === undefined || !Array.isArray(deps) ? useTrackerNoDeps(reactiveFn, deps, computationHandler) : useTrackerWithDeps(reactiveFn, deps, computationHandler);
};

const useTrackerServer = function (reactiveFn) {
  let deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let computationHandler = arguments.length > 2 ? arguments[2] : undefined;
  return Tracker.nonreactive(reactiveFn);
}; // When rendering on the server, we don't want to use the Tracker.
// We only do the first rendering on the server so we can get the data right away


const useTracker = Meteor.isServer ? useTrackerServer : useTrackerClient;

const useTrackerDev = function (reactiveFn) {
  let deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let computationHandler = arguments.length > 2 ? arguments[2] : undefined;

  if (typeof reactiveFn !== 'function') {
    console.warn('Warning: useTracker expected a function in it\'s first argument ' + "(reactiveFn), but got type of ".concat(typeof reactiveFn, "."));
  }

  if (deps && !Array.isArray(deps)) {
    console.warn('Warning: useTracker expected an array in it\'s second argument ' + "(dependency), but got type of ".concat(typeof deps, "."));
  }

  if (computationHandler && typeof computationHandler !== 'function') {
    console.warn('Warning: useTracker expected a function in it\'s third argument' + "(computationHandler), but got type of ".concat(typeof computationHandler, "."));
  }

  return useTracker(reactiveFn, deps, computationHandler);
};

module.exportDefault(Meteor.isDevelopment ? useTrackerDev : useTracker);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"withTracker.tsx":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/react-meteor-data/withTracker.tsx                                                               //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
let _extends;

module.link("@babel/runtime/helpers/extends", {
  default(v) {
    _extends = v;
  }

}, 0);
module.export({
  default: () => withTracker
});
let React, forwardRef, memo;
module.link("react", {
  default(v) {
    React = v;
  },

  forwardRef(v) {
    forwardRef = v;
  },

  memo(v) {
    memo = v;
  }

}, 0);
let useTracker;
module.link("./useTracker", {
  default(v) {
    useTracker = v;
  }

}, 1);

function withTracker(options) {
  return Component => {
    const getMeteorData = typeof options === 'function' ? options : options.getMeteorData;
    const WithTracker = forwardRef((props, ref) => {
      const data = useTracker(() => getMeteorData(props) || {});
      return /*#__PURE__*/React.createElement(Component, _extends({
        ref: ref
      }, props, data));
    }); // @ts-ignore

    const {
      pure = true
    } = options;
    return pure ? memo(WithTracker) : WithTracker;
  };
}

;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".ts",
    ".tsx"
  ]
});


/* Exports */
Package._define("react-meteor-data");

})();
