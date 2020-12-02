import React, {useState} from 'react';
import {chat} from '../../api/chat';
import { useTracker } from "meteor/react-meteor-data";
import {Meteor} from 'meteor/meteor'
const MsgCont = props => {

    const userImgStyle = {
        background: `url("/img/45e89450-4ca0-11ea-bdf9-989fc1b2f847.jpg") center / cover no-repeat`
      };
    const whatsBG = {
        background: `url("/img/whatsbg.jpg") center / cover no-repeat`
    }
    const logout = () => {
        Meteor.logout();
    }

    const [msg, setMessage] = useState('');

    const handleForm = (e) => {
        e.preventDefault();
        chat.insert({
            id: "32PWkjqYCekEX5jMf",
            name: "Jordi Parra",
            msg: msg });
        setMessage('');
    }

    const chats  = useTracker(() => chat.find({}).fetch());

    return(
        <div className="msg-cont">
            <div className="d-flex flex-row justify-content-between user-cont-msgs">
                <div className="d-flex flex-row align-content-center current-user-data-cont">
                    <div>
                        <div className="user-image" style={userImgStyle}></div>
                    </div>
                    <span className="d-flex align-items-center fin-user-name">UserName</span>
                </div>
                <div className="d-flex flex-row justify-content-around right-msg-cont">
                    <img className="top-svg" src="img/svgexport-11.png" />
                    <i onClick={logout} className="fas fa-door-open dor-icon"></i>
                </div>
            </div>
            <div className="msg-cont-fin" style={whatsBG}>
                <div className="own-msg-cont"><span className="msg">Text Number one</span></div>
                <div className="own-msg-cont-l"><span className="msg-l">Text Number one</span></div>
            </div>
            <div className="msg-input-cont">
                <div className="d-flex flex-row justify-content-around left-icon-cont">
                    <img src="/img/svgexport-17.png" />
                    <img src="/img/svgexport-20.png" />
                </div>
                <div className="d-flex justify-content-center align-items-center msg-final-input">
                    <form onSubmit={handleForm} className="msg-input">
                        <input type="text" value={msg} onChange={e => setMessage(e.target.value)} className="txt-2020" />
                    </form>
                </div>
                <div className="d-flex flex-row justify-content-around left-icon-cont">
                    <img src="/img/svgexport-21.png" />
                        <i className="fas fa-video"></i>
                </div>
            </div>
        </div>
    )

}


export default MsgCont;