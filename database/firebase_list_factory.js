'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FirebaseListFactory = FirebaseListFactory;
exports.onChildAdded = onChildAdded;
exports.onChildChanged = onChildChanged;
exports.onChildRemoved = onChildRemoved;
exports.onChildUpdated = onChildUpdated;

var _firebase = require('firebase');

var firebase = _interopRequireWildcard(_firebase);

var _firebase_list_observable = require('./firebase_list_observable');

var _observeOn = require('rxjs/operator/observeOn');

var _query_observable = require('./query_observable');

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _mergeMap = require('rxjs/operator/mergeMap');

var _map = require('rxjs/operator/map');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function FirebaseListFactory(absoluteUrlOrDbRef, _a) {
    var _b = _a === void 0 ? {} : _a,
        preserveSnapshot = _b.preserveSnapshot,
        _c = _b.query,
        query = _c === void 0 ? {} : _c;
    var ref;
    utils.checkForUrlOrFirebaseRef(absoluteUrlOrDbRef, {
        isUrl: function isUrl() {
            return ref = firebase.database().refFromURL(absoluteUrlOrDbRef);
        },
        isRef: function isRef() {
            return ref = absoluteUrlOrDbRef;
        },
        isQuery: function isQuery() {
            return ref = absoluteUrlOrDbRef;
        }
    });
    if ((utils.isFirebaseRef(absoluteUrlOrDbRef) || utils.isString(absoluteUrlOrDbRef)) && utils.isEmptyObject(query)) {
        return firebaseListObservable(ref, { preserveSnapshot: preserveSnapshot });
    }
    var queryObs = (0, _query_observable.observeQuery)(query);
    return new _firebase_list_observable.FirebaseListObservable(ref, function (subscriber) {
        var sub = _mergeMap.mergeMap.call(_map.map.call(queryObs, function (query) {
            var queried = ref;
            if (query.orderByChild) {
                queried = queried.orderByChild(query.orderByChild);
            } else if (query.orderByKey) {
                queried = queried.orderByKey();
            } else if (query.orderByPriority) {
                queried = queried.orderByPriority();
            } else if (query.orderByValue) {
                queried = queried.orderByValue();
            }
            if (utils.hasKey(query, "equalTo")) {
                queried = queried.equalTo(query.equalTo);
                if (utils.hasKey(query, "startAt") || utils.hasKey(query, "endAt")) {
                    throw new Error('Query Error: Cannot use startAt or endAt with equalTo.');
                }
                if (!utils.isNil(query.limitToFirst)) {
                    queried = queried.limitToFirst(query.limitToFirst);
                }
                if (!utils.isNil(query.limitToLast)) {
                    queried = queried.limitToLast(query.limitToLast);
                }
                return queried;
            }
            if (utils.hasKey(query, "startAt")) {
                if (utils.hasKey(query.startAt, "value")) {
                    queried = queried.startAt(query.startAt.value, query.startAt.key);
                } else {
                    queried = queried.startAt(query.startAt);
                }
            }
            if (utils.hasKey(query, "endAt")) {
                queried = queried.endAt(query.endAt);
            }
            if (!utils.isNil(query.limitToFirst) && query.limitToLast) {
                throw new Error('Query Error: Cannot use limitToFirst with limitToLast.');
            }
            if (!utils.isNil(query.limitToFirst)) {
                queried = queried.limitToFirst(query.limitToFirst);
            }
            if (!utils.isNil(query.limitToLast)) {
                queried = queried.limitToLast(query.limitToLast);
            }
            return queried;
        }), function (queryRef, ix) {
            return firebaseListObservable(queryRef, { preserveSnapshot: preserveSnapshot });
        }).subscribe(subscriber);
        return function () {
            return sub.unsubscribe();
        };
    });
}
function firebaseListObservable(ref, _a) {
    var preserveSnapshot = (_a === void 0 ? {} : _a).preserveSnapshot;
    var toValue = preserveSnapshot ? function (snapshot) {
        return snapshot;
    } : utils.unwrapMapFn;
    var toKey = preserveSnapshot ? function (value) {
        return value.key;
    } : function (value) {
        return value.$key;
    };
    var listObs = new _firebase_list_observable.FirebaseListObservable(ref, function (obs) {
        var handles = [];
        var hasLoaded = false;
        var lastLoadedKey = null;
        var array = [];
        ref.once('value', function (snap) {
            if (snap.exists()) {
                snap.forEach(function (child) {
                    lastLoadedKey = child.key;
                });
                if (array.find(function (child) {
                        return toKey(child) === lastLoadedKey;
                    })) {
                    hasLoaded = true;
                    obs.next(array);
                }
            } else {
                hasLoaded = true;
                obs.next(array);
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        var addFn = ref.on('child_added', function (child, prevKey) {
            array = onChildAdded(array, toValue(child), toKey, prevKey);
            if (hasLoaded) {
                obs.next(array);
            } else if (child.key === lastLoadedKey) {
                hasLoaded = true;
                obs.next(array);
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        handles.push({ event: 'child_added', handle: addFn });
        var remFn = ref.on('child_removed', function (child) {
            array = onChildRemoved(array, toValue(child), toKey);
            if (hasLoaded) {
                obs.next(array);
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        handles.push({ event: 'child_removed', handle: remFn });
        var chgFn = ref.on('child_changed', function (child, prevKey) {
            array = onChildChanged(array, toValue(child), toKey, prevKey);
            if (hasLoaded) {
                obs.next(array);
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        handles.push({ event: 'child_changed', handle: chgFn });
        return function () {
            handles.forEach(function (item) {
                ref.off(item.event, item.handle);
            });
        };
    });
    return _observeOn.observeOn.call(listObs, new utils.ZoneScheduler(Zone.current));
}
function onChildAdded(arr, child, toKey, prevKey) {
    if (!arr.length) {
        return [child];
    }
    return arr.reduce(function (accumulator, curr, i) {
        if (!prevKey && i === 0) {
            accumulator.push(child);
        }
        accumulator.push(curr);
        if (prevKey && prevKey === toKey(curr)) {
            accumulator.push(child);
        }
        return accumulator;
    }, []);
}
function onChildChanged(arr, child, toKey, prevKey) {
    var childKey = toKey(child);
    return arr.reduce(function (accumulator, val, i) {
        var valKey = toKey(val);
        if (!prevKey && i == 0) {
            accumulator.push(child);
            if (valKey !== childKey) {
                accumulator.push(val);
            }
        } else if (valKey === prevKey) {
            accumulator.push(val);
            accumulator.push(child);
        } else if (valKey !== childKey) {
            accumulator.push(val);
        }
        return accumulator;
    }, []);
}
function onChildRemoved(arr, child, toKey) {
    var childKey = toKey(child);
    return arr.filter(function (c) {
        return toKey(c) !== childKey;
    });
}
function onChildUpdated(arr, child, toKey, prevKey) {
    return arr.map(function (v, i, arr) {
        if (!prevKey && !i) {
            return child;
        } else if (i > 0 && toKey(arr[i - 1]) === prevKey) {
            return child;
        } else {
            return v;
        }
    });
}
//# sourceMappingURL=firebase_list_factory.js.map