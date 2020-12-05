var require = meteorInstall({"imports":{"api":{"chat.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// imports/api/chat.js                                                               //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
module.export({
  Chats: () => Chats
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const Chats = new Mongo.Collection('chats');
///////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"main.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// server/main.js                                                                    //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Chats;
module.link("/imports/api/chat.js", {
  Chats(v) {
    Chats = v;
  }

}, 1);

const insertMessage = chatText => Chats.insert({
  text: chatText
});

Meteor.startup(() => {
  if (Chats.find().count() === 0) {
    ['1r missatge', 'Second msg', 'Third msg', 'Fourth msg'].forEach(insertMessage);
  }
});
///////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".ts",
    ".jsx",
    ".mjs"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvY2hhdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21haW4uanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwiQ2hhdHMiLCJNb25nbyIsImxpbmsiLCJ2IiwiQ29sbGVjdGlvbiIsIk1ldGVvciIsImluc2VydE1lc3NhZ2UiLCJjaGF0VGV4dCIsImluc2VydCIsInRleHQiLCJzdGFydHVwIiwiZmluZCIsImNvdW50IiwiZm9yRWFjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ0MsT0FBSyxFQUFDLE1BQUlBO0FBQVgsQ0FBZDtBQUFpQyxJQUFJQyxLQUFKO0FBQVVILE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0QsT0FBSyxDQUFDRSxDQUFELEVBQUc7QUFBQ0YsU0FBSyxHQUFDRSxDQUFOO0FBQVE7O0FBQWxCLENBQTNCLEVBQStDLENBQS9DO0FBRXBDLE1BQU1ILEtBQUssR0FBRyxJQUFJQyxLQUFLLENBQUNHLFVBQVYsQ0FBcUIsT0FBckIsQ0FBZCxDOzs7Ozs7Ozs7OztBQ0ZQLElBQUlDLE1BQUo7QUFBV1AsTUFBTSxDQUFDSSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUgsS0FBSjtBQUFVRixNQUFNLENBQUNJLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDRixPQUFLLENBQUNHLENBQUQsRUFBRztBQUFDSCxTQUFLLEdBQUNHLENBQU47QUFBUTs7QUFBbEIsQ0FBbkMsRUFBdUQsQ0FBdkQ7O0FBRzFFLE1BQU1HLGFBQWEsR0FBR0MsUUFBUSxJQUFJUCxLQUFLLENBQUNRLE1BQU4sQ0FBYTtBQUFFQyxNQUFJLEVBQUVGO0FBQVIsQ0FBYixDQUFsQzs7QUFFQUYsTUFBTSxDQUFDSyxPQUFQLENBQWUsTUFBTTtBQUNuQixNQUFJVixLQUFLLENBQUNXLElBQU4sR0FBYUMsS0FBYixPQUF5QixDQUE3QixFQUFnQztBQUM5QixLQUNFLGFBREYsRUFFRSxZQUZGLEVBR0UsV0FIRixFQUlFLFlBSkYsRUFLRUMsT0FMRixDQUtVUCxhQUxWO0FBTUQ7QUFDRixDQVRELEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbiBcbmV4cG9ydCBjb25zdCBDaGF0cyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdjaGF0cycpOyIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgQ2hhdHMgfSBmcm9tICcvaW1wb3J0cy9hcGkvY2hhdC5qcyc7XG5cbmNvbnN0IGluc2VydE1lc3NhZ2UgPSBjaGF0VGV4dCA9PiBDaGF0cy5pbnNlcnQoeyB0ZXh0OiBjaGF0VGV4dCB9KTtcbiBcbk1ldGVvci5zdGFydHVwKCgpID0+IHtcbiAgaWYgKENoYXRzLmZpbmQoKS5jb3VudCgpID09PSAwKSB7XG4gICAgW1xuICAgICAgJzFyIG1pc3NhdGdlJyxcbiAgICAgICdTZWNvbmQgbXNnJyxcbiAgICAgICdUaGlyZCBtc2cnLFxuICAgICAgJ0ZvdXJ0aCBtc2cnXG4gICAgXS5mb3JFYWNoKGluc2VydE1lc3NhZ2UpXG4gIH1cbn0pOyJdfQ==
