'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FirebaseListObservable = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Observable = require('rxjs/Observable');

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var __extends = undefined && undefined.__extends || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

var FirebaseListObservable = function (_super) {
    __extends(FirebaseListObservable, _super);
    function FirebaseListObservable($ref, subscribe) {
        var _this = _super.call(this, subscribe) || this;
        _this.$ref = $ref;
        return _this;
    }
    FirebaseListObservable.prototype.lift = function (operator) {
        var observable = new FirebaseListObservable(this.$ref);
        observable.source = this;
        observable.operator = operator;
        observable.$ref = this.$ref;
        return observable;
    };
    FirebaseListObservable.prototype.push = function (val) {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.ref.push(val);
    };
    FirebaseListObservable.prototype.update = function (item, value) {
        var _this = this;
        return this._checkOperationCases(item, {
            stringCase: function stringCase() {
                return _this.$ref.ref.child(item).update(value);
            },
            firebaseCase: function firebaseCase() {
                return item.update(value);
            },
            snapshotCase: function snapshotCase() {
                return item.ref.update(value);
            },
            unwrappedSnapshotCase: function unwrappedSnapshotCase() {
                return _this.$ref.ref.child(item.$key).update(value);
            }
        });
    };
    FirebaseListObservable.prototype.remove = function (item) {
        var _this = this;
        if (!item) {
            return this.$ref.ref.remove();
        }
        return this._checkOperationCases(item, {
            stringCase: function stringCase() {
                return _this.$ref.ref.child(item).remove();
            },
            firebaseCase: function firebaseCase() {
                return item.remove();
            },
            snapshotCase: function snapshotCase() {
                return item.ref.remove();
            },
            unwrappedSnapshotCase: function unwrappedSnapshotCase() {
                return _this.$ref.ref.child(item.$key).remove();
            }
        });
    };
    FirebaseListObservable.prototype._checkOperationCases = function (item, cases) {
        if (utils.isString(item)) {
            return cases.stringCase();
        } else if (utils.isFirebaseRef(item)) {
            return cases.firebaseCase();
        } else if (utils.isFirebaseDataSnapshot(item)) {
            return cases.snapshotCase();
        } else if (utils.isAFUnwrappedSnapshot(item)) {
            return cases.unwrappedSnapshotCase();
        }
        throw new Error("Method requires a key, snapshot, reference, or unwrapped snapshot. Got: " + (typeof item === 'undefined' ? 'undefined' : _typeof(item)));
    };
    return FirebaseListObservable;
}(_Observable.Observable);
exports.FirebaseListObservable = FirebaseListObservable;
//# sourceMappingURL=firebase_list_observable.js.map