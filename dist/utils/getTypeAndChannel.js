"use strict";
exports.__esModule = true;
var constants_1 = require("../constants");
exports["default"] = (function (message) {
    var status = message[0];
    var type;
    var channel = null;
    if (status < constants_1.SYSEX_START) {
        type = (status >> 4) << 4;
        channel = (status & 0x0f) + 1;
    }
    else {
        type = status;
    }
    return { type: type, channel: channel };
});
//# sourceMappingURL=getTypeAndChannel.js.map