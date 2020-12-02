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
var DDPCommon = Package['ddp-common'].DDPCommon;
var check = Package.check.check;
var Match = Package.check.Match;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package.modules.meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

/* Package-scope variables */
var EV, self, Streamer;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:streamer":{"lib":{"ev.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_streamer/lib/ev.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals EV:true */

/* exported EV */
EV = /*#__PURE__*/function () {
  function EV() {
    this.handlers = {};
  }

  var _proto = EV.prototype;

  _proto.emit = function () {
    function emit(event) {
      var _this = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.handlers[event]) {
        this.handlers[event].forEach(function (handler) {
          return handler.apply(_this, args);
        });
      }
    }

    return emit;
  }();

  _proto.emitWithScope = function () {
    function emitWithScope(event, scope) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      if (this.handlers[event]) {
        this.handlers[event].forEach(function (handler) {
          return handler.apply(scope, args);
        });
      }
    }

    return emitWithScope;
  }();

  _proto.on = function () {
    function on(event, callback) {
      if (!this.handlers[event]) {
        this.handlers[event] = [];
      }

      this.handlers[event].push(callback);
    }

    return on;
  }();

  _proto.once = function () {
    function once(event, callback) {
      self = this;
      self.on(event, function () {
        function onetimeCallback() {
          callback.apply(this, arguments);
          self.removeListener(event, onetimeCallback);
        }

        return onetimeCallback;
      }());
    }

    return once;
  }();

  _proto.removeListener = function () {
    function removeListener(event, callback) {
      if (this.handlers[event]) {
        var index = this.handlers[event].indexOf(callback);

        if (index > -1) {
          this.handlers[event].splice(index, 1);
        }
      }
    }

    return removeListener;
  }();

  _proto.removeAllListeners = function () {
    function removeAllListeners(event) {
      this.handlers[event] = undefined;
    }

    return removeAllListeners;
  }();

  return EV;
}();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"client":{"client.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_streamer/client/client.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _createClass;

module.link("@babel/runtime/helpers/createClass", {
  default: function (v) {
    _createClass = v;
  }
}, 0);

var _assertThisInitialized;

module.link("@babel/runtime/helpers/assertThisInitialized", {
  default: function (v) {
    _assertThisInitialized = v;
  }
}, 1);

var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 2);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 3);

/* globals DDPCommon, EV */

/* eslint-disable new-cap */
var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});

var StreamerCentral = /*#__PURE__*/function (_EV) {
  _inheritsLoose(StreamerCentral, _EV);

  var _super = _createSuper(StreamerCentral);

  function StreamerCentral() {
    var _this;

    _this = _EV.call(this) || this;
    _this.instances = {};
    _this.ddpConnections = {}; // since each Streamer instance can provide its own ddp connection, store them by streamer name

    return _this;
  }

  var _proto = StreamerCentral.prototype;

  _proto.setupDdpConnection = function () {
    function setupDdpConnection(name, ddpConnection) {
      var _this2 = this;

      // make sure we only setup event listeners for each ddp connection once
      if (ddpConnection.hasMeteorStreamerEventListeners) {
        return;
      }

      ddpConnection._stream.on('message', function (raw_msg) {
        var msg = DDPCommon.parseDDP(raw_msg);

        if (msg && msg.msg === 'changed' && msg.collection && msg.fields && msg.fields.eventName && msg.fields.args) {
          msg.fields.args.unshift(msg.fields.eventName);
          msg.fields.args.unshift(msg.collection);

          _this2.emit.apply(_this2, msg.fields.args);
        }
      }); // store ddp connection


      this.storeDdpConnection(name, ddpConnection);
    }

    return setupDdpConnection;
  }();

  _proto.storeDdpConnection = function () {
    function storeDdpConnection(name, ddpConnection) {
      // mark the connection as setup for Streamer, and store it
      ddpConnection.hasMeteorStreamerEventListeners = true;
      this.ddpConnections[name] = ddpConnection;
    }

    return storeDdpConnection;
  }();

  return StreamerCentral;
}(EV);

Meteor.StreamerCentral = new StreamerCentral();

