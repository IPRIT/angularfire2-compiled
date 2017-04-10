'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FirebaseObjectFactory = FirebaseObjectFactory;

var _index = require('./index');

var _observeOn = require('rxjs/operator/observeOn');

var _firebase = require('firebase');

var firebase = _interopRequireWildcard(_firebase);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function FirebaseObjectFactory(absoluteUrlOrDbRef, _a) {
    var preserveSnapshot = (_a === void 0 ? {} : _a).preserveSnapshot;
    var ref;
    utils.checkForUrlOrFirebaseRef(absoluteUrlOrDbRef, {
        isUrl: function isUrl() {
            return ref = firebase.database().refFromURL(absoluteUrlOrDbRef);
        },
        isRef: function isRef() {
            return ref = absoluteUrlOrDbRef;
        }
    });
    var objectObservable = new _index.FirebaseObjectObservable(function (obs) {
        var fn = ref.on('value', function (snapshot) {
            obs.next(preserveSnapshot ? snapshot : utils.unwrapMapFn(snapshot));
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        return function () {
            return ref.off('value', fn);
        };
    }, ref);
    return _observeOn.observeOn.call(objectObservable, new utils.ZoneScheduler(Zone.current));
}
//# sourceMappingURL=firebase_object_factory.js.map