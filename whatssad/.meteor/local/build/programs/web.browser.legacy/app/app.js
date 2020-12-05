var require = meteorInstall({"imports":{"ui":{"Components":{"MsgCont.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// imports/ui/Components/MsgCont.jsx                                                                   //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);

var MsgCont = function (props) {
  var userImgStyle = {
    background: "url(\"/img/45e89450-4ca0-11ea-bdf9-989fc1b2f847.jpg\") center / cover no-repeat"
  };
  var whatsBG = {
    background: "url(\"/img/whatsbg.jpg\") center / cover no-repeat"
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "msg-cont"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-row justify-content-between user-cont-msgs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-row align-content-center current-user-data-cont"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "user-image",
    style: userImgStyle
  })), /*#__PURE__*/React.createElement("span", {
    className: "d-flex align-items-center fin-user-name"
  }, "UserName")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-row justify-content-around right-msg-cont"
  }, /*#__PURE__*/React.createElement("img", {
    className: "top-svg",
    src: "img/svgexport-11.png"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-door-open dor-icon"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "msg-cont-fin",
    style: whatsBG
  }, /*#__PURE__*/React.createElement("div", {
    className: "own-msg-cont"
  }, /*#__PURE__*/React.createElement("span", {
    className: "msg"
  }, "Text Number one")), /*#__PURE__*/React.createElement("div", {
    className: "own-msg-cont-l"
  }, /*#__PURE__*/React.createElement("span", {
    className: "msg-l"
  }, "Text Number one"))), /*#__PURE__*/React.createElement("div", {
    className: "msg-input-cont"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-row justify-content-around left-icon-cont"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/img/svgexport-17.png"
  }), /*#__PURE__*/React.createElement("img", {
    src: "/img/svgexport-20.png"
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center align-items-center msg-final-input"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "msg-input"
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-row justify-content-around left-icon-cont"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/img/svgexport-21.png"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-video"
  }))));
};

module.exportDefault(MsgCont);
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Sidebar.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// imports/ui/Components/Sidebar.jsx                                                                   //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);

var Sidebar = function (props) {
  var users = [{
    _id: 231243242,
    name: "Jordi Parra",
    chat_id: 22234234
  }, {
    _id: 231243243,
    name: "Jordi Parra",
    chat_id: 22234234
  }, {
    _id: 231243244,
    name: "Jordi Parra",
    chat_id: 22234234
  }, {
    _id: 231243245,
    name: "Jordi Parra",
    chat_id: 22234234
  }];
  var userImgStyle = {
    background: "url(\"/img/45e89450-4ca0-11ea-bdf9-989fc1b2f847.jpg\") center / cover no-repeat"
  };
  var usersSidebar = users.length ? users.map(function (user) {
    return /*#__PURE__*/React.createElement("div", {
      className: "user-chat-sidebar",
      key: user._id
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-row justify-content-between topcontaine"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "user-image",
      style: userImgStyle
    })), /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-row use-conta-side align-items-center "
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-row  top-sidebar-user end"
    }, /*#__PURE__*/React.createElement("span", {
      className: "user-name"
    }, user.name)))));
  }) : /*#__PURE__*/React.createElement("span", null, "No contact yes");
  return /*#__PURE__*/React.createElement("div", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-row justify-content-between topcontainer"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "user-image",
    style: userImgStyle
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-row justify-content-around right-topcont"
  }, /*#__PURE__*/React.createElement("img", {
    className: "top-svg",
    src: "/img/svgexport-2.png"
  }), /*#__PURE__*/React.createElement("img", {
    className: "top-svg",
    src: "/img/svgexport-3.png"
  }), /*#__PURE__*/React.createElement("img", {
    className: "top-svg",
    src: "/img/svgexport-4.png"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "side-search-cont"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-input-div"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center align-items-center"
  }, /*#__PURE__*/React.createElement("img", {
    id: "search-img",
    src: "/img/svgexport-11.png"
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "search-input"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "user-container"
  }, usersSidebar));
};

