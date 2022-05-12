"use strict";
exports.__esModule = true;
exports["default"] = (function (bytes) {
    return bytes.reduce(function (acc, curr) { return "".concat(acc).concat(curr.toString(16).padStart(2, "0")); }, "");
});
//# sourceMappingURL=convertBytesToString.js.map