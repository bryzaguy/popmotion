'use strict';

exports.__esModule = true;

var _calc = require('../inc/calc');

exports.default = function (from, to) {
    var mapLength = from.length;

    return function (value) {
        for (var i = 1; i < mapLength; i++) {
            if (value < from[i] || i === mapLength) {
                return (0, _calc.getValueFromProgress)((0, _calc.restrict)((0, _calc.getProgressFromValue)(value, from[i - 1], from[i]), 0, 1), to[i - 1], to[i]);
            }
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmFuc2Zvcm1lcnMvbWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztrQkFFZSxVQUFDLElBQUQsRUFBTyxFQUFQLEVBQWM7QUFDekIsUUFBTSxZQUFZLEtBQUssTUFBTCxDQURPOztBQUd6QixXQUFPLFVBQUMsS0FBRCxFQUFXO0FBQ2QsYUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksU0FBSixFQUFlLEdBQS9CLEVBQW9DO0FBQ2hDLGdCQUFJLFFBQVEsS0FBSyxDQUFMLENBQVIsSUFBbUIsTUFBTSxTQUFOLEVBQWlCO0FBQ3BDLHVCQUFPLFVBUlEscUJBUVIsQ0FBcUIsVUFSUyxTQVFULENBQVMsVUFSNUMscUJBUTRDLENBQXFCLEtBQXJCLEVBQTRCLEtBQUssSUFBSSxDQUFKLENBQWpDLEVBQXlDLEtBQUssQ0FBTCxDQUF6QyxDQUFULEVBQTRELENBQTVELEVBQStELENBQS9ELENBQXJCLEVBQXdGLEdBQUcsSUFBSSxDQUFKLENBQTNGLEVBQW1HLEdBQUcsQ0FBSCxDQUFuRyxDQUFQLENBRG9DO2FBQXhDO1NBREo7S0FERyxDQUhrQjtDQUFkIiwiZmlsZSI6Im1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFByb2dyZXNzRnJvbVZhbHVlLCBnZXRWYWx1ZUZyb21Qcm9ncmVzcywgcmVzdHJpY3QgfSBmcm9tICcuLi9pbmMvY2FsYyc7XG5cbmV4cG9ydCBkZWZhdWx0IChmcm9tLCB0bykgPT4ge1xuICAgIGNvbnN0IG1hcExlbmd0aCA9IGZyb20ubGVuZ3RoO1xuXG4gICAgcmV0dXJuICh2YWx1ZSkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IG1hcExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPCBmcm9tW2ldIHx8IGkgPT09IG1hcExlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZUZyb21Qcm9ncmVzcyhyZXN0cmljdChnZXRQcm9ncmVzc0Zyb21WYWx1ZSh2YWx1ZSwgZnJvbVtpIC0gMV0sIGZyb21baV0pLCAwLCAxKSwgdG9baSAtIDFdLCB0b1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSJdfQ==