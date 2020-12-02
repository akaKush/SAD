(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var DDPCommon = Package['ddp-common'].DDPCommon;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var EV, self, fn, eventName, Streamer;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:streamer":{"lib":{"ev.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_streamer/lib/ev.js                                                                         //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"server.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_streamer/server/server.js                                                                  //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/* globals EV */

/* eslint new-cap: false */
class StreamerCentral extends EV {
  constructor() {
    super();
    this.instances = {};
  }

}

Meteor.StreamerCentral = new StreamerCentral();
Meteor.Streamer = class Streamer extends EV {
  constructor(name) {
    let {
      retransmit = true,
      retransmitToSelf = false
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (Meteor.StreamerCentral.instances[name]) {
      console.warn('Streamer instance already exists:', name);
      return Meteor.StreamerCentral.instances[name];
    }

    super();
    Meteor.StreamerCentral.instances[name] = this;
    this.name = name;
    this.retransmit = retransmit;
    this.retransmitToSelf = retransmitToSelf;
    this.subscriptions = [];
    this.subscriptionsByEventName = {};
    this.transformers = {};
    this.iniPublication();
    this.initMethod();
    this._allowRead = {};
    this._allowEmit = {};
    this._allowWrite = {};
    this.allowRead('none');
    this.allowEmit('all');
    this.allowWrite('none');
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

  get retransmit() {
    return this._retransmit;
  }

  set retransmit(retransmit) {
    check(retransmit, Boolean);
    this._retransmit = retransmit;
  }

  get retransmitToSelf() {
    return this._retransmitToSelf;
  }

  set retransmitToSelf(retransmitToSelf) {
    check(retransmitToSelf, Boolean);
    this._retransmitToSelf = retransmitToSelf;
  }

  allowRead(eventName, fn) {
    if (fn === undefined) {
      fn = eventName;
      eventName = '__all__';
    }

    if (typeof fn === 'function') {
      return this._allowRead[eventName] = fn;
    }

    if (typeof fn === 'string' && ['all', 'none', 'logged'].indexOf(fn) === -1) {
      console.error("allowRead shortcut '".concat(fn, "' is invalid"));
    }

    if (fn === 'all' || fn === true) {
      return this._allowRead[eventName] = function () {
        return true;
      };
    }

    if (fn === 'none' || fn === false) {
      return this._allowRead[eventName] = function () {
        return false;
      };
    }

    if (fn === 'logged') {
      return this._allowRead[eventName] = function () {
        return Boolean(this.userId);
      };
    }
  }

  allowEmit(eventName, fn) {
    if (fn === undefined) {
      fn = eventName;
      eventName = '__all__';
    }

    if (typeof fn === 'function') {
      return this._allowEmit[eventName] = fn;
    }

    if (typeof fn === 'string' && ['all', 'none', 'logged'].indexOf(fn) === -1) {
      console.error("allowRead shortcut '".concat(fn, "' is invalid"));
    }

    if (fn === 'all' || fn === true) {
      return this._allowEmit[eventName] = function () {
        return true;
      };
    }

    if (fn === 'none' || fn === false) {
      return this._allowEmit[eventName] = function () {
        return false;
      };
    }

    if (fn === 'logged') {
      return this._allowEmit[eventName] = function () {
        return Boolean(this.userId);
      };
    }
  }

  allowWrite(eventName, fn) {
    if (fn === undefined) {
      fn = eventName;
      eventName = '__all__';
    }

    if (typeof fn === 'function') {
      return this._allowWrite[eventName] = fn;
    }

    if (typeof fn === 'string' && ['all', 'none', 'logged'].indexOf(fn) === -1) {
      console.error("allowWrite shortcut '".concat(fn, "' is invalid"));
    }

    if (fn === 'all' || fn === true) {
      return this._allowWrite[eventName] = function () {
        return true;
      };
    }

    if (fn === 'none' || fn === false) {
      return this._allowWrite[eventName] = function () {
        return false;
      };
    }

    if (fn === 'logged') {
      return this._allowWrite[eventName] = function () {
        return Boolean(this.userId);
      };
    }
  }

  isReadAllowed(scope, eventName, args) {
    if (this._allowRead[eventName]) {
      return this._allowRead[eventName].call(scope, eventName, ...args);
    }

    return this._allowRead['__all__'].call(scope, eventName, ...args);
  }

  isEmitAllowed(scope, eventName) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (this._allowEmit[eventName]) {
      return this._allowEmit[eventName].call(scope, eventName, ...args);
    }

    return this._allowEmit['__all__'].call(scope, eventName, ...args);
  }

  isWriteAllowed(scope, eventName, args) {
    if (this._allowWrite[eventName]) {
      return this._allowWrite[eventName].call(scope, eventName, ...args);
    }

    return this._allowWrite['__all__'].call(scope, eventName, ...args);
  }

  addSubscription(subscription, eventName) {
    this.subscriptions.push(subscription);

    if (!this.subscriptionsByEventName[eventName]) {
      this.subscriptionsByEventName[eventName] = [];
    }

    this.subscriptionsByEventName[eventName].push(subscription);
  }

  removeSubscription(subscription, eventName) {
    const index = this.subscriptions.indexOf(subscription);

    if (index > -1) {
      this.subscriptions.splice(index, 1);
    }

    if (this.subscriptionsByEventName[eventName]) {
      const index = this.subscriptionsByEventName[eventName].indexOf(subscription);

      if (index > -1) {
        this.subscriptionsByEventName[eventName].splice(index, 1);
      }
    }
  }

  transform(eventName, fn) {
    if (typeof eventName === 'function') {
      fn = eventName;
      eventName = '__all__';
    }

    if (!this.transformers[eventName]) {
      this.transformers[eventName] = [];
    }

    this.transformers[eventName].push(fn);
  }

  applyTransformers(methodScope, eventName, args) {
    if (this.transformers['__all__']) {
      this.transformers['__all__'].forEach(transform => {
        args = transform.call(methodScope, eventName, args);
        methodScope.tranformed = true;

        if (!Array.isArray(args)) {
          args = [args];
        }
      });
    }

    if (this.transformers[eventName]) {
      this.transformers[eventName].forEach(transform => {
        args = transform.call(methodScope, ...args);
        methodScope.tranformed = true;

        if (!Array.isArray(args)) {
          args = [args];
        }
      });
    }

    return args;
  }

  iniPublication() {
    const stream = this;
    Meteor.publish(this.subscriptionName, function (eventName, options) {
      check(eventName, String);
      check(options, Match.OneOf(Boolean, {
        useCollection: Boolean,
        args: Array
      }));
      let useCollection,
          args = [];

      if (typeof options === 'boolean') {
        useCollection = options;
      } else {
        if (options.useCollection) {
          useCollection = options.useCollection;
        }

        if (options.args) {
          args = options.args;
        }
      }

      if (eventName.length === 0) {
        this.stop();
        return;
      }

      if (stream.isReadAllowed(this, eventName, args) !== true) {
        this.stop();
        return;
      }

      const subscription = {
        subscription: this,
        eventName: eventName
      };
      stream.addSubscription(subscription, eventName);
      this.onStop(() => {
        stream.removeSubscription(subscription, eventName);
      });

      if (useCollection === true) {
        // Collection compatibility
        this._session.sendAdded(stream.subscriptionName, 'id', {
          eventName: eventName
        });
      }

      this.ready();
    });
  }

  initMethod() {
    const stream = this;
    const method = {};

    method[this.subscriptionName] = function (eventName) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      check(eventName, String);
      check(args, Array);
      this.unblock();

      if (stream.isWriteAllowed(this, eventName, args) !== true) {
        return;
      }

      const methodScope = {
        userId: this.userId,
        connection: this.connection,
        originalParams: args,
        tranformed: false
      };
      args = stream.applyTransformers(methodScope, eventName, args);
      stream.emitWithScope(eventName, methodScope, ...args);

      if (stream.retransmit === true) {
        stream._emit(eventName, args, this.connection, true);
      }
    };

    try {
      Meteor.methods(method);
    } catch (e) {
      console.error(e);
    }
  }

  _emit(eventName, args, origin, broadcast) {
    if (broadcast === true) {
      Meteor.StreamerCentral.emit('broadcast', this.name, eventName, args);
    }

    const subscriptions = this.subscriptionsByEventName[eventName];

    if (!Array.isArray(subscriptions)) {
      return;
    }

    subscriptions.forEach(subscription => {
      if (this.retransmitToSelf === false && origin && origin === subscription.subscription.connection) {
        return;
      }

      if (this.isEmitAllowed(subscription.subscription, eventName, ...args)) {
        subscription.subscription._session.sendChanged(this.subscriptionName, 'id', {
          eventName: eventName,
          args: args
        });
      }
    });
  }

  emit(eventName) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    this._emit(eventName, args, undefined, true);
  }

  emitWithoutBroadcast(eventName) {
    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    this._emit(eventName, args, undefined, false);
  }

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/rocketchat:streamer/lib/ev.js");
require("/node_modules/meteor/rocketchat:streamer/server/server.js");

/* Exports */
Package._define("rocketchat:streamer", {
  Streamer: Streamer
});

})();

