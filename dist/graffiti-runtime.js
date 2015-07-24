(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("regenerator/runtime");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel/polyfill is allowed");
}
global._babelPolyfill = true;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"core-js/shim":91,"regenerator/runtime":92}],3:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var $ = require('./$');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = $.toObject($this)
      , length = $.toLength(O.length)
      , index  = $.toIndex(fromIndex, length)
      , value;
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./$":24}],4:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var $   = require('./$')
  , ctx = require('./$.ctx');
module.exports = function(TYPE){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
  return function($this, callbackfn, that){
    var O      = Object($.assertDefined($this))
      , self   = $.ES5Object(O)
      , f      = ctx(callbackfn, that, 3)
      , length = $.toLength(self.length)
      , index  = 0
      , result = IS_MAP ? Array(length) : IS_FILTER ? [] : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./$":24,"./$.ctx":12}],5:[function(require,module,exports){
var $ = require('./$');
function assert(condition, msg1, msg2){
  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
}
assert.def = $.assertDefined;
assert.fn = function(it){
  if(!$.isFunction(it))throw TypeError(it + ' is not a function!');
  return it;
};
assert.obj = function(it){
  if(!$.isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
assert.inst = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
module.exports = assert;
},{"./$":24}],6:[function(require,module,exports){
var $        = require('./$')
  , enumKeys = require('./$.enum-keys');
// 19.1.2.1 Object.assign(target, source, ...)
/* eslint-disable no-unused-vars */
module.exports = Object.assign || function assign(target, source){
/* eslint-enable no-unused-vars */
  var T = Object($.assertDefined(target))
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = $.ES5Object(arguments[i++])
      , keys   = enumKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
};
},{"./$":24,"./$.enum-keys":15}],7:[function(require,module,exports){
var $        = require('./$')
  , TAG      = require('./$.wks')('toStringTag')
  , toString = {}.toString;
function cof(it){
  return toString.call(it).slice(8, -1);
}
cof.classof = function(it){
  var O, T;
  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
};
cof.set = function(it, tag, stat){
  if(it && !$.has(it = stat ? it : it.prototype, TAG))$.hide(it, TAG, tag);
};
module.exports = cof;
},{"./$":24,"./$.wks":42}],8:[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , safe     = require('./$.uid').safe
  , assert   = require('./$.assert')
  , forOf    = require('./$.for-of')
  , step     = require('./$.iter').step
  , $has     = $.has
  , set      = $.set
  , isObject = $.isObject
  , hide     = $.hide
  , isExtensible = Object.isExtensible || isObject
  , ID       = safe('id')
  , O1       = safe('O1')
  , LAST     = safe('last')
  , FIRST    = safe('first')
  , ITER     = safe('iter')
  , SIZE     = $.DESC ? safe('size') : 'size'
  , id       = 0;

function fastKey(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
}

function getEntry(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that[O1][index];
  // frozen object case
  for(entry = that[FIRST]; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
}

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      assert.inst(that, C, NAME);
      set(that, O1, $.create(null));
      set(that, SIZE, 0);
      set(that, LAST, undefined);
      set(that, FIRST, undefined);
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    require('./$.mix')(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that[FIRST] = that[LAST] = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that[O1][entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that[FIRST] == entry)that[FIRST] = next;
          if(that[LAST] == entry)that[LAST] = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments[1], 3)
          , entry;
        while(entry = entry ? entry.n : this[FIRST]){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if($.DESC)$.setDesc(C.prototype, 'size', {
      get: function(){
        return assert.def(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that[LAST] = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that[LAST],          // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that[FIRST])that[FIRST] = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that[O1][index] = entry;
    } return that;
  },
  getEntry: getEntry,
  // add .keys, .values, .entries, [@@iterator]
  // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
  setIter: function(C, NAME, IS_MAP){
    require('./$.iter-define')(C, NAME, function(iterated, kind){
      set(this, ITER, {o: iterated, k: kind});
    }, function(){
      var iter  = this[ITER]
        , kind  = iter.k
        , entry = iter.l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){
        // or finish the iteration
        iter.o = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);
  }
};
},{"./$":24,"./$.assert":5,"./$.ctx":12,"./$.for-of":16,"./$.iter":23,"./$.iter-define":21,"./$.mix":26,"./$.uid":40}],9:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def')
  , forOf = require('./$.for-of');
module.exports = function(NAME){
  $def($def.P, NAME, {
    toJSON: function toJSON(){
      var arr = [];
      forOf(this, false, arr.push, arr);
      return arr;
    }
  });
};
},{"./$.def":13,"./$.for-of":16}],10:[function(require,module,exports){
'use strict';
var $         = require('./$')
  , safe      = require('./$.uid').safe
  , assert    = require('./$.assert')
  , forOf     = require('./$.for-of')
  , $has      = $.has
  , isObject  = $.isObject
  , hide      = $.hide
  , isExtensible = Object.isExtensible || isObject
  , id        = 0
  , ID        = safe('id')
  , WEAK      = safe('weak')
  , LEAK      = safe('leak')
  , method    = require('./$.array-methods')
  , find      = method(5)
  , findIndex = method(6);
function findFrozen(store, key){
  return find(store.array, function(it){
    return it[0] === key;
  });
}
// fallback for frozen keys
function leakStore(that){
  return that[LEAK] || hide(that, LEAK, {
    array: [],
    get: function(key){
      var entry = findFrozen(this, key);
      if(entry)return entry[1];
    },
    has: function(key){
      return !!findFrozen(this, key);
    },
    set: function(key, value){
      var entry = findFrozen(this, key);
      if(entry)entry[1] = value;
      else this.array.push([key, value]);
    },
    'delete': function(key){
      var index = findIndex(this.array, function(it){
        return it[0] === key;
      });
      if(~index)this.array.splice(index, 1);
      return !!~index;
    }
  })[LEAK];
}

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      $.set(assert.inst(that, C, NAME), ID, id++);
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    require('./$.mix')(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return leakStore(this)['delete'](key);
        return $has(key, WEAK) && $has(key[WEAK], this[ID]) && delete key[WEAK][this[ID]];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return leakStore(this).has(key);
        return $has(key, WEAK) && $has(key[WEAK], this[ID]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(!isExtensible(assert.obj(key))){
      leakStore(that).set(key, value);
    } else {
      $has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that[ID]] = value;
    } return that;
  },
  leakStore: leakStore,
  WEAK: WEAK,
  ID: ID
};
},{"./$":24,"./$.array-methods":4,"./$.assert":5,"./$.for-of":16,"./$.mix":26,"./$.uid":40}],11:[function(require,module,exports){
'use strict';
var $     = require('./$')
  , $def  = require('./$.def')
  , BUGGY = require('./$.iter').BUGGY
  , forOf = require('./$.for-of')
  , species = require('./$.species')
  , assertInstance = require('./$.assert').inst;

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = $.g[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  function fixMethod(KEY){
    var fn = proto[KEY];
    require('./$.redef')(proto, KEY,
      KEY == 'delete' ? function(a){ return fn.call(this, a === 0 ? 0 : a); }
      : KEY == 'has' ? function has(a){ return fn.call(this, a === 0 ? 0 : a); }
      : KEY == 'get' ? function get(a){ return fn.call(this, a === 0 ? 0 : a); }
      : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
      : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  }
  if(!$.isFunction(C) || !(IS_WEAK || !BUGGY && proto.forEach && proto.entries)){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    require('./$.mix')(C.prototype, methods);
  } else {
    var inst  = new C
      , chain = inst[ADDER](IS_WEAK ? {} : -0, 1)
      , buggyZero;
    // wrap for init collections from iterable
    if(!require('./$.iter-detect')(function(iter){ new C(iter); })){ // eslint-disable-line no-new
      C = wrapper(function(target, iterable){
        assertInstance(target, C, NAME);
        var that = new Base;
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    IS_WEAK || inst.forEach(function(val, key){
      buggyZero = 1 / key === -Infinity;
    });
    // fix converting -0 key to +0
    if(buggyZero){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    // + fix .add & .set for chaining
    if(buggyZero || chain !== inst)fixMethod(ADDER);
  }

  require('./$.cof').set(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F * (C != Base), O);
  species(C);
  species($.core[NAME]); // for wrapper

  if(!IS_WEAK)common.setIter(C, NAME, IS_MAP);

  return C;
};
},{"./$":24,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.for-of":16,"./$.iter":23,"./$.iter-detect":22,"./$.mix":26,"./$.redef":29,"./$.species":34}],12:[function(require,module,exports){
// Optional / simple context binding
var assertFunction = require('./$.assert').fn;
module.exports = function(fn, that, length){
  assertFunction(fn);
  if(~length && that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  } return function(/* ...args */){
      return fn.apply(that, arguments);
    };
};
},{"./$.assert":5}],13:[function(require,module,exports){
var $          = require('./$')
  , global     = $.g
  , core       = $.core
  , isFunction = $.isFunction
  , $redef     = require('./$.redef');
function ctx(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
}
global.core = core;
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
function $def(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {}).prototype
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    if(type & $def.B && own)exp = ctx(out, global);
    else exp = isProto && isFunction(out) ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own)$redef(target, key, out);
    // export
    if(exports[key] != out)$.hide(exports, key, exp);
    if(isProto)(exports.prototype || (exports.prototype = {}))[key] = out;
  }
}
module.exports = $def;
},{"./$":24,"./$.redef":29}],14:[function(require,module,exports){
var $        = require('./$')
  , document = $.g.document
  , isObject = $.isObject
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$":24}],15:[function(require,module,exports){
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getDesc    = $.getDesc
    , getSymbols = $.getSymbols;
  if(getSymbols)$.each.call(getSymbols(it), function(key){
    if(getDesc(it, key).enumerable)keys.push(key);
  });
  return keys;
};
},{"./$":24}],16:[function(require,module,exports){
var ctx  = require('./$.ctx')
  , get  = require('./$.iter').get
  , call = require('./$.iter-call');
module.exports = function(iterable, entries, fn, that){
  var iterator = get(iterable)
    , f        = ctx(fn, that, entries ? 2 : 1)
    , step;
  while(!(step = iterator.next()).done){
    if(call(iterator, f, step.value, entries) === false){
      return call.close(iterator);
    }
  }
};
},{"./$.ctx":12,"./$.iter":23,"./$.iter-call":20}],17:[function(require,module,exports){
module.exports = function($){
  $.FW   = true;
  $.path = $.g;
  return $;
};
},{}],18:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var $ = require('./$')
  , toString = {}.toString
  , getNames = $.getNames;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

function getWindowNames(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
}

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames($.toObject(it));
};
},{"./$":24}],19:[function(require,module,exports){
// Fast apply
// http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
  } return              fn.apply(that, args);
};
},{}],20:[function(require,module,exports){
var assertObject = require('./$.assert').obj;
function close(iterator){
  var ret = iterator['return'];
  if(ret !== undefined)assertObject(ret.call(iterator));
}
function call(iterator, fn, value, entries){
  try {
    return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
  } catch(e){
    close(iterator);
    throw e;
  }
}
call.close = close;
module.exports = call;
},{"./$.assert":5}],21:[function(require,module,exports){
var $def            = require('./$.def')
  , $redef          = require('./$.redef')
  , $               = require('./$')
  , cof             = require('./$.cof')
  , $iter           = require('./$.iter')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values'
  , Iterators       = $iter.Iterators;
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  $iter.create(Constructor, NAME, next);
  function createMethod(kind){
    function $$(that){
      return new Constructor(that, kind);
    }
    switch(kind){
      case KEYS: return function keys(){ return $$(this); };
      case VALUES: return function values(){ return $$(this); };
    } return function entries(){ return $$(this); };
  }
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = $.getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    cof.set(IteratorPrototype, TAG, true);
    // FF fix
    if($.FW && $.has(proto, FF_ITERATOR))$iter.set(IteratorPrototype, $.that);
  }
  // Define iterator
  if($.FW || FORCE)$iter.set(proto, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = $.that;
  if(DEFAULT){
    methods = {
      keys:    IS_SET            ? _default : createMethod(KEYS),
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * $iter.BUGGY, NAME, methods);
  }
};
},{"./$":24,"./$.cof":7,"./$.def":13,"./$.iter":23,"./$.redef":29,"./$.wks":42}],22:[function(require,module,exports){
var SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , SAFE_CLOSING    = false;
try {
  var riter = [7][SYMBOL_ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }
module.exports = function(exec){
  if(!SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[SYMBOL_ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[SYMBOL_ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":42}],23:[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , cof               = require('./$.cof')
  , classof           = cof.classof
  , assert            = require('./$.assert')
  , assertObject      = assert.obj
  , SYMBOL_ITERATOR   = require('./$.wks')('iterator')
  , FF_ITERATOR       = '@@iterator'
  , Iterators         = require('./$.shared')('iterators')
  , IteratorPrototype = {};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
setIterator(IteratorPrototype, $.that);
function setIterator(O, value){
  $.hide(O, SYMBOL_ITERATOR, value);
  // Add iterator for FF iterator protocol
  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
}

module.exports = {
  // Safari has buggy iterators w/o `next`
  BUGGY: 'keys' in [] && !('next' in [].keys()),
  Iterators: Iterators,
  step: function(done, value){
    return {value: value, done: !!done};
  },
  is: function(it){
    var O      = Object(it)
      , Symbol = $.g.Symbol;
    return (Symbol && Symbol.iterator || FF_ITERATOR) in O
      || SYMBOL_ITERATOR in O
      || $.has(Iterators, classof(O));
  },
  get: function(it){
    var Symbol = $.g.Symbol
      , getIter;
    if(it != undefined){
      getIter = it[Symbol && Symbol.iterator || FF_ITERATOR]
        || it[SYMBOL_ITERATOR]
        || Iterators[classof(it)];
    }
    assert($.isFunction(getIter), it, ' is not iterable!');
    return assertObject(getIter.call(it));
  },
  set: setIterator,
  create: function(Constructor, NAME, next, proto){
    Constructor.prototype = $.create(proto || IteratorPrototype, {next: $.desc(1, next)});
    cof.set(Constructor, NAME + ' Iterator');
  }
};
},{"./$":24,"./$.assert":5,"./$.cof":7,"./$.shared":33,"./$.wks":42}],24:[function(require,module,exports){
'use strict';
var global = typeof self != 'undefined' ? self : Function('return this')()
  , core   = {}
  , defineProperty = Object.defineProperty
  , hasOwnProperty = {}.hasOwnProperty
  , ceil  = Math.ceil
  , floor = Math.floor
  , max   = Math.max
  , min   = Math.min;
// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
var DESC = !!function(){
  try {
    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
  } catch(e){ /* empty */ }
}();
var hide = createDefiner(1);
// 7.1.4 ToInteger
function toInteger(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
}
function desc(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
}
function simpleSet(object, key, value){
  object[key] = value;
  return object;
}
function createDefiner(bitmap){
  return DESC ? function(object, key, value){
    return $.setDesc(object, key, desc(bitmap, value));
  } : simpleSet;
}

function isObject(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it){
  return typeof it == 'function';
}
function assertDefined(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
}

var $ = module.exports = require('./$.fw')({
  g: global,
  core: core,
  html: global.document && document.documentElement,
  // http://jsperf.com/core-js-isobject
  isObject:   isObject,
  isFunction: isFunction,
  that: function(){
    return this;
  },
  // 7.1.4 ToInteger
  toInteger: toInteger,
  // 7.1.15 ToLength
  toLength: function(it){
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  },
  toIndex: function(index, length){
    index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  },
  has: function(it, key){
    return hasOwnProperty.call(it, key);
  },
  create:     Object.create,
  getProto:   Object.getPrototypeOf,
  DESC:       DESC,
  desc:       desc,
  getDesc:    Object.getOwnPropertyDescriptor,
  setDesc:    defineProperty,
  setDescs:   Object.defineProperties,
  getKeys:    Object.keys,
  getNames:   Object.getOwnPropertyNames,
  getSymbols: Object.getOwnPropertySymbols,
  assertDefined: assertDefined,
  // Dummy, fix for not array-like ES3 string in es5 module
  ES5Object: Object,
  toObject: function(it){
    return $.ES5Object(assertDefined(it));
  },
  hide: hide,
  def: createDefiner(0),
  set: global.Symbol ? simpleSet : hide,
  each: [].forEach
});
/* eslint-disable no-undef */
if(typeof __e != 'undefined')__e = core;
if(typeof __g != 'undefined')__g = global;
},{"./$.fw":17}],25:[function(require,module,exports){
var $ = require('./$');
module.exports = function(object, el){
  var O      = $.toObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":24}],26:[function(require,module,exports){
var $redef = require('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":29}],27:[function(require,module,exports){
var $            = require('./$')
  , assertObject = require('./$.assert').obj;
module.exports = function ownKeys(it){
  assertObject(it);
  var keys       = $.getNames(it)
    , getSymbols = $.getSymbols;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./$":24,"./$.assert":5}],28:[function(require,module,exports){
'use strict';
var $      = require('./$')
  , invoke = require('./$.invoke')
  , assertFunction = require('./$.assert').fn;
module.exports = function(/* ...pargs */){
  var fn     = assertFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = $.path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that    = this
      , _length = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !_length)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(_length > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};
},{"./$":24,"./$.assert":5,"./$.invoke":19}],29:[function(require,module,exports){
var $   = require('./$')
  , tpl = String({}.hasOwnProperty)
  , SRC = require('./$.uid').safe('src')
  , _toString = Function.toString;

function $redef(O, key, val, safe){
  if($.isFunction(val)){
    var base = O[key];
    $.hide(val, SRC, base ? String(base) : tpl.replace(/hasOwnProperty/, String(key)));
    if(!('name' in val))val.name = key;
  }
  if(O === $.g){
    O[key] = val;
  } else {
    if(!safe)delete O[key];
    $.hide(O, key, val);
  }
}

// add fake Function#toString for correct work wrapped methods / constructors
// with methods similar to LoDash isNative
$redef(Function.prototype, 'toString', function toString(){
  return $.has(this, SRC) ? this[SRC] : _toString.call(this);
});

$.core.inspectSource = function(it){
  return _toString.call(it);
};

module.exports = $redef;
},{"./$":24,"./$.uid":40}],30:[function(require,module,exports){
'use strict';
module.exports = function(regExp, replace, isStatic){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(isStatic ? it : this).replace(regExp, replacer);
  };
};
},{}],31:[function(require,module,exports){
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],32:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var $      = require('./$')
  , assert = require('./$.assert');
function check(O, proto){
  assert.obj(O);
  assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");
}
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
    ? function(buggy, set){
        try {
          set = require('./$.ctx')(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);
          set({}, []);
        } catch(e){ buggy = true; }
        return function setPrototypeOf(O, proto){
          check(O, proto);
          if(buggy)O.__proto__ = proto;
          else set(O, proto);
          return O;
        };
      }()
    : undefined),
  check: check
};
},{"./$":24,"./$.assert":5,"./$.ctx":12}],33:[function(require,module,exports){
var $      = require('./$')
  , SHARED = '__core-js_shared__'
  , store  = $.g[SHARED] || ($.g[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$":24}],34:[function(require,module,exports){
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if($.DESC && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: $.that
  });
};
},{"./$":24,"./$.wks":42}],35:[function(require,module,exports){
// true  -> String#at
// false -> String#codePointAt
var $ = require('./$');
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String($.assertDefined(that))
      , i = $.toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$":24}],36:[function(require,module,exports){
// http://wiki.ecmascript.org/doku.php?id=strawman:string_padding
var $      = require('./$')
  , repeat = require('./$.string-repeat');

module.exports = function(that, minLength, fillChar, left){
  // 1. Let O be CheckObjectCoercible(this value).
  // 2. Let S be ToString(O).
  var S = String($.assertDefined(that));
  // 4. If intMinLength is undefined, return S.
  if(minLength === undefined)return S;
  // 4. Let intMinLength be ToInteger(minLength).
  var intMinLength = $.toInteger(minLength);
  // 5. Let fillLen be the number of characters in S minus intMinLength.
  var fillLen = intMinLength - S.length;
  // 6. If fillLen < 0, then throw a RangeError exception.
  // 7. If fillLen is +∞, then throw a RangeError exception.
  if(fillLen < 0 || fillLen === Infinity){
    throw new RangeError('Cannot satisfy string length ' + minLength + ' for string: ' + S);
  }
  // 8. Let sFillStr be the string represented by fillStr.
  // 9. If sFillStr is undefined, let sFillStr be a space character.
  var sFillStr = fillChar === undefined ? ' ' : String(fillChar);
  // 10. Let sFillVal be a String made of sFillStr, repeated until fillLen is met.
  var sFillVal = repeat.call(sFillStr, Math.ceil(fillLen / sFillStr.length));
  // truncate if we overflowed
  if(sFillVal.length > fillLen)sFillVal = left
    ? sFillVal.slice(sFillVal.length - fillLen)
    : sFillVal.slice(0, fillLen);
  // 11. Return a string made from sFillVal, followed by S.
  // 11. Return a String made from S, followed by sFillVal.
  return left ? sFillVal.concat(S) : S.concat(sFillVal);
};
},{"./$":24,"./$.string-repeat":37}],37:[function(require,module,exports){
'use strict';
var $ = require('./$');

module.exports = function repeat(count){
  var str = String($.assertDefined(this))
    , res = ''
    , n   = $.toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./$":24}],38:[function(require,module,exports){
'use strict';
var $      = require('./$')
  , ctx    = require('./$.ctx')
  , cof    = require('./$.cof')
  , invoke = require('./$.invoke')
  , cel    = require('./$.dom-create')
  , global             = $.g
  , isFunction         = $.isFunction
  , html               = $.html
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
function run(){
  var id = +this;
  if($.has(queue, id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
}
function listner(event){
  run.call(event.data);
}
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!isFunction(setTask) || !isFunction(clearTask)){
  setTask = function(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(isFunction(fn) ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(cof(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Modern browsers, skip implementation for WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is object
  } else if(global.addEventListener && isFunction(global.postMessage) && !global.importScripts){
    defer = function(id){
      global.postMessage(id, '*');
    };
    global.addEventListener('message', listner, false);
  // WebWorkers
  } else if(isFunction(MessageChannel)){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$":24,"./$.cof":7,"./$.ctx":12,"./$.dom-create":14,"./$.invoke":19}],39:[function(require,module,exports){
module.exports = function(exec){
  try {
    exec();
    return false;
  } catch(e){
    return true;
  }
};
},{}],40:[function(require,module,exports){
var sid = 0;
function uid(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++sid + Math.random()).toString(36));
}
uid.safe = require('./$').g.Symbol || uid;
module.exports = uid;
},{"./$":24}],41:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./$.wks')('unscopables');
if(!(UNSCOPABLES in []))require('./$').hide(Array.prototype, UNSCOPABLES, {});
module.exports = function(key){
  [][UNSCOPABLES][key] = true;
};
},{"./$":24,"./$.wks":42}],42:[function(require,module,exports){
var global = require('./$').g
  , store  = require('./$.shared')('wks');
module.exports = function(name){
  return store[name] || (store[name] =
    global.Symbol && global.Symbol[name] || require('./$.uid').safe('Symbol.' + name));
};
},{"./$":24,"./$.shared":33,"./$.uid":40}],43:[function(require,module,exports){
var $                = require('./$')
  , cel              = require('./$.dom-create')
  , cof              = require('./$.cof')
  , $def             = require('./$.def')
  , invoke           = require('./$.invoke')
  , arrayMethod      = require('./$.array-methods')
  , IE_PROTO         = require('./$.uid').safe('__proto__')
  , assert           = require('./$.assert')
  , assertObject     = assert.obj
  , ObjectProto      = Object.prototype
  , html             = $.html
  , A                = []
  , _slice           = A.slice
  , _join            = A.join
  , classof          = cof.classof
  , has              = $.has
  , defineProperty   = $.setDesc
  , getOwnDescriptor = $.getDesc
  , defineProperties = $.setDescs
  , isFunction       = $.isFunction
  , isObject         = $.isObject
  , toObject         = $.toObject
  , toLength         = $.toLength
  , toIndex          = $.toIndex
  , IE8_DOM_DEFINE   = false
  , $indexOf         = require('./$.array-includes')(false)
  , $forEach         = arrayMethod(0)
  , $map             = arrayMethod(1)
  , $filter          = arrayMethod(2)
  , $some            = arrayMethod(3)
  , $every           = arrayMethod(4);

if(!$.DESC){
  try {
    IE8_DOM_DEFINE = defineProperty(cel('div'), 'x',
      {get: function(){ return 8; }}
    ).x == 8;
  } catch(e){ /* empty */ }
  $.setDesc = function(O, P, Attributes){
    if(IE8_DOM_DEFINE)try {
      return defineProperty(O, P, Attributes);
    } catch(e){ /* empty */ }
    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
    if('value' in Attributes)assertObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P){
    if(IE8_DOM_DEFINE)try {
      return getOwnDescriptor(O, P);
    } catch(e){ /* empty */ }
    if(has(O, P))return $.desc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  $.setDescs = defineProperties = function(O, Properties){
    assertObject(O);
    var keys   = $.getKeys(Properties)
      , length = keys.length
      , i = 0
      , P;
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$def($def.S + $def.F * !$.DESC, 'Object', {
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $.getDesc,
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  defineProperty: $.setDesc,
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  defineProperties: defineProperties
});

  // IE 8- don't enum bug keys
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
            'toLocaleString,toString,valueOf').split(',')
  // Additional keys for getOwnPropertyNames
  , keys2 = keys1.concat('length', 'prototype')
  , keysLen1 = keys1.length;

// Create object with `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = cel('iframe')
    , i      = keysLen1
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict.prototype[keys1[i]];
  return createDict();
};
function createGetKeys(names, length){
  return function(object){
    var O      = toObject(object)
      , i      = 0
      , result = []
      , key;
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while(length > i)if(has(O, key = names[i++])){
      ~$indexOf(result, key) || result.push(key);
    }
    return result;
  };
}
function Empty(){}
$def($def.S, 'Object', {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  getPrototypeOf: $.getProto = $.getProto || function(O){
    O = Object(assert.def(O));
    if(has(O, IE_PROTO))return O[IE_PROTO];
    if(isFunction(O.constructor) && O instanceof O.constructor){
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  },
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  create: $.create = $.create || function(O, /*?*/Properties){
    var result;
    if(O !== null){
      Empty.prototype = assertObject(O);
      result = new Empty();
      Empty.prototype = null;
      // add "__proto__" for Object.getPrototypeOf shim
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false),
  // 19.1.2.17 / 15.2.3.8 Object.seal(O)
  seal: function seal(it){
    return it; // <- cap
  },
  // 19.1.2.5 / 15.2.3.9 Object.freeze(O)
  freeze: function freeze(it){
    return it; // <- cap
  },
  // 19.1.2.15 / 15.2.3.10 Object.preventExtensions(O)
  preventExtensions: function preventExtensions(it){
    return it; // <- cap
  },
  // 19.1.2.13 / 15.2.3.11 Object.isSealed(O)
  isSealed: function isSealed(it){
    return !isObject(it); // <- cap
  },
  // 19.1.2.12 / 15.2.3.12 Object.isFrozen(O)
  isFrozen: function isFrozen(it){
    return !isObject(it); // <- cap
  },
  // 19.1.2.11 / 15.2.3.13 Object.isExtensible(O)
  isExtensible: function isExtensible(it){
    return isObject(it); // <- cap
  }
});

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$def($def.P, 'Function', {
  bind: function(that /*, args... */){
    var fn       = assert.fn(this)
      , partArgs = _slice.call(arguments, 1);
    function bound(/* args... */){
      var args   = partArgs.concat(_slice.call(arguments))
        , constr = this instanceof bound
        , ctx    = constr ? $.create(fn.prototype) : that
        , result = invoke(fn, args, ctx);
      return constr ? ctx : result;
    }
    if(fn.prototype)bound.prototype = fn.prototype;
    return bound;
  }
});

// Fix for not array-like ES3 string and DOM objects
if(!(0 in Object('z') && 'z'[0] == 'z')){
  $.ES5Object = function(it){
    return cof(it) == 'String' ? it.split('') : Object(it);
  };
}

var buggySlice = true;
try {
  if(html)_slice.call(html);
  buggySlice = false;
} catch(e){ /* empty */ }

$def($def.P + $def.F * buggySlice, 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return _slice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

$def($def.P + $def.F * ($.ES5Object != Object), 'Array', {
  join: function join(){
    return _join.apply($.ES5Object(this), arguments);
  }
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
$def($def.S, 'Array', {
  isArray: function(arg){
    return cof(arg) == 'Array';
  }
});
function createArrayReduce(isRight){
  return function(callbackfn, memo){
    assert.fn(callbackfn);
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = isRight ? length - 1 : 0
      , i      = isRight ? -1 : 1;
    if(arguments.length < 2)for(;;){
      if(index in O){
        memo = O[index];
        index += i;
        break;
      }
      index += i;
      assert(isRight ? index >= 0 : length > index, 'Reduce of empty array with no initial value');
    }
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
      memo = callbackfn(memo, O[index], index, this);
    }
    return memo;
  };
}
$def($def.P, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: $.each = $.each || function forEach(callbackfn/*, that = undefined */){
    return $forEach(this, callbackfn, arguments[1]);
  },
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn/*, that = undefined */){
    return $map(this, callbackfn, arguments[1]);
  },
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn/*, that = undefined */){
    return $filter(this, callbackfn, arguments[1]);
  },
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn/*, that = undefined */){
    return $some(this, callbackfn, arguments[1]);
  },
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn/*, that = undefined */){
    return $every(this, callbackfn, arguments[1]);
  },
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(el /*, fromIndex = 0 */){
    return $indexOf(this, el, arguments[1]);
  },
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, $.toInteger(fromIndex));
    if(index < 0)index = toLength(length + index);
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
    return -1;
  }
});

// 21.1.3.25 / 15.5.4.20 String.prototype.trim()
$def($def.P, 'String', {trim: require('./$.replacer')(/^\s*([\s\S]*\S)?\s*$/, '$1')});

// 20.3.3.1 / 15.9.4.4 Date.now()
$def($def.S, 'Date', {now: function(){
  return +new Date;
}});

function lz(num){
  return num > 9 ? num : '0' + num;
}

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
// PhantomJS and old webkit had a broken Date implementation.
var date       = new Date(-5e13 - 1)
  , brokenDate = !(date.toISOString && date.toISOString() == '0385-07-25T07:06:39.999Z'
      && require('./$.throws')(function(){ new Date(NaN).toISOString(); }));
$def($def.P + $def.F * brokenDate, 'Date', {toISOString: function(){
  if(!isFinite(this))throw RangeError('Invalid time value');
  var d = this
    , y = d.getUTCFullYear()
    , m = d.getUTCMilliseconds()
    , s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
}});

if(classof(function(){ return arguments; }()) == 'Object')cof.classof = function(it){
  var tag = classof(it);
  return tag == 'Object' && isFunction(it.callee) ? 'Arguments' : tag;
};
},{"./$":24,"./$.array-includes":3,"./$.array-methods":4,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.dom-create":14,"./$.invoke":19,"./$.replacer":30,"./$.throws":39,"./$.uid":40}],44:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , $def    = require('./$.def')
  , toIndex = $.toIndex;
$def($def.P, 'Array', {
  // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
  copyWithin: function copyWithin(target/* = 0 */, start /* = 0, end = @length */){
    var O     = Object($.assertDefined(this))
      , len   = $.toLength(O.length)
      , to    = toIndex(target, len)
      , from  = toIndex(start, len)
      , end   = arguments[2]
      , fin   = end === undefined ? len : toIndex(end, len)
      , count = Math.min(fin - from, len - to)
      , inc   = 1;
    if(from < to && to < from + count){
      inc  = -1;
      from = from + count - 1;
      to   = to   + count - 1;
    }
    while(count-- > 0){
      if(from in O)O[to] = O[from];
      else delete O[to];
      to   += inc;
      from += inc;
    } return O;
  }
});
require('./$.unscope')('copyWithin');
},{"./$":24,"./$.def":13,"./$.unscope":41}],45:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , $def    = require('./$.def')
  , toIndex = $.toIndex;
$def($def.P, 'Array', {
  // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
  fill: function fill(value /*, start = 0, end = @length */){
    var O      = Object($.assertDefined(this))
      , length = $.toLength(O.length)
      , index  = toIndex(arguments[1], length)
      , end    = arguments[2]
      , endPos = end === undefined ? length : toIndex(end, length);
    while(endPos > index)O[index++] = value;
    return O;
  }
});
require('./$.unscope')('fill');
},{"./$":24,"./$.def":13,"./$.unscope":41}],46:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var KEY    = 'findIndex'
  , $def   = require('./$.def')
  , forced = true
  , $find  = require('./$.array-methods')(6);
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$def($def.P + $def.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments[1]);
  }
});
require('./$.unscope')(KEY);
},{"./$.array-methods":4,"./$.def":13,"./$.unscope":41}],47:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var KEY    = 'find'
  , $def   = require('./$.def')
  , forced = true
  , $find  = require('./$.array-methods')(5);
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$def($def.P + $def.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments[1]);
  }
});
require('./$.unscope')(KEY);
},{"./$.array-methods":4,"./$.def":13,"./$.unscope":41}],48:[function(require,module,exports){
var $     = require('./$')
  , ctx   = require('./$.ctx')
  , $def  = require('./$.def')
  , $iter = require('./$.iter')
  , call  = require('./$.iter-call');
$def($def.S + $def.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = Object($.assertDefined(arrayLike))
      , mapfn   = arguments[1]
      , mapping = mapfn !== undefined
      , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
      , index   = 0
      , length, result, step, iterator;
    if($iter.is(O)){
      iterator = $iter.get(O);
      // strange IE quirks mode bug -> use typeof instead of isFunction
      result   = new (typeof this == 'function' ? this : Array);
      for(; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, f, [step.value, index], true) : step.value;
      }
    } else {
      // strange IE quirks mode bug -> use typeof instead of isFunction
      result = new (typeof this == 'function' ? this : Array)(length = $.toLength(O.length));
      for(; length > index; index++){
        result[index] = mapping ? f(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});
},{"./$":24,"./$.ctx":12,"./$.def":13,"./$.iter":23,"./$.iter-call":20,"./$.iter-detect":22}],49:[function(require,module,exports){
var $          = require('./$')
  , setUnscope = require('./$.unscope')
  , ITER       = require('./$.uid').safe('iter')
  , $iter      = require('./$.iter')
  , step       = $iter.step
  , Iterators  = $iter.Iterators;

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  $.set(this, ITER, {o: $.toObject(iterated), i: 0, k: kind});
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , kind  = iter.k
    , index = iter.i++;
  if(!O || index >= O.length){
    iter.o = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$":24,"./$.iter":23,"./$.iter-define":21,"./$.uid":40,"./$.unscope":41}],50:[function(require,module,exports){
var $def = require('./$.def');
$def($def.S, 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , length = arguments.length
      // strange IE quirks mode bug -> use typeof instead of isFunction
      , result = new (typeof this == 'function' ? this : Array)(length);
    while(length > index)result[index] = arguments[index++];
    result.length = length;
    return result;
  }
});
},{"./$.def":13}],51:[function(require,module,exports){
require('./$.species')(Array);
},{"./$.species":34}],52:[function(require,module,exports){
var $             = require('./$')
  , HAS_INSTANCE  = require('./$.wks')('hasInstance')
  , FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(!$.isFunction(this) || !$.isObject(O))return false;
  if(!$.isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = $.getProto(O))if(this.prototype === O)return true;
  return false;
}});
},{"./$":24,"./$.wks":42}],53:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , NAME = 'name'
  , setDesc = $.setDesc
  , FunctionProto = Function.prototype;
// 19.2.4.2 name
NAME in FunctionProto || $.FW && $.DESC && setDesc(FunctionProto, NAME, {
  configurable: true,
  get: function(){
    var match = String(this).match(/^\s*function ([^ (]*)/)
      , name  = match ? match[1] : '';
    $.has(this, NAME) || setDesc(this, NAME, $.desc(5, name));
    return name;
  },
  set: function(value){
    $.has(this, NAME) || setDesc(this, NAME, $.desc(0, value));
  }
});
},{"./$":24}],54:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments[0]); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":11,"./$.collection-strong":8}],55:[function(require,module,exports){
var Infinity = 1 / 0
  , $def  = require('./$.def')
  , E     = Math.E
  , pow   = Math.pow
  , abs   = Math.abs
  , exp   = Math.exp
  , log   = Math.log
  , sqrt  = Math.sqrt
  , ceil  = Math.ceil
  , floor = Math.floor
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);
function roundTiesToEven(n){
  return n + 1 / EPSILON - 1 / EPSILON;
}

// 20.2.2.28 Math.sign(x)
function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
}
// 20.2.2.5 Math.asinh(x)
function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
}
// 20.2.2.14 Math.expm1(x)
function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
}

$def($def.S, 'Math', {
  // 20.2.2.3 Math.acosh(x)
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
  },
  // 20.2.2.5 Math.asinh(x)
  asinh: asinh,
  // 20.2.2.7 Math.atanh(x)
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
  },
  // 20.2.2.9 Math.cbrt(x)
  cbrt: function cbrt(x){
    return sign(x = +x) * pow(abs(x), 1 / 3);
  },
  // 20.2.2.11 Math.clz32(x)
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - floor(log(x + 0.5) * Math.LOG2E) : 32;
  },
  // 20.2.2.12 Math.cosh(x)
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  },
  // 20.2.2.14 Math.expm1(x)
  expm1: expm1,
  // 20.2.2.16 Math.fround(x)
  fround: function fround(x){
    var $abs  = abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  },
  // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , len  = arguments.length
      , larg = 0
      , arg, div;
    while(i < len){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * sqrt(sum);
  },
  // 20.2.2.18 Math.imul(x, y)
  imul: function imul(x, y){
    var UInt16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UInt16 & xn
      , yl = UInt16 & yn;
    return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
  },
  // 20.2.2.20 Math.log1p(x)
  log1p: function log1p(x){
    return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
  },
  // 20.2.2.21 Math.log10(x)
  log10: function log10(x){
    return log(x) / Math.LN10;
  },
  // 20.2.2.22 Math.log2(x)
  log2: function log2(x){
    return log(x) / Math.LN2;
  },
  // 20.2.2.28 Math.sign(x)
  sign: sign,
  // 20.2.2.30 Math.sinh(x)
  sinh: function sinh(x){
    return abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
  },
  // 20.2.2.33 Math.tanh(x)
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  },
  // 20.2.2.34 Math.trunc(x)
  trunc: function trunc(it){
    return (it > 0 ? floor : ceil)(it);
  }
});
},{"./$.def":13}],56:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , isObject   = $.isObject
  , isFunction = $.isFunction
  , NUMBER     = 'Number'
  , $Number    = $.g[NUMBER]
  , Base       = $Number
  , proto      = $Number.prototype;
function toPrimitive(it){
  var fn, val;
  if(isFunction(fn = it.valueOf) && !isObject(val = fn.call(it)))return val;
  if(isFunction(fn = it.toString) && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to number");
}
function toNumber(it){
  if(isObject(it))it = toPrimitive(it);
  if(typeof it == 'string' && it.length > 2 && it.charCodeAt(0) == 48){
    var binary = false;
    switch(it.charCodeAt(1)){
      case 66 : case 98  : binary = true;
      case 79 : case 111 : return parseInt(it.slice(2), binary ? 2 : 8);
    }
  } return +it;
}
if($.FW && !($Number('0o1') && $Number('0b1'))){
  $Number = function Number(it){
    return this instanceof $Number ? new Base(toNumber(it)) : toNumber(it);
  };
  $.each.call($.DESC ? $.getNames(Base) : (
      // ES3:
      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
      // ES6 (in case, if modules with ES6 Number statics required before):
      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
      'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
    ).split(','), function(key){
      if($.has(Base, key) && !$.has($Number, key)){
        $.setDesc($Number, key, $.getDesc(Base, key));
      }
    }
  );
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./$.redef')($.g, NUMBER, $Number);
}
},{"./$":24,"./$.redef":29}],57:[function(require,module,exports){
var $     = require('./$')
  , $def  = require('./$.def')
  , abs   = Math.abs
  , floor = Math.floor
  , _isFinite = $.g.isFinite
  , MAX_SAFE_INTEGER = 0x1fffffffffffff; // pow(2, 53) - 1 == 9007199254740991;
function isInteger(it){
  return !$.isObject(it) && _isFinite(it) && floor(it) === it;
}
$def($def.S, 'Number', {
  // 20.1.2.1 Number.EPSILON
  EPSILON: Math.pow(2, -52),
  // 20.1.2.2 Number.isFinite(number)
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  },
  // 20.1.2.3 Number.isInteger(number)
  isInteger: isInteger,
  // 20.1.2.4 Number.isNaN(number)
  isNaN: function isNaN(number){
    return number != number;
  },
  // 20.1.2.5 Number.isSafeInteger(number)
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
  },
  // 20.1.2.6 Number.MAX_SAFE_INTEGER
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
  // 20.1.2.10 Number.MIN_SAFE_INTEGER
  MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
  // 20.1.2.12 Number.parseFloat(string)
  parseFloat: parseFloat,
  // 20.1.2.13 Number.parseInt(string, radix)
  parseInt: parseInt
});
},{"./$":24,"./$.def":13}],58:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');
$def($def.S, 'Object', {assign: require('./$.assign')});
},{"./$.assign":6,"./$.def":13}],59:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $def = require('./$.def');
$def($def.S, 'Object', {
  is: require('./$.same')
});
},{"./$.def":13,"./$.same":31}],60:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":13,"./$.set-proto":32}],61:[function(require,module,exports){
var $        = require('./$')
  , $def     = require('./$.def')
  , isObject = $.isObject
  , toObject = $.toObject;
$.each.call(('freeze,seal,preventExtensions,isFrozen,isSealed,isExtensible,' +
  'getOwnPropertyDescriptor,getPrototypeOf,keys,getOwnPropertyNames').split(',')
, function(KEY, ID){
  var fn     = ($.core.Object || {})[KEY] || Object[KEY]
    , forced = 0
    , method = {};
  method[KEY] = ID == 0 ? function freeze(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 1 ? function seal(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 2 ? function preventExtensions(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 3 ? function isFrozen(it){
    return isObject(it) ? fn(it) : true;
  } : ID == 4 ? function isSealed(it){
    return isObject(it) ? fn(it) : true;
  } : ID == 5 ? function isExtensible(it){
    return isObject(it) ? fn(it) : false;
  } : ID == 6 ? function getOwnPropertyDescriptor(it, key){
    return fn(toObject(it), key);
  } : ID == 7 ? function getPrototypeOf(it){
    return fn(Object($.assertDefined(it)));
  } : ID == 8 ? function keys(it){
    return fn(toObject(it));
  } : require('./$.get-names').get;
  try {
    fn('z');
  } catch(e){
    forced = 1;
  }
  $def($def.S + $def.F * forced, 'Object', method);
});
},{"./$":24,"./$.def":13,"./$.get-names":18}],62:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , tmp = {};
tmp[require('./$.wks')('toStringTag')] = 'z';
if(require('./$').FW && cof(tmp) != 'z'){
  require('./$.redef')(Object.prototype, 'toString', function toString(){
    return '[object ' + cof.classof(this) + ']';
  }, true);
}
},{"./$":24,"./$.cof":7,"./$.redef":29,"./$.wks":42}],63:[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , cof      = require('./$.cof')
  , $def     = require('./$.def')
  , assert   = require('./$.assert')
  , forOf    = require('./$.for-of')
  , setProto = require('./$.set-proto').set
  , same     = require('./$.same')
  , species  = require('./$.species')
  , SPECIES  = require('./$.wks')('species')
  , RECORD   = require('./$.uid').safe('record')
  , PROMISE  = 'Promise'
  , global   = $.g
  , process  = global.process
  , isNode   = cof(process) == 'process'
  , asap     = process && process.nextTick || require('./$.task').set
  , P        = global[PROMISE]
  , isFunction     = $.isFunction
  , isObject       = $.isObject
  , assertFunction = assert.fn
  , assertObject   = assert.obj
  , Wrapper;

function testResolve(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
}

var useNative = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = isFunction(P) && isFunction(P.resolve) && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && $.DESC){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
function isPromise(it){
  return isObject(it) && (useNative ? cof.classof(it) == 'Promise' : RECORD in it);
}
function sameConstructor(a, b){
  // library wrapper special case
  if(!$.FW && a === P && b === Wrapper)return true;
  return same(a, b);
}
function getConstructor(C){
  var S = assertObject(C)[SPECIES];
  return S != undefined ? S : C;
}
function isThenable(it){
  var then;
  if(isObject(it))then = it.then;
  return isFunction(then) ? then : false;
}
function notify(record){
  var chain = record.c;
  // strange IE + webpack dev server bug - use .call(global)
  if(chain.length)asap.call(global, function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    function run(react){
      var cb = ok ? react.ok : react.fail
        , ret, then;
      try {
        if(cb){
          if(!ok)record.h = true;
          ret = cb === true ? value : cb(value);
          if(ret === react.P){
            react.rej(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(ret)){
            then.call(ret, react.res, react.rej);
          } else react.res(ret);
        } else react.rej(value);
      } catch(err){
        react.rej(err);
      }
    }
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
  });
}
function isUnhandled(promise){
  var record = promise[RECORD]
    , chain  = record.a || record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
}
function $reject(value){
  var record = this
    , promise;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  setTimeout(function(){
    // strange IE + webpack dev server bug - use .call(global)
    asap.call(global, function(){
      if(isUnhandled(promise = record.p)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(global.console && console.error){
          console.error('Unhandled promise rejection', value);
        }
      }
      record.a = undefined;
    });
  }, 1);
  notify(record);
}
function $resolve(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      // strange IE + webpack dev server bug - use .call(global)
      asap.call(global, function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
}

// constructor polyfill
if(!useNative){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    assertFunction(executor);
    var record = {
      p: assert.inst(this, P, PROMISE),       // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false                                // <- handled rejection
    };
    $.hide(this, RECORD, record);
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.mix')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var S = assertObject(assertObject(this).constructor)[SPECIES];
      var react = {
        ok:   isFunction(onFulfilled) ? onFulfilled : true,
        fail: isFunction(onRejected)  ? onRejected  : false
      };
      var promise = react.P = new (S != undefined ? S : P)(function(res, rej){
        react.res = assertFunction(res);
        react.rej = assertFunction(rej);
      });
      var record = this[RECORD];
      record.c.push(react);
      if(record.a)record.a.push(react);
      if(record.s)notify(record);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

// export
$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
cof.set(P, PROMISE);
species(P);
species(Wrapper = $.core[PROMISE]);

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new (getConstructor(this))(function(res, rej){ rej(r); });
  }
});
$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    return isPromise(x) && sameConstructor(x.constructor, this)
      ? x : new this(function(res){ res(x); });
  }
});
$def($def.S + $def.F * !(useNative && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(res, rej){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || res(results);
        }, rej);
      });
      else res(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C = getConstructor(this);
    return new C(function(res, rej){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(res, rej);
      });
    });
  }
});
},{"./$":24,"./$.assert":5,"./$.cof":7,"./$.ctx":12,"./$.def":13,"./$.for-of":16,"./$.iter-detect":22,"./$.mix":26,"./$.same":31,"./$.set-proto":32,"./$.species":34,"./$.task":38,"./$.uid":40,"./$.wks":42}],64:[function(require,module,exports){
var $         = require('./$')
  , $def      = require('./$.def')
  , setProto  = require('./$.set-proto')
  , $iter     = require('./$.iter')
  , ITERATOR  = require('./$.wks')('iterator')
  , ITER      = require('./$.uid').safe('iter')
  , step      = $iter.step
  , assert    = require('./$.assert')
  , isObject  = $.isObject
  , getProto  = $.getProto
  , $Reflect  = $.g.Reflect
  , _apply    = Function.apply
  , assertObject = assert.obj
  , _isExtensible = Object.isExtensible || isObject
  , _preventExtensions = Object.preventExtensions
  // IE TP has broken Reflect.enumerate
  , buggyEnumerate = !($Reflect && $Reflect.enumerate && ITERATOR in $Reflect.enumerate({}));

function Enumerate(iterated){
  $.set(this, ITER, {o: iterated, k: undefined, i: 0});
}
$iter.create(Enumerate, 'Object', function(){
  var iter = this[ITER]
    , keys = iter.k
    , key;
  if(keys == undefined){
    iter.k = keys = [];
    for(key in iter.o)keys.push(key);
  }
  do {
    if(iter.i >= keys.length)return step(1);
  } while(!((key = keys[iter.i++]) in iter.o));
  return step(0, key);
});

var reflect = {
  // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
  apply: function apply(target, thisArgument, argumentsList){
    return _apply.call(target, thisArgument, argumentsList);
  },
  // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
  construct: function construct(target, argumentsList /*, newTarget*/){
    var proto    = assert.fn(arguments.length < 3 ? target : arguments[2]).prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = _apply.call(target, instance, argumentsList);
    return isObject(result) ? result : instance;
  },
  // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
  defineProperty: function defineProperty(target, propertyKey, attributes){
    assertObject(target);
    try {
      $.setDesc(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  },
  // 26.1.4 Reflect.deleteProperty(target, propertyKey)
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = $.getDesc(assertObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  },
  // 26.1.6 Reflect.get(target, propertyKey [, receiver])
  get: function get(target, propertyKey/*, receiver*/){
    var receiver = arguments.length < 3 ? target : arguments[2]
      , desc = $.getDesc(assertObject(target), propertyKey), proto;
    if(desc)return $.has(desc, 'value')
      ? desc.value
      : desc.get === undefined
        ? undefined
        : desc.get.call(receiver);
    return isObject(proto = getProto(target))
      ? get(proto, propertyKey, receiver)
      : undefined;
  },
  // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return $.getDesc(assertObject(target), propertyKey);
  },
  // 26.1.8 Reflect.getPrototypeOf(target)
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(assertObject(target));
  },
  // 26.1.9 Reflect.has(target, propertyKey)
  has: function has(target, propertyKey){
    return propertyKey in target;
  },
  // 26.1.10 Reflect.isExtensible(target)
  isExtensible: function isExtensible(target){
    return _isExtensible(assertObject(target));
  },
  // 26.1.11 Reflect.ownKeys(target)
  ownKeys: require('./$.own-keys'),
  // 26.1.12 Reflect.preventExtensions(target)
  preventExtensions: function preventExtensions(target){
    assertObject(target);
    try {
      if(_preventExtensions)_preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  },
  // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
  set: function set(target, propertyKey, V/*, receiver*/){
    var receiver = arguments.length < 4 ? target : arguments[3]
      , ownDesc  = $.getDesc(assertObject(target), propertyKey)
      , existingDescriptor, proto;
    if(!ownDesc){
      if(isObject(proto = getProto(target))){
        return set(proto, propertyKey, V, receiver);
      }
      ownDesc = $.desc(0);
    }
    if($.has(ownDesc, 'value')){
      if(ownDesc.writable === false || !isObject(receiver))return false;
      existingDescriptor = $.getDesc(receiver, propertyKey) || $.desc(0);
      existingDescriptor.value = V;
      $.setDesc(receiver, propertyKey, existingDescriptor);
      return true;
    }
    return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
  }
};
// 26.1.14 Reflect.setPrototypeOf(target, proto)
if(setProto)reflect.setPrototypeOf = function setPrototypeOf(target, proto){
  setProto.check(target, proto);
  try {
    setProto.set(target, proto);
    return true;
  } catch(e){
    return false;
  }
};

$def($def.G, {Reflect: {}});

$def($def.S + $def.F * buggyEnumerate, 'Reflect', {
  // 26.1.5 Reflect.enumerate(target)
  enumerate: function enumerate(target){
    return new Enumerate(assertObject(target));
  }
});

$def($def.S, 'Reflect', reflect);
},{"./$":24,"./$.assert":5,"./$.def":13,"./$.iter":23,"./$.own-keys":27,"./$.set-proto":32,"./$.uid":40,"./$.wks":42}],65:[function(require,module,exports){
var $       = require('./$')
  , cof     = require('./$.cof')
  , $RegExp = $.g.RegExp
  , Base    = $RegExp
  , proto   = $RegExp.prototype
  , re      = /a/g
  // "new" creates a new object
  , CORRECT_NEW = new $RegExp(re) !== re
  // RegExp allows a regex with flags as the pattern
  , ALLOWS_RE_WITH_FLAGS = function(){
    try {
      return $RegExp(re, 'i') == '/a/i';
    } catch(e){ /* empty */ }
  }();
if($.FW && $.DESC){
  if(!CORRECT_NEW || !ALLOWS_RE_WITH_FLAGS){
    $RegExp = function RegExp(pattern, flags){
      var patternIsRegExp  = cof(pattern) == 'RegExp'
        , flagsIsUndefined = flags === undefined;
      if(!(this instanceof $RegExp) && patternIsRegExp && flagsIsUndefined)return pattern;
      return CORRECT_NEW
        ? new Base(patternIsRegExp && !flagsIsUndefined ? pattern.source : pattern, flags)
        : new Base(patternIsRegExp ? pattern.source : pattern
          , patternIsRegExp && flagsIsUndefined ? pattern.flags : flags);
    };
    $.each.call($.getNames(Base), function(key){
      key in $RegExp || $.setDesc($RegExp, key, {
        configurable: true,
        get: function(){ return Base[key]; },
        set: function(it){ Base[key] = it; }
      });
    });
    proto.constructor = $RegExp;
    $RegExp.prototype = proto;
    require('./$.redef')($.g, 'RegExp', $RegExp);
  }
  // 21.2.5.3 get RegExp.prototype.flags()
  if(/./g.flags != 'g')$.setDesc(proto, 'flags', {
    configurable: true,
    get: require('./$.replacer')(/^.*\/(\w*)$/, '$1')
  });
}
require('./$.species')($RegExp);
},{"./$":24,"./$.cof":7,"./$.redef":29,"./$.replacer":30,"./$.species":34}],66:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments[0]); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":11,"./$.collection-strong":8}],67:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(false);
$def($def.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./$.def":13,"./$.string-at":35}],68:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def')
  , toLength = $.toLength;

// should throw error on regex
$def($def.P + $def.F * !require('./$.throws')(function(){ 'q'.endsWith(/./); }), 'String', {
  // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    var that = String($.assertDefined(this))
      , endPosition = arguments[1]
      , len = toLength(that.length)
      , end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    searchString += '';
    return that.slice(end - searchString.length, end) === searchString;
  }
});
},{"./$":24,"./$.cof":7,"./$.def":13,"./$.throws":39}],69:[function(require,module,exports){
var $def    = require('./$.def')
  , toIndex = require('./$').toIndex
  , fromCharCode = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$def($def.S + $def.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res = []
      , len = arguments.length
      , i   = 0
      , code;
    while(len > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./$":24,"./$.def":13}],70:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.7 String.prototype.includes(searchString, position = 0)
  includes: function includes(searchString /*, position = 0 */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    return !!~String($.assertDefined(this)).indexOf(searchString, arguments[1]);
  }
});
},{"./$":24,"./$.cof":7,"./$.def":13}],71:[function(require,module,exports){
var set   = require('./$').set
  , $at   = require('./$.string-at')(true)
  , ITER  = require('./$.uid').safe('iter')
  , $iter = require('./$.iter')
  , step  = $iter.step;

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  set(this, ITER, {o: String(iterated), i: 0});
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , index = iter.i
    , point;
  if(index >= O.length)return step(1);
  point = $at(O, index);
  iter.i += point.length;
  return step(0, point);
});
},{"./$":24,"./$.iter":23,"./$.iter-define":21,"./$.string-at":35,"./$.uid":40}],72:[function(require,module,exports){
var $    = require('./$')
  , $def = require('./$.def');

$def($def.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl = $.toObject(callSite.raw)
      , len = $.toLength(tpl.length)
      , sln = arguments.length
      , res = []
      , i   = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < sln)res.push(String(arguments[i]));
    } return res.join('');
  }
});
},{"./$":24,"./$.def":13}],73:[function(require,module,exports){
var $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./$.string-repeat')
});
},{"./$.def":13,"./$.string-repeat":37}],74:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def');

// should throw error on regex
$def($def.P + $def.F * !require('./$.throws')(function(){ 'q'.startsWith(/./); }), 'String', {
  // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
  startsWith: function startsWith(searchString /*, position = 0 */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    var that  = String($.assertDefined(this))
      , index = $.toLength(Math.min(arguments[1], that.length));
    searchString += '';
    return that.slice(index, index + searchString.length) === searchString;
  }
});
},{"./$":24,"./$.cof":7,"./$.def":13,"./$.throws":39}],75:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $        = require('./$')
  , setTag   = require('./$.cof').set
  , uid      = require('./$.uid')
  , shared   = require('./$.shared')
  , $def     = require('./$.def')
  , $redef   = require('./$.redef')
  , keyOf    = require('./$.keyof')
  , enumKeys = require('./$.enum-keys')
  , assertObject = require('./$.assert').obj
  , ObjectProto = Object.prototype
  , DESC     = $.DESC
  , has      = $.has
  , $create  = $.create
  , getDesc  = $.getDesc
  , setDesc  = $.setDesc
  , desc     = $.desc
  , $names   = require('./$.get-names')
  , getNames = $names.get
  , toObject = $.toObject
  , $Symbol  = $.g.Symbol
  , setter   = false
  , TAG      = uid('tag')
  , HIDDEN   = uid('hidden')
  , _propertyIsEnumerable = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols = shared('symbols')
  , useNative = $.isFunction($Symbol);

var setSymbolDesc = DESC ? function(){ // fallback for old Android
  try {
    return $create(setDesc({}, HIDDEN, {
      get: function(){
        return setDesc(this, HIDDEN, {value: false})[HIDDEN];
      }
    }))[HIDDEN] || setDesc;
  } catch(e){
    return function(it, key, D){
      var protoDesc = getDesc(ObjectProto, key);
      if(protoDesc)delete ObjectProto[key];
      setDesc(it, key, D);
      if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
    };
  }
}() : setDesc;

function wrap(tag){
  var sym = AllSymbols[tag] = $.set($create($Symbol.prototype), TAG, tag);
  DESC && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, desc(1, value));
    }
  });
  return sym;
}

function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, desc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = $create(D, {enumerable: desc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
}
function defineProperties(it, P){
  assertObject(it);
  var keys = enumKeys(P = toObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)defineProperty(it, key = keys[i++], P[key]);
  return it;
}
function create(it, P){
  return P === undefined ? $create(it) : defineProperties($create(it), P);
}
function propertyIsEnumerable(key){
  var E = _propertyIsEnumerable.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
}
function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
}
function getOwnPropertyNames(it){
  var names  = getNames(toObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
}
function getOwnPropertySymbols(it){
  var names  = getNames(toObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
}

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments[0]));
  };
  $redef($Symbol.prototype, 'toString', function(){
    return this[TAG];
  });

  $.create     = create;
  $.setDesc    = defineProperty;
  $.getDesc    = getOwnPropertyDescriptor;
  $.setDescs   = defineProperties;
  $.getNames   = $names.get = getOwnPropertyNames;
  $.getSymbols = getOwnPropertySymbols;

  if($.DESC && $.FW)$redef(ObjectProto, 'propertyIsEnumerable', propertyIsEnumerable, true);
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
    'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
    'species,split,toPrimitive,toStringTag,unscopables'
  ).split(','), function(it){
    var sym = require('./$.wks')(it);
    symbolStatics[it] = useNative ? sym : wrap(sym);
  }
);

setter = true;

$def($def.G + $def.W, {Symbol: $Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: getOwnPropertySymbols
});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag($.g.JSON, 'JSON', true);
},{"./$":24,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.enum-keys":15,"./$.get-names":18,"./$.keyof":25,"./$.redef":29,"./$.shared":33,"./$.uid":40,"./$.wks":42}],76:[function(require,module,exports){
'use strict';
var $         = require('./$')
  , weak      = require('./$.collection-weak')
  , leakStore = weak.leakStore
  , ID        = weak.ID
  , WEAK      = weak.WEAK
  , has       = $.has
  , isObject  = $.isObject
  , isExtensible = Object.isExtensible || isObject
  , tmp       = {};

// 23.3 WeakMap Objects
var $WeakMap = require('./$.collection')('WeakMap', function(get){
  return function WeakMap(){ return get(this, arguments[0]); };
}, {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      if(!isExtensible(key))return leakStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this[ID]];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
}, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  $.each.call(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    require('./$.redef')(proto, key, function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && !isExtensible(a)){
        var result = leakStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./$":24,"./$.collection":11,"./$.collection-weak":10,"./$.redef":29}],77:[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments[0]); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":11,"./$.collection-weak":10}],78:[function(require,module,exports){
'use strict';
var $def      = require('./$.def')
  , $includes = require('./$.array-includes')(true);
$def($def.P, 'Array', {
  // https://github.com/domenic/Array.prototype.includes
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments[1]);
  }
});
require('./$.unscope')('includes');
},{"./$.array-includes":3,"./$.def":13,"./$.unscope":41}],79:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
require('./$.collection-to-json')('Map');
},{"./$.collection-to-json":9}],80:[function(require,module,exports){
// https://gist.github.com/WebReflection/9353781
var $       = require('./$')
  , $def    = require('./$.def')
  , ownKeys = require('./$.own-keys');

$def($def.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O      = $.toObject(object)
      , result = {};
    $.each.call(ownKeys(O), function(key){
      $.setDesc(result, key, $.desc(0, $.getDesc(O, key)));
    });
    return result;
  }
});
},{"./$":24,"./$.def":13,"./$.own-keys":27}],81:[function(require,module,exports){
// http://goo.gl/XkBrjD
var $    = require('./$')
  , $def = require('./$.def');
function createObjectToArray(isEntries){
  return function(object){
    var O      = $.toObject(object)
      , keys   = $.getKeys(O)
      , length = keys.length
      , i      = 0
      , result = Array(length)
      , key;
    if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];
    else while(length > i)result[i] = O[keys[i++]];
    return result;
  };
}
$def($def.S, 'Object', {
  values:  createObjectToArray(false),
  entries: createObjectToArray(true)
});
},{"./$":24,"./$.def":13}],82:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $def = require('./$.def');
$def($def.S, 'RegExp', {
  escape: require('./$.replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&', true)
});

},{"./$.def":13,"./$.replacer":30}],83:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
require('./$.collection-to-json')('Set');
},{"./$.collection-to-json":9}],84:[function(require,module,exports){
// https://github.com/mathiasbynens/String.prototype.at
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(true);
$def($def.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./$.def":13,"./$.string-at":35}],85:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $pad = require('./$.string-pad');
$def($def.P, 'String', {
  lpad: function lpad(n){
    return $pad(this, n, arguments[1], true);
  }
});
},{"./$.def":13,"./$.string-pad":36}],86:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $pad = require('./$.string-pad');
$def($def.P, 'String', {
  rpad: function rpad(n){
    return $pad(this, n, arguments[1], false);
  }
});
},{"./$.def":13,"./$.string-pad":36}],87:[function(require,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = require('./$')
  , $def    = require('./$.def')
  , $Array  = $.core.Array || Array
  , statics = {};
function setStatics(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in $Array)statics[key] = $Array[key];
    else if(key in [])statics[key] = require('./$.ctx')(Function.call, [][key], length);
  });
}
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill,turn');
$def($def.S, 'Array', statics);
},{"./$":24,"./$.ctx":12,"./$.def":13}],88:[function(require,module,exports){
require('./es6.array.iterator');
var $           = require('./$')
  , Iterators   = require('./$.iter').Iterators
  , ITERATOR    = require('./$.wks')('iterator')
  , ArrayValues = Iterators.Array
  , NL          = $.g.NodeList
  , HTC         = $.g.HTMLCollection
  , NLProto     = NL && NL.prototype
  , HTCProto    = HTC && HTC.prototype;
if($.FW){
  if(NL && !(ITERATOR in NLProto))$.hide(NLProto, ITERATOR, ArrayValues);
  if(HTC && !(ITERATOR in HTCProto))$.hide(HTCProto, ITERATOR, ArrayValues);
}
Iterators.NodeList = Iterators.HTMLCollection = ArrayValues;
},{"./$":24,"./$.iter":23,"./$.wks":42,"./es6.array.iterator":49}],89:[function(require,module,exports){
var $def  = require('./$.def')
  , $task = require('./$.task');
$def($def.G + $def.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.def":13,"./$.task":38}],90:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var $         = require('./$')
  , $def      = require('./$.def')
  , invoke    = require('./$.invoke')
  , partial   = require('./$.partial')
  , navigator = $.g.navigator
  , MSIE      = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
function wrap(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      $.isFunction(fn) ? fn : Function(fn)
    ), time);
  } : set;
}
$def($def.G + $def.B + $def.F * MSIE, {
  setTimeout:  wrap($.g.setTimeout),
  setInterval: wrap($.g.setInterval)
});
},{"./$":24,"./$.def":13,"./$.invoke":19,"./$.partial":28}],91:[function(require,module,exports){
require('./modules/es5');
require('./modules/es6.symbol');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.object.statics-accept-primitives');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.number.constructor');
require('./modules/es6.number.statics');
require('./modules/es6.math');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.iterator');
require('./modules/es6.array.species');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.regexp');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.reflect');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.lpad');
require('./modules/es7.string.rpad');
require('./modules/es7.regexp.escape');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.to-array');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/js.array.statics');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/$').core;

},{"./modules/$":24,"./modules/es5":43,"./modules/es6.array.copy-within":44,"./modules/es6.array.fill":45,"./modules/es6.array.find":47,"./modules/es6.array.find-index":46,"./modules/es6.array.from":48,"./modules/es6.array.iterator":49,"./modules/es6.array.of":50,"./modules/es6.array.species":51,"./modules/es6.function.has-instance":52,"./modules/es6.function.name":53,"./modules/es6.map":54,"./modules/es6.math":55,"./modules/es6.number.constructor":56,"./modules/es6.number.statics":57,"./modules/es6.object.assign":58,"./modules/es6.object.is":59,"./modules/es6.object.set-prototype-of":60,"./modules/es6.object.statics-accept-primitives":61,"./modules/es6.object.to-string":62,"./modules/es6.promise":63,"./modules/es6.reflect":64,"./modules/es6.regexp":65,"./modules/es6.set":66,"./modules/es6.string.code-point-at":67,"./modules/es6.string.ends-with":68,"./modules/es6.string.from-code-point":69,"./modules/es6.string.includes":70,"./modules/es6.string.iterator":71,"./modules/es6.string.raw":72,"./modules/es6.string.repeat":73,"./modules/es6.string.starts-with":74,"./modules/es6.symbol":75,"./modules/es6.weak-map":76,"./modules/es6.weak-set":77,"./modules/es7.array.includes":78,"./modules/es7.map.to-json":79,"./modules/es7.object.get-own-property-descriptors":80,"./modules/es7.object.to-array":81,"./modules/es7.regexp.escape":82,"./modules/es7.set.to-json":83,"./modules/es7.string.at":84,"./modules/es7.string.lpad":85,"./modules/es7.string.rpad":86,"./modules/js.array.statics":87,"./modules/web.dom.iterable":88,"./modules/web.immediate":89,"./modules/web.timers":90}],92:[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);

    generator._invoke = makeInvokeMethod(
      innerFn, self || null,
      new Context(tryLocsList || [])
    );

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    genFun.__proto__ = GeneratorFunctionPrototype;
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument
        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
        : Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            return result;
          });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      var enqueueResult =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(function() {
          return invoke(method, arg);
        }) : new Promise(function(resolve) {
          resolve(invoke(method, arg));
        });

      // Avoid propagating enqueueResult failures to Promises returned by
      // later invocations of the iterator.
      previousPromise = enqueueResult["catch"](function(ignored){});

      return enqueueResult;
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}]},{},[2]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var core = require('../core');
var microtask = require('../microtask');
var browserPatch = require('../patch/browser');
var es6Promise = require('es6-promise');

if (global.Zone) {
  console.warn('Zone already exported on window the object!');
}

global.Zone = microtask.addMicrotaskSupport(core.Zone);
global.zone = new global.Zone();

// Monkey path ẗhe Promise implementation to add support for microtasks
global.Promise = es6Promise.Promise;

browserPatch.apply();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../core":2,"../microtask":3,"../patch/browser":4,"es6-promise":15}],2:[function(require,module,exports){
(function (global){
'use strict';

function Zone(parentZone, data) {
  var zone = (arguments.length) ? Object.create(parentZone) : this;

  zone.parent = parentZone || null;

  Object.keys(data || {}).forEach(function(property) {

    var _property = property.substr(1);

    // augment the new zone with a hook decorates the parent's hook
    if (property[0] === '$') {
      zone[_property] = data[property](parentZone[_property] || function () {});

    // augment the new zone with a hook that runs after the parent's hook
    } else if (property[0] === '+') {
      if (parentZone[_property]) {
        zone[_property] = function () {
          var result = parentZone[_property].apply(this, arguments);
          data[property].apply(this, arguments);
          return result;
        };
      } else {
        zone[_property] = data[property];
      }

    // augment the new zone with a hook that runs before the parent's hook
    } else if (property[0] === '-') {
      if (parentZone[_property]) {
        zone[_property] = function () {
          data[property].apply(this, arguments);
          return parentZone[_property].apply(this, arguments);
        };
      } else {
        zone[_property] = data[property];
      }

    // set the new zone's hook (replacing the parent zone's)
    } else {
      zone[property] = (typeof data[property] === 'object') ?
                        JSON.parse(JSON.stringify(data[property])) :
                        data[property];
    }
  });

  zone.$id = Zone.nextId++;

  return zone;
}

Zone.prototype = {
  constructor: Zone,

  fork: function (locals) {
    this.onZoneCreated();
    return new Zone(this, locals);
  },

  bind: function (fn, skipEnqueue) {
    if (typeof fn !== 'function') {
      throw new Error('Expecting function got: ' + fn);
    }
    skipEnqueue || this.enqueueTask(fn);
    var zone = this.isRootZone() ? this : this.fork();
    return function zoneBoundFn() {
      return zone.run(fn, this, arguments);
    };
  },

  bindOnce: function (fn) {
    var boundZone = this;
    return this.bind(function () {
      var result = fn.apply(this, arguments);
      boundZone.dequeueTask(fn);
      return result;
    });
  },

  isRootZone: function() {
    return this.parent === null;
  },

  run: function run (fn, applyTo, applyWith) {
    applyWith = applyWith || [];

    var oldZone = global.zone;

    // MAKE THIS ZONE THE CURRENT ZONE
    global.zone = this;

    try {
      this.beforeTask();
      return fn.apply(applyTo, applyWith);
    } catch (e) {
      if (this.onError) {
        this.onError(e);
      } else {
        throw e;
      }
    } finally {
      this.afterTask();
      // REVERT THE CURRENT ZONE BACK TO THE ORIGINAL ZONE
      global.zone = oldZone;
    }
  },

  // onError is used to override error handling.
  // When a custom error handler is provided, it should most probably rethrow the exception
  // not to break the expected control flow:
  //
  // `promise.then(fnThatThrows).catch(fn);`
  //
  // When this code is executed in a zone with a custom onError handler that doesn't rethrow, the
  // `.catch()` branch will not be taken as the `fnThatThrows` exception will be swallowed by the
  // handler.
  onError: null,
  beforeTask: function () {},
  onZoneCreated: function () {},
  afterTask: function () {},
  enqueueTask: function () {},
  dequeueTask: function () {}
};

// Root zone ID === 1
Zone.nextId = 1;

Zone.bindPromiseFn = require('./patch/promise').bindPromiseFn;

module.exports = {
  Zone: Zone
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./patch/promise":10}],3:[function(require,module,exports){
(function (global){
'use strict';

var es6Promise = require('es6-promise').Promise;

// es6-promise asap should schedule microtasks via zone.scheduleMicrotask so that any
// user defined hooks are triggered
es6Promise._setAsap(function(fn, arg) {
  global.zone.scheduleMicrotask(function() {
    fn(arg);
  });
});

// The default implementation of scheduleMicrotask use the original es6-promise implementation
// to schedule a microtask
function scheduleMicrotask(fn) {
  es6Promise._asap(this.bind(fn));
}

function addMicrotaskSupport(zoneClass) {
  zoneClass.prototype.scheduleMicrotask = scheduleMicrotask;
  return zoneClass;
}

module.exports = {
  addMicrotaskSupport: addMicrotaskSupport
};

// TODO(vicb): Create a benchmark for the different methods & the usage of the queue
// see https://github.com/angular/zone.js/issues/97

var hasNativePromise = typeof Promise !== "undefined" &&
                       Promise.toString().indexOf("[native code]") !== -1;

var isFirefox = global.navigator &&
                global.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

// TODO(vicb): remove '!isFirefox' when the bug gets fixed:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1162013
if (hasNativePromise && !isFirefox) {
  // When available use a native Promise to schedule microtasks.
  // When not available, es6-promise fallback will be used
  var resolvedPromise = Promise.resolve();
  es6Promise._setScheduler(function(fn) {
    resolvedPromise.then(fn);
  });
}


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"es6-promise":15}],4:[function(require,module,exports){
(function (global){
'use strict';

var fnPatch = require('./functions');
var promisePatch = require('./promise');
var mutationObserverPatch = require('./mutation-observer');
var definePropertyPatch = require('./define-property');
var registerElementPatch = require('./register-element');
var webSocketPatch = require('./websocket');
var eventTargetPatch = require('./event-target');
var propertyDescriptorPatch = require('./property-descriptor');
var geolocationPatch = require('./geolocation');

function apply() {
  fnPatch.patchSetClearFunction(global, [
    'timeout',
    'interval',
    'immediate'
  ]);

  fnPatch.patchSetFunction(global, [
    'requestAnimationFrame',
    'mozRequestAnimationFrame',
    'webkitRequestAnimationFrame'
  ]);

  fnPatch.patchFunction(global, [
    'alert',
    'prompt'
  ]);

  eventTargetPatch.apply();

  propertyDescriptorPatch.apply();

  promisePatch.apply();

  mutationObserverPatch.patchClass('MutationObserver');
  mutationObserverPatch.patchClass('WebKitMutationObserver');

  definePropertyPatch.apply();

  registerElementPatch.apply();

  geolocationPatch.apply();
}

module.exports = {
  apply: apply
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./define-property":5,"./event-target":6,"./functions":7,"./geolocation":8,"./mutation-observer":9,"./promise":10,"./property-descriptor":11,"./register-element":12,"./websocket":13}],5:[function(require,module,exports){
'use strict';

// might need similar for object.freeze
// i regret nothing

var _defineProperty = Object.defineProperty;
var _getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var _create = Object.create;

function apply() {
  Object.defineProperty = function (obj, prop, desc) {
    if (isUnconfigurable(obj, prop)) {
      throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
    }
    if (prop !== 'prototype') {
      desc = rewriteDescriptor(obj, prop, desc);
    }
    return _defineProperty(obj, prop, desc);
  };

  Object.defineProperties = function (obj, props) {
    Object.keys(props).forEach(function (prop) {
      Object.defineProperty(obj, prop, props[prop]);
    });
    return obj;
  };

  Object.create = function (obj, proto) {
    if (typeof proto === 'object') {
      Object.keys(proto).forEach(function (prop) {
        proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
      });
    }
    return _create(obj, proto);
  };

  Object.getOwnPropertyDescriptor = function (obj, prop) {
    var desc = _getOwnPropertyDescriptor(obj, prop);
    if (isUnconfigurable(obj, prop)) {
      desc.configurable = false;
    }
    return desc;
  };
};

function _redefineProperty(obj, prop, desc) {
  desc = rewriteDescriptor(obj, prop, desc);
  return _defineProperty(obj, prop, desc);
};

function isUnconfigurable (obj, prop) {
  return obj && obj.__unconfigurables && obj.__unconfigurables[prop];
}

function rewriteDescriptor (obj, prop, desc) {
  desc.configurable = true;
  if (!desc.configurable) {
    if (!obj.__unconfigurables) {
      _defineProperty(obj, '__unconfigurables', { writable: true, value: {} });
    }
    obj.__unconfigurables[prop] = true;
  }
  return desc;
}

module.exports = {
  apply: apply,
  _redefineProperty: _redefineProperty
};



},{}],6:[function(require,module,exports){
(function (global){
'use strict';

var utils = require('../utils');

function apply() {
  // patched properties depend on addEventListener, so this needs to come first
  if (global.EventTarget) {
    utils.patchEventTargetMethods(global.EventTarget.prototype);

  // Note: EventTarget is not available in all browsers,
  // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
  } else {
    var apis = [ 'ApplicationCache',
      'EventSource',
      'FileReader',
      'InputMethodContext',
      'MediaController',
      'MessagePort',
      'Node',
      'Performance',
      'SVGElementInstance',
      'SharedWorker',
      'TextTrack',
      'TextTrackCue',
      'TextTrackList',
      'WebKitNamedFlow',
      'Window',
      'Worker',
      'WorkerGlobalScope',
      'XMLHttpRequest',
      'XMLHttpRequestEventTarget',
      'XMLHttpRequestUpload'
    ];

    apis.forEach(function(thing) {
      global[thing] && utils.patchEventTargetMethods(global[thing].prototype);
    });
  }
}

module.exports = {
  apply: apply
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils":14}],7:[function(require,module,exports){
(function (global){
'use strict';

var utils = require('../utils');

function patchSetClearFunction(obj, fnNames) {
  fnNames.map(function (name) {
    return name[0].toUpperCase() + name.substr(1);
  }).forEach(function (name) {
    var setName = 'set' + name;
    var delegate = obj[setName];

    if (delegate) {
      var clearName = 'clear' + name;
      var ids = {};

      var bindArgs = setName === 'setInterval' ? utils.bindArguments : utils.bindArgumentsOnce;

      global.zone[setName] = function (fn) {
        var id, fnRef = fn;
        arguments[0] = function () {
          delete ids[id];
          return fnRef.apply(this, arguments);
        };
        var args = bindArgs(arguments);
        id = delegate.apply(obj, args);
        ids[id] = true;
        return id;
      };

      obj[setName] = function () {
        return global.zone[setName].apply(this, arguments);
      };

      var clearDelegate = obj[clearName];

      global.zone[clearName] = function (id) {
        if (ids[id]) {
          delete ids[id];
          global.zone.dequeueTask();
        }
        return clearDelegate.apply(this, arguments);
      };

      obj[clearName] = function () {
        return global.zone[clearName].apply(this, arguments);
      };
    }
  });
};

function patchSetFunction(obj, fnNames) {
  fnNames.forEach(function (name) {
    var delegate = obj[name];

    if (delegate) {
      global.zone[name] = function (fn) {
        var fnRef = fn;
        arguments[0] = function () {
          return fnRef.apply(this, arguments);
        };
        var args = utils.bindArgumentsOnce(arguments);
        return delegate.apply(obj, args);
      };

      obj[name] = function () {
        return zone[name].apply(this, arguments);
      };
    }
  });
};

function patchFunction(obj, fnNames) {
  fnNames.forEach(function (name) {
    var delegate = obj[name];
    global.zone[name] = function () {
      return delegate.apply(obj, arguments);
    };

    obj[name] = function () {
      return global.zone[name].apply(this, arguments);
    };
  });
};


module.exports = {
  patchSetClearFunction: patchSetClearFunction,
  patchSetFunction: patchSetFunction,
  patchFunction: patchFunction
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils":14}],8:[function(require,module,exports){
(function (global){
'use strict';

var utils = require('../utils');

function apply() {
  if (global.navigator && global.navigator.geolocation) {
    utils.patchPrototype(global.navigator.geolocation, [
      'getCurrentPosition',
      'watchPosition'
    ]);
  }
}

module.exports = {
  apply: apply
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils":14}],9:[function(require,module,exports){
(function (global){
'use strict';

// wrap some native API on `window`
function patchClass(className) {
  var OriginalClass = global[className];
  if (!OriginalClass) return;

  global[className] = function (fn) {
    this._o = new OriginalClass(global.zone.bind(fn, true));
    // Remember where the class was instantiate to execute the enqueueTask and dequeueTask hooks
    this._creationZone = global.zone;
  };

  var instance = new OriginalClass(function () {});

  global[className].prototype.disconnect = function () {
    var result = this._o.disconnect.apply(this._o, arguments);
    if (this._active) {
      this._creationZone.dequeueTask();
      this._active = false;
    }
    return result;
  };

  global[className].prototype.observe = function () {
    if (!this._active) {
      this._creationZone.enqueueTask();
      this._active = true;
    }
    return this._o.observe.apply(this._o, arguments);
  };

  var prop;
  for (prop in instance) {
    (function (prop) {
      if (typeof global[className].prototype !== undefined) {
        return;
      }
      if (typeof instance[prop] === 'function') {
        global[className].prototype[prop] = function () {
          return this._o[prop].apply(this._o, arguments);
        };
      } else {
        Object.defineProperty(global[className].prototype, prop, {
          set: function (fn) {
            if (typeof fn === 'function') {
              this._o[prop] = global.zone.bind(fn);
            } else {
              this._o[prop] = fn;
            }
          },
          get: function () {
            return this._o[prop];
          }
        });
      }
    }(prop));
  }
};

module.exports = {
  patchClass: patchClass
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
(function (global){
'use strict';

var utils = require('../utils');

/*
 * Patches a function that returns a Promise-like instance.
 *
 * This function must be used when either:
 * - Native Promises are not available,
 * - The function returns a Promise-like object.
 *
 * This is required because zones rely on a Promise monkey patch that could not be applied when
 * Promise is not natively available or when the returned object is not an instance of Promise.
 *
 * Note that calling `bindPromiseFn` on a function that returns a native Promise will also work
 * with minimal overhead.
 *
 * ```
 * var boundFunction = bindPromiseFn(FunctionReturningAPromise);
 *
 * boundFunction.then(successHandler, errorHandler);
 * ```
 */
var bindPromiseFn;

if (global.Promise) {
  bindPromiseFn = function (delegate) {
    return function() {
      var delegatePromise = delegate.apply(this, arguments);

      // if the delegate returned an instance of Promise, forward it.
      if (delegatePromise instanceof Promise) {
        return delegatePromise;
      }

      // Otherwise wrap the Promise-like in a global Promise
      return new Promise(function(resolve, reject) {
        delegatePromise.then(resolve, reject);
      });
    };
  };
} else {
  bindPromiseFn = function (delegate) {
    return function () {
      return _patchThenable(delegate.apply(this, arguments));
    };
  };
}


function _patchPromiseFnsOnObject(objectPath, fnNames) {
  var obj = global;

  var exists = objectPath.every(function (segment) {
    obj = obj[segment];
    return obj;
  });

  if (!exists) {
    return;
  }

  fnNames.forEach(function (name) {
    var fn = obj[name];
    if (fn) {
      obj[name] = bindPromiseFn(fn);
    }
  });
}

function _patchThenable(thenable) {
  var then = thenable.then;
  thenable.then = function () {
    var args = utils.bindArguments(arguments);
    var nextThenable = then.apply(thenable, args);
    return _patchThenable(nextThenable);
  };

  var ocatch = thenable.catch;
  thenable.catch = function () {
    var args = utils.bindArguments(arguments);
    var nextThenable = ocatch.apply(thenable, args);
    return _patchThenable(nextThenable);
  };

  return thenable;
}


function apply() {
  // Patch .then() and .catch() on native Promises to execute callbacks in the zone where
  // those functions are called.
  if (global.Promise) {
    utils.patchPrototype(Promise.prototype, [
      'then',
      'catch'
    ]);

    // Patch browser APIs that return a Promise
    var patchFns = [
      // fetch
      [[], ['fetch']],
      [['Response', 'prototype'], ['arrayBuffer', 'blob', 'json', 'text']]
    ];

    patchFns.forEach(function(objPathAndFns) {
      _patchPromiseFnsOnObject(objPathAndFns[0], objPathAndFns[1]);
    });
  }
}

module.exports = {
  apply: apply,
  bindPromiseFn: bindPromiseFn
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils":14}],11:[function(require,module,exports){
(function (global){
'use strict';

var webSocketPatch = require('./websocket');
var utils = require('../utils');

var eventNames = 'copy cut paste abort blur focus canplay canplaythrough change click contextmenu dblclick drag dragend dragenter dragleave dragover dragstart drop durationchange emptied ended input invalid keydown keypress keyup load loadeddata loadedmetadata loadstart message mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup pause play playing progress ratechange reset scroll seeked seeking select show stalled submit suspend timeupdate volumechange waiting mozfullscreenchange mozfullscreenerror mozpointerlockchange mozpointerlockerror error webglcontextrestored webglcontextlost webglcontextcreationerror'.split(' ');

function apply() {
  if (canPatchViaPropertyDescriptor()) {
    // for browsers that we can patch the descriptor:  Chrome & Firefox
    var onEventNames = eventNames.map(function (property) {
      return 'on' + property;
    });
    utils.patchProperties(HTMLElement.prototype, onEventNames);
    utils.patchProperties(XMLHttpRequest.prototype);
    if (typeof WebSocket !== 'undefined') {
      utils.patchProperties(WebSocket.prototype);
    }
  } else {
    // Safari
    patchViaCapturingAllTheEvents();
    utils.patchClass('XMLHttpRequest');
    webSocketPatch.apply();
  }
}

function canPatchViaPropertyDescriptor() {
  if (!Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') && typeof Element !== 'undefined') {
    // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
    // IDL interface attributes are not configurable
    var desc = Object.getOwnPropertyDescriptor(Element.prototype, 'onclick');
    if (desc && !desc.configurable) return false;
  }

  Object.defineProperty(HTMLElement.prototype, 'onclick', {
    get: function () {
      return true;
    }
  });
  var elt = document.createElement('div');
  var result = !!elt.onclick;
  Object.defineProperty(HTMLElement.prototype, 'onclick', {});
  return result;
};

// Whenever any event fires, we check the event target and all parents
// for `onwhatever` properties and replace them with zone-bound functions
// - Chrome (for now)
function patchViaCapturingAllTheEvents() {
  eventNames.forEach(function (property) {
    var onproperty = 'on' + property;
    document.addEventListener(property, function (event) {
      var elt = event.target, bound;
      while (elt) {
        if (elt[onproperty] && !elt[onproperty]._unbound) {
          bound = global.zone.bind(elt[onproperty]);
          bound._unbound = elt[onproperty];
          elt[onproperty] = bound;
        }
        elt = elt.parentElement;
      }
    }, true);
  });
};

module.exports = {
  apply: apply
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils":14,"./websocket":13}],12:[function(require,module,exports){
(function (global){
'use strict';

var _redefineProperty = require('./define-property')._redefineProperty;

function apply() {
  if (!('registerElement' in global.document)) {
    return;
  }

  var _registerElement = document.registerElement;
  var callbacks = [
    'createdCallback',
    'attachedCallback',
    'detachedCallback',
    'attributeChangedCallback'
  ];

  document.registerElement = function (name, opts) {
    if (opts && opts.prototype) {
      callbacks.forEach(function (callback) {
        if (opts.prototype.hasOwnProperty(callback)) {
          var descriptor = Object.getOwnPropertyDescriptor(opts.prototype, callback);
          if (descriptor.value) {
            descriptor.value = global.zone.bind(descriptor.value);
            _redefineProperty(opts.prototype, callback, descriptor);
          } else {
            opts.prototype[callback] = global.zone.bind(opts.prototype[callback]);
          }
        } else if (opts.prototype[callback]) {
          opts.prototype[callback] = global.zone.bind(opts.prototype[callback]);
        }
      });
    }

    return _registerElement.apply(document, [name, opts]);
  };
}

module.exports = {
  apply: apply
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./define-property":5}],13:[function(require,module,exports){
(function (global){
'use strict';

var utils = require('../utils');

// we have to patch the instance since the proto is non-configurable
function apply() {
  var WS = global.WebSocket;
  utils.patchEventTargetMethods(WS.prototype);
  global.WebSocket = function(a, b) {
    var socket = arguments.length > 1 ? new WS(a, b) : new WS(a);
    var proxySocket;

    // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
    var onmessageDesc = Object.getOwnPropertyDescriptor(socket, 'onmessage');
    if (onmessageDesc && onmessageDesc.configurable === false) {
      proxySocket = Object.create(socket);
      ['addEventListener', 'removeEventListener', 'send', 'close'].forEach(function(propName) {
        proxySocket[propName] = function() {
          return socket[propName].apply(socket, arguments);
        };
      });
    } else {
      // we can patch the real socket
      proxySocket = socket;
    }

    utils.patchProperties(proxySocket, ['onclose', 'onerror', 'onmessage', 'onopen']);

    return proxySocket;
  };
}

module.exports = {
  apply: apply
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils":14}],14:[function(require,module,exports){
(function (global){
'use strict';

function bindArguments(args) {
  for (var i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] === 'function') {
      args[i] = global.zone.bind(args[i]);
    }
  }
  return args;
};

function bindArgumentsOnce(args) {
  for (var i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] === 'function') {
      args[i] = global.zone.bindOnce(args[i]);
    }
  }
  return args;
};

function patchPrototype(obj, fnNames) {
  fnNames.forEach(function (name) {
    var delegate = obj[name];
    if (delegate) {
      obj[name] = function () {
        return delegate.apply(this, bindArguments(arguments));
      };
    }
  });
};

function patchProperty(obj, prop) {
  var desc = Object.getOwnPropertyDescriptor(obj, prop) || {
    enumerable: true,
    configurable: true
  };

  // A property descriptor cannot have getter/setter and be writable
  // deleting the writable and value properties avoids this error:
  //
  // TypeError: property descriptors must not specify a value or be writable when a
  // getter or setter has been specified
  delete desc.writable;
  delete desc.value;

  // substr(2) cuz 'onclick' -> 'click', etc
  var eventName = prop.substr(2);
  var _prop = '_' + prop;

  desc.set = function (fn) {
    if (this[_prop]) {
      this.removeEventListener(eventName, this[_prop]);
    }

    if (typeof fn === 'function') {
      this[_prop] = fn;
      this.addEventListener(eventName, fn, false);
    } else {
      this[_prop] = null;
    }
  };

  desc.get = function () {
    return this[_prop];
  };

  Object.defineProperty(obj, prop, desc);
};

function patchProperties(obj, properties) {

  (properties || (function () {
      var props = [];
      for (var prop in obj) {
        props.push(prop);
      }
      return props;
    }()).
    filter(function (propertyName) {
      return propertyName.substr(0,2) === 'on';
    })).
    forEach(function (eventName) {
      patchProperty(obj, eventName);
    });
};

function patchEventTargetMethods(obj) {
  var addDelegate = obj.addEventListener;
  obj.addEventListener = function (eventName, fn) {
    fn._bound = fn._bound || {};
    arguments[1] = fn._bound[eventName] = zone.bind(fn);
    return addDelegate.apply(this, arguments);
  };

  var removeDelegate = obj.removeEventListener;
  obj.removeEventListener = function (eventName, fn) {
    if(arguments[1]._bound && arguments[1]._bound[eventName]) {
      var _bound = arguments[1]._bound;
      arguments[1] = _bound[eventName];
      delete _bound[eventName];
    }
    var result = removeDelegate.apply(this, arguments);
    global.zone.dequeueTask(fn);
    return result;
  };
};

// wrap some native API on `window`
function patchClass(className) {
  var OriginalClass = global[className];
  if (!OriginalClass) return;

  global[className] = function () {
    var a = bindArguments(arguments);
    switch (a.length) {
      case 0: this._o = new OriginalClass(); break;
      case 1: this._o = new OriginalClass(a[0]); break;
      case 2: this._o = new OriginalClass(a[0], a[1]); break;
      case 3: this._o = new OriginalClass(a[0], a[1], a[2]); break;
      case 4: this._o = new OriginalClass(a[0], a[1], a[2], a[3]); break;
      default: throw new Error('what are you even doing?');
    }
  };

  var instance = new OriginalClass();

  var prop;
  for (prop in instance) {
    (function (prop) {
      if (typeof instance[prop] === 'function') {
        global[className].prototype[prop] = function () {
          return this._o[prop].apply(this._o, arguments);
        };
      } else {
        Object.defineProperty(global[className].prototype, prop, {
          set: function (fn) {
            if (typeof fn === 'function') {
              this._o[prop] = global.zone.bind(fn);
            } else {
              this._o[prop] = fn;
            }
          },
          get: function () {
            return this._o[prop];
          }
        });
      }
    }(prop));
  }

  for (prop in OriginalClass) {
    if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
      global[className][prop] = OriginalClass[prop];
    }
  }
};

module.exports = {
  bindArguments: bindArguments,
  bindArgumentsOnce: bindArgumentsOnce,
  patchPrototype: patchPrototype,
  patchProperty: patchProperty,
  patchProperties: patchProperties,
  patchEventTargetMethods: patchEventTargetMethods,
  patchClass: patchClass
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.3.0
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$asap(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,{},typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

if (!global.Zone) {
  throw new Error('zone.js should be installed before loading the long stack trace zone');
}

global.Zone.longStackTraceZone = require('../zones/long-stack-trace.js');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../zones/long-stack-trace.js":2}],2:[function(require,module,exports){
(function (global){
/*
 * Wrapped stacktrace
 *
 * We need this because in some implementations, constructing a trace is slow
 * and so we want to defer accessing the trace for as long as possible
 */

'use strict';

function _Stacktrace(e) {
  this._e = e;
};

_Stacktrace.prototype.get = function () {
  if (global.zone.stackFramesFilter && this._e.stack) {
    return this._e.stack
      .split('\n')
      .filter(global.zone.stackFramesFilter)
      .join('\n');
  }

  return this._e.stack;
}

function _getStacktraceWithUncaughtError () {
  return new _Stacktrace(new Error());
}

function _getStacktraceWithCaughtError () {
  try {
    throw new Error();
  } catch (e) {
    return new _Stacktrace(e);
  }
}

// Some implementations of exception handling don't create a stack trace if the exception
// isn't thrown, however it's faster not to actually throw the exception.
var stack = _getStacktraceWithUncaughtError();

var _getStacktrace = stack && stack._e.stack
  ? _getStacktraceWithUncaughtError
  : _getStacktraceWithCaughtError;

module.exports = {
  getLongStacktrace: function (exception) {
    var traces = [];
    var currentZone = this;
    if (exception) {
      if (currentZone.stackFramesFilter && exception.stack) {
        traces.push(exception.stack.split('\n')
              .filter(currentZone.stackFramesFilter)
              .join('\n'));
      } else {
        traces.push(exception.stack);
      }
    }
    var now = Date.now();

    while (currentZone && currentZone.constructedAtException) {
      traces.push(
          '--- ' + (Date(currentZone.constructedAtTime)).toString() +
          ' - ' + (now - currentZone.constructedAtTime) + 'ms ago',
          currentZone.constructedAtException.get());
      currentZone = currentZone.parent;
    }

    return traces.join('\n');
  },

  stackFramesFilter: function (line) {
    return /zone(-microtask)?(\.min)?\.js/.test(line);
  },

  onError: function (exception) {
    var reporter = this.reporter || console.log.bind(console);
    reporter(exception.toString());
    reporter(this.getLongStacktrace(exception));
  },

  '$fork': function (parentFork) {
    return function() {
      var newZone = parentFork.apply(this, arguments);
      newZone.constructedAtException = _getStacktrace();
      newZone.constructedAtTime = Date.now();
      return newZone;
    }
  }
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);

var define, requireModule, require, requirejs;

(function() {

  var _isArray;
  if (!Array.isArray) {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    };
  } else {
    _isArray = Array.isArray;
  }

  var registry = {}, seen = {};
  var FAILED = false;

  var uuid = 0;

  function tryFinally(tryable, finalizer) {
    try {
      return tryable();
    } finally {
      finalizer();
    }
  }


  function Module(name, deps, callback, exports) {
    var defaultDeps = ['require', 'exports', 'module'];

    this.id       = uuid++;
    this.name     = name;
    this.deps     = !deps.length && callback.length ? defaultDeps : deps;
    this.exports  = exports || { };
    this.callback = callback;
    this.state    = undefined;
  }

  define = function(name, deps, callback) {
    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }

    registry[name] = new Module(name, deps, callback);
  };

  define.amd = {};

  function reify(mod, name, seen) {
    var deps = mod.deps;
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    // TODO: new Module
    // TODO: seen refactor
    var module = { };

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        module.exports = reified[i] = seen;
      } else if (dep === 'require') {
        reified[i] = require;
      } else if (dep === 'module') {
        mod.exports = seen;
        module = reified[i] = mod;
      } else {
        reified[i] = require(resolve(dep, name));
      }
    }

    return {
      deps: reified,
      module: module
    };
  }

  requirejs = require = requireModule = function(name) {
    var mod = registry[name];
    if (!mod) {
      throw new Error('Could not find module ' + name);
    }

    if (mod.state !== FAILED &&
        seen.hasOwnProperty(name)) {
      return seen[name];
    }

    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    tryFinally(function() {
      reified = reify(mod, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    }, function() {
      if (!loaded) {
        mod.state = FAILED;
      }
    });

    if (module === undefined && reified.module.exports) {
      return (seen[name] = reified.module.exports);
    } else {
      return (seen[name] = module);
    }
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase = nameParts.slice(0, -1);

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') { parentBase.pop(); }
      else if (part === '.') { continue; }
      else { parentBase.push(part); }
    }

    return parentBase.join('/');
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.clear = function(){
    requirejs.entries = requirejs._eak_seen = registry = {};
    seen = state = {};
  };
})();

define("dom-helper", ["exports", "module", "./htmlbars-runtime/morph", "./morph-attr", "./dom-helper/build-html-dom", "./dom-helper/classes", "./dom-helper/prop"], function (exports, module, _htmlbarsRuntimeMorph, _morphAttr, _domHelperBuildHtmlDom, _domHelperClasses, _domHelperProp) {
  "use strict";

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _Morph = _interopRequireDefault(_htmlbarsRuntimeMorph);

  var _AttrMorph = _interopRequireDefault(_morphAttr);

  var doc = typeof document === 'undefined' ? false : document;

  var deletesBlankTextNodes = doc && (function (document) {
    var element = document.createElement('div');
    element.appendChild(document.createTextNode(''));
    var clonedElement = element.cloneNode(true);
    return clonedElement.childNodes.length === 0;
  })(doc);

  var ignoresCheckedAttribute = doc && (function (document) {
    var element = document.createElement('input');
    element.setAttribute('checked', 'checked');
    var clonedElement = element.cloneNode(false);
    return !clonedElement.checked;
  })(doc);

  var canRemoveSvgViewBoxAttribute = doc && (doc.createElementNS ? (function (document) {
    var element = document.createElementNS(_domHelperBuildHtmlDom.svgNamespace, 'svg');
    element.setAttribute('viewBox', '0 0 100 100');
    element.removeAttribute('viewBox');
    return !element.getAttribute('viewBox');
  })(doc) : true);

  var canClone = doc && (function (document) {
    var element = document.createElement('div');
    element.appendChild(document.createTextNode(' '));
    element.appendChild(document.createTextNode(' '));
    var clonedElement = element.cloneNode(true);
    return clonedElement.childNodes[0].nodeValue === ' ';
  })(doc);

  // This is not the namespace of the element, but of
  // the elements inside that elements.
  function interiorNamespace(element) {
    if (element && element.namespaceURI === _domHelperBuildHtmlDom.svgNamespace && !_domHelperBuildHtmlDom.svgHTMLIntegrationPoints[element.tagName]) {
      return _domHelperBuildHtmlDom.svgNamespace;
    } else {
      return null;
    }
  }

  // The HTML spec allows for "omitted start tags". These tags are optional
  // when their intended child is the first thing in the parent tag. For
  // example, this is a tbody start tag:
  //
  // <table>
  //   <tbody>
  //     <tr>
  //
  // The tbody may be omitted, and the browser will accept and render:
  //
  // <table>
  //   <tr>
  //
  // However, the omitted start tag will still be added to the DOM. Here
  // we test the string and context to see if the browser is about to
  // perform this cleanup.
  //
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/syntax.html#optional-tags
  // describes which tags are omittable. The spec for tbody and colgroup
  // explains this behavior:
  //
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/tables.html#the-tbody-element
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/tables.html#the-colgroup-element
  //

  var omittedStartTagChildTest = /<([\w:]+)/;
  function detectOmittedStartTag(string, contextualElement) {
    // Omitted start tags are only inside table tags.
    if (contextualElement.tagName === 'TABLE') {
      var omittedStartTagChildMatch = omittedStartTagChildTest.exec(string);
      if (omittedStartTagChildMatch) {
        var omittedStartTagChild = omittedStartTagChildMatch[1];
        // It is already asserted that the contextual element is a table
        // and not the proper start tag. Just see if a tag was omitted.
        return omittedStartTagChild === 'tr' || omittedStartTagChild === 'col';
      }
    }
  }

  function buildSVGDOM(html, dom) {
    var div = dom.document.createElement('div');
    div.innerHTML = '<svg>' + html + '</svg>';
    return div.firstChild.childNodes;
  }

  var guid = 1;

  function ElementMorph(element, dom, namespace) {
    this.element = element;
    this.dom = dom;
    this.namespace = namespace;
    this.guid = "element" + guid++;

    this.state = {};
    this.isDirty = true;
  }

  // renderAndCleanup calls `clear` on all items in the morph map
  // just before calling `destroy` on the morph.
  //
  // As a future refactor this could be changed to set the property
  // back to its original/default value.
  ElementMorph.prototype.clear = function () {};

  ElementMorph.prototype.destroy = function () {
    this.element = null;
    this.dom = null;
  };

  /*
   * A class wrapping DOM functions to address environment compatibility,
   * namespaces, contextual elements for morph un-escaped content
   * insertion.
   *
   * When entering a template, a DOMHelper should be passed:
   *
   *   template(context, { hooks: hooks, dom: new DOMHelper() });
   *
   * TODO: support foreignObject as a passed contextual element. It has
   * a namespace (svg) that does not match its internal namespace
   * (xhtml).
   *
   * @class DOMHelper
   * @constructor
   * @param {HTMLDocument} _document The document DOM methods are proxied to
   */
  function DOMHelper(_document) {
    this.document = _document || document;
    if (!this.document) {
      throw new Error("A document object must be passed to the DOMHelper, or available on the global scope");
    }
    this.canClone = canClone;
    this.namespace = null;
  }

  var prototype = DOMHelper.prototype;
  prototype.constructor = DOMHelper;

  prototype.getElementById = function (id, rootNode) {
    rootNode = rootNode || this.document;
    return rootNode.getElementById(id);
  };

  prototype.insertBefore = function (element, childElement, referenceChild) {
    return element.insertBefore(childElement, referenceChild);
  };

  prototype.appendChild = function (element, childElement) {
    return element.appendChild(childElement);
  };

  prototype.childAt = function (element, indices) {
    var child = element;

    for (var i = 0; i < indices.length; i++) {
      child = child.childNodes.item(indices[i]);
    }

    return child;
  };

  // Note to a Fellow Implementor:
  // Ahh, accessing a child node at an index. Seems like it should be so simple,
  // doesn't it? Unfortunately, this particular method has caused us a surprising
  // amount of pain. As you'll note below, this method has been modified to walk
  // the linked list of child nodes rather than access the child by index
  // directly, even though there are two (2) APIs in the DOM that do this for us.
  // If you're thinking to yourself, "What an oversight! What an opportunity to
  // optimize this code!" then to you I say: stop! For I have a tale to tell.
  //
  // First, this code must be compatible with simple-dom for rendering on the
  // server where there is no real DOM. Previously, we accessed a child node
  // directly via `element.childNodes[index]`. While we *could* in theory do a
  // full-fidelity simulation of a live `childNodes` array, this is slow,
  // complicated and error-prone.
  //
  // "No problem," we thought, "we'll just use the similar
  // `childNodes.item(index)` API." Then, we could just implement our own `item`
  // method in simple-dom and walk the child node linked list there, allowing
  // us to retain the performance advantages of the (surely optimized) `item()`
  // API in the browser.
  //
  // Unfortunately, an enterprising soul named Samy Alzahrani discovered that in
  // IE8, accessing an item out-of-bounds via `item()` causes an exception where
  // other browsers return null. This necessitated a... check of
  // `childNodes.length`, bringing us back around to having to support a
  // full-fidelity `childNodes` array!
  //
  // Worst of all, Kris Selden investigated how browsers are actualy implemented
  // and discovered that they're all linked lists under the hood anyway. Accessing
  // `childNodes` requires them to allocate a new live collection backed by that
  // linked list, which is itself a rather expensive operation. Our assumed
  // optimization had backfired! That is the danger of magical thinking about
  // the performance of native implementations.
  //
  // And this, my friends, is why the following implementation just walks the
  // linked list, as surprised as that may make you. Please ensure you understand
  // the above before changing this and submitting a PR.
  //
  // Tom Dale, January 18th, 2015, Portland OR
  prototype.childAtIndex = function (element, index) {
    var node = element.firstChild;

    for (var idx = 0; node && idx < index; idx++) {
      node = node.nextSibling;
    }

    return node;
  };

  prototype.appendText = function (element, text) {
    return element.appendChild(this.document.createTextNode(text));
  };

  prototype.setAttribute = function (element, name, value) {
    element.setAttribute(name, String(value));
  };

  prototype.getAttribute = function (element, name) {
    return element.getAttribute(name);
  };

  prototype.setAttributeNS = function (element, namespace, name, value) {
    element.setAttributeNS(namespace, name, String(value));
  };

  prototype.getAttributeNS = function (element, namespace, name) {
    return element.getAttributeNS(namespace, name);
  };

  if (canRemoveSvgViewBoxAttribute) {
    prototype.removeAttribute = function (element, name) {
      element.removeAttribute(name);
    };
  } else {
    prototype.removeAttribute = function (element, name) {
      if (element.tagName === 'svg' && name === 'viewBox') {
        element.setAttribute(name, null);
      } else {
        element.removeAttribute(name);
      }
    };
  }

  prototype.setPropertyStrict = function (element, name, value) {
    if (value === undefined) {
      value = null;
    }

    if (value === null && (name === 'value' || name === 'type' || name === 'src')) {
      value = '';
    }

    element[name] = value;
  };

  prototype.getPropertyStrict = function (element, name) {
    return element[name];
  };

  prototype.setProperty = function (element, name, value, namespace) {
    var lowercaseName = name.toLowerCase();
    if (element.namespaceURI === _domHelperBuildHtmlDom.svgNamespace || lowercaseName === 'style') {
      if ((0, _domHelperProp.isAttrRemovalValue)(value)) {
        element.removeAttribute(name);
      } else {
        if (namespace) {
          element.setAttributeNS(namespace, name, value);
        } else {
          element.setAttribute(name, value);
        }
      }
    } else {
      var normalized = (0, _domHelperProp.normalizeProperty)(element, name);
      if (normalized) {
        element[normalized] = value;
      } else {
        if ((0, _domHelperProp.isAttrRemovalValue)(value)) {
          element.removeAttribute(name);
        } else {
          if (namespace && element.setAttributeNS) {
            element.setAttributeNS(namespace, name, value);
          } else {
            element.setAttribute(name, value);
          }
        }
      }
    }
  };

  if (doc && doc.createElementNS) {
    // Only opt into namespace detection if a contextualElement
    // is passed.
    prototype.createElement = function (tagName, contextualElement) {
      var namespace = this.namespace;
      if (contextualElement) {
        if (tagName === 'svg') {
          namespace = _domHelperBuildHtmlDom.svgNamespace;
        } else {
          namespace = interiorNamespace(contextualElement);
        }
      }
      if (namespace) {
        return this.document.createElementNS(namespace, tagName);
      } else {
        return this.document.createElement(tagName);
      }
    };
    prototype.setAttributeNS = function (element, namespace, name, value) {
      element.setAttributeNS(namespace, name, String(value));
    };
  } else {
    prototype.createElement = function (tagName) {
      return this.document.createElement(tagName);
    };
    prototype.setAttributeNS = function (element, namespace, name, value) {
      element.setAttribute(name, String(value));
    };
  }

  prototype.addClasses = _domHelperClasses.addClasses;
  prototype.removeClasses = _domHelperClasses.removeClasses;

  prototype.setNamespace = function (ns) {
    this.namespace = ns;
  };

  prototype.detectNamespace = function (element) {
    this.namespace = interiorNamespace(element);
  };

  prototype.createDocumentFragment = function () {
    return this.document.createDocumentFragment();
  };

  prototype.createTextNode = function (text) {
    return this.document.createTextNode(text);
  };

  prototype.createComment = function (text) {
    return this.document.createComment(text);
  };

  prototype.repairClonedNode = function (element, blankChildTextNodes, isChecked) {
    if (deletesBlankTextNodes && blankChildTextNodes.length > 0) {
      for (var i = 0, len = blankChildTextNodes.length; i < len; i++) {
        var textNode = this.document.createTextNode(''),
            offset = blankChildTextNodes[i],
            before = this.childAtIndex(element, offset);
        if (before) {
          element.insertBefore(textNode, before);
        } else {
          element.appendChild(textNode);
        }
      }
    }
    if (ignoresCheckedAttribute && isChecked) {
      element.setAttribute('checked', 'checked');
    }
  };

  prototype.cloneNode = function (element, deep) {
    var clone = element.cloneNode(!!deep);
    return clone;
  };

  prototype.AttrMorphClass = _AttrMorph["default"];

  prototype.createAttrMorph = function (element, attrName, namespace) {
    return new this.AttrMorphClass(element, attrName, this, namespace);
  };

  prototype.ElementMorphClass = ElementMorph;

  prototype.createElementMorph = function (element, namespace) {
    return new this.ElementMorphClass(element, this, namespace);
  };

  prototype.createUnsafeAttrMorph = function (element, attrName, namespace) {
    var morph = this.createAttrMorph(element, attrName, namespace);
    morph.escaped = false;
    return morph;
  };

  prototype.MorphClass = _Morph["default"];

  prototype.createMorph = function (parent, start, end, contextualElement) {
    if (contextualElement && contextualElement.nodeType === 11) {
      throw new Error("Cannot pass a fragment as the contextual element to createMorph");
    }

    if (!contextualElement && parent && parent.nodeType === 1) {
      contextualElement = parent;
    }
    var morph = new this.MorphClass(this, contextualElement);
    morph.firstNode = start;
    morph.lastNode = end;
    return morph;
  };

  prototype.createFragmentMorph = function (contextualElement) {
    if (contextualElement && contextualElement.nodeType === 11) {
      throw new Error("Cannot pass a fragment as the contextual element to createMorph");
    }

    var fragment = this.createDocumentFragment();
    return _Morph["default"].create(this, contextualElement, fragment);
  };

  prototype.replaceContentWithMorph = function (element) {
    var firstChild = element.firstChild;

    if (!firstChild) {
      var comment = this.createComment('');
      this.appendChild(element, comment);
      return _Morph["default"].create(this, element, comment);
    } else {
      var morph = _Morph["default"].attach(this, element, firstChild, element.lastChild);
      morph.clear();
      return morph;
    }
  };

  prototype.createUnsafeMorph = function (parent, start, end, contextualElement) {
    var morph = this.createMorph(parent, start, end, contextualElement);
    morph.parseTextAsHTML = true;
    return morph;
  };

  // This helper is just to keep the templates good looking,
  // passing integers instead of element references.
  prototype.createMorphAt = function (parent, startIndex, endIndex, contextualElement) {
    var single = startIndex === endIndex;
    var start = this.childAtIndex(parent, startIndex);
    var end = single ? start : this.childAtIndex(parent, endIndex);
    return this.createMorph(parent, start, end, contextualElement);
  };

  prototype.createUnsafeMorphAt = function (parent, startIndex, endIndex, contextualElement) {
    var morph = this.createMorphAt(parent, startIndex, endIndex, contextualElement);
    morph.parseTextAsHTML = true;
    return morph;
  };

  prototype.insertMorphBefore = function (element, referenceChild, contextualElement) {
    var insertion = this.document.createComment('');
    element.insertBefore(insertion, referenceChild);
    return this.createMorph(element, insertion, insertion, contextualElement);
  };

  prototype.appendMorph = function (element, contextualElement) {
    var insertion = this.document.createComment('');
    element.appendChild(insertion);
    return this.createMorph(element, insertion, insertion, contextualElement);
  };

  prototype.insertBoundary = function (fragment, index) {
    // this will always be null or firstChild
    var child = index === null ? null : this.childAtIndex(fragment, index);
    this.insertBefore(fragment, this.createTextNode(''), child);
  };

  prototype.parseHTML = function (html, contextualElement) {
    var childNodes;

    if (interiorNamespace(contextualElement) === _domHelperBuildHtmlDom.svgNamespace) {
      childNodes = buildSVGDOM(html, this);
    } else {
      var nodes = (0, _domHelperBuildHtmlDom.buildHTMLDOM)(html, contextualElement, this);
      if (detectOmittedStartTag(html, contextualElement)) {
        var node = nodes[0];
        while (node && node.nodeType !== 1) {
          node = node.nextSibling;
        }
        childNodes = node.childNodes;
      } else {
        childNodes = nodes;
      }
    }

    // Copy node list to a fragment.
    var fragment = this.document.createDocumentFragment();

    if (childNodes && childNodes.length > 0) {
      var currentNode = childNodes[0];

      // We prepend an <option> to <select> boxes to absorb any browser bugs
      // related to auto-select behavior. Skip past it.
      if (contextualElement.tagName === 'SELECT') {
        currentNode = currentNode.nextSibling;
      }

      while (currentNode) {
        var tempNode = currentNode;
        currentNode = currentNode.nextSibling;

        fragment.appendChild(tempNode);
      }
    }

    return fragment;
  };

  var parsingNode;

  // Used to determine whether a URL needs to be sanitized.
  prototype.protocolForURL = function (url) {
    if (!parsingNode) {
      parsingNode = this.document.createElement('a');
    }

    parsingNode.href = url;
    return parsingNode.protocol;
  };

  module.exports = DOMHelper;
});
define('dom-helper/build-html-dom', ['exports'], function (exports) {
  /* global XMLSerializer:false */
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var svgHTMLIntegrationPoints = { foreignObject: 1, desc: 1, title: 1 };
  exports.svgHTMLIntegrationPoints = svgHTMLIntegrationPoints;
  var svgNamespace = 'http://www.w3.org/2000/svg';

  exports.svgNamespace = svgNamespace;
  var doc = typeof document === 'undefined' ? false : document;

  // Safari does not like using innerHTML on SVG HTML integration
  // points (desc/title/foreignObject).
  var needsIntegrationPointFix = doc && (function (document) {
    if (document.createElementNS === undefined) {
      return;
    }
    // In FF title will not accept innerHTML.
    var testEl = document.createElementNS(svgNamespace, 'title');
    testEl.innerHTML = "<div></div>";
    return testEl.childNodes.length === 0 || testEl.childNodes[0].nodeType !== 1;
  })(doc);

  // Internet Explorer prior to 9 does not allow setting innerHTML if the first element
  // is a "zero-scope" element. This problem can be worked around by making
  // the first node an invisible text node. We, like Modernizr, use &shy;
  var needsShy = doc && (function (document) {
    var testEl = document.createElement('div');
    testEl.innerHTML = "<div></div>";
    testEl.firstChild.innerHTML = "<script><\/script>";
    return testEl.firstChild.innerHTML === '';
  })(doc);

  // IE 8 (and likely earlier) likes to move whitespace preceeding
  // a script tag to appear after it. This means that we can
  // accidentally remove whitespace when updating a morph.
  var movesWhitespace = doc && (function (document) {
    var testEl = document.createElement('div');
    testEl.innerHTML = "Test: <script type='text/x-placeholder'><\/script>Value";
    return testEl.childNodes[0].nodeValue === 'Test:' && testEl.childNodes[2].nodeValue === ' Value';
  })(doc);

  var tagNamesRequiringInnerHTMLFix = doc && (function (document) {
    var tagNamesRequiringInnerHTMLFix;
    // IE 9 and earlier don't allow us to set innerHTML on col, colgroup, frameset,
    // html, style, table, tbody, tfoot, thead, title, tr. Detect this and add
    // them to an initial list of corrected tags.
    //
    // Here we are only dealing with the ones which can have child nodes.
    //
    var tableNeedsInnerHTMLFix;
    var tableInnerHTMLTestElement = document.createElement('table');
    try {
      tableInnerHTMLTestElement.innerHTML = '<tbody></tbody>';
    } catch (e) {} finally {
      tableNeedsInnerHTMLFix = tableInnerHTMLTestElement.childNodes.length === 0;
    }
    if (tableNeedsInnerHTMLFix) {
      tagNamesRequiringInnerHTMLFix = {
        colgroup: ['table'],
        table: [],
        tbody: ['table'],
        tfoot: ['table'],
        thead: ['table'],
        tr: ['table', 'tbody']
      };
    }

    // IE 8 doesn't allow setting innerHTML on a select tag. Detect this and
    // add it to the list of corrected tags.
    //
    var selectInnerHTMLTestElement = document.createElement('select');
    selectInnerHTMLTestElement.innerHTML = '<option></option>';
    if (!selectInnerHTMLTestElement.childNodes[0]) {
      tagNamesRequiringInnerHTMLFix = tagNamesRequiringInnerHTMLFix || {};
      tagNamesRequiringInnerHTMLFix.select = [];
    }
    return tagNamesRequiringInnerHTMLFix;
  })(doc);

  function scriptSafeInnerHTML(element, html) {
    // without a leading text node, IE will drop a leading script tag.
    html = '&shy;' + html;

    element.innerHTML = html;

    var nodes = element.childNodes;

    // Look for &shy; to remove it.
    var shyElement = nodes[0];
    while (shyElement.nodeType === 1 && !shyElement.nodeName) {
      shyElement = shyElement.firstChild;
    }
    // At this point it's the actual unicode character.
    if (shyElement.nodeType === 3 && shyElement.nodeValue.charAt(0) === '­') {
      var newValue = shyElement.nodeValue.slice(1);
      if (newValue.length) {
        shyElement.nodeValue = shyElement.nodeValue.slice(1);
      } else {
        shyElement.parentNode.removeChild(shyElement);
      }
    }

    return nodes;
  }

  function buildDOMWithFix(html, contextualElement) {
    var tagName = contextualElement.tagName;

    // Firefox versions < 11 do not have support for element.outerHTML.
    var outerHTML = contextualElement.outerHTML || new XMLSerializer().serializeToString(contextualElement);
    if (!outerHTML) {
      throw "Can't set innerHTML on " + tagName + " in this browser";
    }

    html = fixSelect(html, contextualElement);

    var wrappingTags = tagNamesRequiringInnerHTMLFix[tagName.toLowerCase()];

    var startTag = outerHTML.match(new RegExp("<" + tagName + "([^>]*)>", 'i'))[0];
    var endTag = '</' + tagName + '>';

    var wrappedHTML = [startTag, html, endTag];

    var i = wrappingTags.length;
    var wrappedDepth = 1 + i;
    while (i--) {
      wrappedHTML.unshift('<' + wrappingTags[i] + '>');
      wrappedHTML.push('</' + wrappingTags[i] + '>');
    }

    var wrapper = document.createElement('div');
    scriptSafeInnerHTML(wrapper, wrappedHTML.join(''));
    var element = wrapper;
    while (wrappedDepth--) {
      element = element.firstChild;
      while (element && element.nodeType !== 1) {
        element = element.nextSibling;
      }
    }
    while (element && element.tagName !== tagName) {
      element = element.nextSibling;
    }
    return element ? element.childNodes : [];
  }

  var buildDOM;
  if (needsShy) {
    buildDOM = function buildDOM(html, contextualElement, dom) {
      html = fixSelect(html, contextualElement);

      contextualElement = dom.cloneNode(contextualElement, false);
      scriptSafeInnerHTML(contextualElement, html);
      return contextualElement.childNodes;
    };
  } else {
    buildDOM = function buildDOM(html, contextualElement, dom) {
      html = fixSelect(html, contextualElement);

      contextualElement = dom.cloneNode(contextualElement, false);
      contextualElement.innerHTML = html;
      return contextualElement.childNodes;
    };
  }

  function fixSelect(html, contextualElement) {
    if (contextualElement.tagName === 'SELECT') {
      html = "<option></option>" + html;
    }

    return html;
  }

  var buildIESafeDOM;
  if (tagNamesRequiringInnerHTMLFix || movesWhitespace) {
    buildIESafeDOM = function buildIESafeDOM(html, contextualElement, dom) {
      // Make a list of the leading text on script nodes. Include
      // script tags without any whitespace for easier processing later.
      var spacesBefore = [];
      var spacesAfter = [];
      if (typeof html === 'string') {
        html = html.replace(/(\s*)(<script)/g, function (match, spaces, tag) {
          spacesBefore.push(spaces);
          return tag;
        });

        html = html.replace(/(<\/script>)(\s*)/g, function (match, tag, spaces) {
          spacesAfter.push(spaces);
          return tag;
        });
      }

      // Fetch nodes
      var nodes;
      if (tagNamesRequiringInnerHTMLFix[contextualElement.tagName.toLowerCase()]) {
        // buildDOMWithFix uses string wrappers for problematic innerHTML.
        nodes = buildDOMWithFix(html, contextualElement);
      } else {
        nodes = buildDOM(html, contextualElement, dom);
      }

      // Build a list of script tags, the nodes themselves will be
      // mutated as we add test nodes.
      var i, j, node, nodeScriptNodes;
      var scriptNodes = [];
      for (i = 0; i < nodes.length; i++) {
        node = nodes[i];
        if (node.nodeType !== 1) {
          continue;
        }
        if (node.tagName === 'SCRIPT') {
          scriptNodes.push(node);
        } else {
          nodeScriptNodes = node.getElementsByTagName('script');
          for (j = 0; j < nodeScriptNodes.length; j++) {
            scriptNodes.push(nodeScriptNodes[j]);
          }
        }
      }

      // Walk the script tags and put back their leading text nodes.
      var scriptNode, textNode, spaceBefore, spaceAfter;
      for (i = 0; i < scriptNodes.length; i++) {
        scriptNode = scriptNodes[i];
        spaceBefore = spacesBefore[i];
        if (spaceBefore && spaceBefore.length > 0) {
          textNode = dom.document.createTextNode(spaceBefore);
          scriptNode.parentNode.insertBefore(textNode, scriptNode);
        }

        spaceAfter = spacesAfter[i];
        if (spaceAfter && spaceAfter.length > 0) {
          textNode = dom.document.createTextNode(spaceAfter);
          scriptNode.parentNode.insertBefore(textNode, scriptNode.nextSibling);
        }
      }

      return nodes;
    };
  } else {
    buildIESafeDOM = buildDOM;
  }

  var buildHTMLDOM;
  if (needsIntegrationPointFix) {
    exports.buildHTMLDOM = buildHTMLDOM = function buildHTMLDOM(html, contextualElement, dom) {
      if (svgHTMLIntegrationPoints[contextualElement.tagName]) {
        return buildIESafeDOM(html, document.createElement('div'), dom);
      } else {
        return buildIESafeDOM(html, contextualElement, dom);
      }
    };
  } else {
    exports.buildHTMLDOM = buildHTMLDOM = buildIESafeDOM;
  }

  exports.buildHTMLDOM = buildHTMLDOM;
});
define('dom-helper/classes', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var doc = typeof document === 'undefined' ? false : document;

  // PhantomJS has a broken classList. See https://github.com/ariya/phantomjs/issues/12782
  var canClassList = doc && (function () {
    var d = document.createElement('div');
    if (!d.classList) {
      return false;
    }
    d.classList.add('boo');
    d.classList.add('boo', 'baz');
    return d.className === 'boo baz';
  })();

  function buildClassList(element) {
    var classString = element.getAttribute('class') || '';
    return classString !== '' && classString !== ' ' ? classString.split(' ') : [];
  }

  function intersect(containingArray, valuesArray) {
    var containingIndex = 0;
    var containingLength = containingArray.length;
    var valuesIndex = 0;
    var valuesLength = valuesArray.length;

    var intersection = new Array(valuesLength);

    // TODO: rewrite this loop in an optimal manner
    for (; containingIndex < containingLength; containingIndex++) {
      valuesIndex = 0;
      for (; valuesIndex < valuesLength; valuesIndex++) {
        if (valuesArray[valuesIndex] === containingArray[containingIndex]) {
          intersection[valuesIndex] = containingIndex;
          break;
        }
      }
    }

    return intersection;
  }

  function addClassesViaAttribute(element, classNames) {
    var existingClasses = buildClassList(element);

    var indexes = intersect(existingClasses, classNames);
    var didChange = false;

    for (var i = 0, l = classNames.length; i < l; i++) {
      if (indexes[i] === undefined) {
        didChange = true;
        existingClasses.push(classNames[i]);
      }
    }

    if (didChange) {
      element.setAttribute('class', existingClasses.length > 0 ? existingClasses.join(' ') : '');
    }
  }

  function removeClassesViaAttribute(element, classNames) {
    var existingClasses = buildClassList(element);

    var indexes = intersect(classNames, existingClasses);
    var didChange = false;
    var newClasses = [];

    for (var i = 0, l = existingClasses.length; i < l; i++) {
      if (indexes[i] === undefined) {
        newClasses.push(existingClasses[i]);
      } else {
        didChange = true;
      }
    }

    if (didChange) {
      element.setAttribute('class', newClasses.length > 0 ? newClasses.join(' ') : '');
    }
  }

  var addClasses, removeClasses;
  if (canClassList) {
    exports.addClasses = addClasses = function addClasses(element, classNames) {
      if (element.classList) {
        if (classNames.length === 1) {
          element.classList.add(classNames[0]);
        } else if (classNames.length === 2) {
          element.classList.add(classNames[0], classNames[1]);
        } else {
          element.classList.add.apply(element.classList, classNames);
        }
      } else {
        addClassesViaAttribute(element, classNames);
      }
    };
    exports.removeClasses = removeClasses = function removeClasses(element, classNames) {
      if (element.classList) {
        if (classNames.length === 1) {
          element.classList.remove(classNames[0]);
        } else if (classNames.length === 2) {
          element.classList.remove(classNames[0], classNames[1]);
        } else {
          element.classList.remove.apply(element.classList, classNames);
        }
      } else {
        removeClassesViaAttribute(element, classNames);
      }
    };
  } else {
    exports.addClasses = addClasses = addClassesViaAttribute;
    exports.removeClasses = removeClasses = removeClassesViaAttribute;
  }

  exports.addClasses = addClasses;
  exports.removeClasses = removeClasses;
});
define('dom-helper/prop', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.isAttrRemovalValue = isAttrRemovalValue;
  exports.normalizeProperty = normalizeProperty;

  function isAttrRemovalValue(value) {
    return value === null || value === undefined;
  }

  function UNDEFINED() {}

  // TODO should this be an o_create kind of thing?
  var propertyCaches = {};

  exports.propertyCaches = propertyCaches;

  function normalizeProperty(element, attrName) {
    var tagName = element.tagName;
    var key, cachedAttrName;
    var cache = propertyCaches[tagName];
    if (!cache) {
      // TODO should this be an o_create kind of thing?
      cache = {};
      for (cachedAttrName in element) {
        key = cachedAttrName.toLowerCase();
        if (isSettable(element, cachedAttrName)) {
          cache[key] = cachedAttrName;
        } else {
          cache[key] = UNDEFINED;
        }
      }
      propertyCaches[tagName] = cache;
    }

    // presumes that the attrName has been lowercased.
    var value = cache[attrName];
    return value === UNDEFINED ? undefined : value;
  }

  // elements with a property that does not conform to the spec in certain
  // browsers. In these cases, we'll end up using setAttribute instead
  var badPairs = [{
    // phantomjs < 2.0 lets you set it as a prop but won't reflect it
    // back to the attribute. button.getAttribute('type') === null
    tagName: 'BUTTON',
    propName: 'type'
  }, {
    // Some version of IE (like IE9) actually throw an exception
    // if you set input.type = 'something-unknown'
    tagName: 'INPUT',
    propName: 'type'
  }, {
    // Some versions of IE (IE8) throw an exception when setting
    // `input.list = 'somestring'`:
    // https://github.com/emberjs/ember.js/issues/10908
    // https://github.com/emberjs/ember.js/issues/11364
    tagName: 'INPUT',
    propName: 'list'
  }];

  function isSettable(element, attrName) {
    for (var i = 0, l = badPairs.length; i < l; i++) {
      var pair = badPairs[i];
      if (pair.tagName === element.tagName && pair.propName === attrName) {
        return false;
      }
    }

    return true;
  }
});
define('graffiti/decorators/reflectToAttribute', ['exports', 'module', './utils', '../private/utils'], function (exports, module, _utils, _privateUtils) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  module.exports = reflectToAttribute;

  function metaForDescriptor(context, key) {
    var _metaFor = (0, _privateUtils.metaFor)(context);

    var descriptors = _metaFor.descriptors;

    var descMeta = descriptors[key];
    if (!descMeta) {
      descMeta = descriptors[key] = { hasRunInitializer: false, value: undefined };
    }

    return descMeta;
  }

  function decorateDescriptor(target, key, _ref) {
    var enumerable = _ref.enumerable;
    var initializer = _ref.initializer;

    var _ref2 = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

    var _ref22 = _slicedToArray(_ref2, 1);

    var attrName = _ref22[0];

    if (attrName === undefined) {
      attrName = key;
    }

    return {
      // Keep these the same from the original descriptor
      key: key, enumerable: enumerable,

      get: function get() {
        var descMeta = metaForDescriptor(this, key);

        if (descMeta.hasRunInitializer) {
          return descMeta.value;
        } else {
          var ret = descMeta.value = initializer.call(this);
          descMeta.hasRunInitializer = true;
          return ret;
        }
      },

      set: function set(newValue) {
        var meta = (0, _privateUtils.metaFor)(this);
        var descMeta = metaForDescriptor(this, key);

        descMeta.value = newValue;

        if (meta.isInitializing) {
          // Don't reflect the value during class instance initialization
          // otherwise it will blow away any value the consumer set
          if (this.hasAttribute(attrName)) {
            return;
          }
        }

        meta.isCheckingAttributes = true;

        switch (newValue) {
          case true:
            this.setAttribute(attrName, '');
            break;

          case false:
          case null:
          case undefined:
            this.removeAttribute(attrName);
            break;

          default:
            this.setAttribute(attrName, '' + newValue);
        }

        meta.isCheckingAttributes = false;
      }
    };
  }

  function reflectToAttribute() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _utils.decorate)(decorateDescriptor, args);
  }
});
define('graffiti/decorators/registerElement', ['exports', 'module', '../mixins/Component', '../private/utils'], function (exports, module, _mixinsComponent, _privateUtils) {
  'use strict';

  module.exports = registerElement;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _ComponentMixin = _interopRequireDefault(_mixinsComponent);

  function registerElement(tagName) {
    return function (target) {
      if (tagName === undefined) {
        tagName = (0, _privateUtils.dasherize)(target.name.replace(/Component|Element$/, ''));
      }

      (0, _privateUtils.assert)('<' + tagName + '> must inherit from HTMLElement or SVGElement', target.prototype instanceof HTMLElement || target.prototype instanceof SVGElement);

      (0, _privateUtils.metaFor)(target.prototype).elementConstructor = target;

      Object.assign(target.prototype, _ComponentMixin['default']);

      Object.getPrototypeOf(target.prototype).constructor = function () {
        // Guards against calling the actual HTMLElement|SVGElement constructor
        // because that's not currently supported
      };

      // @TODO: the *actual* constructor to create the
      // element is being lost here...but if we return it,
      // it breaks inheritance model.
      document.registerElement(tagName, target);

      return target;
    };
  }
});
define('graffiti/decorators/utils', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var _slice = Array.prototype.slice;
  exports.isDescriptor = isDescriptor;
  exports.decorate = decorate;

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function isDescriptor(desc) {
    if (!desc || !desc.hasOwnProperty) {
      return false;
    }

    var keys = ['value', 'get', 'set'];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        if (desc.hasOwnProperty(key)) {
          return true;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return false;
  }

  function decorate(decorator, entryArgs) {
    if (isDescriptor(entryArgs[entryArgs.length - 1])) {
      return decorator.apply(undefined, _toConsumableArray(entryArgs).concat([[]]));
    } else {
      return function () {
        return decorator.apply(undefined, _slice.call(arguments).concat([entryArgs]));
      };
    }
  }
});
define('graffiti', ['exports', 'graffiti/decorators/registerElement', 'graffiti/decorators/reflectToAttribute'], function (exports, _graffitiDecoratorsRegisterElement, _graffitiDecoratorsReflectToAttribute) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  exports.registerElement = _interopRequire(_graffitiDecoratorsRegisterElement);
  exports.reflectToAttribute = _interopRequire(_graffitiDecoratorsReflectToAttribute);
});
define('graffiti/mixins/Component', ['exports', 'module', '../private/Renderer', '../private/DOMHelper', '../private/utils', 'htmlbars-compiler', '../private/registration/css', '../private/registration/hbs'], function (exports, module, _privateRenderer, _privateDOMHelper, _privateUtils, _htmlbarsCompiler, _privateRegistrationCss, _privateRegistrationHbs) {
  'use strict';

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Renderer = _interopRequireDefault(_privateRenderer);

  var _DOMHelper = _interopRequireDefault(_privateDOMHelper);

  var getPrototypeOf = Object.getPrototypeOf;
  module.exports = {
    setAttribute: function setAttribute(key, value) {
      var meta = (0, _privateUtils.metaFor)(this);

      if (meta.isCheckingAttributes && this.getAttribute(key) !== '' + value) {
        meta.pendingAttributeChangeCount++;
      }

      return getPrototypeOf(getPrototypeOf(this)).setAttribute.apply(this, arguments);
    },

    removeAttribute: function removeAttribute(key) {
      var meta = (0, _privateUtils.metaFor)(this);

      if (meta.isCheckingAttributes && this.hasAttribute(key)) {
        meta.pendingAttributeChangeCount++;
      }

      return getPrototypeOf(getPrototypeOf(this)).removeAttribute.apply(this, arguments);
    },

    createdCallback: function createdCallback() {
      var _this = this;

      var meta = (0, _privateUtils.metaFor)(this);

      meta.isInitializing = true;

      // Because of a spec/browser limitation, custom elements via
      // document.registerElement doesn't include, nor call any .constructor
      // so we store it and call it ourself here
      (0, _privateUtils.metaFor)(getPrototypeOf(this)).elementConstructor.call(this);

      {
        // NamedNodeMap doesn't yet have iterable<Attr>
        // https://dom.spec.whatwg.org/#namednodemap
        // so can't use for..of
        var attributes = this.attributes;
        var _length = this.attributes.length;

        for (var i = 0; i < _length; i++) {
          var _attributes$i = attributes[i];
          var _name = _attributes$i.name;
          var value = _attributes$i.value;

          coerceAttributeToProperty(this, _name, value);
        }
      }

      if (this.events) {
        var eventKeys = Object.keys(this.events);
        for (var i = 0, l = eventKeys.length; i < l; i++) {
          this.addEventListener(eventKeys[i], this.events[eventKeys[i]]);
        }
      }

      wrapPropertiesInZone(this);

      // @TODO move renderer to meta (requires changing renderHTMLBarsBlock)
      this.renderer = new _Renderer['default'](new _DOMHelper['default']());

      this.template = _privateRegistrationHbs.registry[this.tagName.toLowerCase()];

      var mountZone = (0, _privateUtils.metaFor)(this).zone = zone.fork(_extends({}, Zone.longStackTraceZone, {

        afterTask: function afterTask() {
          meta.isCheckingAttributes = true;
          _this._renderNode.lastResult.rerender();
          meta.isCheckingAttributes = false;
        }
      }));

      mountZone.run(function () {
        meta.isCheckingAttributes = true;
        this.renderer.renderInner(this);
        injectStyle(_privateRegistrationCss.registry[this.tagName.toLowerCase()]);
        meta.isCheckingAttributes = false;
      }, this);

      meta.isInitializing = false;
    },

    attributeChangedCallback: function attributeChangedCallback(attrName, oldValue, newValue) {
      this.run(function () {
        var meta = (0, _privateUtils.metaFor)(this);
        if (meta.pendingAttributeChangeCount === 0) {
          coerceAttributeToProperty(this, attrName, newValue);
        } else {
          meta.pendingAttributeChangeCount--;
        }
      });
    },

    willRender: function willRender() {},

    renderBlock: function renderBlock(block, renderNode) {
      return (0, _privateRenderer.renderHTMLBarsBlock)(this, block, renderNode);
    },

    rerender: function rerender() {
      this.renderer.rerender();
    },

    revalidate: function revalidate() {
      this.renderer.revalidateTopLevelView(this);
    },

    run: function run(fn) {
      (0, _privateUtils.metaFor)(this).zone.run(fn, this);
    },

    trigger: function trigger(eventName, detail) {
      var options = { bubbles: true, cancelable: false, detail: detail };
      var remit = new CustomEvent(eventName, options);
      this.dispatchEvent(remit);
    }
  };

  function coerceAttributeToProperty(obj, attrName, newValue) {
    var propName = (0, _privateUtils.camelize)(attrName);
    // @TODO: What about props that aren't writeable? or methods?
    if (propName in obj) {
      obj[propName] = (0, _privateUtils.attributeValueToPropertyValue)(obj[propName], newValue);
    }
  }

  function wrapPropertiesInZone(obj) {
    for (var key in obj) {
      var desc = Object.getOwnPropertyDescriptor(obj, key);
      if (obj.hasOwnProperty(key)) {
        if (desc && typeof desc.value !== 'function') {
          wrapPropertyInZone(obj, key);
        }
      }
    }
  }

  function wrapPropertyInZone(obj, key) {
    var value = obj[key];

    Object.defineProperty(obj, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        this.run(function () {
          value = newValue;
        });
      }
    });
  }

  function injectStyle(content) {
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(content));
    document.head.insertBefore(style, document.head.firstChild);
  }
});
define('graffiti/private/DOMHelper', ['exports', 'module', 'dom-helper'], function (exports, module, _domHelper) {
  'use strict';

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var _DefaultDOMHelper2 = _interopRequireDefault(_domHelper);

  var DOMHelper = (function (_DefaultDOMHelper) {
    _inherits(DOMHelper, _DefaultDOMHelper);

    function DOMHelper() {
      _classCallCheck(this, DOMHelper);

      _get(Object.getPrototypeOf(DOMHelper.prototype), 'constructor', this).apply(this, arguments);
    }

    return DOMHelper;
  })(_DefaultDOMHelper2['default']);

  module.exports = DOMHelper;
});
define('graffiti/private/htmlbars/env', ['exports', 'module', './hooks', './helpers', './keywords'], function (exports, module, _hooks, _helpers, _keywords) {
  'use strict';

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _hooks2 = _interopRequireDefault(_hooks);

  var _helpers2 = _interopRequireDefault(_helpers);

  var _keywords2 = _interopRequireDefault(_keywords);

  module.exports = {
    hooks: _extends({}, _hooks2['default'], { keywords: _keywords2['default'] }),
    helpers: _helpers2['default'],
    useFragmentCache: true
  };
});
define('graffiti/private/htmlbars/helpers/each', ['exports', 'module', '../../utils'], function (exports, module, _utils) {
  'use strict';

  module.exports = eachHelper;

  function eachHelper(params, hash, blocks) {
    var list = params[0];
    var keyPath = hash.key;

    // TODO: Correct falsy semantics
    if (!list || list.length === 0) {
      if (blocks.inverse['yield']) {
        blocks.inverse['yield']();
      }
      return;
    }

    list.forEach(function (item, i) {
      var key = keyPath ? (0, _utils.get)(item, keyPath) : String(i);
      blocks.template.yieldItem(key, [item, i]);
    });
  }
});
define('graffiti/private/htmlbars/helpers', ['exports', 'graffiti/private/htmlbars/helpers/each'], function (exports, _graffitiPrivateHtmlbarsHelpersEach) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.registerHelper = registerHelper;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _each = _interopRequireDefault(_graffitiPrivateHtmlbarsHelpersEach);

  var helpers = Object.assign({}, {
    each: _each['default']
  });

  function registerHelper(name, helperFunc) {
    helpers[name] = helperFunc;
  }

  exports['default'] = helpers;
});
define('graffiti/private/htmlbars/hooks/component', ['exports', 'module', '../../utils', 'htmlbars-runtime'], function (exports, module, _utils, _htmlbarsRuntime) {
  'use strict';

  module.exports = componentHook;

  function componentHook(renderNode, env, scope, tagName, params, attrs, templates, visitor) {
    var renderOptions = {};
    var contextualElement = renderNode.contextualElement;

    var element = undefined;
    if (contextualElement === scope.self) {
      element = contextualElement;
      renderOptions.renderNode = renderNode;
    } else {
      element = env.dom.createElement(tagName);
      renderNode.setNode(element);
    }

    var meta = (0, _utils.metaFor)(element);
    meta.isCheckingAttributes = true;

    for (var _name in attrs) {
      var value = env.hooks.getValue(attrs[_name]);
      if (element.getAttribute(_name) !== value) {
        element.setAttribute(_name, value);
      }
    }

    meta.isCheckingAttributes = false;

    if (renderNode.lastResult) {
      renderNode.lastResult.rerender();
    } else {
      var fragment = (0, _htmlbarsRuntime.render)(templates['default'], env, scope, renderOptions).fragment;
      element.appendChild(fragment);
    }
  }
});
define('graffiti/private/htmlbars/hooks', ['exports', 'module', 'htmlbars-runtime', 'graffiti/private/htmlbars/hooks/component'], function (exports, module, _htmlbarsRuntime, _graffitiPrivateHtmlbarsHooksComponent) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _component = _interopRequireDefault(_graffitiPrivateHtmlbarsHooksComponent);

  var hooks = Object.assign({}, _htmlbarsRuntime.hooks, {
    component: _component['default']
  });

  module.exports = hooks;
});
define('graffiti/private/htmlbars/keywords/debugger', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = debuggerKeyword;

  function debuggerKeyword(morph, env, scope) {
    /* jshint unused: false, debug: true */

    var view = env.hooks.getValue(scope.locals.view);
    var context = env.hooks.getValue(scope.self);

    function get(path) {
      return env.hooks.getValue(env.hooks.get(env, scope, path));
    }

    console.log('Use `view`, `context`, and `get(<path>)` to debug this template.');

    debugger;

    return true;
  }
});
define('graffiti/private/htmlbars/keywords', ['exports', 'graffiti/private/htmlbars/keywords/debugger', 'graffiti/private/htmlbars/keywords/on'], function (exports, _graffitiPrivateHtmlbarsKeywordsDebugger, _graffitiPrivateHtmlbarsKeywordsOn) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.registerKeyword = registerKeyword;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _debuggerKeyword = _interopRequireDefault(_graffitiPrivateHtmlbarsKeywordsDebugger);

  var _onKeyword = _interopRequireDefault(_graffitiPrivateHtmlbarsKeywordsOn);

  var keywords = Object.assign({}, {
    'debugger': _debuggerKeyword['default'],
    on: _onKeyword['default']
  });

  function registerKeyword(name, keywordFunc) {
    keywords[name] = keywordFunc;
  }

  exports['default'] = keywords;
});
define('graffiti/private/htmlbars/keywords/on', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = {
    setupState: function setupState(state, env, scope, params, hash) {
      return state;
    },

    isStable: function isStable(state, env, scope, params, hash) {
      return true;
    },

    render: function render(node, env, scope, params, hash, template, inverse, visitor) {
      var eventName = params[0];
      var callback = params[1];
      var detail = params[2];
      var target = node.element;
      var delegate = env.view;

      var listener = addEventListenerViaDelegate(target, eventName, delegate, function (event) {
        switch (typeof callback) {
          case 'function':
            return callback.apply(this, arguments);
          case 'string':
            delegate.trigger(callback, detail);
            return;
          case 'undefined':
            throw new ReferenceError('Dispatch of event "' + eventName + '" failed (handler is undefined)');
          default:
            throw new TypeError('The third arguments of {{on}} must either be of type Function|string, "' + callback + '" provided.');
        }
      });

      node.cleanup = function () {
        removeEventListenerViaDelegate(target, eventName, delegate, listener);
      };
    }
  };

  function addEventListenerViaDelegate(target, eventName, delegate, callback) {
    var listener = function listener(event) {
      if (event.target === target) {
        return callback.call(this, event);
      }
    };

    delegate.addEventListener(eventName, listener);
    return listener;
  }

  function removeEventListenerViaDelegate(target, eventName, delegate, callback) {
    delegate.removeEventListener(eventName, listener);
  }
});
define('graffiti/private/htmlbars/utils/getKey', ['exports', 'module', '../../streams/BehaviorSubject', '../../streams/Observable'], function (exports, module, _streamsBehaviorSubject, _streamsObservable) {
  'use strict';

  module.exports = getKey;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _BehaviorSubject = _interopRequireDefault(_streamsBehaviorSubject);

  var _Observable = _interopRequireDefault(_streamsObservable);

  function getKey(obj, key) {
    var self = obj instanceof _BehaviorSubject['default'] ? obj : obj.self || obj.locals.view;
    var subject = new _BehaviorSubject['default']();

    if (key === 'items') {
      //debugger;
    }

    self.map(function (obj) {
      return ofPropertyChanges(obj, key);
    }).concatAll().subscribe(subject);

    return subject;
  }

  window.ofPropertyChanges = ofPropertyChanges;

  function ofPropertyChanges(obj, key) {
    if (isObject(obj) === false) {
      return _Observable['default']['return'](undefined);
    }

    var stream = undefined;

    if (key === '[]') {
      stream = _Observable['default'].ofArrayChanges(obj).map(function (_ref) {
        var object = _ref.object;
        return object;
      }).startWith(obj);
    } else {
      stream = _Observable['default'].ofObjectChanges(obj).filter(function (change) {
        return change.name === key;
      }).map(function (_ref2) {
        var object = _ref2.object;
        var name = _ref2.name;
        return object[name];
      }).startWith(obj[key]);
    }

    return stream;
  }

  function isObject(value) {
    // Avoid an old bug in Chrome 19-20
    // See https://code.google.com/p/v8/issues/detail?id=2291
    var type = typeof value;
    return type === 'function' || !!value && type === 'object';
  }
});
define('graffiti/private/htmlbars/utils/subscribe', ['exports', 'module', 'graffiti/private/streams/Observable'], function (exports, module, _graffitiPrivateStreamsObservable) {
  'use strict';

  module.exports = subscribe;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Observable = _interopRequireDefault(_graffitiPrivateStreamsObservable);

  function subscribe(node, env, scope, stream) {
    if (stream instanceof _Observable['default']) {
      (function () {
        var component = scope.component;

        stream.subscribe(function () {
          console.log('became dirty', stream, stream.getValue(), node);
          node.isDirty = true;

          // Whenever a render node directly inside a component becomes
          // dirty, we want to invoke the willRenderElement and
          // didRenderElement lifecycle hooks. From the perspective of the
          // programming model, whenever anything in the DOM changes, a
          // "re-render" has occured.
          if (component && component._renderNode) {
            component._renderNode.isDirty = true;
          } else {
            debugger;
            throw new Error('TODO: This condition actually exists!');
          }

          node.ownerNode._ownerView.scheduleRevalidate(node);
        });
      })();
    }
  }
});
define("graffiti/private/registration/css", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.registerElementCSS = registerElementCSS;
  var registry = {};

  exports.registry = registry;

  function registerElementCSS(tagName, content) {
    registry[tagName] = content;
  }
});
define("graffiti/private/registration/hbs", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.registerElementHBS = registerElementHBS;
  var registry = {};

  exports.registry = registry;

  function registerElementHBS(tagName, content) {
    registry[tagName] = content;
  }
});
define('graffiti/private/registration', ['exports', 'graffiti/private/registration/css', 'graffiti/private/registration/hbs'], function (exports, _graffitiPrivateRegistrationCss, _graffitiPrivateRegistrationHbs) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  Object.defineProperty(exports, 'registerElementCSS', {
    enumerable: true,
    get: function get() {
      return _graffitiPrivateRegistrationCss.registerElementCSS;
    }
  });
  Object.defineProperty(exports, 'registerElementHBS', {
    enumerable: true,
    get: function get() {
      return _graffitiPrivateRegistrationHbs.registerElementHBS;
    }
  });
});
define('graffiti/private/Renderer', ['exports', 'htmlbars-runtime', './utils', './ViewNodeManager', './htmlbars/env'], function (exports, _htmlbarsRuntime, _utils, _ViewNodeManager, _htmlbarsEnv) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.buildComponentTemplate = buildComponentTemplate;
  exports.renderHTMLBarsBlock = renderHTMLBarsBlock;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _ViewNodeManager2 = _interopRequireDefault(_ViewNodeManager);

  var _defaultEnv = _interopRequireDefault(_htmlbarsEnv);

  var Renderer = (function () {
    function Renderer(domHelper) {
      _classCallCheck(this, Renderer);

      this._dom = domHelper;
    }

    _createClass(Renderer, [{
      key: 'prerenderTopLevelView',
      value: function prerenderTopLevelView(view, renderNode) {
        if (view._state === 'inDOM') {
          throw new Error('You cannot insert a view that has already been rendered');
        }

        view._ownerView = renderNode._ownerView = view;
        view._renderNode = renderNode;

        var layout = view.layout;
        var template = view.template;

        var componentInfo = { component: view, view: view, layout: layout };

        var block = buildComponentTemplate(componentInfo, {}, {
          self: view,
          template: template && template.raw
        }).block;

        view.renderBlock(block, renderNode);
        view.lastResult = renderNode.lastResult;

        this.clearRenderedViews(view.env);
      }
    }, {
      key: 'renderTopLevelView',
      value: function renderTopLevelView(view, renderNode) {
        // Check to see if insertion has been canceled
        if (view._willInsert) {
          view._willInsert = false;
          this.prerenderTopLevelView(view, renderNode);
          this.dispatchLifecycleHooks(view.env);
        }
      }
    }, {
      key: 'revalidateTopLevelView',
      value: function revalidateTopLevelView(_ref) {
        var renderNode = _ref._renderNode;
        var viewState = _ref._state;
        var env = _ref.env;

        // This guard prevents revalidation on an already-destroyed view.
        if (renderNode.lastResult) {
          renderNode.lastResult.revalidate(env);
          // supports createElement, which operates without moving the view into
          // the inDOM state.
          if (viewState === 'inDOM') {
            this.dispatchLifecycleHooks(env);
          }

          this.clearRenderedViews(env);
        }
      }
    }, {
      key: 'dispatchLifecycleHooks',
      value: function dispatchLifecycleHooks(_ref2) {
        var ownerView = _ref2.view;
        var lifecycleHooks = _ref2.lifecycleHooks;

        // @TODO: is `view` actually ever different than `ownerView`??
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = lifecycleHooks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _step.value;
            var type = _step$value.type;
            var view = _step$value.view;

            ownerView._dispatching = type;

            switch (type) {
              case 'didInsertElement':
                this.didInsertElement(view);
                break;

              case 'didUpdate':
                this.didUpdate(view);
                break;

              default:
                throw new Error('Unhandled lifecycle hook: ' + type);
            }

            this.didRender(view);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        ownerView._dispatching = null;
        lifecycleHooks.length = 0;
      }
    }, {
      key: 'didInsertElement',
      value: function didInsertElement(view) {
        if (view._transitionTo) {
          view._transitionTo('inDOM');
        }

        if (view.trigger) {
          view.trigger('didInsertElement');
        }
      }
    }, {
      key: 'didUpdate',
      value: function didUpdate(view) {
        if (view.trigger) {
          view.trigger('didUpdate');
        }
      }
    }, {
      key: 'didRender',
      value: function didRender(view) {
        if (view.trigger) {
          view.trigger('didRender');
        }
      }
    }, {
      key: 'clearRenderedViews',
      value: function clearRenderedViews(env) {
        env.renderedViews.length = 0;
      }
    }, {
      key: 'renderInner',
      value: function renderInner(view) {
        /*const morph = this._dom.createElementMorph(view, view.namespaceURI);
        morph.ownerNode = morph;
        morph.isRootNode = true;*/
        view._willInsert = true;

        var contentNodes = document.createDocumentFragment();

        {
          var childNodes = view.childNodes;

          while (childNodes.length > 0) {
            contentNodes.appendChild(childNodes[0]);
          }
        }

        var innerMorph = this._dom.insertMorphBefore(view, view.firstChild, view);
        //const innerMorph = this._dom.replaceContentWithMorph(view);

        innerMorph.ownerNode = innerMorph;

        this.renderTopLevelView(view, innerMorph);

        var content = view.getElementsByTagName('content')[0];
        if (content) {
          content.parentNode.replaceChild(contentNodes, content);
        }
      }
    }]);

    return Renderer;
  })();

  exports['default'] = Renderer;

  function buildComponentTemplate(_ref3, attrs, content) {
    var _ref3$component = _ref3.component;
    var component = _ref3$component === undefined ? null : _ref3$component;
    var layout = _ref3.layout;

    var tagName = null;
    var blockToRender = undefined;

    if (content.template) {
      blockToRender = createContentBlock(content.template, content.scope, content.self, component);
    }

    if (layout && layout.raw) {
      blockToRender = createLayoutBlock(layout.raw, blockToRender, content.self, component, attrs);
    }

    return { createdElement: false, block: blockToRender };
  }

  function blockFor(template, options) {
    (0, _utils.assert)(!!template, 'BUG: Must pass a template to blockFor');
    return _htmlbarsRuntime.internal.blockFor(_htmlbarsRuntime.render, template, options);
  }

  function createContentBlock(template, scope, self, component) {
    (0, _utils.assert)(!(scope && self), 'BUG: buildComponentTemplate can take a scope or a self, but not both');

    return blockFor(template, {
      scope: scope,
      self: self,
      options: { view: component }
    });
  }

  function renderHTMLBarsBlock(view, block, renderNode) {
    var env = {
      lifecycleHooks: [],
      renderedViews: [],
      view: view,
      outletState: view.outletState,
      container: view.container,
      renderer: view.renderer,
      dom: view.renderer._dom,
      hooks: _defaultEnv['default'].hooks,
      helpers: _defaultEnv['default'].helpers,
      useFragmentCache: _defaultEnv['default'].useFragmentCache
    };

    view.env = env;
    //createOrUpdateComponent(view, {}, null, renderNode, env);
    var nodeManager = new _ViewNodeManager2['default'](view, null, renderNode, block, view._ownerView !== view);

    nodeManager.render(env, {});
  }
});
define('graffiti/private/streams/BehaviorSubject', ['exports', 'module', './Observable'], function (exports, module, _Observable2) {
  'use strict';

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Observable3 = _interopRequireDefault(_Observable2);

  module.exports = Rx.BehaviorSubject;

  var checkDisposed = Rx.Disposable.checkDisposed;

  function cloneArray(arr) {
    var len = arr.length,
        a = new Array(len);
    for (var i = 0; i < len; i++) {
      a[i] = arr[i];
    }
    return a;
  }

  var InnerSubscription = (function () {
    function InnerSubscription(subject, observer) {
      _classCallCheck(this, InnerSubscription);

      this.subject = subject;
      this.observer = observer;
    }

    _createClass(InnerSubscription, [{
      key: 'dispose',
      value: function dispose() {
        if (!this.subject.isDisposed && this.observer !== null) {
          var idx = this.subject.observers.indexOf(this.observer);
          this.subject.observers.splice(idx, 1);
          this.observer = null;
        }
      }
    }]);

    return InnerSubscription;
  })();

  function subscribe(observer) {
    if (!this.isStopped) {
      this.observers.push(observer);
      return new InnerSubscription(this, observer);
    }

    if (this.hasError) {
      observer.onError(this.error);
    } else {
      observer.onCompleted();
    }

    return disposableEmpty;
  }

  var BehaviorSubject = (function (_Observable) {
    _inherits(BehaviorSubject, _Observable);

    function BehaviorSubject() {
      _classCallCheck(this, BehaviorSubject);

      _get(Object.getPrototypeOf(BehaviorSubject.prototype), 'constructor', this).call(this, subscribe);
      this.value = undefined;
      this.observers = [];
      this.isDisposed = false;
      this.isStopped = false;
      this.hasError = false;
    }

    /**
     * Gets the current value or throws an exception.
     * Value is frozen after onCompleted is called.
     * After onError is called always throws the specified exception.
     * An exception is always thrown after dispose is called.
     * @returns {Mixed} The initial value passed to the constructor until onNext is called; after which, the last value passed to onNext.
     */

    _createClass(BehaviorSubject, [{
      key: 'getValue',
      value: function getValue() {
        checkDisposed(this);
        if (this.hasError) {
          throw this.error;
        }
        return this.value;
      }

      /**
       * Indicates whether the subject has observers subscribed to it.
       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
       */
    }, {
      key: 'hasObservers',
      value: function hasObservers() {
        return this.observers.length > 0;
      }

      /**
       * Notifies all subscribed observers about the end of the sequence.
       */
    }, {
      key: 'onCompleted',
      value: function onCompleted() {
        checkDisposed(this);
        if (this.isStopped) {
          return;
        }
        this.isStopped = true;
        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          os[i].onCompleted();
        }

        this.observers.length = 0;
      }

      /**
       * Notifies all subscribed observers about the exception.
       * @param {Mixed} error The exception to send to all observers.
       */
    }, {
      key: 'onError',
      value: function onError(error) {
        checkDisposed(this);
        if (this.isStopped) {
          return;
        }
        this.isStopped = true;
        this.hasError = true;
        this.error = error;

        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          os[i].onError(error);
        }

        this.observers.length = 0;
      }

      /**
       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
       * @param {Mixed} value The value to send to all observers.
       */
    }, {
      key: 'onNext',
      value: function onNext(value) {
        checkDisposed(this);
        if (this.isStopped) {
          return;
        }
        this.value = value;
        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          os[i].onNext(value);
        }
      }

      /**
       * Unsubscribe all observers and release resources.
       */
    }, {
      key: 'dispose',
      value: function dispose() {
        this.isDisposed = true;
        this.observers = null;
        this.value = null;
        this.exception = null;
      }
    }]);

    return BehaviorSubject;
  })(_Observable3['default']);
});
define("graffiti/private/streams/JustObservable", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = Rx.Observable;
});
define("graffiti/private/streams/Observable", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = Rx.Observable;
});
define('graffiti/private/streams/PropertyPathSubject', ['exports', 'module', './BehaviorSubject'], function (exports, module, _BehaviorSubject2) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var _BehaviorSubject3 = _interopRequireDefault(_BehaviorSubject2);

  var PropertyPathSubject = (function (_BehaviorSubject) {
    _inherits(PropertyPathSubject, _BehaviorSubject);

    function PropertyPathSubject(defaultValue) {
      _classCallCheck(this, PropertyPathSubject);

      _get(Object.getPrototypeOf(PropertyPathSubject.prototype), 'constructor', this).call(this, defaultValue);
    }

    _createClass(PropertyPathSubject, [{
      key: 'getPropertyPath',
      value: function getPropertyPath(path) {}
    }]);

    return PropertyPathSubject;
  })(_BehaviorSubject3['default']);

  module.exports = PropertyPathSubject;
});
define('graffiti/private/streams/something', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = ofPropertyPathChanges;
  function isObject(value) {
    // Avoid an old bug in Chrome 19-20
    // See https://code.google.com/p/v8/issues/detail?id=2291
    var type = typeof value;
    return type === 'function' || !!value && type === 'object';
  }

  function ofPropertyChanges(obj, key) {
    if (isObject(obj) === false) {
      return Observable['return'](undefined);
    }

    return Observable.ofObjectChanges(obj).filter(function (change) {
      return change.name === key;
    }).map(function (_ref) {
      var object = _ref.object;
      var name = _ref.name;
      return object[name];
    }).startWith(obj[key]);
  }

  function ofPropertyPathChanges(obj, path) {
    var parts = path.split('.');
    var firstKey = parts.shift();

    return Observable['return'](obj).map(function (obj) {
      return ofPropertyChanges(obj, firstKey);
    }).concat(Observable.from(parts)).reduce(function (stream, key) {
      return stream.flatMapLatest(function (obj) {
        return ofPropertyChanges(obj, key);
      });
    }).concatAll();
  }
});
define('graffiti/private/utils/assert', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = assert;

  function assert(msg, condition) {
    if (!condition) {
      throw 'AssertionError: ' + msg;
    }
  }
});
define("graffiti/private/utils/camelize", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = camelize;

  function camelize(str) {
    return str.replace(/[_-](\w|$)/g, function (_, char) {
      return char.toUpperCase();
    });
  }
});
define('graffiti/private/utils/dasherize', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = dasherize;

  function dasherize(str) {
    return str.replace(/([A-Z])/g, '-$1').substr(1).toLowerCase();
  }
});
define('graffiti/private/utils', ['exports', 'graffiti/private/utils/assert', 'graffiti/private/utils/meta', 'graffiti/private/utils/camelize', 'graffiti/private/utils/dasherize', 'graffiti/private/utils/type-conversion'], function (exports, _graffitiPrivateUtilsAssert, _graffitiPrivateUtilsMeta, _graffitiPrivateUtilsCamelize, _graffitiPrivateUtilsDasherize, _graffitiPrivateUtilsTypeConversion) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  exports.assert = _interopRequire(_graffitiPrivateUtilsAssert);
  exports.Meta = _interopRequire(_graffitiPrivateUtilsMeta);
  Object.defineProperty(exports, 'metaFor', {
    enumerable: true,
    get: function get() {
      return _graffitiPrivateUtilsMeta.metaFor;
    }
  });
  exports.camelize = _interopRequire(_graffitiPrivateUtilsCamelize);
  exports.dasherize = _interopRequire(_graffitiPrivateUtilsDasherize);
  Object.defineProperty(exports, 'attributeValueToPropertyValue', {
    enumerable: true,
    get: function get() {
      return _graffitiPrivateUtilsTypeConversion.attributeValueToPropertyValue;
    }
  });
});
define('graffiti/private/utils/meta', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.metaFor = metaFor;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var defineProperty = Object.defineProperty;
  var seal = Object.seal;

  var Meta = function Meta() {
    _classCallCheck(this, Meta);

    this.elementConstructor = null;
    this.isInitializing = false;
    this.isCheckingAttributes = false;
    this.pendingAttributeChangeCount = 0;
    this.zone = null;
    this.descriptors = {};

    seal(this);
  }

  // @TODO: use a WeakMap instead of storing meta on the object itself
  ;

  exports['default'] = Meta;

  function metaFor(obj) {
    if (obj.hasOwnProperty('__graffiti__') === false) {
      defineProperty(obj, '__graffiti__', {
        // Defaults: NOT enumerable, configurable, or writable
        value: new Meta()
      });
    }

    return obj.__graffiti__;
  }
});
define('graffiti/private/utils/type-conversion', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.attributeValueToPropertyValue = attributeValueToPropertyValue;

  function attributeValueToPropertyValue(propValue, attrValue) {
    var coercedValue = undefined;

    switch (typeof propValue) {
      case 'boolean':
        // Any value except `null|undefined` is true, in regards to attributes
        coercedValue = attrValue !== null && attrValue !== undefined;
        break;

      case 'string':
      case 'number':
        coercedValue = propValue.constructor(attrValue);
        break;

      // We can't really convert any other value without major assumptions
      // or performance issues (like POJOs, etc).
      // If someone wants this, they can decorate their the property
      // with such functionality.
      default:
        coercedValue = attrValue;
    }

    return coercedValue;
  }
});
define("graffiti/private/ViewNodeManager", ["exports", "module"], function (exports, module) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var ViewNodeManager = (function () {
    function ViewNodeManager(component, scope, renderNode, block) {
      _classCallCheck(this, ViewNodeManager);

      this.component = component;
      this.scope = scope;
      this.renderNode = renderNode;
      this.block = block;
    }

    _createClass(ViewNodeManager, [{
      key: "render",
      value: function render(env, attrs, visitor) {
        var newEnv = env;

        if (this.component) {
          newEnv = Object.assign({}, env);
          newEnv.view = this.component;
        }

        if (this.block) {
          this.block(newEnv, [], undefined, this.renderNode, this.scope, visitor);
        }
      }
    }, {
      key: "rerender",
      value: function rerender(env, attrs, visitor) {
        var newEnv = env;

        if (component) {
          newEnv = Object.assign({}, env);
          newEnv.view = component;
        }

        if (this.block) {
          this.block(newEnv, [], undefined, this.renderNode, this.scope, visitor);
        }

        return newEnv;
      }
    }]);

    return ViewNodeManager;
  })();

  module.exports = ViewNodeManager;
});
define("htmlbars-compiler", ["exports", "./htmlbars-compiler/compiler"], function (exports, _htmlbarsCompilerCompiler) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.compile = _htmlbarsCompilerCompiler.compile;
  exports.compileSpec = _htmlbarsCompilerCompiler.compileSpec;
  exports.template = _htmlbarsCompilerCompiler.template;
});
define("htmlbars-compiler/compiler", ["exports", "../htmlbars-syntax/parser", "./template-compiler", "../htmlbars-runtime/hooks", "../htmlbars-runtime/render"], function (exports, _htmlbarsSyntaxParser, _templateCompiler, _htmlbarsRuntimeHooks, _htmlbarsRuntimeRender) {
  /*jshint evil:true*/
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.compileSpec = compileSpec;
  exports.template = template;
  exports.compile = compile;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _TemplateCompiler = _interopRequireDefault(_templateCompiler);

  var _render = _interopRequireDefault(_htmlbarsRuntimeRender);

  /*
   * Compile a string into a template spec string. The template spec is a string
   * representation of a template. Usually, you would use compileSpec for
   * pre-compilation of a template on the server.
   *
   * Example usage:
   *
   *     var templateSpec = compileSpec("Howdy {{name}}");
   *     // This next step is basically what plain compile does
   *     var template = new Function("return " + templateSpec)();
   *
   * @method compileSpec
   * @param {String} string An HTMLBars template string
   * @return {TemplateSpec} A template spec string
   */

  function compileSpec(string, options) {
    var ast = (0, _htmlbarsSyntaxParser.preprocess)(string, options);
    var compiler = new _TemplateCompiler["default"](options);
    var program = compiler.compile(ast);
    return program;
  }

  /*
   * @method template
   * @param {TemplateSpec} templateSpec A precompiled template
   * @return {Template} A template spec string
   */

  function template(templateSpec) {
    return new Function("return " + templateSpec)();
  }

  /*
   * Compile a string into a template rendering function
   *
   * Example usage:
   *
   *     // Template is the hydration portion of the compiled template
   *     var template = compile("Howdy {{name}}");
   *
   *     // Template accepts three arguments:
   *     //
   *     //   1. A context object
   *     //   2. An env object
   *     //   3. A contextualElement (optional, document.body is the default)
   *     //
   *     // The env object *must* have at least these two properties:
   *     //
   *     //   1. `hooks` - Basic hooks for rendering a template
   *     //   2. `dom` - An instance of DOMHelper
   *     //
   *     import {hooks} from 'htmlbars-runtime';
   *     import {DOMHelper} from 'morph';
   *     var context = {name: 'whatever'},
   *         env = {hooks: hooks, dom: new DOMHelper()},
   *         contextualElement = document.body;
   *     var domFragment = template(context, env, contextualElement);
   *
   * @method compile
   * @param {String} string An HTMLBars template string
   * @param {Object} options A set of options to provide to the compiler
   * @return {Template} A function for rendering the template
   */

  function compile(string, options) {
    return (0, _htmlbarsRuntimeHooks.wrap)(template(compileSpec(string, options)), _render["default"]);
  }
});
define("htmlbars-compiler/fragment-javascript-compiler", ["exports", "module", "./utils", "../htmlbars-util/quoting"], function (exports, module, _utils, _htmlbarsUtilQuoting) {
  "use strict";

  var svgNamespace = "http://www.w3.org/2000/svg",

  // http://www.w3.org/html/wg/drafts/html/master/syntax.html#html-integration-point
  svgHTMLIntegrationPoints = { 'foreignObject': true, 'desc': true, 'title': true };

  function FragmentJavaScriptCompiler() {
    this.source = [];
    this.depth = -1;
  }

  module.exports = FragmentJavaScriptCompiler;

  FragmentJavaScriptCompiler.prototype.compile = function (opcodes, options) {
    this.source.length = 0;
    this.depth = -1;
    this.indent = options && options.indent || "";
    this.namespaceFrameStack = [{ namespace: null, depth: null }];
    this.domNamespace = null;

    this.source.push('function buildFragment(dom) {\n');
    (0, _utils.processOpcodes)(this, opcodes);
    this.source.push(this.indent + '}');

    return this.source.join('');
  };

  FragmentJavaScriptCompiler.prototype.createFragment = function () {
    var el = 'el' + ++this.depth;
    this.source.push(this.indent + '  var ' + el + ' = dom.createDocumentFragment();\n');
  };

  FragmentJavaScriptCompiler.prototype.createElement = function (tagName) {
    var el = 'el' + ++this.depth;
    if (tagName === 'svg') {
      this.pushNamespaceFrame({ namespace: svgNamespace, depth: this.depth });
    }
    this.ensureNamespace();
    this.source.push(this.indent + '  var ' + el + ' = dom.createElement(' + (0, _htmlbarsUtilQuoting.string)(tagName) + ');\n');
    if (svgHTMLIntegrationPoints[tagName]) {
      this.pushNamespaceFrame({ namespace: null, depth: this.depth });
    }
  };

  FragmentJavaScriptCompiler.prototype.createText = function (str) {
    var el = 'el' + ++this.depth;
    this.source.push(this.indent + '  var ' + el + ' = dom.createTextNode(' + (0, _htmlbarsUtilQuoting.string)(str) + ');\n');
  };

  FragmentJavaScriptCompiler.prototype.createComment = function (str) {
    var el = 'el' + ++this.depth;
    this.source.push(this.indent + '  var ' + el + ' = dom.createComment(' + (0, _htmlbarsUtilQuoting.string)(str) + ');\n');
  };

  FragmentJavaScriptCompiler.prototype.returnNode = function () {
    var el = 'el' + this.depth;
    this.source.push(this.indent + '  return ' + el + ';\n');
  };

  FragmentJavaScriptCompiler.prototype.setAttribute = function (name, value, namespace) {
    var el = 'el' + this.depth;
    if (namespace) {
      this.source.push(this.indent + '  dom.setAttributeNS(' + el + ',' + (0, _htmlbarsUtilQuoting.string)(namespace) + ',' + (0, _htmlbarsUtilQuoting.string)(name) + ',' + (0, _htmlbarsUtilQuoting.string)(value) + ');\n');
    } else {
      this.source.push(this.indent + '  dom.setAttribute(' + el + ',' + (0, _htmlbarsUtilQuoting.string)(name) + ',' + (0, _htmlbarsUtilQuoting.string)(value) + ');\n');
    }
  };

  FragmentJavaScriptCompiler.prototype.appendChild = function () {
    if (this.depth === this.getCurrentNamespaceFrame().depth) {
      this.popNamespaceFrame();
    }
    var child = 'el' + this.depth--;
    var el = 'el' + this.depth;
    this.source.push(this.indent + '  dom.appendChild(' + el + ', ' + child + ');\n');
  };

  FragmentJavaScriptCompiler.prototype.getCurrentNamespaceFrame = function () {
    return this.namespaceFrameStack[this.namespaceFrameStack.length - 1];
  };

  FragmentJavaScriptCompiler.prototype.pushNamespaceFrame = function (frame) {
    this.namespaceFrameStack.push(frame);
  };

  FragmentJavaScriptCompiler.prototype.popNamespaceFrame = function () {
    return this.namespaceFrameStack.pop();
  };

  FragmentJavaScriptCompiler.prototype.ensureNamespace = function () {
    var correctNamespace = this.getCurrentNamespaceFrame().namespace;
    if (this.domNamespace !== correctNamespace) {
      this.source.push(this.indent + '  dom.setNamespace(' + (correctNamespace ? (0, _htmlbarsUtilQuoting.string)(correctNamespace) : 'null') + ');\n');
      this.domNamespace = correctNamespace;
    }
  };
});
define("htmlbars-compiler/fragment-opcode-compiler", ["exports", "module", "./template-visitor", "./utils", "../htmlbars-util", "../htmlbars-util/array-utils"], function (exports, module, _templateVisitor, _utils, _htmlbarsUtil, _htmlbarsUtilArrayUtils) {
  "use strict";

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _TemplateVisitor = _interopRequireDefault(_templateVisitor);

  function FragmentOpcodeCompiler() {
    this.opcodes = [];
  }

  module.exports = FragmentOpcodeCompiler;

  FragmentOpcodeCompiler.prototype.compile = function (ast) {
    var templateVisitor = new _TemplateVisitor["default"]();
    templateVisitor.visit(ast);

    (0, _utils.processOpcodes)(this, templateVisitor.actions);

    return this.opcodes;
  };

  FragmentOpcodeCompiler.prototype.opcode = function (type, params) {
    this.opcodes.push([type, params]);
  };

  FragmentOpcodeCompiler.prototype.text = function (text) {
    this.opcode('createText', [text.chars]);
    this.opcode('appendChild');
  };

  FragmentOpcodeCompiler.prototype.comment = function (comment) {
    this.opcode('createComment', [comment.value]);
    this.opcode('appendChild');
  };

  FragmentOpcodeCompiler.prototype.openElement = function (element) {
    this.opcode('createElement', [element.tag]);
    (0, _htmlbarsUtilArrayUtils.forEach)(element.attributes, this.attribute, this);
  };

  FragmentOpcodeCompiler.prototype.closeElement = function () {
    this.opcode('appendChild');
  };

  FragmentOpcodeCompiler.prototype.startProgram = function () {
    this.opcodes.length = 0;
    this.opcode('createFragment');
  };

  FragmentOpcodeCompiler.prototype.endProgram = function () {
    this.opcode('returnNode');
  };

  FragmentOpcodeCompiler.prototype.mustache = function () {
    this.pushMorphPlaceholderNode();
  };

  FragmentOpcodeCompiler.prototype.component = function () {
    this.pushMorphPlaceholderNode();
  };

  FragmentOpcodeCompiler.prototype.block = function () {
    this.pushMorphPlaceholderNode();
  };

  FragmentOpcodeCompiler.prototype.pushMorphPlaceholderNode = function () {
    this.opcode('createComment', [""]);
    this.opcode('appendChild');
  };

  FragmentOpcodeCompiler.prototype.attribute = function (attr) {
    if (attr.value.type === 'TextNode') {
      var namespace = (0, _htmlbarsUtil.getAttrNamespace)(attr.name);
      this.opcode('setAttribute', [attr.name, attr.value.chars, namespace]);
    }
  };

  FragmentOpcodeCompiler.prototype.setNamespace = function (namespace) {
    this.opcode('setNamespace', [namespace]);
  };
});
define("htmlbars-compiler/hydration-javascript-compiler", ["exports", "module", "./utils", "../htmlbars-util/quoting"], function (exports, module, _utils, _htmlbarsUtilQuoting) {
  "use strict";

  function HydrationJavaScriptCompiler() {
    this.stack = [];
    this.source = [];
    this.mustaches = [];
    this.parents = [['fragment']];
    this.parentCount = 0;
    this.morphs = [];
    this.fragmentProcessing = [];
    this.hooks = undefined;
  }

  module.exports = HydrationJavaScriptCompiler;

  var prototype = HydrationJavaScriptCompiler.prototype;

  prototype.compile = function (opcodes, options) {
    this.stack.length = 0;
    this.mustaches.length = 0;
    this.source.length = 0;
    this.parents.length = 1;
    this.parents[0] = ['fragment'];
    this.morphs.length = 0;
    this.fragmentProcessing.length = 0;
    this.parentCount = 0;
    this.indent = options && options.indent || "";
    this.hooks = {};
    this.hasOpenBoundary = false;
    this.hasCloseBoundary = false;
    this.statements = [];
    this.expressionStack = [];
    this.locals = [];
    this.hasOpenBoundary = false;
    this.hasCloseBoundary = false;

    (0, _utils.processOpcodes)(this, opcodes);

    if (this.hasOpenBoundary) {
      this.source.unshift(this.indent + "  dom.insertBoundary(fragment, 0);\n");
    }

    if (this.hasCloseBoundary) {
      this.source.unshift(this.indent + "  dom.insertBoundary(fragment, null);\n");
    }

    var i, l;

    var indent = this.indent;

    var morphs;

    var result = {
      createMorphsProgram: '',
      hydrateMorphsProgram: '',
      fragmentProcessingProgram: '',
      statements: this.statements,
      locals: this.locals,
      hasMorphs: false
    };

    result.hydrateMorphsProgram = this.source.join('');

    if (this.morphs.length) {
      result.hasMorphs = true;
      morphs = indent + '  var morphs = new Array(' + this.morphs.length + ');\n';

      for (i = 0, l = this.morphs.length; i < l; ++i) {
        var morph = this.morphs[i];
        morphs += indent + '  morphs[' + i + '] = ' + morph + ';\n';
      }
    }

    if (this.fragmentProcessing.length) {
      var processing = "";
      for (i = 0, l = this.fragmentProcessing.length; i < l; ++i) {
        processing += this.indent + '  ' + this.fragmentProcessing[i] + '\n';
      }
      result.fragmentProcessingProgram = processing;
    }

    var createMorphsProgram;
    if (result.hasMorphs) {
      createMorphsProgram = 'function buildRenderNodes(dom, fragment, contextualElement) {\n' + result.fragmentProcessingProgram + morphs;

      if (this.hasOpenBoundary) {
        createMorphsProgram += indent + "  dom.insertBoundary(fragment, 0);\n";
      }

      if (this.hasCloseBoundary) {
        createMorphsProgram += indent + "  dom.insertBoundary(fragment, null);\n";
      }

      createMorphsProgram += indent + '  return morphs;\n' + indent + '}';
    } else {
      createMorphsProgram = 'function buildRenderNodes() { return []; }';
    }

    result.createMorphsProgram = createMorphsProgram;

    return result;
  };

  prototype.prepareArray = function (length) {
    var values = [];

    for (var i = 0; i < length; i++) {
      values.push(this.expressionStack.pop());
    }

    this.expressionStack.push(values);
  };

  prototype.prepareObject = function (size) {
    var pairs = [];

    for (var i = 0; i < size; i++) {
      pairs.push(this.expressionStack.pop(), this.expressionStack.pop());
    }

    this.expressionStack.push(pairs);
  };

  prototype.openBoundary = function () {
    this.hasOpenBoundary = true;
  };

  prototype.closeBoundary = function () {
    this.hasCloseBoundary = true;
  };

  prototype.pushLiteral = function (value) {
    this.expressionStack.push(value);
  };

  prototype.pushGetHook = function (path) {
    this.expressionStack.push(['get', path]);
  };

  prototype.pushSexprHook = function () {
    this.expressionStack.push(['subexpr', this.expressionStack.pop(), this.expressionStack.pop(), this.expressionStack.pop()]);
  };

  prototype.pushConcatHook = function () {
    this.expressionStack.push(['concat', this.expressionStack.pop()]);
  };

  prototype.printSetHook = function (name) {
    this.locals.push(name);
  };

  prototype.printBlockHook = function (templateId, inverseId) {
    this.statements.push(['block', this.expressionStack.pop(), // path
    this.expressionStack.pop(), // params
    this.expressionStack.pop(), // hash
    templateId, inverseId]);
  };

  prototype.printInlineHook = function () {
    var path = this.expressionStack.pop();
    var params = this.expressionStack.pop();
    var hash = this.expressionStack.pop();

    this.statements.push(['inline', path, params, hash]);
  };

  prototype.printContentHook = function () {
    this.statements.push(['content', this.expressionStack.pop()]);
  };

  prototype.printComponentHook = function (templateId) {
    this.statements.push(['component', this.expressionStack.pop(), // path
    this.expressionStack.pop(), // attrs
    templateId]);
  };

  prototype.printAttributeHook = function () {
    this.statements.push(['attribute', this.expressionStack.pop(), // name
    this.expressionStack.pop() // value;
    ]);
  };

  prototype.printElementHook = function () {
    this.statements.push(['element', this.expressionStack.pop(), // path
    this.expressionStack.pop(), // params
    this.expressionStack.pop() // hash
    ]);
  };

  prototype.createMorph = function (morphNum, parentPath, startIndex, endIndex, escaped) {
    var isRoot = parentPath.length === 0;
    var parent = this.getParent();

    var morphMethod = escaped ? 'createMorphAt' : 'createUnsafeMorphAt';
    var morph = "dom." + morphMethod + "(" + parent + "," + (startIndex === null ? "-1" : startIndex) + "," + (endIndex === null ? "-1" : endIndex) + (isRoot ? ",contextualElement)" : ")");

    this.morphs[morphNum] = morph;
  };

  prototype.createAttrMorph = function (attrMorphNum, elementNum, name, escaped, namespace) {
    var morphMethod = escaped ? 'createAttrMorph' : 'createUnsafeAttrMorph';
    var morph = "dom." + morphMethod + "(element" + elementNum + ", '" + name + (namespace ? "', '" + namespace : '') + "')";
    this.morphs[attrMorphNum] = morph;
  };

  prototype.createElementMorph = function (morphNum, elementNum) {
    var morphMethod = 'createElementMorph';
    var morph = "dom." + morphMethod + "(element" + elementNum + ")";
    this.morphs[morphNum] = morph;
  };

  prototype.repairClonedNode = function (blankChildTextNodes, isElementChecked) {
    var parent = this.getParent(),
        processing = 'if (this.cachedFragment) { dom.repairClonedNode(' + parent + ',' + (0, _htmlbarsUtilQuoting.array)(blankChildTextNodes) + (isElementChecked ? ',true' : '') + '); }';
    this.fragmentProcessing.push(processing);
  };

  prototype.shareElement = function (elementNum) {
    var elementNodesName = "element" + elementNum;
    this.fragmentProcessing.push('var ' + elementNodesName + ' = ' + this.getParent() + ';');
    this.parents[this.parents.length - 1] = [elementNodesName];
  };

  prototype.consumeParent = function (i) {
    var newParent = this.lastParent().slice();
    newParent.push(i);

    this.parents.push(newParent);
  };

  prototype.popParent = function () {
    this.parents.pop();
  };

  prototype.getParent = function () {
    var last = this.lastParent().slice();
    var frag = last.shift();

    if (!last.length) {
      return frag;
    }

    return 'dom.childAt(' + frag + ', [' + last.join(', ') + '])';
  };

  prototype.lastParent = function () {
    return this.parents[this.parents.length - 1];
  };
});
define("htmlbars-compiler/hydration-opcode-compiler", ["exports", "module", "./template-visitor", "./utils", "../htmlbars-util", "../htmlbars-util/array-utils", "../htmlbars-syntax/utils"], function (exports, module, _templateVisitor, _utils, _htmlbarsUtil, _htmlbarsUtilArrayUtils, _htmlbarsSyntaxUtils) {
  "use strict";

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _TemplateVisitor = _interopRequireDefault(_templateVisitor);

  function detectIsElementChecked(element) {
    for (var i = 0, len = element.attributes.length; i < len; i++) {
      if (element.attributes[i].name === 'checked') {
        return true;
      }
    }
    return false;
  }

  function HydrationOpcodeCompiler() {
    this.opcodes = [];
    this.paths = [];
    this.templateId = 0;
    this.currentDOMChildIndex = 0;
    this.morphs = [];
    this.morphNum = 0;
    this.element = null;
    this.elementNum = -1;
  }

  module.exports = HydrationOpcodeCompiler;

  HydrationOpcodeCompiler.prototype.compile = function (ast) {
    var templateVisitor = new _TemplateVisitor["default"]();
    templateVisitor.visit(ast);

    (0, _utils.processOpcodes)(this, templateVisitor.actions);

    return this.opcodes;
  };

  HydrationOpcodeCompiler.prototype.accept = function (node) {
    this[node.type](node);
  };

  HydrationOpcodeCompiler.prototype.opcode = function (type) {
    var params = [].slice.call(arguments, 1);
    this.opcodes.push([type, params]);
  };

  HydrationOpcodeCompiler.prototype.startProgram = function (program, c, blankChildTextNodes) {
    this.opcodes.length = 0;
    this.paths.length = 0;
    this.morphs.length = 0;
    this.templateId = 0;
    this.currentDOMChildIndex = -1;
    this.morphNum = 0;

    var blockParams = program.blockParams || [];

    for (var i = 0; i < blockParams.length; i++) {
      this.opcode('printSetHook', blockParams[i], i);
    }

    if (blankChildTextNodes.length > 0) {
      this.opcode('repairClonedNode', blankChildTextNodes);
    }
  };

  HydrationOpcodeCompiler.prototype.insertBoundary = function (first) {
    this.opcode(first ? 'openBoundary' : 'closeBoundary');
  };

  HydrationOpcodeCompiler.prototype.endProgram = function () {
    distributeMorphs(this.morphs, this.opcodes);
  };

  HydrationOpcodeCompiler.prototype.text = function () {
    ++this.currentDOMChildIndex;
  };

  HydrationOpcodeCompiler.prototype.comment = function () {
    ++this.currentDOMChildIndex;
  };

  HydrationOpcodeCompiler.prototype.openElement = function (element, pos, len, mustacheCount, blankChildTextNodes) {
    distributeMorphs(this.morphs, this.opcodes);
    ++this.currentDOMChildIndex;

    this.element = this.currentDOMChildIndex;

    this.opcode('consumeParent', this.currentDOMChildIndex);

    // If our parent reference will be used more than once, cache its reference.
    if (mustacheCount > 1) {
      shareElement(this);
    }

    var isElementChecked = detectIsElementChecked(element);
    if (blankChildTextNodes.length > 0 || isElementChecked) {
      this.opcode('repairClonedNode', blankChildTextNodes, isElementChecked);
    }

    this.paths.push(this.currentDOMChildIndex);
    this.currentDOMChildIndex = -1;

    (0, _htmlbarsUtilArrayUtils.forEach)(element.attributes, this.attribute, this);
    (0, _htmlbarsUtilArrayUtils.forEach)(element.modifiers, this.elementModifier, this);
  };

  HydrationOpcodeCompiler.prototype.closeElement = function () {
    distributeMorphs(this.morphs, this.opcodes);
    this.opcode('popParent');
    this.currentDOMChildIndex = this.paths.pop();
  };

  HydrationOpcodeCompiler.prototype.mustache = function (mustache, childIndex, childCount) {
    this.pushMorphPlaceholderNode(childIndex, childCount);

    var opcode;

    if ((0, _htmlbarsSyntaxUtils.isHelper)(mustache)) {
      prepareHash(this, mustache.hash);
      prepareParams(this, mustache.params);
      preparePath(this, mustache.path);
      opcode = 'printInlineHook';
    } else {
      preparePath(this, mustache.path);
      opcode = 'printContentHook';
    }

    var morphNum = this.morphNum++;
    var start = this.currentDOMChildIndex;
    var end = this.currentDOMChildIndex;
    this.morphs.push([morphNum, this.paths.slice(), start, end, mustache.escaped]);

    this.opcode(opcode);
  };

  HydrationOpcodeCompiler.prototype.block = function (block, childIndex, childCount) {
    this.pushMorphPlaceholderNode(childIndex, childCount);

    prepareHash(this, block.hash);
    prepareParams(this, block.params);
    preparePath(this, block.path);

    var morphNum = this.morphNum++;
    var start = this.currentDOMChildIndex;
    var end = this.currentDOMChildIndex;
    this.morphs.push([morphNum, this.paths.slice(), start, end, true]);

    var templateId = this.templateId++;
    var inverseId = block.inverse === null ? null : this.templateId++;

    this.opcode('printBlockHook', templateId, inverseId);
  };

  HydrationOpcodeCompiler.prototype.component = function (component, childIndex, childCount) {
    this.pushMorphPlaceholderNode(childIndex, childCount);

    var program = component.program || {};
    var blockParams = program.blockParams || [];

    var attrs = component.attributes;
    for (var i = attrs.length - 1; i >= 0; i--) {
      var name = attrs[i].name;
      var value = attrs[i].value;

      // TODO: Introduce context specific AST nodes to avoid switching here.
      if (value.type === 'TextNode') {
        this.opcode('pushLiteral', value.chars);
      } else if (value.type === 'MustacheStatement') {
        this.accept((0, _htmlbarsSyntaxUtils.unwrapMustache)(value));
      } else if (value.type === 'ConcatStatement') {
        prepareParams(this, value.parts);
        this.opcode('pushConcatHook', this.morphNum);
      }

      this.opcode('pushLiteral', name);
    }

    var morphNum = this.morphNum++;
    var start = this.currentDOMChildIndex;
    var end = this.currentDOMChildIndex;
    this.morphs.push([morphNum, this.paths.slice(), start, end, true]);

    this.opcode('prepareObject', attrs.length);
    this.opcode('pushLiteral', component.tag);
    this.opcode('printComponentHook', this.templateId++, blockParams.length);
  };

  HydrationOpcodeCompiler.prototype.attribute = function (attr) {
    var value = attr.value;
    var escaped = true;
    var namespace = (0, _htmlbarsUtil.getAttrNamespace)(attr.name);

    // TODO: Introduce context specific AST nodes to avoid switching here.
    if (value.type === 'TextNode') {
      return;
    } else if (value.type === 'MustacheStatement') {
      escaped = value.escaped;
      this.accept((0, _htmlbarsSyntaxUtils.unwrapMustache)(value));
    } else if (value.type === 'ConcatStatement') {
      prepareParams(this, value.parts);
      this.opcode('pushConcatHook', this.morphNum);
    }

    this.opcode('pushLiteral', attr.name);

    var attrMorphNum = this.morphNum++;

    if (this.element !== null) {
      shareElement(this);
    }

    this.opcode('createAttrMorph', attrMorphNum, this.elementNum, attr.name, escaped, namespace);
    this.opcode('printAttributeHook');
  };

  HydrationOpcodeCompiler.prototype.elementModifier = function (modifier) {
    prepareHash(this, modifier.hash);
    prepareParams(this, modifier.params);
    preparePath(this, modifier.path);

    // If we have a helper in a node, and this element has not been cached, cache it
    if (this.element !== null) {
      shareElement(this);
    }

    publishElementMorph(this);
    this.opcode('printElementHook');
  };

  HydrationOpcodeCompiler.prototype.pushMorphPlaceholderNode = function (childIndex, childCount) {
    if (this.paths.length === 0) {
      if (childIndex === 0) {
        this.opcode('openBoundary');
      }
      if (childIndex === childCount - 1) {
        this.opcode('closeBoundary');
      }
    }
    this.comment();
  };

  HydrationOpcodeCompiler.prototype.MustacheStatement = function (mustache) {
    prepareHash(this, mustache.hash);
    prepareParams(this, mustache.params);
    preparePath(this, mustache.path);
    this.opcode('pushSexprHook');
  };

  HydrationOpcodeCompiler.prototype.SubExpression = function (sexpr) {
    prepareHash(this, sexpr.hash);
    prepareParams(this, sexpr.params);
    preparePath(this, sexpr.path);
    this.opcode('pushSexprHook');
  };

  HydrationOpcodeCompiler.prototype.PathExpression = function (path) {
    this.opcode('pushGetHook', path.original);
  };

  HydrationOpcodeCompiler.prototype.StringLiteral = function (node) {
    this.opcode('pushLiteral', node.value);
  };

  HydrationOpcodeCompiler.prototype.BooleanLiteral = function (node) {
    this.opcode('pushLiteral', node.value);
  };

  HydrationOpcodeCompiler.prototype.NumberLiteral = function (node) {
    this.opcode('pushLiteral', node.value);
  };

  HydrationOpcodeCompiler.prototype.UndefinedLiteral = function (node) {
    this.opcode('pushLiteral', node.value);
  };

  HydrationOpcodeCompiler.prototype.NullLiteral = function (node) {
    this.opcode('pushLiteral', node.value);
  };

  function preparePath(compiler, path) {
    compiler.opcode('pushLiteral', path.original);
  }

  function prepareParams(compiler, params) {
    for (var i = params.length - 1; i >= 0; i--) {
      var param = params[i];
      compiler[param.type](param);
    }

    compiler.opcode('prepareArray', params.length);
  }

  function prepareHash(compiler, hash) {
    var pairs = hash.pairs;

    for (var i = pairs.length - 1; i >= 0; i--) {
      var key = pairs[i].key;
      var value = pairs[i].value;

      compiler[value.type](value);
      compiler.opcode('pushLiteral', key);
    }

    compiler.opcode('prepareObject', pairs.length);
  }

  function shareElement(compiler) {
    compiler.opcode('shareElement', ++compiler.elementNum);
    compiler.element = null; // Set element to null so we don't cache it twice
  }

  function publishElementMorph(compiler) {
    var morphNum = compiler.morphNum++;
    compiler.opcode('createElementMorph', morphNum, compiler.elementNum);
  }

  function distributeMorphs(morphs, opcodes) {
    if (morphs.length === 0) {
      return;
    }

    // Splice morphs after the most recent shareParent/consumeParent.
    var o;
    for (o = opcodes.length - 1; o >= 0; --o) {
      var opcode = opcodes[o][0];
      if (opcode === 'shareElement' || opcode === 'consumeParent' || opcode === 'popParent') {
        break;
      }
    }

    var spliceArgs = [o + 1, 0];
    for (var i = 0; i < morphs.length; ++i) {
      spliceArgs.push(['createMorph', morphs[i].slice()]);
    }
    opcodes.splice.apply(opcodes, spliceArgs);
    morphs.length = 0;
  }
});
define('htmlbars-compiler/template-compiler', ['exports', 'module', './fragment-opcode-compiler', './fragment-javascript-compiler', './hydration-opcode-compiler', './hydration-javascript-compiler', './template-visitor', './utils', '../htmlbars-util/quoting', '../htmlbars-util/array-utils'], function (exports, module, _fragmentOpcodeCompiler, _fragmentJavascriptCompiler, _hydrationOpcodeCompiler, _hydrationJavascriptCompiler, _templateVisitor, _utils, _htmlbarsUtilQuoting, _htmlbarsUtilArrayUtils) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _FragmentOpcodeCompiler = _interopRequireDefault(_fragmentOpcodeCompiler);

  var _FragmentJavaScriptCompiler = _interopRequireDefault(_fragmentJavascriptCompiler);

  var _HydrationOpcodeCompiler = _interopRequireDefault(_hydrationOpcodeCompiler);

  var _HydrationJavaScriptCompiler = _interopRequireDefault(_hydrationJavascriptCompiler);

  var _TemplateVisitor = _interopRequireDefault(_templateVisitor);

  function TemplateCompiler(options) {
    this.options = options || {};
    this.consumerBuildMeta = this.options.buildMeta || function () {};
    this.fragmentOpcodeCompiler = new _FragmentOpcodeCompiler['default']();
    this.fragmentCompiler = new _FragmentJavaScriptCompiler['default']();
    this.hydrationOpcodeCompiler = new _HydrationOpcodeCompiler['default']();
    this.hydrationCompiler = new _HydrationJavaScriptCompiler['default']();
    this.templates = [];
    this.childTemplates = [];
  }

  module.exports = TemplateCompiler;

  var dynamicNodes = {
    mustache: true,
    block: true,
    component: true
  };

  TemplateCompiler.prototype.compile = function (ast) {
    var templateVisitor = new _TemplateVisitor['default']();
    templateVisitor.visit(ast);

    var normalizedActions = [];
    var actions = templateVisitor.actions;

    for (var i = 0, l = actions.length - 1; i < l; i++) {
      var action = actions[i];
      var nextAction = actions[i + 1];

      normalizedActions.push(action);

      if (action[0] === "startProgram" && nextAction[0] in dynamicNodes) {
        normalizedActions.push(['insertBoundary', [true]]);
      }

      if (nextAction[0] === "endProgram" && action[0] in dynamicNodes) {
        normalizedActions.push(['insertBoundary', [false]]);
      }
    }

    normalizedActions.push(actions[actions.length - 1]);

    (0, _utils.processOpcodes)(this, normalizedActions);

    return this.templates.pop();
  };

  TemplateCompiler.prototype.startProgram = function (program, childTemplateCount, blankChildTextNodes) {
    this.fragmentOpcodeCompiler.startProgram(program, childTemplateCount, blankChildTextNodes);
    this.hydrationOpcodeCompiler.startProgram(program, childTemplateCount, blankChildTextNodes);

    this.childTemplates.length = 0;
    while (childTemplateCount--) {
      this.childTemplates.push(this.templates.pop());
    }
  };

  TemplateCompiler.prototype.insertBoundary = function (first) {
    this.hydrationOpcodeCompiler.insertBoundary(first);
  };

  TemplateCompiler.prototype.getChildTemplateVars = function (indent) {
    var vars = '';
    if (this.childTemplates) {
      for (var i = 0; i < this.childTemplates.length; i++) {
        vars += indent + 'var child' + i + ' = ' + this.childTemplates[i] + ';\n';
      }
    }
    return vars;
  };

  TemplateCompiler.prototype.getHydrationHooks = function (indent, hooks) {
    var hookVars = [];
    for (var hook in hooks) {
      hookVars.push(hook + ' = hooks.' + hook);
    }

    if (hookVars.length > 0) {
      return indent + 'var hooks = env.hooks, ' + hookVars.join(', ') + ';\n';
    } else {
      return '';
    }
  };

  TemplateCompiler.prototype.endProgram = function (program, programDepth) {
    this.fragmentOpcodeCompiler.endProgram(program);
    this.hydrationOpcodeCompiler.endProgram(program);

    var indent = (0, _htmlbarsUtilQuoting.repeat)("  ", programDepth);
    var options = {
      indent: indent + "    "
    };

    // function build(dom) { return fragment; }
    var fragmentProgram = this.fragmentCompiler.compile(this.fragmentOpcodeCompiler.opcodes, options);

    // function hydrate(fragment) { return mustaches; }
    var hydrationPrograms = this.hydrationCompiler.compile(this.hydrationOpcodeCompiler.opcodes, options);

    var blockParams = program.blockParams || [];

    var templateSignature = 'context, rootNode, env, options';
    if (blockParams.length > 0) {
      templateSignature += ', blockArguments';
    }

    var statements = (0, _htmlbarsUtilArrayUtils.map)(hydrationPrograms.statements, function (s) {
      return indent + '      ' + JSON.stringify(s);
    }).join(",\n");

    var locals = JSON.stringify(hydrationPrograms.locals);

    var templates = (0, _htmlbarsUtilArrayUtils.map)(this.childTemplates, function (_, index) {
      return 'child' + index;
    }).join(', ');

    var template = '(function() {\n' + this.getChildTemplateVars(indent + '  ') + indent + '  return {\n' + this.buildMeta(indent + '    ', program) + indent + '    arity: ' + blockParams.length + ',\n' + indent + '    cachedFragment: null,\n' + indent + '    hasRendered: false,\n' + indent + '    buildFragment: ' + fragmentProgram + ',\n' + indent + '    buildRenderNodes: ' + hydrationPrograms.createMorphsProgram + ',\n' + indent + '    statements: [\n' + statements + '\n' + indent + '    ],\n' + indent + '    locals: ' + locals + ',\n' + indent + '    templates: [' + templates + ']\n' + indent + '  };\n' + indent + '}())';

    this.templates.push(template);
  };

  TemplateCompiler.prototype.buildMeta = function (indent, program) {
    var meta = this.consumerBuildMeta(program) || {};

    var head = indent + 'meta: ';
    var stringMeta = JSON.stringify(meta, null, 2).replace(/\n/g, '\n' + indent);
    var tail = ',\n';

    return head + stringMeta + tail;
  };

  TemplateCompiler.prototype.openElement = function (element, i, l, r, c, b) {
    this.fragmentOpcodeCompiler.openElement(element, i, l, r, c, b);
    this.hydrationOpcodeCompiler.openElement(element, i, l, r, c, b);
  };

  TemplateCompiler.prototype.closeElement = function (element, i, l, r) {
    this.fragmentOpcodeCompiler.closeElement(element, i, l, r);
    this.hydrationOpcodeCompiler.closeElement(element, i, l, r);
  };

  TemplateCompiler.prototype.component = function (component, i, l, s) {
    this.fragmentOpcodeCompiler.component(component, i, l, s);
    this.hydrationOpcodeCompiler.component(component, i, l, s);
  };

  TemplateCompiler.prototype.block = function (block, i, l, s) {
    this.fragmentOpcodeCompiler.block(block, i, l, s);
    this.hydrationOpcodeCompiler.block(block, i, l, s);
  };

  TemplateCompiler.prototype.text = function (string, i, l, r) {
    this.fragmentOpcodeCompiler.text(string, i, l, r);
    this.hydrationOpcodeCompiler.text(string, i, l, r);
  };

  TemplateCompiler.prototype.comment = function (string, i, l, r) {
    this.fragmentOpcodeCompiler.comment(string, i, l, r);
    this.hydrationOpcodeCompiler.comment(string, i, l, r);
  };

  TemplateCompiler.prototype.mustache = function (mustache, i, l, s) {
    this.fragmentOpcodeCompiler.mustache(mustache, i, l, s);
    this.hydrationOpcodeCompiler.mustache(mustache, i, l, s);
  };

  TemplateCompiler.prototype.setNamespace = function (namespace) {
    this.fragmentOpcodeCompiler.setNamespace(namespace);
  };
});
define('htmlbars-compiler/template-visitor', ['exports', 'module'], function (exports, module) {
  'use strict';

  var push = Array.prototype.push;

  function Frame() {
    this.parentNode = null;
    this.children = null;
    this.childIndex = null;
    this.childCount = null;
    this.childTemplateCount = 0;
    this.mustacheCount = 0;
    this.actions = [];
  }

  /**
   * Takes in an AST and outputs a list of actions to be consumed
   * by a compiler. For example, the template
   *
   *     foo{{bar}}<div>baz</div>
   *
   * produces the actions
   *
   *     [['startProgram', [programNode, 0]],
   *      ['text', [textNode, 0, 3]],
   *      ['mustache', [mustacheNode, 1, 3]],
   *      ['openElement', [elementNode, 2, 3, 0]],
   *      ['text', [textNode, 0, 1]],
   *      ['closeElement', [elementNode, 2, 3],
   *      ['endProgram', [programNode]]]
   *
   * This visitor walks the AST depth first and backwards. As
   * a result the bottom-most child template will appear at the
   * top of the actions list whereas the root template will appear
   * at the bottom of the list. For example,
   *
   *     <div>{{#if}}foo{{else}}bar<b></b>{{/if}}</div>
   *
   * produces the actions
   *
   *     [['startProgram', [programNode, 0]],
   *      ['text', [textNode, 0, 2, 0]],
   *      ['openElement', [elementNode, 1, 2, 0]],
   *      ['closeElement', [elementNode, 1, 2]],
   *      ['endProgram', [programNode]],
   *      ['startProgram', [programNode, 0]],
   *      ['text', [textNode, 0, 1]],
   *      ['endProgram', [programNode]],
   *      ['startProgram', [programNode, 2]],
   *      ['openElement', [elementNode, 0, 1, 1]],
   *      ['block', [blockNode, 0, 1]],
   *      ['closeElement', [elementNode, 0, 1]],
   *      ['endProgram', [programNode]]]
   *
   * The state of the traversal is maintained by a stack of frames.
   * Whenever a node with children is entered (either a ProgramNode
   * or an ElementNode) a frame is pushed onto the stack. The frame
   * contains information about the state of the traversal of that
   * node. For example,
   *
   *   - index of the current child node being visited
   *   - the number of mustaches contained within its child nodes
   *   - the list of actions generated by its child nodes
   */

  function TemplateVisitor() {
    this.frameStack = [];
    this.actions = [];
    this.programDepth = -1;
  }

  // Traversal methods

  TemplateVisitor.prototype.visit = function (node) {
    this[node.type](node);
  };

  TemplateVisitor.prototype.Program = function (program) {
    this.programDepth++;

    var parentFrame = this.getCurrentFrame();
    var programFrame = this.pushFrame();

    programFrame.parentNode = program;
    programFrame.children = program.body;
    programFrame.childCount = program.body.length;
    programFrame.blankChildTextNodes = [];
    programFrame.actions.push(['endProgram', [program, this.programDepth]]);

    for (var i = program.body.length - 1; i >= 0; i--) {
      programFrame.childIndex = i;
      this.visit(program.body[i]);
    }

    programFrame.actions.push(['startProgram', [program, programFrame.childTemplateCount, programFrame.blankChildTextNodes.reverse()]]);
    this.popFrame();

    this.programDepth--;

    // Push the completed template into the global actions list
    if (parentFrame) {
      parentFrame.childTemplateCount++;
    }
    push.apply(this.actions, programFrame.actions.reverse());
  };

  TemplateVisitor.prototype.ElementNode = function (element) {
    var parentFrame = this.getCurrentFrame();
    var elementFrame = this.pushFrame();

    elementFrame.parentNode = element;
    elementFrame.children = element.children;
    elementFrame.childCount = element.children.length;
    elementFrame.mustacheCount += element.modifiers.length;
    elementFrame.blankChildTextNodes = [];

    var actionArgs = [element, parentFrame.childIndex, parentFrame.childCount];

    elementFrame.actions.push(['closeElement', actionArgs]);

    for (var i = element.attributes.length - 1; i >= 0; i--) {
      this.visit(element.attributes[i]);
    }

    for (i = element.children.length - 1; i >= 0; i--) {
      elementFrame.childIndex = i;
      this.visit(element.children[i]);
    }

    elementFrame.actions.push(['openElement', actionArgs.concat([elementFrame.mustacheCount, elementFrame.blankChildTextNodes.reverse()])]);
    this.popFrame();

    // Propagate the element's frame state to the parent frame
    if (elementFrame.mustacheCount > 0) {
      parentFrame.mustacheCount++;
    }
    parentFrame.childTemplateCount += elementFrame.childTemplateCount;
    push.apply(parentFrame.actions, elementFrame.actions);
  };

  TemplateVisitor.prototype.AttrNode = function (attr) {
    if (attr.value.type !== 'TextNode') {
      this.getCurrentFrame().mustacheCount++;
    }
  };

  TemplateVisitor.prototype.TextNode = function (text) {
    var frame = this.getCurrentFrame();
    if (text.chars === '') {
      frame.blankChildTextNodes.push(domIndexOf(frame.children, text));
    }
    frame.actions.push(['text', [text, frame.childIndex, frame.childCount]]);
  };

  TemplateVisitor.prototype.BlockStatement = function (node) {
    var frame = this.getCurrentFrame();

    frame.mustacheCount++;
    frame.actions.push(['block', [node, frame.childIndex, frame.childCount]]);

    if (node.inverse) {
      this.visit(node.inverse);
    }
    if (node.program) {
      this.visit(node.program);
    }
  };

  TemplateVisitor.prototype.ComponentNode = function (node) {
    var frame = this.getCurrentFrame();

    frame.mustacheCount++;
    frame.actions.push(['component', [node, frame.childIndex, frame.childCount]]);

    if (node.program) {
      this.visit(node.program);
    }
  };

  TemplateVisitor.prototype.PartialStatement = function (node) {
    var frame = this.getCurrentFrame();
    frame.mustacheCount++;
    frame.actions.push(['mustache', [node, frame.childIndex, frame.childCount]]);
  };

  TemplateVisitor.prototype.CommentStatement = function (text) {
    var frame = this.getCurrentFrame();
    frame.actions.push(['comment', [text, frame.childIndex, frame.childCount]]);
  };

  TemplateVisitor.prototype.MustacheStatement = function (mustache) {
    var frame = this.getCurrentFrame();
    frame.mustacheCount++;
    frame.actions.push(['mustache', [mustache, frame.childIndex, frame.childCount]]);
  };

  // Frame helpers

  TemplateVisitor.prototype.getCurrentFrame = function () {
    return this.frameStack[this.frameStack.length - 1];
  };

  TemplateVisitor.prototype.pushFrame = function () {
    var frame = new Frame();
    this.frameStack.push(frame);
    return frame;
  };

  TemplateVisitor.prototype.popFrame = function () {
    return this.frameStack.pop();
  };

  module.exports = TemplateVisitor;

  // Returns the index of `domNode` in the `nodes` array, skipping
  // over any nodes which do not represent DOM nodes.
  function domIndexOf(nodes, domNode) {
    var index = -1;

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];

      if (node.type !== 'TextNode' && node.type !== 'ElementNode') {
        continue;
      } else {
        index++;
      }

      if (node === domNode) {
        return index;
      }
    }

    return -1;
  }
});
define("htmlbars-compiler/utils", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.processOpcodes = processOpcodes;

  function processOpcodes(compiler, opcodes) {
    for (var i = 0, l = opcodes.length; i < l; i++) {
      var method = opcodes[i][0];
      var params = opcodes[i][1];
      if (params) {
        compiler[method].apply(compiler, params);
      } else {
        compiler[method].call(compiler);
      }
    }
  }
});
define('htmlbars-runtime', ['exports', './htmlbars-runtime/hooks', './htmlbars-runtime/render', '../htmlbars-util/morph-utils', '../htmlbars-util/template-utils', './htmlbars-runtime/expression-visitor', 'htmlbars-runtime/hooks'], function (exports, _htmlbarsRuntimeHooks, _htmlbarsRuntimeRender, _htmlbarsUtilMorphUtils, _htmlbarsUtilTemplateUtils, _htmlbarsRuntimeExpressionVisitor, _htmlbarsRuntimeHooks2) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _hooks = _interopRequireDefault(_htmlbarsRuntimeHooks);

  var _render = _interopRequireDefault(_htmlbarsRuntimeRender);

  var internal = {
    blockFor: _htmlbarsUtilTemplateUtils.blockFor,
    manualElement: _htmlbarsRuntimeRender.manualElement,
    hostBlock: _htmlbarsRuntimeHooks2.hostBlock,
    continueBlock: _htmlbarsRuntimeHooks2.continueBlock,
    hostYieldWithShadowTemplate: _htmlbarsRuntimeHooks2.hostYieldWithShadowTemplate,
    visitChildren: _htmlbarsUtilMorphUtils.visitChildren,
    validateChildMorphs: _htmlbarsRuntimeExpressionVisitor.validateChildMorphs,
    clearMorph: _htmlbarsUtilTemplateUtils.clearMorph
  };

  exports.hooks = _hooks['default'];
  exports.render = _render['default'];
  exports.internal = internal;
});
define("htmlbars-runtime/expression-visitor", ["exports", "../htmlbars-util/object-utils", "../htmlbars-util/morph-utils"], function (exports, _htmlbarsUtilObjectUtils, _htmlbarsUtilMorphUtils) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  /**
    Node classification:
  
    # Primary Statement Nodes:
  
    These nodes are responsible for a render node that represents a morph-range.
  
    * block
    * inline
    * content
    * element
    * component
  
    # Leaf Statement Nodes:
  
    This node is responsible for a render node that represents a morph-attr.
  
    * attribute
  
    # Expression Nodes:
  
    These nodes are not directly responsible for any part of the DOM, but are
    eventually passed to a Statement Node.
  
    * get
    * subexpr
    * concat
  */

  var base = {
    acceptExpression: function acceptExpression(node, env, scope) {
      var ret = { value: null };

      // Primitive literals are unambiguously non-array representations of
      // themselves.
      if (typeof node !== 'object' || node === null) {
        ret.value = node;
        return ret;
      }

      switch (node[0]) {
        // can be used by manualElement
        case 'value':
          ret.value = node[1];break;
        case 'get':
          ret.value = this.get(node, env, scope);break;
        case 'subexpr':
          ret.value = this.subexpr(node, env, scope);break;
        case 'concat':
          ret.value = this.concat(node, env, scope);break;
      }

      return ret;
    },

    acceptParams: function acceptParams(nodes, env, scope) {
      var arr = new Array(nodes.length);

      for (var i = 0, l = nodes.length; i < l; i++) {
        arr[i] = this.acceptExpression(nodes[i], env, scope).value;
      }

      return arr;
    },

    acceptHash: function acceptHash(pairs, env, scope) {
      var object = {};

      for (var i = 0, l = pairs.length; i < l; i += 2) {
        object[pairs[i]] = this.acceptExpression(pairs[i + 1], env, scope).value;
      }

      return object;
    },

    // [ 'get', path ]
    get: function get(node, env, scope) {
      return env.hooks.get(env, scope, node[1]);
    },

    // [ 'subexpr', path, params, hash ]
    subexpr: function subexpr(node, env, scope) {
      var path = node[1],
          params = node[2],
          hash = node[3];
      return env.hooks.subexpr(env, scope, path, this.acceptParams(params, env, scope), this.acceptHash(hash, env, scope));
    },

    // [ 'concat', parts ]
    concat: function concat(node, env, scope) {
      return env.hooks.concat(env, this.acceptParams(node[1], env, scope));
    },

    linkParamsAndHash: function linkParamsAndHash(env, scope, morph, path, params, hash) {
      if (morph.linkedParams) {
        params = morph.linkedParams.params;
        hash = morph.linkedParams.hash;
      } else {
        params = params && this.acceptParams(params, env, scope);
        hash = hash && this.acceptHash(hash, env, scope);
      }

      (0, _htmlbarsUtilMorphUtils.linkParams)(env, scope, morph, path, params, hash);
      return [params, hash];
    }
  };

  var AlwaysDirtyVisitor = (0, _htmlbarsUtilObjectUtils.merge)((0, _htmlbarsUtilObjectUtils.createObject)(base), {
    // [ 'block', path, params, hash, templateId, inverseId ]
    block: function block(node, morph, env, scope, template, visitor) {
      var path = node[1],
          params = node[2],
          hash = node[3],
          templateId = node[4],
          inverseId = node[5];
      var paramsAndHash = this.linkParamsAndHash(env, scope, morph, path, params, hash);

      morph.isDirty = morph.isSubtreeDirty = false;
      env.hooks.block(morph, env, scope, path, paramsAndHash[0], paramsAndHash[1], templateId === null ? null : template.templates[templateId], inverseId === null ? null : template.templates[inverseId], visitor);
    },

    // [ 'inline', path, params, hash ]
    inline: function inline(node, morph, env, scope, visitor) {
      var path = node[1],
          params = node[2],
          hash = node[3];
      var paramsAndHash = this.linkParamsAndHash(env, scope, morph, path, params, hash);

      morph.isDirty = morph.isSubtreeDirty = false;
      env.hooks.inline(morph, env, scope, path, paramsAndHash[0], paramsAndHash[1], visitor);
    },

    // [ 'content', path ]
    content: function content(node, morph, env, scope, visitor) {
      var path = node[1];

      morph.isDirty = morph.isSubtreeDirty = false;

      if (isHelper(env, scope, path)) {
        env.hooks.inline(morph, env, scope, path, [], {}, visitor);
        if (morph.linkedResult) {
          (0, _htmlbarsUtilMorphUtils.linkParams)(env, scope, morph, '@content-helper', [morph.linkedResult], null);
        }
        return;
      }

      var params;
      if (morph.linkedParams) {
        params = morph.linkedParams.params;
      } else {
        params = [env.hooks.get(env, scope, path)];
      }

      (0, _htmlbarsUtilMorphUtils.linkParams)(env, scope, morph, '@range', params, null);
      env.hooks.range(morph, env, scope, path, params[0], visitor);
    },

    // [ 'element', path, params, hash ]
    element: function element(node, morph, env, scope, visitor) {
      var path = node[1],
          params = node[2],
          hash = node[3];
      var paramsAndHash = this.linkParamsAndHash(env, scope, morph, path, params, hash);

      morph.isDirty = morph.isSubtreeDirty = false;
      env.hooks.element(morph, env, scope, path, paramsAndHash[0], paramsAndHash[1], visitor);
    },

    // [ 'attribute', name, value ]
    attribute: function attribute(node, morph, env, scope) {
      var name = node[1],
          value = node[2];
      var paramsAndHash = this.linkParamsAndHash(env, scope, morph, '@attribute', [value], null);

      morph.isDirty = morph.isSubtreeDirty = false;
      env.hooks.attribute(morph, env, scope, name, paramsAndHash[0][0]);
    },

    // [ 'component', path, attrs, templateId, inverseId ]
    component: function component(node, morph, env, scope, template, visitor) {
      var path = node[1],
          attrs = node[2],
          templateId = node[3],
          inverseId = node[4];
      var paramsAndHash = this.linkParamsAndHash(env, scope, morph, path, [], attrs);
      var templates = {
        "default": template.templates[templateId],
        inverse: template.templates[inverseId]
      };

      morph.isDirty = morph.isSubtreeDirty = false;
      env.hooks.component(morph, env, scope, path, paramsAndHash[0], paramsAndHash[1], templates, visitor);
    },

    // [ 'attributes', template ]
    attributes: function attributes(node, morph, env, scope, parentMorph, visitor) {
      var template = node[1];
      env.hooks.attributes(morph, env, scope, template, parentMorph, visitor);
    }
  });

  exports.AlwaysDirtyVisitor = AlwaysDirtyVisitor;
  exports["default"] = (0, _htmlbarsUtilObjectUtils.merge)((0, _htmlbarsUtilObjectUtils.createObject)(base), {
    // [ 'block', path, params, hash, templateId, inverseId ]
    block: function block(node, morph, env, scope, template, visitor) {
      dirtyCheck(env, morph, visitor, function (visitor) {
        AlwaysDirtyVisitor.block(node, morph, env, scope, template, visitor);
      });
    },

    // [ 'inline', path, params, hash ]
    inline: function inline(node, morph, env, scope, visitor) {
      dirtyCheck(env, morph, visitor, function (visitor) {
        AlwaysDirtyVisitor.inline(node, morph, env, scope, visitor);
      });
    },

    // [ 'content', path ]
    content: function content(node, morph, env, scope, visitor) {
      dirtyCheck(env, morph, visitor, function (visitor) {
        AlwaysDirtyVisitor.content(node, morph, env, scope, visitor);
      });
    },

    // [ 'element', path, params, hash ]
    element: function element(node, morph, env, scope, template, visitor) {
      dirtyCheck(env, morph, visitor, function (visitor) {
        AlwaysDirtyVisitor.element(node, morph, env, scope, template, visitor);
      });
    },

    // [ 'attribute', name, value ]
    attribute: function attribute(node, morph, env, scope, template) {
      dirtyCheck(env, morph, null, function () {
        AlwaysDirtyVisitor.attribute(node, morph, env, scope, template);
      });
    },

    // [ 'component', path, attrs, templateId ]
    component: function component(node, morph, env, scope, template, visitor) {
      dirtyCheck(env, morph, visitor, function (visitor) {
        AlwaysDirtyVisitor.component(node, morph, env, scope, template, visitor);
      });
    },

    // [ 'attributes', template ]
    attributes: function attributes(node, morph, env, scope, parentMorph, visitor) {
      AlwaysDirtyVisitor.attributes(node, morph, env, scope, parentMorph, visitor);
    }
  });

  function dirtyCheck(_env, morph, visitor, callback) {
    var isDirty = morph.isDirty;
    var isSubtreeDirty = morph.isSubtreeDirty;
    var env = _env;

    if (isSubtreeDirty) {
      visitor = AlwaysDirtyVisitor;
    }

    if (isDirty || isSubtreeDirty) {
      callback(visitor);
    } else {
      if (morph.buildChildEnv) {
        env = morph.buildChildEnv(morph.state, env);
      }
      (0, _htmlbarsUtilMorphUtils.validateChildMorphs)(env, morph, visitor);
    }
  }

  function isHelper(env, scope, path) {
    return env.hooks.keywords[path] !== undefined || env.hooks.hasHelper(env, scope, path);
  }
});
define("htmlbars-runtime/hooks", ["exports", "./render", "../morph-range/morph-list", "../htmlbars-util/object-utils", "../htmlbars-util/morph-utils", "../htmlbars-util/template-utils"], function (exports, _render2, _morphRangeMorphList, _htmlbarsUtilObjectUtils, _htmlbarsUtilMorphUtils, _htmlbarsUtilTemplateUtils) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.wrap = wrap;
  exports.wrapForHelper = wrapForHelper;
  exports.hostYieldWithShadowTemplate = hostYieldWithShadowTemplate;
  exports.createScope = createScope;
  exports.createFreshScope = createFreshScope;
  exports.bindShadowScope = bindShadowScope;
  exports.createChildScope = createChildScope;
  exports.bindSelf = bindSelf;
  exports.updateSelf = updateSelf;
  exports.bindLocal = bindLocal;
  exports.updateLocal = updateLocal;
  exports.bindBlock = bindBlock;
  exports.block = block;
  exports.continueBlock = continueBlock;
  exports.hostBlock = hostBlock;
  exports.handleRedirect = handleRedirect;
  exports.handleKeyword = handleKeyword;
  exports.linkRenderNode = linkRenderNode;
  exports.inline = inline;
  exports.keyword = keyword;
  exports.invokeHelper = invokeHelper;
  exports.classify = classify;
  exports.partial = partial;
  exports.range = range;
  exports.element = element;
  exports.attribute = attribute;
  exports.subexpr = subexpr;
  exports.get = get;
  exports.getRoot = getRoot;
  exports.getChild = getChild;
  exports.getValue = getValue;
  exports.getCellOrValue = getCellOrValue;
  exports.component = component;
  exports.concat = concat;
  exports.hasHelper = hasHelper;
  exports.lookupHelper = lookupHelper;
  exports.bindScope = bindScope;
  exports.updateScope = updateScope;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _render3 = _interopRequireDefault(_render2);

  var _MorphList = _interopRequireDefault(_morphRangeMorphList);

  /**
    HTMLBars delegates the runtime behavior of a template to
    hooks provided by the host environment. These hooks explain
    the lexical environment of a Handlebars template, the internal
    representation of references, and the interaction between an
    HTMLBars template and the DOM it is managing.
  
    While HTMLBars host hooks have access to all of this internal
    machinery, templates and helpers have access to the abstraction
    provided by the host hooks.
  
    ## The Lexical Environment
  
    The default lexical environment of an HTMLBars template includes:
  
    * Any local variables, provided by *block arguments*
    * The current value of `self`
  
    ## Simple Nesting
  
    Let's look at a simple template with a nested block:
  
    ```hbs
    <h1>{{title}}</h1>
  
    {{#if author}}
      <p class="byline">{{author}}</p>
    {{/if}}
    ```
  
    In this case, the lexical environment at the top-level of the
    template does not change inside of the `if` block. This is
    achieved via an implementation of `if` that looks like this:
  
    ```js
    registerHelper('if', function(params) {
      if (!!params[0]) {
        return this.yield();
      }
    });
    ```
  
    A call to `this.yield` invokes the child template using the
    current lexical environment.
  
    ## Block Arguments
  
    It is possible for nested blocks to introduce new local
    variables:
  
    ```hbs
    {{#count-calls as |i|}}
    <h1>{{title}}</h1>
    <p>Called {{i}} times</p>
    {{/count}}
    ```
  
    In this example, the child block inherits its surrounding
    lexical environment, but augments it with a single new
    variable binding.
  
    The implementation of `count-calls` supplies the value of
    `i`, but does not otherwise alter the environment:
  
    ```js
    var count = 0;
    registerHelper('count-calls', function() {
      return this.yield([ ++count ]);
    });
    ```
  */

  function wrap(template) {
    if (template === null) {
      return null;
    }

    return {
      meta: template.meta,
      arity: template.arity,
      raw: template,
      render: function render(self, env, options, blockArguments) {
        var scope = env.hooks.createFreshScope();

        options = options || {};
        options.self = self;
        options.blockArguments = blockArguments;

        return (0, _render3["default"])(template, env, scope, options);
      }
    };
  }

  function wrapForHelper(template, env, scope, morph, renderState, visitor) {
    if (!template) {
      return {
        yieldIn: yieldInShadowTemplate(null, env, scope, morph, renderState, visitor)
      };
    }

    var yieldArgs = yieldTemplate(template, env, scope, morph, renderState, visitor);

    return {
      meta: template.meta,
      arity: template.arity,
      "yield": yieldArgs,
      yieldItem: yieldItem(template, env, scope, morph, renderState, visitor),
      yieldIn: yieldInShadowTemplate(template, env, scope, morph, renderState, visitor),
      raw: template,

      render: function render(self, blockArguments) {
        yieldArgs(blockArguments, self);
      }
    };
  }

  // Called by a user-land helper to render a template.
  function yieldTemplate(template, env, parentScope, morph, renderState, visitor) {
    return function (blockArguments, self) {
      // Render state is used to track the progress of the helper (since it
      // may call into us multiple times). As the user-land helper calls
      // into library code, we track what needs to be cleaned up after the
      // helper has returned.
      //
      // Here, we remember that a template has been yielded and so we do not
      // need to remove the previous template. (If no template is yielded
      // this render by the helper, we assume nothing should be shown and
      // remove any previous rendered templates.)
      renderState.morphToClear = null;

      // In this conditional is true, it means that on the previous rendering pass
      // the helper yielded multiple items via `yieldItem()`, but this time they
      // are yielding a single template. In that case, we mark the morph list for
      // cleanup so it is removed from the DOM.
      if (morph.morphList) {
        (0, _htmlbarsUtilTemplateUtils.clearMorphList)(morph.morphList, morph, env);
        renderState.morphListToClear = null;
      }

      var scope = parentScope;

      if (morph.lastYielded && isStableTemplate(template, morph.lastYielded)) {
        return morph.lastResult.revalidateWith(env, undefined, self, blockArguments, visitor);
      }

      // Check to make sure that we actually **need** a new scope, and can't
      // share the parent scope. Note that we need to move this check into
      // a host hook, because the host's notion of scope may require a new
      // scope in more cases than the ones we can determine statically.
      if (self !== undefined || parentScope === null || template.arity) {
        scope = env.hooks.createChildScope(parentScope);
      }

      morph.lastYielded = { self: self, template: template, shadowTemplate: null };

      // Render the template that was selected by the helper
      (0, _render3["default"])(template, env, scope, { renderNode: morph, self: self, blockArguments: blockArguments });
    };
  }

  function yieldItem(template, env, parentScope, morph, renderState, visitor) {
    // Initialize state that tracks multiple items being
    // yielded in.
    var currentMorph = null;

    // Candidate morphs for deletion.
    var candidates = {};

    // Reuse existing MorphList if this is not a first-time
    // render.
    var morphList = morph.morphList;
    if (morphList) {
      currentMorph = morphList.firstChildMorph;
    }

    // Advances the currentMorph pointer to the morph in the previously-rendered
    // list that matches the yielded key. While doing so, it marks any morphs
    // that it advances past as candidates for deletion. Assuming those morphs
    // are not yielded in later, they will be removed in the prune step during
    // cleanup.
    // Note that this helper function assumes that the morph being seeked to is
    // guaranteed to exist in the previous MorphList; if this is called and the
    // morph does not exist, it will result in an infinite loop
    function advanceToKey(key) {
      var seek = currentMorph;

      while (seek.key !== key) {
        candidates[seek.key] = seek;
        seek = seek.nextMorph;
      }

      currentMorph = seek.nextMorph;
      return seek;
    }

    return function (key, blockArguments, self) {
      if (typeof key !== 'string') {
        throw new Error("You must provide a string key when calling `yieldItem`; you provided " + key);
      }

      // At least one item has been yielded, so we do not wholesale
      // clear the last MorphList but instead apply a prune operation.
      renderState.morphListToClear = null;
      morph.lastYielded = null;

      var morphList, morphMap;

      if (!morph.morphList) {
        morph.morphList = new _MorphList["default"]();
        morph.morphMap = {};
        morph.setMorphList(morph.morphList);
      }

      morphList = morph.morphList;
      morphMap = morph.morphMap;

      // A map of morphs that have been yielded in on this
      // rendering pass. Any morphs that do not make it into
      // this list will be pruned from the MorphList during the cleanup
      // process.
      var handledMorphs = renderState.handledMorphs;

      if (currentMorph && currentMorph.key === key) {
        yieldTemplate(template, env, parentScope, currentMorph, renderState, visitor)(blockArguments, self);
        currentMorph = currentMorph.nextMorph;
        handledMorphs[key] = currentMorph;
      } else if (morphMap[key] !== undefined) {
        var foundMorph = morphMap[key];

        if (key in candidates) {
          // If we already saw this morph, move it forward to this position
          morphList.insertBeforeMorph(foundMorph, currentMorph);
        } else {
          // Otherwise, move the pointer forward to the existing morph for this key
          advanceToKey(key);
        }

        handledMorphs[foundMorph.key] = foundMorph;
        yieldTemplate(template, env, parentScope, foundMorph, renderState, visitor)(blockArguments, self);
      } else {
        var childMorph = (0, _render2.createChildMorph)(env.dom, morph);
        childMorph.key = key;
        morphMap[key] = handledMorphs[key] = childMorph;
        morphList.insertBeforeMorph(childMorph, currentMorph);
        yieldTemplate(template, env, parentScope, childMorph, renderState, visitor)(blockArguments, self);
      }

      renderState.morphListToPrune = morphList;
      morph.childNodes = null;
    };
  }

  function isStableTemplate(template, lastYielded) {
    return !lastYielded.shadowTemplate && template === lastYielded.template;
  }

  function yieldInShadowTemplate(template, env, parentScope, morph, renderState, visitor) {
    var hostYield = hostYieldWithShadowTemplate(template, env, parentScope, morph, renderState, visitor);

    return function (shadowTemplate, self) {
      hostYield(shadowTemplate, env, self, []);
    };
  }

  function hostYieldWithShadowTemplate(template, env, parentScope, morph, renderState, visitor) {
    return function (shadowTemplate, env, self, blockArguments) {
      renderState.morphToClear = null;

      if (morph.lastYielded && isStableShadowRoot(template, shadowTemplate, morph.lastYielded)) {
        return morph.lastResult.revalidateWith(env, undefined, self, blockArguments, visitor);
      }

      var shadowScope = env.hooks.createFreshScope();
      env.hooks.bindShadowScope(env, parentScope, shadowScope, renderState.shadowOptions);
      blockToYield.arity = template.arity;
      env.hooks.bindBlock(env, shadowScope, blockToYield);

      morph.lastYielded = { self: self, template: template, shadowTemplate: shadowTemplate };

      // Render the shadow template with the block available
      (0, _render3["default"])(shadowTemplate.raw, env, shadowScope, { renderNode: morph, self: self, blockArguments: blockArguments });
    };

    function blockToYield(env, blockArguments, self, renderNode, shadowParent, visitor) {
      if (renderNode.lastResult) {
        renderNode.lastResult.revalidateWith(env, undefined, undefined, blockArguments, visitor);
      } else {
        var scope = parentScope;

        // Since a yielded template shares a `self` with its original context,
        // we only need to create a new scope if the template has block parameters
        if (template.arity) {
          scope = env.hooks.createChildScope(parentScope);
        }

        (0, _render3["default"])(template, env, scope, { renderNode: renderNode, self: self, blockArguments: blockArguments });
      }
    }
  }

  function isStableShadowRoot(template, shadowTemplate, lastYielded) {
    return template === lastYielded.template && shadowTemplate === lastYielded.shadowTemplate;
  }

  function optionsFor(template, inverse, env, scope, morph, visitor) {
    // If there was a template yielded last time, set morphToClear so it will be cleared
    // if no template is yielded on this render.
    var morphToClear = morph.lastResult ? morph : null;
    var renderState = new _htmlbarsUtilTemplateUtils.RenderState(morphToClear, morph.morphList || null);

    return {
      templates: {
        template: wrapForHelper(template, env, scope, morph, renderState, visitor),
        inverse: wrapForHelper(inverse, env, scope, morph, renderState, visitor)
      },
      renderState: renderState
    };
  }

  function thisFor(options) {
    return {
      arity: options.template.arity,
      "yield": options.template["yield"],
      yieldItem: options.template.yieldItem,
      yieldIn: options.template.yieldIn
    };
  }

  /**
    Host Hook: createScope
  
    @param {Scope?} parentScope
    @return Scope
  
    Corresponds to entering a new HTMLBars block.
  
    This hook is invoked when a block is entered with
    a new `self` or additional local variables.
  
    When invoked for a top-level template, the
    `parentScope` is `null`, and this hook should return
    a fresh Scope.
  
    When invoked for a child template, the `parentScope`
    is the scope for the parent environment.
  
    Note that the `Scope` is an opaque value that is
    passed to other host hooks. For example, the `get`
    hook uses the scope to retrieve a value for a given
    scope and variable name.
  */

  function createScope(env, parentScope) {
    if (parentScope) {
      return env.hooks.createChildScope(parentScope);
    } else {
      return env.hooks.createFreshScope();
    }
  }

  function createFreshScope() {
    // because `in` checks have unpredictable performance, keep a
    // separate dictionary to track whether a local was bound.
    // See `bindLocal` for more information.
    return { self: null, blocks: {}, locals: {}, localPresent: {} };
  }

  /**
    Host Hook: bindShadowScope
  
    @param {Scope?} parentScope
    @return Scope
  
    Corresponds to rendering a new template into an existing
    render tree, but with a new top-level lexical scope. This
    template is called the "shadow root".
  
    If a shadow template invokes `{{yield}}`, it will render
    the block provided to the shadow root in the original
    lexical scope.
  
    ```hbs
    {{!-- post template --}}
    <p>{{props.title}}</p>
    {{yield}}
  
    {{!-- blog template --}}
    {{#post title="Hello world"}}
      <p>by {{byline}}</p>
      <article>This is my first post</article>
    {{/post}}
  
    {{#post title="Goodbye world"}}
      <p>by {{byline}}</p>
      <article>This is my last post</article>
    {{/post}}
    ```
  
    ```js
    helpers.post = function(params, hash, options) {
      options.template.yieldIn(postTemplate, { props: hash });
    };
  
    blog.render({ byline: "Yehuda Katz" });
    ```
  
    Produces:
  
    ```html
    <p>Hello world</p>
    <p>by Yehuda Katz</p>
    <article>This is my first post</article>
  
    <p>Goodbye world</p>
    <p>by Yehuda Katz</p>
    <article>This is my last post</article>
    ```
  
    In short, `yieldIn` creates a new top-level scope for the
    provided template and renders it, making the original block
    available to `{{yield}}` in that template.
  */

  function bindShadowScope(env /*, parentScope, shadowScope */) {
    return env.hooks.createFreshScope();
  }

  function createChildScope(parent) {
    var scope = (0, _htmlbarsUtilObjectUtils.createObject)(parent);
    scope.locals = (0, _htmlbarsUtilObjectUtils.createObject)(parent.locals);
    return scope;
  }

  /**
    Host Hook: bindSelf
  
    @param {Scope} scope
    @param {any} self
  
    Corresponds to entering a template.
  
    This hook is invoked when the `self` value for a scope is ready to be bound.
  
    The host must ensure that child scopes reflect the change to the `self` in
    future calls to the `get` hook.
  */

  function bindSelf(env, scope, self) {
    scope.self = self;
  }

  function updateSelf(env, scope, self) {
    env.hooks.bindSelf(env, scope, self);
  }

  /**
    Host Hook: bindLocal
  
    @param {Environment} env
    @param {Scope} scope
    @param {String} name
    @param {any} value
  
    Corresponds to entering a template with block arguments.
  
    This hook is invoked when a local variable for a scope has been provided.
  
    The host must ensure that child scopes reflect the change in future calls
    to the `get` hook.
  */

  function bindLocal(env, scope, name, value) {
    scope.localPresent[name] = true;
    scope.locals[name] = value;
  }

  function updateLocal(env, scope, name, value) {
    env.hooks.bindLocal(env, scope, name, value);
  }

  /**
    Host Hook: bindBlock
  
    @param {Environment} env
    @param {Scope} scope
    @param {Function} block
  
    Corresponds to entering a shadow template that was invoked by a block helper with
    `yieldIn`.
  
    This hook is invoked with an opaque block that will be passed along
    to the shadow template, and inserted into the shadow template when
    `{{yield}}` is used. Optionally provide a non-default block name
    that can be targeted by `{{yield to=blockName}}`.
  */

  function bindBlock(env, scope, block) {
    var name = arguments.length <= 3 || arguments[3] === undefined ? 'default' : arguments[3];

    scope.blocks[name] = block;
  }

  /**
    Host Hook: block
  
    @param {RenderNode} renderNode
    @param {Environment} env
    @param {Scope} scope
    @param {String} path
    @param {Array} params
    @param {Object} hash
    @param {Block} block
    @param {Block} elseBlock
  
    Corresponds to:
  
    ```hbs
    {{#helper param1 param2 key1=val1 key2=val2}}
      {{!-- child template --}}
    {{/helper}}
    ```
  
    This host hook is a workhorse of the system. It is invoked
    whenever a block is encountered, and is responsible for
    resolving the helper to call, and then invoke it.
  
    The helper should be invoked with:
  
    - `{Array} params`: the parameters passed to the helper
      in the template.
    - `{Object} hash`: an object containing the keys and values passed
      in the hash position in the template.
  
    The values in `params` and `hash` will already be resolved
    through a previous call to the `get` host hook.
  
    The helper should be invoked with a `this` value that is
    an object with one field:
  
    `{Function} yield`: when invoked, this function executes the
    block with the current scope. It takes an optional array of
    block parameters. If block parameters are supplied, HTMLBars
    will invoke the `bindLocal` host hook to bind the supplied
    values to the block arguments provided by the template.
  
    In general, the default implementation of `block` should work
    for most host environments. It delegates to other host hooks
    where appropriate, and properly invokes the helper with the
    appropriate arguments.
  */

  function block(morph, env, scope, path, params, hash, template, inverse, visitor) {
    if (handleRedirect(morph, env, scope, path, params, hash, template, inverse, visitor)) {
      return;
    }

    continueBlock(morph, env, scope, path, params, hash, template, inverse, visitor);
  }

  function continueBlock(morph, env, scope, path, params, hash, template, inverse, visitor) {
    hostBlock(morph, env, scope, template, inverse, null, visitor, function (options) {
      var helper = env.hooks.lookupHelper(env, scope, path);
      return env.hooks.invokeHelper(morph, env, scope, visitor, params, hash, helper, options.templates, thisFor(options.templates));
    });
  }

  function hostBlock(morph, env, scope, template, inverse, shadowOptions, visitor, callback) {
    var options = optionsFor(template, inverse, env, scope, morph, visitor);
    (0, _htmlbarsUtilTemplateUtils.renderAndCleanup)(morph, env, options, shadowOptions, callback);
  }

  function handleRedirect(morph, env, scope, path, params, hash, template, inverse, visitor) {
    if (!path) {
      return false;
    }

    var redirect = env.hooks.classify(env, scope, path);
    if (redirect) {
      switch (redirect) {
        case 'component':
          env.hooks.component(morph, env, scope, path, params, hash, { "default": template, inverse: inverse }, visitor);break;
        case 'inline':
          env.hooks.inline(morph, env, scope, path, params, hash, visitor);break;
        case 'block':
          env.hooks.block(morph, env, scope, path, params, hash, template, inverse, visitor);break;
        default:
          throw new Error("Internal HTMLBars redirection to " + redirect + " not supported");
      }
      return true;
    }

    if (handleKeyword(path, morph, env, scope, params, hash, template, inverse, visitor)) {
      return true;
    }

    return false;
  }

  function handleKeyword(path, morph, env, scope, params, hash, template, inverse, visitor) {
    var keyword = env.hooks.keywords[path];
    if (!keyword) {
      return false;
    }

    if (typeof keyword === 'function') {
      return keyword(morph, env, scope, params, hash, template, inverse, visitor);
    }

    if (keyword.willRender) {
      keyword.willRender(morph, env);
    }

    var lastState, newState;
    if (keyword.setupState) {
      lastState = (0, _htmlbarsUtilObjectUtils.shallowCopy)(morph.state);
      newState = morph.state = keyword.setupState(lastState, env, scope, params, hash);
    }

    if (keyword.childEnv) {
      // Build the child environment...
      env = keyword.childEnv(morph.state, env);

      // ..then save off the child env builder on the render node. If the render
      // node tree is re-rendered and this node is not dirty, the child env
      // builder will still be invoked so that child dirty render nodes still get
      // the correct child env.
      morph.buildChildEnv = keyword.childEnv;
    }

    var firstTime = !morph.rendered;

    if (keyword.isEmpty) {
      var isEmpty = keyword.isEmpty(morph.state, env, scope, params, hash);

      if (isEmpty) {
        if (!firstTime) {
          (0, _htmlbarsUtilTemplateUtils.clearMorph)(morph, env, false);
        }
        return true;
      }
    }

    if (firstTime) {
      if (keyword.render) {
        keyword.render(morph, env, scope, params, hash, template, inverse, visitor);
      }
      morph.rendered = true;
      return true;
    }

    var isStable;
    if (keyword.isStable) {
      isStable = keyword.isStable(lastState, newState);
    } else {
      isStable = stableState(lastState, newState);
    }

    if (isStable) {
      if (keyword.rerender) {
        var newEnv = keyword.rerender(morph, env, scope, params, hash, template, inverse, visitor);
        env = newEnv || env;
      }
      (0, _htmlbarsUtilMorphUtils.validateChildMorphs)(env, morph, visitor);
      return true;
    } else {
      (0, _htmlbarsUtilTemplateUtils.clearMorph)(morph, env, false);
    }

    // If the node is unstable, re-render from scratch
    if (keyword.render) {
      keyword.render(morph, env, scope, params, hash, template, inverse, visitor);
      morph.rendered = true;
      return true;
    }
  }

  function stableState(oldState, newState) {
    if ((0, _htmlbarsUtilObjectUtils.keyLength)(oldState) !== (0, _htmlbarsUtilObjectUtils.keyLength)(newState)) {
      return false;
    }

    for (var prop in oldState) {
      if (oldState[prop] !== newState[prop]) {
        return false;
      }
    }

    return true;
  }

  function linkRenderNode() /* morph, env, scope, params, hash */{
    return;
  }

  /**
    Host Hook: inline
  
    @param {RenderNode} renderNode
    @param {Environment} env
    @param {Scope} scope
    @param {String} path
    @param {Array} params
    @param {Hash} hash
  
    Corresponds to:
  
    ```hbs
    {{helper param1 param2 key1=val1 key2=val2}}
    ```
  
    This host hook is similar to the `block` host hook, but it
    invokes helpers that do not supply an attached block.
  
    Like the `block` hook, the helper should be invoked with:
  
    - `{Array} params`: the parameters passed to the helper
      in the template.
    - `{Object} hash`: an object containing the keys and values passed
      in the hash position in the template.
  
    The values in `params` and `hash` will already be resolved
    through a previous call to the `get` host hook.
  
    In general, the default implementation of `inline` should work
    for most host environments. It delegates to other host hooks
    where appropriate, and properly invokes the helper with the
    appropriate arguments.
  
    The default implementation of `inline` also makes `partial`
    a keyword. Instead of invoking a helper named `partial`,
    it invokes the `partial` host hook.
  */

  function inline(morph, env, scope, path, params, hash, visitor) {
    if (handleRedirect(morph, env, scope, path, params, hash, null, null, visitor)) {
      return;
    }

    var value = undefined,
        hasValue = undefined;
    if (morph.linkedResult) {
      value = env.hooks.getValue(morph.linkedResult);
      hasValue = true;
    } else {
      var options = optionsFor(null, null, env, scope, morph);

      var helper = env.hooks.lookupHelper(env, scope, path);
      var result = env.hooks.invokeHelper(morph, env, scope, visitor, params, hash, helper, options.templates, thisFor(options.templates));

      if (result && result.link) {
        morph.linkedResult = result.value;
        (0, _htmlbarsUtilMorphUtils.linkParams)(env, scope, morph, '@content-helper', [morph.linkedResult], null);
      }

      if (result && 'value' in result) {
        value = env.hooks.getValue(result.value);
        hasValue = true;
      }
    }

    if (hasValue) {
      if (morph.lastValue !== value) {
        morph.setContent(value);
      }
      morph.lastValue = value;
    }
  }

  function keyword(path, morph, env, scope, params, hash, template, inverse, visitor) {
    handleKeyword(path, morph, env, scope, params, hash, template, inverse, visitor);
  }

  function invokeHelper(morph, env, scope, visitor, _params, _hash, helper, templates, context) {
    var params = normalizeArray(env, _params);
    var hash = normalizeObject(env, _hash);
    return { value: helper.call(context, params, hash, templates) };
  }

  function normalizeArray(env, array) {
    var out = new Array(array.length);

    for (var i = 0, l = array.length; i < l; i++) {
      out[i] = env.hooks.getCellOrValue(array[i]);
    }

    return out;
  }

  function normalizeObject(env, object) {
    var out = {};

    for (var prop in object) {
      out[prop] = env.hooks.getCellOrValue(object[prop]);
    }

    return out;
  }

  function classify() /* env, scope, path */{
    return null;
  }

  var keywords = {
    partial: function partial(morph, env, scope, params) {
      var value = env.hooks.partial(morph, env, scope, params[0]);
      morph.setContent(value);
      return true;
    },

    "yield": function _yield(morph, env, scope, params, hash, template, inverse, visitor) {
      // the current scope is provided purely for the creation of shadow
      // scopes; it should not be provided to user code.

      var to = env.hooks.getValue(hash.to) || 'default';
      if (scope.blocks[to]) {
        scope.blocks[to](env, params, hash.self, morph, scope, visitor);
      }
      return true;
    },

    hasBlock: function hasBlock(morph, env, scope, params) {
      var name = env.hooks.getValue(params[0]) || 'default';
      return !!scope.blocks[name];
    },

    hasBlockParams: function hasBlockParams(morph, env, scope, params) {
      var name = env.hooks.getValue(params[0]) || 'default';
      return !!(scope.blocks[name] && scope.blocks[name].arity);
    }

  };

  /**
    Host Hook: partial
  
    @param {RenderNode} renderNode
    @param {Environment} env
    @param {Scope} scope
    @param {String} path
  
    Corresponds to:
  
    ```hbs
    {{partial "location"}}
    ```
  
    This host hook is invoked by the default implementation of
    the `inline` hook. This makes `partial` a keyword in an
    HTMLBars environment using the default `inline` host hook.
  
    It is implemented as a host hook so that it can retrieve
    the named partial out of the `Environment`. Helpers, in
    contrast, only have access to the values passed in to them,
    and not to the ambient lexical environment.
  
    The host hook should invoke the referenced partial with
    the ambient `self`.
  */
  exports.keywords = keywords;

  function partial(renderNode, env, scope, path) {
    var template = env.partials[path];
    return template.render(scope.self, env, {}).fragment;
  }

  /**
    Host hook: range
  
    @param {RenderNode} renderNode
    @param {Environment} env
    @param {Scope} scope
    @param {any} value
  
    Corresponds to:
  
    ```hbs
    {{content}}
    {{{unescaped}}}
    ```
  
    This hook is responsible for updating a render node
    that represents a range of content with a value.
  */

  function range(morph, env, scope, path, value, visitor) {
    if (handleRedirect(morph, env, scope, path, [value], {}, null, null, visitor)) {
      return;
    }

    value = env.hooks.getValue(value);

    if (morph.lastValue !== value) {
      morph.setContent(value);
    }

    morph.lastValue = value;
  }

  /**
    Host hook: element
  
    @param {RenderNode} renderNode
    @param {Environment} env
    @param {Scope} scope
    @param {String} path
    @param {Array} params
    @param {Hash} hash
  
    Corresponds to:
  
    ```hbs
    <div {{bind-attr foo=bar}}></div>
    ```
  
    This hook is responsible for invoking a helper that
    modifies an element.
  
    Its purpose is largely legacy support for awkward
    idioms that became common when using the string-based
    Handlebars engine.
  
    Most of the uses of the `element` hook are expected
    to be superseded by component syntax and the
    `attribute` hook.
  */

  function element(morph, env, scope, path, params, hash, visitor) {
    if (handleRedirect(morph, env, scope, path, params, hash, null, null, visitor)) {
      return;
    }

    var helper = env.hooks.lookupHelper(env, scope, path);
    if (helper) {
      env.hooks.invokeHelper(null, env, scope, null, params, hash, helper, { element: morph.element });
    }
  }

  /**
    Host hook: attribute
  
    @param {RenderNode} renderNode
    @param {Environment} env
    @param {String} name
    @param {any} value
  
    Corresponds to:
  
    ```hbs
    <div foo={{bar}}></div>
    ```
  
    This hook is responsible for updating a render node
    that represents an element's attribute with a value.
  
    It receives the name of the attribute as well as an
    already-resolved value, and should update the render
    node with the value if appropriate.
  */

  function attribute(morph, env, scope, name, value) {
    value = env.hooks.getValue(value);

    if (morph.lastValue !== value) {
      morph.setContent(value);
    }

    morph.lastValue = value;
  }

  function subexpr(env, scope, helperName, params, hash) {
    var helper = env.hooks.lookupHelper(env, scope, helperName);
    var result = env.hooks.invokeHelper(null, env, scope, null, params, hash, helper, {});
    if (result && 'value' in result) {
      return env.hooks.getValue(result.value);
    }
  }

  /**
    Host Hook: get
  
    @param {Environment} env
    @param {Scope} scope
    @param {String} path
  
    Corresponds to:
  
    ```hbs
    {{foo.bar}}
      ^
  
    {{helper foo.bar key=value}}
             ^           ^
    ```
  
    This hook is the "leaf" hook of the system. It is used to
    resolve a path relative to the current scope.
  */

  function get(env, scope, path) {
    if (path === '') {
      return scope.self;
    }

    var keys = path.split('.');
    var value = env.hooks.getRoot(scope, keys[0])[0];

    for (var i = 1; i < keys.length; i++) {
      if (value) {
        value = env.hooks.getChild(value, keys[i]);
      } else {
        break;
      }
    }

    return value;
  }

  function getRoot(scope, key) {
    if (scope.localPresent[key]) {
      return [scope.locals[key]];
    } else if (scope.self) {
      return [scope.self[key]];
    } else {
      return [undefined];
    }
  }

  function getChild(value, key) {
    return value[key];
  }

  function getValue(reference) {
    return reference;
  }

  function getCellOrValue(reference) {
    return reference;
  }

  function component(morph, env, scope, tagName, params, attrs, templates, visitor) {
    if (env.hooks.hasHelper(env, scope, tagName)) {
      return env.hooks.block(morph, env, scope, tagName, params, attrs, templates["default"], templates.inverse, visitor);
    }

    componentFallback(morph, env, scope, tagName, attrs, templates["default"]);
  }

  function concat(env, params) {
    var value = "";
    for (var i = 0, l = params.length; i < l; i++) {
      value += env.hooks.getValue(params[i]);
    }
    return value;
  }

  function componentFallback(morph, env, scope, tagName, attrs, template) {
    var element = env.dom.createElement(tagName);
    for (var name in attrs) {
      element.setAttribute(name, env.hooks.getValue(attrs[name]));
    }
    var fragment = (0, _render3["default"])(template, env, scope, {}).fragment;
    element.appendChild(fragment);
    morph.setNode(element);
  }

  function hasHelper(env, scope, helperName) {
    return env.helpers[helperName] !== undefined;
  }

  function lookupHelper(env, scope, helperName) {
    return env.helpers[helperName];
  }

  function bindScope() /* env, scope */{
    // this function is used to handle host-specified extensions to scope
    // other than `self`, `locals` and `block`.
  }

  function updateScope(env, scope) {
    env.hooks.bindScope(env, scope);
  }

  exports["default"] = {
    // fundamental hooks that you will likely want to override
    bindLocal: bindLocal,
    bindSelf: bindSelf,
    bindScope: bindScope,
    classify: classify,
    component: component,
    concat: concat,
    createFreshScope: createFreshScope,
    getChild: getChild,
    getRoot: getRoot,
    getValue: getValue,
    getCellOrValue: getCellOrValue,
    keywords: keywords,
    linkRenderNode: linkRenderNode,
    partial: partial,
    subexpr: subexpr,

    // fundamental hooks with good default behavior
    bindBlock: bindBlock,
    bindShadowScope: bindShadowScope,
    updateLocal: updateLocal,
    updateSelf: updateSelf,
    updateScope: updateScope,
    createChildScope: createChildScope,
    hasHelper: hasHelper,
    lookupHelper: lookupHelper,
    invokeHelper: invokeHelper,
    cleanupRenderNode: null,
    destroyRenderNode: null,
    willCleanupTree: null,
    didCleanupTree: null,
    willRenderNode: null,
    didRenderNode: null,

    // derived hooks
    attribute: attribute,
    block: block,
    createScope: createScope,
    element: element,
    get: get,
    inline: inline,
    range: range,
    keyword: keyword
  };
});
define("htmlbars-runtime/morph", ["exports", "module", "../morph-range", "../htmlbars-util/object-utils"], function (exports, module, _morphRange, _htmlbarsUtilObjectUtils) {
  "use strict";

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _MorphBase = _interopRequireDefault(_morphRange);

  var guid = 1;

  function HTMLBarsMorph(domHelper, contextualElement) {
    this.super$constructor(domHelper, contextualElement);

    this.state = {};
    this.ownerNode = null;
    this.isDirty = false;
    this.isSubtreeDirty = false;
    this.lastYielded = null;
    this.lastResult = null;
    this.lastValue = null;
    this.buildChildEnv = null;
    this.morphList = null;
    this.morphMap = null;
    this.key = null;
    this.linkedParams = null;
    this.linkedResult = null;
    this.childNodes = null;
    this.rendered = false;
    this.guid = "range" + guid++;
  }

  HTMLBarsMorph.empty = function (domHelper, contextualElement) {
    var morph = new HTMLBarsMorph(domHelper, contextualElement);
    morph.clear();
    return morph;
  };

  HTMLBarsMorph.create = function (domHelper, contextualElement, node) {
    var morph = new HTMLBarsMorph(domHelper, contextualElement);
    morph.setNode(node);
    return morph;
  };

  HTMLBarsMorph.attach = function (domHelper, contextualElement, firstNode, lastNode) {
    var morph = new HTMLBarsMorph(domHelper, contextualElement);
    morph.setRange(firstNode, lastNode);
    return morph;
  };

  var prototype = HTMLBarsMorph.prototype = (0, _htmlbarsUtilObjectUtils.createObject)(_MorphBase["default"].prototype);
  prototype.constructor = HTMLBarsMorph;
  prototype.super$constructor = _MorphBase["default"];

  module.exports = HTMLBarsMorph;
});
define("htmlbars-runtime/render", ["exports", "../htmlbars-util/array-utils", "../htmlbars-util/morph-utils", "./expression-visitor", "./morph", "../htmlbars-util/template-utils", "../htmlbars-util/void-tag-names"], function (exports, _htmlbarsUtilArrayUtils, _htmlbarsUtilMorphUtils, _expressionVisitor, _morph, _htmlbarsUtilTemplateUtils, _htmlbarsUtilVoidTagNames) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = render;
  exports.manualElement = manualElement;
  exports.attachAttributes = attachAttributes;
  exports.createChildMorph = createChildMorph;
  exports.getCachedFragment = getCachedFragment;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _ExpressionVisitor = _interopRequireDefault(_expressionVisitor);

  var _Morph = _interopRequireDefault(_morph);

  var _voidMap = _interopRequireDefault(_htmlbarsUtilVoidTagNames);

  var svgNamespace = "http://www.w3.org/2000/svg";

  function render(template, env, scope, options) {
    var dom = env.dom;
    var contextualElement;

    if (options) {
      if (options.renderNode) {
        contextualElement = options.renderNode.contextualElement;
      } else if (options.contextualElement) {
        contextualElement = options.contextualElement;
      }
    }

    dom.detectNamespace(contextualElement);

    var renderResult = RenderResult.build(env, scope, template, options, contextualElement);
    renderResult.render();

    return renderResult;
  }

  function RenderResult(env, scope, options, rootNode, ownerNode, nodes, fragment, template, shouldSetContent) {
    this.root = rootNode;
    this.fragment = fragment;

    this.nodes = nodes;
    this.template = template;
    this.statements = template.statements.slice();
    this.env = env;
    this.scope = scope;
    this.shouldSetContent = shouldSetContent;

    this.bindScope();

    if (options.attributes !== undefined) {
      nodes.push({ state: {} });
      this.statements.push(['attributes', attachAttributes(options.attributes)]);
    }

    if (options.self !== undefined) {
      this.bindSelf(options.self);
    }
    if (options.blockArguments !== undefined) {
      this.bindLocals(options.blockArguments);
    }

    this.initializeNodes(ownerNode);
  }

  RenderResult.build = function (env, scope, template, options, contextualElement) {
    var dom = env.dom;
    var fragment = getCachedFragment(template, env);
    var nodes = template.buildRenderNodes(dom, fragment, contextualElement);

    var rootNode, ownerNode, shouldSetContent;

    if (options && options.renderNode) {
      rootNode = options.renderNode;
      ownerNode = rootNode.ownerNode;
      shouldSetContent = true;
    } else {
      rootNode = dom.createMorph(null, fragment.firstChild, fragment.lastChild, contextualElement);
      ownerNode = rootNode;
      initializeNode(rootNode, ownerNode);
      shouldSetContent = false;
    }

    if (rootNode.childNodes) {
      (0, _htmlbarsUtilMorphUtils.visitChildren)(rootNode.childNodes, function (node) {
        (0, _htmlbarsUtilTemplateUtils.clearMorph)(node, env, true);
      });
    }

    rootNode.childNodes = nodes;
    return new RenderResult(env, scope, options, rootNode, ownerNode, nodes, fragment, template, shouldSetContent);
  };

  function manualElement(tagName, attributes) {
    var statements = [];

    for (var key in attributes) {
      if (typeof attributes[key] === 'string') {
        continue;
      }
      statements.push(["attribute", key, attributes[key]]);
    }

    statements.push(['content', 'yield']);

    var template = {
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        if (tagName === 'svg') {
          dom.setNamespace(svgNamespace);
        }
        var el1 = dom.createElement(tagName);

        for (var key in attributes) {
          if (typeof attributes[key] !== 'string') {
            continue;
          }
          dom.setAttribute(el1, key, attributes[key]);
        }

        if (!_voidMap["default"][tagName]) {
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
        }

        dom.appendChild(el0, el1);

        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment) {
        var element = dom.childAt(fragment, [0]);
        var morphs = [];

        for (var key in attributes) {
          if (typeof attributes[key] === 'string') {
            continue;
          }
          morphs.push(dom.createAttrMorph(element, key));
        }

        morphs.push(dom.createMorphAt(element, 0, 0));
        return morphs;
      },
      statements: statements,
      locals: [],
      templates: []
    };

    return template;
  }

  function attachAttributes(attributes) {
    var statements = [];

    for (var key in attributes) {
      if (typeof attributes[key] === 'string') {
        continue;
      }
      statements.push(["attribute", key, attributes[key]]);
    }

    var template = {
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = this.element;
        if (el0.namespaceURI === "http://www.w3.org/2000/svg") {
          dom.setNamespace(svgNamespace);
        }
        for (var key in attributes) {
          if (typeof attributes[key] !== 'string') {
            continue;
          }
          dom.setAttribute(el0, key, attributes[key]);
        }

        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom) {
        var element = this.element;
        var morphs = [];

        for (var key in attributes) {
          if (typeof attributes[key] === 'string') {
            continue;
          }
          morphs.push(dom.createAttrMorph(element, key));
        }

        return morphs;
      },
      statements: statements,
      locals: [],
      templates: [],
      element: null
    };

    return template;
  }

  RenderResult.prototype.initializeNodes = function (ownerNode) {
    (0, _htmlbarsUtilArrayUtils.forEach)(this.root.childNodes, function (node) {
      initializeNode(node, ownerNode);
    });
  };

  RenderResult.prototype.render = function () {
    this.root.lastResult = this;
    this.root.rendered = true;
    this.populateNodes(_expressionVisitor.AlwaysDirtyVisitor);

    if (this.shouldSetContent && this.root.setContent) {
      this.root.setContent(this.fragment);
    }
  };

  RenderResult.prototype.dirty = function () {
    (0, _htmlbarsUtilMorphUtils.visitChildren)([this.root], function (node) {
      node.isDirty = true;
    });
  };

  RenderResult.prototype.revalidate = function (env, self, blockArguments, scope) {
    this.revalidateWith(env, scope, self, blockArguments, _ExpressionVisitor["default"]);
  };

  RenderResult.prototype.rerender = function (env, self, blockArguments, scope) {
    this.revalidateWith(env, scope, self, blockArguments, _expressionVisitor.AlwaysDirtyVisitor);
  };

  RenderResult.prototype.revalidateWith = function (env, scope, self, blockArguments, visitor) {
    if (env !== undefined) {
      this.env = env;
    }
    if (scope !== undefined) {
      this.scope = scope;
    }
    this.updateScope();

    if (self !== undefined) {
      this.updateSelf(self);
    }
    if (blockArguments !== undefined) {
      this.updateLocals(blockArguments);
    }

    this.populateNodes(visitor);
  };

  RenderResult.prototype.destroy = function () {
    var rootNode = this.root;
    (0, _htmlbarsUtilTemplateUtils.clearMorph)(rootNode, this.env, true);
  };

  RenderResult.prototype.populateNodes = function (visitor) {
    var env = this.env;
    var scope = this.scope;
    var template = this.template;
    var nodes = this.nodes;
    var statements = this.statements;
    var i, l;

    for (i = 0, l = statements.length; i < l; i++) {
      var statement = statements[i];
      var morph = nodes[i];

      if (env.hooks.willRenderNode) {
        env.hooks.willRenderNode(morph, env, scope);
      }

      switch (statement[0]) {
        case 'block':
          visitor.block(statement, morph, env, scope, template, visitor);break;
        case 'inline':
          visitor.inline(statement, morph, env, scope, visitor);break;
        case 'content':
          visitor.content(statement, morph, env, scope, visitor);break;
        case 'element':
          visitor.element(statement, morph, env, scope, template, visitor);break;
        case 'attribute':
          visitor.attribute(statement, morph, env, scope);break;
        case 'component':
          visitor.component(statement, morph, env, scope, template, visitor);break;
        case 'attributes':
          visitor.attributes(statement, morph, env, scope, this.fragment, visitor);break;
      }

      if (env.hooks.didRenderNode) {
        env.hooks.didRenderNode(morph, env, scope);
      }
    }
  };

  RenderResult.prototype.bindScope = function () {
    this.env.hooks.bindScope(this.env, this.scope);
  };

  RenderResult.prototype.updateScope = function () {
    this.env.hooks.updateScope(this.env, this.scope);
  };

  RenderResult.prototype.bindSelf = function (self) {
    this.env.hooks.bindSelf(this.env, this.scope, self);
  };

  RenderResult.prototype.updateSelf = function (self) {
    this.env.hooks.updateSelf(this.env, this.scope, self);
  };

  RenderResult.prototype.bindLocals = function (blockArguments) {
    var localNames = this.template.locals;

    for (var i = 0, l = localNames.length; i < l; i++) {
      this.env.hooks.bindLocal(this.env, this.scope, localNames[i], blockArguments[i]);
    }
  };

  RenderResult.prototype.updateLocals = function (blockArguments) {
    var localNames = this.template.locals;

    for (var i = 0, l = localNames.length; i < l; i++) {
      this.env.hooks.updateLocal(this.env, this.scope, localNames[i], blockArguments[i]);
    }
  };

  function initializeNode(node, owner) {
    node.ownerNode = owner;
  }

  function createChildMorph(dom, parentMorph, contextualElement) {
    var morph = _Morph["default"].empty(dom, contextualElement || parentMorph.contextualElement);
    initializeNode(morph, parentMorph.ownerNode);
    return morph;
  }

  function getCachedFragment(template, env) {
    var dom = env.dom,
        fragment;
    if (env.useFragmentCache && dom.canClone) {
      if (template.cachedFragment === null) {
        fragment = template.buildFragment(dom);
        if (template.hasRendered) {
          template.cachedFragment = fragment;
        } else {
          template.hasRendered = true;
        }
      }
      if (template.cachedFragment) {
        fragment = dom.cloneNode(template.cachedFragment, true);
      }
    } else if (!fragment) {
      fragment = template.buildFragment(dom);
    }

    return fragment;
  }
});
define("htmlbars-syntax", ["exports", "./htmlbars-syntax/walker", "./htmlbars-syntax/builders", "./htmlbars-syntax/parser"], function (exports, _htmlbarsSyntaxWalker, _htmlbarsSyntaxBuilders, _htmlbarsSyntaxParser) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _Walker = _interopRequireDefault(_htmlbarsSyntaxWalker);

  var _builders = _interopRequireDefault(_htmlbarsSyntaxBuilders);

  var _parse = _interopRequireDefault(_htmlbarsSyntaxParser);

  exports.Walker = _Walker["default"];
  exports.builders = _builders["default"];
  exports.parse = _parse["default"];
});
define("htmlbars-syntax/builders", ["exports"], function (exports) {
  // Statements

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.buildMustache = buildMustache;
  exports.buildBlock = buildBlock;
  exports.buildElementModifier = buildElementModifier;
  exports.buildPartial = buildPartial;
  exports.buildComment = buildComment;
  exports.buildConcat = buildConcat;
  exports.buildElement = buildElement;
  exports.buildComponent = buildComponent;
  exports.buildAttr = buildAttr;
  exports.buildText = buildText;
  exports.buildSexpr = buildSexpr;
  exports.buildPath = buildPath;
  exports.buildString = buildString;
  exports.buildBoolean = buildBoolean;
  exports.buildNumber = buildNumber;
  exports.buildNull = buildNull;
  exports.buildUndefined = buildUndefined;
  exports.buildHash = buildHash;
  exports.buildPair = buildPair;
  exports.buildProgram = buildProgram;

  function buildMustache(path, params, hash, raw, loc) {
    return {
      type: "MustacheStatement",
      path: path,
      params: params || [],
      hash: hash || buildHash([]),
      escaped: !raw,
      loc: buildLoc(loc)
    };
  }

  function buildBlock(path, params, hash, program, inverse, loc) {
    return {
      type: "BlockStatement",
      path: path,
      params: params || [],
      hash: hash || buildHash([]),
      program: program || null,
      inverse: inverse || null,
      loc: buildLoc(loc)
    };
  }

  function buildElementModifier(path, params, hash, loc) {
    return {
      type: "ElementModifierStatement",
      path: path,
      params: params || [],
      hash: hash || buildHash([]),
      loc: buildLoc(loc)
    };
  }

  function buildPartial(name, params, hash, indent) {
    return {
      type: "PartialStatement",
      name: name,
      params: params || [],
      hash: hash || buildHash([]),
      indent: indent
    };
  }

  function buildComment(value) {
    return {
      type: "CommentStatement",
      value: value
    };
  }

  function buildConcat(parts) {
    return {
      type: "ConcatStatement",
      parts: parts || []
    };
  }

  // Nodes

  function buildElement(tag, attributes, modifiers, children) {
    return {
      type: "ElementNode",
      tag: tag,
      attributes: attributes || [],
      modifiers: modifiers || [],
      children: children || []
    };
  }

  function buildComponent(tag, attributes, program, loc) {
    return {
      type: "ComponentNode",
      tag: tag,
      attributes: attributes,
      program: program,
      loc: buildLoc(loc)
    };
  }

  function buildAttr(name, value) {
    return {
      type: "AttrNode",
      name: name,
      value: value
    };
  }

  function buildText(chars) {
    return {
      type: "TextNode",
      chars: chars
    };
  }

  // Expressions

  function buildSexpr(path, params, hash) {
    return {
      type: "SubExpression",
      path: path,
      params: params || [],
      hash: hash || buildHash([])
    };
  }

  function buildPath(original) {
    return {
      type: "PathExpression",
      original: original,
      parts: original.split('.')
    };
  }

  function buildString(value) {
    return {
      type: "StringLiteral",
      value: value,
      original: value
    };
  }

  function buildBoolean(value) {
    return {
      type: "BooleanLiteral",
      value: value,
      original: value
    };
  }

  function buildNumber(value) {
    return {
      type: "NumberLiteral",
      value: value,
      original: value
    };
  }

  function buildNull() {
    return {
      type: "NullLiteral",
      value: null,
      original: null
    };
  }

  function buildUndefined() {
    return {
      type: "UndefinedLiteral",
      value: undefined,
      original: undefined
    };
  }

  // Miscellaneous

  function buildHash(pairs) {
    return {
      type: "Hash",
      pairs: pairs || []
    };
  }

  function buildPair(key, value) {
    return {
      type: "HashPair",
      key: key,
      value: value
    };
  }

  function buildProgram(body, blockParams, loc) {
    return {
      type: "Program",
      body: body || [],
      blockParams: blockParams || [],
      loc: buildLoc(loc)
    };
  }

  function buildPosition(line, column) {
    return {
      line: line,
      column: column
    };
  }

  function buildLoc(loc) {
    if (loc) {
      return {
        source: loc.source || null,
        start: buildPosition(loc.start.line, loc.start.column),
        end: buildPosition(loc.end.line, loc.end.column)
      };
    } else {
      return null;
    }
  }

  exports["default"] = {
    mustache: buildMustache,
    block: buildBlock,
    partial: buildPartial,
    comment: buildComment,
    element: buildElement,
    elementModifier: buildElementModifier,
    component: buildComponent,
    attr: buildAttr,
    text: buildText,
    sexpr: buildSexpr,
    path: buildPath,
    string: buildString,
    boolean: buildBoolean,
    number: buildNumber,
    undefined: buildUndefined,
    "null": buildNull,
    concat: buildConcat,
    hash: buildHash,
    pair: buildPair,
    program: buildProgram,
    loc: buildLoc,
    pos: buildPosition
  };
});
define('htmlbars-syntax/handlebars/compiler/ast', ['exports', 'module'], function (exports, module) {
  'use strict';

  var AST = {
    Program: function Program(statements, blockParams, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'Program';
      this.body = statements;

      this.blockParams = blockParams;
      this.strip = strip;
    },

    MustacheStatement: function MustacheStatement(path, params, hash, escaped, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'MustacheStatement';

      this.path = path;
      this.params = params || [];
      this.hash = hash;
      this.escaped = escaped;

      this.strip = strip;
    },

    BlockStatement: function BlockStatement(path, params, hash, program, inverse, openStrip, inverseStrip, closeStrip, locInfo) {
      this.loc = locInfo;
      this.type = 'BlockStatement';

      this.path = path;
      this.params = params || [];
      this.hash = hash;
      this.program = program;
      this.inverse = inverse;

      this.openStrip = openStrip;
      this.inverseStrip = inverseStrip;
      this.closeStrip = closeStrip;
    },

    PartialStatement: function PartialStatement(name, params, hash, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'PartialStatement';

      this.name = name;
      this.params = params || [];
      this.hash = hash;

      this.indent = '';
      this.strip = strip;
    },

    ContentStatement: function ContentStatement(string, locInfo) {
      this.loc = locInfo;
      this.type = 'ContentStatement';
      this.original = this.value = string;
    },

    CommentStatement: function CommentStatement(comment, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'CommentStatement';
      this.value = comment;

      this.strip = strip;
    },

    SubExpression: function SubExpression(path, params, hash, locInfo) {
      this.loc = locInfo;

      this.type = 'SubExpression';
      this.path = path;
      this.params = params || [];
      this.hash = hash;
    },

    PathExpression: function PathExpression(data, depth, parts, original, locInfo) {
      this.loc = locInfo;
      this.type = 'PathExpression';

      this.data = data;
      this.original = original;
      this.parts = parts;
      this.depth = depth;
    },

    StringLiteral: function StringLiteral(string, locInfo) {
      this.loc = locInfo;
      this.type = 'StringLiteral';
      this.original = this.value = string;
    },

    NumberLiteral: function NumberLiteral(number, locInfo) {
      this.loc = locInfo;
      this.type = 'NumberLiteral';
      this.original = this.value = Number(number);
    },

    BooleanLiteral: function BooleanLiteral(bool, locInfo) {
      this.loc = locInfo;
      this.type = 'BooleanLiteral';
      this.original = this.value = bool === 'true';
    },

    UndefinedLiteral: function UndefinedLiteral(locInfo) {
      this.loc = locInfo;
      this.type = 'UndefinedLiteral';
      this.original = this.value = undefined;
    },

    NullLiteral: function NullLiteral(locInfo) {
      this.loc = locInfo;
      this.type = 'NullLiteral';
      this.original = this.value = null;
    },

    Hash: function Hash(pairs, locInfo) {
      this.loc = locInfo;
      this.type = 'Hash';
      this.pairs = pairs;
    },
    HashPair: function HashPair(key, value, locInfo) {
      this.loc = locInfo;
      this.type = 'HashPair';
      this.key = key;
      this.value = value;
    },

    // Public API used to evaluate derived attributes regarding AST nodes
    helpers: {
      // a mustache is definitely a helper if:
      // * it is an eligible helper, and
      // * it has at least one parameter or hash segment
      helperExpression: function helperExpression(node) {
        return !!(node.type === 'SubExpression' || node.params.length || node.hash);
      },

      scopedId: function scopedId(path) {
        return /^\.|this\b/.test(path.original);
      },

      // an ID is simple if it only has one part, and that part is not
      // `..` or `this`.
      simpleId: function simpleId(path) {
        return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
      }
    }
  };

  // Must be exported as an object rather than the root of the module as the jison lexer
  // must modify the object to operate properly.
  module.exports = AST;
});
define('htmlbars-syntax/handlebars/compiler/base', ['exports', './parser', './ast', './whitespace-control', './helpers', '../utils'], function (exports, _parser, _ast, _whitespaceControl, _helpers, _utils) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.parse = parse;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _parser2 = _interopRequireDefault(_parser);

  var _AST = _interopRequireDefault(_ast);

  var _WhitespaceControl = _interopRequireDefault(_whitespaceControl);

  exports.parser = _parser2['default'];

  var yy = {};
  (0, _utils.extend)(yy, _helpers, _AST['default']);

  function parse(input, options) {
    // Just return if an already-compiled AST was passed in.
    if (input.type === 'Program') {
      return input;
    }

    _parser2['default'].yy = yy;

    // Altering the shared object here, but this is ok as parser is a sync operation
    yy.locInfo = function (locInfo) {
      return new yy.SourceLocation(options && options.srcName, locInfo);
    };

    var strip = new _WhitespaceControl['default']();
    return strip.accept(_parser2['default'].parse(input));
  }
});
define('htmlbars-syntax/handlebars/compiler/helpers', ['exports', '../exception'], function (exports, _exception) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.SourceLocation = SourceLocation;
  exports.id = id;
  exports.stripFlags = stripFlags;
  exports.stripComment = stripComment;
  exports.preparePath = preparePath;
  exports.prepareMustache = prepareMustache;
  exports.prepareRawBlock = prepareRawBlock;
  exports.prepareBlock = prepareBlock;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Exception = _interopRequireDefault(_exception);

  function SourceLocation(source, locInfo) {
    this.source = source;
    this.start = {
      line: locInfo.first_line,
      column: locInfo.first_column
    };
    this.end = {
      line: locInfo.last_line,
      column: locInfo.last_column
    };
  }

  function id(token) {
    if (/^\[.*\]$/.test(token)) {
      return token.substr(1, token.length - 2);
    } else {
      return token;
    }
  }

  function stripFlags(open, close) {
    return {
      open: open.charAt(2) === '~',
      close: close.charAt(close.length - 3) === '~'
    };
  }

  function stripComment(comment) {
    return comment.replace(/^\{\{~?\!-?-?/, '').replace(/-?-?~?\}\}$/, '');
  }

  function preparePath(data, parts, locInfo) {
    locInfo = this.locInfo(locInfo);

    var original = data ? '@' : '',
        dig = [],
        depth = 0,
        depthString = '';

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i].part,

      // If we have [] syntax then we do not treat path references as operators,
      // i.e. foo.[this] resolves to approximately context.foo['this']
      isLiteral = parts[i].original !== part;
      original += (parts[i].separator || '') + part;

      if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
        if (dig.length > 0) {
          throw new _Exception['default']('Invalid path: ' + original, { loc: locInfo });
        } else if (part === '..') {
          depth++;
          depthString += '../';
        }
      } else {
        dig.push(part);
      }
    }

    return new this.PathExpression(data, depth, dig, original, locInfo);
  }

  function prepareMustache(path, params, hash, open, strip, locInfo) {
    // Must use charAt to support IE pre-10
    var escapeFlag = open.charAt(3) || open.charAt(2),
        escaped = escapeFlag !== '{' && escapeFlag !== '&';

    return new this.MustacheStatement(path, params, hash, escaped, strip, this.locInfo(locInfo));
  }

  function prepareRawBlock(openRawBlock, content, close, locInfo) {
    if (openRawBlock.path.original !== close) {
      var errorNode = { loc: openRawBlock.path.loc };

      throw new _Exception['default'](openRawBlock.path.original + " doesn't match " + close, errorNode);
    }

    locInfo = this.locInfo(locInfo);
    var program = new this.Program([content], null, {}, locInfo);

    return new this.BlockStatement(openRawBlock.path, openRawBlock.params, openRawBlock.hash, program, undefined, {}, {}, {}, locInfo);
  }

  function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
    // When we are chaining inverse calls, we will not have a close path
    if (close && close.path && openBlock.path.original !== close.path.original) {
      var errorNode = { loc: openBlock.path.loc };

      throw new _Exception['default'](openBlock.path.original + ' doesn\'t match ' + close.path.original, errorNode);
    }

    program.blockParams = openBlock.blockParams;

    var inverse = undefined,
        inverseStrip = undefined;

    if (inverseAndProgram) {
      if (inverseAndProgram.chain) {
        inverseAndProgram.program.body[0].closeStrip = close.strip;
      }

      inverseStrip = inverseAndProgram.strip;
      inverse = inverseAndProgram.program;
    }

    if (inverted) {
      inverted = inverse;
      inverse = program;
      program = inverted;
    }

    return new this.BlockStatement(openBlock.path, openBlock.params, openBlock.hash, program, inverse, openBlock.strip, inverseStrip, close && close.strip, this.locInfo(locInfo));
  }
});
define("htmlbars-syntax/handlebars/compiler/parser", ["exports", "module"], function (exports, module) {
    /* istanbul ignore next */
    /* Jison generated parser */
    "use strict";

    var handlebars = (function () {
        var parser = { trace: function trace() {},
            yy: {},
            symbols_: { "error": 2, "root": 3, "program": 4, "EOF": 5, "program_repetition0": 6, "statement": 7, "mustache": 8, "block": 9, "rawBlock": 10, "partial": 11, "content": 12, "COMMENT": 13, "CONTENT": 14, "openRawBlock": 15, "END_RAW_BLOCK": 16, "OPEN_RAW_BLOCK": 17, "helperName": 18, "openRawBlock_repetition0": 19, "openRawBlock_option0": 20, "CLOSE_RAW_BLOCK": 21, "openBlock": 22, "block_option0": 23, "closeBlock": 24, "openInverse": 25, "block_option1": 26, "OPEN_BLOCK": 27, "openBlock_repetition0": 28, "openBlock_option0": 29, "openBlock_option1": 30, "CLOSE": 31, "OPEN_INVERSE": 32, "openInverse_repetition0": 33, "openInverse_option0": 34, "openInverse_option1": 35, "openInverseChain": 36, "OPEN_INVERSE_CHAIN": 37, "openInverseChain_repetition0": 38, "openInverseChain_option0": 39, "openInverseChain_option1": 40, "inverseAndProgram": 41, "INVERSE": 42, "inverseChain": 43, "inverseChain_option0": 44, "OPEN_ENDBLOCK": 45, "OPEN": 46, "mustache_repetition0": 47, "mustache_option0": 48, "OPEN_UNESCAPED": 49, "mustache_repetition1": 50, "mustache_option1": 51, "CLOSE_UNESCAPED": 52, "OPEN_PARTIAL": 53, "partialName": 54, "partial_repetition0": 55, "partial_option0": 56, "param": 57, "sexpr": 58, "OPEN_SEXPR": 59, "sexpr_repetition0": 60, "sexpr_option0": 61, "CLOSE_SEXPR": 62, "hash": 63, "hash_repetition_plus0": 64, "hashSegment": 65, "ID": 66, "EQUALS": 67, "blockParams": 68, "OPEN_BLOCK_PARAMS": 69, "blockParams_repetition_plus0": 70, "CLOSE_BLOCK_PARAMS": 71, "path": 72, "dataName": 73, "STRING": 74, "NUMBER": 75, "BOOLEAN": 76, "UNDEFINED": 77, "NULL": 78, "DATA": 79, "pathSegments": 80, "SEP": 81, "$accept": 0, "$end": 1 },
            terminals_: { 2: "error", 5: "EOF", 13: "COMMENT", 14: "CONTENT", 16: "END_RAW_BLOCK", 17: "OPEN_RAW_BLOCK", 21: "CLOSE_RAW_BLOCK", 27: "OPEN_BLOCK", 31: "CLOSE", 32: "OPEN_INVERSE", 37: "OPEN_INVERSE_CHAIN", 42: "INVERSE", 45: "OPEN_ENDBLOCK", 46: "OPEN", 49: "OPEN_UNESCAPED", 52: "CLOSE_UNESCAPED", 53: "OPEN_PARTIAL", 59: "OPEN_SEXPR", 62: "CLOSE_SEXPR", 66: "ID", 67: "EQUALS", 69: "OPEN_BLOCK_PARAMS", 71: "CLOSE_BLOCK_PARAMS", 74: "STRING", 75: "NUMBER", 76: "BOOLEAN", 77: "UNDEFINED", 78: "NULL", 79: "DATA", 81: "SEP" },
            productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [12, 1], [10, 3], [15, 5], [9, 4], [9, 4], [22, 6], [25, 6], [36, 6], [41, 2], [43, 3], [43, 1], [24, 3], [8, 5], [8, 5], [11, 5], [57, 1], [57, 1], [58, 5], [63, 1], [65, 3], [68, 3], [18, 1], [18, 1], [18, 1], [18, 1], [18, 1], [18, 1], [18, 1], [54, 1], [54, 1], [73, 2], [72, 1], [80, 3], [80, 1], [6, 0], [6, 2], [19, 0], [19, 2], [20, 0], [20, 1], [23, 0], [23, 1], [26, 0], [26, 1], [28, 0], [28, 2], [29, 0], [29, 1], [30, 0], [30, 1], [33, 0], [33, 2], [34, 0], [34, 1], [35, 0], [35, 1], [38, 0], [38, 2], [39, 0], [39, 1], [40, 0], [40, 1], [44, 0], [44, 1], [47, 0], [47, 2], [48, 0], [48, 1], [50, 0], [50, 2], [51, 0], [51, 1], [55, 0], [55, 2], [56, 0], [56, 1], [60, 0], [60, 2], [61, 0], [61, 1], [64, 1], [64, 2], [70, 1], [70, 2]],
            performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {

                var $0 = $$.length - 1;
                switch (yystate) {
                    case 1:
                        return $$[$0 - 1];
                        break;
                    case 2:
                        this.$ = new yy.Program($$[$0], null, {}, yy.locInfo(this._$));
                        break;
                    case 3:
                        this.$ = $$[$0];
                        break;
                    case 4:
                        this.$ = $$[$0];
                        break;
                    case 5:
                        this.$ = $$[$0];
                        break;
                    case 6:
                        this.$ = $$[$0];
                        break;
                    case 7:
                        this.$ = $$[$0];
                        break;
                    case 8:
                        this.$ = new yy.CommentStatement(yy.stripComment($$[$0]), yy.stripFlags($$[$0], $$[$0]), yy.locInfo(this._$));
                        break;
                    case 9:
                        this.$ = new yy.ContentStatement($$[$0], yy.locInfo(this._$));
                        break;
                    case 10:
                        this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
                        break;
                    case 11:
                        this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1] };
                        break;
                    case 12:
                        this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
                        break;
                    case 13:
                        this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
                        break;
                    case 14:
                        this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
                        break;
                    case 15:
                        this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
                        break;
                    case 16:
                        this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
                        break;
                    case 17:
                        this.$ = { strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]), program: $$[$0] };
                        break;
                    case 18:
                        var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$),
                            program = new yy.Program([inverse], null, {}, yy.locInfo(this._$));
                        program.chained = true;

                        this.$ = { strip: $$[$0 - 2].strip, program: program, chain: true };

                        break;
                    case 19:
                        this.$ = $$[$0];
                        break;
                    case 20:
                        this.$ = { path: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 2], $$[$0]) };
                        break;
                    case 21:
                        this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
                        break;
                    case 22:
                        this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
                        break;
                    case 23:
                        this.$ = new yy.PartialStatement($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], yy.stripFlags($$[$0 - 4], $$[$0]), yy.locInfo(this._$));
                        break;
                    case 24:
                        this.$ = $$[$0];
                        break;
                    case 25:
                        this.$ = $$[$0];
                        break;
                    case 26:
                        this.$ = new yy.SubExpression($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], yy.locInfo(this._$));
                        break;
                    case 27:
                        this.$ = new yy.Hash($$[$0], yy.locInfo(this._$));
                        break;
                    case 28:
                        this.$ = new yy.HashPair(yy.id($$[$0 - 2]), $$[$0], yy.locInfo(this._$));
                        break;
                    case 29:
                        this.$ = yy.id($$[$0 - 1]);
                        break;
                    case 30:
                        this.$ = $$[$0];
                        break;
                    case 31:
                        this.$ = $$[$0];
                        break;
                    case 32:
                        this.$ = new yy.StringLiteral($$[$0], yy.locInfo(this._$));
                        break;
                    case 33:
                        this.$ = new yy.NumberLiteral($$[$0], yy.locInfo(this._$));
                        break;
                    case 34:
                        this.$ = new yy.BooleanLiteral($$[$0], yy.locInfo(this._$));
                        break;
                    case 35:
                        this.$ = new yy.UndefinedLiteral(yy.locInfo(this._$));
                        break;
                    case 36:
                        this.$ = new yy.NullLiteral(yy.locInfo(this._$));
                        break;
                    case 37:
                        this.$ = $$[$0];
                        break;
                    case 38:
                        this.$ = $$[$0];
                        break;
                    case 39:
                        this.$ = yy.preparePath(true, $$[$0], this._$);
                        break;
                    case 40:
                        this.$ = yy.preparePath(false, $$[$0], this._$);
                        break;
                    case 41:
                        $$[$0 - 2].push({ part: yy.id($$[$0]), original: $$[$0], separator: $$[$0 - 1] });this.$ = $$[$0 - 2];
                        break;
                    case 42:
                        this.$ = [{ part: yy.id($$[$0]), original: $$[$0] }];
                        break;
                    case 43:
                        this.$ = [];
                        break;
                    case 44:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 45:
                        this.$ = [];
                        break;
                    case 46:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 53:
                        this.$ = [];
                        break;
                    case 54:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 59:
                        this.$ = [];
                        break;
                    case 60:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 65:
                        this.$ = [];
                        break;
                    case 66:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 73:
                        this.$ = [];
                        break;
                    case 74:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 77:
                        this.$ = [];
                        break;
                    case 78:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 81:
                        this.$ = [];
                        break;
                    case 82:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 85:
                        this.$ = [];
                        break;
                    case 86:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 89:
                        this.$ = [$$[$0]];
                        break;
                    case 90:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 91:
                        this.$ = [$$[$0]];
                        break;
                    case 92:
                        $$[$0 - 1].push($$[$0]);
                        break;
                }
            },
            table: [{ 3: 1, 4: 2, 5: [2, 43], 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 1: [3] }, { 5: [1, 4] }, { 5: [2, 2], 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: [1, 11], 14: [1, 18], 15: 16, 17: [1, 21], 22: 14, 25: 15, 27: [1, 19], 32: [1, 20], 37: [2, 2], 42: [2, 2], 45: [2, 2], 46: [1, 12], 49: [1, 13], 53: [1, 17] }, { 1: [2, 1] }, { 5: [2, 44], 13: [2, 44], 14: [2, 44], 17: [2, 44], 27: [2, 44], 32: [2, 44], 37: [2, 44], 42: [2, 44], 45: [2, 44], 46: [2, 44], 49: [2, 44], 53: [2, 44] }, { 5: [2, 3], 13: [2, 3], 14: [2, 3], 17: [2, 3], 27: [2, 3], 32: [2, 3], 37: [2, 3], 42: [2, 3], 45: [2, 3], 46: [2, 3], 49: [2, 3], 53: [2, 3] }, { 5: [2, 4], 13: [2, 4], 14: [2, 4], 17: [2, 4], 27: [2, 4], 32: [2, 4], 37: [2, 4], 42: [2, 4], 45: [2, 4], 46: [2, 4], 49: [2, 4], 53: [2, 4] }, { 5: [2, 5], 13: [2, 5], 14: [2, 5], 17: [2, 5], 27: [2, 5], 32: [2, 5], 37: [2, 5], 42: [2, 5], 45: [2, 5], 46: [2, 5], 49: [2, 5], 53: [2, 5] }, { 5: [2, 6], 13: [2, 6], 14: [2, 6], 17: [2, 6], 27: [2, 6], 32: [2, 6], 37: [2, 6], 42: [2, 6], 45: [2, 6], 46: [2, 6], 49: [2, 6], 53: [2, 6] }, { 5: [2, 7], 13: [2, 7], 14: [2, 7], 17: [2, 7], 27: [2, 7], 32: [2, 7], 37: [2, 7], 42: [2, 7], 45: [2, 7], 46: [2, 7], 49: [2, 7], 53: [2, 7] }, { 5: [2, 8], 13: [2, 8], 14: [2, 8], 17: [2, 8], 27: [2, 8], 32: [2, 8], 37: [2, 8], 42: [2, 8], 45: [2, 8], 46: [2, 8], 49: [2, 8], 53: [2, 8] }, { 18: 22, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 33, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 4: 34, 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 37: [2, 43], 42: [2, 43], 45: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 4: 35, 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 42: [2, 43], 45: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 12: 36, 14: [1, 18] }, { 18: 38, 54: 37, 58: 39, 59: [1, 40], 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 5: [2, 9], 13: [2, 9], 14: [2, 9], 16: [2, 9], 17: [2, 9], 27: [2, 9], 32: [2, 9], 37: [2, 9], 42: [2, 9], 45: [2, 9], 46: [2, 9], 49: [2, 9], 53: [2, 9] }, { 18: 41, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 42, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 43, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 31: [2, 73], 47: 44, 59: [2, 73], 66: [2, 73], 74: [2, 73], 75: [2, 73], 76: [2, 73], 77: [2, 73], 78: [2, 73], 79: [2, 73] }, { 21: [2, 30], 31: [2, 30], 52: [2, 30], 59: [2, 30], 62: [2, 30], 66: [2, 30], 69: [2, 30], 74: [2, 30], 75: [2, 30], 76: [2, 30], 77: [2, 30], 78: [2, 30], 79: [2, 30] }, { 21: [2, 31], 31: [2, 31], 52: [2, 31], 59: [2, 31], 62: [2, 31], 66: [2, 31], 69: [2, 31], 74: [2, 31], 75: [2, 31], 76: [2, 31], 77: [2, 31], 78: [2, 31], 79: [2, 31] }, { 21: [2, 32], 31: [2, 32], 52: [2, 32], 59: [2, 32], 62: [2, 32], 66: [2, 32], 69: [2, 32], 74: [2, 32], 75: [2, 32], 76: [2, 32], 77: [2, 32], 78: [2, 32], 79: [2, 32] }, { 21: [2, 33], 31: [2, 33], 52: [2, 33], 59: [2, 33], 62: [2, 33], 66: [2, 33], 69: [2, 33], 74: [2, 33], 75: [2, 33], 76: [2, 33], 77: [2, 33], 78: [2, 33], 79: [2, 33] }, { 21: [2, 34], 31: [2, 34], 52: [2, 34], 59: [2, 34], 62: [2, 34], 66: [2, 34], 69: [2, 34], 74: [2, 34], 75: [2, 34], 76: [2, 34], 77: [2, 34], 78: [2, 34], 79: [2, 34] }, { 21: [2, 35], 31: [2, 35], 52: [2, 35], 59: [2, 35], 62: [2, 35], 66: [2, 35], 69: [2, 35], 74: [2, 35], 75: [2, 35], 76: [2, 35], 77: [2, 35], 78: [2, 35], 79: [2, 35] }, { 21: [2, 36], 31: [2, 36], 52: [2, 36], 59: [2, 36], 62: [2, 36], 66: [2, 36], 69: [2, 36], 74: [2, 36], 75: [2, 36], 76: [2, 36], 77: [2, 36], 78: [2, 36], 79: [2, 36] }, { 21: [2, 40], 31: [2, 40], 52: [2, 40], 59: [2, 40], 62: [2, 40], 66: [2, 40], 69: [2, 40], 74: [2, 40], 75: [2, 40], 76: [2, 40], 77: [2, 40], 78: [2, 40], 79: [2, 40], 81: [1, 45] }, { 66: [1, 32], 80: 46 }, { 21: [2, 42], 31: [2, 42], 52: [2, 42], 59: [2, 42], 62: [2, 42], 66: [2, 42], 69: [2, 42], 74: [2, 42], 75: [2, 42], 76: [2, 42], 77: [2, 42], 78: [2, 42], 79: [2, 42], 81: [2, 42] }, { 50: 47, 52: [2, 77], 59: [2, 77], 66: [2, 77], 74: [2, 77], 75: [2, 77], 76: [2, 77], 77: [2, 77], 78: [2, 77], 79: [2, 77] }, { 23: 48, 36: 50, 37: [1, 52], 41: 51, 42: [1, 53], 43: 49, 45: [2, 49] }, { 26: 54, 41: 55, 42: [1, 53], 45: [2, 51] }, { 16: [1, 56] }, { 31: [2, 81], 55: 57, 59: [2, 81], 66: [2, 81], 74: [2, 81], 75: [2, 81], 76: [2, 81], 77: [2, 81], 78: [2, 81], 79: [2, 81] }, { 31: [2, 37], 59: [2, 37], 66: [2, 37], 74: [2, 37], 75: [2, 37], 76: [2, 37], 77: [2, 37], 78: [2, 37], 79: [2, 37] }, { 31: [2, 38], 59: [2, 38], 66: [2, 38], 74: [2, 38], 75: [2, 38], 76: [2, 38], 77: [2, 38], 78: [2, 38], 79: [2, 38] }, { 18: 58, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 28: 59, 31: [2, 53], 59: [2, 53], 66: [2, 53], 69: [2, 53], 74: [2, 53], 75: [2, 53], 76: [2, 53], 77: [2, 53], 78: [2, 53], 79: [2, 53] }, { 31: [2, 59], 33: 60, 59: [2, 59], 66: [2, 59], 69: [2, 59], 74: [2, 59], 75: [2, 59], 76: [2, 59], 77: [2, 59], 78: [2, 59], 79: [2, 59] }, { 19: 61, 21: [2, 45], 59: [2, 45], 66: [2, 45], 74: [2, 45], 75: [2, 45], 76: [2, 45], 77: [2, 45], 78: [2, 45], 79: [2, 45] }, { 18: 65, 31: [2, 75], 48: 62, 57: 63, 58: 66, 59: [1, 40], 63: 64, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 66: [1, 70] }, { 21: [2, 39], 31: [2, 39], 52: [2, 39], 59: [2, 39], 62: [2, 39], 66: [2, 39], 69: [2, 39], 74: [2, 39], 75: [2, 39], 76: [2, 39], 77: [2, 39], 78: [2, 39], 79: [2, 39], 81: [1, 45] }, { 18: 65, 51: 71, 52: [2, 79], 57: 72, 58: 66, 59: [1, 40], 63: 73, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 24: 74, 45: [1, 75] }, { 45: [2, 50] }, { 4: 76, 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 37: [2, 43], 42: [2, 43], 45: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 45: [2, 19] }, { 18: 77, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 4: 78, 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 45: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 24: 79, 45: [1, 75] }, { 45: [2, 52] }, { 5: [2, 10], 13: [2, 10], 14: [2, 10], 17: [2, 10], 27: [2, 10], 32: [2, 10], 37: [2, 10], 42: [2, 10], 45: [2, 10], 46: [2, 10], 49: [2, 10], 53: [2, 10] }, { 18: 65, 31: [2, 83], 56: 80, 57: 81, 58: 66, 59: [1, 40], 63: 82, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 59: [2, 85], 60: 83, 62: [2, 85], 66: [2, 85], 74: [2, 85], 75: [2, 85], 76: [2, 85], 77: [2, 85], 78: [2, 85], 79: [2, 85] }, { 18: 65, 29: 84, 31: [2, 55], 57: 85, 58: 66, 59: [1, 40], 63: 86, 64: 67, 65: 68, 66: [1, 69], 69: [2, 55], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 65, 31: [2, 61], 34: 87, 57: 88, 58: 66, 59: [1, 40], 63: 89, 64: 67, 65: 68, 66: [1, 69], 69: [2, 61], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 65, 20: 90, 21: [2, 47], 57: 91, 58: 66, 59: [1, 40], 63: 92, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 31: [1, 93] }, { 31: [2, 74], 59: [2, 74], 66: [2, 74], 74: [2, 74], 75: [2, 74], 76: [2, 74], 77: [2, 74], 78: [2, 74], 79: [2, 74] }, { 31: [2, 76] }, { 21: [2, 24], 31: [2, 24], 52: [2, 24], 59: [2, 24], 62: [2, 24], 66: [2, 24], 69: [2, 24], 74: [2, 24], 75: [2, 24], 76: [2, 24], 77: [2, 24], 78: [2, 24], 79: [2, 24] }, { 21: [2, 25], 31: [2, 25], 52: [2, 25], 59: [2, 25], 62: [2, 25], 66: [2, 25], 69: [2, 25], 74: [2, 25], 75: [2, 25], 76: [2, 25], 77: [2, 25], 78: [2, 25], 79: [2, 25] }, { 21: [2, 27], 31: [2, 27], 52: [2, 27], 62: [2, 27], 65: 94, 66: [1, 95], 69: [2, 27] }, { 21: [2, 89], 31: [2, 89], 52: [2, 89], 62: [2, 89], 66: [2, 89], 69: [2, 89] }, { 21: [2, 42], 31: [2, 42], 52: [2, 42], 59: [2, 42], 62: [2, 42], 66: [2, 42], 67: [1, 96], 69: [2, 42], 74: [2, 42], 75: [2, 42], 76: [2, 42], 77: [2, 42], 78: [2, 42], 79: [2, 42], 81: [2, 42] }, { 21: [2, 41], 31: [2, 41], 52: [2, 41], 59: [2, 41], 62: [2, 41], 66: [2, 41], 69: [2, 41], 74: [2, 41], 75: [2, 41], 76: [2, 41], 77: [2, 41], 78: [2, 41], 79: [2, 41], 81: [2, 41] }, { 52: [1, 97] }, { 52: [2, 78], 59: [2, 78], 66: [2, 78], 74: [2, 78], 75: [2, 78], 76: [2, 78], 77: [2, 78], 78: [2, 78], 79: [2, 78] }, { 52: [2, 80] }, { 5: [2, 12], 13: [2, 12], 14: [2, 12], 17: [2, 12], 27: [2, 12], 32: [2, 12], 37: [2, 12], 42: [2, 12], 45: [2, 12], 46: [2, 12], 49: [2, 12], 53: [2, 12] }, { 18: 98, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 36: 50, 37: [1, 52], 41: 51, 42: [1, 53], 43: 100, 44: 99, 45: [2, 71] }, { 31: [2, 65], 38: 101, 59: [2, 65], 66: [2, 65], 69: [2, 65], 74: [2, 65], 75: [2, 65], 76: [2, 65], 77: [2, 65], 78: [2, 65], 79: [2, 65] }, { 45: [2, 17] }, { 5: [2, 13], 13: [2, 13], 14: [2, 13], 17: [2, 13], 27: [2, 13], 32: [2, 13], 37: [2, 13], 42: [2, 13], 45: [2, 13], 46: [2, 13], 49: [2, 13], 53: [2, 13] }, { 31: [1, 102] }, { 31: [2, 82], 59: [2, 82], 66: [2, 82], 74: [2, 82], 75: [2, 82], 76: [2, 82], 77: [2, 82], 78: [2, 82], 79: [2, 82] }, { 31: [2, 84] }, { 18: 65, 57: 104, 58: 66, 59: [1, 40], 61: 103, 62: [2, 87], 63: 105, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 30: 106, 31: [2, 57], 68: 107, 69: [1, 108] }, { 31: [2, 54], 59: [2, 54], 66: [2, 54], 69: [2, 54], 74: [2, 54], 75: [2, 54], 76: [2, 54], 77: [2, 54], 78: [2, 54], 79: [2, 54] }, { 31: [2, 56], 69: [2, 56] }, { 31: [2, 63], 35: 109, 68: 110, 69: [1, 108] }, { 31: [2, 60], 59: [2, 60], 66: [2, 60], 69: [2, 60], 74: [2, 60], 75: [2, 60], 76: [2, 60], 77: [2, 60], 78: [2, 60], 79: [2, 60] }, { 31: [2, 62], 69: [2, 62] }, { 21: [1, 111] }, { 21: [2, 46], 59: [2, 46], 66: [2, 46], 74: [2, 46], 75: [2, 46], 76: [2, 46], 77: [2, 46], 78: [2, 46], 79: [2, 46] }, { 21: [2, 48] }, { 5: [2, 21], 13: [2, 21], 14: [2, 21], 17: [2, 21], 27: [2, 21], 32: [2, 21], 37: [2, 21], 42: [2, 21], 45: [2, 21], 46: [2, 21], 49: [2, 21], 53: [2, 21] }, { 21: [2, 90], 31: [2, 90], 52: [2, 90], 62: [2, 90], 66: [2, 90], 69: [2, 90] }, { 67: [1, 96] }, { 18: 65, 57: 112, 58: 66, 59: [1, 40], 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 5: [2, 22], 13: [2, 22], 14: [2, 22], 17: [2, 22], 27: [2, 22], 32: [2, 22], 37: [2, 22], 42: [2, 22], 45: [2, 22], 46: [2, 22], 49: [2, 22], 53: [2, 22] }, { 31: [1, 113] }, { 45: [2, 18] }, { 45: [2, 72] }, { 18: 65, 31: [2, 67], 39: 114, 57: 115, 58: 66, 59: [1, 40], 63: 116, 64: 67, 65: 68, 66: [1, 69], 69: [2, 67], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 5: [2, 23], 13: [2, 23], 14: [2, 23], 17: [2, 23], 27: [2, 23], 32: [2, 23], 37: [2, 23], 42: [2, 23], 45: [2, 23], 46: [2, 23], 49: [2, 23], 53: [2, 23] }, { 62: [1, 117] }, { 59: [2, 86], 62: [2, 86], 66: [2, 86], 74: [2, 86], 75: [2, 86], 76: [2, 86], 77: [2, 86], 78: [2, 86], 79: [2, 86] }, { 62: [2, 88] }, { 31: [1, 118] }, { 31: [2, 58] }, { 66: [1, 120], 70: 119 }, { 31: [1, 121] }, { 31: [2, 64] }, { 14: [2, 11] }, { 21: [2, 28], 31: [2, 28], 52: [2, 28], 62: [2, 28], 66: [2, 28], 69: [2, 28] }, { 5: [2, 20], 13: [2, 20], 14: [2, 20], 17: [2, 20], 27: [2, 20], 32: [2, 20], 37: [2, 20], 42: [2, 20], 45: [2, 20], 46: [2, 20], 49: [2, 20], 53: [2, 20] }, { 31: [2, 69], 40: 122, 68: 123, 69: [1, 108] }, { 31: [2, 66], 59: [2, 66], 66: [2, 66], 69: [2, 66], 74: [2, 66], 75: [2, 66], 76: [2, 66], 77: [2, 66], 78: [2, 66], 79: [2, 66] }, { 31: [2, 68], 69: [2, 68] }, { 21: [2, 26], 31: [2, 26], 52: [2, 26], 59: [2, 26], 62: [2, 26], 66: [2, 26], 69: [2, 26], 74: [2, 26], 75: [2, 26], 76: [2, 26], 77: [2, 26], 78: [2, 26], 79: [2, 26] }, { 13: [2, 14], 14: [2, 14], 17: [2, 14], 27: [2, 14], 32: [2, 14], 37: [2, 14], 42: [2, 14], 45: [2, 14], 46: [2, 14], 49: [2, 14], 53: [2, 14] }, { 66: [1, 125], 71: [1, 124] }, { 66: [2, 91], 71: [2, 91] }, { 13: [2, 15], 14: [2, 15], 17: [2, 15], 27: [2, 15], 32: [2, 15], 42: [2, 15], 45: [2, 15], 46: [2, 15], 49: [2, 15], 53: [2, 15] }, { 31: [1, 126] }, { 31: [2, 70] }, { 31: [2, 29] }, { 66: [2, 92], 71: [2, 92] }, { 13: [2, 16], 14: [2, 16], 17: [2, 16], 27: [2, 16], 32: [2, 16], 37: [2, 16], 42: [2, 16], 45: [2, 16], 46: [2, 16], 49: [2, 16], 53: [2, 16] }],
            defaultActions: { 4: [2, 1], 49: [2, 50], 51: [2, 19], 55: [2, 52], 64: [2, 76], 73: [2, 80], 78: [2, 17], 82: [2, 84], 92: [2, 48], 99: [2, 18], 100: [2, 72], 105: [2, 88], 107: [2, 58], 110: [2, 64], 111: [2, 11], 123: [2, 70], 124: [2, 29] },
            parseError: function parseError(str, hash) {
                throw new Error(str);
            },
            parse: function parse(input) {
                var self = this,
                    stack = [0],
                    vstack = [null],
                    lstack = [],
                    table = this.table,
                    yytext = "",
                    yylineno = 0,
                    yyleng = 0,
                    recovering = 0,
                    TERROR = 2,
                    EOF = 1;
                this.lexer.setInput(input);
                this.lexer.yy = this.yy;
                this.yy.lexer = this.lexer;
                this.yy.parser = this;
                if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {};
                var yyloc = this.lexer.yylloc;
                lstack.push(yyloc);
                var ranges = this.lexer.options && this.lexer.options.ranges;
                if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;
                function popStack(n) {
                    stack.length = stack.length - 2 * n;
                    vstack.length = vstack.length - n;
                    lstack.length = lstack.length - n;
                }
                function lex() {
                    var token;
                    token = self.lexer.lex() || 1;
                    if (typeof token !== "number") {
                        token = self.symbols_[token] || token;
                    }
                    return token;
                }
                var symbol,
                    preErrorSymbol,
                    state,
                    action,
                    a,
                    r,
                    yyval = {},
                    p,
                    len,
                    newState,
                    expected;
                while (true) {
                    state = stack[stack.length - 1];
                    if (this.defaultActions[state]) {
                        action = this.defaultActions[state];
                    } else {
                        if (symbol === null || typeof symbol == "undefined") {
                            symbol = lex();
                        }
                        action = table[state] && table[state][symbol];
                    }
                    if (typeof action === "undefined" || !action.length || !action[0]) {
                        var errStr = "";
                        if (!recovering) {
                            expected = [];
                            for (p in table[state]) if (this.terminals_[p] && p > 2) {
                                expected.push("'" + this.terminals_[p] + "'");
                            }
                            if (this.lexer.showPosition) {
                                errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                            } else {
                                errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
                            }
                            this.parseError(errStr, { text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected });
                        }
                    }
                    if (action[0] instanceof Array && action.length > 1) {
                        throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
                    }
                    switch (action[0]) {
                        case 1:
                            stack.push(symbol);
                            vstack.push(this.lexer.yytext);
                            lstack.push(this.lexer.yylloc);
                            stack.push(action[1]);
                            symbol = null;
                            if (!preErrorSymbol) {
                                yyleng = this.lexer.yyleng;
                                yytext = this.lexer.yytext;
                                yylineno = this.lexer.yylineno;
                                yyloc = this.lexer.yylloc;
                                if (recovering > 0) recovering--;
                            } else {
                                symbol = preErrorSymbol;
                                preErrorSymbol = null;
                            }
                            break;
                        case 2:
                            len = this.productions_[action[1]][1];
                            yyval.$ = vstack[vstack.length - len];
                            yyval._$ = { first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column };
                            if (ranges) {
                                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
                            }
                            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
                            if (typeof r !== "undefined") {
                                return r;
                            }
                            if (len) {
                                stack = stack.slice(0, -1 * len * 2);
                                vstack = vstack.slice(0, -1 * len);
                                lstack = lstack.slice(0, -1 * len);
                            }
                            stack.push(this.productions_[action[1]][0]);
                            vstack.push(yyval.$);
                            lstack.push(yyval._$);
                            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                            stack.push(newState);
                            break;
                        case 3:
                            return true;
                    }
                }
                return true;
            }
        };
        /* Jison generated lexer */
        var lexer = (function () {
            var lexer = { EOF: 1,
                parseError: function parseError(str, hash) {
                    if (this.yy.parser) {
                        this.yy.parser.parseError(str, hash);
                    } else {
                        throw new Error(str);
                    }
                },
                setInput: function setInput(input) {
                    this._input = input;
                    this._more = this._less = this.done = false;
                    this.yylineno = this.yyleng = 0;
                    this.yytext = this.matched = this.match = '';
                    this.conditionStack = ['INITIAL'];
                    this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 };
                    if (this.options.ranges) this.yylloc.range = [0, 0];
                    this.offset = 0;
                    return this;
                },
                input: function input() {
                    var ch = this._input[0];
                    this.yytext += ch;
                    this.yyleng++;
                    this.offset++;
                    this.match += ch;
                    this.matched += ch;
                    var lines = ch.match(/(?:\r\n?|\n).*/g);
                    if (lines) {
                        this.yylineno++;
                        this.yylloc.last_line++;
                    } else {
                        this.yylloc.last_column++;
                    }
                    if (this.options.ranges) this.yylloc.range[1]++;

                    this._input = this._input.slice(1);
                    return ch;
                },
                unput: function unput(ch) {
                    var len = ch.length;
                    var lines = ch.split(/(?:\r\n?|\n)/g);

                    this._input = ch + this._input;
                    this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                    //this.yyleng -= len;
                    this.offset -= len;
                    var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                    this.match = this.match.substr(0, this.match.length - 1);
                    this.matched = this.matched.substr(0, this.matched.length - 1);

                    if (lines.length - 1) this.yylineno -= lines.length - 1;
                    var r = this.yylloc.range;

                    this.yylloc = { first_line: this.yylloc.first_line,
                        last_line: this.yylineno + 1,
                        first_column: this.yylloc.first_column,
                        last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                    };

                    if (this.options.ranges) {
                        this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                    }
                    return this;
                },
                more: function more() {
                    this._more = true;
                    return this;
                },
                less: function less(n) {
                    this.unput(this.match.slice(n));
                },
                pastInput: function pastInput() {
                    var past = this.matched.substr(0, this.matched.length - this.match.length);
                    return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
                },
                upcomingInput: function upcomingInput() {
                    var next = this.match;
                    if (next.length < 20) {
                        next += this._input.substr(0, 20 - next.length);
                    }
                    return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
                },
                showPosition: function showPosition() {
                    var pre = this.pastInput();
                    var c = new Array(pre.length + 1).join("-");
                    return pre + this.upcomingInput() + "\n" + c + "^";
                },
                next: function next() {
                    if (this.done) {
                        return this.EOF;
                    }
                    if (!this._input) this.done = true;

                    var token, match, tempMatch, index, col, lines;
                    if (!this._more) {
                        this.yytext = '';
                        this.match = '';
                    }
                    var rules = this._currentRules();
                    for (var i = 0; i < rules.length; i++) {
                        tempMatch = this._input.match(this.rules[rules[i]]);
                        if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                            match = tempMatch;
                            index = i;
                            if (!this.options.flex) break;
                        }
                    }
                    if (match) {
                        lines = match[0].match(/(?:\r\n?|\n).*/g);
                        if (lines) this.yylineno += lines.length;
                        this.yylloc = { first_line: this.yylloc.last_line,
                            last_line: this.yylineno + 1,
                            first_column: this.yylloc.last_column,
                            last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length };
                        this.yytext += match[0];
                        this.match += match[0];
                        this.matches = match;
                        this.yyleng = this.yytext.length;
                        if (this.options.ranges) {
                            this.yylloc.range = [this.offset, this.offset += this.yyleng];
                        }
                        this._more = false;
                        this._input = this._input.slice(match[0].length);
                        this.matched += match[0];
                        token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
                        if (this.done && this._input) this.done = false;
                        if (token) return token;else return;
                    }
                    if (this._input === "") {
                        return this.EOF;
                    } else {
                        return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), { text: "", token: null, line: this.yylineno });
                    }
                },
                lex: function lex() {
                    var r = this.next();
                    if (typeof r !== 'undefined') {
                        return r;
                    } else {
                        return this.lex();
                    }
                },
                begin: function begin(condition) {
                    this.conditionStack.push(condition);
                },
                popState: function popState() {
                    return this.conditionStack.pop();
                },
                _currentRules: function _currentRules() {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                },
                topState: function topState() {
                    return this.conditionStack[this.conditionStack.length - 2];
                },
                pushState: function begin(condition) {
                    this.begin(condition);
                } };
            lexer.options = {};
            lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {

                function strip(start, end) {
                    return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng - end);
                }

                var YYSTATE = YY_START;
                switch ($avoiding_name_collisions) {
                    case 0:
                        if (yy_.yytext.slice(-2) === "\\\\") {
                            strip(0, 1);
                            this.begin("mu");
                        } else if (yy_.yytext.slice(-1) === "\\") {
                            strip(0, 1);
                            this.begin("emu");
                        } else {
                            this.begin("mu");
                        }
                        if (yy_.yytext) return 14;

                        break;
                    case 1:
                        return 14;
                        break;
                    case 2:
                        this.popState();
                        return 14;

                        break;
                    case 3:
                        yy_.yytext = yy_.yytext.substr(5, yy_.yyleng - 9);
                        this.popState();
                        return 16;

                        break;
                    case 4:
                        return 14;
                        break;
                    case 5:
                        this.popState();
                        return 13;

                        break;
                    case 6:
                        return 59;
                        break;
                    case 7:
                        return 62;
                        break;
                    case 8:
                        return 17;
                        break;
                    case 9:
                        this.popState();
                        this.begin('raw');
                        return 21;

                        break;
                    case 10:
                        return 53;
                        break;
                    case 11:
                        return 27;
                        break;
                    case 12:
                        return 45;
                        break;
                    case 13:
                        this.popState();return 42;
                        break;
                    case 14:
                        this.popState();return 42;
                        break;
                    case 15:
                        return 32;
                        break;
                    case 16:
                        return 37;
                        break;
                    case 17:
                        return 49;
                        break;
                    case 18:
                        return 46;
                        break;
                    case 19:
                        this.unput(yy_.yytext);
                        this.popState();
                        this.begin('com');

                        break;
                    case 20:
                        this.popState();
                        return 13;

                        break;
                    case 21:
                        return 46;
                        break;
                    case 22:
                        return 67;
                        break;
                    case 23:
                        return 66;
                        break;
                    case 24:
                        return 66;
                        break;
                    case 25:
                        return 81;
                        break;
                    case 26:
                        // ignore whitespace
                        break;
                    case 27:
                        this.popState();return 52;
                        break;
                    case 28:
                        this.popState();return 31;
                        break;
                    case 29:
                        yy_.yytext = strip(1, 2).replace(/\\"/g, '"');return 74;
                        break;
                    case 30:
                        yy_.yytext = strip(1, 2).replace(/\\'/g, "'");return 74;
                        break;
                    case 31:
                        return 79;
                        break;
                    case 32:
                        return 76;
                        break;
                    case 33:
                        return 76;
                        break;
                    case 34:
                        return 77;
                        break;
                    case 35:
                        return 78;
                        break;
                    case 36:
                        return 75;
                        break;
                    case 37:
                        return 69;
                        break;
                    case 38:
                        return 71;
                        break;
                    case 39:
                        return 66;
                        break;
                    case 40:
                        return 66;
                        break;
                    case 41:
                        return 'INVALID';
                        break;
                    case 42:
                        return 5;
                        break;
                }
            };
            lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]*?(?=(\{\{\{\{\/)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)|])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:undefined(?=([~}\s)])))/, /^(?:null(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/];
            lexer.conditions = { "mu": { "rules": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42], "inclusive": false }, "emu": { "rules": [2], "inclusive": false }, "com": { "rules": [5], "inclusive": false }, "raw": { "rules": [3, 4], "inclusive": false }, "INITIAL": { "rules": [0, 1, 42], "inclusive": true } };
            return lexer;
        })();
        parser.lexer = lexer;
        function Parser() {
            this.yy = {};
        }Parser.prototype = parser;parser.Parser = Parser;
        return new Parser();
    })();module.exports = handlebars;
});
define('htmlbars-syntax/handlebars/compiler/visitor', ['exports', 'module', '../exception', './ast'], function (exports, module, _exception, _ast) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Exception = _interopRequireDefault(_exception);

  var _AST = _interopRequireDefault(_ast);

  function Visitor() {
    this.parents = [];
  }

  Visitor.prototype = {
    constructor: Visitor,
    mutating: false,

    // Visits a given value. If mutating, will replace the value if necessary.
    acceptKey: function acceptKey(node, name) {
      var value = this.accept(node[name]);
      if (this.mutating) {
        // Hacky sanity check:
        if (value && (!value.type || !_AST['default'][value.type])) {
          throw new _Exception['default']('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
        }
        node[name] = value;
      }
    },

    // Performs an accept operation with added sanity check to ensure
    // required keys are not removed.
    acceptRequired: function acceptRequired(node, name) {
      this.acceptKey(node, name);

      if (!node[name]) {
        throw new _Exception['default'](node.type + ' requires ' + name);
      }
    },

    // Traverses a given array. If mutating, empty respnses will be removed
    // for child elements.
    acceptArray: function acceptArray(array) {
      for (var i = 0, l = array.length; i < l; i++) {
        this.acceptKey(array, i);

        if (!array[i]) {
          array.splice(i, 1);
          i--;
          l--;
        }
      }
    },

    accept: function accept(object) {
      if (!object) {
        return;
      }

      if (this.current) {
        this.parents.unshift(this.current);
      }
      this.current = object;

      var ret = this[object.type](object);

      this.current = this.parents.shift();

      if (!this.mutating || ret) {
        return ret;
      } else if (ret !== false) {
        return object;
      }
    },

    Program: function Program(program) {
      this.acceptArray(program.body);
    },

    MustacheStatement: function MustacheStatement(mustache) {
      this.acceptRequired(mustache, 'path');
      this.acceptArray(mustache.params);
      this.acceptKey(mustache, 'hash');
    },

    BlockStatement: function BlockStatement(block) {
      this.acceptRequired(block, 'path');
      this.acceptArray(block.params);
      this.acceptKey(block, 'hash');

      this.acceptKey(block, 'program');
      this.acceptKey(block, 'inverse');
    },

    PartialStatement: function PartialStatement(partial) {
      this.acceptRequired(partial, 'name');
      this.acceptArray(partial.params);
      this.acceptKey(partial, 'hash');
    },

    ContentStatement: function ContentStatement() /* content */{},
    CommentStatement: function CommentStatement() /* comment */{},

    SubExpression: function SubExpression(sexpr) {
      this.acceptRequired(sexpr, 'path');
      this.acceptArray(sexpr.params);
      this.acceptKey(sexpr, 'hash');
    },

    PathExpression: function PathExpression() /* path */{},

    StringLiteral: function StringLiteral() /* string */{},
    NumberLiteral: function NumberLiteral() /* number */{},
    BooleanLiteral: function BooleanLiteral() /* bool */{},
    UndefinedLiteral: function UndefinedLiteral() /* literal */{},
    NullLiteral: function NullLiteral() /* literal */{},

    Hash: function Hash(hash) {
      this.acceptArray(hash.pairs);
    },
    HashPair: function HashPair(pair) {
      this.acceptRequired(pair, 'value');
    }
  };

  module.exports = Visitor;
});
define('htmlbars-syntax/handlebars/compiler/whitespace-control', ['exports', 'module', './visitor'], function (exports, module, _visitor) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Visitor = _interopRequireDefault(_visitor);

  function WhitespaceControl() {}
  WhitespaceControl.prototype = new _Visitor['default']();

  WhitespaceControl.prototype.Program = function (program) {
    var isRoot = !this.isRootSeen;
    this.isRootSeen = true;

    var body = program.body;
    for (var i = 0, l = body.length; i < l; i++) {
      var current = body[i],
          strip = this.accept(current);

      if (!strip) {
        continue;
      }

      var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
          _isNextWhitespace = isNextWhitespace(body, i, isRoot),
          openStandalone = strip.openStandalone && _isPrevWhitespace,
          closeStandalone = strip.closeStandalone && _isNextWhitespace,
          inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

      if (strip.close) {
        omitRight(body, i, true);
      }
      if (strip.open) {
        omitLeft(body, i, true);
      }

      if (inlineStandalone) {
        omitRight(body, i);

        if (omitLeft(body, i)) {
          // If we are on a standalone node, save the indent info for partials
          if (current.type === 'PartialStatement') {
            // Pull out the whitespace from the final line
            current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
          }
        }
      }
      if (openStandalone) {
        omitRight((current.program || current.inverse).body);

        // Strip out the previous content node if it's whitespace only
        omitLeft(body, i);
      }
      if (closeStandalone) {
        // Always strip the next node
        omitRight(body, i);

        omitLeft((current.inverse || current.program).body);
      }
    }

    return program;
  };
  WhitespaceControl.prototype.BlockStatement = function (block) {
    this.accept(block.program);
    this.accept(block.inverse);

    // Find the inverse program that is involed with whitespace stripping.
    var program = block.program || block.inverse,
        inverse = block.program && block.inverse,
        firstInverse = inverse,
        lastInverse = inverse;

    if (inverse && inverse.chained) {
      firstInverse = inverse.body[0].program;

      // Walk the inverse chain to find the last inverse that is actually in the chain.
      while (lastInverse.chained) {
        lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
      }
    }

    var strip = {
      open: block.openStrip.open,
      close: block.closeStrip.close,

      // Determine the standalone candiacy. Basically flag our content as being possibly standalone
      // so our parent can determine if we actually are standalone
      openStandalone: isNextWhitespace(program.body),
      closeStandalone: isPrevWhitespace((firstInverse || program).body)
    };

    if (block.openStrip.close) {
      omitRight(program.body, null, true);
    }

    if (inverse) {
      var inverseStrip = block.inverseStrip;

      if (inverseStrip.open) {
        omitLeft(program.body, null, true);
      }

      if (inverseStrip.close) {
        omitRight(firstInverse.body, null, true);
      }
      if (block.closeStrip.open) {
        omitLeft(lastInverse.body, null, true);
      }

      // Find standalone else statments
      if (isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
        omitLeft(program.body);
        omitRight(firstInverse.body);
      }
    } else if (block.closeStrip.open) {
      omitLeft(program.body, null, true);
    }

    return strip;
  };

  WhitespaceControl.prototype.MustacheStatement = function (mustache) {
    return mustache.strip;
  };

  WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function (node) {
    /* istanbul ignore next */
    var strip = node.strip || {};
    return {
      inlineStandalone: true,
      open: strip.open,
      close: strip.close
    };
  };

  function isPrevWhitespace(body, i, isRoot) {
    if (i === undefined) {
      i = body.length;
    }

    // Nodes that end with newlines are considered whitespace (but are special
    // cased for strip operations)
    var prev = body[i - 1],
        sibling = body[i - 2];
    if (!prev) {
      return isRoot;
    }

    if (prev.type === 'ContentStatement') {
      return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
    }
  }
  function isNextWhitespace(body, i, isRoot) {
    if (i === undefined) {
      i = -1;
    }

    var next = body[i + 1],
        sibling = body[i + 2];
    if (!next) {
      return isRoot;
    }

    if (next.type === 'ContentStatement') {
      return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
    }
  }

  // Marks the node to the right of the position as omitted.
  // I.e. {{foo}}' ' will mark the ' ' node as omitted.
  //
  // If i is undefined, then the first child will be marked as such.
  //
  // If mulitple is truthy then all whitespace will be stripped out until non-whitespace
  // content is met.
  function omitRight(body, i, multiple) {
    var current = body[i == null ? 0 : i + 1];
    if (!current || current.type !== 'ContentStatement' || !multiple && current.rightStripped) {
      return;
    }

    var original = current.value;
    current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, '');
    current.rightStripped = current.value !== original;
  }

  // Marks the node to the left of the position as omitted.
  // I.e. ' '{{foo}} will mark the ' ' node as omitted.
  //
  // If i is undefined then the last child will be marked as such.
  //
  // If mulitple is truthy then all whitespace will be stripped out until non-whitespace
  // content is met.
  function omitLeft(body, i, multiple) {
    var current = body[i == null ? body.length - 1 : i - 1];
    if (!current || current.type !== 'ContentStatement' || !multiple && current.leftStripped) {
      return;
    }

    // We omit the last node if it's whitespace only and not preceeded by a non-content node.
    var original = current.value;
    current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, '');
    current.leftStripped = current.value !== original;
    return current.leftStripped;
  }

  module.exports = WhitespaceControl;
});
define('htmlbars-syntax/handlebars/exception', ['exports', 'module'], function (exports, module) {
  'use strict';

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var loc = node && node.loc,
        line = undefined,
        column = undefined;
    if (loc) {
      line = loc.start.line;
      column = loc.start.column;

      message += ' - ' + line + ':' + column;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Exception);
    }

    if (loc) {
      this.lineNumber = line;
      this.column = column;
    }
  }

  Exception.prototype = new Error();

  module.exports = Exception;
});
define('htmlbars-syntax/handlebars/safe-string', ['exports', 'module'], function (exports, module) {
  // Build out our basic SafeString type
  'use strict';

  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
    return '' + this.string;
  };

  module.exports = SafeString;
});
define('htmlbars-syntax/handlebars/utils', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.extend = extend;
  exports.indexOf = indexOf;
  exports.escapeExpression = escapeExpression;
  exports.isEmpty = isEmpty;
  exports.blockParams = blockParams;
  exports.appendContextPath = appendContextPath;
  var escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  var badChars = /[&<>"'`]/g,
      possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr];
  }

  function extend(obj /* , ...source */) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          obj[key] = arguments[i][key];
        }
      }
    }

    return obj;
  }

  var toString = Object.prototype.toString;

  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  /*eslint-disable func-style, no-var */
  exports.toString = toString;
  var isFunction = function isFunction(value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  /* istanbul ignore next */
  if (isFunction(/x/)) {
    exports.isFunction = isFunction = function (value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  /*eslint-enable func-style, no-var */

  /* istanbul ignore next */
  exports.isFunction = isFunction;
  var isArray = Array.isArray || function (value) {
    return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
  };

  // Older IE versions do not directly support indexOf so we must implement our own, sadly.
  exports.isArray = isArray;

  function indexOf(array, value) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  }

  function escapeExpression(string) {
    if (typeof string !== 'string') {
      // don't escape SafeStrings, since they're already safe
      if (string && string.toHTML) {
        return string.toHTML();
      } else if (string == null) {
        return '';
      } else if (!string) {
        return string + '';
      }

      // Force a string conversion as this will be done by the append regardless and
      // the regex test will do this transparently behind the scenes, causing issues if
      // an object's to string has escaped characters in it.
      string = '' + string;
    }

    if (!possible.test(string)) {
      return string;
    }
    return string.replace(badChars, escapeChar);
  }

  function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  function blockParams(params, ids) {
    params.path = ids;
    return params;
  }

  function appendContextPath(contextPath, id) {
    return (contextPath ? contextPath + '.' : '') + id;
  }
});
define("htmlbars-syntax/node-handlers", ["exports", "module", "./builders", "../htmlbars-util/array-utils", "./utils"], function (exports, module, _builders, _htmlbarsUtilArrayUtils, _utils) {
  "use strict";

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _b = _interopRequireDefault(_builders);

  var nodeHandlers = {

    Program: function Program(program) {
      var body = [];
      var node = (0, _builders.buildProgram)(body, program.blockParams, program.loc);
      var i,
          l = program.body.length;

      this.elementStack.push(node);

      if (l === 0) {
        return this.elementStack.pop();
      }

      for (i = 0; i < l; i++) {
        this.acceptNode(program.body[i]);
      }

      this.acceptToken(this.tokenizer.tokenizeEOF());

      // Ensure that that the element stack is balanced properly.
      var poppedNode = this.elementStack.pop();
      if (poppedNode !== node) {
        throw new Error("Unclosed element `" + poppedNode.tag + "` (on line " + poppedNode.loc.start.line + ").");
      }

      return node;
    },

    BlockStatement: function BlockStatement(block) {
      delete block.inverseStrip;
      delete block.openString;
      delete block.closeStrip;

      if (this.tokenizer.state === 'comment') {
        this.tokenizer.addChar('{{' + this.sourceForMustache(block) + '}}');
        return;
      }

      switchToHandlebars(this);
      this.acceptToken(block);

      block = acceptCommonNodes(this, block);
      var program = block.program ? this.acceptNode(block.program) : null;
      var inverse = block.inverse ? this.acceptNode(block.inverse) : null;

      var node = (0, _builders.buildBlock)(block.path, block.params, block.hash, program, inverse, block.loc);
      var parentProgram = this.currentElement();
      (0, _utils.appendChild)(parentProgram, node);
    },

    MustacheStatement: function MustacheStatement(rawMustache) {
      var path = rawMustache.path;
      var params = rawMustache.params;
      var hash = rawMustache.hash;
      var escaped = rawMustache.escaped;
      var loc = rawMustache.loc;

      var mustache = _b["default"].mustache(path, params, hash, !escaped, loc);

      if (this.tokenizer.state === 'comment') {
        this.tokenizer.addChar('{{' + this.sourceForMustache(mustache) + '}}');
        return;
      }

      acceptCommonNodes(this, mustache);
      switchToHandlebars(this);
      this.acceptToken(mustache);

      return mustache;
    },

    ContentStatement: function ContentStatement(content) {
      var changeLines = 0;
      if (content.rightStripped) {
        changeLines = leadingNewlineDifference(content.original, content.value);
      }

      this.tokenizer.line = this.tokenizer.line + changeLines;

      var tokens = this.tokenizer.tokenizePart(content.value);

      return (0, _htmlbarsUtilArrayUtils.forEach)(tokens, this.acceptToken, this);
    },

    CommentStatement: function CommentStatement(comment) {
      return comment;
    },

    PartialStatement: function PartialStatement(partial) {
      (0, _utils.appendChild)(this.currentElement(), partial);
      return partial;
    },

    SubExpression: function SubExpression(sexpr) {
      return acceptCommonNodes(this, sexpr);
    },

    PathExpression: function PathExpression(path) {
      delete path.data;
      delete path.depth;

      return path;
    },

    Hash: function Hash(hash) {
      for (var i = 0; i < hash.pairs.length; i++) {
        this.acceptNode(hash.pairs[i].value);
      }

      return hash;
    },

    StringLiteral: function StringLiteral() {},
    BooleanLiteral: function BooleanLiteral() {},
    NumberLiteral: function NumberLiteral() {},
    UndefinedLiteral: function UndefinedLiteral() {},
    NullLiteral: function NullLiteral() {}
  };

  function switchToHandlebars(processor) {
    var token = processor.tokenizer.token;

    if (token && token.type === 'Chars') {
      processor.acceptToken(token);
      processor.tokenizer.token = null;
    }
  }

  function leadingNewlineDifference(original, value) {
    if (value === '') {
      // if it is empty, just return the count of newlines
      // in original
      return original.split("\n").length - 1;
    }

    // otherwise, return the number of newlines prior to
    // `value`
    var difference = original.split(value)[0];
    var lines = difference.split(/\n/);

    return lines.length - 1;
  }

  function acceptCommonNodes(compiler, node) {
    compiler.acceptNode(node.path);

    if (node.params) {
      for (var i = 0; i < node.params.length; i++) {
        compiler.acceptNode(node.params[i]);
      }
    } else {
      node.params = [];
    }

    if (node.hash) {
      compiler.acceptNode(node.hash);
    } else {
      node.hash = (0, _builders.buildHash)();
    }

    return node;
  }

  module.exports = nodeHandlers;
});
define("htmlbars-syntax/parser", ["exports", "./handlebars/compiler/base", "./tokenizer", "../simple-html-tokenizer/entity-parser", "../simple-html-tokenizer/char-refs/full", "./node-handlers", "./token-handlers", "../htmlbars-syntax"], function (exports, _handlebarsCompilerBase, _tokenizer, _simpleHtmlTokenizerEntityParser, _simpleHtmlTokenizerCharRefsFull, _nodeHandlers, _tokenHandlers, _htmlbarsSyntax) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.preprocess = preprocess;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _EntityParser = _interopRequireDefault(_simpleHtmlTokenizerEntityParser);

  var _fullCharRefs = _interopRequireDefault(_simpleHtmlTokenizerCharRefsFull);

  var _nodeHandlers2 = _interopRequireDefault(_nodeHandlers);

  var _tokenHandlers2 = _interopRequireDefault(_tokenHandlers);

  var splitLines;
  // IE8 throws away blank pieces when splitting strings with a regex
  // So we split using a string instead as appropriate
  if ("foo\n\nbar".split(/\n/).length === 2) {
    splitLines = function (str) {
      var clean = str.replace(/\r\n?/g, '\n');
      return clean.split('\n');
    };
  } else {
    splitLines = function (str) {
      return str.split(/(?:\r\n?|\n)/g);
    };
  }

  function preprocess(html, options) {
    var ast = typeof html === 'object' ? html : (0, _handlebarsCompilerBase.parse)(html);
    var combined = new HTMLProcessor(html, options).acceptNode(ast);

    if (options && options.plugins && options.plugins.ast) {
      for (var i = 0, l = options.plugins.ast.length; i < l; i++) {
        var plugin = new options.plugins.ast[i](options);

        plugin.syntax = _htmlbarsSyntax;

        combined = plugin.transform(combined);
      }
    }

    return combined;
  }

  exports["default"] = preprocess;

  function HTMLProcessor(source, options) {
    this.options = options || {};
    this.elementStack = [];
    this.tokenizer = new _tokenizer.Tokenizer(new _EntityParser["default"](_fullCharRefs["default"]));
    this.nodeHandlers = _nodeHandlers2["default"];
    this.tokenHandlers = _tokenHandlers2["default"];

    if (typeof source === 'string') {
      this.source = splitLines(source);
    }
  }

  HTMLProcessor.prototype.acceptNode = function (node) {
    return this.nodeHandlers[node.type].call(this, node);
  };

  HTMLProcessor.prototype.acceptToken = function (token) {
    if (token) {
      return this.tokenHandlers[token.type].call(this, token);
    }
  };

  HTMLProcessor.prototype.currentElement = function () {
    return this.elementStack[this.elementStack.length - 1];
  };

  HTMLProcessor.prototype.sourceForMustache = function (mustache) {
    var firstLine = mustache.loc.start.line - 1;
    var lastLine = mustache.loc.end.line - 1;
    var currentLine = firstLine - 1;
    var firstColumn = mustache.loc.start.column + 2;
    var lastColumn = mustache.loc.end.column - 2;
    var string = [];
    var line;

    if (!this.source) {
      return '{{' + mustache.path.id.original + '}}';
    }

    while (currentLine < lastLine) {
      currentLine++;
      line = this.source[currentLine];

      if (currentLine === firstLine) {
        if (firstLine === lastLine) {
          string.push(line.slice(firstColumn, lastColumn));
        } else {
          string.push(line.slice(firstColumn));
        }
      } else if (currentLine === lastLine) {
        string.push(line.slice(0, lastColumn));
      } else {
        string.push(line);
      }
    }

    return string.join('\n');
  };
});
define("htmlbars-syntax/token-handlers", ["exports", "module", "./builders", "./utils", "../htmlbars-util/void-tag-names"], function (exports, module, _builders, _utils, _htmlbarsUtilVoidTagNames) {
  "use strict";

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _voidMap = _interopRequireDefault(_htmlbarsUtilVoidTagNames);

  // Except for `mustache`, all tokens are only allowed outside of
  // a start or end tag.
  var tokenHandlers = {
    Comment: function Comment(token) {
      var current = this.currentElement();
      var comment = (0, _builders.buildComment)(token.chars);
      (0, _utils.appendChild)(current, comment);
    },

    Chars: function Chars(token) {
      var current = this.currentElement();
      var text = (0, _builders.buildText)(token.chars);
      (0, _utils.appendChild)(current, text);
    },

    StartTag: function StartTag(tag) {
      var element = (0, _builders.buildElement)(tag.tagName, tag.attributes, tag.modifiers || [], []);
      element.loc = {
        source: null,
        start: { line: tag.loc.start.line, column: tag.loc.start.column },
        end: { line: null, column: null }
      };

      this.elementStack.push(element);
      if (_voidMap["default"].hasOwnProperty(tag.tagName) || tag.selfClosing) {
        tokenHandlers.EndTag.call(this, tag, true);
      }
    },

    BlockStatement: function BlockStatement() /*block*/{
      if (this.tokenizer.state === 'comment') {
        return;
      } else if (this.tokenizer.state !== 'data') {
        throw new Error("A block may only be used inside an HTML element or another block.");
      }
    },

    MustacheStatement: function MustacheStatement(mustache) {
      var tokenizer = this.tokenizer;

      switch (tokenizer.state) {
        // Tag helpers
        case "tagName":
          tokenizer.addElementModifier(mustache);
          tokenizer.state = "beforeAttributeName";
          return;
        case "beforeAttributeName":
          tokenizer.addElementModifier(mustache);
          return;
        case "attributeName":
        case "afterAttributeName":
          tokenizer.finalizeAttributeValue();
          tokenizer.addElementModifier(mustache);
          tokenizer.state = "beforeAttributeName";
          return;
        case "afterAttributeValueQuoted":
          tokenizer.addElementModifier(mustache);
          tokenizer.state = "beforeAttributeName";
          return;

        // Attribute values
        case "beforeAttributeValue":
          tokenizer.markAttributeQuoted(false);
          tokenizer.addToAttributeValue(mustache);
          tokenizer.state = 'attributeValueUnquoted';
          return;
        case "attributeValueDoubleQuoted":
        case "attributeValueSingleQuoted":
        case "attributeValueUnquoted":
          tokenizer.addToAttributeValue(mustache);
          return;

        // TODO: Only append child when the tokenizer state makes
        // sense to do so, otherwise throw an error.
        default:
          (0, _utils.appendChild)(this.currentElement(), mustache);
      }
    },

    EndTag: function EndTag(tag, selfClosing) {
      var element = this.elementStack.pop();
      var parent = this.currentElement();
      var disableComponentGeneration = this.options.disableComponentGeneration === true;

      validateEndTag(tag, element, selfClosing);

      element.loc.end.line = tag.loc.end.line;
      element.loc.end.column = tag.loc.end.column;

      if (disableComponentGeneration || element.tag.indexOf("-") === -1) {
        (0, _utils.appendChild)(parent, element);
      } else {
        var program = (0, _builders.buildProgram)(element.children);
        (0, _utils.parseComponentBlockParams)(element, program);
        var component = (0, _builders.buildComponent)(element.tag, element.attributes, program, element.loc);
        (0, _utils.appendChild)(parent, component);
      }
    }

  };

  function validateEndTag(tag, element, selfClosing) {
    var error;

    if (_voidMap["default"][tag.tagName] && !selfClosing) {
      // EngTag is also called by StartTag for void and self-closing tags (i.e.
      // <input> or <br />, so we need to check for that here. Otherwise, we would
      // throw an error for those cases.
      error = "Invalid end tag " + formatEndTagInfo(tag) + " (void elements cannot have end tags).";
    } else if (element.tag === undefined) {
      error = "Closing tag " + formatEndTagInfo(tag) + " without an open tag.";
    } else if (element.tag !== tag.tagName) {
      error = "Closing tag " + formatEndTagInfo(tag) + " did not match last open tag `" + element.tag + "` (on line " + element.loc.start.line + ").";
    }

    if (error) {
      throw new Error(error);
    }
  }

  function formatEndTagInfo(tag) {
    return "`" + tag.tagName + "` (on line " + tag.loc.end.line + ")";
  }

  module.exports = tokenHandlers;
});
define("htmlbars-syntax/tokenizer", ["exports", "../simple-html-tokenizer", "./utils", "../htmlbars-util/array-utils", "./builders"], function (exports, _simpleHtmlTokenizer, _utils, _htmlbarsUtilArrayUtils, _builders) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _builders2 = _interopRequireDefault(_builders);

  _simpleHtmlTokenizer.Tokenizer.prototype.createAttribute = function (char) {
    if (this.token.type === 'EndTag') {
      throw new Error('Invalid end tag: closing tag must not have attributes, in ' + formatTokenInfo(this) + '.');
    }
    this.currentAttribute = _builders2["default"].attr(char.toLowerCase(), [], null);
    this.token.attributes.push(this.currentAttribute);
    this.state = 'attributeName';
  };

  _simpleHtmlTokenizer.Tokenizer.prototype.markAttributeQuoted = function (value) {
    this.currentAttribute.quoted = value;
  };

  _simpleHtmlTokenizer.Tokenizer.prototype.addToAttributeName = function (char) {
    this.currentAttribute.name += char;
  };

  _simpleHtmlTokenizer.Tokenizer.prototype.addToAttributeValue = function (char) {
    var value = this.currentAttribute.value;

    if (!this.currentAttribute.quoted && char === '/') {
      throw new Error("A space is required between an unquoted attribute value and `/`, in " + formatTokenInfo(this) + '.');
    }
    if (!this.currentAttribute.quoted && value.length > 0 && (char.type === 'MustacheStatement' || value[0].type === 'MustacheStatement')) {
      throw new Error("Unquoted attribute value must be a single string or mustache (on line " + this.line + ")");
    }

    if (typeof char === 'object') {
      if (char.type === 'MustacheStatement') {
        value.push(char);
      } else {
        throw new Error("Unsupported node in attribute value: " + char.type);
      }
    } else {
      if (value.length > 0 && value[value.length - 1].type === 'TextNode') {
        value[value.length - 1].chars += char;
      } else {
        value.push(_builders2["default"].text(char));
      }
    }
  };

  _simpleHtmlTokenizer.Tokenizer.prototype.finalizeAttributeValue = function () {
    if (this.currentAttribute) {
      this.currentAttribute.value = prepareAttributeValue(this.currentAttribute);
      delete this.currentAttribute.quoted;
      delete this.currentAttribute;
    }
  };

  _simpleHtmlTokenizer.Tokenizer.prototype.addElementModifier = function (mustache) {
    if (!this.token.modifiers) {
      this.token.modifiers = [];
    }

    var path = mustache.path;
    var params = mustache.params;
    var hash = mustache.hash;
    var loc = mustache.loc;

    var modifier = _builders2["default"].elementModifier(path, params, hash, loc);
    this.token.modifiers.push(modifier);
  };

  function prepareAttributeValue(attr) {
    var parts = attr.value;
    var length = parts.length;

    if (length === 0) {
      return _builders2["default"].text('');
    } else if (length === 1 && parts[0].type === "TextNode") {
      return parts[0];
    } else if (!attr.quoted) {
      return parts[0];
    } else {
      return _builders2["default"].concat((0, _htmlbarsUtilArrayUtils.map)(parts, prepareConcatPart));
    }
  }

  function prepareConcatPart(node) {
    switch (node.type) {
      case 'TextNode':
        return _builders2["default"].string(node.chars);
      case 'MustacheStatement':
        return (0, _utils.unwrapMustache)(node);
      default:
        throw new Error("Unsupported node in quoted attribute value: " + node.type);
    }
  }

  function formatTokenInfo(tokenizer) {
    return '`' + tokenizer.token.tagName + '` (on line ' + tokenizer.line + ')';
  }

  exports.Tokenizer = _simpleHtmlTokenizer.Tokenizer;
});
define('htmlbars-syntax/utils', ['exports', '../htmlbars-util/array-utils'], function (exports, _htmlbarsUtilArrayUtils) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.parseComponentBlockParams = parseComponentBlockParams;
  exports.childrenFor = childrenFor;
  exports.appendChild = appendChild;
  exports.isHelper = isHelper;
  exports.unwrapMustache = unwrapMustache;

  // Regex to validate the identifier for block parameters.
  // Based on the ID validation regex in Handlebars.

  var ID_INVERSE_PATTERN = /[!"#%-,\.\/;->@\[-\^`\{-~]/;

  // Checks the component's attributes to see if it uses block params.
  // If it does, registers the block params with the program and
  // removes the corresponding attributes from the element.

  function parseComponentBlockParams(element, program) {
    var l = element.attributes.length;
    var attrNames = [];

    for (var i = 0; i < l; i++) {
      attrNames.push(element.attributes[i].name);
    }

    var asIndex = (0, _htmlbarsUtilArrayUtils.indexOfArray)(attrNames, 'as');

    if (asIndex !== -1 && l > asIndex && attrNames[asIndex + 1].charAt(0) === '|') {
      // Some basic validation, since we're doing the parsing ourselves
      var paramsString = attrNames.slice(asIndex).join(' ');
      if (paramsString.charAt(paramsString.length - 1) !== '|' || paramsString.match(/\|/g).length !== 2) {
        throw new Error('Invalid block parameters syntax: \'' + paramsString + '\'');
      }

      var params = [];
      for (i = asIndex + 1; i < l; i++) {
        var param = attrNames[i].replace(/\|/g, '');
        if (param !== '') {
          if (ID_INVERSE_PATTERN.test(param)) {
            throw new Error('Invalid identifier for block parameters: \'' + param + '\' in \'' + paramsString + '\'');
          }
          params.push(param);
        }
      }

      if (params.length === 0) {
        throw new Error('Cannot use zero block parameters: \'' + paramsString + '\'');
      }

      element.attributes = element.attributes.slice(0, asIndex);
      program.blockParams = params;
    }
  }

  function childrenFor(node) {
    if (node.type === 'Program') {
      return node.body;
    }
    if (node.type === 'ElementNode') {
      return node.children;
    }
  }

  function appendChild(parent, node) {
    childrenFor(parent).push(node);
  }

  function isHelper(mustache) {
    return mustache.params && mustache.params.length > 0 || mustache.hash && mustache.hash.pairs.length > 0;
  }

  function unwrapMustache(mustache) {
    if (isHelper(mustache)) {
      return mustache;
    } else {
      return mustache.path;
    }
  }
});
define('htmlbars-syntax/walker', ['exports', 'module'], function (exports, module) {
  'use strict';

  function Walker(order) {
    this.order = order;
    this.stack = [];
  }

  module.exports = Walker;

  Walker.prototype.visit = function (node, callback) {
    if (!node) {
      return;
    }

    this.stack.push(node);

    if (this.order === 'post') {
      this.children(node, callback);
      callback(node, this);
    } else {
      callback(node, this);
      this.children(node, callback);
    }

    this.stack.pop();
  };

  var visitors = {
    Program: function Program(walker, node, callback) {
      for (var i = 0; i < node.body.length; i++) {
        walker.visit(node.body[i], callback);
      }
    },

    ElementNode: function ElementNode(walker, node, callback) {
      for (var i = 0; i < node.children.length; i++) {
        walker.visit(node.children[i], callback);
      }
    },

    BlockStatement: function BlockStatement(walker, node, callback) {
      walker.visit(node.program, callback);
      walker.visit(node.inverse, callback);
    },

    ComponentNode: function ComponentNode(walker, node, callback) {
      walker.visit(node.program, callback);
    }
  };

  Walker.prototype.children = function (node, callback) {
    var visitor = visitors[node.type];
    if (visitor) {
      visitor(this, node, callback);
    }
  };
});
define("htmlbars-test-helpers", ["exports", "../simple-html-tokenizer", "../htmlbars-util/array-utils"], function (exports, _simpleHtmlTokenizer, _htmlbarsUtilArrayUtils) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.equalInnerHTML = equalInnerHTML;
  exports.equalHTML = equalHTML;
  exports.equalTokens = equalTokens;
  exports.normalizeInnerHTML = normalizeInnerHTML;
  exports.isCheckedInputHTML = isCheckedInputHTML;
  exports.getTextContent = getTextContent;
  exports.createObject = createObject;

  function equalInnerHTML(fragment, html) {
    var actualHTML = normalizeInnerHTML(fragment.innerHTML);
    QUnit.push(actualHTML === html, actualHTML, html);
  }

  function equalHTML(node, html) {
    var fragment;
    if (!node.nodeType && node.length) {
      fragment = document.createDocumentFragment();
      while (node[0]) {
        fragment.appendChild(node[0]);
      }
    } else {
      fragment = node;
    }

    var div = document.createElement("div");
    div.appendChild(fragment.cloneNode(true));

    equalInnerHTML(div, html);
  }

  // IE8 removes comments and does other unspeakable things with innerHTML
  var ie8GenerateTokensNeeded = (function () {
    var div = document.createElement("div");
    div.innerHTML = "<!-- foobar -->";
    return div.innerHTML === "";
  })();

  function generateTokens(fragmentOrHtml) {
    var div = document.createElement("div");
    if (typeof fragmentOrHtml === 'string') {
      div.innerHTML = fragmentOrHtml;
    } else {
      div.appendChild(fragmentOrHtml.cloneNode(true));
    }
    if (ie8GenerateTokensNeeded) {
      // IE8 drops comments and does other unspeakable things on `innerHTML`.
      // So in that case we do it to both the expected and actual so that they match.
      var div2 = document.createElement("div");
      div2.innerHTML = div.innerHTML;
      div.innerHTML = div2.innerHTML;
    }
    return { tokens: (0, _simpleHtmlTokenizer.tokenize)(div.innerHTML), html: div.innerHTML };
  }

  function equalTokens(fragment, html, message) {
    if (fragment.fragment) {
      fragment = fragment.fragment;
    }
    if (html.fragment) {
      html = html.fragment;
    }

    var fragTokens = generateTokens(fragment);
    var htmlTokens = generateTokens(html);

    function normalizeTokens(token) {
      if (token.type === 'StartTag') {
        token.attributes = token.attributes.sort(function (a, b) {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 0;
        });
      }
    }

    (0, _htmlbarsUtilArrayUtils.forEach)(fragTokens.tokens, normalizeTokens);
    (0, _htmlbarsUtilArrayUtils.forEach)(htmlTokens.tokens, normalizeTokens);

    var msg = "Expected: " + html + "; Actual: " + fragTokens.html;

    if (message) {
      msg += " (" + message + ")";
    }

    deepEqual(fragTokens.tokens, htmlTokens.tokens, msg);
  }

  // detect weird IE8 html strings
  var ie8InnerHTMLTestElement = document.createElement('div');
  ie8InnerHTMLTestElement.setAttribute('id', 'womp');
  var ie8InnerHTML = ie8InnerHTMLTestElement.outerHTML.indexOf('id=womp') > -1;

  // detect side-effects of cloning svg elements in IE9-11
  var ieSVGInnerHTML = (function () {
    if (!document.createElementNS) {
      return false;
    }
    var div = document.createElement('div');
    var node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    div.appendChild(node);
    var clone = div.cloneNode(true);
    return clone.innerHTML === '<svg xmlns="http://www.w3.org/2000/svg" />';
  })();

  function normalizeInnerHTML(actualHTML) {
    if (ie8InnerHTML) {
      // drop newlines in IE8
      actualHTML = actualHTML.replace(/\r\n/gm, '');
      // downcase ALLCAPS tags in IE8
      actualHTML = actualHTML.replace(/<\/?[A-Z\-]+/gi, function (tag) {
        return tag.toLowerCase();
      });
      // quote ids in IE8
      actualHTML = actualHTML.replace(/id=([^ >]+)/gi, function (match, id) {
        return 'id="' + id + '"';
      });
      // IE8 adds ':' to some tags
      // <keygen> becomes <:keygen>
      actualHTML = actualHTML.replace(/<(\/?):([^ >]+)/gi, function (match, slash, tag) {
        return '<' + slash + tag;
      });

      // Normalize the style attribute
      actualHTML = actualHTML.replace(/style="(.+?)"/gi, function (match, val) {
        return 'style="' + val.toLowerCase() + ';"';
      });
    }
    if (ieSVGInnerHTML) {
      // Replace `<svg xmlns="http://www.w3.org/2000/svg" height="50%" />` with `<svg height="50%"></svg>`, etc.
      // drop namespace attribute
      actualHTML = actualHTML.replace(/ xmlns="[^"]+"/, '');
      // replace self-closing elements
      actualHTML = actualHTML.replace(/<([^ >]+) [^\/>]*\/>/gi, function (tag, tagName) {
        return tag.slice(0, tag.length - 3) + '></' + tagName + '>';
      });
    }

    return actualHTML;
  }

  // detect weird IE8 checked element string
  var checkedInput = document.createElement('input');
  checkedInput.setAttribute('checked', 'checked');
  var checkedInputString = checkedInput.outerHTML;

  function isCheckedInputHTML(element) {
    equal(element.outerHTML, checkedInputString);
  }

  // check which property has the node's text content
  var textProperty = document.createElement('div').textContent === undefined ? 'innerText' : 'textContent';

  function getTextContent(el) {
    // textNode
    if (el.nodeType === 3) {
      return el.nodeValue;
    } else {
      return el[textProperty];
    }
  }

  // IE8 does not have Object.create, so use a polyfill if needed.
  // Polyfill based on Mozilla's (MDN)

  function createObject(obj) {
    if (typeof Object.create === 'function') {
      return Object.create(obj);
    } else {
      var Temp = function Temp() {};
      Temp.prototype = obj;
      return new Temp();
    }
  }
});
define('htmlbars-util', ['exports', './htmlbars-util/safe-string', './htmlbars-util/handlebars/utils', './htmlbars-util/namespaces', './htmlbars-util/morph-utils'], function (exports, _htmlbarsUtilSafeString, _htmlbarsUtilHandlebarsUtils, _htmlbarsUtilNamespaces, _htmlbarsUtilMorphUtils) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _SafeString = _interopRequireDefault(_htmlbarsUtilSafeString);

  exports.SafeString = _SafeString['default'];
  exports.escapeExpression = _htmlbarsUtilHandlebarsUtils.escapeExpression;
  exports.getAttrNamespace = _htmlbarsUtilNamespaces.getAttrNamespace;
  exports.validateChildMorphs = _htmlbarsUtilMorphUtils.validateChildMorphs;
  exports.linkParams = _htmlbarsUtilMorphUtils.linkParams;
  exports.dump = _htmlbarsUtilMorphUtils.dump;
});
define('htmlbars-util/array-utils', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.forEach = forEach;
  exports.map = map;

  function forEach(array, callback, binding) {
    var i, l;
    if (binding === undefined) {
      for (i = 0, l = array.length; i < l; i++) {
        callback(array[i], i, array);
      }
    } else {
      for (i = 0, l = array.length; i < l; i++) {
        callback.call(binding, array[i], i, array);
      }
    }
  }

  function map(array, callback) {
    var output = [];
    var i, l;

    for (i = 0, l = array.length; i < l; i++) {
      output.push(callback(array[i], i, array));
    }

    return output;
  }

  var getIdx;
  if (Array.prototype.indexOf) {
    getIdx = function (array, obj, from) {
      return array.indexOf(obj, from);
    };
  } else {
    getIdx = function (array, obj, from) {
      if (from === undefined || from === null) {
        from = 0;
      } else if (from < 0) {
        from = Math.max(0, array.length + from);
      }
      for (var i = from, l = array.length; i < l; i++) {
        if (array[i] === obj) {
          return i;
        }
      }
      return -1;
    };
  }

  var isArray = Array.isArray || function (array) {
    return Object.prototype.toString.call(array) === '[object Array]';
  };

  exports.isArray = isArray;
  var indexOfArray = getIdx;
  exports.indexOfArray = indexOfArray;
});
define('htmlbars-util/handlebars/safe-string', ['exports', 'module'], function (exports, module) {
  // Build out our basic SafeString type
  'use strict';

  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
    return '' + this.string;
  };

  module.exports = SafeString;
});
define('htmlbars-util/handlebars/utils', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.extend = extend;
  exports.indexOf = indexOf;
  exports.escapeExpression = escapeExpression;
  exports.isEmpty = isEmpty;
  exports.blockParams = blockParams;
  exports.appendContextPath = appendContextPath;
  var escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  var badChars = /[&<>"'`]/g,
      possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr];
  }

  function extend(obj /* , ...source */) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          obj[key] = arguments[i][key];
        }
      }
    }

    return obj;
  }

  var toString = Object.prototype.toString;

  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  /*eslint-disable func-style, no-var */
  exports.toString = toString;
  var isFunction = function isFunction(value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  /* istanbul ignore next */
  if (isFunction(/x/)) {
    exports.isFunction = isFunction = function (value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  /*eslint-enable func-style, no-var */

  /* istanbul ignore next */
  exports.isFunction = isFunction;
  var isArray = Array.isArray || function (value) {
    return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
  };

  // Older IE versions do not directly support indexOf so we must implement our own, sadly.
  exports.isArray = isArray;

  function indexOf(array, value) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  }

  function escapeExpression(string) {
    if (typeof string !== 'string') {
      // don't escape SafeStrings, since they're already safe
      if (string && string.toHTML) {
        return string.toHTML();
      } else if (string == null) {
        return '';
      } else if (!string) {
        return string + '';
      }

      // Force a string conversion as this will be done by the append regardless and
      // the regex test will do this transparently behind the scenes, causing issues if
      // an object's to string has escaped characters in it.
      string = '' + string;
    }

    if (!possible.test(string)) {
      return string;
    }
    return string.replace(badChars, escapeChar);
  }

  function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  function blockParams(params, ids) {
    params.path = ids;
    return params;
  }

  function appendContextPath(contextPath, id) {
    return (contextPath ? contextPath + '.' : '') + id;
  }
});
define("htmlbars-util/morph-utils", ["exports"], function (exports) {
  /*globals console*/

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.visitChildren = visitChildren;
  exports.validateChildMorphs = validateChildMorphs;
  exports.linkParams = linkParams;
  exports.dump = dump;

  function visitChildren(nodes, callback) {
    if (!nodes || nodes.length === 0) {
      return;
    }

    nodes = nodes.slice();

    while (nodes.length) {
      var node = nodes.pop();
      callback(node);

      if (node.childNodes) {
        nodes.push.apply(nodes, node.childNodes);
      } else if (node.firstChildMorph) {
        var current = node.firstChildMorph;

        while (current) {
          nodes.push(current);
          current = current.nextMorph;
        }
      } else if (node.morphList) {
        nodes.push(node.morphList);
      }
    }
  }

  function validateChildMorphs(env, morph, visitor) {
    var morphList = morph.morphList;
    if (morph.morphList) {
      var current = morphList.firstChildMorph;

      while (current) {
        var next = current.nextMorph;
        validateChildMorphs(env, current, visitor);
        current = next;
      }
    } else if (morph.lastResult) {
      morph.lastResult.revalidateWith(env, undefined, undefined, undefined, visitor);
    } else if (morph.childNodes) {
      // This means that the childNodes were wired up manually
      for (var i = 0, l = morph.childNodes.length; i < l; i++) {
        validateChildMorphs(env, morph.childNodes[i], visitor);
      }
    }
  }

  function linkParams(env, scope, morph, path, params, hash) {
    if (morph.linkedParams) {
      return;
    }

    if (env.hooks.linkRenderNode(morph, env, scope, path, params, hash)) {
      morph.linkedParams = { params: params, hash: hash };
    }
  }

  function dump(node) {
    console.group(node, node.isDirty);

    if (node.childNodes) {
      map(node.childNodes, dump);
    } else if (node.firstChildMorph) {
      var current = node.firstChildMorph;

      while (current) {
        dump(current);
        current = current.nextMorph;
      }
    } else if (node.morphList) {
      dump(node.morphList);
    }

    console.groupEnd();
  }

  function map(nodes, cb) {
    for (var i = 0, l = nodes.length; i < l; i++) {
      cb(nodes[i]);
    }
  }
});
define('htmlbars-util/namespaces', ['exports'], function (exports) {
  // ref http://dev.w3.org/html5/spec-LC/namespaces.html
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.getAttrNamespace = getAttrNamespace;
  var defaultNamespaces = {
    html: 'http://www.w3.org/1999/xhtml',
    mathml: 'http://www.w3.org/1998/Math/MathML',
    svg: 'http://www.w3.org/2000/svg',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace'
  };

  function getAttrNamespace(attrName) {
    var namespace;

    var colonIndex = attrName.indexOf(':');
    if (colonIndex !== -1) {
      var prefix = attrName.slice(0, colonIndex);
      namespace = defaultNamespaces[prefix];
    }

    return namespace || null;
  }
});
define('htmlbars-util/object-utils', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.merge = merge;
  exports.createObject = createObject;
  exports.objectKeys = objectKeys;
  exports.shallowCopy = shallowCopy;
  exports.keySet = keySet;
  exports.keyLength = keyLength;

  function merge(options, defaults) {
    for (var prop in defaults) {
      if (options.hasOwnProperty(prop)) {
        continue;
      }
      options[prop] = defaults[prop];
    }
    return options;
  }

  // IE8 does not have Object.create, so use a polyfill if needed.
  // Polyfill based on Mozilla's (MDN)

  function createObject(obj) {
    if (typeof Object.create === 'function') {
      return Object.create(obj);
    } else {
      var Temp = function Temp() {};
      Temp.prototype = obj;
      return new Temp();
    }
  }

  function objectKeys(obj) {
    if (typeof Object.keys === 'function') {
      return Object.keys(obj);
    } else {
      return legacyKeys(obj);
    }
  }

  function shallowCopy(obj) {
    return merge({}, obj);
  }

  function legacyKeys(obj) {
    var keys = [];

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        keys.push(prop);
      }
    }

    return keys;
  }

  function keySet(obj) {
    var set = {};

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        set[prop] = true;
      }
    }

    return set;
  }

  function keyLength(obj) {
    var count = 0;

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        count++;
      }
    }

    return count;
  }
});
define("htmlbars-util/quoting", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.hash = hash;
  exports.repeat = repeat;
  function escapeString(str) {
    str = str.replace(/\\/g, "\\\\");
    str = str.replace(/"/g, '\\"');
    str = str.replace(/\n/g, "\\n");
    return str;
  }

  exports.escapeString = escapeString;

  function string(str) {
    return '"' + escapeString(str) + '"';
  }

  exports.string = string;

  function array(a) {
    return "[" + a + "]";
  }

  exports.array = array;

  function hash(pairs) {
    return "{" + pairs.join(", ") + "}";
  }

  function repeat(chars, times) {
    var str = "";
    while (times--) {
      str += chars;
    }
    return str;
  }
});
define('htmlbars-util/safe-string', ['exports', 'module', './handlebars/safe-string'], function (exports, module, _handlebarsSafeString) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _SafeString = _interopRequireDefault(_handlebarsSafeString);

  module.exports = _SafeString['default'];
});
define("htmlbars-util/template-utils", ["exports", "../htmlbars-util/morph-utils"], function (exports, _htmlbarsUtilMorphUtils) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RenderState = RenderState;
  exports.blockFor = blockFor;
  exports.renderAndCleanup = renderAndCleanup;
  exports.clearMorph = clearMorph;
  exports.clearMorphList = clearMorphList;

  function RenderState(renderNode, morphList) {
    // The morph list that is no longer needed and can be
    // destroyed.
    this.morphListToClear = morphList;

    // The morph list that needs to be pruned of any items
    // that were not yielded on a subsequent render.
    this.morphListToPrune = null;

    // A map of morphs for each item yielded in during this
    // rendering pass. Any morphs in the DOM but not in this map
    // will be pruned during cleanup.
    this.handledMorphs = {};

    // The morph to clear once rendering is complete. By
    // default, we set this to the previous morph (to catch
    // the case where nothing is yielded; in that case, we
    // should just clear the morph). Otherwise this gets set
    // to null if anything is rendered.
    this.morphToClear = renderNode;

    this.shadowOptions = null;
  }

  function blockFor(render, template, blockOptions) {
    var block = function block(env, blockArguments, self, renderNode, parentScope, visitor) {
      if (renderNode.lastResult) {
        renderNode.lastResult.revalidateWith(env, undefined, self, blockArguments, visitor);
      } else {
        var options = { renderState: new RenderState(renderNode) };

        var scope = blockOptions.scope;
        var shadowScope = scope ? env.hooks.createChildScope(scope) : env.hooks.createFreshScope();
        var attributes = blockOptions.attributes;

        env.hooks.bindShadowScope(env, parentScope, shadowScope, blockOptions.options);

        if (self !== undefined) {
          env.hooks.bindSelf(env, shadowScope, self);
        } else if (blockOptions.self !== undefined) {
          env.hooks.bindSelf(env, shadowScope, blockOptions.self);
        }

        bindBlocks(env, shadowScope, blockOptions.yieldTo);

        renderAndCleanup(renderNode, env, options, null, function () {
          options.renderState.morphToClear = null;
          render(template, env, shadowScope, { renderNode: renderNode, blockArguments: blockArguments, attributes: attributes });
        });
      }
    };

    block.arity = template.arity;

    return block;
  }

  function bindBlocks(env, shadowScope, blocks) {
    if (!blocks) {
      return;
    }
    if (typeof blocks === 'function') {
      env.hooks.bindBlock(env, shadowScope, blocks);
    } else {
      for (var name in blocks) {
        if (blocks.hasOwnProperty(name)) {
          env.hooks.bindBlock(env, shadowScope, blocks[name], name);
        }
      }
    }
  }

  function renderAndCleanup(morph, env, options, shadowOptions, callback) {
    // The RenderState object is used to collect information about what the
    // helper or hook being invoked has yielded. Once it has finished either
    // yielding multiple items (via yieldItem) or a single template (via
    // yieldTemplate), we detect what was rendered and how it differs from
    // the previous render, cleaning up old state in DOM as appropriate.
    var renderState = options.renderState;
    renderState.shadowOptions = shadowOptions;

    // Invoke the callback, instructing it to save information about what it
    // renders into RenderState.
    var result = callback(options);

    // The hook can opt-out of cleanup if it handled cleanup itself.
    if (result && result.handled) {
      return;
    }

    var morphMap = morph.morphMap;

    // Walk the morph list, clearing any items that were yielded in a previous
    // render but were not yielded during this render.
    var morphList = renderState.morphListToPrune;
    if (morphList) {
      var handledMorphs = renderState.handledMorphs;
      var item = morphList.firstChildMorph;

      while (item) {
        var next = item.nextMorph;

        // If we don't see the key in handledMorphs, it wasn't
        // yielded in and we can safely remove it from DOM.
        if (!(item.key in handledMorphs)) {
          delete morphMap[item.key];
          clearMorph(item, env, true);
          item.destroy();
        }

        item = next;
      }
    }

    morphList = renderState.morphListToClear;
    if (morphList) {
      clearMorphList(morphList, morph, env);
    }

    var toClear = renderState.morphToClear;
    if (toClear) {
      clearMorph(toClear, env);
    }
  }

  function clearMorph(morph, env, destroySelf) {
    var cleanup = env.hooks.cleanupRenderNode;
    var destroy = env.hooks.destroyRenderNode;
    var willCleanup = env.hooks.willCleanupTree;
    var didCleanup = env.hooks.didCleanupTree;

    function destroyNode(node) {
      if (cleanup) {
        cleanup(node);
      }
      if (destroy) {
        destroy(node);
      }
    }

    if (willCleanup) {
      willCleanup(env, morph, destroySelf);
    }
    if (cleanup) {
      cleanup(morph);
    }
    if (destroySelf && destroy) {
      destroy(morph);
    }

    (0, _htmlbarsUtilMorphUtils.visitChildren)(morph.childNodes, destroyNode);

    // TODO: Deal with logical children that are not in the DOM tree
    morph.clear();
    if (didCleanup) {
      didCleanup(env, morph, destroySelf);
    }

    morph.lastResult = null;
    morph.lastYielded = null;
    morph.childNodes = null;
  }

  function clearMorphList(morphList, morph, env) {
    var item = morphList.firstChildMorph;

    while (item) {
      var next = item.nextMorph;
      delete morph.morphMap[item.key];
      clearMorph(item, env, true);
      item.destroy();

      item = next;
    }

    // Remove the MorphList from the morph.
    morphList.clear();
    morph.morphList = null;
  }
});
define("htmlbars-util/void-tag-names", ["exports", "module", "./array-utils"], function (exports, module, _arrayUtils) {
  "use strict";

  // The HTML elements in this list are speced by
  // http://www.w3.org/TR/html-markup/syntax.html#syntax-elements,
  // and will be forced to close regardless of if they have a
  // self-closing /> at the end.
  var voidTagNames = "area base br col command embed hr img input keygen link meta param source track wbr";
  var voidMap = {};

  (0, _arrayUtils.forEach)(voidTagNames.split(" "), function (tagName) {
    voidMap[tagName] = true;
  });

  module.exports = voidMap;
});
define("htmlbars", ["exports", "./htmlbars-syntax", "./htmlbars-compiler/compiler", "./htmlbars-syntax/walker"], function (exports, _htmlbarsSyntax, _htmlbarsCompilerCompiler, _htmlbarsSyntaxWalker) {
  /*
   * @overview  HTMLBars
   * @copyright Copyright 2011-2014 Tilde Inc. and contributors
   * @license   Licensed under MIT license
   *            See https://raw.githubusercontent.com/tildeio/htmlbars/master/LICENSE
   * @version   0.13.30.7d5338d4
   */

  // Break cycles in the module loader.
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _Walker = _interopRequireDefault(_htmlbarsSyntaxWalker);

  exports.compile = _htmlbarsCompilerCompiler.compile;
  exports.compileSpec = _htmlbarsCompilerCompiler.compileSpec;
  exports.Walker = _Walker["default"];
});
define("morph-attr", ["exports", "./morph-attr/sanitize-attribute-value", "./dom-helper/prop", "./dom-helper/build-html-dom", "./htmlbars-util"], function (exports, _morphAttrSanitizeAttributeValue, _domHelperProp, _domHelperBuildHtmlDom, _htmlbarsUtil) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function getProperty() {
    return this.domHelper.getPropertyStrict(this.element, this.attrName);
  }

  function updateProperty(value) {
    if (this._renderedInitially === true || !(0, _domHelperProp.isAttrRemovalValue)(value)) {
      // do not render if initial value is undefined or null
      this.domHelper.setPropertyStrict(this.element, this.attrName, value);
    }

    this._renderedInitially = true;
  }

  function getAttribute() {
    return this.domHelper.getAttribute(this.element, this.attrName);
  }

  function updateAttribute(value) {
    if ((0, _domHelperProp.isAttrRemovalValue)(value)) {
      this.domHelper.removeAttribute(this.element, this.attrName);
    } else {
      this.domHelper.setAttribute(this.element, this.attrName, value);
    }
  }

  function getAttributeNS() {
    return this.domHelper.getAttributeNS(this.element, this.namespace, this.attrName);
  }

  function updateAttributeNS(value) {
    if ((0, _domHelperProp.isAttrRemovalValue)(value)) {
      this.domHelper.removeAttribute(this.element, this.attrName);
    } else {
      this.domHelper.setAttributeNS(this.element, this.namespace, this.attrName, value);
    }
  }

  var UNSET = { unset: true };

  var guid = 1;

  function AttrMorph(element, attrName, domHelper, namespace) {
    this.element = element;
    this.domHelper = domHelper;
    this.namespace = namespace !== undefined ? namespace : (0, _htmlbarsUtil.getAttrNamespace)(attrName);
    this.state = {};
    this.isDirty = false;
    this.isSubtreeDirty = false;
    this.escaped = true;
    this.lastValue = UNSET;
    this.lastResult = null;
    this.lastYielded = null;
    this.childNodes = null;
    this.linkedParams = null;
    this.linkedResult = null;
    this.guid = "attr" + guid++;
    this.ownerNode = null;
    this.rendered = false;
    this._renderedInitially = false;

    var normalizedAttrName = (0, _domHelperProp.normalizeProperty)(this.element, attrName);
    if (this.namespace) {
      this._update = updateAttributeNS;
      this._get = getAttributeNS;
      this.attrName = attrName;
    } else {
      if (element.namespaceURI === _domHelperBuildHtmlDom.svgNamespace || attrName === 'style' || !normalizedAttrName) {
        this._update = updateAttribute;
        this._get = getAttribute;
        this.attrName = attrName;
      } else {
        this._update = updateProperty;
        this._get = getProperty;
        this.attrName = normalizedAttrName;
      }
    }
  }

  AttrMorph.prototype.setContent = function (value) {
    if (this.lastValue === value) {
      return;
    }
    this.lastValue = value;

    if (this.escaped) {
      var sanitized = (0, _morphAttrSanitizeAttributeValue.sanitizeAttributeValue)(this.domHelper, this.element, this.attrName, value);
      this._update(sanitized, this.namespace);
    } else {
      this._update(value, this.namespace);
    }
  };

  AttrMorph.prototype.getContent = function () {
    var value = this.lastValue = this._get();
    return value;
  };

  // renderAndCleanup calls `clear` on all items in the morph map
  // just before calling `destroy` on the morph.
  //
  // As a future refactor this could be changed to set the property
  // back to its original/default value.
  AttrMorph.prototype.clear = function () {};

  AttrMorph.prototype.destroy = function () {
    this.element = null;
    this.domHelper = null;
  };

  exports["default"] = AttrMorph;
  exports.sanitizeAttributeValue = _morphAttrSanitizeAttributeValue.sanitizeAttributeValue;
});
define('morph-attr/sanitize-attribute-value', ['exports'], function (exports) {
  /* jshint scripturl:true */

  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.sanitizeAttributeValue = sanitizeAttributeValue;
  var badProtocols = {
    'javascript:': true,
    'vbscript:': true
  };

  var badTags = {
    'A': true,
    'BODY': true,
    'LINK': true,
    'IMG': true,
    'IFRAME': true,
    'BASE': true
  };

  var badTagsForDataURI = {
    'EMBED': true
  };

  var badAttributes = {
    'href': true,
    'src': true,
    'background': true
  };

  exports.badAttributes = badAttributes;
  var badAttributesForDataURI = {
    'src': true
  };

  function sanitizeAttributeValue(dom, element, attribute, value) {
    var tagName;

    if (!element) {
      tagName = null;
    } else {
      tagName = element.tagName.toUpperCase();
    }

    if (value && value.toHTML) {
      return value.toHTML();
    }

    if ((tagName === null || badTags[tagName]) && badAttributes[attribute]) {
      var protocol = dom.protocolForURL(value);
      if (badProtocols[protocol] === true) {
        return 'unsafe:' + value;
      }
    }

    if (badTagsForDataURI[tagName] && badAttributesForDataURI[attribute]) {
      return 'unsafe:' + value;
    }

    return value;
  }
});
define('morph-range', ['exports', 'module', './morph-range/utils'], function (exports, module, _morphRangeUtils) {
  'use strict';

  // constructor just initializes the fields
  // use one of the static initializers to create a valid morph.
  function Morph(domHelper, contextualElement) {
    this.domHelper = domHelper;
    // context if content if current content is detached
    this.contextualElement = contextualElement;
    // inclusive range of morph
    // these should be nodeType 1, 3, or 8
    this.firstNode = null;
    this.lastNode = null;

    // flag to force text to setContent to be treated as html
    this.parseTextAsHTML = false;

    // morph list graph
    this.parentMorphList = null;
    this.previousMorph = null;
    this.nextMorph = null;
  }

  Morph.empty = function (domHelper, contextualElement) {
    var morph = new Morph(domHelper, contextualElement);
    morph.clear();
    return morph;
  };

  Morph.create = function (domHelper, contextualElement, node) {
    var morph = new Morph(domHelper, contextualElement);
    morph.setNode(node);
    return morph;
  };

  Morph.attach = function (domHelper, contextualElement, firstNode, lastNode) {
    var morph = new Morph(domHelper, contextualElement);
    morph.setRange(firstNode, lastNode);
    return morph;
  };

  Morph.prototype.setContent = function Morph$setContent(content) {
    if (content === null || content === undefined) {
      return this.clear();
    }

    var type = typeof content;
    switch (type) {
      case 'string':
        if (this.parseTextAsHTML) {
          return this.setHTML(content);
        }
        return this.setText(content);
      case 'object':
        if (typeof content.nodeType === 'number') {
          return this.setNode(content);
        }
        /* Handlebars.SafeString */
        if (typeof content.string === 'string') {
          return this.setHTML(content.string);
        }
        if (this.parseTextAsHTML) {
          return this.setHTML(content.toString());
        }
      /* falls through */
      case 'boolean':
      case 'number':
        return this.setText(content.toString());
      default:
        throw new TypeError('unsupported content');
    }
  };

  Morph.prototype.clear = function Morph$clear() {
    var node = this.setNode(this.domHelper.createComment(''));
    return node;
  };

  Morph.prototype.setText = function Morph$setText(text) {
    var firstNode = this.firstNode;
    var lastNode = this.lastNode;

    if (firstNode && lastNode === firstNode && firstNode.nodeType === 3) {
      firstNode.nodeValue = text;
      return firstNode;
    }

    return this.setNode(text ? this.domHelper.createTextNode(text) : this.domHelper.createComment(''));
  };

  Morph.prototype.setNode = function Morph$setNode(newNode) {
    var firstNode, lastNode;
    switch (newNode.nodeType) {
      case 3:
        firstNode = newNode;
        lastNode = newNode;
        break;
      case 11:
        firstNode = newNode.firstChild;
        lastNode = newNode.lastChild;
        if (firstNode === null) {
          firstNode = this.domHelper.createComment('');
          newNode.appendChild(firstNode);
          lastNode = firstNode;
        }
        break;
      default:
        firstNode = newNode;
        lastNode = newNode;
        break;
    }

    this.setRange(firstNode, lastNode);

    return newNode;
  };

  Morph.prototype.setRange = function (firstNode, lastNode) {
    var previousFirstNode = this.firstNode;
    if (previousFirstNode !== null) {

      var parentNode = previousFirstNode.parentNode;
      if (parentNode !== null) {
        (0, _morphRangeUtils.insertBefore)(parentNode, firstNode, lastNode, previousFirstNode);
        (0, _morphRangeUtils.clear)(parentNode, previousFirstNode, this.lastNode);
      }
    }

    this.firstNode = firstNode;
    this.lastNode = lastNode;

    if (this.parentMorphList) {
      this._syncFirstNode();
      this._syncLastNode();
    }
  };

  Morph.prototype.destroy = function Morph$destroy() {
    this.unlink();

    var firstNode = this.firstNode;
    var lastNode = this.lastNode;
    var parentNode = firstNode && firstNode.parentNode;

    this.firstNode = null;
    this.lastNode = null;

    (0, _morphRangeUtils.clear)(parentNode, firstNode, lastNode);
  };

  Morph.prototype.unlink = function Morph$unlink() {
    var parentMorphList = this.parentMorphList;
    var previousMorph = this.previousMorph;
    var nextMorph = this.nextMorph;

    if (previousMorph) {
      if (nextMorph) {
        previousMorph.nextMorph = nextMorph;
        nextMorph.previousMorph = previousMorph;
      } else {
        previousMorph.nextMorph = null;
        parentMorphList.lastChildMorph = previousMorph;
      }
    } else {
      if (nextMorph) {
        nextMorph.previousMorph = null;
        parentMorphList.firstChildMorph = nextMorph;
      } else if (parentMorphList) {
        parentMorphList.lastChildMorph = parentMorphList.firstChildMorph = null;
      }
    }

    this.parentMorphList = null;
    this.nextMorph = null;
    this.previousMorph = null;

    if (parentMorphList && parentMorphList.mountedMorph) {
      if (!parentMorphList.firstChildMorph) {
        // list is empty
        parentMorphList.mountedMorph.clear();
        return;
      } else {
        parentMorphList.firstChildMorph._syncFirstNode();
        parentMorphList.lastChildMorph._syncLastNode();
      }
    }
  };

  Morph.prototype.setHTML = function (text) {
    var fragment = this.domHelper.parseHTML(text, this.contextualElement);
    return this.setNode(fragment);
  };

  Morph.prototype.setMorphList = function Morph$appendMorphList(morphList) {
    morphList.mountedMorph = this;
    this.clear();

    var originalFirstNode = this.firstNode;

    if (morphList.firstChildMorph) {
      this.firstNode = morphList.firstChildMorph.firstNode;
      this.lastNode = morphList.lastChildMorph.lastNode;

      var current = morphList.firstChildMorph;

      while (current) {
        var next = current.nextMorph;
        current.insertBeforeNode(originalFirstNode, null);
        current = next;
      }
      originalFirstNode.parentNode.removeChild(originalFirstNode);
    }
  };

  Morph.prototype._syncFirstNode = function Morph$syncFirstNode() {
    var morph = this;
    var parentMorphList;
    while (parentMorphList = morph.parentMorphList) {
      if (parentMorphList.mountedMorph === null) {
        break;
      }
      if (morph !== parentMorphList.firstChildMorph) {
        break;
      }
      if (morph.firstNode === parentMorphList.mountedMorph.firstNode) {
        break;
      }

      parentMorphList.mountedMorph.firstNode = morph.firstNode;

      morph = parentMorphList.mountedMorph;
    }
  };

  Morph.prototype._syncLastNode = function Morph$syncLastNode() {
    var morph = this;
    var parentMorphList;
    while (parentMorphList = morph.parentMorphList) {
      if (parentMorphList.mountedMorph === null) {
        break;
      }
      if (morph !== parentMorphList.lastChildMorph) {
        break;
      }
      if (morph.lastNode === parentMorphList.mountedMorph.lastNode) {
        break;
      }

      parentMorphList.mountedMorph.lastNode = morph.lastNode;

      morph = parentMorphList.mountedMorph;
    }
  };

  Morph.prototype.insertBeforeNode = function Morph$insertBeforeNode(parent, reference) {
    var current = this.firstNode;

    while (current) {
      var next = current.nextSibling;
      parent.insertBefore(current, reference);
      current = next;
    }
  };

  Morph.prototype.appendToNode = function Morph$appendToNode(parent) {
    this.insertBeforeNode(parent, null);
  };

  module.exports = Morph;
});
define('morph-range.umd', ['exports', './morph-range'], function (exports, _morphRange) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Morph = _interopRequireDefault(_morphRange);

  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], factory);
    } else if (typeof exports === 'object') {
      module.exports = factory();
    } else {
      root.Morph = factory();
    }
  })(undefined, function () {
    return _Morph['default'];
  });
});
define('morph-range/morph-list', ['exports', 'module', './utils'], function (exports, module, _utils) {
  'use strict';

  function MorphList() {
    // morph graph
    this.firstChildMorph = null;
    this.lastChildMorph = null;

    this.mountedMorph = null;
  }

  var prototype = MorphList.prototype;

  prototype.clear = function MorphList$clear() {
    var current = this.firstChildMorph;

    while (current) {
      var next = current.nextMorph;
      current.previousMorph = null;
      current.nextMorph = null;
      current.parentMorphList = null;
      current = next;
    }

    this.firstChildMorph = this.lastChildMorph = null;
  };

  prototype.destroy = function MorphList$destroy() {};

  prototype.appendMorph = function MorphList$appendMorph(morph) {
    this.insertBeforeMorph(morph, null);
  };

  prototype.insertBeforeMorph = function MorphList$insertBeforeMorph(morph, referenceMorph) {
    if (morph.parentMorphList !== null) {
      morph.unlink();
    }
    if (referenceMorph && referenceMorph.parentMorphList !== this) {
      throw new Error('The morph before which the new morph is to be inserted is not a child of this morph.');
    }

    var mountedMorph = this.mountedMorph;

    if (mountedMorph) {

      var parentNode = mountedMorph.firstNode.parentNode;
      var referenceNode = referenceMorph ? referenceMorph.firstNode : mountedMorph.lastNode.nextSibling;

      (0, _utils.insertBefore)(parentNode, morph.firstNode, morph.lastNode, referenceNode);

      // was not in list mode replace current content
      if (!this.firstChildMorph) {
        (0, _utils.clear)(this.mountedMorph.firstNode.parentNode, this.mountedMorph.firstNode, this.mountedMorph.lastNode);
      }
    }

    morph.parentMorphList = this;

    var previousMorph = referenceMorph ? referenceMorph.previousMorph : this.lastChildMorph;
    if (previousMorph) {
      previousMorph.nextMorph = morph;
      morph.previousMorph = previousMorph;
    } else {
      this.firstChildMorph = morph;
    }

    if (referenceMorph) {
      referenceMorph.previousMorph = morph;
      morph.nextMorph = referenceMorph;
    } else {
      this.lastChildMorph = morph;
    }

    this.firstChildMorph._syncFirstNode();
    this.lastChildMorph._syncLastNode();
  };

  prototype.removeChildMorph = function MorphList$removeChildMorph(morph) {
    if (morph.parentMorphList !== this) {
      throw new Error("Cannot remove a morph from a parent it is not inside of");
    }

    morph.destroy();
  };

  module.exports = MorphList;
});
define('morph-range/morph-list.umd', ['exports', './morph-list'], function (exports, _morphList) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _MorphList = _interopRequireDefault(_morphList);

  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], factory);
    } else if (typeof exports === 'object') {
      module.exports = factory();
    } else {
      root.MorphList = factory();
    }
  })(undefined, function () {
    return _MorphList['default'];
  });
});
define("morph-range/utils", ["exports"], function (exports) {
  // inclusive of both nodes
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.clear = clear;
  exports.insertBefore = insertBefore;

  function clear(parentNode, firstNode, lastNode) {
    if (!parentNode) {
      return;
    }

    var node = firstNode;
    var nextNode;
    do {
      nextNode = node.nextSibling;
      parentNode.removeChild(node);
      if (node === lastNode) {
        break;
      }
      node = nextNode;
    } while (node);
  }

  function insertBefore(parentNode, firstNode, lastNode, _refNode) {
    var node = lastNode;
    var refNode = _refNode;
    var prevNode;
    do {
      prevNode = node.previousSibling;
      parentNode.insertBefore(node, refNode);
      if (node === firstNode) {
        break;
      }
      refNode = node;
      node = prevNode;
    } while (node);
  }
});
define('simple-html-tokenizer', ['exports', './simple-html-tokenizer/tokenizer', './simple-html-tokenizer/tokenize', './simple-html-tokenizer/generator', './simple-html-tokenizer/generate', './simple-html-tokenizer/tokens'], function (exports, _simpleHtmlTokenizerTokenizer, _simpleHtmlTokenizerTokenize, _simpleHtmlTokenizerGenerator, _simpleHtmlTokenizerGenerate, _simpleHtmlTokenizerTokens) {
  /*jshint boss:true*/
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Tokenizer = _interopRequireDefault(_simpleHtmlTokenizerTokenizer);

  var _tokenize = _interopRequireDefault(_simpleHtmlTokenizerTokenize);

  var _Generator = _interopRequireDefault(_simpleHtmlTokenizerGenerator);

  var _generate = _interopRequireDefault(_simpleHtmlTokenizerGenerate);

  exports.Tokenizer = _Tokenizer['default'];
  exports.tokenize = _tokenize['default'];
  exports.Generator = _Generator['default'];
  exports.generate = _generate['default'];
  exports.StartTag = _simpleHtmlTokenizerTokens.StartTag;
  exports.EndTag = _simpleHtmlTokenizerTokens.EndTag;
  exports.Chars = _simpleHtmlTokenizerTokens.Chars;
  exports.Comment = _simpleHtmlTokenizerTokens.Comment;
});
define('simple-html-tokenizer.umd', ['exports', './simple-html-tokenizer'], function (exports, _simpleHtmlTokenizer) {
  /* global define:false, module:false */
  'use strict';

  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], factory);
    } else if (typeof exports === 'object') {
      module.exports = factory();
    } else {
      root.HTML5Tokenizer = factory();
    }
  })(undefined, function () {
    return {
      Tokenizer: _simpleHtmlTokenizer.Tokenizer,
      tokenize: _simpleHtmlTokenizer.tokenize,
      Generator: _simpleHtmlTokenizer.Generator,
      generate: _simpleHtmlTokenizer.generate,
      StartTag: _simpleHtmlTokenizer.StartTag,
      EndTag: _simpleHtmlTokenizer.EndTag,
      Chars: _simpleHtmlTokenizer.Chars,
      Comment: _simpleHtmlTokenizer.Comment
    };
  });
});
define("simple-html-tokenizer/char-refs/full", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = {
    AElig: [198],
    AMP: [38],
    Aacute: [193],
    Abreve: [258],
    Acirc: [194],
    Acy: [1040],
    Afr: [120068],
    Agrave: [192],
    Alpha: [913],
    Amacr: [256],
    And: [10835],
    Aogon: [260],
    Aopf: [120120],
    ApplyFunction: [8289],
    Aring: [197],
    Ascr: [119964],
    Assign: [8788],
    Atilde: [195],
    Auml: [196],
    Backslash: [8726],
    Barv: [10983],
    Barwed: [8966],
    Bcy: [1041],
    Because: [8757],
    Bernoullis: [8492],
    Beta: [914],
    Bfr: [120069],
    Bopf: [120121],
    Breve: [728],
    Bscr: [8492],
    Bumpeq: [8782],
    CHcy: [1063],
    COPY: [169],
    Cacute: [262],
    Cap: [8914],
    CapitalDifferentialD: [8517],
    Cayleys: [8493],
    Ccaron: [268],
    Ccedil: [199],
    Ccirc: [264],
    Cconint: [8752],
    Cdot: [266],
    Cedilla: [184],
    CenterDot: [183],
    Cfr: [8493],
    Chi: [935],
    CircleDot: [8857],
    CircleMinus: [8854],
    CirclePlus: [8853],
    CircleTimes: [8855],
    ClockwiseContourIntegral: [8754],
    CloseCurlyDoubleQuote: [8221],
    CloseCurlyQuote: [8217],
    Colon: [8759],
    Colone: [10868],
    Congruent: [8801],
    Conint: [8751],
    ContourIntegral: [8750],
    Copf: [8450],
    Coproduct: [8720],
    CounterClockwiseContourIntegral: [8755],
    Cross: [10799],
    Cscr: [119966],
    Cup: [8915],
    CupCap: [8781],
    DD: [8517],
    DDotrahd: [10513],
    DJcy: [1026],
    DScy: [1029],
    DZcy: [1039],
    Dagger: [8225],
    Darr: [8609],
    Dashv: [10980],
    Dcaron: [270],
    Dcy: [1044],
    Del: [8711],
    Delta: [916],
    Dfr: [120071],
    DiacriticalAcute: [180],
    DiacriticalDot: [729],
    DiacriticalDoubleAcute: [733],
    DiacriticalGrave: [96],
    DiacriticalTilde: [732],
    Diamond: [8900],
    DifferentialD: [8518],
    Dopf: [120123],
    Dot: [168],
    DotDot: [8412],
    DotEqual: [8784],
    DoubleContourIntegral: [8751],
    DoubleDot: [168],
    DoubleDownArrow: [8659],
    DoubleLeftArrow: [8656],
    DoubleLeftRightArrow: [8660],
    DoubleLeftTee: [10980],
    DoubleLongLeftArrow: [10232],
    DoubleLongLeftRightArrow: [10234],
    DoubleLongRightArrow: [10233],
    DoubleRightArrow: [8658],
    DoubleRightTee: [8872],
    DoubleUpArrow: [8657],
    DoubleUpDownArrow: [8661],
    DoubleVerticalBar: [8741],
    DownArrow: [8595],
    DownArrowBar: [10515],
    DownArrowUpArrow: [8693],
    DownBreve: [785],
    DownLeftRightVector: [10576],
    DownLeftTeeVector: [10590],
    DownLeftVector: [8637],
    DownLeftVectorBar: [10582],
    DownRightTeeVector: [10591],
    DownRightVector: [8641],
    DownRightVectorBar: [10583],
    DownTee: [8868],
    DownTeeArrow: [8615],
    Downarrow: [8659],
    Dscr: [119967],
    Dstrok: [272],
    ENG: [330],
    ETH: [208],
    Eacute: [201],
    Ecaron: [282],
    Ecirc: [202],
    Ecy: [1069],
    Edot: [278],
    Efr: [120072],
    Egrave: [200],
    Element: [8712],
    Emacr: [274],
    EmptySmallSquare: [9723],
    EmptyVerySmallSquare: [9643],
    Eogon: [280],
    Eopf: [120124],
    Epsilon: [917],
    Equal: [10869],
    EqualTilde: [8770],
    Equilibrium: [8652],
    Escr: [8496],
    Esim: [10867],
    Eta: [919],
    Euml: [203],
    Exists: [8707],
    ExponentialE: [8519],
    Fcy: [1060],
    Ffr: [120073],
    FilledSmallSquare: [9724],
    FilledVerySmallSquare: [9642],
    Fopf: [120125],
    ForAll: [8704],
    Fouriertrf: [8497],
    Fscr: [8497],
    GJcy: [1027],
    GT: [62],
    Gamma: [915],
    Gammad: [988],
    Gbreve: [286],
    Gcedil: [290],
    Gcirc: [284],
    Gcy: [1043],
    Gdot: [288],
    Gfr: [120074],
    Gg: [8921],
    Gopf: [120126],
    GreaterEqual: [8805],
    GreaterEqualLess: [8923],
    GreaterFullEqual: [8807],
    GreaterGreater: [10914],
    GreaterLess: [8823],
    GreaterSlantEqual: [10878],
    GreaterTilde: [8819],
    Gscr: [119970],
    Gt: [8811],
    HARDcy: [1066],
    Hacek: [711],
    Hat: [94],
    Hcirc: [292],
    Hfr: [8460],
    HilbertSpace: [8459],
    Hopf: [8461],
    HorizontalLine: [9472],
    Hscr: [8459],
    Hstrok: [294],
    HumpDownHump: [8782],
    HumpEqual: [8783],
    IEcy: [1045],
    IJlig: [306],
    IOcy: [1025],
    Iacute: [205],
    Icirc: [206],
    Icy: [1048],
    Idot: [304],
    Ifr: [8465],
    Igrave: [204],
    Im: [8465],
    Imacr: [298],
    ImaginaryI: [8520],
    Implies: [8658],
    Int: [8748],
    Integral: [8747],
    Intersection: [8898],
    InvisibleComma: [8291],
    InvisibleTimes: [8290],
    Iogon: [302],
    Iopf: [120128],
    Iota: [921],
    Iscr: [8464],
    Itilde: [296],
    Iukcy: [1030],
    Iuml: [207],
    Jcirc: [308],
    Jcy: [1049],
    Jfr: [120077],
    Jopf: [120129],
    Jscr: [119973],
    Jsercy: [1032],
    Jukcy: [1028],
    KHcy: [1061],
    KJcy: [1036],
    Kappa: [922],
    Kcedil: [310],
    Kcy: [1050],
    Kfr: [120078],
    Kopf: [120130],
    Kscr: [119974],
    LJcy: [1033],
    LT: [60],
    Lacute: [313],
    Lambda: [923],
    Lang: [10218],
    Laplacetrf: [8466],
    Larr: [8606],
    Lcaron: [317],
    Lcedil: [315],
    Lcy: [1051],
    LeftAngleBracket: [10216],
    LeftArrow: [8592],
    LeftArrowBar: [8676],
    LeftArrowRightArrow: [8646],
    LeftCeiling: [8968],
    LeftDoubleBracket: [10214],
    LeftDownTeeVector: [10593],
    LeftDownVector: [8643],
    LeftDownVectorBar: [10585],
    LeftFloor: [8970],
    LeftRightArrow: [8596],
    LeftRightVector: [10574],
    LeftTee: [8867],
    LeftTeeArrow: [8612],
    LeftTeeVector: [10586],
    LeftTriangle: [8882],
    LeftTriangleBar: [10703],
    LeftTriangleEqual: [8884],
    LeftUpDownVector: [10577],
    LeftUpTeeVector: [10592],
    LeftUpVector: [8639],
    LeftUpVectorBar: [10584],
    LeftVector: [8636],
    LeftVectorBar: [10578],
    Leftarrow: [8656],
    Leftrightarrow: [8660],
    LessEqualGreater: [8922],
    LessFullEqual: [8806],
    LessGreater: [8822],
    LessLess: [10913],
    LessSlantEqual: [10877],
    LessTilde: [8818],
    Lfr: [120079],
    Ll: [8920],
    Lleftarrow: [8666],
    Lmidot: [319],
    LongLeftArrow: [10229],
    LongLeftRightArrow: [10231],
    LongRightArrow: [10230],
    Longleftarrow: [10232],
    Longleftrightarrow: [10234],
    Longrightarrow: [10233],
    Lopf: [120131],
    LowerLeftArrow: [8601],
    LowerRightArrow: [8600],
    Lscr: [8466],
    Lsh: [8624],
    Lstrok: [321],
    Lt: [8810],
    Map: [10501],
    Mcy: [1052],
    MediumSpace: [8287],
    Mellintrf: [8499],
    Mfr: [120080],
    MinusPlus: [8723],
    Mopf: [120132],
    Mscr: [8499],
    Mu: [924],
    NJcy: [1034],
    Nacute: [323],
    Ncaron: [327],
    Ncedil: [325],
    Ncy: [1053],
    NegativeMediumSpace: [8203],
    NegativeThickSpace: [8203],
    NegativeThinSpace: [8203],
    NegativeVeryThinSpace: [8203],
    NestedGreaterGreater: [8811],
    NestedLessLess: [8810],
    NewLine: [10],
    Nfr: [120081],
    NoBreak: [8288],
    NonBreakingSpace: [160],
    Nopf: [8469],
    Not: [10988],
    NotCongruent: [8802],
    NotCupCap: [8813],
    NotDoubleVerticalBar: [8742],
    NotElement: [8713],
    NotEqual: [8800],
    NotEqualTilde: [8770, 824],
    NotExists: [8708],
    NotGreater: [8815],
    NotGreaterEqual: [8817],
    NotGreaterFullEqual: [8807, 824],
    NotGreaterGreater: [8811, 824],
    NotGreaterLess: [8825],
    NotGreaterSlantEqual: [10878, 824],
    NotGreaterTilde: [8821],
    NotHumpDownHump: [8782, 824],
    NotHumpEqual: [8783, 824],
    NotLeftTriangle: [8938],
    NotLeftTriangleBar: [10703, 824],
    NotLeftTriangleEqual: [8940],
    NotLess: [8814],
    NotLessEqual: [8816],
    NotLessGreater: [8824],
    NotLessLess: [8810, 824],
    NotLessSlantEqual: [10877, 824],
    NotLessTilde: [8820],
    NotNestedGreaterGreater: [10914, 824],
    NotNestedLessLess: [10913, 824],
    NotPrecedes: [8832],
    NotPrecedesEqual: [10927, 824],
    NotPrecedesSlantEqual: [8928],
    NotReverseElement: [8716],
    NotRightTriangle: [8939],
    NotRightTriangleBar: [10704, 824],
    NotRightTriangleEqual: [8941],
    NotSquareSubset: [8847, 824],
    NotSquareSubsetEqual: [8930],
    NotSquareSuperset: [8848, 824],
    NotSquareSupersetEqual: [8931],
    NotSubset: [8834, 8402],
    NotSubsetEqual: [8840],
    NotSucceeds: [8833],
    NotSucceedsEqual: [10928, 824],
    NotSucceedsSlantEqual: [8929],
    NotSucceedsTilde: [8831, 824],
    NotSuperset: [8835, 8402],
    NotSupersetEqual: [8841],
    NotTilde: [8769],
    NotTildeEqual: [8772],
    NotTildeFullEqual: [8775],
    NotTildeTilde: [8777],
    NotVerticalBar: [8740],
    Nscr: [119977],
    Ntilde: [209],
    Nu: [925],
    OElig: [338],
    Oacute: [211],
    Ocirc: [212],
    Ocy: [1054],
    Odblac: [336],
    Ofr: [120082],
    Ograve: [210],
    Omacr: [332],
    Omega: [937],
    Omicron: [927],
    Oopf: [120134],
    OpenCurlyDoubleQuote: [8220],
    OpenCurlyQuote: [8216],
    Or: [10836],
    Oscr: [119978],
    Oslash: [216],
    Otilde: [213],
    Otimes: [10807],
    Ouml: [214],
    OverBar: [8254],
    OverBrace: [9182],
    OverBracket: [9140],
    OverParenthesis: [9180],
    PartialD: [8706],
    Pcy: [1055],
    Pfr: [120083],
    Phi: [934],
    Pi: [928],
    PlusMinus: [177],
    Poincareplane: [8460],
    Popf: [8473],
    Pr: [10939],
    Precedes: [8826],
    PrecedesEqual: [10927],
    PrecedesSlantEqual: [8828],
    PrecedesTilde: [8830],
    Prime: [8243],
    Product: [8719],
    Proportion: [8759],
    Proportional: [8733],
    Pscr: [119979],
    Psi: [936],
    QUOT: [34],
    Qfr: [120084],
    Qopf: [8474],
    Qscr: [119980],
    RBarr: [10512],
    REG: [174],
    Racute: [340],
    Rang: [10219],
    Rarr: [8608],
    Rarrtl: [10518],
    Rcaron: [344],
    Rcedil: [342],
    Rcy: [1056],
    Re: [8476],
    ReverseElement: [8715],
    ReverseEquilibrium: [8651],
    ReverseUpEquilibrium: [10607],
    Rfr: [8476],
    Rho: [929],
    RightAngleBracket: [10217],
    RightArrow: [8594],
    RightArrowBar: [8677],
    RightArrowLeftArrow: [8644],
    RightCeiling: [8969],
    RightDoubleBracket: [10215],
    RightDownTeeVector: [10589],
    RightDownVector: [8642],
    RightDownVectorBar: [10581],
    RightFloor: [8971],
    RightTee: [8866],
    RightTeeArrow: [8614],
    RightTeeVector: [10587],
    RightTriangle: [8883],
    RightTriangleBar: [10704],
    RightTriangleEqual: [8885],
    RightUpDownVector: [10575],
    RightUpTeeVector: [10588],
    RightUpVector: [8638],
    RightUpVectorBar: [10580],
    RightVector: [8640],
    RightVectorBar: [10579],
    Rightarrow: [8658],
    Ropf: [8477],
    RoundImplies: [10608],
    Rrightarrow: [8667],
    Rscr: [8475],
    Rsh: [8625],
    RuleDelayed: [10740],
    SHCHcy: [1065],
    SHcy: [1064],
    SOFTcy: [1068],
    Sacute: [346],
    Sc: [10940],
    Scaron: [352],
    Scedil: [350],
    Scirc: [348],
    Scy: [1057],
    Sfr: [120086],
    ShortDownArrow: [8595],
    ShortLeftArrow: [8592],
    ShortRightArrow: [8594],
    ShortUpArrow: [8593],
    Sigma: [931],
    SmallCircle: [8728],
    Sopf: [120138],
    Sqrt: [8730],
    Square: [9633],
    SquareIntersection: [8851],
    SquareSubset: [8847],
    SquareSubsetEqual: [8849],
    SquareSuperset: [8848],
    SquareSupersetEqual: [8850],
    SquareUnion: [8852],
    Sscr: [119982],
    Star: [8902],
    Sub: [8912],
    Subset: [8912],
    SubsetEqual: [8838],
    Succeeds: [8827],
    SucceedsEqual: [10928],
    SucceedsSlantEqual: [8829],
    SucceedsTilde: [8831],
    SuchThat: [8715],
    Sum: [8721],
    Sup: [8913],
    Superset: [8835],
    SupersetEqual: [8839],
    Supset: [8913],
    THORN: [222],
    TRADE: [8482],
    TSHcy: [1035],
    TScy: [1062],
    Tab: [9],
    Tau: [932],
    Tcaron: [356],
    Tcedil: [354],
    Tcy: [1058],
    Tfr: [120087],
    Therefore: [8756],
    Theta: [920],
    ThickSpace: [8287, 8202],
    ThinSpace: [8201],
    Tilde: [8764],
    TildeEqual: [8771],
    TildeFullEqual: [8773],
    TildeTilde: [8776],
    Topf: [120139],
    TripleDot: [8411],
    Tscr: [119983],
    Tstrok: [358],
    Uacute: [218],
    Uarr: [8607],
    Uarrocir: [10569],
    Ubrcy: [1038],
    Ubreve: [364],
    Ucirc: [219],
    Ucy: [1059],
    Udblac: [368],
    Ufr: [120088],
    Ugrave: [217],
    Umacr: [362],
    UnderBar: [95],
    UnderBrace: [9183],
    UnderBracket: [9141],
    UnderParenthesis: [9181],
    Union: [8899],
    UnionPlus: [8846],
    Uogon: [370],
    Uopf: [120140],
    UpArrow: [8593],
    UpArrowBar: [10514],
    UpArrowDownArrow: [8645],
    UpDownArrow: [8597],
    UpEquilibrium: [10606],
    UpTee: [8869],
    UpTeeArrow: [8613],
    Uparrow: [8657],
    Updownarrow: [8661],
    UpperLeftArrow: [8598],
    UpperRightArrow: [8599],
    Upsi: [978],
    Upsilon: [933],
    Uring: [366],
    Uscr: [119984],
    Utilde: [360],
    Uuml: [220],
    VDash: [8875],
    Vbar: [10987],
    Vcy: [1042],
    Vdash: [8873],
    Vdashl: [10982],
    Vee: [8897],
    Verbar: [8214],
    Vert: [8214],
    VerticalBar: [8739],
    VerticalLine: [124],
    VerticalSeparator: [10072],
    VerticalTilde: [8768],
    VeryThinSpace: [8202],
    Vfr: [120089],
    Vopf: [120141],
    Vscr: [119985],
    Vvdash: [8874],
    Wcirc: [372],
    Wedge: [8896],
    Wfr: [120090],
    Wopf: [120142],
    Wscr: [119986],
    Xfr: [120091],
    Xi: [926],
    Xopf: [120143],
    Xscr: [119987],
    YAcy: [1071],
    YIcy: [1031],
    YUcy: [1070],
    Yacute: [221],
    Ycirc: [374],
    Ycy: [1067],
    Yfr: [120092],
    Yopf: [120144],
    Yscr: [119988],
    Yuml: [376],
    ZHcy: [1046],
    Zacute: [377],
    Zcaron: [381],
    Zcy: [1047],
    Zdot: [379],
    ZeroWidthSpace: [8203],
    Zeta: [918],
    Zfr: [8488],
    Zopf: [8484],
    Zscr: [119989],
    aacute: [225],
    abreve: [259],
    ac: [8766],
    acE: [8766, 819],
    acd: [8767],
    acirc: [226],
    acute: [180],
    acy: [1072],
    aelig: [230],
    af: [8289],
    afr: [120094],
    agrave: [224],
    alefsym: [8501],
    aleph: [8501],
    alpha: [945],
    amacr: [257],
    amalg: [10815],
    amp: [38],
    and: [8743],
    andand: [10837],
    andd: [10844],
    andslope: [10840],
    andv: [10842],
    ang: [8736],
    ange: [10660],
    angle: [8736],
    angmsd: [8737],
    angmsdaa: [10664],
    angmsdab: [10665],
    angmsdac: [10666],
    angmsdad: [10667],
    angmsdae: [10668],
    angmsdaf: [10669],
    angmsdag: [10670],
    angmsdah: [10671],
    angrt: [8735],
    angrtvb: [8894],
    angrtvbd: [10653],
    angsph: [8738],
    angst: [197],
    angzarr: [9084],
    aogon: [261],
    aopf: [120146],
    ap: [8776],
    apE: [10864],
    apacir: [10863],
    ape: [8778],
    apid: [8779],
    apos: [39],
    approx: [8776],
    approxeq: [8778],
    aring: [229],
    ascr: [119990],
    ast: [42],
    asymp: [8776],
    asympeq: [8781],
    atilde: [227],
    auml: [228],
    awconint: [8755],
    awint: [10769],
    bNot: [10989],
    backcong: [8780],
    backepsilon: [1014],
    backprime: [8245],
    backsim: [8765],
    backsimeq: [8909],
    barvee: [8893],
    barwed: [8965],
    barwedge: [8965],
    bbrk: [9141],
    bbrktbrk: [9142],
    bcong: [8780],
    bcy: [1073],
    bdquo: [8222],
    becaus: [8757],
    because: [8757],
    bemptyv: [10672],
    bepsi: [1014],
    bernou: [8492],
    beta: [946],
    beth: [8502],
    between: [8812],
    bfr: [120095],
    bigcap: [8898],
    bigcirc: [9711],
    bigcup: [8899],
    bigodot: [10752],
    bigoplus: [10753],
    bigotimes: [10754],
    bigsqcup: [10758],
    bigstar: [9733],
    bigtriangledown: [9661],
    bigtriangleup: [9651],
    biguplus: [10756],
    bigvee: [8897],
    bigwedge: [8896],
    bkarow: [10509],
    blacklozenge: [10731],
    blacksquare: [9642],
    blacktriangle: [9652],
    blacktriangledown: [9662],
    blacktriangleleft: [9666],
    blacktriangleright: [9656],
    blank: [9251],
    blk12: [9618],
    blk14: [9617],
    blk34: [9619],
    block: [9608],
    bne: [61, 8421],
    bnequiv: [8801, 8421],
    bnot: [8976],
    bopf: [120147],
    bot: [8869],
    bottom: [8869],
    bowtie: [8904],
    boxDL: [9559],
    boxDR: [9556],
    boxDl: [9558],
    boxDr: [9555],
    boxH: [9552],
    boxHD: [9574],
    boxHU: [9577],
    boxHd: [9572],
    boxHu: [9575],
    boxUL: [9565],
    boxUR: [9562],
    boxUl: [9564],
    boxUr: [9561],
    boxV: [9553],
    boxVH: [9580],
    boxVL: [9571],
    boxVR: [9568],
    boxVh: [9579],
    boxVl: [9570],
    boxVr: [9567],
    boxbox: [10697],
    boxdL: [9557],
    boxdR: [9554],
    boxdl: [9488],
    boxdr: [9484],
    boxh: [9472],
    boxhD: [9573],
    boxhU: [9576],
    boxhd: [9516],
    boxhu: [9524],
    boxminus: [8863],
    boxplus: [8862],
    boxtimes: [8864],
    boxuL: [9563],
    boxuR: [9560],
    boxul: [9496],
    boxur: [9492],
    boxv: [9474],
    boxvH: [9578],
    boxvL: [9569],
    boxvR: [9566],
    boxvh: [9532],
    boxvl: [9508],
    boxvr: [9500],
    bprime: [8245],
    breve: [728],
    brvbar: [166],
    bscr: [119991],
    bsemi: [8271],
    bsim: [8765],
    bsime: [8909],
    bsol: [92],
    bsolb: [10693],
    bsolhsub: [10184],
    bull: [8226],
    bullet: [8226],
    bump: [8782],
    bumpE: [10926],
    bumpe: [8783],
    bumpeq: [8783],
    cacute: [263],
    cap: [8745],
    capand: [10820],
    capbrcup: [10825],
    capcap: [10827],
    capcup: [10823],
    capdot: [10816],
    caps: [8745, 65024],
    caret: [8257],
    caron: [711],
    ccaps: [10829],
    ccaron: [269],
    ccedil: [231],
    ccirc: [265],
    ccups: [10828],
    ccupssm: [10832],
    cdot: [267],
    cedil: [184],
    cemptyv: [10674],
    cent: [162],
    centerdot: [183],
    cfr: [120096],
    chcy: [1095],
    check: [10003],
    checkmark: [10003],
    chi: [967],
    cir: [9675],
    cirE: [10691],
    circ: [710],
    circeq: [8791],
    circlearrowleft: [8634],
    circlearrowright: [8635],
    circledR: [174],
    circledS: [9416],
    circledast: [8859],
    circledcirc: [8858],
    circleddash: [8861],
    cire: [8791],
    cirfnint: [10768],
    cirmid: [10991],
    cirscir: [10690],
    clubs: [9827],
    clubsuit: [9827],
    colon: [58],
    colone: [8788],
    coloneq: [8788],
    comma: [44],
    commat: [64],
    comp: [8705],
    compfn: [8728],
    complement: [8705],
    complexes: [8450],
    cong: [8773],
    congdot: [10861],
    conint: [8750],
    copf: [120148],
    coprod: [8720],
    copy: [169],
    copysr: [8471],
    crarr: [8629],
    cross: [10007],
    cscr: [119992],
    csub: [10959],
    csube: [10961],
    csup: [10960],
    csupe: [10962],
    ctdot: [8943],
    cudarrl: [10552],
    cudarrr: [10549],
    cuepr: [8926],
    cuesc: [8927],
    cularr: [8630],
    cularrp: [10557],
    cup: [8746],
    cupbrcap: [10824],
    cupcap: [10822],
    cupcup: [10826],
    cupdot: [8845],
    cupor: [10821],
    cups: [8746, 65024],
    curarr: [8631],
    curarrm: [10556],
    curlyeqprec: [8926],
    curlyeqsucc: [8927],
    curlyvee: [8910],
    curlywedge: [8911],
    curren: [164],
    curvearrowleft: [8630],
    curvearrowright: [8631],
    cuvee: [8910],
    cuwed: [8911],
    cwconint: [8754],
    cwint: [8753],
    cylcty: [9005],
    dArr: [8659],
    dHar: [10597],
    dagger: [8224],
    daleth: [8504],
    darr: [8595],
    dash: [8208],
    dashv: [8867],
    dbkarow: [10511],
    dblac: [733],
    dcaron: [271],
    dcy: [1076],
    dd: [8518],
    ddagger: [8225],
    ddarr: [8650],
    ddotseq: [10871],
    deg: [176],
    delta: [948],
    demptyv: [10673],
    dfisht: [10623],
    dfr: [120097],
    dharl: [8643],
    dharr: [8642],
    diam: [8900],
    diamond: [8900],
    diamondsuit: [9830],
    diams: [9830],
    die: [168],
    digamma: [989],
    disin: [8946],
    div: [247],
    divide: [247],
    divideontimes: [8903],
    divonx: [8903],
    djcy: [1106],
    dlcorn: [8990],
    dlcrop: [8973],
    dollar: [36],
    dopf: [120149],
    dot: [729],
    doteq: [8784],
    doteqdot: [8785],
    dotminus: [8760],
    dotplus: [8724],
    dotsquare: [8865],
    doublebarwedge: [8966],
    downarrow: [8595],
    downdownarrows: [8650],
    downharpoonleft: [8643],
    downharpoonright: [8642],
    drbkarow: [10512],
    drcorn: [8991],
    drcrop: [8972],
    dscr: [119993],
    dscy: [1109],
    dsol: [10742],
    dstrok: [273],
    dtdot: [8945],
    dtri: [9663],
    dtrif: [9662],
    duarr: [8693],
    duhar: [10607],
    dwangle: [10662],
    dzcy: [1119],
    dzigrarr: [10239],
    eDDot: [10871],
    eDot: [8785],
    eacute: [233],
    easter: [10862],
    ecaron: [283],
    ecir: [8790],
    ecirc: [234],
    ecolon: [8789],
    ecy: [1101],
    edot: [279],
    ee: [8519],
    efDot: [8786],
    efr: [120098],
    eg: [10906],
    egrave: [232],
    egs: [10902],
    egsdot: [10904],
    el: [10905],
    elinters: [9191],
    ell: [8467],
    els: [10901],
    elsdot: [10903],
    emacr: [275],
    empty: [8709],
    emptyset: [8709],
    emptyv: [8709],
    emsp: [8195],
    emsp13: [8196],
    emsp14: [8197],
    eng: [331],
    ensp: [8194],
    eogon: [281],
    eopf: [120150],
    epar: [8917],
    eparsl: [10723],
    eplus: [10865],
    epsi: [949],
    epsilon: [949],
    epsiv: [1013],
    eqcirc: [8790],
    eqcolon: [8789],
    eqsim: [8770],
    eqslantgtr: [10902],
    eqslantless: [10901],
    equals: [61],
    equest: [8799],
    equiv: [8801],
    equivDD: [10872],
    eqvparsl: [10725],
    erDot: [8787],
    erarr: [10609],
    escr: [8495],
    esdot: [8784],
    esim: [8770],
    eta: [951],
    eth: [240],
    euml: [235],
    euro: [8364],
    excl: [33],
    exist: [8707],
    expectation: [8496],
    exponentiale: [8519],
    fallingdotseq: [8786],
    fcy: [1092],
    female: [9792],
    ffilig: [64259],
    fflig: [64256],
    ffllig: [64260],
    ffr: [120099],
    filig: [64257],
    fjlig: [102, 106],
    flat: [9837],
    fllig: [64258],
    fltns: [9649],
    fnof: [402],
    fopf: [120151],
    forall: [8704],
    fork: [8916],
    forkv: [10969],
    fpartint: [10765],
    frac12: [189],
    frac13: [8531],
    frac14: [188],
    frac15: [8533],
    frac16: [8537],
    frac18: [8539],
    frac23: [8532],
    frac25: [8534],
    frac34: [190],
    frac35: [8535],
    frac38: [8540],
    frac45: [8536],
    frac56: [8538],
    frac58: [8541],
    frac78: [8542],
    frasl: [8260],
    frown: [8994],
    fscr: [119995],
    gE: [8807],
    gEl: [10892],
    gacute: [501],
    gamma: [947],
    gammad: [989],
    gap: [10886],
    gbreve: [287],
    gcirc: [285],
    gcy: [1075],
    gdot: [289],
    ge: [8805],
    gel: [8923],
    geq: [8805],
    geqq: [8807],
    geqslant: [10878],
    ges: [10878],
    gescc: [10921],
    gesdot: [10880],
    gesdoto: [10882],
    gesdotol: [10884],
    gesl: [8923, 65024],
    gesles: [10900],
    gfr: [120100],
    gg: [8811],
    ggg: [8921],
    gimel: [8503],
    gjcy: [1107],
    gl: [8823],
    glE: [10898],
    gla: [10917],
    glj: [10916],
    gnE: [8809],
    gnap: [10890],
    gnapprox: [10890],
    gne: [10888],
    gneq: [10888],
    gneqq: [8809],
    gnsim: [8935],
    gopf: [120152],
    grave: [96],
    gscr: [8458],
    gsim: [8819],
    gsime: [10894],
    gsiml: [10896],
    gt: [62],
    gtcc: [10919],
    gtcir: [10874],
    gtdot: [8919],
    gtlPar: [10645],
    gtquest: [10876],
    gtrapprox: [10886],
    gtrarr: [10616],
    gtrdot: [8919],
    gtreqless: [8923],
    gtreqqless: [10892],
    gtrless: [8823],
    gtrsim: [8819],
    gvertneqq: [8809, 65024],
    gvnE: [8809, 65024],
    hArr: [8660],
    hairsp: [8202],
    half: [189],
    hamilt: [8459],
    hardcy: [1098],
    harr: [8596],
    harrcir: [10568],
    harrw: [8621],
    hbar: [8463],
    hcirc: [293],
    hearts: [9829],
    heartsuit: [9829],
    hellip: [8230],
    hercon: [8889],
    hfr: [120101],
    hksearow: [10533],
    hkswarow: [10534],
    hoarr: [8703],
    homtht: [8763],
    hookleftarrow: [8617],
    hookrightarrow: [8618],
    hopf: [120153],
    horbar: [8213],
    hscr: [119997],
    hslash: [8463],
    hstrok: [295],
    hybull: [8259],
    hyphen: [8208],
    iacute: [237],
    ic: [8291],
    icirc: [238],
    icy: [1080],
    iecy: [1077],
    iexcl: [161],
    iff: [8660],
    ifr: [120102],
    igrave: [236],
    ii: [8520],
    iiiint: [10764],
    iiint: [8749],
    iinfin: [10716],
    iiota: [8489],
    ijlig: [307],
    imacr: [299],
    image: [8465],
    imagline: [8464],
    imagpart: [8465],
    imath: [305],
    imof: [8887],
    imped: [437],
    "in": [8712],
    incare: [8453],
    infin: [8734],
    infintie: [10717],
    inodot: [305],
    "int": [8747],
    intcal: [8890],
    integers: [8484],
    intercal: [8890],
    intlarhk: [10775],
    intprod: [10812],
    iocy: [1105],
    iogon: [303],
    iopf: [120154],
    iota: [953],
    iprod: [10812],
    iquest: [191],
    iscr: [119998],
    isin: [8712],
    isinE: [8953],
    isindot: [8949],
    isins: [8948],
    isinsv: [8947],
    isinv: [8712],
    it: [8290],
    itilde: [297],
    iukcy: [1110],
    iuml: [239],
    jcirc: [309],
    jcy: [1081],
    jfr: [120103],
    jmath: [567],
    jopf: [120155],
    jscr: [119999],
    jsercy: [1112],
    jukcy: [1108],
    kappa: [954],
    kappav: [1008],
    kcedil: [311],
    kcy: [1082],
    kfr: [120104],
    kgreen: [312],
    khcy: [1093],
    kjcy: [1116],
    kopf: [120156],
    kscr: [120000],
    lAarr: [8666],
    lArr: [8656],
    lAtail: [10523],
    lBarr: [10510],
    lE: [8806],
    lEg: [10891],
    lHar: [10594],
    lacute: [314],
    laemptyv: [10676],
    lagran: [8466],
    lambda: [955],
    lang: [10216],
    langd: [10641],
    langle: [10216],
    lap: [10885],
    laquo: [171],
    larr: [8592],
    larrb: [8676],
    larrbfs: [10527],
    larrfs: [10525],
    larrhk: [8617],
    larrlp: [8619],
    larrpl: [10553],
    larrsim: [10611],
    larrtl: [8610],
    lat: [10923],
    latail: [10521],
    late: [10925],
    lates: [10925, 65024],
    lbarr: [10508],
    lbbrk: [10098],
    lbrace: [123],
    lbrack: [91],
    lbrke: [10635],
    lbrksld: [10639],
    lbrkslu: [10637],
    lcaron: [318],
    lcedil: [316],
    lceil: [8968],
    lcub: [123],
    lcy: [1083],
    ldca: [10550],
    ldquo: [8220],
    ldquor: [8222],
    ldrdhar: [10599],
    ldrushar: [10571],
    ldsh: [8626],
    le: [8804],
    leftarrow: [8592],
    leftarrowtail: [8610],
    leftharpoondown: [8637],
    leftharpoonup: [8636],
    leftleftarrows: [8647],
    leftrightarrow: [8596],
    leftrightarrows: [8646],
    leftrightharpoons: [8651],
    leftrightsquigarrow: [8621],
    leftthreetimes: [8907],
    leg: [8922],
    leq: [8804],
    leqq: [8806],
    leqslant: [10877],
    les: [10877],
    lescc: [10920],
    lesdot: [10879],
    lesdoto: [10881],
    lesdotor: [10883],
    lesg: [8922, 65024],
    lesges: [10899],
    lessapprox: [10885],
    lessdot: [8918],
    lesseqgtr: [8922],
    lesseqqgtr: [10891],
    lessgtr: [8822],
    lesssim: [8818],
    lfisht: [10620],
    lfloor: [8970],
    lfr: [120105],
    lg: [8822],
    lgE: [10897],
    lhard: [8637],
    lharu: [8636],
    lharul: [10602],
    lhblk: [9604],
    ljcy: [1113],
    ll: [8810],
    llarr: [8647],
    llcorner: [8990],
    llhard: [10603],
    lltri: [9722],
    lmidot: [320],
    lmoust: [9136],
    lmoustache: [9136],
    lnE: [8808],
    lnap: [10889],
    lnapprox: [10889],
    lne: [10887],
    lneq: [10887],
    lneqq: [8808],
    lnsim: [8934],
    loang: [10220],
    loarr: [8701],
    lobrk: [10214],
    longleftarrow: [10229],
    longleftrightarrow: [10231],
    longmapsto: [10236],
    longrightarrow: [10230],
    looparrowleft: [8619],
    looparrowright: [8620],
    lopar: [10629],
    lopf: [120157],
    loplus: [10797],
    lotimes: [10804],
    lowast: [8727],
    lowbar: [95],
    loz: [9674],
    lozenge: [9674],
    lozf: [10731],
    lpar: [40],
    lparlt: [10643],
    lrarr: [8646],
    lrcorner: [8991],
    lrhar: [8651],
    lrhard: [10605],
    lrm: [8206],
    lrtri: [8895],
    lsaquo: [8249],
    lscr: [120001],
    lsh: [8624],
    lsim: [8818],
    lsime: [10893],
    lsimg: [10895],
    lsqb: [91],
    lsquo: [8216],
    lsquor: [8218],
    lstrok: [322],
    lt: [60],
    ltcc: [10918],
    ltcir: [10873],
    ltdot: [8918],
    lthree: [8907],
    ltimes: [8905],
    ltlarr: [10614],
    ltquest: [10875],
    ltrPar: [10646],
    ltri: [9667],
    ltrie: [8884],
    ltrif: [9666],
    lurdshar: [10570],
    luruhar: [10598],
    lvertneqq: [8808, 65024],
    lvnE: [8808, 65024],
    mDDot: [8762],
    macr: [175],
    male: [9794],
    malt: [10016],
    maltese: [10016],
    map: [8614],
    mapsto: [8614],
    mapstodown: [8615],
    mapstoleft: [8612],
    mapstoup: [8613],
    marker: [9646],
    mcomma: [10793],
    mcy: [1084],
    mdash: [8212],
    measuredangle: [8737],
    mfr: [120106],
    mho: [8487],
    micro: [181],
    mid: [8739],
    midast: [42],
    midcir: [10992],
    middot: [183],
    minus: [8722],
    minusb: [8863],
    minusd: [8760],
    minusdu: [10794],
    mlcp: [10971],
    mldr: [8230],
    mnplus: [8723],
    models: [8871],
    mopf: [120158],
    mp: [8723],
    mscr: [120002],
    mstpos: [8766],
    mu: [956],
    multimap: [8888],
    mumap: [8888],
    nGg: [8921, 824],
    nGt: [8811, 8402],
    nGtv: [8811, 824],
    nLeftarrow: [8653],
    nLeftrightarrow: [8654],
    nLl: [8920, 824],
    nLt: [8810, 8402],
    nLtv: [8810, 824],
    nRightarrow: [8655],
    nVDash: [8879],
    nVdash: [8878],
    nabla: [8711],
    nacute: [324],
    nang: [8736, 8402],
    nap: [8777],
    napE: [10864, 824],
    napid: [8779, 824],
    napos: [329],
    napprox: [8777],
    natur: [9838],
    natural: [9838],
    naturals: [8469],
    nbsp: [160],
    nbump: [8782, 824],
    nbumpe: [8783, 824],
    ncap: [10819],
    ncaron: [328],
    ncedil: [326],
    ncong: [8775],
    ncongdot: [10861, 824],
    ncup: [10818],
    ncy: [1085],
    ndash: [8211],
    ne: [8800],
    neArr: [8663],
    nearhk: [10532],
    nearr: [8599],
    nearrow: [8599],
    nedot: [8784, 824],
    nequiv: [8802],
    nesear: [10536],
    nesim: [8770, 824],
    nexist: [8708],
    nexists: [8708],
    nfr: [120107],
    ngE: [8807, 824],
    nge: [8817],
    ngeq: [8817],
    ngeqq: [8807, 824],
    ngeqslant: [10878, 824],
    nges: [10878, 824],
    ngsim: [8821],
    ngt: [8815],
    ngtr: [8815],
    nhArr: [8654],
    nharr: [8622],
    nhpar: [10994],
    ni: [8715],
    nis: [8956],
    nisd: [8954],
    niv: [8715],
    njcy: [1114],
    nlArr: [8653],
    nlE: [8806, 824],
    nlarr: [8602],
    nldr: [8229],
    nle: [8816],
    nleftarrow: [8602],
    nleftrightarrow: [8622],
    nleq: [8816],
    nleqq: [8806, 824],
    nleqslant: [10877, 824],
    nles: [10877, 824],
    nless: [8814],
    nlsim: [8820],
    nlt: [8814],
    nltri: [8938],
    nltrie: [8940],
    nmid: [8740],
    nopf: [120159],
    not: [172],
    notin: [8713],
    notinE: [8953, 824],
    notindot: [8949, 824],
    notinva: [8713],
    notinvb: [8951],
    notinvc: [8950],
    notni: [8716],
    notniva: [8716],
    notnivb: [8958],
    notnivc: [8957],
    npar: [8742],
    nparallel: [8742],
    nparsl: [11005, 8421],
    npart: [8706, 824],
    npolint: [10772],
    npr: [8832],
    nprcue: [8928],
    npre: [10927, 824],
    nprec: [8832],
    npreceq: [10927, 824],
    nrArr: [8655],
    nrarr: [8603],
    nrarrc: [10547, 824],
    nrarrw: [8605, 824],
    nrightarrow: [8603],
    nrtri: [8939],
    nrtrie: [8941],
    nsc: [8833],
    nsccue: [8929],
    nsce: [10928, 824],
    nscr: [120003],
    nshortmid: [8740],
    nshortparallel: [8742],
    nsim: [8769],
    nsime: [8772],
    nsimeq: [8772],
    nsmid: [8740],
    nspar: [8742],
    nsqsube: [8930],
    nsqsupe: [8931],
    nsub: [8836],
    nsubE: [10949, 824],
    nsube: [8840],
    nsubset: [8834, 8402],
    nsubseteq: [8840],
    nsubseteqq: [10949, 824],
    nsucc: [8833],
    nsucceq: [10928, 824],
    nsup: [8837],
    nsupE: [10950, 824],
    nsupe: [8841],
    nsupset: [8835, 8402],
    nsupseteq: [8841],
    nsupseteqq: [10950, 824],
    ntgl: [8825],
    ntilde: [241],
    ntlg: [8824],
    ntriangleleft: [8938],
    ntrianglelefteq: [8940],
    ntriangleright: [8939],
    ntrianglerighteq: [8941],
    nu: [957],
    num: [35],
    numero: [8470],
    numsp: [8199],
    nvDash: [8877],
    nvHarr: [10500],
    nvap: [8781, 8402],
    nvdash: [8876],
    nvge: [8805, 8402],
    nvgt: [62, 8402],
    nvinfin: [10718],
    nvlArr: [10498],
    nvle: [8804, 8402],
    nvlt: [60, 8402],
    nvltrie: [8884, 8402],
    nvrArr: [10499],
    nvrtrie: [8885, 8402],
    nvsim: [8764, 8402],
    nwArr: [8662],
    nwarhk: [10531],
    nwarr: [8598],
    nwarrow: [8598],
    nwnear: [10535],
    oS: [9416],
    oacute: [243],
    oast: [8859],
    ocir: [8858],
    ocirc: [244],
    ocy: [1086],
    odash: [8861],
    odblac: [337],
    odiv: [10808],
    odot: [8857],
    odsold: [10684],
    oelig: [339],
    ofcir: [10687],
    ofr: [120108],
    ogon: [731],
    ograve: [242],
    ogt: [10689],
    ohbar: [10677],
    ohm: [937],
    oint: [8750],
    olarr: [8634],
    olcir: [10686],
    olcross: [10683],
    oline: [8254],
    olt: [10688],
    omacr: [333],
    omega: [969],
    omicron: [959],
    omid: [10678],
    ominus: [8854],
    oopf: [120160],
    opar: [10679],
    operp: [10681],
    oplus: [8853],
    or: [8744],
    orarr: [8635],
    ord: [10845],
    order: [8500],
    orderof: [8500],
    ordf: [170],
    ordm: [186],
    origof: [8886],
    oror: [10838],
    orslope: [10839],
    orv: [10843],
    oscr: [8500],
    oslash: [248],
    osol: [8856],
    otilde: [245],
    otimes: [8855],
    otimesas: [10806],
    ouml: [246],
    ovbar: [9021],
    par: [8741],
    para: [182],
    parallel: [8741],
    parsim: [10995],
    parsl: [11005],
    part: [8706],
    pcy: [1087],
    percnt: [37],
    period: [46],
    permil: [8240],
    perp: [8869],
    pertenk: [8241],
    pfr: [120109],
    phi: [966],
    phiv: [981],
    phmmat: [8499],
    phone: [9742],
    pi: [960],
    pitchfork: [8916],
    piv: [982],
    planck: [8463],
    planckh: [8462],
    plankv: [8463],
    plus: [43],
    plusacir: [10787],
    plusb: [8862],
    pluscir: [10786],
    plusdo: [8724],
    plusdu: [10789],
    pluse: [10866],
    plusmn: [177],
    plussim: [10790],
    plustwo: [10791],
    pm: [177],
    pointint: [10773],
    popf: [120161],
    pound: [163],
    pr: [8826],
    prE: [10931],
    prap: [10935],
    prcue: [8828],
    pre: [10927],
    prec: [8826],
    precapprox: [10935],
    preccurlyeq: [8828],
    preceq: [10927],
    precnapprox: [10937],
    precneqq: [10933],
    precnsim: [8936],
    precsim: [8830],
    prime: [8242],
    primes: [8473],
    prnE: [10933],
    prnap: [10937],
    prnsim: [8936],
    prod: [8719],
    profalar: [9006],
    profline: [8978],
    profsurf: [8979],
    prop: [8733],
    propto: [8733],
    prsim: [8830],
    prurel: [8880],
    pscr: [120005],
    psi: [968],
    puncsp: [8200],
    qfr: [120110],
    qint: [10764],
    qopf: [120162],
    qprime: [8279],
    qscr: [120006],
    quaternions: [8461],
    quatint: [10774],
    quest: [63],
    questeq: [8799],
    quot: [34],
    rAarr: [8667],
    rArr: [8658],
    rAtail: [10524],
    rBarr: [10511],
    rHar: [10596],
    race: [8765, 817],
    racute: [341],
    radic: [8730],
    raemptyv: [10675],
    rang: [10217],
    rangd: [10642],
    range: [10661],
    rangle: [10217],
    raquo: [187],
    rarr: [8594],
    rarrap: [10613],
    rarrb: [8677],
    rarrbfs: [10528],
    rarrc: [10547],
    rarrfs: [10526],
    rarrhk: [8618],
    rarrlp: [8620],
    rarrpl: [10565],
    rarrsim: [10612],
    rarrtl: [8611],
    rarrw: [8605],
    ratail: [10522],
    ratio: [8758],
    rationals: [8474],
    rbarr: [10509],
    rbbrk: [10099],
    rbrace: [125],
    rbrack: [93],
    rbrke: [10636],
    rbrksld: [10638],
    rbrkslu: [10640],
    rcaron: [345],
    rcedil: [343],
    rceil: [8969],
    rcub: [125],
    rcy: [1088],
    rdca: [10551],
    rdldhar: [10601],
    rdquo: [8221],
    rdquor: [8221],
    rdsh: [8627],
    real: [8476],
    realine: [8475],
    realpart: [8476],
    reals: [8477],
    rect: [9645],
    reg: [174],
    rfisht: [10621],
    rfloor: [8971],
    rfr: [120111],
    rhard: [8641],
    rharu: [8640],
    rharul: [10604],
    rho: [961],
    rhov: [1009],
    rightarrow: [8594],
    rightarrowtail: [8611],
    rightharpoondown: [8641],
    rightharpoonup: [8640],
    rightleftarrows: [8644],
    rightleftharpoons: [8652],
    rightrightarrows: [8649],
    rightsquigarrow: [8605],
    rightthreetimes: [8908],
    ring: [730],
    risingdotseq: [8787],
    rlarr: [8644],
    rlhar: [8652],
    rlm: [8207],
    rmoust: [9137],
    rmoustache: [9137],
    rnmid: [10990],
    roang: [10221],
    roarr: [8702],
    robrk: [10215],
    ropar: [10630],
    ropf: [120163],
    roplus: [10798],
    rotimes: [10805],
    rpar: [41],
    rpargt: [10644],
    rppolint: [10770],
    rrarr: [8649],
    rsaquo: [8250],
    rscr: [120007],
    rsh: [8625],
    rsqb: [93],
    rsquo: [8217],
    rsquor: [8217],
    rthree: [8908],
    rtimes: [8906],
    rtri: [9657],
    rtrie: [8885],
    rtrif: [9656],
    rtriltri: [10702],
    ruluhar: [10600],
    rx: [8478],
    sacute: [347],
    sbquo: [8218],
    sc: [8827],
    scE: [10932],
    scap: [10936],
    scaron: [353],
    sccue: [8829],
    sce: [10928],
    scedil: [351],
    scirc: [349],
    scnE: [10934],
    scnap: [10938],
    scnsim: [8937],
    scpolint: [10771],
    scsim: [8831],
    scy: [1089],
    sdot: [8901],
    sdotb: [8865],
    sdote: [10854],
    seArr: [8664],
    searhk: [10533],
    searr: [8600],
    searrow: [8600],
    sect: [167],
    semi: [59],
    seswar: [10537],
    setminus: [8726],
    setmn: [8726],
    sext: [10038],
    sfr: [120112],
    sfrown: [8994],
    sharp: [9839],
    shchcy: [1097],
    shcy: [1096],
    shortmid: [8739],
    shortparallel: [8741],
    shy: [173],
    sigma: [963],
    sigmaf: [962],
    sigmav: [962],
    sim: [8764],
    simdot: [10858],
    sime: [8771],
    simeq: [8771],
    simg: [10910],
    simgE: [10912],
    siml: [10909],
    simlE: [10911],
    simne: [8774],
    simplus: [10788],
    simrarr: [10610],
    slarr: [8592],
    smallsetminus: [8726],
    smashp: [10803],
    smeparsl: [10724],
    smid: [8739],
    smile: [8995],
    smt: [10922],
    smte: [10924],
    smtes: [10924, 65024],
    softcy: [1100],
    sol: [47],
    solb: [10692],
    solbar: [9023],
    sopf: [120164],
    spades: [9824],
    spadesuit: [9824],
    spar: [8741],
    sqcap: [8851],
    sqcaps: [8851, 65024],
    sqcup: [8852],
    sqcups: [8852, 65024],
    sqsub: [8847],
    sqsube: [8849],
    sqsubset: [8847],
    sqsubseteq: [8849],
    sqsup: [8848],
    sqsupe: [8850],
    sqsupset: [8848],
    sqsupseteq: [8850],
    squ: [9633],
    square: [9633],
    squarf: [9642],
    squf: [9642],
    srarr: [8594],
    sscr: [120008],
    ssetmn: [8726],
    ssmile: [8995],
    sstarf: [8902],
    star: [9734],
    starf: [9733],
    straightepsilon: [1013],
    straightphi: [981],
    strns: [175],
    sub: [8834],
    subE: [10949],
    subdot: [10941],
    sube: [8838],
    subedot: [10947],
    submult: [10945],
    subnE: [10955],
    subne: [8842],
    subplus: [10943],
    subrarr: [10617],
    subset: [8834],
    subseteq: [8838],
    subseteqq: [10949],
    subsetneq: [8842],
    subsetneqq: [10955],
    subsim: [10951],
    subsub: [10965],
    subsup: [10963],
    succ: [8827],
    succapprox: [10936],
    succcurlyeq: [8829],
    succeq: [10928],
    succnapprox: [10938],
    succneqq: [10934],
    succnsim: [8937],
    succsim: [8831],
    sum: [8721],
    sung: [9834],
    sup: [8835],
    sup1: [185],
    sup2: [178],
    sup3: [179],
    supE: [10950],
    supdot: [10942],
    supdsub: [10968],
    supe: [8839],
    supedot: [10948],
    suphsol: [10185],
    suphsub: [10967],
    suplarr: [10619],
    supmult: [10946],
    supnE: [10956],
    supne: [8843],
    supplus: [10944],
    supset: [8835],
    supseteq: [8839],
    supseteqq: [10950],
    supsetneq: [8843],
    supsetneqq: [10956],
    supsim: [10952],
    supsub: [10964],
    supsup: [10966],
    swArr: [8665],
    swarhk: [10534],
    swarr: [8601],
    swarrow: [8601],
    swnwar: [10538],
    szlig: [223],
    target: [8982],
    tau: [964],
    tbrk: [9140],
    tcaron: [357],
    tcedil: [355],
    tcy: [1090],
    tdot: [8411],
    telrec: [8981],
    tfr: [120113],
    there4: [8756],
    therefore: [8756],
    theta: [952],
    thetasym: [977],
    thetav: [977],
    thickapprox: [8776],
    thicksim: [8764],
    thinsp: [8201],
    thkap: [8776],
    thksim: [8764],
    thorn: [254],
    tilde: [732],
    times: [215],
    timesb: [8864],
    timesbar: [10801],
    timesd: [10800],
    tint: [8749],
    toea: [10536],
    top: [8868],
    topbot: [9014],
    topcir: [10993],
    topf: [120165],
    topfork: [10970],
    tosa: [10537],
    tprime: [8244],
    trade: [8482],
    triangle: [9653],
    triangledown: [9663],
    triangleleft: [9667],
    trianglelefteq: [8884],
    triangleq: [8796],
    triangleright: [9657],
    trianglerighteq: [8885],
    tridot: [9708],
    trie: [8796],
    triminus: [10810],
    triplus: [10809],
    trisb: [10701],
    tritime: [10811],
    trpezium: [9186],
    tscr: [120009],
    tscy: [1094],
    tshcy: [1115],
    tstrok: [359],
    twixt: [8812],
    twoheadleftarrow: [8606],
    twoheadrightarrow: [8608],
    uArr: [8657],
    uHar: [10595],
    uacute: [250],
    uarr: [8593],
    ubrcy: [1118],
    ubreve: [365],
    ucirc: [251],
    ucy: [1091],
    udarr: [8645],
    udblac: [369],
    udhar: [10606],
    ufisht: [10622],
    ufr: [120114],
    ugrave: [249],
    uharl: [8639],
    uharr: [8638],
    uhblk: [9600],
    ulcorn: [8988],
    ulcorner: [8988],
    ulcrop: [8975],
    ultri: [9720],
    umacr: [363],
    uml: [168],
    uogon: [371],
    uopf: [120166],
    uparrow: [8593],
    updownarrow: [8597],
    upharpoonleft: [8639],
    upharpoonright: [8638],
    uplus: [8846],
    upsi: [965],
    upsih: [978],
    upsilon: [965],
    upuparrows: [8648],
    urcorn: [8989],
    urcorner: [8989],
    urcrop: [8974],
    uring: [367],
    urtri: [9721],
    uscr: [120010],
    utdot: [8944],
    utilde: [361],
    utri: [9653],
    utrif: [9652],
    uuarr: [8648],
    uuml: [252],
    uwangle: [10663],
    vArr: [8661],
    vBar: [10984],
    vBarv: [10985],
    vDash: [8872],
    vangrt: [10652],
    varepsilon: [1013],
    varkappa: [1008],
    varnothing: [8709],
    varphi: [981],
    varpi: [982],
    varpropto: [8733],
    varr: [8597],
    varrho: [1009],
    varsigma: [962],
    varsubsetneq: [8842, 65024],
    varsubsetneqq: [10955, 65024],
    varsupsetneq: [8843, 65024],
    varsupsetneqq: [10956, 65024],
    vartheta: [977],
    vartriangleleft: [8882],
    vartriangleright: [8883],
    vcy: [1074],
    vdash: [8866],
    vee: [8744],
    veebar: [8891],
    veeeq: [8794],
    vellip: [8942],
    verbar: [124],
    vert: [124],
    vfr: [120115],
    vltri: [8882],
    vnsub: [8834, 8402],
    vnsup: [8835, 8402],
    vopf: [120167],
    vprop: [8733],
    vrtri: [8883],
    vscr: [120011],
    vsubnE: [10955, 65024],
    vsubne: [8842, 65024],
    vsupnE: [10956, 65024],
    vsupne: [8843, 65024],
    vzigzag: [10650],
    wcirc: [373],
    wedbar: [10847],
    wedge: [8743],
    wedgeq: [8793],
    weierp: [8472],
    wfr: [120116],
    wopf: [120168],
    wp: [8472],
    wr: [8768],
    wreath: [8768],
    wscr: [120012],
    xcap: [8898],
    xcirc: [9711],
    xcup: [8899],
    xdtri: [9661],
    xfr: [120117],
    xhArr: [10234],
    xharr: [10231],
    xi: [958],
    xlArr: [10232],
    xlarr: [10229],
    xmap: [10236],
    xnis: [8955],
    xodot: [10752],
    xopf: [120169],
    xoplus: [10753],
    xotime: [10754],
    xrArr: [10233],
    xrarr: [10230],
    xscr: [120013],
    xsqcup: [10758],
    xuplus: [10756],
    xutri: [9651],
    xvee: [8897],
    xwedge: [8896],
    yacute: [253],
    yacy: [1103],
    ycirc: [375],
    ycy: [1099],
    yen: [165],
    yfr: [120118],
    yicy: [1111],
    yopf: [120170],
    yscr: [120014],
    yucy: [1102],
    yuml: [255],
    zacute: [378],
    zcaron: [382],
    zcy: [1079],
    zdot: [380],
    zeetrf: [8488],
    zeta: [950],
    zfr: [120119],
    zhcy: [1078],
    zigrarr: [8669],
    zopf: [120171],
    zscr: [120015],
    zwj: [8205],
    zwnj: [8204]
  };
});
define("simple-html-tokenizer/char-refs/min", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = {
    quot: [34],
    amp: [38],
    apos: [39],
    lt: [60],
    gt: [62]
  };
});
define('simple-html-tokenizer/entity-parser', ['exports', 'module'], function (exports, module) {
  'use strict';

  function EntityParser(namedCodepoints) {
    this.namedCodepoints = namedCodepoints;
  }

  EntityParser.prototype.parse = function (tokenizer) {
    var input = tokenizer.input.slice(tokenizer.char);
    var matches = input.match(/^#(?:x|X)([0-9A-Fa-f]+);/);
    if (matches) {
      tokenizer.char += matches[0].length;
      return String.fromCharCode(parseInt(matches[1], 16));
    }
    matches = input.match(/^#([0-9]+);/);
    if (matches) {
      tokenizer.char += matches[0].length;
      return String.fromCharCode(parseInt(matches[1], 10));
    }
    matches = input.match(/^([A-Za-z]+);/);
    if (matches) {
      var codepoints = this.namedCodepoints[matches[1]];
      if (codepoints) {
        tokenizer.char += matches[0].length;
        for (var i = 0, buffer = ''; i < codepoints.length; i++) {
          buffer += String.fromCharCode(codepoints[i]);
        }
        return buffer;
      }
    }
  };

  module.exports = EntityParser;
});
define('simple-html-tokenizer/generate', ['exports', 'module', './generator'], function (exports, module, _generator) {
  'use strict';

  module.exports = generate;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Generator = _interopRequireDefault(_generator);

  function generate(tokens) {
    var generator = new _Generator['default']();
    return generator.generate(tokens);
  }
});
define("simple-html-tokenizer/generator", ["exports", "module"], function (exports, module) {
  "use strict";

  var escape = (function () {
    var test = /[&<>"'`]/;
    var replace = /[&<>"'`]/g;
    var map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;"
    };
    function escapeChar(char) {
      return map[char];
    }
    return function escape(string) {
      if (!test.test(string)) {
        return string;
      }
      return string.replace(replace, escapeChar);
    };
  })();

  function Generator() {
    this.escape = escape;
  }

  Generator.prototype = {
    generate: function generate(tokens) {
      var buffer = '';
      var token;
      for (var i = 0; i < tokens.length; i++) {
        token = tokens[i];
        buffer += this[token.type](token);
      }
      return buffer;
    },

    escape: function escape(text) {
      var unsafeCharsMap = this.unsafeCharsMap;
      return text.replace(this.unsafeChars, function (char) {
        return unsafeCharsMap[char] || char;
      });
    },

    StartTag: function StartTag(token) {
      var out = "<";
      out += token.tagName;

      if (token.attributes.length) {
        out += " " + this.Attributes(token.attributes);
      }

      out += ">";

      return out;
    },

    EndTag: function EndTag(token) {
      return "</" + token.tagName + ">";
    },

    Chars: function Chars(token) {
      return this.escape(token.chars);
    },

    Comment: function Comment(token) {
      return "<!--" + token.chars + "-->";
    },

    Attributes: function Attributes(attributes) {
      var out = [],
          attribute;

      for (var i = 0, l = attributes.length; i < l; i++) {
        attribute = attributes[i];

        out.push(this.Attribute(attribute[0], attribute[1]));
      }

      return out.join(" ");
    },

    Attribute: function Attribute(name, value) {
      var attrString = name;

      if (value) {
        value = this.escape(value);
        attrString += "=\"" + value + "\"";
      }

      return attrString;
    }
  };

  module.exports = Generator;
});
define('simple-html-tokenizer/tokenize', ['exports', 'module', './tokenizer', './entity-parser', './char-refs/full'], function (exports, module, _tokenizer, _entityParser, _charRefsFull) {
  'use strict';

  module.exports = tokenize;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Tokenizer = _interopRequireDefault(_tokenizer);

  var _EntityParser = _interopRequireDefault(_entityParser);

  var _namedCodepoints = _interopRequireDefault(_charRefsFull);

  function tokenize(input) {
    var tokenizer = new _Tokenizer['default'](new _EntityParser['default'](_namedCodepoints['default']));
    return tokenizer.tokenize(input);
  }
});
define('simple-html-tokenizer/tokenizer', ['exports', 'module', './utils', './tokens'], function (exports, module, _utils, _tokens) {
  'use strict';

  function Tokenizer(entityParser) {
    this.entityParser = entityParser;

    this.input = null;
    this.state = null;
    this.token = null;

    this.char = -1;
    this.line = -1;
    this.column = -1;

    this.startLine = -1;
    this.startColumn = -1;

    this.reset();
  }

  Tokenizer.prototype = {
    reset: function reset() {
      this.input = '';
      this.state = 'data';
      this.token = null;

      this.char = 0;
      this.line = 1;
      this.column = 0;

      this.startLine = 1;
      this.startColumn = 0;
    },

    tokenize: function tokenize(input) {
      this.reset();

      var tokens = this.tokenizePart(input);
      var trailingToken = this.tokenizeEOF();

      if (trailingToken) {
        tokens.push(trailingToken);
      }

      return tokens;
    },

    tokenizePart: function tokenizePart(input) {
      this.input += (0, _utils.preprocessInput)(input);

      var tokens = [];

      while (true) {
        var token = this.lex();

        if (token) {
          tokens.push(token);
        } else {
          break;
        }
      }

      return tokens;
    },

    tokenizeEOF: function tokenizeEOF() {
      return this.emitToken();
    },

    lex: function lex() {
      while (this.char < this.input.length) {
        var char = this.input.charAt(this.char++);
        if (char) {
          if (char === "\n") {
            this.line++;
            this.column = 0;
          } else {
            this.column++;
          }

          var token = this.states[this.state].call(this, char);
          if (token) {
            return token;
          }
        }
      }
    },

    addLocInfo: function addLocInfo(_endLine, _endColumn) {
      var endLine = _endLine === undefined ? this.line : _endLine;
      var endColumn = _endColumn === undefined ? this.column : _endColumn;

      this.token.loc = {
        start: {
          line: this.startLine,
          column: this.startColumn
        },
        end: {
          line: endLine,
          column: endColumn
        }
      };

      this.startLine = endLine;
      this.startColumn = endColumn;
    },

    createTag: function createTag(Type, char) {
      var lastToken = this.token;
      this.token = new Type(char);
      this.state = 'tagName';
      return lastToken;
    },

    addToTagName: function addToTagName(char) {
      this.token.tagName += char;
    },

    selfClosing: function selfClosing() {
      this.token.selfClosing = true;
    },

    createAttribute: function createAttribute(char) {
      this._currentAttribute = [char.toLowerCase(), "", null];
      this.token.attributes.push(this._currentAttribute);
      this.state = 'attributeName';
    },

    addToAttributeName: function addToAttributeName(char) {
      this._currentAttribute[0] += char;
    },

    markAttributeQuoted: function markAttributeQuoted(value) {
      this._currentAttribute[2] = value;
    },

    finalizeAttributeValue: function finalizeAttributeValue() {
      if (this._currentAttribute) {
        if (this._currentAttribute[2] === null) {
          this._currentAttribute[2] = false;
        }
        this._currentAttribute = undefined;
      }
    },

    addToAttributeValue: function addToAttributeValue(char) {
      this._currentAttribute[1] = this._currentAttribute[1] || "";
      this._currentAttribute[1] += char;
    },

    createComment: function createComment() {
      var lastToken = this.token;
      this.token = new _tokens.Comment();
      this.state = 'commentStart';
      return lastToken;
    },

    addToComment: function addToComment(char) {
      this.addChar(char);
    },

    addChar: function addChar(char) {
      this.token.chars += char;
    },

    finalizeToken: function finalizeToken() {
      if (this.token.type === 'StartTag') {
        this.finalizeAttributeValue();
      }
    },

    emitData: function emitData() {
      var token = this.token;
      if (token) {
        this.addLocInfo(this.line, this.column - 1);
      }

      this.token = null;
      this.state = 'tagOpen';

      return token;
    },

    emitToken: function emitToken() {
      var token = this.token;
      if (token) {
        this.addLocInfo();
        this.finalizeToken();
      }

      this.token = null;
      this.state = 'data';

      return token;
    },

    addData: function addData(char) {
      if (this.token === null) {
        this.token = new _tokens.Chars();
      }

      this.addChar(char);
    },

    consumeCharRef: function consumeCharRef() {
      return this.entityParser.parse(this);
    },

    states: {
      data: function data(char) {
        if (char === "<") {
          var chars = this.emitData();
          return chars;
        } else if (char === "&") {
          this.addData(this.consumeCharRef() || "&");
        } else {
          this.addData(char);
        }
      },

      tagOpen: function tagOpen(char) {
        if (char === "!") {
          this.state = 'markupDeclaration';
        } else if (char === "/") {
          this.state = 'endTagOpen';
        } else if ((0, _utils.isAlpha)(char)) {
          return this.createTag(_tokens.StartTag, char.toLowerCase());
        }
      },

      markupDeclaration: function markupDeclaration(char) {
        if (char === "-" && this.input.charAt(this.char) === "-") {
          this.char++;
          this.createComment();
        }
      },

      commentStart: function commentStart(char) {
        if (char === "-") {
          this.state = 'commentStartDash';
        } else if (char === ">") {
          return this.emitToken();
        } else {
          this.addToComment(char);
          this.state = 'comment';
        }
      },

      commentStartDash: function commentStartDash(char) {
        if (char === "-") {
          this.state = 'commentEnd';
        } else if (char === ">") {
          return this.emitToken();
        } else {
          this.addToComment("-");
          this.state = 'comment';
        }
      },

      comment: function comment(char) {
        if (char === "-") {
          this.state = 'commentEndDash';
        } else {
          this.addToComment(char);
        }
      },

      commentEndDash: function commentEndDash(char) {
        if (char === "-") {
          this.state = 'commentEnd';
        } else {
          this.addToComment("-" + char);
          this.state = 'comment';
        }
      },

      commentEnd: function commentEnd(char) {
        if (char === ">") {
          return this.emitToken();
        } else {
          this.addToComment("--" + char);
          this.state = 'comment';
        }
      },

      tagName: function tagName(char) {
        if ((0, _utils.isSpace)(char)) {
          this.state = 'beforeAttributeName';
        } else if (char === "/") {
          this.state = 'selfClosingStartTag';
        } else if (char === ">") {
          return this.emitToken();
        } else {
          this.addToTagName(char);
        }
      },

      beforeAttributeName: function beforeAttributeName(char) {
        if ((0, _utils.isSpace)(char)) {
          return;
        } else if (char === "/") {
          this.state = 'selfClosingStartTag';
        } else if (char === ">") {
          return this.emitToken();
        } else {
          this.createAttribute(char);
        }
      },

      attributeName: function attributeName(char) {
        if ((0, _utils.isSpace)(char)) {
          this.state = 'afterAttributeName';
        } else if (char === "/") {
          this.state = 'selfClosingStartTag';
        } else if (char === "=") {
          this.state = 'beforeAttributeValue';
        } else if (char === ">") {
          return this.emitToken();
        } else {
          this.addToAttributeName(char);
        }
      },

      afterAttributeName: function afterAttributeName(char) {
        if ((0, _utils.isSpace)(char)) {
          return;
        } else if (char === "/") {
          this.state = 'selfClosingStartTag';
        } else if (char === "=") {
          this.state = 'beforeAttributeValue';
        } else if (char === ">") {
          return this.emitToken();
        } else {
          this.finalizeAttributeValue();
          this.createAttribute(char);
        }
      },

      beforeAttributeValue: function beforeAttributeValue(char) {
        if ((0, _utils.isSpace)(char)) {
          return;
        } else if (char === '"') {
          this.state = 'attributeValueDoubleQuoted';
          this.markAttributeQuoted(true);
        } else if (char === "'") {
          this.state = 'attributeValueSingleQuoted';
          this.markAttributeQuoted(true);
        } else if (char === ">") {
          return this.emitToken();
        } else {
          this.state = 'attributeValueUnquoted';
          this.markAttributeQuoted(false);
          this.addToAttributeValue(char);
        }
      },

      attributeValueDoubleQuoted: function attributeValueDoubleQuoted(char) {
        if (char === '"') {
          this.finalizeAttributeValue();
          this.state = 'afterAttributeValueQuoted';
        } else if (char === "&") {
          this.addToAttributeValue(this.consumeCharRef('"') || "&");
        } else {
          this.addToAttributeValue(char);
        }
      },

      attributeValueSingleQuoted: function attributeValueSingleQuoted(char) {
        if (char === "'") {
          this.finalizeAttributeValue();
          this.state = 'afterAttributeValueQuoted';
        } else if (char === "&") {
          this.addToAttributeValue(this.consumeCharRef("'") || "&");
        } else {
          this.addToAttributeValue(char);
        }
      },

      attributeValueUnquoted: function attributeValueUnquoted(char) {
        if ((0, _utils.isSpace)(char)) {
          this.finalizeAttributeValue();
          this.state = 'beforeAttributeName';
        } else if (char === "&") {
          this.addToAttributeValue(this.consumeCharRef(">") || "&");
        } else if (char === ">") {
          return this.emitToken();
        } else {
          this.addToAttributeValue(char);
        }
      },

      afterAttributeValueQuoted: function afterAttributeValueQuoted(char) {
        if ((0, _utils.isSpace)(char)) {
          this.state = 'beforeAttributeName';
        } else if (char === "/") {
          this.state = 'selfClosingStartTag';
        } else if (char === ">") {
          return this.emitToken();
        } else {
          this.char--;
          this.state = 'beforeAttributeName';
        }
      },

      selfClosingStartTag: function selfClosingStartTag(char) {
        if (char === ">") {
          this.selfClosing();
          return this.emitToken();
        } else {
          this.char--;
          this.state = 'beforeAttributeName';
        }
      },

      endTagOpen: function endTagOpen(char) {
        if ((0, _utils.isAlpha)(char)) {
          this.createTag(_tokens.EndTag, char.toLowerCase());
        }
      }
    }
  };

  module.exports = Tokenizer;
});
define('simple-html-tokenizer/tokens', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.StartTag = StartTag;
  exports.EndTag = EndTag;
  exports.Chars = Chars;
  exports.Comment = Comment;

  function StartTag(tagName, attributes, selfClosing) {
    this.type = 'StartTag';
    this.tagName = tagName || '';
    this.attributes = attributes || [];
    this.selfClosing = selfClosing === true;
  }

  function EndTag(tagName) {
    this.type = 'EndTag';
    this.tagName = tagName || '';
  }

  function Chars(chars) {
    this.type = 'Chars';
    this.chars = chars || "";
  }

  function Comment(chars) {
    this.type = 'Comment';
    this.chars = chars || '';
  }
});
define("simple-html-tokenizer/utils", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isSpace = isSpace;
  exports.isAlpha = isAlpha;
  exports.preprocessInput = preprocessInput;

  function isSpace(char) {
    return /[\t\n\f ]/.test(char);
  }

  function isAlpha(char) {
    return /[A-Za-z]/.test(char);
  }

  function preprocessInput(input) {
    return input.replace(/\r\n?/g, "\n");
  }
});