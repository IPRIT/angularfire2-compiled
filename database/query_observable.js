'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.observeQuery = observeQuery;
exports.getOrderObservables = getOrderObservables;
exports.getLimitToObservables = getLimitToObservables;
exports.getStartAtObservable = getStartAtObservable;
exports.getEndAtObservable = getEndAtObservable;
exports.getEqualToObservable = getEqualToObservable;

var _Observable = require('rxjs/Observable');

var _of = require('rxjs/observable/of');

var _combineLatest = require('rxjs/operator/combineLatest');

var _merge = require('rxjs/operator/merge');

var _map = require('rxjs/operator/map');

var _auditTime = require('rxjs/operator/auditTime');

var _interfaces = require('../interfaces');

var _utils = require('../utils');

function observeQuery(query, audit) {
    if (audit === void 0) {
        audit = true;
    }
    if ((0, _utils.isNil)(query)) {
        return (0, _of.of)(null);
    }
    return _Observable.Observable.create(function (observer) {
        var combined = _combineLatest.combineLatest.call(getOrderObservables(query), getStartAtObservable(query), getEndAtObservable(query), getEqualToObservable(query), getLimitToObservables(query));
        if (audit) {
            combined = _auditTime.auditTime.call(combined, 0);
        }
        combined.subscribe(function (_a) {
            var orderBy = _a[0],
                startAt = _a[1],
                endAt = _a[2],
                equalTo = _a[3],
                limitTo = _a[4];
            var serializedOrder = {};
            if (!(0, _utils.isNil)(orderBy) && !(0, _utils.isNil)(orderBy.value)) {
                switch (orderBy.key) {
                    case _interfaces.OrderByOptions.Key:
                        serializedOrder = { orderByKey: orderBy.value };
                        break;
                    case _interfaces.OrderByOptions.Priority:
                        serializedOrder = { orderByPriority: orderBy.value };
                        break;
                    case _interfaces.OrderByOptions.Value:
                        serializedOrder = { orderByValue: orderBy.value };
                        break;
                    case _interfaces.OrderByOptions.Child:
                        serializedOrder = { orderByChild: orderBy.value };
                        break;
                }
            }
            if (!(0, _utils.isNil)(limitTo) && !(0, _utils.isNil)(limitTo.value)) {
                switch (limitTo.key) {
                    case _interfaces.LimitToOptions.First:
                        serializedOrder.limitToFirst = limitTo.value;
                        break;
                    case _interfaces.LimitToOptions.Last:
                    {
                        serializedOrder.limitToLast = limitTo.value;
                        break;
                    }
                }
            }
            if (startAt !== undefined) {
                serializedOrder.startAt = startAt;
            }
            if (endAt !== undefined) {
                serializedOrder.endAt = endAt;
            }
            if (equalTo !== undefined) {
                serializedOrder.equalTo = equalTo;
            }
            observer.next(serializedOrder);
        });
    });
}
function getOrderObservables(query) {
    var observables = ['orderByChild', 'orderByKey', 'orderByValue', 'orderByPriority'].map(function (key, option) {
        return { key: key, option: option };
    }).filter(function (_a) {
        var key = _a.key,
            option = _a.option;
        return !(0, _utils.isNil)(query[key]);
    }).map(function (_a) {
        var key = _a.key,
            option = _a.option;
        return mapToOrderBySelection(query[key], option);
    });
    if (observables.length === 1) {
        return observables[0];
    } else if (observables.length > 1) {
        return _merge.merge.apply(observables[0], observables.slice(1));
    } else {
        return new _Observable.Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
function getLimitToObservables(query) {
    var observables = ['limitToFirst', 'limitToLast'].map(function (key, option) {
        return { key: key, option: option };
    }).filter(function (_a) {
        var key = _a.key,
            option = _a.option;
        return !(0, _utils.isNil)(query[key]);
    }).map(function (_a) {
        var key = _a.key,
            option = _a.option;
        return mapToLimitToSelection(query[key], option);
    });
    if (observables.length === 1) {
        return observables[0];
    } else if (observables.length > 1) {
        var mergedObs = _merge.merge.apply(observables[0], observables.slice(1));
        return mergedObs;
    } else {
        return new _Observable.Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
function getStartAtObservable(query) {
    if (query.startAt instanceof _Observable.Observable) {
        return query.startAt;
    } else if ((0, _utils.hasKey)(query, 'startAt')) {
        return new _Observable.Observable(function (subscriber) {
            subscriber.next(query.startAt);
        });
    } else {
        return new _Observable.Observable(function (subscriber) {
            subscriber.next(undefined);
        });
    }
}
function getEndAtObservable(query) {
    if (query.endAt instanceof _Observable.Observable) {
        return query.endAt;
    } else if ((0, _utils.hasKey)(query, 'endAt')) {
        return new _Observable.Observable(function (subscriber) {
            subscriber.next(query.endAt);
        });
    } else {
        return new _Observable.Observable(function (subscriber) {
            subscriber.next(undefined);
        });
    }
}
function getEqualToObservable(query) {
    if (query.equalTo instanceof _Observable.Observable) {
        return query.equalTo;
    } else if ((0, _utils.hasKey)(query, 'equalTo')) {
        return new _Observable.Observable(function (subscriber) {
            subscriber.next(query.equalTo);
        });
    } else {
        return new _Observable.Observable(function (subscriber) {
            subscriber.next(undefined);
        });
    }
}
function mapToOrderBySelection(value, key) {
    if (value instanceof _Observable.Observable) {
        return _map.map.call(value, function (value) {
            return { value: value, key: key };
        });
    } else {
        return new _Observable.Observable(function (subscriber) {
            subscriber.next({ key: key, value: value });
        });
    }
}
function mapToLimitToSelection(value, key) {
    if (value instanceof _Observable.Observable) {
        return _map.map.call(value, function (value) {
            return { value: value, key: key };
        });
    } else {
        return new _Observable.Observable(function (subscriber) {
            subscriber.next({ key: key, value: value });
        });
    }
}
function hasObservableProperties(query) {
    if (query.orderByKey instanceof _Observable.Observable) return true;
    return false;
}
//# sourceMappingURL=query_observable.js.map