//# sourceURL=meteor://💻app/packages/rocketchat_streamer.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcm9ja2V0Y2hhdDpzdHJlYW1lci9saWIvZXYuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3JvY2tldGNoYXQ6c3RyZWFtZXIvc2VydmVyL3NlcnZlci5qcyJdLCJuYW1lcyI6WyJFViIsImNvbnN0cnVjdG9yIiwiaGFuZGxlcnMiLCJlbWl0IiwiZXZlbnQiLCJhcmdzIiwiZm9yRWFjaCIsImhhbmRsZXIiLCJhcHBseSIsImVtaXRXaXRoU2NvcGUiLCJzY29wZSIsIm9uIiwiY2FsbGJhY2siLCJwdXNoIiwib25jZSIsInNlbGYiLCJvbmV0aW1lQ2FsbGJhY2siLCJhcmd1bWVudHMiLCJyZW1vdmVMaXN0ZW5lciIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsInJlbW92ZUFsbExpc3RlbmVycyIsInVuZGVmaW5lZCIsIlN0cmVhbWVyQ2VudHJhbCIsImluc3RhbmNlcyIsIk1ldGVvciIsIlN0cmVhbWVyIiwibmFtZSIsInJldHJhbnNtaXQiLCJyZXRyYW5zbWl0VG9TZWxmIiwiY29uc29sZSIsIndhcm4iLCJzdWJzY3JpcHRpb25zIiwic3Vic2NyaXB0aW9uc0J5RXZlbnROYW1lIiwidHJhbnNmb3JtZXJzIiwiaW5pUHVibGljYXRpb24iLCJpbml0TWV0aG9kIiwiX2FsbG93UmVhZCIsIl9hbGxvd0VtaXQiLCJfYWxsb3dXcml0ZSIsImFsbG93UmVhZCIsImFsbG93RW1pdCIsImFsbG93V3JpdGUiLCJfbmFtZSIsImNoZWNrIiwiU3RyaW5nIiwic3Vic2NyaXB0aW9uTmFtZSIsIl9yZXRyYW5zbWl0IiwiQm9vbGVhbiIsIl9yZXRyYW5zbWl0VG9TZWxmIiwiZXZlbnROYW1lIiwiZm4iLCJlcnJvciIsInVzZXJJZCIsImlzUmVhZEFsbG93ZWQiLCJjYWxsIiwiaXNFbWl0QWxsb3dlZCIsImlzV3JpdGVBbGxvd2VkIiwiYWRkU3Vic2NyaXB0aW9uIiwic3Vic2NyaXB0aW9uIiwicmVtb3ZlU3Vic2NyaXB0aW9uIiwidHJhbnNmb3JtIiwiYXBwbHlUcmFuc2Zvcm1lcnMiLCJtZXRob2RTY29wZSIsInRyYW5mb3JtZWQiLCJBcnJheSIsImlzQXJyYXkiLCJzdHJlYW0iLCJwdWJsaXNoIiwib3B0aW9ucyIsIk1hdGNoIiwiT25lT2YiLCJ1c2VDb2xsZWN0aW9uIiwibGVuZ3RoIiwic3RvcCIsIm9uU3RvcCIsIl9zZXNzaW9uIiwic2VuZEFkZGVkIiwicmVhZHkiLCJtZXRob2QiLCJ1bmJsb2NrIiwiY29ubmVjdGlvbiIsIm9yaWdpbmFsUGFyYW1zIiwiX2VtaXQiLCJtZXRob2RzIiwiZSIsIm9yaWdpbiIsImJyb2FkY2FzdCIsInNlbmRDaGFuZ2VkIiwiZW1pdFdpdGhvdXRCcm9hZGNhc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7QUFFQUEsRUFBRSxHQUFHLE1BQU1BLEVBQU4sQ0FBUztBQUNiQyxhQUFXLEdBQUc7QUFDYixTQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0E7O0FBRURDLE1BQUksQ0FBQ0MsS0FBRCxFQUFpQjtBQUFBLHNDQUFOQyxJQUFNO0FBQU5BLFVBQU07QUFBQTs7QUFDcEIsUUFBSSxLQUFLSCxRQUFMLENBQWNFLEtBQWQsQ0FBSixFQUEwQjtBQUN6QixXQUFLRixRQUFMLENBQWNFLEtBQWQsRUFBcUJFLE9BQXJCLENBQThCQyxPQUFELElBQWFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLElBQWQsRUFBb0JILElBQXBCLENBQTFDO0FBQ0E7QUFDRDs7QUFFREksZUFBYSxDQUFDTCxLQUFELEVBQVFNLEtBQVIsRUFBd0I7QUFBQSx1Q0FBTkwsSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQ3BDLFFBQUksS0FBS0gsUUFBTCxDQUFjRSxLQUFkLENBQUosRUFBMEI7QUFDekIsV0FBS0YsUUFBTCxDQUFjRSxLQUFkLEVBQXFCRSxPQUFyQixDQUE4QkMsT0FBRCxJQUFhQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0UsS0FBZCxFQUFxQkwsSUFBckIs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QSxZQUFiLENBQTBCc0IsVUFBdEYsRUFBa0c7QUFDakc7QUFDQTs7QUFFRCxVQUFJLEtBQUt6QixhQUFMLENBQW1CRyxZQUFZLENBQUNBLFlBQWhDLEVBQThDVCxTQUE5QyxFQUF5RCxHQUFHOUMsSUFBNUQsQ0FBSixFQUF1RTtBQUN0RXVELG9CQUFZLENBQUNBLFlBQWIsQ0FBMEJpQixRQUExQixDQUFtQ1ksV0FBbkMsQ0FBK0MsS0FBSzFDLGdCQUFwRCxFQUFzRSxJQUF0RSxFQUE0RTtBQUMzRUksbUJBQVMsRUFBRUEsU0FEZ0U7QUFFM0U5QyxjQUFJLEVBQUVBO0FBRnFFLFNBQTVFO0FBSUE7QUFDRCxLQVhEO0FBWUE7O0FBRURGLE1BQUksQ0FBQ2dELFNBQUQsRUFBcUI7QUFBQSx1Q0FBTjlDLElBQU07QUFBTkEsVUFBTTtBQUFBOztBQUN4QixTQUFLK0UsS0FBTCxDQUFXakMsU0FBWCxFQUFzQjlDLElBQXRCLEVBQTRCa0IsU0FBNUIsRUFBdUMsSUFBdkM7QUFDQTs7QUFFRG1FLHNCQUFvQixDQUFDdkMsU0FBRCxFQUFxQjtBQUFBLHVDQUFOOUMsSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQ3hDLFNBQUsrRSxLQUFMLENBQVdqQyxTQUFYLEVBQXNCOUMsSUFBdEIsRUFBNEJrQixTQUE1QixFQUF1QyxLQUF2QztBQUNBOztBQWhYMEMsQ0FBNUMsQyIsImZpbGUiOiIvcGFja2FnZXMvcm9ja2V0Y2hhdF9zdHJlYW1lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbHMgRVY6dHJ1ZSAqL1xuLyogZXhwb3J0ZWQgRVYgKi9cblxuRVYgPSBjbGFzcyBFViB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuaGFuZGxlcnMgPSB7fTtcblx0fVxuXG5cdGVtaXQoZXZlbnQsIC4uLmFyZ3MpIHtcblx0XHRpZiAodGhpcy5oYW5kbGVyc1tldmVudF0pIHtcblx0XHRcdHRoaXMuaGFuZGxlcnNbZXZlbnRdLmZvckVhY2goKGhhbmRsZXIpID0+IGhhbmRsZXIuYXBwbHkodGhpcywgYXJncykpO1xuXHRcdH1cblx0fVxuXG5cdGVtaXRXaXRoU2NvcGUoZXZlbnQsIHNjb3BlLCAuLi5hcmdzKSB7XG5cdFx0aWYgKHRoaXMuaGFuZGxlcnNbZXZlbnRdKSB7XG5cdFx0XHR0aGlzLmhhbmRsZXJzW2V2ZW50XS5mb3JFYWNoKChoYW5kbGVyKSA9PiBoYW5kbGVyLmFwcGx5KHNjb3BlLCBhcmdzKSk7XG5cdFx0fVxuXHR9XG5cblx0b24oZXZlbnQsIGNhbGxiYWNrKSB7XG5cdFx0aWYgKCF0aGlzLmhhbmRsZXJzW2V2ZW50XSkge1xuXHRcdFx0dGhpcy5oYW5kbGVyc1tldmVudF0gPSBbXTtcblx0XHR9XG5cdFx0dGhpcy5oYW5kbGVyc1tldmVudF0ucHVzaChjYWxsYmFjayk7XG5cdH1cblxuXHRvbmNlKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdHNlbGYgPSB0aGlzO1xuXHRcdHNlbGYub24oZXZlbnQsIGZ1bmN0aW9uIG9uZXRpbWVDYWxsYmFjaygpIHtcblx0XHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRzZWxmLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBvbmV0aW1lQ2FsbGJhY2spO1xuXHRcdH0pO1xuXHR9XG5cblx0cmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKSB7XG5cdFx0aWYodGhpcy5oYW5kbGVyc1tldmVudF0pIHtcblx0XHRcdGNvbnN0IGluZGV4ID0gdGhpcy5oYW5kbGVyc1tldmVudF0uaW5kZXhPZihjYWxsYmFjayk7XG5cdFx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0XHR0aGlzLmhhbmRsZXJzW2V2ZW50XS5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJlbW92ZUFsbExpc3RlbmVycyhldmVudCkge1xuXHRcdHRoaXMuaGFuZGxlcnNbZXZlbnRdID0gdW5kZWZpbmVkO1xuXHR9XG59O1xuIiwiLyogZ2xvYmFscyBFViAqL1xuLyogZXNsaW50IG5ldy1jYXA6IGZhbHNlICovXG5cbmNsYXNzIFN0cmVhbWVyQ2VudHJhbCBleHRlbmRzIEVWIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuaW5zdGFuY2VzID0ge307XG5cdH1cbn1cblxuTWV0ZW9yLlN0cmVhbWVyQ2VudHJhbCA9IG5ldyBTdHJlYW1lckNlbnRyYWw7XG5cblxuTWV0ZW9yLlN0cmVhbWVyID0gY2xhc3MgU3RyZWFtZXIgZXh0ZW5kcyBFViB7XG5cdGNvbnN0cnVjdG9yKG5hbWUsIHtyZXRyYW5zbWl0ID0gdHJ1ZSwgcmV0cmFuc21pdFRvU2VsZiA9IGZhbHNlfSA9IHt9KSB7XG5cdFx0aWYgKE1ldGVvci5TdHJlYW1lckNlbnRyYWwuaW5zdGFuY2VzW25hbWVdKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ1N0cmVhbWVyIGluc3RhbmNlIGFscmVhZHkgZXhpc3RzOicsIG5hbWUpO1xuXHRcdFx0cmV0dXJuIE1ldGVvci5TdHJlYW1lckNlbnRyYWwuaW5zdGFuY2VzW25hbWVdO1xuXHRcdH1cblxuXHRcdHN1cGVyKCk7XG5cblx0XHRNZXRlb3IuU3RyZWFtZXJDZW50cmFsLmluc3RhbmNlc1tuYW1lXSA9IHRoaXM7XG5cblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMucmV0cmFuc21pdCA9IHJldHJhbnNtaXQ7XG5cdFx0dGhpcy5yZXRyYW5zbWl0VG9TZWxmID0gcmV0cmFuc21pdFRvU2VsZjtcblxuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucyA9IFtdO1xuXHRcdHRoaXMuc3Vic2NyaXB0aW9uc0J5RXZlbnROYW1lID0ge307XG5cdFx0dGhpcy50cmFuc2Zvcm1lcnMgPSB7fTtcblxuXHRcdHRoaXMuaW5pUHVibGljYXRpb24oKTtcblx0XHR0aGlzLmluaXRNZXRob2QoKTtcblxuXHRcdHRoaXMuX2FsbG93UmVhZCA9IHt9O1xuXHRcdHRoaXMuX2FsbG93RW1pdCA9IHt9O1xuXHRcdHRoaXMuX2FsbG93V3JpdGUgPSB7fTtcblxuXHRcdHRoaXMuYWxsb3dSZWFkKCdub25lJyk7XG5cdFx0dGhpcy5hbGxvd0VtaXQoJ2FsbCcpO1xuXHRcdHRoaXMuYWxsb3dXcml0ZSgnbm9uZScpO1xuXHR9XG5cblx0Z2V0IG5hbWUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX25hbWU7XG5cdH1cblxuXHRzZXQgbmFtZShuYW1lKSB7XG5cdFx0Y2hlY2sobmFtZSwgU3RyaW5nKTtcblx0XHR0aGlzLl9uYW1lID0gbmFtZTtcblx0fVxuXG5cdGdldCBzdWJzY3JpcHRpb25OYW1lKCkge1xuXHRcdHJldHVybiBgc3RyZWFtLSR7dGhpcy5uYW1lfWA7XG5cdH1cblxuXHRnZXQgcmV0cmFuc21pdCgpIHtcblx0XHRyZXR1cm4gdGhpcy5fcmV0cmFuc21pdDtcblx0fVxuXG5cdHNldCByZXRyYW5zbWl0KHJldHJhbnNtaXQpIHtcblx0XHRjaGVjayhyZXRyYW5zbWl0LCBCb29sZWFuKTtcblx0XHR0aGlzLl9yZXRyYW5zbWl0ID0gcmV0cmFuc21pdDtcblx0fVxuXG5cdGdldCByZXRyYW5zbWl0VG9TZWxmKCkge1xuXHRcdHJldHVybiB0aGlzLl9yZXRyYW5zbWl0VG9TZWxmO1xuXHR9XG5cblx0c2V0IHJldHJhbnNtaXRUb1NlbGYocmV0cmFuc21pdFRvU2VsZikge1xuXHRcdGNoZWNrKHJldHJhbnNtaXRUb1NlbGYsIEJvb2xlYW4pO1xuXHRcdHRoaXMuX3JldHJhbnNtaXRUb1NlbGYgPSByZXRyYW5zbWl0VG9TZWxmO1xuXHR9XG5cblx0YWxsb3dSZWFkKGV2ZW50TmFtZSwgZm4pIHtcblx0XHRpZiAoZm4gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Zm4gPSBldmVudE5hbWU7XG5cdFx0XHRldmVudE5hbWUgPSAnX19hbGxfXyc7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2FsbG93UmVhZFtldmVudE5hbWVdID0gZm47XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ3N0cmluZycgJiYgWydhbGwnLCAnbm9uZScsICdsb2dnZWQnXS5pbmRleE9mKGZuKSA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFsbG93UmVhZCBzaG9ydGN1dCAnJHtmbn0nIGlzIGludmFsaWRgKTtcblx0XHR9XG5cblx0XHRpZiAoZm4gPT09ICdhbGwnIHx8IGZuID09PSB0cnVlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYWxsb3dSZWFkW2V2ZW50TmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmIChmbiA9PT0gJ25vbmUnIHx8IGZuID09PSBmYWxzZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2FsbG93UmVhZFtldmVudE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKGZuID09PSAnbG9nZ2VkJykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2FsbG93UmVhZFtldmVudE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBCb29sZWFuKHRoaXMudXNlcklkKTtcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0YWxsb3dFbWl0KGV2ZW50TmFtZSwgZm4pIHtcblx0XHRpZiAoZm4gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Zm4gPSBldmVudE5hbWU7XG5cdFx0XHRldmVudE5hbWUgPSAnX19hbGxfXyc7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2FsbG93RW1pdFtldmVudE5hbWVdID0gZm47XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ3N0cmluZycgJiYgWydhbGwnLCAnbm9uZScsICdsb2dnZWQnXS5pbmRleE9mKGZuKSA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFsbG93UmVhZCBzaG9ydGN1dCAnJHtmbn0nIGlzIGludmFsaWRgKTtcblx0XHR9XG5cblx0XHRpZiAoZm4gPT09ICdhbGwnIHx8IGZuID09PSB0cnVlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYWxsb3dFbWl0W2V2ZW50TmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmIChmbiA9PT0gJ25vbmUnIHx8IGZuID09PSBmYWxzZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2FsbG93RW1pdFtldmVudE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKGZuID09PSAnbG9nZ2VkJykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2FsbG93RW1pdFtldmVudE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBCb29sZWFuKHRoaXMudXNlcklkKTtcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0YWxsb3dXcml0ZShldmVudE5hbWUsIGZuKSB7XG5cdFx0aWYgKGZuID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGZuID0gZXZlbnROYW1lO1xuXHRcdFx0ZXZlbnROYW1lID0gJ19fYWxsX18nO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHJldHVybiB0aGlzLl9hbGxvd1dyaXRlW2V2ZW50TmFtZV0gPSBmbjtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGZuID09PSAnc3RyaW5nJyAmJiBbJ2FsbCcsICdub25lJywgJ2xvZ2dlZCddLmluZGV4T2YoZm4pID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWxsb3dXcml0ZSBzaG9ydGN1dCAnJHtmbn0nIGlzIGludmFsaWRgKTtcblx0XHR9XG5cblx0XHRpZiAoZm4gPT09ICdhbGwnIHx8IGZuID09PSB0cnVlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYWxsb3dXcml0ZVtldmVudE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoZm4gPT09ICdub25lJyB8fCBmbiA9PT0gZmFsc2UpIHtcblx0XHRcdHJldHVybiB0aGlzLl9hbGxvd1dyaXRlW2V2ZW50TmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoZm4gPT09ICdsb2dnZWQnKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYWxsb3dXcml0ZVtldmVudE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBCb29sZWFuKHRoaXMudXNlcklkKTtcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0aXNSZWFkQWxsb3dlZChzY29wZSwgZXZlbnROYW1lLCBhcmdzKSB7XG5cdFx0aWYgKHRoaXMuX2FsbG93UmVhZFtldmVudE5hbWVdKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYWxsb3dSZWFkW2V2ZW50TmFtZV0uY2FsbChzY29wZSwgZXZlbnROYW1lLCAuLi5hcmdzKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5fYWxsb3dSZWFkWydfX2FsbF9fJ10uY2FsbChzY29wZSwgZXZlbnROYW1lLCAuLi5hcmdzKTtcblx0fVxuXG5cdGlzRW1pdEFsbG93ZWQoc2NvcGUsIGV2ZW50TmFtZSwgLi4uYXJncykge1xuXHRcdGlmICh0aGlzLl9hbGxvd0VtaXRbZXZlbnROYW1lXSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2FsbG93RW1pdFtldmVudE5hbWVdLmNhbGwoc2NvcGUsIGV2ZW50TmFtZSwgLi4uYXJncyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX2FsbG93RW1pdFsnX19hbGxfXyddLmNhbGwoc2NvcGUsIGV2ZW50TmFtZSwgLi4uYXJncyk7XG5cdH1cblxuXHRpc1dyaXRlQWxsb3dlZChzY29wZSwgZXZlbnROYW1lLCBhcmdzKSB7XG5cdFx0aWYgKHRoaXMuX2FsbG93V3JpdGVbZXZlbnROYW1lXSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2FsbG93V3JpdGVbZXZlbnROYW1lXS5jYWxsKHNjb3BlLCBldmVudE5hbWUsIC4uLmFyZ3MpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9hbGxvd1dyaXRlWydfX2FsbF9fJ10uY2FsbChzY29wZSwgZXZlbnROYW1lLCAuLi5hcmdzKTtcblx0fVxuXG5cdGFkZFN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb24sIGV2ZW50TmFtZSkge1xuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHN1YnNjcmlwdGlvbik7XG5cblx0XHRpZiAoIXRoaXMuc3Vic2NyaXB0aW9uc0J5RXZlbnROYW1lW2V2ZW50TmFtZV0pIHtcblx0XHRcdHRoaXMuc3Vic2NyaXB0aW9uc0J5RXZlbnROYW1lW2V2ZW50TmFtZV0gPSBbXTtcblx0XHR9XG5cblx0XHR0aGlzLnN1YnNjcmlwdGlvbnNCeUV2ZW50TmFtZVtldmVudE5hbWVdLnB1c2goc3Vic2NyaXB0aW9uKTtcblx0fVxuXG5cdHJlbW92ZVN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb24sIGV2ZW50TmFtZSkge1xuXHRcdGNvbnN0IGluZGV4ID0gdGhpcy5zdWJzY3JpcHRpb25zLmluZGV4T2Yoc3Vic2NyaXB0aW9uKTtcblx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0dGhpcy5zdWJzY3JpcHRpb25zLnNwbGljZShpbmRleCwgMSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc3Vic2NyaXB0aW9uc0J5RXZlbnROYW1lW2V2ZW50TmFtZV0pIHtcblx0XHRcdGNvbnN0IGluZGV4ID0gdGhpcy5zdWJzY3JpcHRpb25zQnlFdmVudE5hbWVbZXZlbnROYW1lXS5pbmRleE9mKHN1YnNjcmlwdGlvbik7XG5cdFx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0XHR0aGlzLnN1YnNjcmlwdGlvbnNCeUV2ZW50TmFtZVtldmVudE5hbWVdLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0dHJhbnNmb3JtKGV2ZW50TmFtZSwgZm4pIHtcblx0XHRpZiAodHlwZW9mIGV2ZW50TmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Zm4gPSBldmVudE5hbWU7XG5cdFx0XHRldmVudE5hbWUgPSAnX19hbGxfXyc7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLnRyYW5zZm9ybWVyc1tldmVudE5hbWVdKSB7XG5cdFx0XHR0aGlzLnRyYW5zZm9ybWVyc1tldmVudE5hbWVdID0gW107XG5cdFx0fVxuXG5cdFx0dGhpcy50cmFuc2Zvcm1lcnNbZXZlbnROYW1lXS5wdXNoKGZuKTtcblx0fVxuXG5cdGFwcGx5VHJhbnNmb3JtZXJzKG1ldGhvZFNjb3BlLCBldmVudE5hbWUsIGFyZ3MpIHtcblx0XHRpZiAodGhpcy50cmFuc2Zvcm1lcnNbJ19fYWxsX18nXSkge1xuXHRcdFx0dGhpcy50cmFuc2Zvcm1lcnNbJ19fYWxsX18nXS5mb3JFYWNoKCh0cmFuc2Zvcm0pID0+IHtcblx0XHRcdFx0YXJncyA9IHRyYW5zZm9ybS5jYWxsKG1ldGhvZFNjb3BlLCBldmVudE5hbWUsIGFyZ3MpO1xuXHRcdFx0XHRtZXRob2RTY29wZS50cmFuZm9ybWVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KGFyZ3MpKSB7XG5cdFx0XHRcdFx0YXJncyA9IFthcmdzXTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMudHJhbnNmb3JtZXJzW2V2ZW50TmFtZV0pIHtcblx0XHRcdHRoaXMudHJhbnNmb3JtZXJzW2V2ZW50TmFtZV0uZm9yRWFjaCgodHJhbnNmb3JtKSA9PiB7XG5cdFx0XHRcdGFyZ3MgPSB0cmFuc2Zvcm0uY2FsbChtZXRob2RTY29wZSwgLi4uYXJncyk7XG5cdFx0XHRcdG1ldGhvZFNjb3BlLnRyYW5mb3JtZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkoYXJncykpIHtcblx0XHRcdFx0XHRhcmdzID0gW2FyZ3NdO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJncztcblx0fVxuXG5cdGluaVB1YmxpY2F0aW9uKCkge1xuXHRcdGNvbnN0IHN0cmVhbSA9IHRoaXM7XG5cdFx0TWV0ZW9yLnB1Ymxpc2godGhpcy5zdWJzY3JpcHRpb25OYW1lLCBmdW5jdGlvbihldmVudE5hbWUsIG9wdGlvbnMpIHtcblx0XHRcdGNoZWNrKGV2ZW50TmFtZSwgU3RyaW5nKTtcblx0XHRcdGNoZWNrKG9wdGlvbnMsIE1hdGNoLk9uZU9mKEJvb2xlYW4sIHtcblx0XHRcdFx0dXNlQ29sbGVjdGlvbjogQm9vbGVhbixcblx0XHRcdFx0YXJnczogQXJyYXksXG5cdFx0XHR9KSk7XG5cblx0XHRcdGxldCB1c2VDb2xsZWN0aW9uLCBhcmdzID0gW107XG5cblx0XHRcdGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHRcdHVzZUNvbGxlY3Rpb24gPSBvcHRpb25zO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKG9wdGlvbnMudXNlQ29sbGVjdGlvbikge1xuXHRcdFx0XHRcdHVzZUNvbGxlY3Rpb24gPSBvcHRpb25zLnVzZUNvbGxlY3Rpb247XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAob3B0aW9ucy5hcmdzKSB7XG5cdFx0XHRcdFx0YXJncyA9IG9wdGlvbnMuYXJncztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZXZlbnROYW1lLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHR0aGlzLnN0b3AoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc3RyZWFtLmlzUmVhZEFsbG93ZWQodGhpcywgZXZlbnROYW1lLCBhcmdzKSAhPT0gdHJ1ZSkge1xuXHRcdFx0XHR0aGlzLnN0b3AoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzdWJzY3JpcHRpb24gPSB7XG5cdFx0XHRcdHN1YnNjcmlwdGlvbjogdGhpcyxcblx0XHRcdFx0ZXZlbnROYW1lOiBldmVudE5hbWVcblx0XHRcdH07XG5cblx0XHRcdHN0cmVhbS5hZGRTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uLCBldmVudE5hbWUpO1xuXG5cdFx0XHR0aGlzLm9uU3RvcCgoKSA9PiB7XG5cdFx0XHRcdHN0cmVhbS5yZW1vdmVTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uLCBldmVudE5hbWUpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmICh1c2VDb2xsZWN0aW9uID09PSB0cnVlKSB7XG5cdFx0XHRcdC8vIENvbGxlY3Rpb24gY29tcGF0aWJpbGl0eVxuXHRcdFx0XHR0aGlzLl9zZXNzaW9uLnNlbmRBZGRlZChzdHJlYW0uc3Vic2NyaXB0aW9uTmFtZSwgJ2lkJywge1xuXHRcdFx0XHRcdGV2ZW50TmFtZTogZXZlbnROYW1lXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnJlYWR5KCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpbml0TWV0aG9kKCkge1xuXHRcdGNvbnN0IHN0cmVhbSA9IHRoaXM7XG5cdFx0Y29uc3QgbWV0aG9kID0ge307XG5cblx0XHRtZXRob2RbdGhpcy5zdWJzY3JpcHRpb25OYW1lXSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgLi4uYXJncykge1xuXHRcdFx0Y2hlY2soZXZlbnROYW1lLCBTdHJpbmcpO1xuXHRcdFx0Y2hlY2soYXJncywgQXJyYXkpO1xuXG5cdFx0XHR0aGlzLnVuYmxvY2soKTtcblxuXHRcdFx0aWYgKHN0cmVhbS5pc1dyaXRlQWxsb3dlZCh0aGlzLCBldmVudE5hbWUsIGFyZ3MpICE9PSB0cnVlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgbWV0aG9kU2NvcGUgPSB7XG5cdFx0XHRcdHVzZXJJZDogdGhpcy51c2VySWQsXG5cdFx0XHRcdGNvbm5lY3Rpb246IHRoaXMuY29ubmVjdGlvbixcblx0XHRcdFx0b3JpZ2luYWxQYXJhbXM6IGFyZ3MsXG5cdFx0XHRcdHRyYW5mb3JtZWQ6IGZhbHNlXG5cdFx0XHR9O1xuXG5cdFx0XHRhcmdzID0gc3RyZWFtLmFwcGx5VHJhbnNmb3JtZXJzKG1ldGhvZFNjb3BlLCBldmVudE5hbWUsIGFyZ3MpO1xuXG5cdFx0XHRzdHJlYW0uZW1pdFdpdGhTY29wZShldmVudE5hbWUsIG1ldGhvZFNjb3BlLCAuLi5hcmdzKTtcblxuXHRcdFx0aWYgKHN0cmVhbS5yZXRyYW5zbWl0ID09PSB0cnVlKSB7XG5cdFx0XHRcdHN0cmVhbS5fZW1pdChldmVudE5hbWUsIGFyZ3MsIHRoaXMuY29ubmVjdGlvbiwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHRyeSB7XG5cdFx0XHRNZXRlb3IubWV0aG9kcyhtZXRob2QpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0fVxuXHR9XG5cblx0X2VtaXQoZXZlbnROYW1lLCBhcmdzLCBvcmlnaW4sIGJyb2FkY2FzdCkge1xuXHRcdGlmIChicm9hZGNhc3QgPT09IHRydWUpIHtcblx0XHRcdE1ldGVvci5TdHJlYW1lckNlbnRyYWwuZW1pdCgnYnJvYWRjYXN0JywgdGhpcy5uYW1lLCBldmVudE5hbWUsIGFyZ3MpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLnN1YnNjcmlwdGlvbnNCeUV2ZW50TmFtZVtldmVudE5hbWVdO1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShzdWJzY3JpcHRpb25zKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHN1YnNjcmlwdGlvbnMuZm9yRWFjaCgoc3Vic2NyaXB0aW9uKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5yZXRyYW5zbWl0VG9TZWxmID09PSBmYWxzZSAmJiBvcmlnaW4gJiYgb3JpZ2luID09PSBzdWJzY3JpcHRpb24uc3Vic2NyaXB0aW9uLmNvbm5lY3Rpb24pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5pc0VtaXRBbGxvd2VkKHN1YnNjcmlwdGlvbi5zdWJzY3JpcHRpb24sIGV2ZW50TmFtZSwgLi4uYXJncykpIHtcblx0XHRcdFx0c3Vic2NyaXB0aW9uLnN1YnNjcmlwdGlvbi5fc2Vzc2lvbi5zZW5kQ2hhbmdlZCh0aGlzLnN1YnNjcmlwdGlvbk5hbWUsICdpZCcsIHtcblx0XHRcdFx0XHRldmVudE5hbWU6IGV2ZW50TmFtZSxcblx0XHRcdFx0XHRhcmdzOiBhcmdzXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZW1pdChldmVudE5hbWUsIC4uLmFyZ3MpIHtcblx0XHR0aGlzLl9lbWl0KGV2ZW50TmFtZSwgYXJncywgdW5kZWZpbmVkLCB0cnVlKTtcblx0fVxuXG5cdGVtaXRXaXRob3V0QnJvYWRjYXN0KGV2ZW50TmFtZSwgLi4uYXJncykge1xuXHRcdHRoaXMuX2VtaXQoZXZlbnROYW1lLCBhcmdzLCB1bmRlZmluZWQsIGZhbHNlKTtcblx0fVxufTtcbiJdfQ==
