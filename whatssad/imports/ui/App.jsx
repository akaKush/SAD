import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import Sigin from "./Views/Signin";
import Signup from "./Views/Signup";
import Chat from "./Views/Chat";
import { Meteor } from "meteor/meteor";

export const App = () => {
  const user = useTracker(() => Meteor.user());

  useEffect(() => {
    if(user){
      window.open("/app", "_self")
    }
  },[]);

  return (
    <div>
      <section className="d-flex flex-column bg">
        <div className="green-bg"></div>
        <div className="gray-bg"></div>
      </section>
      <Router>
        <Switch>
          <Redirect exact from="/" to="/signin" />
          <Route exact path="/signin" component={Sigin} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/app" component={Chat} />
        </Switch>
      </Router>
    </div>
  );
};
