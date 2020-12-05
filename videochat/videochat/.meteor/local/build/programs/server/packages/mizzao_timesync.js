(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;

(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/mizzao_timesync/timesync-server.js                                  //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
// Use rawConnectHandlers so we get a response as quickly as possible
// https://github.com/meteor/meteor/blob/devel/packages/webapp/webapp_server.js

WebApp.rawConnectHandlers.use("/_timesync",
  function(req, res, next) {
    // Never ever cache this, otherwise weird times are shown on reload
    // http://stackoverflow.com/q/18811286/586086
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", 0);

    // Avoid MIME type warnings in browsers
    res.setHeader("Content-Type", "text/plain");

    // Cordova lives in meteor.local, so it does CORS
    if (req.headers && req.headers.origin === 'http://meteor.local') {
      res.setHeader('Access-Control-Allow-Origin', 'http://meteor.local');
    }

    res.end(Date.now().toString());
  }
);

//////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("mizzao:timesync");

})();