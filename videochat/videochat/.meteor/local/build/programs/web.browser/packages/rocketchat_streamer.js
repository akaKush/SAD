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
var Promise = Package.promise.Promise;

/* Package-scope variables */
var EV, self, Streamer;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:streamer":{"lib":{"ev.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_streamer/lib/ev.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals EV:true */

/* exported EV */
EV = class EV {
  constructor() {
    this.handlers = {};
  }

  emit(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (this.handlers[event]) {
      this.handlers[event].forEach(handler => handler.apply(this, args));
    }
  }

  emitWithScope(event, scope) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    if (this.handlers[event]) {
      this.handlers[event].forEach(handler => handler.apply(scope, args));
    }
  }

  on(event, callback) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }

    this.handlers[event].push(callback);
  }

  once(event, callback) {
    self = this;
    self.on(event, function onetimeCallback() {
      callback.apply(this, arguments);
      self.removeListener(event, onetimeCallback);
    });
  }

  removeListener(event, callback) {
    if (this.handlers[event]) {
      const index = this.handlers[event].indexOf(callback);

      if (index > -1) {
        this.handlers[event].splice(index, 1);
      }
    }
  }

  removeAllListeners(event) {
    this.handlers[event] = undefined;
  }

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"client":{"client.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_streamer/client/client.js                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals DDPCommon, EV */

/* eslint-disable new-cap */
const NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});

class StreamerCentral extends EV {
  constructor() {
    super();
    this.instances = {};
    this.ddpConnections = {}; // since each Streamer instance can provide its own ddp connection, store them by streamer name
  }

  setupDdpConnection(name, ddpConnection) {
    // make sure we only setup event listeners for each ddp connection once
    if (ddpConnection.hasMeteorStreamerEventListeners) {
      return;
    }

    ddpConnection._stream.on('message', raw_msg => {
      const msg = DDPCommon.parseDDP(raw_msg);

      if (msg && msg.msg === 'changed' && msg.collection && msg.fields && msg.fields.eventName && msg.fields.args) {
        msg.fields.args.unshift(msg.fields.eventName);
        msg.fields.args.unshift(msg.collection);
        this.emit.apply(this, msg.fields.args);
      }
    }); // store ddp connection


    this.storeDdpConnection(name, ddpConnection);
  }

  storeDdpConnection(name, ddpConnection) {
    // mark the connection as setup for Streamer, and store it
    ddpConnection.hasMeteorStreamerEventListeners = true;
    this.ddpConnections[name] = ddpConnection;
  }

}

Meteor.StreamerCentral = new StreamerCentral();
Meteor.Streamer = class Streamer extends EV {
  constructor(name) {
    var _superprop_getEmit = () => super.emit,
        _this;

    let {
      useCollection = false,
      ddpConnection = Meteor.connection
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (Meteor.StreamerCentral.instances[name]) {
      console.warn('Streamer instance already exists:', name);
      return Meteor.StreamerCentral.instances[name];
    }

    Meteor.StreamerCentral.setupDdpConnection(name, ddpConnection);
    super();
    _this = this;
    this.ddpConnection = ddpConnection || Meteor.connection;
    Meteor.StreamerCentral.instances[name] = this;
    this.name = name;
    this.useCollection = useCollection;
    this.subscriptions = {};
    Meteor.StreamerCentral.on(this.subscriptionName, function (eventName) {
      if (_this.subscriptions[eventName]) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        _this.subscriptions[eventName].lastMessage = args;

        _superprop_getEmit().call(_this, eventName, ...args);
      }
    });

    this.ddpConnection._stream.on('reset', () => {
      super.emit.call(this, '__reconnect__');
    });
  }

  get name() {
    return this._name;
  }

  set name(name) {
    check(name, String);
    this._name = name;
  }

  get subscriptionName() {
    return "stream-".concat(this.name);
  }

  get useCollection() {
    return this._useCollection;
  }

  set useCollection(useCollection) {
    check(useCollection, Boolean);
    this._useCollection = useCollection;
  }

  stop(eventName) {
    if (this.subscriptions[eventName] && this.subscriptions[eventName].subscription) {
      this.subscriptions[eventName].subscription.stop();
    }

    this.unsubscribe(eventName);
  }

  stopAll() {
    for (let eventName in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(eventName)) {
        this.stop(eventName);
      }
    }
  }

  unsubscribe(eventName) {
    this.removeAllListeners(eventName);
    delete this.subscriptions[eventName];
  }

  subscribe(eventName, args) {
    let subscribe;
    Tracker.nonreactive(() => {
      subscribe = this.ddpConnection.subscribe(this.subscriptionName, eventName, {
        useCollection: this.useCollection,
        args
      }, {
        onStop: () => {
          this.unsubscribe(eventName);
        }
      });
    });
    return subscribe;
  }

  onReconnect(fn) {
    if (typeof fn === 'function') {
      super.on('__reconnect__', fn);
    }
  }

  getLastMessageFromEvent(eventName) {
    const subscription = this.subscriptions[eventName];

    if (subscription && subscription.lastMessage) {
      return subscription.lastMessage;
    }
  }

  once(eventName) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    const callback = args.pop();
    check(eventName, NonEmptyString);
    check(callback, Function);

    if (!this.subscriptions[eventName]) {
      this.subscriptions[eventName] = {
        subscription: this.subscribe(eventName, args)
      };
    }

    super.once(eventName, callback);
  }

  on(eventName) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    const callback = args.pop();
    check(eventName, NonEmptyString);
    check(callback, Function);

    if (!this.subscriptions[eventName]) {
      this.subscriptions[eventName] = {
        subscription: this.subscribe(eventName, args)
      };
    }

    super.on(eventName, callback);
  }

  emit() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    this.ddpConnection.call(this.subscriptionName, ...args);
  }

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
