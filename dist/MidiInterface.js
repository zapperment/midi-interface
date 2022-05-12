"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _midiOut, _midiIn, _receivers, _genericReceiver, _fatalError, _handleMessage;
exports.__esModule = true;
var debug_1 = require("debug");
var utils_1 = require("./utils");
var constants_1 = require("./constants");
var debug = (0, debug_1["default"])("zapperment:midi-interface");
var createKeyCreator = function (type) {
    return function (bytes) {
        if (bytes === void 0) { bytes = []; }
        return (0, utils_1.convertBytesToString)([type].concat(bytes));
    };
};
var stopKey = createKeyCreator(constants_1.STOP)();
var startKey = createKeyCreator(constants_1.START)();
var clockKey = createKeyCreator(constants_1.CLOCK)();
var _a = [constants_1.SYSEX_START, constants_1.CONTROL_CHANGE, constants_1.NOTE_ON, constants_1.NOTE_OFF].map(createKeyCreator), createSysExKey = _a[0], createControlChangeKey = _a[1], createNoteOnKey = _a[2], createNoteOffKey = _a[3];
var default_1 = (function () {
    function default_1(_a) {
        var _this = this;
        var midiPortName = _a.midiPortName, _b = _a.isVirtual, isVirtual = _b === void 0 ? false : _b;
        _midiOut.set(this, null);
        _midiIn.set(this, null);
        _receivers.set(this, new Map());
        _genericReceiver.set(this, function () { });
        _fatalError.set(this, function (error) {
            console.error("Fatal error in MIDI interface module: ".concat(error.message));
            process.exit(1);
        });
        _handleMessage.set(this, function (message, deltaTime) {
            var _a = (0, utils_1.getTypeAndChannel)(message), type = _a.type, channel = _a.channel;
            __classPrivateFieldGet(_this, _genericReceiver, "f").call(_this, message, deltaTime);
            switch (type) {
                case constants_1.NOTE_ON: {
                    var note = message[1], velocity = message[2];
                    if (velocity > 0) {
                        debug("note on, channel ".concat(channel, ", note ").concat(note, ", velocity ").concat(velocity));
                        var key = createNoteOnKey([channel]);
                        var receiver = __classPrivateFieldGet(_this, _receivers, "f").get(key);
                        if (receiver) {
                            receiver(note, velocity, deltaTime);
                        }
                    }
                    break;
                }
                case constants_1.NOTE_OFF: {
                    var note = message[1];
                    debug("note off, channel ".concat(channel, ", note ").concat(note));
                    var key = createNoteOffKey([channel]);
                    var receiver = __classPrivateFieldGet(_this, _receivers, "f").get(key);
                    if (receiver) {
                        receiver(note, deltaTime);
                    }
                    break;
                }
                case constants_1.CONTROL_CHANGE: {
                    var controller = message[1], value = message[2];
                    debug("control change, channel ".concat(channel, ", controller ").concat(controller, ", value ").concat(value));
                    var key = createControlChangeKey([channel, controller]);
                    var receiver = __classPrivateFieldGet(_this, _receivers, "f").get(key);
                    if (receiver) {
                        receiver(value, deltaTime);
                    }
                    break;
                }
                case constants_1.SYSEX_START: {
                    var _b = (0, utils_1.splitSysEx)(message), manufacturerId = _b.manufacturerId, data = _b.data;
                    var receiver = __classPrivateFieldGet(_this, _receivers, "f").get(createSysExKey(manufacturerId));
                    if (receiver) {
                        receiver(data, deltaTime);
                    }
                    break;
                }
                case constants_1.CLOCK: {
                    debug("clock");
                    break;
                }
                case constants_1.STOP: {
                    debug("stop");
                    break;
                }
                case constants_1.START: {
                    debug("start");
                    break;
                }
                case constants_1.PITCH_WHEEL: {
                    debug("pitch wheel");
                    break;
                }
                default:
                    debug("unknown type", type);
            }
        });
        try {
            __classPrivateFieldSet(this, _midiOut, (0, utils_1.openMidiOut)(midiPortName, isVirtual), "f");
            __classPrivateFieldSet(this, _midiIn, (0, utils_1.openMidiIn)(midiPortName, isVirtual), "f");
        }
        catch (error) {
            __classPrivateFieldGet(this, _fatalError, "f").call(this, error);
        }
        __classPrivateFieldGet(this, _midiIn, "f").ignoreTypes(false, false, true);
        __classPrivateFieldGet(this, _midiIn, "f").on("message", function (deltaTime, message) {
            return __classPrivateFieldGet(_this, _handleMessage, "f").call(_this, message, deltaTime);
        });
    }
    default_1.prototype.sendStop = function () {
        __classPrivateFieldGet(this, _midiOut, "f").sendMessage([constants_1.STOP]);
    };
    default_1.prototype.receiveStop = function (callback) {
        __classPrivateFieldGet(this, _receivers, "f").set(stopKey, callback);
    };
    default_1.prototype.dontReceiveStop = function () {
        __classPrivateFieldGet(this, _receivers, "f")["delete"](stopKey);
    };
    default_1.prototype.sendStart = function () {
        __classPrivateFieldGet(this, _midiOut, "f").sendMessage([constants_1.START]);
    };
    default_1.prototype.receiveStart = function (callback) {
        __classPrivateFieldGet(this, _receivers, "f").set(startKey, callback);
    };
    default_1.prototype.dontReceiveStart = function () {
        __classPrivateFieldGet(this, _receivers, "f")["delete"](startKey);
    };
    default_1.prototype.sendClock = function () {
        __classPrivateFieldGet(this, _midiOut, "f").sendMessage([constants_1.CLOCK]);
    };
    default_1.prototype.receiveClock = function (callback) {
        __classPrivateFieldGet(this, _receivers, "f").set(clockKey, callback);
    };
    default_1.prototype.dontReceiveClock = function () {
        __classPrivateFieldGet(this, _receivers, "f")["delete"](clockKey);
    };
    default_1.prototype.sendMidiMessage = function (message) {
        __classPrivateFieldGet(this, _midiOut, "f").sendMessage(message);
    };
    default_1.prototype.receiveMidiMessage = function (callback) {
        __classPrivateFieldSet(this, _genericReceiver, callback, "f");
    };
    default_1.prototype.dontReceiveMidiMessage = function () {
        __classPrivateFieldSet(this, _genericReceiver, function () { }, "f");
    };
    default_1.prototype.sendControlChange = function (channel, controller, value) {
        __classPrivateFieldGet(this, _midiOut, "f").sendMessage([
            constants_1.CONTROL_CHANGE + channel - 1,
            controller,
            value,
        ]);
    };
    default_1.prototype.sendProgramChange = function (channel, value) {
        __classPrivateFieldGet(this, _midiOut, "f").sendMessage([constants_1.PROGRAM_CHANGE + channel - 1, value]);
    };
    default_1.prototype.receiveControlChange = function (channel, controller, callback) {
        __classPrivateFieldGet(this, _receivers, "f").set(createControlChangeKey([channel, controller]), callback);
    };
    default_1.prototype.dontReceiveControlChange = function (channel, controller) {
        __classPrivateFieldGet(this, _receivers, "f")["delete"](createControlChangeKey([channel, controller]));
    };
    default_1.prototype.sendNoteOn = function (channel, note, velocity) {
        if (velocity === void 0) { velocity = 127; }
        __classPrivateFieldGet(this, _midiOut, "f").sendMessage([constants_1.NOTE_ON + channel - 1, note, velocity]);
    };
    default_1.prototype.sendBeep = function (channel, note) {
        __classPrivateFieldGet(this, _midiOut, "f").sendMessage([constants_1.NOTE_ON + channel - 1, note, 127]);
        __classPrivateFieldGet(this, _midiOut, "f").sendMessage([constants_1.NOTE_OFF + channel - 1, note, 0]);
    };
    default_1.prototype.receiveNoteOn = function (channel, callback) {
        __classPrivateFieldGet(this, _receivers, "f").set(createNoteOnKey([channel]), callback);
    };
    default_1.prototype.dontReceiveNoteOn = function (channel) {
        __classPrivateFieldGet(this, _receivers, "f")["delete"](createNoteOnKey([channel]));
    };
    default_1.prototype.sendNoteOff = function (channel, note, velocity) {
        if (velocity === void 0) { velocity = 0; }
        __classPrivateFieldGet(this, _midiOut, "f").sendMessage([constants_1.NOTE_OFF + channel - 1, note, velocity]);
    };
    default_1.prototype.receiveNoteOff = function (channel, callback) {
        __classPrivateFieldGet(this, _receivers, "f").set(createNoteOffKey([channel]), callback);
    };
    default_1.prototype.dontReceiveNoteOff = function (channel) {
        __classPrivateFieldGet(this, _receivers, "f")["delete"](createNoteOffKey([channel]));
    };
    default_1.prototype.sendSysEx = function (manufacturerId, data) {
        __classPrivateFieldGet(this, _midiOut, "f").sendMessage(__spreadArray(__spreadArray(__spreadArray([
            constants_1.SYSEX_START
        ], manufacturerId, true), data, true), [
            constants_1.SYSEX_END,
        ], false));
    };
    default_1.prototype.receiveSysEx = function (manufacturerId, callback) {
        debug("setting sys ex receiver", createSysExKey(manufacturerId));
        __classPrivateFieldGet(this, _receivers, "f").set(createSysExKey(manufacturerId), callback);
    };
    default_1.prototype.dontReceiveSysEx = function (manufacturerId) {
        __classPrivateFieldGet(this, _receivers, "f")["delete"](createSysExKey(manufacturerId));
    };
    return default_1;
}());
exports["default"] = default_1;
_midiOut = new WeakMap(), _midiIn = new WeakMap(), _receivers = new WeakMap(), _genericReceiver = new WeakMap(), _fatalError = new WeakMap(), _handleMessage = new WeakMap();
;
//# sourceMappingURL=MidiInterface.js.map