// sinful.js
// ----------
//
// Sinful will enhance the JavaScript environment in which it is run,
// providing it with functionalities that are often useful.
//
// One of the ways in which this is done is augmenting existing prototypes,
// which is something that most priests and pastors will frown upon.
//
// Sinful assumes the environment is a conformant ES5 implementation.
// For the sake of clarity and brevity, no checks or safeguards are employed.
//
// I assume that you know what you're doing. For legal information, refer to LEGAL.
//
// gdjs
//
///////


void function () {


    String.ASCII = {

	lowercase: 'abcdefghijklmnopqrstuvwxyz',
	uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	letters:   'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
	digits:    '0123456789',
	hexDigits: '0123456789abcdefABCDEF',
	octDigits: '01234567',

    };


    String.prototype.interp = function (expansions) {

	var that = this;

	Object.getOwnPropertyNames(expansions).forEach(function (key) {
	    that = that.replace(new RegExp('\{' + key + '\}', 'g'), expansions[key]);
	});

	return that;
    };


    String.prototype.reverse = function () {
	return this.split('').reverse().join('');
    };


    String.prototype.words = function () {
	return this.split(/\s+/);
    };




    Object.prototype.deepCopy = function () {

	function clone (thing) {

	    if (thing ===  null           ||
		typeof thing === 'number' ||
		typeof thing === 'string' ||
		typeof thing === 'boolean') {

		return thing;
	    }

	    if (typeof thing === 'undefined') {
		return undefined;
	    }

	    var copy = Array.isArray(thing) ? [] : {};

	    Object.getOwnPropertyNames(thing).forEach(function (prop) {
		copy[prop] = clone(thing[prop]);
	    });

	    return copy;
	};

	return clone(this);

    };




    Function.prototype.curry = function () {

	var that  = this,
	    slice = Array.prototype.slice,
	    args  = slice.call(arguments);

	return function () {
	   var allArgs = args.concat(slice.call(arguments));
	   return that.apply(null, allArgs);
	};
    };


    Function.prototype.compose = function (other) {

	var that = this;

	return function () { 
	    return that(other.call(null, Array.prototype.slice.call(arguments)));
	};
    };



    void function () {

	// Computes the multiplier necessary to make x >= 1,
	// effectively eliminating miscalculations caused by
	// finite precision.

	function multiplier(x) {

	    var parts = x.toString().split('.');

	    if (parts.length < 2) {
		return 1;
	    }

	    return Math.pow(10, parts[1].length);
	}


	// Given a variable number of arguments, returns the maximum
	// multiplier that must be used to normalize an operation involving
	// all of them.

	function correctionFactor() {

	    return Array.prototype.reduce.call(arguments, function (prev, next) {

		var mp = multiplier(prev),
		    mn = multiplier(next);

		return mp > mn ? mp : mn;

	    }, -Infinity);

	}


	Math.add = function () {

	    var corrFactor = correctionFactor.apply(null, arguments);

	    function cback(accum, curr, currI, O) {
		return accum + corrFactor * curr;
	    }

	    return Array.prototype.reduce.call(arguments, cback, 0) / corrFactor;
	};

	Math.sub = function () {

	    var corrFactor = correctionFactor.apply(null, arguments),
		first      = arguments[0];

	    function cback(accum, curr, currI, O) {
		return accum - corrFactor * curr;
	    }

	    delete arguments[0];

	    return Array.prototype.reduce.call(arguments, 
		    cback, first * corrFactor) / corrFactor;

	};


	Math.mul = function () {

	    function cback(accum, curr, currI, O) {

		var corrFactor = correctionFactor(accum, curr);

		return (accum * corrFactor) * (curr * corrFactor) /
		    (corrFactor * corrFactor);
	    }

	    return Array.prototype.reduce.call(arguments, cback, 1);
	};


	Math.div = function () {

	    function cback(accum, curr, currI, O) {

		var corrFactor = correctionFactor(accum, curr);

		return (accum * corrFactor) / (curr * corrFactor);
	    }

	    return Array.prototype.reduce.call(arguments, cback);
	};


	Math.intDiv = function (left, right) {

	    var div   = Math.div(left, right),
		parts = div.toString().split('.');

	    return (parts.length) ?
		(new Number(parts[0])).valueOf() :
		div;
	};
    }();

}();

