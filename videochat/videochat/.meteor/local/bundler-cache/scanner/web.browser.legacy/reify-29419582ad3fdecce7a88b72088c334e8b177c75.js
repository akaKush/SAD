"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageDirection;
(function (MessageDirection) {
    MessageDirection[MessageDirection["Sender"] = 0] = "Sender";
    MessageDirection[MessageDirection["Target"] = 1] = "Target";
})(MessageDirection = exports.MessageDirection || (exports.MessageDirection = {}));
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Candidate"] = 0] = "Candidate";
    MessageType[MessageType["SessionDescription"] = 1] = "SessionDescription";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var Message = /** @class */ (function () {
    function Message() {
    }
    return Message;
}());
exports.Message = Message;
