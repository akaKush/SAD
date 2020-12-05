var require = meteorInstall({"imports":{"ui":{"Components":{"MsgCont.jsx":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// imports/ui/Components/MsgCont.jsx                                                                 //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);

const MsgCont = props => {
  const userImgStyle = {
    background: "url(\"/img/45e89450-4ca0-11ea-bdf9-989fc1b2f847.jpg\") center / cover no-repeat"
  };
  const whatsBG = {
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
///////////////////////////////////////////////////////////////////////////////////////////////////////

},"Sidebar.jsx":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// imports/ui/Components/Sidebar.jsx                                                                 //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);

const Sidebar = props => {
  const users = [{
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
  const userImgStyle = {
    background: "url(\"/img/45e89450-4ca0-11ea-bdf9-989fc1b2f847.jpg\") center / cover no-repeat"
  };
  const usersSidebar = users.length ? users.map(user => {
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
///////////////////////////////////////////////////////////////////////////////////////////////////////

}},"Views":{"Chat.jsx":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// imports/ui/Views/Chat.jsx                                                                         //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
module.export({
  useUserMedia: () => useUserMedia
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let Sidebar;
module.link("../Components/Sidebar", {
  default(v) {
    Sidebar = v;
  }

}, 1);
let MsgCont;
module.link("../Components/MsgCont", {
  default(v) {
    MsgCont = v;
  }

}, 2);
let useState, useEffect;
module.link("react", {
  useState(v) {
    useState = v;
  },

  useEffect(v) {
    useEffect = v;
  }

}, 3);

function useUserMedia(requestedMedia) {
  const [mediaStream, setMediaStream] = useState(null);
  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
        setMediaStream(stream);
      } catch (err) {}
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      };
    }
  }, [mediaStream, requestedMedia]);
  return mediaStream;
}

const Chat = props => {
  const videoRef = useRef();
  const mediaStream = useUserMedia(CAPTURE_OPTIONS);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  function handleCanPlay() {
    videoRef.current.play();
  }

  const CAPTURE_OPTIONS = {
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
///////////////////////////////////////////////////////////////////////////////////////////////////////

},"Signin.jsx":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// imports/ui/Views/Signin.jsx                                                                       //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
let React, useState;
module.link("react", {
  default(v) {
    React = v;
  },

  useState(v) {
    useState = v;
  }

}, 0);
let Link;
module.link("react-router-dom", {
  Link(v) {
    Link = v;
  }

}, 1);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
let useTracker;
module.link("meteor/react-meteor-data", {
  useTracker(v) {
    useTracker = v;
  }

}, 3);

const errorMsg = props => {
  return /*#__PURE__*/React.createElement("small", {
    className: "form-text text-danger"
  }, props.msg);
};

const Signin = props => {
  const user = useTracker(() => Meteor.user());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = e => {
    e.preventDefault();
    Meteor.loginWithPassword(email, password, error => {
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
    onChange: e => {
      setError(false);
      setEmail(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("input", {
    onChange: e => {
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
///////////////////////////////////////////////////////////////////////////////////////////////////////

},"Signup.jsx":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// imports/ui/Views/Signup.jsx                                                                       //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
let React, useState;
module.link("react", {
  default(v) {
    React = v;
  },

  useState(v) {
    useState = v;
  }

}, 0);
let Link;
module.link("react-router-dom", {
  Link(v) {
    Link = v;
  }

}, 1);
let useTracker;
module.link("meteor/react-meteor-data", {
  useTracker(v) {
    useTracker = v;
  }

}, 2);

const errorMsg = () => {
  return /*#__PURE__*/React.createElement("small", {
    className: "form-text text-danger"
  }, "Something has gone wrong");
};

const Signup = props => {
  const user = useTracker(() => Meteor.user());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleForm = e => {
    e.preventDefault();
    Accounts.createUser({
      name: name,
      email: email,
      password: password,
      profile: {
        chats: []
      }
    }, error => {
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
    onChange: e => {
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
    onChange: e => {
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
    onChange: e => {
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
///////////////////////////////////////////////////////////////////////////////////////////////////////

}},"App.jsx":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// imports/ui/App.jsx                                                                                //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
module.export({
  App: () => App
});
let React, useEffect;
module.link("react", {
  default(v) {
    React = v;
  },

  useEffect(v) {
    useEffect = v;
  }

}, 0);
let Router, Route, Switch, Redirect;
module.link("react-router-dom", {
  BrowserRouter(v) {
    Router = v;
  },

  Route(v) {
    Route = v;
  },

  Switch(v) {
    Switch = v;
  },

  Redirect(v) {
    Redirect = v;
  }

}, 1);
let useTracker;
module.link("meteor/react-meteor-data", {
  useTracker(v) {
    useTracker = v;
  }

}, 2);
let Sigin;
module.link("./Views/Signin", {
  default(v) {
    Sigin = v;
  }

}, 3);
let Signup;
module.link("./Views/Signup", {
  default(v) {
    Signup = v;
  }

}, 4);
let Chat;
module.link("./Views/Chat", {
  default(v) {
    Chat = v;
  }

}, 5);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 6);

const App = () => {
  const user = useTracker(() => Meteor.user());
  useEffect(() => {
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
///////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"client":{"main.jsx":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// client/main.jsx                                                                                   //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let render;
module.link("react-dom", {
  render(v) {
    render = v;
  }

}, 2);
let App;
module.link("/imports/ui/App", {
  App(v) {
    App = v;
  }

}, 3);
Meteor.startup(() => {
  render( /*#__PURE__*/React.createElement(App, null), document.getElementById('react-target'));
});
///////////////////////////////////////////////////////////////////////////////////////////////////////

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