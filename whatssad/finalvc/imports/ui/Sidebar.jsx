import React from "react";
import { useTracker } from 'meteor/react-meteor-data';


const Sidebar = ({user}) => {

  Meteor.subscribe("userList");
  const users2 =  Meteor.users.find().fetch();
 
  const userImgStyle = {
    background: `url("/img/45e89450-4ca0-11ea-bdf9-989fc1b2f847.jpg") center / cover no-repeat`
  };

const usersSidebar = users2.length ? (
   
    users2.map(user => {
        
        return(

            <div className="user-chat-sidebar" key={user._id}>
                <div className="d-flex flex-row justify-content-between topcontaine">
                    <div>
                        <div className="user-image" style={userImgStyle}></div>
                    </div>
                    <div className="d-flex flex-row use-conta-side align-items-center ">
                        <div className="d-flex flex-row  top-sidebar-user end">
                            <span className="user-name">{user.profile.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    })
):
(<span>No contact yes</span>)

  return (
    <div className="sidebar">
      <div className="d-flex flex-row justify-content-between topcontainer">
        <div>
          <div className="user-image" style={userImgStyle}></div>
        </div>
        <div className="d-flex flex-row justify-content-around right-topcont">
          <img className="top-svg" src="/img/svgexport-2.png"></img>
          <img className="top-svg" src="/img/svgexport-3.png"></img>
          <img className="top-svg" src="/img/svgexport-4.png"></img>
        </div>
      </div>
      <div className="side-search-cont">
        <div className="search-input-div">
            <div className="d-flex justify-content-center align-items-center">
                <img id="search-img" src="/img/svgexport-11.png"></img>
            </div>
            <input type="text" className="search-input"></input>
        </div>
      </div>
      <div className="user-container">
        {usersSidebar}
      </div>
    </div>
  );
};

export default Sidebar;
