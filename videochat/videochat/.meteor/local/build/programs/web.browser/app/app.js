var require = meteorInstall({"client":{"main.html":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// client/main.html                                                           //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
                                                                              //
module.link("./template.main.js", { "*": "*+" });

////////////////////////////////////////////////////////////////////////////////

},"template.main.js":function module(){

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// client/template.main.js                                                    //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
                                                                              //

Template.body.addContent((function() {
  var view = this;
  return [ HTML.NAV({
    class: "navbar navbar-inverse navbar-fixed-top"
  }, "\n    ", HTML.DIV({
    class: "container"
  }, "\n      ", HTML.Raw('<div class="navbar-header">\n        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">\n            <span class="sr-only">Toggle navigation</span>\n            <span class="icon-bar"></span>\n            <span class="icon-bar"></span>\n            <span class="icon-bar"></span>\n          </button>\n        <a class="navbar-brand" href="#">Meteor Video Chat</a>\n      </div>'), "\n      ", HTML.DIV({
    id: "navbar",
    class: "collapse navbar-collapse"
  }, "\n        ", HTML.UL({
    class: "nav navbar-nav"
  }, "\n          ", HTML.LI(Spacebars.include(view.lookupTemplate("loginButtons"))), "\n        "), "\n      "), "\n    "), "\n  "), "\n  ", HTML.DIV({
    class: "container"
  }, "\n    ", HTML.DIV({
    class: "app-body"
  }, "\n      ", Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return [ " ", Spacebars.include(view.lookupTemplate("dashboard")), " " ];
  }, function() {
    return [ "\n      ", HTML.H1("Please log in"), "\n      " ];
  }), "\n    "), "\n  ") ];
}));
Meteor.startup(Template.body.renderToDocument);

////////////////////////////////////////////////////////////////////////////////

},"main.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// client/main.js                                                             //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
                                                                              //
let Template;
module.link("meteor/templating", {
  Template(v) {
    Template = v;
  }

}, 0);
let ReactiveVar;
module.link("meteor/reactive-var", {
  ReactiveVar(v) {
    ReactiveVar = v;
  }

}, 1);
module.link("./main.html");
Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});
Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  }

});
Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  }

});
////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".css"
  ]
});

var exports = require("/client/main.js");