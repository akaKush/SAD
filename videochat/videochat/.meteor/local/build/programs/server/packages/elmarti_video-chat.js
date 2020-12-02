(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Streamer = Package['rocketchat:streamer'].Streamer;
var UserStatus = Package['mizzao:user-status'].UserStatus;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"elmarti:video-chat":{"lib":{"publish.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/elmarti_video-chat/lib/publish.js                              //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let CallLog;
module.link("./call_log", {
  default(v) {
    CallLog = v;
  }

}, 1);
Meteor.publish('VideoChatPublication', function () {
  return CallLog.find({
    $or: [{
      caller: this.userId,
      status: "NEW"
    }, {
      target: this.userId,
      status: "NEW"
    }, {
      callerConnectionId: this.connection.id,
      status: "ACCEPTED"
    }, {
      targetConnectionId: this.connection.id,
      status: "ACCEPTED"
    }, {
      targetConnectionId: this.connection.id,
      status: "REJECTED"
    }, {
      callerConnectionId: this.connection.id,
      status: "REJECTED"
    }, {
      callerConnectionId: this.connection.id,
      status: "CONNECTED"
    }, {
      targetConnectionId: this.connection.id,
      status: "CONNECTED"
    }, {
      callerConnectionId: this.connection.id,
      status: "FINISHED"
    }, {
      targetConnectionId: this.connection.id,
      status: "FINISHED"
    }]
  });
});
/////////////////////////////////////////////////////////////////////////////

},"index.server.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/elmarti_video-chat/lib/index.server.js                         //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Services;
module.link("./server", {
  Services(v) {
    Services = v;
  }

}, 1);
let CallLog;
module.link("./call_log", {
  default(v) {
    CallLog = v;
  }

}, 2);
Meteor.users.find({
  "status.online": true
}).observe({
  removed: function (_ref) {
    let {
      _id
    } = _ref;
    CallLog.find({
      $or: [{
        status: {
          $ne: 'FINISHED'
        },
        target: _id
      }, {
        status: {
          $ne: 'FINISHED'
        },
        caller: _id
      }]
    }).forEach(call => CallLog.update({
      _id: call._id
    }, {
      $set: {
        status: 'FINISHED'
      }
    }));
  }
});
Meteor.methods({
  'VideoCallServices/call': Services.call,
  'VideoCallServices/answer': Services.answer,
  'VideoCallServices/end': Services.end,
  'VideoCallServices/reject': Services.reject,
  'VideoCallServices/ackReject': Services.ackReject
});
/////////////////////////////////////////////////////////////////////////////

},"server.interface.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/elmarti_video-chat/lib/server.interface.js                     //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
module.export({
  VideoCallServices: () => VideoCallServices
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Services;
module.link("./server", {
  Services(v) {
    Services = v;
  }

}, 1);
const VideoCallServices = {
  checkConnect(callback) {
    Services.setCheckConnect(callback);
  },

  setOnError(callback) {
    Services.setOnError(callback);
  }

};
Meteor.VideoCallServices = VideoCallServices;
/////////////////////////////////////////////////////////////////////////////

},"call_log.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/elmarti_video-chat/lib/call_log.js                             //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
module.exportDefault(new Meteor.Collection("VideoChatCallLog"));
/////////////////////////////////////////////////////////////////////////////

},"server.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/elmarti_video-chat/lib/server.js                               //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
module.export({
  Services: () => Services
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let check, Match;
module.link("meteor/check", {
  check(v) {
    check = v;
  },

  Match(v) {
    Match = v;
  }

}, 1);
let CallLog;
module.link("./call_log", {
  default(v) {
    CallLog = v;
  }

}, 2);
const streams = {};
const Services = {
  setOnError(callback) {
    this.onError = callback;
  },

  onError() {},

  destroyOldCalls(meteorUser) {
    CallLog.update({
      $or: [{
        status: {
          $ne: "FINISHED"
        },
        caller: meteorUser._id
      }, {
        status: {
          $ne: "FINISHED"
        },
        target: meteorUser._id
      }]
    }, {
      $set: {
        status: "FINISHED"
      }
    });
  },

  initializeCallSession(_id, meteorUser) {
    Services.destroyOldCalls(meteorUser);
    const logId = CallLog.insert({
      status: "NEW",
      target: _id,
      caller: meteorUser._id,
      callerConnectionId: this.connection.id
    });
    streams[logId] = new Meteor.Streamer(logId);
    streams[logId].allowRead('all');
    streams[logId].allowWrite('all');
    return logId;
  },

  getUser() {
    const meteorUser = Meteor.user();

    if (!meteorUser) {
      const err = new Meteor.Error(403, "USER_NOT_LOGGED_IN");
      this.onError(err);
      throw err;
    }

    return meteorUser;
  },

  /**
   * Call allows you to call a remote user using their userId
   * @param _id {string}
   */
  call(_id, idk) {
    check(_id, String); //Asteroid sends null as a second param

    check(idk, Match.Maybe(null));
    const meteorUser = Services.getUser();

    if (Services.checkConnect(meteorUser._id, _id)) {
      const inCall = CallLog.findOne({
        status: "CONNECTED",
        target: _id
      });

      if (inCall) {
        const err = new Meteor.Error(500, "TARGET_IN_CALL", inCall);
        this.onError(err, inCall, Meteor.userId());
        throw err;
      } else {
        return Services.initializeCallSession.call(this, _id, meteorUser);
      }
    } else {
      Services.connectionNotAllowed(_id, meteorUser);
    }
  },

  connectionNotAllowed(_id, meteorUser) {
    throw new Meteor.Error(403, "CONNECTION_NOT_ALLOWED", {
      target: meteorUser._id,
      caller: _id
    });
  },

  setCheckConnect(callback) {
    this.checkConnect = callback;
  },

  /**
   * Check if call connection should be permitted
   * @param _id {caller}
   * @param _id {target}
   * @returns boolean
   */
  checkConnect(caller, target) {
    return true;
  },

  /**
   * Answer current phone call
   */
  answer() {
    const user = Services.getUser();
    const session = CallLog.findOne({
      target: user._id,
      status: 'NEW'
    });

    if (!session) {
      const err = new Meteor.Error(500, 'SESSION_NOT_FOUND', {
        target: user._id
      });
      this.onError(err, undefined, user);
      throw err;
    } else {
      CallLog.update({
        _id: session._id
      }, {
        $set: {
          targetConnectionId: this.connection.id,
          status: 'ACCEPTED'
        }
      });
    }
  },

  /**
   * End current phone call
   */
  end() {
    const _id = Meteor.userId();

    CallLog.find({
      $or: [{
        status: {
          $ne: 'FINISHED'
        },
        target: _id
      }, {
        status: {
          $ne: 'FINISHED'
        },
        caller: _id
      }]
    }).forEach(call => CallLog.update({
      _id: call._id
    }, {
      $set: {
        status: 'FINISHED'
      }
    }));
  },

  ackReject(id) {
    check(id, String);
    CallLog.update({
      _id: id,
      caller: Meteor.userId()
    }, {
      $set: {
        status: "FINISHED"
      }
    });
  },

  reject() {
    const user = Meteor.user();

    if (user) {
      CallLog.update({
        target: user._id,
        status: 'NEW'
      }, {
        $set: {
          status: "REJECTED"
        }
      });
    } else {
      const newErr = new Meteor.Error(403, "Could not find user");
      this.onError(newErr);
      throw newErr;
    }
  }

};
/////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/elmarti:video-chat/lib/publish.js");
require("/node_modules/meteor/elmarti:video-chat/lib/index.server.js");
var exports = require("/node_modules/meteor/elmarti:video-chat/lib/server.interface.js");

/* Exports */
Package._define("elmarti:video-chat", exports);

})();

//# sourceURL=meteor://💻app/packages/elmarti_video-chat.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZWxtYXJ0aTp2aWRlby1jaGF0L2xpYi9wdWJsaXNoLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbG1hcnRpOnZpZGVvLWNoYXQvbGliL2luZGV4LnNlcnZlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZWxtYXJ0aTp2aWRlby1jaGF0L2xpYi9zZXJ2ZXIuaW50ZXJmYWNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbG1hcnRpOnZpZGVvLWNoYXQvbGliL2NhbGxfbG9nLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbG1hcnRpOnZpZGVvLWNoYXQvbGliL3NlcnZlci5qcyJdLCJuYW1lcyI6WyJNZXRlb3IiLCJtb2R1bGUiLCJsaW5rIiwidiIsIkNhbGxMb2ciLCJkZWZhdWx0IiwicHVibGlzaCIsImZpbmQiLCIkb3IiLCJjYWxsZXIiLCJ1c2VySWQiLCJzdGF0dXMiLCJ0YXJnZXQiLCJjYWxsZXJDb25uZWN0aW9uSWQiLCJjb25uZWN0aW9uIiwiaWQiLCJ0YXJnZXRDb25uZWN0aW9uSWQiLCJTZXJ2aWNlcyIsInVzZXJzIiwib2JzZXJ2ZSIsInJlbW92ZWQiLCJfaWQiLCIkbmUiLCJmb3JFYWNoIiwiY2FsbCIsInVwZGF0ZSIsIiRzZXQiLCJtZXRob2RzIiwiYW5zd2VyIiwiZW5kIiwicmVqZWN0IiwiYWNrUmVqZWN0IiwiZXhwb3J0IiwiVmlkZW9DYWxsU2VydmljZXMiLCJjaGVja0Nvbm5lY3QiLCJjYWxsYmFjayIsInNldENoZWNrQ29ubmVjdCIsInNldE9uRXJyb3IiLCJleHBvcnREZWZhdWx0IiwiQ29sbGVjdGlvbiIsImNoZWNrIiwiTWF0Y2giLCJzdHJlYW1zIiwib25FcnJvciIsImRlc3Ryb3lPbGRDYWxscyIsIm1ldGVvclVzZXIiLCJpbml0aWFsaXplQ2FsbFNlc3Npb24iLCJsb2dJZCIsImluc2VydCIsIlN0cmVhbWVyIiwiYWxsb3dSZWFkIiwiYWxsb3dXcml0ZSIsImdldFVzZXIiLCJ1c2VyIiwiZXJyIiwiRXJyb3IiLCJpZGsiLCJTdHJpbmciLCJNYXliZSIsImluQ2FsbCIsImZpbmRPbmUiLCJjb25uZWN0aW9uTm90QWxsb3dlZCIsInNlc3Npb24iLCJ1bmRlZmluZWQiLCJuZXdFcnIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUMsT0FBSjtBQUFZSCxNQUFNLENBQUNDLElBQVAsQ0FBWSxZQUFaLEVBQXlCO0FBQUNHLFNBQU8sQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNDLFdBQU8sR0FBQ0QsQ0FBUjtBQUFVOztBQUF0QixDQUF6QixFQUFpRCxDQUFqRDtBQUU1RUgsTUFBTSxDQUFDTSxPQUFQLENBQWUsc0JBQWYsRUFBdUMsWUFBVztBQUM5QyxTQUFPRixPQUFPLENBQUNHLElBQVIsQ0FBYTtBQUNoQkMsT0FBRyxFQUFFLENBQUM7QUFDRkMsWUFBTSxFQUFFLEtBQUtDLE1BRFg7QUFFRkMsWUFBTSxFQUFFO0FBRk4sS0FBRCxFQUdGO0FBQ0NDLFlBQU0sRUFBRSxLQUFLRixNQURkO0FBRUNDLFlBQU0sRUFBRTtBQUZULEtBSEUsRUFNRjtBQUNDRSx3QkFBa0IsRUFBRSxLQUFLQyxVQUFMLENBQWdCQyxFQURyQztBQUVDSixZQUFNLEVBQUU7QUFGVCxLQU5FLEVBU0Y7QUFDQ0ssd0JBQWtCLEVBQUUsS0FBS0YsVUFBTCxDQUFnQkMsRUFEckM7QUFFQ0osWUFBTSxFQUFFO0FBRlQsS0FURSxFQVlGO0FBQ0NLLHdCQUFrQixFQUFFLEtBQUtGLFVBQUwsQ0FBZ0JDLEVBRHJDO0FBRUNKLFlBQU0sRUFBRTtBQUZULEtBWkUsRUFlRjtBQUNDRSx3QkFBa0IsRUFBRSxLQUFL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RE07QUFFWE4sWUFBTSxFQUFFVCxNQUFNLENBQUNVLE1BQVA7QUFGRyxLQUFmLEVBR0c7QUFDQ2dCLFVBQUksRUFBRTtBQUNGZixjQUFNLEVBQUU7QUFETjtBQURQLEtBSEg7QUFRSCxHQS9KWTs7QUFnS2JtQixRQUFNLEdBQUc7QUFDTCxVQUFNdUIsSUFBSSxHQUFHckQsTUFBTSxDQUFDcUQsSUFBUCxFQUFiOztBQUNBLFFBQUlBLElBQUosRUFBVTtBQUNOakQsYUFBTyxDQUFDcUIsTUFBUixDQUFlO0FBQ1hiLGNBQU0sRUFBRXlDLElBQUksQ0FBQ2hDLEdBREY7QUFFWFYsY0FBTSxFQUFFO0FBRkcsT0FBZixFQUdHO0FBQ0NlLFlBQUksRUFBRTtBQUNGZixnQkFBTSxFQUFFO0FBRE47QUFEUCxPQUhIO0FBUUgsS0FURCxNQVVLO0FBQ0QsWUFBTXFELE1BQU0sR0FBRyxJQUFJaEUsTUFBTSxDQUFDdUQsS0FBWCxDQUFpQixHQUFqQixFQUFzQixxQkFBdEIsQ0FBZjtBQUNBLFdBQUtaLE9BQUwsQ0FBYXFCLE1BQWI7QUFDQSxZQUFNQSxNQUFOO0FBQ0g7QUFDSjs7QUFqTFksQ0FBakIsQyIsImZpbGUiOiIvcGFja2FnZXMvZWxtYXJ0aV92aWRlby1jaGF0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgQ2FsbExvZyBmcm9tICcuL2NhbGxfbG9nJztcbk1ldGVvci5wdWJsaXNoKCdWaWRlb0NoYXRQdWJsaWNhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBDYWxsTG9nLmZpbmQoe1xuICAgICAgICAkb3I6IFt7XG4gICAgICAgICAgICBjYWxsZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgc3RhdHVzOiBcIk5FV1wiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy51c2VySWQsXG4gICAgICAgICAgICBzdGF0dXM6IFwiTkVXXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2FsbGVyQ29ubmVjdGlvbklkOiB0aGlzLmNvbm5lY3Rpb24uaWQsXG4gICAgICAgICAgICBzdGF0dXM6IFwiQUNDRVBURURcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0YXJnZXRDb25uZWN0aW9uSWQ6IHRoaXMuY29ubmVjdGlvbi5pZCxcbiAgICAgICAgICAgIHN0YXR1czogXCJBQ0NFUFRFRFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHRhcmdldENvbm5lY3Rpb25JZDogdGhpcy5jb25uZWN0aW9uLmlkLFxuICAgICAgICAgICAgc3RhdHVzOiBcIlJFSkVDVEVEXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2FsbGVyQ29ubmVjdGlvbklkOiB0aGlzLmNvbm5lY3Rpb24uaWQsXG4gICAgICAgICAgICBzdGF0dXM6IFwiUkVKRUNURURcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjYWxsZXJDb25uZWN0aW9uSWQ6IHRoaXMuY29ubmVjdGlvbi5pZCxcbiAgICAgICAgICAgIHN0YXR1czogXCJDT05ORUNURURcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0YXJnZXRDb25uZWN0aW9uSWQ6IHRoaXMuY29ubmVjdGlvbi5pZCxcbiAgICAgICAgICAgIHN0YXR1czogXCJDT05ORUNURURcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjYWxsZXJDb25uZWN0aW9uSWQ6IHRoaXMuY29ubmVjdGlvbi5pZCxcbiAgICAgICAgICAgIHN0YXR1czogXCJGSU5JU0hFRFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHRhcmdldENvbm5lY3Rpb25JZDogdGhpcy5jb25uZWN0aW9uLmlkLFxuICAgICAgICAgICAgc3RhdHVzOiBcIkZJTklTSEVEXCJcbiAgICAgICAgfV1cbiAgICB9KTtcbn0pO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge1NlcnZpY2VzfSBmcm9tICcuL3NlcnZlcic7XG5cbmltcG9ydCBDYWxsTG9nIGZyb20gJy4vY2FsbF9sb2cnO1xuXG5cbk1ldGVvci51c2Vycy5maW5kKHtcInN0YXR1cy5vbmxpbmVcIjogdHJ1ZX0pLm9ic2VydmUoe1xuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uICh7X2lkfSkge1xuICAgICAgICBDYWxsTG9nLmZpbmQoe1xuICAgICAgICAgICAgJG9yOiBbe1xuICAgICAgICAgICAgICAgIHN0YXR1czoge1xuICAgICAgICAgICAgICAgICAgICAkbmU6ICdGSU5JU0hFRCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRhcmdldDogX2lkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiB7XG4gICAgICAgICAgICAgICAgICAgICRuZTogJ0ZJTklTSEVEJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2FsbGVyOiBfaWRcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pLmZvckVhY2goY2FsbCA9PlxuICAgICAgICAgICAgQ2FsbExvZy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIF9pZDogY2FsbC5faWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ0ZJTklTSEVEJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICB9XG59KTtcbk1ldGVvci5tZXRob2RzKHtcbiAgICAnVmlkZW9DYWxsU2VydmljZXMvY2FsbCc6IFNlcnZpY2VzLmNhbGwsXG4gICAgJ1ZpZGVvQ2FsbFNlcnZpY2VzL2Fuc3dlcic6IFNlcnZpY2VzLmFuc3dlcixcbiAgICAnVmlkZW9DYWxsU2VydmljZXMvZW5kJzogU2VydmljZXMuZW5kLFxuICAgICdWaWRlb0NhbGxTZXJ2aWNlcy9yZWplY3QnOiBTZXJ2aWNlcy5yZWplY3QsXG4gICAgJ1ZpZGVvQ2FsbFNlcnZpY2VzL2Fja1JlamVjdCc6IFNlcnZpY2VzLmFja1JlamVjdFxufSk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFNlcnZpY2VzIH0gZnJvbSAnLi9zZXJ2ZXInO1xuXG5jb25zdCBWaWRlb0NhbGxTZXJ2aWNlcyA9IHtcbiAgY2hlY2tDb25uZWN0KGNhbGxiYWNrKXtcbiAgICAgIFNlcnZpY2VzLnNldENoZWNrQ29ubmVjdChjYWxsYmFjayk7XG4gIH0sXG4gIHNldE9uRXJyb3IoY2FsbGJhY2spe1xuICAgICAgU2VydmljZXMuc2V0T25FcnJvcihjYWxsYmFjayk7XG4gIH1cbn07XG5NZXRlb3IuVmlkZW9DYWxsU2VydmljZXMgPSBWaWRlb0NhbGxTZXJ2aWNlcztcbmV4cG9ydCB7XG4gICAgVmlkZW9DYWxsU2VydmljZXNcbn07IiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBNZXRlb3IuQ29sbGVjdGlvbihcIlZpZGVvQ2hhdENhbGxMb2dcIik7IiwiLy9qc2hpbnQgZXN2ZXJzaW9uOiA2XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IGNoZWNrLCBNYXRjaCB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQgQ2FsbExvZyBmcm9tICcuL2NhbGxfbG9nJztcblxuY29uc3Qgc3RyZWFtcyA9IHt9O1xuY29uc3QgU2VydmljZXMgPSB7XG4gICAgc2V0T25FcnJvcihjYWxsYmFjayl7XG4gICAgICAgIHRoaXMub25FcnJvciA9IGNhbGxiYWNrOyBcbiAgICB9LFxuICAgIG9uRXJyb3IoKXtcbiAgICAgICAgXG4gICAgfSxcbiAgICBkZXN0cm95T2xkQ2FsbHMobWV0ZW9yVXNlcikge1xuICAgICAgICBDYWxsTG9nLnVwZGF0ZSh7XG4gICAgICAgICAgICAkb3I6IFt7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiB7XG4gICAgICAgICAgICAgICAgICAgICRuZTogXCJGSU5JU0hFRFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjYWxsZXI6IG1ldGVvclVzZXIuX2lkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiB7XG4gICAgICAgICAgICAgICAgICAgICRuZTogXCJGSU5JU0hFRFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IG1ldGVvclVzZXIuX2lkXG4gICAgICAgICAgICB9XVxuXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFwiRklOSVNIRURcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGluaXRpYWxpemVDYWxsU2Vzc2lvbihfaWQsIG1ldGVvclVzZXIpIHtcbiAgICAgICAgU2VydmljZXMuZGVzdHJveU9sZENhbGxzKG1ldGVvclVzZXIpO1xuICAgICAgICBjb25zdCBsb2dJZCA9IENhbGxMb2cuaW5zZXJ0KHtcbiAgICAgICAgICAgIHN0YXR1czogXCJORVdcIixcbiAgICAgICAgICAgIHRhcmdldDogX2lkLFxuICAgICAgICAgICAgY2FsbGVyOiBtZXRlb3JVc2VyLl9pZCxcbiAgICAgICAgICAgIGNhbGxlckNvbm5lY3Rpb25JZDogdGhpcy5jb25uZWN0aW9uLmlkXG4gICAgICAgIH0pO1xuICAgICAgICBzdHJlYW1zW2xvZ0lkXSA9IG5ldyBNZXRlb3IuU3RyZWFtZXIobG9nSWQpO1xuICAgICAgICBzdHJlYW1zW2xvZ0lkXS5hbGxvd1JlYWQoJ2FsbCcpO1xuICAgICAgICBzdHJlYW1zW2xvZ0lkXS5hbGxvd1dyaXRlKCdhbGwnKTtcbiAgICAgICAgcmV0dXJuIGxvZ0lkO1xuICAgIH0sXG4gICAgZ2V0VXNlcigpe1xuICAgICAgICBjb25zdCBtZXRlb3JVc2VyID0gTWV0ZW9yLnVzZXIoKTtcbiAgICAgICAgaWYgKCFtZXRlb3JVc2VyKSB7XG4gICAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJVU0VSX05PVF9MT0dHRURfSU5cIik7XG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IoZXJyKTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0ZW9yVXNlcjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIENhbGwgYWxsb3dzIHlvdSB0byBjYWxsIGEgcmVtb3RlIHVzZXIgdXNpbmcgdGhlaXIgdXNlcklkXG4gICAgICogQHBhcmFtIF9pZCB7c3RyaW5nfVxuICAgICAqL1xuICAgIGNhbGwoX2lkLCBpZGspIHtcbiAgICAgICAgY2hlY2soX2lkLCBTdHJpbmcpO1xuICAgICAgICAvL0FzdGVyb2lkIHNlbmRzIG51bGwgYXMgYSBzZWNvbmQgcGFyYW1cbiAgICAgICAgY2hlY2soaWRrLCBNYXRjaC5NYXliZShudWxsKSk7XG4gICAgICAgIGNvbnN0IG1ldGVvclVzZXIgPSBTZXJ2aWNlcy5nZXRVc2VyKCk7XG4gICAgICAgIGlmIChTZXJ2aWNlcy5jaGVja0Nvbm5lY3QobWV0ZW9yVXNlci5faWQsIF9pZCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGluQ2FsbCA9IENhbGxMb2cuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcIkNPTk5FQ1RFRFwiLFxuICAgICAgICAgICAgICAgIHRhcmdldDogX2lkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChpbkNhbGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJUQVJHRVRfSU5fQ0FMTFwiLCBpbkNhbGwpO1xuICAgICAgICAgICAgICAgIHRoaXMub25FcnJvcihlcnIsIGluQ2FsbCwgTWV0ZW9yLnVzZXJJZCgpKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU2VydmljZXMuaW5pdGlhbGl6ZUNhbGxTZXNzaW9uLmNhbGwodGhpcywgX2lkLCBtZXRlb3JVc2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFNlcnZpY2VzLmNvbm5lY3Rpb25Ob3RBbGxvd2VkKF9pZCwgbWV0ZW9yVXNlcik7XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgY29ubmVjdGlvbk5vdEFsbG93ZWQoX2lkLCBtZXRlb3JVc2VyKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkNPTk5FQ1RJT05fTk9UX0FMTE9XRURcIiwge1xuICAgICAgICAgICAgdGFyZ2V0OiBtZXRlb3JVc2VyLl9pZCxcbiAgICAgICAgICAgIGNhbGxlcjogX2lkXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgc2V0Q2hlY2tDb25uZWN0KGNhbGxiYWNrKXtcbiAgICAgICAgdGhpcy5jaGVja0Nvbm5lY3QgPSBjYWxsYmFjazsgXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBjYWxsIGNvbm5lY3Rpb24gc2hvdWxkIGJlIHBlcm1pdHRlZFxuICAgICAqIEBwYXJhbSBfaWQge2NhbGxlcn1cbiAgICAgKiBAcGFyYW0gX2lkIHt0YXJnZXR9XG4gICAgICogQHJldHVybnMgYm9vbGVhblxuICAgICAqL1xuICAgIGNoZWNrQ29ubmVjdChjYWxsZXIsIHRhcmdldCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFuc3dlciBjdXJyZW50IHBob25lIGNhbGxcbiAgICAgKi9cbiAgICBhbnN3ZXIoKSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSBTZXJ2aWNlcy5nZXRVc2VyKCk7XG4gICAgICAgIGNvbnN0IHNlc3Npb24gPSBDYWxsTG9nLmZpbmRPbmUoe1xuICAgICAgICAgICAgdGFyZ2V0OiB1c2VyLl9pZCxcbiAgICAgICAgICAgIHN0YXR1czogJ05FVydcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghc2Vzc2lvbikge1xuICAgICAgICAgICAgY29uc3QgZXJyID0gbmV3IE1ldGVvci5FcnJvcig1MDAsICdTRVNTSU9OX05PVF9GT1VORCcsIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHVzZXIuX2lkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMub25FcnJvcihlcnIsIHVuZGVmaW5lZCwgdXNlcik7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIENhbGxMb2cudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBfaWQ6IHNlc3Npb24uX2lkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRDb25uZWN0aW9uSWQ6IHRoaXMuY29ubmVjdGlvbi5pZCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnQUNDRVBURUQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEVuZCBjdXJyZW50IHBob25lIGNhbGxcbiAgICAgKi9cbiAgICBlbmQoKSB7XG4gICAgICAgIGNvbnN0IF9pZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICAgICAgQ2FsbExvZy5maW5kKHtcbiAgICAgICAgICAgICRvcjogW3tcbiAgICAgICAgICAgICAgICBzdGF0dXM6IHtcbiAgICAgICAgICAgICAgICAgICAgJG5lOiAnRklOSVNIRUQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IF9pZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHN0YXR1czoge1xuICAgICAgICAgICAgICAgICAgICAkbmU6ICdGSU5JU0hFRCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNhbGxlcjogX2lkXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KS5mb3JFYWNoKGNhbGwgPT5cbiAgICAgICAgICAgIENhbGxMb2cudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBfaWQ6IGNhbGwuX2lkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdGSU5JU0hFRCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgfSxcbiAgICBhY2tSZWplY3QoaWQpe1xuICAgICAgICBjaGVjayhpZCwgU3RyaW5nKVxuICAgICAgICBDYWxsTG9nLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGlkLFxuICAgICAgICAgICAgY2FsbGVyOiBNZXRlb3IudXNlcklkKClcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJGSU5JU0hFRFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVqZWN0KCkge1xuICAgICAgICBjb25zdCB1c2VyID0gTWV0ZW9yLnVzZXIoKTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgIENhbGxMb2cudXBkYXRlKHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHVzZXIuX2lkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogJ05FVydcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogXCJSRUpFQ1RFRFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBuZXdFcnIgPSBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJDb3VsZCBub3QgZmluZCB1c2VyXCIpO1xuICAgICAgICAgICAgdGhpcy5vbkVycm9yKG5ld0Vycik7XG4gICAgICAgICAgICB0aHJvdyBuZXdFcnI7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5leHBvcnQge1xuICAgIFNlcnZpY2VzXG59O1xuIl19
