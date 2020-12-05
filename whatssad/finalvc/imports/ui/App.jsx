import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import Sigin from "../ui/Signin";
import Signup from "../ui/Signup";
import Chat from "../ui/Chat";
import { Meteor } from "meteor/meteor";

export const App = () => {

  // Create a reusable hook
  
  const user =  useTracker(() => {
      const user = Meteor.user();
      const userId = Meteor.userId();
      return {
        user,
        userId,
        isLoggedIn: !!userId,
      };
    }, [])

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
          <Route exact path="/app" children={() => <Chat user={user}></Chat>} />
        </Switch>
      </Router>
    </div>
  );
};
