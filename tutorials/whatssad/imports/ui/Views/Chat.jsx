import React,  { useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import MsgCont from '../Components/MsgCont';
import { useTracker } from "meteor/react-meteor-data";

const Chat = props => {

    

    useEffect(() => {
        console.log(props)
      },[]);
    
    return(
        <section className="chat-cont">
            <Sidebar></Sidebar>
            <MsgCont></MsgCont>
        </section>
    )

}


export default Chat;