module.exportDefault(Sidebar);
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"Views":{"Chat.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// imports/ui/Views/Chat.jsx                                                                           //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var _regeneratorRuntime;

module.link("@babel/runtime/regenerator", {
  default: function (v) {
    _regeneratorRuntime = v;
  }
}, 0);

var _slicedToArray;

module.link("@babel/runtime/helpers/slicedToArray", {
  default: function (v) {
    _slicedToArray = v;
  }
}, 1);
module.export({
  useUserMedia: function () {
    return useUserMedia;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Sidebar;
module.link("../Components/Sidebar", {
  "default": function (v) {
    Sidebar = v;
  }
}, 1);
var MsgCont;
module.link("../Components/MsgCont", {
  "default": function (v) {
    MsgCont = v;
  }
}, 2);
var useState, useEffect;
module.link("react", {
  useState: function (v) {
    useState = v;
  },
  useEffect: function (v) {
    useEffect = v;
  }
}, 3);

function useUserMedia(requestedMedia) {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      mediaStream = _useState2[0],
      setMediaStream = _useState2[1];

  useEffect(function () {
    function enableStream() {
      var stream;
      return _regeneratorRuntime.async(function () {
        function enableStream$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _regeneratorRuntime.awrap(navigator.mediaDevices.getUserMedia(requestedMedia));

              case 3:
                stream = _context.sent;
                setMediaStream(stream);
                _context.next = 9;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }

        return enableStream$;
      }(), null, null, [[0, 7]], Promise);
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function () {
        function cleanup() {
          mediaStream.getTracks().forEach(function (track) {
            track.stop();
          });
        }

        return cleanup;
      }();
    }
  }, [mediaStream, requestedMedia]);
  return mediaStream;
}

var Chat = function (props) {
  var videoRef = useRef();
  var mediaStream = useUserMedia(CAPTURE_OPTIONS);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  function handleCanPlay() {
    videoRef.current.play();
  }

  var CAPTURE_OPTIONS = {
    audio: false,
    video: {
      facingMode: "environment"
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "chat-cont"
  }, /*#__PURE__*/React.createElement(Sidebar, null), /*#__PURE__*/React.createElement(MsgCont, null), /*#__PURE__*/React.createElement("video", {
    className: "videoconf",
    ref: videoRef,
    onCanPlay: handleCanPlay,
    autoPlay: true,
    playsInline: true,
    muted: true
  }));
};

module.exportDefault(Chat);
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Signin.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// imports/ui/Views/Signin.jsx                                                                         //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var _slicedToArray;

module.link("@babel/runtime/helpers/slicedToArray", {
  default: function (v) {
    _slicedToArray = v;
  }
}, 0);
var React, useState;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  useState: function (v) {
    useState = v;
  }
}, 0);
var Link;
module.link("react-router-dom", {
  Link: function (v) {
    Link = v;
  }
}, 1);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 2);
var useTracker;
module.link("meteor/react-meteor-data", {
  useTracker: function (v) {
    useTracker = v;
  }
}, 3);

var errorMsg = function (props) {
  return /*#__PURE__*/React.createElement("small", {
    className: "form-text text-danger"
  }, props.msg);
};

var Signin = function (props) {
  var user = useTracker(function () {
    return Meteor.user();
  });

  var _useState = useState(""),
      _useState2 = _slicedToArray(_useState, 2),
      email = _useState2[0],
      setEmail = _useState2[1];

  var _useState3 = useState(""),
      _useState4 = _slicedToArray(_useState3, 2),
      password = _useState4[0],
      setPassword = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      error = _useState6[0],
      setError = _useState6[1];

  var submit = function (e) {
    e.preventDefault();
    Meteor.loginWithPassword(email, password, function (error) {
      setError(true);
    });
    setEmail("");
    setPassword("");

    if (user) {
      window.open("/app", "_self");
    }
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "contact-clean"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-center"
  }, "WhatsSad =)"), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    type: "email",
    name: "email",
    placeholder: "Escribe tu correo",
    onChange: function (e) {
      setError(false);
      setEmail(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("input", {
    onChange: function (e) {
      setError(false);
      setPassword(e.target.value);
    },
    className: "form-control",
    type: "password",
    name: "name",
    placeholder: "Escribe tu contrase\xF1a"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group text-center"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    type: "submit"
  }, "ENTRAR")), /*#__PURE__*/React.createElement("div", {
    className: "form-group text-center"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/signup"
  }, "Registro")), error ? /*#__PURE__*/React.createElement("errorMsg", null) : null));
};

