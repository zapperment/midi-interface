"use strict";
exports.__esModule = true;
exports["default"] = (function (message) {
    var manufacturerIdLength = message[1] === 0x0 ? 3 : 1;
    return {
        manufacturerId: message.slice(1, manufacturerIdLength + 1),
        data: message.slice(manufacturerIdLength + 1, message.length - 1)
    };
});
//# sourceMappingURL=splitSysEx.js.map