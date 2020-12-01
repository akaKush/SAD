import React, {useState} from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

const errorMsg = () => {
    return (
      <small className="form-text text-danger">
        Something has gone wrong
      </small>
    );
  };


const Signup = (props) => {

  const user = useTracker(() => Meteor.user());

  const [name, setName ] = useState('');
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');

  const handleForm = e => {
      e.preventDefault();
      Accounts.createUser({
          name:name, email:email, password: password,profile: {
            chats: []
          }
      }, error => {
          console.log(error);
      })
      
      setEmail('');
      setName('');
      setPassword('');

      if(user){
        window.open("/app", "_self")
      }

  }
  return (
    <div className="contact-clean">
      <form onSubmit={handleForm}>
        <h2 className="text-center">WhatsSad =)</h2>
        <div className="form-group">
          <input className="form-control" 
          type="text" 
          name="name" 
          placeholder="Escribe tu nombre"
          onChange={
              e => {
                  e.preventDefault()
                  setName(e.target.value);
              }
          }
          >
          </input>
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Escribe tu correo"
            onChange={
                e => {
                    e.preventDefault()
                    setEmail(e.target.value);
                }
            }
          ></input>
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="password"
            name="name"
            placeholder="Escribe tu contraseña"
            onChange={
                e => {
                    e.preventDefault()
                    setPassword(e.target.value);
                }
            }
          ></input>
        </div>
        <div className="form-group text-center">
          <button className="btn btn-primary" type="submit">
            CREAR
          </button>
        </div>
        <div className="form-group text-center">
          <Link to="/signin">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
