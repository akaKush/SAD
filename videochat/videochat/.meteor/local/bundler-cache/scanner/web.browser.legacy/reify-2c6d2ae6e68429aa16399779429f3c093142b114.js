"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("loglevel");
var VideoWrapper_1 = require("./VideoWrapper");
var DataChannel_1 = require("./DataChannel");
var Message_1 = require("./entities/Message");
var ClientEvents = /** @class */ (function () {
    function ClientEvents() {
        this.eventMap = {};
    }
    ClientEvents.prototype.callEvent = function (event) {
        log.debug("calling event", event);
        if (this.eventMap[event]) {
            return this.eventMap[event];
        }
        else {
            return function () { };
        }
    };
    return ClientEvents;
}());
var Client = /** @class */ (function () {
    function Client(settings, rtc) {
        this._mediaConstraints = {};
        this._iceServers = [];
        log.setLevel("silent");
        this._rtc = rtc;
        this.events = new ClientEvents();
    }
    Client.prototype.init = function (data) {
        log.debug("initalizing", data);
        if (data !== undefined) {
            if (data.iceServers) {
                this._iceServers = data.iceServers;
            }
            if (data.debug === true) {
                log.setLevel("trace");
            }
            else if (data.debug === false) {
                log.setLevel("silent");
            }
        }
        this.events.callEvent("coreInitialized")();
    };
    /**
     * Call allows you to call a remote user using their userId
     * @param _id {string}
     * @param local {IHTMLMediaElement}
     * @param remote {IHTMLMediaElement}
     */
    Client.prototype.call = function (params) {
        log.debug("starting call", params);
        var video = params.video, audio = params.audio, localElement = params.localElement, remoteElement = params.remoteElement, id = params.id;
        this._localVideo = null;
        this._remoteVideo = null;
        this._mediaConstraints = {
            audio: audio,
            video: video
        };
        if (localElement !== undefined) {
            log.debug("setting local element", localElement);
            this._localVideo = new VideoWrapper_1.default(localElement);
        }
        if (remoteElement !== undefined) {
            log.debug("setting remote element", remoteElement);
            this._remoteVideo = new VideoWrapper_1.default(remoteElement);
        }
        this.events.callEvent("callInitialized")(params);
    };
    /**
     *
     * Create a datachannel
     *
     */
    Client.prototype.createDataChannel = function (options) {
        log.debug("creating data channel", options);
        if (!this.peerConnection) {
            throw new Error("PeerConnection is not initialized");
        }
        return new DataChannel_1.default(options, this.peerConnection);
    };
    /**
     * Reject a new call that the user is recieving
     *
     * */
    Client.prototype.rejectCall = function () {
        log.debug("rejecting call");
        this._localVideo = null;
        this._remoteVideo = null;
        this.peerConnection = null;
        this.events.callEvent("rejectCall")();
    };
    /**
     * handle the stream on the caller side
     * @param message {Message}
     *
     */
    Client.prototype.handleSenderStream = function (message) {
        log.debug("handle sender stream", message);
        this.processIceCandidate(message);
        if (message.Type === Message_1.MessageType.SessionDescription) {
            log.debug("handle session description", message);
            this.peerConnection.setRemoteDescription(message.data).catch(this.events.callEvent("error"));
        }
    };
    /**
     * Event handler for when the target accepts the call
     *
     */
    Client.prototype.handleTargetAccept = function () {
        var _this = this;
        log.debug("handle target accept");
        this._rtc.getUserMedia(this._mediaConstraints).then(function (stream) {
            log.debug("got local media", stream);
            if (_this._localVideo) {
                _this._localVideo.setStream(stream, true);
                _this._localVideo.play();
            }
            _this.setupPeerConnection(stream);
        }).catch(function (err) {
            log.error("could not get user media", err);
            _this.events.callEvent("error")(err);
        });
    };
    /**
     * handle the stream on the target
     * @param message {Message}
     *
     */
    Client.prototype.handleTargetStream = function (message) {
        var _this = this;
        log.debug("handle target stream", message);
        this.processIceCandidate(message);
        if (message.Type === Message_1.MessageType.SessionDescription) {
            log.debug("handle session description");
            this._rtc.getUserMedia(this._mediaConstraints).then(function (stream) {
                log.debug("getUserMedia", stream);
                if (_this._localVideo) {
                    _this._localVideo.setStream(stream, true);
                    _this._localVideo.play();
                }
                _this.setupPeerConnection(stream, message.data);
            }).catch(function (err) {
                log.error("getUserMedia failed", err);
                _this.events.callEvent("error");
            });
        }
    };
    Client.prototype.processIceCandidate = function (message) {
        var _this = this;
        log.info("processIceCandidate", message);
        if (message.Type === Message_1.MessageType.Candidate) {
            log.info("addIceCandidate", message);
            if (this.peerConnection) {
                this.peerConnection.addIceCandidate(message.data).catch(function (err) {
                    log.debug("could not add ice candidate", err);
                    _this.events.callEvent("error")(err);
                });
            }
        }
    };
    Client.prototype.setupPeerConnection = function (stream, remoteDescription) {
        var _this = this;
        log.info("setting peerConnection", stream, remoteDescription);
        this.peerConnection = this._rtc.createPeerConnection({
            iceServers: this._iceServers
        });
        this.peerConnection.ondatachannel = function (event) { return _this.events.callEvent("datachannel")(event); };
        this.events.callEvent("peerConnectionCreated")();
        this.setPeerConnectionCallbacks();
        log.info("adding stream");
        this.peerConnection.addStream(stream);
        if (remoteDescription) {
            this.createTargetSession(remoteDescription);
        }
        else {
            this.createCallSession();
        }
    };
    // private iceConnectionStateFailed(): void {
    //        this.peerConnection = undefined;
    //             if (this._retryCount < this._retryLimit) {
    //                 this._rtc.getUserMedia(this._mediaConstraints).then((stream: any) => {
    //                     this._retryCount++;
    //                     if (this._localVideo) {
    //                         this._localVideo.pause();
    //                         this._localVideo.setStream(stream, true);
    //                         this._localVideo.play();
    //                     }
    //                     this.setupPeerConnection(stream);
    //
    //                 }).catch(this.events.callEvent("error"));
    //
    //             } else {
    //                 const error = new Error("Could not establish connection");
    //                 this.events.callEvent("error")(error);
    //             }
    //
    // }
    Client.prototype.setPeerConnectionCallbacks = function () {
        log.info("setting peerConnection callbacks");
        this.peerConnection.onicecandidate = function (event) {
            log.info("add ice candidate", event);
            this.events.callEvent("emitIceCandidate")(event.candidate);
        }.bind(this);
        this.peerConnection.onaddstream = function (stream) {
            log.info("on add remote stream", stream);
            if (this._remoteVideo) {
                this._remoteVideo.pause();
                this._remoteVideo.setStream(stream.stream);
                this._remoteVideo.play();
            }
        }.bind(this);
    };
    /**
     * Answer the call
     * @param local {IHTMLMediaElement}
     * @param remote {IHTMLMediaElement}
     */
    Client.prototype.answerCall = function (params) {
        log.info("answer call", params);
        this._localVideo = null;
        this._remoteVideo = null;
        var video = params.video, audio = params.audio, localElement = params.localElement, remoteElement = params.remoteElement;
        this._mediaConstraints = {
            video: video,
            audio: audio
        };
        if (localElement !== undefined) {
            log.info("setting local video", localElement);
            this._localVideo = new VideoWrapper_1.default(localElement);
        }
        if (remoteElement !== undefined) {
            log.info("setting remote video", remoteElement);
            this._remoteVideo = new VideoWrapper_1.default(remoteElement);
        }
        this.events.callEvent("answerCall")(this.events.callEvent("error"));
    };
    /**
     * End the current call
     */
    Client.prototype.endCall = function () {
        log.info("ending call");
        if (this._localVideo) {
            log.info("stopping local video");
            this._localVideo.stop();
            this._localVideo = null;
        }
        if (this._remoteVideo) {
            log.info("stopping remote video");
            this._remoteVideo.stop();
            this._remoteVideo = null;
        }
        if (this.peerConnection) {
            this.peerConnection = null;
        }
        this.events.callEvent("endCall")();
    };
    /**
     * Set up the target WebRTC session
     * Needs to be reimplemented with await
     * @param remoteDescription {RTCSessionDescription}
     */
    Client.prototype.createTargetSession = function (remoteDescription) {
        var _this = this;
        log.info("creating target session", remoteDescription);
        this.peerConnection.setRemoteDescription(remoteDescription).then(function () {
            log.info("remote description set");
            _this.peerConnection.createAnswer().then(function (answer) {
                log.info("creating answer", answer);
                _this.peerConnection.setLocalDescription(answer).catch(function (setLocalDescriptionError) {
                    log.info("local description set");
                    _this.events.callEvent("error")(setLocalDescriptionError);
                });
                _this.events.callEvent("emitTargetAnswer")(answer);
            }).catch(function (createAnswerError) {
                log.error("create answer error", createAnswerError);
                _this.events.callEvent("error")(createAnswerError);
            });
        }).catch(function (setRemoteDescriptionError) {
            log.error("set remote description error", setRemoteDescriptionError);
            _this.events.callEvent("error")(setRemoteDescriptionError);
        });
    };
    Client.prototype.createCallSession = function () {
        var _this = this;
        log.info("creating call session");
        var offer = this.peerConnection.createOffer().then(function (offer) {
            log.info("created offer", offer);
            _this.peerConnection.setLocalDescription(offer);
            _this.events.callEvent("emitSenderDescription")(offer);
            _this.peerConnection.setLocalDescription(offer);
        }).catch(function (err) {
            log.error("create call session error", err);
            _this.events.callEvent("error")(err);
        });
    };
    /**
     * Get the VideoWrapper for the local video
     * @returns {VideoWrapper}
     */
    Client.prototype.getLocalVideo = function () {
        log.info("getting local video", this._localVideo);
        if (this._localVideo) {
            return this._localVideo;
        }
        else {
            return undefined;
        }
    };
    /**
     * Get the VideoWrapper for the remote video
     * @returns {VideoWrapper}
     */
    Client.prototype.getRemoteVideo = function () {
        log.info("getting remote video", this._remoteVideo);
        if (this._remoteVideo) {
            return this._remoteVideo;
        }
        else {
            return undefined;
        }
    };
    Client.prototype.on = function (eventName, action) {
        log.info("adding event", eventName);
        this.events.eventMap[eventName] = action;
    };
    return Client;
}());
exports.default = Client;
