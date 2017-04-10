'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FirebaseUrl = exports.FirebaseRef = exports.WindowLocation = exports.FirebaseAppName = exports.FirebaseUserConfig = exports.FirebaseAuthConfig = exports.FirebaseApp = exports.FirebaseConfig = undefined;

var _core = require('@angular/core');

var FirebaseConfig = exports.FirebaseConfig = new _core.OpaqueToken('FirebaseUrl');
var FirebaseApp = exports.FirebaseApp = new _core.OpaqueToken('FirebaseApp');
var FirebaseAuthConfig = exports.FirebaseAuthConfig = new _core.OpaqueToken('FirebaseAuthConfig');
var FirebaseUserConfig = exports.FirebaseUserConfig = new _core.OpaqueToken('FirebaseUserConfig');
var FirebaseAppName = exports.FirebaseAppName = new _core.OpaqueToken('FirebaseAppName');
var WindowLocation = exports.WindowLocation = new _core.OpaqueToken('WindowLocation');
var FirebaseRef = exports.FirebaseRef = FirebaseApp;
var FirebaseUrl = exports.FirebaseUrl = FirebaseConfig;
//# sourceMappingURL=tokens.js.map