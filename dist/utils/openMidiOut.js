"use strict";
exports.__esModule = true;
var midi_1 = require("midi");
var openMidiPort_1 = require("./openMidiPort");
exports["default"] = (function (midiPortName, isVirtual) {
    if (isVirtual === void 0) { isVirtual = false; }
    var output = new midi_1.Output();
    (0, openMidiPort_1["default"])(midiPortName, output, "output", isVirtual);
    return output;
});
//# sourceMappingURL=openMidiOut.js.map