"use strict";
exports.__esModule = true;
var midi_1 = require("midi");
var openMidiPort_1 = require("./openMidiPort");
exports["default"] = (function (midiPortName, isVirtual) {
    if (isVirtual === void 0) { isVirtual = false; }
    var input = new midi_1.Input();
    (0, openMidiPort_1["default"])(midiPortName, input, "input", isVirtual);
    return input;
});
//# sourceMappingURL=openMidiIn.js.map