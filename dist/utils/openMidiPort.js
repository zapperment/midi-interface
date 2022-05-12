"use strict";
exports.__esModule = true;
exports["default"] = (function (midiPortName, inputOrOutput, type, isVirtual) {
    if (isVirtual) {
        inputOrOutput.openVirtualPort(midiPortName);
        return;
    }
    var numberOfPorts = inputOrOutput.getPortCount();
    if (numberOfPorts === 0) {
        throw new Error("No MIDI ".concat(type, " ports available"));
    }
    for (var i = 0; i < numberOfPorts; i++) {
        if (!inputOrOutput.getPortName(i).startsWith(midiPortName)) {
            continue;
        }
        inputOrOutput.openPort(i);
        return;
    }
    throw new Error("MIDI ".concat(type, " port ").concat(midiPortName, " not found!"));
});
//# sourceMappingURL=openMidiPort.js.map