module.exportDefault(Signin);
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Signup.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// imports/ui/Views/Signup.jsx                                                                         //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var _slicedToArray;

module.link("@babel/runtime/helpers/slicedToArray", {
  default: function (v) {
    _slicedToArray = v;
  }
}, 0);
var React, useState;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  useState: function (v) {
    useState = v;
  }
}, 0);
var Link;
module.link("react-router-dom", {
  Link: function (v) {
    Link = v;
  }
}, 1);
var useTracker;
module.link("meteor/react-meteor-data", {
  useTracker: function (v) {
    useTracker = v;
  }
}, 2);

var errorMsg = function () {
  return /*#__PURE__*/React.createElement("small", {
    className: "form-text text-danger"
  }, "Something has gone wrong");
};

var Signup = function (props) {
  var user = useTracker(function () {
    return Meteor.user();
  });

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      name = _useState2[0],
      setName = _useState2[1];

  var _useState3 = useState(''),
      _useState4 = _slicedToArray(_useState3, 2),
      email = _useState4[0],
      setEmail = _useState4[1];

  var _useState5 = useState(''),
      _useState6 = _slicedToArray(_useState5, 2),
      password = _useState6[0],
      setPassword = _useState6[1];

  var handleForm = function (e) {
    e.preventDefault();
    Accounts.createUser({
      name: name,
      email: email,
      password: password,
      profile: {
        chats: []
      }
    }, function (error) {
      console.log(error);
    });
    setEmail('');
    setName('');
    setPassword('');

    if (user) {
      window.open("/app", "_self");
    }
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "contact-clean"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleForm
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-center"
  }, "WhatsSad =)"), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    type: "text",
    name: "name",
    placeholder: "Escribe tu nombre",
    onChange: function (e) {
      e.preventDefault();
      setName(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    type: "email",
    name: "email",
    placeholder: "Escribe tu correo",
    onChange: function (e) {
      e.preventDefault();
      setEmail(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    type: "password",
    name: "name",
    placeholder: "Escribe tu contrase\xF1a",
    onChange: function (e) {
      e.preventDefault();
      setPassword(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group text-center"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    type: "submit"
  }, "CREAR")), /*#__PURE__*/React.createElement("div", {
    className: "form-group text-center"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/signin"
  }, "Login"))));
};

module.exportDefault(Signup);
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"App.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// imports/ui/App.jsx                                                                                  //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
module.export({
  App: function () {
    return App;
  }
});
var React, useEffect;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  useEffect: function (v) {
    useEffect = v;
  }
}, 0);
var Router, Route, Switch, Redirect;
module.link("react-router-dom", {
  BrowserRouter: function (v) {
    Router = v;
  },
  Route: function (v) {
    Route = v;
  },
  Switch: function (v) {
    Switch = v;
  },
  Redirect: function (v) {
    Redirect = v;
  }
}, 1);
var useTracker;
module.link("meteor/react-meteor-data", {
  useTracker: function (v) {
    useTracker = v;
  }
}, 2);
var Sigin;
module.link("./Views/Signin", {
  "default": function (v) {
    Sigin = v;
  }
}, 3);
var Signup;
module.link("./Views/Signup", {
  "default": function (v) {
    Signup = v;
  }
}, 4);
var Chat;
module.link("./Views/Chat", {
  "default": function (v) {
    Chat = v;
  }
}, 5);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 6);

var App = function () {
  var user = useTracker(function () {
    return Meteor.user();
  });
  useEffect(function () {
    if (user) {
      window.open("/app", "_self");
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    className: "d-flex flex-column bg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "green-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "gray-bg"
  })), /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Redirect, {
    exact: true,
    from: "/",
    to: "/signin"
  }), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/signin",
    component: Sigin
  }), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/signup",
    component: Signup
  }), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/app",
    component: Chat
  }))));
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"client":{"main.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// client/main.jsx                                                                                     //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 1);
var render;
module.link("react-dom", {
  render: function (v) {
    render = v;
  }
}, 2);
var App;
module.link("/imports/ui/App", {
  App: function (v) {
    App = v;
  }
}, 3);
Meteor.startup(function () {
  render( /*#__PURE__*/React.createElement(App, null), document.getElementById('react-target'));
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".ts",
    ".jsx",
    ".mjs",
    ".css"
  ]
});

var exports = require("/client/main.jsx");