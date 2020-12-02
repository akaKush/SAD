import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";



const Signin = (props) => {

  const user = useTracker(() => Meteor.user());

  
 
  useEffect(() => {
    
    if(user){
      window.open("/app", "_self")
    }
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();

    Meteor.loginWithPassword(email, password, (error) => {
      setError(true);
    });
    
    setEmail("");
    setPassword("");
    if(user){
      window.open("/app", "_self")
    }
  };

  return (
    <div className="contact-clean">
      <form onSubmit={submit}>
        <h2 className="text-center">WhatsSad =)</h2>
        <div className="form-group">
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Escribe tu correo"
            onChange={(e) => {
              setError(false);
              setEmail(e.target.value);
            }}
          ></input>
        </div>
        <div className="form-group">
          <input
            onChange={(e) => {
              setError(false);
              setPassword(e.target.value);
            }}
            className="form-control"
            type="password"
            name="name"
            placeholder="Escribe tu contraseña"
          ></input>
        </div>
        <div className="form-group text-center">
          <button className="btn btn-primary" type="submit">
            ENTRAR
          </button>
        </div>
        <div className="form-group text-center">
          <Link to="/signup">Registro</Link>
        </div>
        
      </form>
    </div>
  );
};

export default Signin;
