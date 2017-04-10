'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ZoneScheduler = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isNil = isNil;
exports.hasKey = hasKey;
exports.isString = isString;
exports.isFirebaseRef = isFirebaseRef;
exports.isFirebaseDataSnapshot = isFirebaseDataSnapshot;
exports.isAFUnwrappedSnapshot = isAFUnwrappedSnapshot;
exports.isFirebaseQuery = isFirebaseQuery;
exports.isEmptyObject = isEmptyObject;
exports.unwrapMapFn = unwrapMapFn;
exports.checkForUrlOrFirebaseRef = checkForUrlOrFirebaseRef;
exports.stripTrailingSlash = stripTrailingSlash;
exports.stripLeadingSlash = stripLeadingSlash;

var _queue = require('rxjs/scheduler/queue');

function isNil(obj) {
    return obj === undefined || obj === null;
}
function hasKey(obj, key) {
    return obj && obj[key] !== undefined;
}
function isString(value) {
    return typeof value === 'string';
}
function isFirebaseRef(value) {
    return typeof value.set === 'function';
}
function isFirebaseDataSnapshot(value) {
    return typeof value.exportVal === 'function';
}
function isAFUnwrappedSnapshot(value) {
    return typeof value.$key === 'string';
}
function isFirebaseQuery(value) {
    return typeof value.orderByChild === 'function';
}
function isEmptyObject(obj) {
    if (isNil(obj)) {
        return false;
    }
    return Object.keys(obj).length === 0 && JSON.stringify(obj) === JSON.stringify({});
}
function unwrapMapFn(snapshot) {
    var unwrapped = !isNil(snapshot.val()) ? snapshot.val() : { $value: null };
    if (/string|number|boolean/.test(typeof unwrapped === 'undefined' ? 'undefined' : _typeof(unwrapped))) {
        unwrapped = {
            $value: unwrapped
        };
    }
    Object.defineProperty(unwrapped, '$key', {
        value: snapshot.ref.key,
        enumerable: false
    });
    Object.defineProperty(unwrapped, '$exists', {
        value: function value() {
            return snapshot.exists();
        },
        enumerable: false
    });
    return unwrapped;
}
function checkForUrlOrFirebaseRef(urlOrRef, cases) {
    if (isString(urlOrRef)) {
        return cases.isUrl();
    }
    if (isFirebaseRef(urlOrRef)) {
        return cases.isRef();
    }
    if (isFirebaseQuery(urlOrRef)) {
        return cases.isQuery();
    }
    throw new Error('Provide a url or a Firebase database reference');
}
function stripTrailingSlash(value) {
    if (value.substring(value.length - 1, value.length) === '/') {
        return value.substring(0, value.length - 1);
    } else {
        return value;
    }
}
function stripLeadingSlash(value) {
    if (value.substring(0, 1) === '/') {
        return value.substring(1, value.length);
    } else {
        return value;
    }
}
var ZoneScheduler = function () {
    function ZoneScheduler(zone) {
        this.zone = zone;
    }
    ZoneScheduler.prototype.schedule = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.zone.run(function () {
            return _queue.queue.schedule.apply(_queue.queue, args);
        });
    };
    return ZoneScheduler;
}();
exports.ZoneScheduler = ZoneScheduler;
//# sourceMappingURL=utils.js.map