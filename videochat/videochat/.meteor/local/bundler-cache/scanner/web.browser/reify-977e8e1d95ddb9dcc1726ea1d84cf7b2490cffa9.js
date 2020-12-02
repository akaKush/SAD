"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flyadapter_1 = require("flyadapter");
var client_1 = require("./client");
var Message_1 = require("./entities/Message");
exports.MessageType = Message_1.MessageType;
exports.Message = Message_1.Message;
exports.MessageDirection = Message_1.MessageDirection;
var RTC = /** @class */ (function () {
    function RTC(getUserMedia, RTCPeerConnection) {
        this.getUserMedia = getUserMedia;
        this.RTCPeerConnection = RTCPeerConnection;
    }
    RTC.prototype.createPeerConnection = function (config) {
        return new this.RTCPeerConnection(config);
    };
    return RTC;
}());
var client = function (settings) { return new client_1.default(settings, new RTC(flyadapter_1.getUserMedia, flyadapter_1.RTCPeerConnection)); };
exports.client = client;
