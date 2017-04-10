"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AngularFireAuth = exports.firebaseAuthConfig = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require("@angular/core");

var _ReplaySubject = require("rxjs/ReplaySubject");

var _tokens = require("../tokens");

var _utils = require("../utils");

var utils = _interopRequireWildcard(_utils);

var _auth_backend = require("./auth_backend");

var _mergeMap = require("rxjs/operator/mergeMap");

var _of = require("rxjs/observable/of");

var _map = require("rxjs/operator/map");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var __extends = undefined && undefined.__extends || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
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

var kBufferSize = 1;
var firebaseAuthConfig = exports.firebaseAuthConfig = function firebaseAuthConfig(config) {
    return { provide: _tokens.FirebaseAuthConfig, useValue: config };
};
var AngularFireAuth = function (_super) {
    __extends(AngularFireAuth, _super);
    function AngularFireAuth(_authBackend, loc, _config) {
        var _this = _super.call(this, kBufferSize) || this;
        _this._authBackend = _authBackend;
        _this._config = _config;
        _this._credentialCache = {};
        var firstPass = true;
        var onAuth = _this._authBackend.onAuth();
        _mergeMap.mergeMap.call(onAuth, function (authState) {
            if (firstPass) {
                firstPass = false;
                if (['http:', 'https:'].indexOf(loc.protocol) > -1) {
                    return _map.map.call(_this._authBackend.getRedirectResult(), function (userCredential) {
                        if (userCredential && userCredential.credential) {
                            authState = attachCredentialToAuthState(authState, userCredential.credential, userCredential.credential.provider);
                            _this._credentialCache[userCredential.credential.provider] = userCredential.credential;
                        }
                        return authState;
                    });
                }
            }
            return (0, _of.of)(authState);
        }).subscribe(function (authData) {
            return _this._emitAuthData(authData);
        });
        return _this;
    }
    AngularFireAuth.prototype.login = function (obj1, obj2) {
        var _this = this;
        var config = null;
        var credentials = null;
        if (arguments.length > 2) {
            return this._reject('Login only accepts a maximum of two arguments.');
        } else if (arguments.length == 2) {
            credentials = obj1;
            config = obj2;
        } else if (arguments.length == 1) {
            if (obj1.password && obj1.email) {
                credentials = obj1;
                config = {};
            } else {
                config = obj1;
            }
        }
        config = this._mergeConfigs(config);
        if (utils.isNil(config.method)) {
            return this._reject('You must provide a login method');
        }
        var providerMethods = [_auth_backend.AuthMethods.Popup, _auth_backend.AuthMethods.Redirect, _auth_backend.AuthMethods.OAuthToken];
        if (providerMethods.indexOf(config.method) != -1) {
            if (utils.isNil(config.provider)) {
                return this._reject('You must include a provider to use this auth method.');
            }
        }
        var credentialsMethods = [_auth_backend.AuthMethods.Password, _auth_backend.AuthMethods.OAuthToken, _auth_backend.AuthMethods.CustomToken];
        if (credentialsMethods.indexOf(config.method) != -1) {
            if (!credentials) {
                return this._reject('You must include credentials to use this auth method.');
            }
        }
        switch (config.method) {
            case _auth_backend.AuthMethods.Popup:
                return this._authBackend.authWithOAuthPopup(config.provider, this._scrubConfig(config)).then(function (userCredential) {
                    _this._credentialCache[userCredential.credential.provider] = userCredential.credential;
                    return (0, _auth_backend.authDataToAuthState)(userCredential.user, userCredential.credential);
                });
            case _auth_backend.AuthMethods.Redirect:
                return this._authBackend.authWithOAuthRedirect(config.provider, this._scrubConfig(config));
            case _auth_backend.AuthMethods.Anonymous:
                return this._authBackend.authAnonymously(this._scrubConfig(config));
            case _auth_backend.AuthMethods.Password:
                return this._authBackend.authWithPassword(credentials);
            case _auth_backend.AuthMethods.OAuthToken:
                return this._authBackend.authWithOAuthToken(credentials, this._scrubConfig(config));
            case _auth_backend.AuthMethods.CustomToken:
                return this._authBackend.authWithCustomToken(credentials);
        }
    };
    AngularFireAuth.prototype.logout = function () {
        return this._authBackend.unauth();
    };
    AngularFireAuth.prototype.getAuth = function () {
        console.warn("WARNING: the getAuth() API has changed behavior since adding support for Firebase 3.\n    This will return null for the initial value when the page loads, even if the user is actually logged in.\n    Please observe the actual authState asynchronously by subscribing to the auth service: af.auth.subscribe().\n    The getAuth method will be removed in future releases");
        return this._authBackend.getAuth();
    };
    AngularFireAuth.prototype.createUser = function (credentials) {
        return this._authBackend.createUser(credentials);
    };
    AngularFireAuth.prototype._mergeConfigs = function (config) {
        if (this._config == null) return config;
        return Object.assign({}, this._config, config);
    };
    AngularFireAuth.prototype._reject = function (msg) {
        return new Promise(function (res, rej) {
            return rej(msg);
        });
    };
    AngularFireAuth.prototype._scrubConfig = function (config, scrubProvider) {
        if (scrubProvider === void 0) {
            scrubProvider = true;
        }
        var scrubbed = Object.assign({}, config);
        if (scrubProvider) {
            delete scrubbed.provider;
        }
        delete scrubbed.method;
        return scrubbed;
    };
    AngularFireAuth.prototype._emitAuthData = function (authData) {
        if (authData == null) {
            this.next(null);
        } else {
            if (authData.auth && authData.auth.providerData && authData.auth.providerData[0]) {
                var providerId = authData.auth.providerData[0].providerId;
                var providerCredential = this._credentialCache[providerId];
                if (providerCredential) {
                    authData = attachCredentialToAuthState(authData, providerCredential, providerId);
                }
            }
            this.next(authData);
        }
    };
    return AngularFireAuth;
}(_ReplaySubject.ReplaySubject);
exports.AngularFireAuth = AngularFireAuth = __decorate([(0, _core.Injectable)(), __param(1, (0, _core.Inject)(_tokens.WindowLocation)), __param(2, (0, _core.Optional)()), __param(2, (0, _core.Inject)(_tokens.FirebaseAuthConfig)), __metadata("design:paramtypes", [_auth_backend.AuthBackend, Object, Object])], AngularFireAuth);
exports.AngularFireAuth = AngularFireAuth;

function attachCredentialToAuthState(authState, credential, providerId) {
    if (!authState) return authState;
    authState[(0, _auth_backend.stripProviderId)(providerId)] = credential;
    return authState;
}
//# sourceMappingURL=auth.js.map