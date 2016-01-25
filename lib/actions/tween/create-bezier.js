'use strict';

exports.__esModule = true;
exports.default = createCubicBezier;
/*
    Bezier function generator
        
    Gaëtan Renaudeau's BezierEasing
    https://github.com/gre/bezier-easing/blob/master/index.js  
    https://github.com/gre/bezier-easing/blob/master/LICENSE
    You're a hero
    
    Use
    
        var easeOut = new Bezier(.17,.67,.83,.67),
            x = easeOut(0.5); // returns 0.627...
*/

// Constants
var NEWTON_ITERATIONS = 8;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;
var K_SPLINE_TABLE_SIZE = 11;
var K_SAMPLE_STEP_SIZE = 1.0 / (K_SPLINE_TABLE_SIZE - 1.0);
var FLOAT_32_SUPPORTED = typeof Float32Array !== 'undefined';

// Helper methods
var a = function (a1, a2) {
    return 1.0 - 3.0 * a2 + 3.0 * a1;
};
var b = function (a1, a2) {
    return 3.0 * a2 - 6.0 * a1;
};
var c = function (a1) {
    return 3.0 * a1;
};

var getSlope = function (t, a1, a2) {
    return 3.0 * a(a1, a2) * t * t + 2.0 * b(a1, a2) * t + c(a1);
};

var calcBezier = function (t, a1, a2) {
    return ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
};

