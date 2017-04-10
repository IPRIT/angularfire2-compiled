"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var OrderByOptions = exports.OrderByOptions = undefined;
(function (OrderByOptions) {
    OrderByOptions[OrderByOptions["Child"] = 0] = "Child";
    OrderByOptions[OrderByOptions["Key"] = 1] = "Key";
    OrderByOptions[OrderByOptions["Value"] = 2] = "Value";
    OrderByOptions[OrderByOptions["Priority"] = 3] = "Priority";
})(OrderByOptions || (exports.OrderByOptions = OrderByOptions = {}));
var LimitToOptions = exports.LimitToOptions = undefined;
(function (LimitToOptions) {
    LimitToOptions[LimitToOptions["First"] = 0] = "First";
    LimitToOptions[LimitToOptions["Last"] = 1] = "Last";
})(LimitToOptions || (exports.LimitToOptions = LimitToOptions = {}));
var QueryOptions = exports.QueryOptions = undefined;
(function (QueryOptions) {
    QueryOptions[QueryOptions["EqualTo"] = 0] = "EqualTo";
    QueryOptions[QueryOptions["StartAt"] = 1] = "StartAt";
    QueryOptions[QueryOptions["EndAt"] = 2] = "EndAt";
})(QueryOptions || (exports.QueryOptions = QueryOptions = {}));
//# sourceMappingURL=interfaces.js.map