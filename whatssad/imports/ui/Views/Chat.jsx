import React from 'react';
import Sidebar from '../Components/Sidebar';
import MsgCont from '../Components/MsgCont';

const Chat = props => {

    return(
        <section className="chat-cont">
            <Sidebar></Sidebar>
            <MsgCont></MsgCont>
        </section>
    )

}


export default Chat;