/*
    Create a cubic bezier resolver
*/
function createCubicBezier(mX1, mY1, mX2, mY2) {
    var sampleValues = FLOAT_32_SUPPORTED ? new Float32Array(K_SPLINE_TABLE_SIZE) : new Array(K_SPLINE_TABLE_SIZE);
    var _precomputed = false;

    var binarySubdivide = function (aX, aA, aB) {
        var i = 0;
        var currentX = undefined;
        var currentT = undefined;

        do {
            currentT = aA + (aB - aA) / 2.0;
            currentX = calcBezier(currentT, mX1, mX2) - aX;
            if (currentX > 0.0) {
                aB = currentT;
            } else {
                aA = currentT;
            }
        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

        return currentT;
    };

    var newtonRaphsonIterate = function (aX, aGuessT) {
        var i = 0;
        var currentSlope = 0;
        var currentX = undefined;

        for (; i < NEWTON_ITERATIONS; ++i) {
            currentSlope = getSlope(aGuessT, mX1, mX2);

            if (currentSlope === 0.0) {
                return aGuessT;
            }

            currentX = calcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }

        return aGuessT;
    };

    var calcSampleValues = function () {
        for (var i = 0; i < K_SPLINE_TABLE_SIZE; ++i) {
            sampleValues[i] = calcBezier(i * K_SAMPLE_STEP_SIZE, mX1, mX2);
        }
    };

    var getTForX = function (aX) {
        var intervalStart = 0.0;
        var currentSample = 1;
        var lastSample = K_SPLINE_TABLE_SIZE - 1;
        var dist = 0.0;
        var guessForT = 0.0;
        var initialSlope = 0.0;

        for (; currentSample != lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
            intervalStart += K_SAMPLE_STEP_SIZE;
        }

        --currentSample;

        dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        guessForT = intervalStart + dist * K_SAMPLE_STEP_SIZE;

        initialSlope = getSlope(guessForT, mX1, mX2);

        // If slope is greater than min
        if (initialSlope >= NEWTON_MIN_SLOPE) {
            return newtonRaphsonIterate(aX, guessForT);
            // Slope is equal to min
        } else if (initialSlope === 0.0) {
                return guessForT;
                // Slope is less than min
            } else {
                    return binarySubdivide(aX, intervalStart, intervalStart + K_SAMPLE_STEP_SIZE);
                }
    };

    var precompute = function () {
        _precomputed = true;
        if (mX1 != mY1 || mX2 != mY2) {
            calcSampleValues();
        }
    };

    var resolver = function (aX) {
        var returnValue = undefined;

        if (!_precomputed) {
            precompute();
        }

        // If linear gradient, return X as T
        if (mX1 === mY1 && mX2 === mY2) {
            returnValue = aX;

            // If at start, return 0
        } else if (aX === 0) {
                returnValue = 0;

                // If at end, return 1
            } else if (aX === 1) {
                    returnValue = 1;
                } else {
                    returnValue = calcBezier(getTForX(aX), mY1, mY2);
                }

        return returnValue;
    };

    return resolver;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL3R3ZWVuL2NyZWF0ZS1iZXppZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O2tCQW1Dd0I7Ozs7Ozs7Ozs7Ozs7Ozs7QUFwQnhCLElBQU0sb0JBQW9CLENBQXBCO0FBQ04sSUFBTSxtQkFBbUIsS0FBbkI7QUFDTixJQUFNLHdCQUF3QixTQUF4QjtBQUNOLElBQU0sNkJBQTZCLEVBQTdCO0FBQ04sSUFBTSxzQkFBc0IsRUFBdEI7QUFDTixJQUFNLHFCQUFxQixPQUFPLHNCQUFzQixHQUF0QixDQUFQO0FBQzNCLElBQU0scUJBQXNCLE9BQU8sWUFBUCxLQUF3QixXQUF4Qjs7O0FBRzVCLElBQU0sSUFBSSxVQUFDLEVBQUQsRUFBSyxFQUFMO1dBQVksTUFBTSxNQUFNLEVBQU4sR0FBVyxNQUFNLEVBQU47Q0FBN0I7QUFDVixJQUFNLElBQUksVUFBQyxFQUFELEVBQUssRUFBTDtXQUFZLE1BQU0sRUFBTixHQUFXLE1BQU0sRUFBTjtDQUF2QjtBQUNWLElBQU0sSUFBSSxVQUFDLEVBQUQ7V0FBUSxNQUFNLEVBQU47Q0FBUjs7QUFFVixJQUFNLFdBQVcsVUFBQyxDQUFELEVBQUksRUFBSixFQUFRLEVBQVI7V0FBZSxNQUFNLEVBQUUsRUFBRixFQUFNLEVBQU4sQ0FBTixHQUFrQixDQUFsQixHQUFzQixDQUF0QixHQUEwQixNQUFNLEVBQUUsRUFBRixFQUFNLEVBQU4sQ0FBTixHQUFrQixDQUFsQixHQUFzQixFQUFFLEVBQUYsQ0FBaEQ7Q0FBZjs7QUFFakIsSUFBTSxhQUFhLFVBQUMsQ0FBRCxFQUFJLEVBQUosRUFBUSxFQUFSO1dBQWUsQ0FBQyxDQUFDLEVBQUUsRUFBRixFQUFNLEVBQU4sSUFBWSxDQUFaLEdBQWdCLEVBQUUsRUFBRixFQUFNLEVBQU4sQ0FBaEIsQ0FBRCxHQUE4QixDQUE5QixHQUFrQyxFQUFFLEVBQUYsQ0FBbEMsQ0FBRCxHQUE0QyxDQUE1QztDQUFmOzs7OztBQUtKLFNBQVMsaUJBQVQsQ0FB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QXFCLEVBQXJCLEVBQXlCLFNBQXpCLENBQVA7O0FBRGtDLFNBQXRDLE1BR08sSUFBSSxpQkFBaUIsR0FBakIsRUFBc0I7QUFDN0IsdUJBQU8sU0FBUDs7QUFENkIsYUFBMUIsTUFHQTtBQUNILDJCQUFPLGdCQUFnQixFQUFoQixFQUFvQixhQUFwQixFQUFtQyxnQkFBZ0Isa0JBQWhCLENBQTFDLENBREc7aUJBSEE7S0F2Qk0sQ0EvQ3lDOztBQThFMUQsUUFBTSxhQUFhLFlBQU07QUFDckIsdUJBQWUsSUFBZixDQURxQjtBQUVyQixZQUFJLE9BQU8sR0FBUCxJQUFjLE9BQU8sR0FBUCxFQUFZO0FBQzFCLCtCQUQwQjtTQUE5QjtLQUZlLENBOUV1Qzs7QUFxRjFELFFBQU0sV0FBVyxVQUFDLEVBQUQsRUFBUTtBQUNyQixZQUFJLHVCQUFKLENBRHFCOztBQUdyQixZQUFJLENBQUMsWUFBRCxFQUFlO0FBQ2YseUJBRGU7U0FBbkI7OztBQUhxQixZQVFqQixRQUFRLEdBQVIsSUFBZSxRQUFRLEdBQVIsRUFBYTtBQUM1QiwwQkFBYyxFQUFkOzs7QUFENEIsU0FBaEMsTUFJTyxJQUFJLE9BQU8sQ0FBUCxFQUFVO0FBQ2pCLDhCQUFjLENBQWQ7OztBQURpQixhQUFkLE1BSUEsSUFBSSxPQUFPLENBQVAsRUFBVTtBQUNqQixrQ0FBYyxDQUFkLENBRGlCO2lCQUFkLE1BR0E7QUFDSCxrQ0FBYyxXQUFXLFNBQVMsRUFBVCxDQUFYLEVBQXlCLEdBQXpCLEVBQThCLEdBQTlCLENBQWQsQ0FERztpQkFIQTs7QUFPUCxlQUFPLFdBQVAsQ0F2QnFCO0tBQVIsQ0FyRnlDOztBQStHMUQsV0FBTyxRQUFQLENBL0cwRDtDQUEvQyIsImZpbGUiOiJjcmVhdGUtYmV6aWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAgICBCZXppZXIgZnVuY3Rpb24gZ2VuZXJhdG9yXG4gICAgICAgIFxuICAgIEdhw6t0YW4gUmVuYXVkZWF1J3MgQmV6aWVyRWFzaW5nXG4gICAgaHR0cHM6Ly9naXRodWIuY29tL2dyZS9iZXppZXItZWFzaW5nL2Jsb2IvbWFzdGVyL2luZGV4LmpzICBcbiAgICBodHRwczovL2dpdGh1Yi5jb20vZ3JlL2Jlemllci1lYXNpbmcvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICAgIFlvdSdyZSBhIGhlcm9cbiAgICBcbiAgICBVc2VcbiAgICBcbiAgICAgICAgdmFyIGVhc2VPdXQgPSBuZXcgQmV6aWVyKC4xNywuNjcsLjgzLC42NyksXG4gICAgICAgICAgICB4ID0gZWFzZU91dCgwLjUpOyAvLyByZXR1cm5zIDAuNjI3Li4uXG4qL1xuXG4vLyBDb25zdGFudHNcbmNvbnN0IE5FV1RPTl9JVEVSQVRJT05TID0gODtcbmNvbnN0IE5FV1RPTl9NSU5fU0xPUEUgPSAwLjAwMTtcbmNvbnN0IFNVQkRJVklTSU9OX1BSRUNJU0lPTiA9IDAuMDAwMDAwMTtcbmNvbnN0IFNVQkRJVklTSU9OX01BWF9JVEVSQVRJT05TID0gMTA7XG5jb25zdCBLX1NQTElORV9UQUJMRV9TSVpFID0gMTE7XG5jb25zdCBLX1NBTVBMRV9TVEVQX1NJWkUgPSAxLjAgLyAoS19TUExJTkVfVEFCTEVfU0laRSAtIDEuMCk7XG5jb25zdCBGTE9BVF8zMl9TVVBQT1JURUQgPSAodHlwZW9mIEZsb2F0MzJBcnJheSAhPT0gJ3VuZGVmaW5lZCcpO1xuXG4vLyBIZWxwZXIgbWV0aG9kc1xuY29uc3QgYSA9IChhMSwgYTIpID0+IDEuMCAtIDMuMCAqIGEyICsgMy4wICogYTE7XG5jb25zdCBiID0gKGExLCBhMikgPT4gMy4wICogYTIgLSA2LjAgKiBhMTtcbmNvbnN0IGMgPSAoYTEpID0+IDMuMCAqIGExO1xuXG5jb25zdCBnZXRTbG9wZSA9ICh0LCBhMSwgYTIpID0+IDMuMCAqIGEoYTEsIGEyKSAqIHQgKiB0ICsgMi4wICogYihhMSwgYTIpICogdCArIGMoYTEpO1xuXG5jb25zdCBjYWxjQmV6aWVyID0gKHQsIGExLCBhMikgPT4gKChhKGExLCBhMikgKiB0ICsgYihhMSwgYTIpKSAqIHQgKyBjKGExKSkgKiB0O1xuXG4vKlxuICAgIENyZWF0ZSBhIGN1YmljIGJlemllciByZXNvbHZlclxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUN1YmljQmV6aWVyKG1YMSwgbVkxLCBtWDIsIG1ZMikge1xuICAgIGNvbnN0IHNhbXBsZVZhbHVlcyA9IEZMT0FUXzMyX1NVUFBPUlRFRCA/IG5ldyBGbG9hdDMyQXJyYXkoS19TUExJTkVfVEFCTEVfU0laRSkgOiBuZXcgQXJyYXkoS19TUExJTkVfVEFCTEVfU0laRSk7XG4gICAgbGV0IF9wcmVjb21wdXRlZCA9IGZhbHNlO1xuXG4gICAgY29uc3QgYmluYXJ5U3ViZGl2aWRlID0gKGFYLCBhQSwgYUIpID0+IHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBsZXQgY3VycmVudFg7XG4gICAgICAgIGxldCBjdXJyZW50VDtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjdXJyZW50VCA9IGFBICsgKGFCIC0gYUEpIC8gMi4wO1xuICAgICAgICAgICAgY3VycmVudFggPSBjYWxjQmV6aWVyKGN1cnJlbnRULCBtWDEsIG1YMikgLSBhWDtcbiAgICAgICAgICAgIGlmIChjdXJyZW50WCA+IDAuMCkge1xuICAgICAgICAgICAgICAgIGFCID0gY3VycmVudFQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFBID0gY3VycmVudFQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKE1hdGguYWJzKGN1cnJlbnRYKSA+IFNVQkRJVklTSU9OX1BSRUNJU0lPTiAmJiArK2kgPCBTVUJESVZJU0lPTl9NQVhfSVRFUkFUSU9OUyk7XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnRUO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld3RvblJhcGhzb25JdGVyYXRlID0gKGFYLCBhR3Vlc3NUKSA9PiB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IGN1cnJlbnRTbG9wZSA9IDA7XG4gICAgICAgIGxldCBjdXJyZW50WDtcblxuICAgICAgICBmb3IgKDsgaSA8IE5FV1RPTl9JVEVSQVRJT05TOyArK2kpIHtcbiAgICAgICAgICAgIGN1cnJlbnRTbG9wZSA9IGdldFNsb3BlKGFHdWVzc1QsIG1YMSwgbVgyKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTbG9wZSA9PT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFHdWVzc1Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGN1cnJlbnRYID0gY2FsY0JlemllcihhR3Vlc3NULCBtWDEsIG1YMikgLSBhWDtcbiAgICAgICAgICAgIGFHdWVzc1QgLT0gY3VycmVudFggLyBjdXJyZW50U2xvcGU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBhR3Vlc3NUO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbGNTYW1wbGVWYWx1ZXMgPSAoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgS19TUExJTkVfVEFCTEVfU0laRTsgKytpKSB7XG4gICAgICAgICAgICBzYW1wbGVWYWx1ZXNbaV0gPSBjYWxjQmV6aWVyKGkgKiBLX1NBTVBMRV9TVEVQX1NJWkUsIG1YMSwgbVgyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGdldFRGb3JYID0gKGFYKSA9PiB7XG4gICAgICAgIGxldCBpbnRlcnZhbFN0YXJ0ID0gMC4wO1xuICAgICAgICBsZXQgY3VycmVudFNhbXBsZSA9IDE7XG4gICAgICAgIGxldCBsYXN0U2FtcGxlID0gS19TUExJTkVfVEFCTEVfU0laRSAtIDE7XG4gICAgICAgIGxldCBkaXN0ID0gMC4wO1xuICAgICAgICBsZXQgZ3Vlc3NGb3JUID0gMC4wO1xuICAgICAgICBsZXQgaW5pdGlhbFNsb3BlID0gMC4wO1xuICAgICAgICAgICAgXG4gICAgICAgIGZvciAoOyBjdXJyZW50U2FtcGxlICE9IGxhc3RTYW1wbGUgJiYgc2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdIDw9IGFYOyArK2N1cnJlbnRTYW1wbGUpIHtcbiAgICAgICAgICAgIGludGVydmFsU3RhcnQgKz0gS19TQU1QTEVfU1RFUF9TSVpFO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAtLWN1cnJlbnRTYW1wbGU7XG4gICAgICAgIFxuICAgICAgICBkaXN0ID0gKGFYIC0gc2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdKSAvIChzYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZSsxXSAtIHNhbXBsZVZhbHVlc1tjdXJyZW50U2FtcGxlXSk7XG4gICAgICAgIGd1ZXNzRm9yVCA9IGludGVydmFsU3RhcnQgKyBkaXN0ICogS19TQU1QTEVfU1RFUF9TSVpFO1xuICAgICAgICBcbiAgICAgICAgaW5pdGlhbFNsb3BlID0gZ2V0U2xvcGUoZ3Vlc3NGb3JULCBtWDEsIG1YMik7XG4gICAgICAgIFxuICAgICAgICAvLyBJZiBzbG9wZSBpcyBncmVhdGVyIHRoYW4gbWluXG4gICAgICAgIGlmIChpbml0aWFsU2xvcGUgPj0gTkVXVE9OX01JTl9TTE9QRSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ld3RvblJhcGhzb25JdGVyYXRlKGFYLCBndWVzc0ZvclQpO1xuICAgICAgICAvLyBTbG9wZSBpcyBlcXVhbCB0byBtaW5cbiAgICAgICAgfSBlbHNlIGlmIChpbml0aWFsU2xvcGUgPT09IDAuMCkge1xuICAgICAgICAgICAgcmV0dXJuIGd1ZXNzRm9yVDtcbiAgICAgICAgLy8gU2xvcGUgaXMgbGVzcyB0aGFuIG1pblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmFyeVN1YmRpdmlkZShhWCwgaW50ZXJ2YWxTdGFydCwgaW50ZXJ2YWxTdGFydCArIEtfU0FNUExFX1NURVBfU0laRSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwcmVjb21wdXRlID0gKCkgPT4ge1xuICAgICAgICBfcHJlY29tcHV0ZWQgPSB0cnVlO1xuICAgICAgICBpZiAobVgxICE9IG1ZMSB8fCBtWDIgIT0gbVkyKSB7XG4gICAgICAgICAgICBjYWxjU2FtcGxlVmFsdWVzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXNvbHZlciA9IChhWCkgPT4ge1xuICAgICAgICBsZXQgcmV0dXJuVmFsdWU7XG5cbiAgICAgICAgaWYgKCFfcHJlY29tcHV0ZWQpIHtcbiAgICAgICAgICAgIHByZWNvbXB1dGUoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gSWYgbGluZWFyIGdyYWRpZW50LCByZXR1cm4gWCBhcyBUXG4gICAgICAgIGlmIChtWDEgPT09IG1ZMSAmJiBtWDIgPT09IG1ZMikge1xuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBhWDtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyBJZiBhdCBzdGFydCwgcmV0dXJuIDBcbiAgICAgICAgfSBlbHNlIGlmIChhWCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSAwO1xuICAgICAgICAgICAgXG4gICAgICAgIC8vIElmIGF0IGVuZCwgcmV0dXJuIDFcbiAgICAgICAgfSBlbHNlIGlmIChhWCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSAxO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm5WYWx1ZSA9IGNhbGNCZXppZXIoZ2V0VEZvclgoYVgpLCBtWTEsIG1ZMik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzb2x2ZXI7XG59XG4iXX0=