Meteor.Streamer = /*#__PURE__*/function (_EV2) {
  _inheritsLoose(Streamer, _EV2);

  var _super2 = _createSuper(Streamer);

  function Streamer(name) {
    var _this3;

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$useCollection = _ref.useCollection,
        useCollection = _ref$useCollection === void 0 ? false : _ref$useCollection,
        _ref$ddpConnection = _ref.ddpConnection,
        ddpConnection = _ref$ddpConnection === void 0 ? Meteor.connection : _ref$ddpConnection;

    if (Meteor.StreamerCentral.instances[name]) {
      console.warn('Streamer instance already exists:', name);
      return Meteor.StreamerCentral.instances[name] || _assertThisInitialized(_this3);
    }

    Meteor.StreamerCentral.setupDdpConnection(name, ddpConnection);
    _this3 = _EV2.call(this) || this;
    _this3.ddpConnection = ddpConnection || Meteor.connection;
    Meteor.StreamerCentral.instances[name] = _assertThisInitialized(_this3);
    _this3.name = name;
    _this3.useCollection = useCollection;
    _this3.subscriptions = {};
    Meteor.StreamerCentral.on(_this3.subscriptionName, function (eventName) {
      if (_this3.subscriptions[eventName]) {
        var _EV2$prototype$emit;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        _this3.subscriptions[eventName].lastMessage = args;

        (_EV2$prototype$emit = _EV2.prototype.emit).call.apply(_EV2$prototype$emit, [_assertThisInitialized(_this3), eventName].concat(args));
      }
    });

    _this3.ddpConnection._stream.on('reset', function () {
      _EV2.prototype.emit.call(_assertThisInitialized(_this3), '__reconnect__');
    });

    return _this3;
  }

  var _proto2 = Streamer.prototype;

  _proto2.stop = function () {
    function stop(eventName) {
      if (this.subscriptions[eventName] && this.subscriptions[eventName].subscription) {
        this.subscriptions[eventName].subscription.stop();
      }

      this.unsubscribe(eventName);
    }

    return stop;
  }();

  _proto2.stopAll = function () {
    function stopAll() {
      for (var eventName in meteorBabelHelpers.sanitizeForInObject(this.subscriptions)) {
        if (this.subscriptions.hasOwnProperty(eventName)) {
          this.stop(eventName);
        }
      }
    }

    return stopAll;
  }();

  _proto2.unsubscribe = function () {
    function unsubscribe(eventName) {
      this.removeAllListeners(eventName);
      delete this.subscriptions[eventName];
    }

    return unsubscribe;
  }();

  _proto2.subscribe = function () {
    function subscribe(eventName, args) {
      var _this4 = this;

      var subscribe;
      Tracker.nonreactive(function () {
        subscribe = _this4.ddpConnection.subscribe(_this4.subscriptionName, eventName, {
          useCollection: _this4.useCollection,
          args: args
        }, {
          onStop: function () {
            _this4.unsubscribe(eventName);
          }
        });
      });
      return subscribe;
    }

    return subscribe;
  }();

  _proto2.onReconnect = function () {
    function onReconnect(fn) {
      if (typeof fn === 'function') {
        _EV2.prototype.on.call(this, '__reconnect__', fn);
      }
    }

    return onReconnect;
  }();

  _proto2.getLastMessageFromEvent = function () {
    function getLastMessageFromEvent(eventName) {
      var subscription = this.subscriptions[eventName];

      if (subscription && subscription.lastMessage) {
        return subscription.lastMessage;
      }
    }

    return getLastMessageFromEvent;
  }();

  _proto2.once = function () {
    function once(eventName) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var callback = args.pop();
      check(eventName, NonEmptyString);
      check(callback, Function);

      if (!this.subscriptions[eventName]) {
        this.subscriptions[eventName] = {
          subscription: this.subscribe(eventName, args)
        };
      }

      _EV2.prototype.once.call(this, eventName, callback);
    }

    return once;
  }();

  _proto2.on = function () {
    function on(eventName) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      var callback = args.pop();
      check(eventName, NonEmptyString);
      check(callback, Function);

      if (!this.subscriptions[eventName]) {
        this.subscriptions[eventName] = {
          subscription: this.subscribe(eventName, args)
        };
      }

      _EV2.prototype.on.call(this, eventName, callback);
    }

    return on;
  }();

  _proto2.emit = function () {
    function emit() {
      var _this$ddpConnection;

      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      (_this$ddpConnection = this.ddpConnection).call.apply(_this$ddpConnection, [this.subscriptionName].concat(args));
    }

    return emit;
  }();

  _createClass(Streamer, [{
    key: "name",
    get: function () {
      return this._name;
    },
    set: function (name) {
      check(name, String);
      this._name = name;
    }
  }, {
    key: "subscriptionName",
    get: function () {
      return "stream-" + this.name;
    }
  }, {
    key: "useCollection",
    get: function () {
      return this._useCollection;
    },
    set: function (useCollection) {
      check(useCollection, Boolean);
      this._useCollection = useCollection;
    }
  }]);

  return Streamer;
}(EV);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/rocketchat:streamer/lib/ev.js");
require("/node_modules/meteor/rocketchat:streamer/client/client.js");

/* Exports */
Package._define("rocketchat:streamer", {
  Streamer: Streamer
});

})();
