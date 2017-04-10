"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports._getFirebase = _getFirebase;
exports._getWindowLocation = _getWindowLocation;
exports._getAuthBackend = _getAuthBackend;
exports._getDefaultFirebase = _getDefaultFirebase;

var _tokens = require("./tokens");

Object.defineProperty(exports, "FirebaseConfig", {
    enumerable: true,
    get: function get() {
        return _tokens.FirebaseConfig;
    }
});
Object.defineProperty(exports, "FirebaseApp", {
    enumerable: true,
    get: function get() {
        return _tokens.FirebaseApp;
    }
});
Object.defineProperty(exports, "FirebaseAuthConfig", {
    enumerable: true,
    get: function get() {
        return _tokens.FirebaseAuthConfig;
    }
});
Object.defineProperty(exports, "FirebaseRef", {
    enumerable: true,
    get: function get() {
        return _tokens.FirebaseRef;
    }
});
Object.defineProperty(exports, "FirebaseUrl", {
    enumerable: true,
    get: function get() {
        return _tokens.FirebaseUrl;
    }
});
Object.defineProperty(exports, "FirebaseUserConfig", {
    enumerable: true,
    get: function get() {
        return _tokens.FirebaseUserConfig;
    }
});
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
            if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
var __metadata = undefined && undefined.__metadata || function (k, v) {
        if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
var __param = undefined && undefined.__param || function (paramIndex, decorator) {
        return function (target, key) {
            decorator(target, key, paramIndex);
        };
    };
var firebase = require('firebase');
var utils = require('./utils');
/*import * as firebase from 'firebase';
 import * as utils from './utils';*/

var FirebaseConfig = require('./tokens').FirebaseConfig;
var FirebaseApp = require('./tokens').FirebaseApp;
var WindowLocation = require('./tokens').WindowLocation;
var FirebaseUserConfig = require('./tokens').FirebaseUserConfig;
var FirebaseAuthConfig = require('./tokens').FirebaseAuthConfig;
var FirebaseAppName = require('./tokens').FirebaseAppName;
//import { FirebaseConfig, FirebaseApp, WindowLocation, FirebaseUserConfig, FirebaseAuthConfig, FirebaseAppName } from './tokens';

var Inject = require('@angular/core').Inject;
var Injectable = require('@angular/core').Injectable;
var NgModule = require('@angular/core').NgModule;
//import { Inject, Injectable, NgModule } from '@angular/core';

var FirebaseSdkAuthBackend = require('./auth/index').FirebaseSdkAuthBackend;
var AngularFireAuth = require('./auth/index').AngularFireAuth;
var firebaseAuthConfig = require('./auth/index').firebaseAuthConfig;
var AuthBackend = require('./auth/index').AuthBackend;
var AuthMethods = require('./auth/index').AuthMethods;
var AuthProviders = require('./auth/index').AuthProviders;
//import { FirebaseSdkAuthBackend, AngularFireAuth, firebaseAuthConfig, AuthBackend, AuthMethods, AuthProviders } from './auth/index';

var FirebaseListObservable = require('./database/index').FirebaseListObservable;
var FirebaseObjectObservable = require('./database/index').FirebaseObjectObservable;
var FirebaseListFactory = require('./database/index').FirebaseListFactory;
var FirebaseObjectFactory = require('./database/index').FirebaseObjectFactory;
var AngularFireDatabase = require('./database/index').AngularFireDatabase;
//import { FirebaseListObservable, FirebaseObjectObservable, FirebaseListFactory, FirebaseObjectFactory, AngularFireDatabase } from './database/index';

var AngularFire = function () {
    function AngularFire(firebaseConfig, auth, database) {
        this.firebaseConfig = firebaseConfig;
        this.auth = auth;
        this.database = database;
    }
    return AngularFire;
}();
exports.AngularFire = AngularFire = __decorate([Injectable(), __param(0, Inject(FirebaseConfig)), __metadata("design:paramtypes", [Object, AngularFireAuth, AngularFireDatabase])], AngularFire);
exports.AngularFire = AngularFire;
function _getFirebase(config, appName) {
    try {
        if (appName) {
            return firebase.initializeApp(config, appName);
        } else {
            return firebase.initializeApp(config);
        }
    } catch (e) {
        return firebase.app(null);
    }
}
function _getWindowLocation() {
    return window.location;
}
function _getAuthBackend(app) {
    return new FirebaseSdkAuthBackend(app);
}
function _getDefaultFirebase(config) {
    config.databaseURL = utils.stripTrailingSlash(config.databaseURL);
    return config;
}
var COMMON_PROVIDERS = exports.COMMON_PROVIDERS = [{
    provide: FirebaseApp,
    useFactory: _getFirebase,
    deps: [FirebaseConfig, FirebaseAppName]
}, AngularFireAuth, AngularFire, AngularFireDatabase];
var FIREBASE_PROVIDERS = exports.FIREBASE_PROVIDERS = [COMMON_PROVIDERS, {
    provide: AuthBackend,
    useFactory: _getAuthBackend,
    deps: [FirebaseApp]
}, {
    provide: WindowLocation,
    useFactory: _getWindowLocation
}];
var defaultFirebase = exports.defaultFirebase = function defaultFirebase(config) {
    return [{ provide: FirebaseUserConfig, useValue: config }, { provide: FirebaseConfig, useFactory: _getDefaultFirebase, deps: [FirebaseUserConfig] }];
};
var AngularFireModule = AngularFireModule_1 = function () {
    function AngularFireModule() {}
    AngularFireModule.initializeApp = function (config, authConfig, appName) {
        return {
            ngModule: AngularFireModule_1,
            providers: [{ provide: FirebaseUserConfig, useValue: config }, { provide: FirebaseConfig, useFactory: _getDefaultFirebase, deps: [FirebaseUserConfig] }, { provide: FirebaseAuthConfig, useValue: authConfig }, { provide: FirebaseAppName, useValue: appName }]
        };
    };
    return AngularFireModule;
}();
exports.AngularFireModule = AngularFireModule = AngularFireModule_1 = __decorate([NgModule({
    providers: FIREBASE_PROVIDERS
})], AngularFireModule);
exports.AngularFireModule = AngularFireModule;
exports.AngularFireAuth = AngularFireAuth;
exports.AngularFireDatabase = AngularFireDatabase;
exports.FirebaseListObservable = FirebaseListObservable;
exports.FirebaseObjectObservable = FirebaseObjectObservable;
exports.FirebaseListFactory = FirebaseListFactory;
exports.FirebaseObjectFactory = FirebaseObjectFactory;
exports.firebaseAuthConfig = firebaseAuthConfig;
exports.AuthMethods = AuthMethods;
exports.AuthProviders = AuthProviders;
exports.WindowLocation = WindowLocation;

var AngularFireModule_1;
//# sourceMappingURL=angularfire2.js.map