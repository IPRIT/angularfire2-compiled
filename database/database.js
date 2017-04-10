"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AngularFireDatabase = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require("@angular/core");

var _tokens = require("../tokens");

var _index = require("./index");

var _utils = require("../utils");

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

var AngularFireDatabase = function () {
    function AngularFireDatabase(fbConfig, fbApp) {
        this.fbConfig = fbConfig;
        this.fbApp = fbApp;
    }
    AngularFireDatabase.prototype.list = function (urlOrRef, opts) {
        var _this = this;
        return utils.checkForUrlOrFirebaseRef(urlOrRef, {
            isUrl: function isUrl() {
                return (0, _index.FirebaseListFactory)(_this.fbApp.database().refFromURL(getAbsUrl(_this.fbConfig, urlOrRef)), opts);
            },
            isRef: function isRef() {
                return (0, _index.FirebaseListFactory)(urlOrRef);
            }
        });
    };
    AngularFireDatabase.prototype.object = function (urlOrRef, opts) {
        var _this = this;
        return utils.checkForUrlOrFirebaseRef(urlOrRef, {
            isUrl: function isUrl() {
                return (0, _index.FirebaseObjectFactory)(_this.fbApp.database().refFromURL(getAbsUrl(_this.fbConfig, urlOrRef)), opts);
            },
            isRef: function isRef() {
                return (0, _index.FirebaseObjectFactory)(urlOrRef);
            }
        });
    };
    return AngularFireDatabase;
}();
exports.AngularFireDatabase = AngularFireDatabase = __decorate([(0, _core.Injectable)(), __param(0, (0, _core.Inject)(_tokens.FirebaseConfig)), __param(1, (0, _core.Inject)(_tokens.FirebaseApp)), __metadata("design:paramtypes", [Object, Object])], AngularFireDatabase);
exports.AngularFireDatabase = AngularFireDatabase;

function getAbsUrl(root, url) {
    if (!/^[a-z]+:\/\/.*/.test(url)) {
        url = root.databaseURL + '/' + utils.stripLeadingSlash(url);
    }
    return url;
}
//# sourceMappingURL=database.js.map