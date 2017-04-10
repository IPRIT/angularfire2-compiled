"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FirebaseSdkAuthBackend = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _firebase = require("firebase");

var firebase = _interopRequireWildcard(_firebase);

var _core = require("@angular/core");

var _Observable = require("rxjs/Observable");

var _tokens = require("../tokens");

var _utils = require("../utils");

var _auth_backend = require("./auth_backend");

var _map = require("rxjs/operator/map");

var _fromPromise = require("rxjs/observable/fromPromise");

var _observeOn = require("rxjs/operator/observeOn");

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

var _a = firebase.auth,
    FacebookAuthProvider = _a.FacebookAuthProvider,
    GithubAuthProvider = _a.GithubAuthProvider,
    GoogleAuthProvider = _a.GoogleAuthProvider,
    TwitterAuthProvider = _a.TwitterAuthProvider;

var FirebaseSdkAuthBackend = function (_super) {
    __extends(FirebaseSdkAuthBackend, _super);
    function FirebaseSdkAuthBackend(_fbApp) {
        var _this = _super.call(this) || this;
        _this._fbAuth = _fbApp.auth();
        return _this;
    }
    FirebaseSdkAuthBackend.prototype.createUser = function (creds) {
        return castPromise(this._fbAuth.createUserWithEmailAndPassword(creds.email, creds.password)).then(function (user) {
            return (0, _auth_backend.authDataToAuthState)(user);
        });
    };
    FirebaseSdkAuthBackend.prototype.getAuth = function () {
        return (0, _auth_backend.authDataToAuthState)(this._fbAuth.currentUser);
    };
    FirebaseSdkAuthBackend.prototype.onAuth = function () {
        var _this = this;
        var stateChange = _Observable.Observable.create(function (observer) {
            return _this._fbAuth.onAuthStateChanged(observer);
        });
        var authState = _map.map.call(stateChange, function (user) {
            if (!user) return null;
            return (0, _auth_backend.authDataToAuthState)(user, user.providerData[0]);
        });
        return _observeOn.observeOn.call(authState, new _utils.ZoneScheduler(Zone.current));
    };
    FirebaseSdkAuthBackend.prototype.unauth = function () {
        return this._fbAuth.signOut();
    };
    FirebaseSdkAuthBackend.prototype.authWithCustomToken = function (token) {
        return castPromise(this._fbAuth.signInWithCustomToken(token)).then(function (user) {
            return (0, _auth_backend.authDataToAuthState)(user);
        });
    };
    FirebaseSdkAuthBackend.prototype.authAnonymously = function () {
        return castPromise(this._fbAuth.signInAnonymously()).then(function (user) {
            return (0, _auth_backend.authDataToAuthState)(user);
        });
    };
    FirebaseSdkAuthBackend.prototype.authWithPassword = function (creds) {
        return castPromise(this._fbAuth.signInWithEmailAndPassword(creds.email, creds.password)).then(function (user) {
            return (0, _auth_backend.authDataToAuthState)(user);
        });
    };
    FirebaseSdkAuthBackend.prototype.authWithOAuthPopup = function (provider, options) {
        var providerFromFirebase = this._enumToAuthProvider(provider);
        if (options.scope) {
            options.scope.forEach(function (scope) {
                return providerFromFirebase.addScope(scope);
            });
        }
        return castPromise(this._fbAuth.signInWithPopup(providerFromFirebase));
    };
    FirebaseSdkAuthBackend.prototype.authWithOAuthRedirect = function (provider, options) {
        return castPromise(this._fbAuth.signInWithRedirect(this._enumToAuthProvider(provider)));
    };
    FirebaseSdkAuthBackend.prototype.authWithOAuthToken = function (credential) {
        return castPromise(this._fbAuth.signInWithCredential(credential)).then(function (user) {
            return (0, _auth_backend.authDataToAuthState)(user);
        });
    };
    FirebaseSdkAuthBackend.prototype.getRedirectResult = function () {
        return (0, _fromPromise.fromPromise)(castPromise(this._fbAuth.getRedirectResult()));
    };
    FirebaseSdkAuthBackend.prototype._enumToAuthProvider = function (providerId) {
        switch (providerId) {
            case _auth_backend.AuthProviders.Github:
                return new GithubAuthProvider();
            case _auth_backend.AuthProviders.Twitter:
                return new TwitterAuthProvider();
            case _auth_backend.AuthProviders.Facebook:
                return new FacebookAuthProvider();
            case _auth_backend.AuthProviders.Google:
                return new GoogleAuthProvider();
            default:
                throw new Error("Unsupported firebase auth provider " + providerId);
        }
    };
    return FirebaseSdkAuthBackend;
}(_auth_backend.AuthBackend);
exports.FirebaseSdkAuthBackend = FirebaseSdkAuthBackend = __decorate([(0, _core.Injectable)(), __param(0, (0, _core.Inject)(_tokens.FirebaseApp)), __metadata("design:paramtypes", [Object])], FirebaseSdkAuthBackend);
exports.FirebaseSdkAuthBackend = FirebaseSdkAuthBackend;

function castPromise(promiseLike) {
    return Promise.resolve(promiseLike);
}
//# sourceMappingURL=firebase_sdk_auth_backend.js.map