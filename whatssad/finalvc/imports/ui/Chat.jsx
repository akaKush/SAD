import React,  { useEffect, useState } from 'react';
import Sidebar from '../ui/Sidebar';
import MsgCont from '../ui/MsgCont';
import { useTracker } from "meteor/react-meteor-data";

const Chat = (props) => {
    
    return(
        <section className="chat-cont">
            <Sidebar id={props.user._id}></Sidebar>
            <MsgCont user={props.user}></MsgCont>
        </section>
    )

}


export default Chat;