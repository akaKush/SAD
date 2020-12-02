"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataChannel = /** @class */ (function () {
    function DataChannel(options, peerConnection) {
        this.eventMap = {};
        this.name = options.name;
        delete options.name;
        this.options = options;
        this.peerConnection = peerConnection;
    }
    DataChannel.prototype.createDataChannel = function () {
        this.dataChannel = this.peerConnection.createDataChannel(this.name, this.options);
        this.setDataChannelEvents();
    };
    DataChannel.prototype.setDataChannel = function (event) {
        this.dataChannel = event.channel;
        this.setDataChannelEvents();
    };
    DataChannel.prototype.setDataChannelEvents = function () {
        var _this = this;
        this.dataChannel.onopen = function (event) { return _this.callEvent("open")(event); };
        this.dataChannel.onclose = function (event) { return _this.callEvent("close")(event); };
        this.dataChannel.onmessage = function (event) { return _this.callEvent("message")(event); };
    };
    DataChannel.prototype.callEvent = function (event) {
        if (this.eventMap[event]) {
            return this.eventMap[event];
        }
        else {
            return function () { };
        }
    };
    return DataChannel;
}());
exports.default = DataChannel;
