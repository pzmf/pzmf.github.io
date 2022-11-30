(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var HomeView = require('./views/homeview');
var homeView = new HomeView();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzNDLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUMiLCJmaWxlIjoiL1VzZXJzL2pvcmlzL1NpdGVzL3BsYXlncm91bmQvbnMwMi1uZXZlcmxhbmRzcGFjZS9yZXNvdXJjZXMvYXNzZXRzL2pzL3NwYWNlL2RlZmF1bHQvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEhvbWVWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9ob21ldmlldycpO1xudmFyIGhvbWVWaWV3ID0gbmV3IEhvbWVWaWV3KCk7Il19
},{"./views/homeview":31}],2:[function(require,module,exports){
(function (global){
//     Backbone.js 1.4.0

//     (c) 2010-2019 Jeremy Ashkenas and DocumentCloud
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(factory) {

  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global;

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore'), $;
    try { $ = require('jquery'); } catch (e) {}
    factory(root, exports, _, $);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, root.jQuery || root.Zepto || root.ender || root.$);
  }

})(function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to a common array method we'll want to use later.
  var slice = Array.prototype.slice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.4.0';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... this will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // a custom event channel. You may bind a callback to an event with `on` or
  // remove with `off`; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {};

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // A private global variable to share between listeners and listenees.
  var _listening;

  // Iterates over the standard `event, callback` (as well as the fancy multiple
  // space-separated events `"change blur", callback` and jQuery-style event
  // maps `{event: callback}`).
  var eventsApi = function(iteratee, events, name, callback, opts) {
    var i = 0, names;
    if (name && typeof name === 'object') {
      // Handle event maps.
      if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
      for (names = _.keys(name); i < names.length ; i++) {
        events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
      }
    } else if (name && eventSplitter.test(name)) {
      // Handle space-separated event names by delegating them individually.
      for (names = name.split(eventSplitter); i < names.length; i++) {
        events = iteratee(events, names[i], callback, opts);
      }
    } else {
      // Finally, standard events.
      events = iteratee(events, name, callback, opts);
    }
    return events;
  };

  // Bind an event to a `callback` function. Passing `"all"` will bind
  // the callback to all events fired.
  Events.on = function(name, callback, context) {
    this._events = eventsApi(onApi, this._events || {}, name, callback, {
      context: context,
      ctx: this,
      listening: _listening
    });

    if (_listening) {
      var listeners = this._listeners || (this._listeners = {});
      listeners[_listening.id] = _listening;
      // Allow the listening to use a counter, instead of tracking
      // callbacks for library interop
      _listening.interop = false;
    }

    return this;
  };

  // Inversion-of-control versions of `on`. Tell *this* object to listen to
  // an event in another object... keeping track of what it's listening to
  // for easier unbinding later.
  Events.listenTo = function(obj, name, callback) {
    if (!obj) return this;
    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
    var listeningTo = this._listeningTo || (this._listeningTo = {});
    var listening = _listening = listeningTo[id];

    // This object is not listening to any other events on `obj` yet.
    // Setup the necessary references to track the listening callbacks.
    if (!listening) {
      this._listenId || (this._listenId = _.uniqueId('l'));
      listening = _listening = listeningTo[id] = new Listening(this, obj);
    }

    // Bind callbacks on obj.
    var error = tryCatchOn(obj, name, callback, this);
    _listening = void 0;

    if (error) throw error;
    // If the target obj is not Backbone.Events, track events manually.
    if (listening.interop) listening.on(name, callback);

    return this;
  };

  // The reducing API that adds a callback to the `events` object.
  var onApi = function(events, name, callback, options) {
    if (callback) {
      var handlers = events[name] || (events[name] = []);
      var context = options.context, ctx = options.ctx, listening = options.listening;
      if (listening) listening.count++;

      handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
    }
    return events;
  };

  // An try-catch guarded #on function, to prevent poisoning the global
  // `_listening` variable.
  var tryCatchOn = function(obj, name, callback, context) {
    try {
      obj.on(name, callback, context);
    } catch (e) {
      return e;
    }
  };

  // Remove one or many callbacks. If `context` is null, removes all
  // callbacks with that function. If `callback` is null, removes all
  // callbacks for the event. If `name` is null, removes all bound
  // callbacks for all events.
  Events.off = function(name, callback, context) {
    if (!this._events) return this;
    this._events = eventsApi(offApi, this._events, name, callback, {
      context: context,
      listeners: this._listeners
    });

    return this;
  };

  // Tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  Events.stopListening = function(obj, name, callback) {
    var listeningTo = this._listeningTo;
    if (!listeningTo) return this;

    var ids = obj ? [obj._listenId] : _.keys(listeningTo);
    for (var i = 0; i < ids.length; i++) {
      var listening = listeningTo[ids[i]];

      // If listening doesn't exist, this object is not currently
      // listening to obj. Break out early.
      if (!listening) break;

      listening.obj.off(name, callback, this);
      if (listening.interop) listening.off(name, callback);
    }
    if (_.isEmpty(listeningTo)) this._listeningTo = void 0;

    return this;
  };

  // The reducing API that removes a callback from the `events` object.
  var offApi = function(events, name, callback, options) {
    if (!events) return;

    var context = options.context, listeners = options.listeners;
    var i = 0, names;

    // Delete all event listeners and "drop" events.
    if (!name && !context && !callback) {
      for (names = _.keys(listeners); i < names.length; i++) {
        listeners[names[i]].cleanup();
      }
      return;
    }

    names = name ? [name] : _.keys(events);
    for (; i < names.length; i++) {
      name = names[i];
      var handlers = events[name];

      // Bail out if there are no events stored.
      if (!handlers) break;

      // Find any remaining events.
      var remaining = [];
      for (var j = 0; j < handlers.length; j++) {
        var handler = handlers[j];
        if (
          callback && callback !== handler.callback &&
            callback !== handler.callback._callback ||
              context && context !== handler.context
        ) {
          remaining.push(handler);
        } else {
          var listening = handler.listening;
          if (listening) listening.off(name, callback);
        }
      }

      // Replace events if there are any remaining.  Otherwise, clean up.
      if (remaining.length) {
        events[name] = remaining;
      } else {
        delete events[name];
      }
    }

    return events;
  };

  // Bind an event to only be triggered a single time. After the first time
  // the callback is invoked, its listener will be removed. If multiple events
  // are passed in using the space-separated syntax, the handler will fire
  // once for each event, not once for a combination of all events.
  Events.once = function(name, callback, context) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, this.off.bind(this));
    if (typeof name === 'string' && context == null) callback = void 0;
    return this.on(events, callback, context);
  };

  // Inversion-of-control versions of `once`.
  Events.listenToOnce = function(obj, name, callback) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, this.stopListening.bind(this, obj));
    return this.listenTo(obj, events);
  };

  // Reduces the event callbacks into a map of `{event: onceWrapper}`.
  // `offer` unbinds the `onceWrapper` after it has been called.
  var onceMap = function(map, name, callback, offer) {
    if (callback) {
      var once = map[name] = _.once(function() {
        offer(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
    }
    return map;
  };

  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  Events.trigger = function(name) {
    if (!this._events) return this;

    var length = Math.max(0, arguments.length - 1);
    var args = Array(length);
    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

    eventsApi(triggerApi, this._events, name, void 0, args);
    return this;
  };

  // Handles triggering the appropriate event callbacks.
  var triggerApi = function(objEvents, name, callback, args) {
    if (objEvents) {
      var events = objEvents[name];
      var allEvents = objEvents.all;
      if (events && allEvents) allEvents = allEvents.slice();
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, [name].concat(args));
    }
    return objEvents;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  // A listening class that tracks and cleans up memory bindings
  // when all callbacks have been offed.
  var Listening = function(listener, obj) {
    this.id = listener._listenId;
    this.listener = listener;
    this.obj = obj;
    this.interop = true;
    this.count = 0;
    this._events = void 0;
  };

  Listening.prototype.on = Events.on;

  // Offs a callback (or several).
  // Uses an optimized counter if the listenee uses Backbone.Events.
  // Otherwise, falls back to manual tracking to support events
  // library interop.
  Listening.prototype.off = function(name, callback) {
    var cleanup;
    if (this.interop) {
      this._events = eventsApi(offApi, this._events, name, callback, {
        context: void 0,
        listeners: void 0
      });
      cleanup = !this._events;
    } else {
      this.count--;
      cleanup = this.count === 0;
    }
    if (cleanup) this.cleanup();
  };

  // Cleans up memory bindings between the listener and the listenee.
  Listening.prototype.cleanup = function() {
    delete this.listener._listeningTo[this.obj._listenId];
    if (!this.interop) delete this.obj._listeners[this.id];
  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    this.cid = _.uniqueId(this.cidPrefix);
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    var defaults = _.result(this, 'defaults');
    attrs = _.defaults(_.extend({}, defaults, attrs), defaults);
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // The prefix is used to create the client id which is used to identify models locally.
    // You may want to override this if you're experiencing name clashes with model ids.
    cidPrefix: 'c',

    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the Model.
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Special-cased proxy to underscore's `_.matches` method.
    matches: function(attrs) {
      return !!_.iteratee(attrs, this)(this.attributes);
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      var attrs;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      var unset      = options.unset;
      var silent     = options.silent;
      var changes    = [];
      var changing   = this._changing;
      this._changing = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }

      var current = this.attributes;
      var changed = this.changed;
      var prev    = this._previousAttributes;

      // For each `set` attribute, update or delete the current value.
      for (var attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          changed[attr] = val;
        } else {
          delete changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Update the `id`.
      if (this.idAttribute in attrs) this.id = this.get(this.idAttribute);

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0; i < changes.length; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      var changed = {};
      var hasChanged;
      for (var attr in diff) {
        var val = diff[attr];
        if (_.isEqual(old[attr], val)) continue;
        changed[attr] = val;
        hasChanged = true;
      }
      return hasChanged ? changed : false;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server, merging the response with the model's
    // local attributes. Any changed attributes will trigger a "change" event.
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (!model.set(serverAttrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      // Handle both `"key", value` and `{key: value}` -style arguments.
      var attrs;
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true, parse: true}, options);
      var wait = options.wait;

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !wait) {
        if (!this.set(attrs, options)) return false;
      } else if (!this._validate(attrs, options)) {
        return false;
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      var model = this;
      var success = options.success;
      var attributes = this.attributes;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (wait) serverAttrs = _.extend({}, attrs, serverAttrs);
        if (serverAttrs && !model.set(serverAttrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      // Set temporary attributes if `{wait: true}` to properly find new ids.
      if (attrs && wait) this.attributes = _.extend({}, attributes, attrs);

      var method = this.isNew() ? 'create' : options.patch ? 'patch' : 'update';
      if (method === 'patch' && !options.attrs) options.attrs = attrs;
      var xhr = this.sync(method, this, options);

      // Restore attributes.
      this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      var wait = options.wait;

      var destroy = function() {
        model.stopListening();
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (wait) destroy();
        if (success) success.call(options.context, model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      var xhr = false;
      if (this.isNew()) {
        _.defer(options.success);
      } else {
        wrapError(this, options);
        xhr = this.sync('delete', this, options);
      }
      if (!wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      var id = this.get(this.idAttribute);
      return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend({}, options, {validate: true}));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analogous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Splices `insert` into `array` at index `at`.
  var splice = function(array, insert, at) {
    at = Math.min(Math.max(at, 0), array.length);
    var tail = Array(array.length - at);
    var length = insert.length;
    var i;
    for (i = 0; i < tail.length; i++) tail[i] = array[i + at];
    for (i = 0; i < length; i++) array[i + at] = insert[i];
    for (i = 0; i < tail.length; i++) array[i + length + at] = tail[i];
  };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,


    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the Collection.
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model) { return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set. `models` may be Backbone
    // Models or raw JavaScript objects to be converted to Models, or any
    // combination of the two.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      options = _.extend({}, options);
      var singular = !_.isArray(models);
      models = singular ? [models] : models.slice();
      var removed = this._removeModels(models, options);
      if (!options.silent && removed.length) {
        options.changes = {added: [], merged: [], removed: removed};
        this.trigger('update', this, options);
      }
      return singular ? removed[0] : removed;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      if (models == null) return;

      options = _.extend({}, setOptions, options);
      if (options.parse && !this._isModel(models)) {
        models = this.parse(models, options) || [];
      }

      var singular = !_.isArray(models);
      models = singular ? [models] : models.slice();

      var at = options.at;
      if (at != null) at = +at;
      if (at > this.length) at = this.length;
      if (at < 0) at += this.length + 1;

      var set = [];
      var toAdd = [];
      var toMerge = [];
      var toRemove = [];
      var modelMap = {};

      var add = options.add;
      var merge = options.merge;
      var remove = options.remove;

      var sort = false;
      var sortable = this.comparator && at == null && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      var model, i;
      for (i = 0; i < models.length; i++) {
        model = models[i];

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        var existing = this.get(model);
        if (existing) {
          if (merge && model !== existing) {
            var attrs = this._isModel(model) ? model.attributes : model;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            toMerge.push(existing);
            if (sortable && !sort) sort = existing.hasChanged(sortAttr);
          }
          if (!modelMap[existing.cid]) {
            modelMap[existing.cid] = true;
            set.push(existing);
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(model, options);
          if (model) {
            toAdd.push(model);
            this._addReference(model, options);
            modelMap[model.cid] = true;
            set.push(model);
          }
        }
      }

      // Remove stale models.
      if (remove) {
        for (i = 0; i < this.length; i++) {
          model = this.models[i];
          if (!modelMap[model.cid]) toRemove.push(model);
        }
        if (toRemove.length) this._removeModels(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      var orderChanged = false;
      var replace = !sortable && add && remove;
      if (set.length && replace) {
        orderChanged = this.length !== set.length || _.some(this.models, function(m, index) {
          return m !== set[index];
        });
        this.models.length = 0;
        splice(this.models, set, 0);
        this.length = this.models.length;
      } else if (toAdd.length) {
        if (sortable) sort = true;
        splice(this.models, toAdd, at == null ? this.length : at);
        this.length = this.models.length;
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort/update events.
      if (!options.silent) {
        for (i = 0; i < toAdd.length; i++) {
          if (at != null) options.index = at + i;
          model = toAdd[i];
          model.trigger('add', model, this, options);
        }
        if (sort || orderChanged) this.trigger('sort', this, options);
        if (toAdd.length || toRemove.length || toMerge.length) {
          options.changes = {
            added: toAdd,
            removed: toRemove,
            merged: toMerge
          };
          this.trigger('update', this, options);
        }
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options = options ? _.clone(options) : {};
      for (var i = 0; i < this.models.length; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      return this.remove(model, options);
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      return this.remove(model, options);
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id, cid, model object with id or cid
    // properties, or an attributes object that is transformed through modelId.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] ||
        this._byId[this.modelId(this._isModel(obj) ? obj.attributes : obj)] ||
        obj.cid && this._byId[obj.cid];
    },

    // Returns `true` if the model is in the collection.
    has: function(obj) {
      return this.get(obj) != null;
    },

    // Get the model at the given index.
    at: function(index) {
      if (index < 0) index += this.length;
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      return this[first ? 'find' : 'filter'](attrs);
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      var comparator = this.comparator;
      if (!comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      var length = comparator.length;
      if (_.isFunction(comparator)) comparator = comparator.bind(this);

      // Run sort based on type of `comparator`.
      if (length === 1 || _.isString(comparator)) {
        this.models = this.sortBy(comparator);
      } else {
        this.models.sort(comparator);
      }
      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return this.map(attr + '');
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success.call(options.context, collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      var wait = options.wait;
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(m, resp, callbackOpts) {
        if (wait) collection.add(m, callbackOpts);
        if (success) success.call(callbackOpts.context, m, resp, callbackOpts);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models, {
        model: this.model,
        comparator: this.comparator
      });
    },

    // Define how to uniquely identify models in the collection.
    modelId: function(attrs) {
      return attrs[this.model.prototype.idAttribute || 'id'];
    },

    // Get an iterator of all models in this collection.
    values: function() {
      return new CollectionIterator(this, ITERATOR_VALUES);
    },

    // Get an iterator of all model IDs in this collection.
    keys: function() {
      return new CollectionIterator(this, ITERATOR_KEYS);
    },

    // Get an iterator of all [ID, model] tuples in this collection.
    entries: function() {
      return new CollectionIterator(this, ITERATOR_KEYSVALUES);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (this._isModel(attrs)) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method called by both remove and set.
    _removeModels: function(models, options) {
      var removed = [];
      for (var i = 0; i < models.length; i++) {
        var model = this.get(models[i]);
        if (!model) continue;

        var index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;

        // Remove references before triggering 'remove' event to prevent an
        // infinite loop. #3693
        delete this._byId[model.cid];
        var id = this.modelId(model.attributes);
        if (id != null) delete this._byId[id];

        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }

        removed.push(model);
        this._removeReference(model, options);
      }
      return removed;
    },

    // Method for checking whether an object should be considered a model for
    // the purposes of adding to the collection.
    _isModel: function(model) {
      return model instanceof Model;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      var id = this.modelId(model.attributes);
      if (id != null) this._byId[id] = model;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      delete this._byId[model.cid];
      var id = this.modelId(model.attributes);
      if (id != null) delete this._byId[id];
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if (model) {
        if ((event === 'add' || event === 'remove') && collection !== this) return;
        if (event === 'destroy') this.remove(model, options);
        if (event === 'change') {
          var prevId = this.modelId(model.previousAttributes());
          var id = this.modelId(model.attributes);
          if (prevId !== id) {
            if (prevId != null) delete this._byId[prevId];
            if (id != null) this._byId[id] = model;
          }
        }
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Defining an @@iterator method implements JavaScript's Iterable protocol.
  // In modern ES2015 browsers, this value is found at Symbol.iterator.
  /* global Symbol */
  var $$iterator = typeof Symbol === 'function' && Symbol.iterator;
  if ($$iterator) {
    Collection.prototype[$$iterator] = Collection.prototype.values;
  }

  // CollectionIterator
  // ------------------

  // A CollectionIterator implements JavaScript's Iterator protocol, allowing the
  // use of `for of` loops in modern browsers and interoperation between
  // Backbone.Collection and other JavaScript functions and third-party libraries
  // which can operate on Iterables.
  var CollectionIterator = function(collection, kind) {
    this._collection = collection;
    this._kind = kind;
    this._index = 0;
  };

  // This "enum" defines the three possible kinds of values which can be emitted
  // by a CollectionIterator that correspond to the values(), keys() and entries()
  // methods on Collection, respectively.
  var ITERATOR_VALUES = 1;
  var ITERATOR_KEYS = 2;
  var ITERATOR_KEYSVALUES = 3;

  // All Iterators should themselves be Iterable.
  if ($$iterator) {
    CollectionIterator.prototype[$$iterator] = function() {
      return this;
    };
  }

  CollectionIterator.prototype.next = function() {
    if (this._collection) {

      // Only continue iterating if the iterated collection is long enough.
      if (this._index < this._collection.length) {
        var model = this._collection.at(this._index);
        this._index++;

        // Construct a value depending on what kind of values should be iterated.
        var value;
        if (this._kind === ITERATOR_VALUES) {
          value = model;
        } else {
          var id = this._collection.modelId(model.attributes);
          if (this._kind === ITERATOR_KEYS) {
            value = id;
          } else { // ITERATOR_KEYSVALUES
            value = [id, model];
          }
        }
        return {value: value, done: false};
      }

      // Once exhausted, remove the reference to the collection so future
      // calls to the next method always return done.
      this._collection = void 0;
    }

    return {value: void 0, done: true};
  };

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this.preinitialize.apply(this, arguments);
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be set as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the View
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this._removeElement();
      this.stopListening();
      return this;
    },

    // Remove this view's element from the document and all event listeners
    // attached to it. Exposed for subclasses using an alternative DOM
    // manipulation API.
    _removeElement: function() {
      this.$el.remove();
    },

    // Change the view's element (`this.el` property) and re-delegate the
    // view's events on the new element.
    setElement: function(element) {
      this.undelegateEvents();
      this._setElement(element);
      this.delegateEvents();
      return this;
    },

    // Creates the `this.el` and `this.$el` references for this view using the
    // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
    // context or an element. Subclasses can override this to utilize an
    // alternative DOM manipulation API and are only required to set the
    // `this.el` property.
    _setElement: function(el) {
      this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
      this.el = this.$el[0];
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    delegateEvents: function(events) {
      events || (events = _.result(this, 'events'));
      if (!events) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[method];
        if (!method) continue;
        var match = key.match(delegateEventSplitter);
        this.delegate(match[1], match[2], method.bind(this));
      }
      return this;
    },

    // Add a single event listener to the view's element (or a child element
    // using `selector`). This only works for delegate-able events: not `focus`,
    // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
    delegate: function(eventName, selector, listener) {
      this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // Clears all callbacks previously bound to the view by `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      if (this.$el) this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // A finer-grained `undelegateEvents` for removing a single delegated event.
    // `selector` and `listener` are both optional.
    undelegate: function(eventName, selector, listener) {
      this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // Produces a DOM element to be assigned to your view. Exposed for
    // subclasses using an alternative DOM manipulation API.
    _createElement: function(tagName) {
      return document.createElement(tagName);
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        this.setElement(this._createElement(_.result(this, 'tagName')));
        this._setAttributes(attrs);
      } else {
        this.setElement(_.result(this, 'el'));
      }
    },

    // Set attributes from a hash on this view's element.  Exposed for
    // subclasses using an alternative DOM manipulation API.
    _setAttributes: function(attributes) {
      this.$el.attr(attributes);
    }

  });

  // Proxy Backbone class methods to Underscore functions, wrapping the model's
  // `attributes` object or collection's `models` array behind the scenes.
  //
  // collection.filter(function(model) { return model.get('age') > 10 });
  // collection.each(this.addView);
  //
  // `Function#apply` can be slow so we use the method's arg count, if we know it.
  var addMethod = function(base, length, method, attribute) {
    switch (length) {
      case 1: return function() {
        return base[method](this[attribute]);
      };
      case 2: return function(value) {
        return base[method](this[attribute], value);
      };
      case 3: return function(iteratee, context) {
        return base[method](this[attribute], cb(iteratee, this), context);
      };
      case 4: return function(iteratee, defaultVal, context) {
        return base[method](this[attribute], cb(iteratee, this), defaultVal, context);
      };
      default: return function() {
        var args = slice.call(arguments);
        args.unshift(this[attribute]);
        return base[method].apply(base, args);
      };
    }
  };

  var addUnderscoreMethods = function(Class, base, methods, attribute) {
    _.each(methods, function(length, method) {
      if (base[method]) Class.prototype[method] = addMethod(base, length, method, attribute);
    });
  };

  // Support `collection.sortBy('attr')` and `collection.findWhere({id: 1})`.
  var cb = function(iteratee, instance) {
    if (_.isFunction(iteratee)) return iteratee;
    if (_.isObject(iteratee) && !instance._isModel(iteratee)) return modelMatcher(iteratee);
    if (_.isString(iteratee)) return function(model) { return model.get(iteratee); };
    return iteratee;
  };
  var modelMatcher = function(attrs) {
    var matcher = _.matches(attrs);
    return function(model) {
      return matcher(model.attributes);
    };
  };

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var collectionMethods = {forEach: 3, each: 3, map: 3, collect: 3, reduce: 0,
    foldl: 0, inject: 0, reduceRight: 0, foldr: 0, find: 3, detect: 3, filter: 3,
    select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3,
    contains: 3, invoke: 0, max: 3, min: 3, toArray: 1, size: 1, first: 3,
    head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
    without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
    isEmpty: 1, chain: 1, sample: 3, partition: 3, groupBy: 3, countBy: 3,
    sortBy: 3, indexBy: 3, findIndex: 3, findLastIndex: 3};


  // Underscore methods that we want to implement on the Model, mapped to the
  // number of arguments they take.
  var modelMethods = {keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
    omit: 0, chain: 1, isEmpty: 1};

  // Mix in each Underscore method as a proxy to `Collection#models`.

  _.each([
    [Collection, collectionMethods, 'models'],
    [Model, modelMethods, 'attributes']
  ], function(config) {
    var Base = config[0],
        methods = config[1],
        attribute = config[2];

    Base.mixin = function(obj) {
      var mappings = _.reduce(_.functions(obj), function(memo, name) {
        memo[name] = 0;
        return memo;
      }, {});
      addUnderscoreMethods(Base, obj, mappings, attribute);
    };

    addUnderscoreMethods(Base, _, methods, attribute);
  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // Pass along `textStatus` and `errorThrown` from jQuery.
    var error = options.error;
    options.error = function(xhr, textStatus, errorThrown) {
      options.textStatus = textStatus;
      options.errorThrown = errorThrown;
      if (error) error.call(options.context, xhr, textStatus, errorThrown);
    };

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    create: 'POST',
    update: 'PUT',
    patch: 'PATCH',
    delete: 'DELETE',
    read: 'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the Router.
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        if (router.execute(callback, args, name) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
        }
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args, name) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
        .replace(optionalParam, '(?:$1)?')
        .replace(namedParam, function(match, optional) {
          return optional ? match : '([^/?]+)';
        })
        .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    this.checkUrl = this.checkUrl.bind(this);

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      var path = this.location.pathname.replace(/[^\/]$/, '$&/');
      return path === this.root && !this.getSearch();
    },

    // Does the pathname match the root?
    matchRoot: function() {
      var path = this.decodeFragment(this.location.pathname);
      var rootPath = path.slice(0, this.root.length - 1) + '/';
      return rootPath === this.root;
    },

    // Unicode characters in `location.pathname` are percent encoded so they're
    // decoded for comparison. `%25` should not be decoded since it may be part
    // of an encoded parameter.
    decodeFragment: function(fragment) {
      return decodeURI(fragment.replace(/%25/g, '%2525'));
    },

    // In IE6, the hash fragment and search params are incorrect if the
    // fragment contains `?`.
    getSearch: function() {
      var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
      return match ? match[0] : '';
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the pathname and search params, without the root.
    getPath: function() {
      var path = this.decodeFragment(
        this.location.pathname + this.getSearch()
      ).slice(this.root.length - 1);
      return path.charAt(0) === '/' ? path.slice(1) : path;
    },

    // Get the cross-browser normalized URL fragment from the path or hash.
    getFragment: function(fragment) {
      if (fragment == null) {
        if (this._usePushState || !this._wantsHashChange) {
          fragment = this.getPath();
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error('Backbone.history has already been started');
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._hasHashChange   = 'onhashchange' in window && (document.documentMode === void 0 || document.documentMode > 7);
      this._useHashChange   = this._wantsHashChange && this._hasHashChange;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.history && this.history.pushState);
      this._usePushState    = this._wantsPushState && this._hasPushState;
      this.fragment         = this.getFragment();

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          var rootPath = this.root.slice(0, -1) || '/';
          this.location.replace(rootPath + '#' + this.getPath());
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot()) {
          this.navigate(this.getHash(), {replace: true});
        }

      }

      // Proxy an iframe to handle location events if the browser doesn't
      // support the `hashchange` event, HTML5 history, or the user wants
      // `hashChange` but not `pushState`.
      if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
        this.iframe = document.createElement('iframe');
        this.iframe.src = 'javascript:0';
        this.iframe.style.display = 'none';
        this.iframe.tabIndex = -1;
        var body = document.body;
        // Using `appendChild` will throw on IE < 9 if the document is not ready.
        var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
        iWindow.document.open();
        iWindow.document.close();
        iWindow.location.hash = '#' + this.fragment;
      }

      // Add a cross-platform `addEventListener` shim for older browsers.
      var addEventListener = window.addEventListener || function(eventName, listener) {
        return attachEvent('on' + eventName, listener);
      };

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._usePushState) {
        addEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        addEventListener('hashchange', this.checkUrl, false);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      // Add a cross-platform `removeEventListener` shim for older browsers.
      var removeEventListener = window.removeEventListener || function(eventName, listener) {
        return detachEvent('on' + eventName, listener);
      };

      // Remove window listeners.
      if (this._usePushState) {
        removeEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        removeEventListener('hashchange', this.checkUrl, false);
      }

      // Clean up the iframe if necessary.
      if (this.iframe) {
        document.body.removeChild(this.iframe);
        this.iframe = null;
      }

      // Some environments will throw when clearing an undefined interval.
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();

      // If the user pressed the back button, the iframe's hash will have
      // changed and we should use that for comparison.
      if (current === this.fragment && this.iframe) {
        current = this.getHash(this.iframe.contentWindow);
      }

      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      // If the root doesn't match, no routes can match either.
      if (!this.matchRoot()) return false;
      fragment = this.fragment = this.getFragment(fragment);
      return _.some(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      // Normalize the fragment.
      fragment = this.getFragment(fragment || '');

      // Don't include a trailing slash on the root.
      var rootPath = this.root;
      if (fragment === '' || fragment.charAt(0) === '?') {
        rootPath = rootPath.slice(0, -1) || '/';
      }
      var url = rootPath + fragment;

      // Strip the fragment of the query and hash for matching.
      fragment = fragment.replace(pathStripper, '');

      // Decode for matching.
      var decodedFragment = this.decodeFragment(fragment);

      if (this.fragment === decodedFragment) return;
      this.fragment = decodedFragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._usePushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
          var iWindow = this.iframe.contentWindow;

          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if (!options.replace) {
            iWindow.document.open();
            iWindow.document.close();
          }

          this._updateHash(iWindow.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function and add the prototype properties.
    child.prototype = _.create(parent.prototype, protoProps);
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error.call(options.context, model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9iYWNrYm9uZS9iYWNrYm9uZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAgICAgQmFja2JvbmUuanMgMS40LjBcblxuLy8gICAgIChjKSAyMDEwLTIwMTkgSmVyZW15IEFzaGtlbmFzIGFuZCBEb2N1bWVudENsb3VkXG4vLyAgICAgQmFja2JvbmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vLyAgICAgRm9yIGFsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuLy8gICAgIGh0dHA6Ly9iYWNrYm9uZWpzLm9yZ1xuXG4oZnVuY3Rpb24oZmFjdG9yeSkge1xuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIChgc2VsZmApIGluIHRoZSBicm93c2VyLCBvciBgZ2xvYmFsYCBvbiB0aGUgc2VydmVyLlxuICAvLyBXZSB1c2UgYHNlbGZgIGluc3RlYWQgb2YgYHdpbmRvd2AgZm9yIGBXZWJXb3JrZXJgIHN1cHBvcnQuXG4gIHZhciByb290ID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZi5zZWxmID09PSBzZWxmICYmIHNlbGYgfHxcbiAgICAgICAgICAgIHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsLmdsb2JhbCA9PT0gZ2xvYmFsICYmIGdsb2JhbDtcblxuICAvLyBTZXQgdXAgQmFja2JvbmUgYXBwcm9wcmlhdGVseSBmb3IgdGhlIGVudmlyb25tZW50LiBTdGFydCB3aXRoIEFNRC5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ3VuZGVyc2NvcmUnLCAnanF1ZXJ5JywgJ2V4cG9ydHMnXSwgZnVuY3Rpb24oXywgJCwgZXhwb3J0cykge1xuICAgICAgLy8gRXhwb3J0IGdsb2JhbCBldmVuIGluIEFNRCBjYXNlIGluIGNhc2UgdGhpcyBzY3JpcHQgaXMgbG9hZGVkIHdpdGhcbiAgICAgIC8vIG90aGVycyB0aGF0IG1heSBzdGlsbCBleHBlY3QgYSBnbG9iYWwgQmFja2JvbmUuXG4gICAgICByb290LkJhY2tib25lID0gZmFjdG9yeShyb290LCBleHBvcnRzLCBfLCAkKTtcbiAgICB9KTtcblxuICAvLyBOZXh0IGZvciBOb2RlLmpzIG9yIENvbW1vbkpTLiBqUXVlcnkgbWF5IG5vdCBiZSBuZWVkZWQgYXMgYSBtb2R1bGUuXG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyksICQ7XG4gICAgdHJ5IHsgJCA9IHJlcXVpcmUoJ2pxdWVyeScpOyB9IGNhdGNoIChlKSB7fVxuICAgIGZhY3Rvcnkocm9vdCwgZXhwb3J0cywgXywgJCk7XG5cbiAgLy8gRmluYWxseSwgYXMgYSBicm93c2VyIGdsb2JhbC5cbiAgfSBlbHNlIHtcbiAgICByb290LkJhY2tib25lID0gZmFjdG9yeShyb290LCB7fSwgcm9vdC5fLCByb290LmpRdWVyeSB8fCByb290LlplcHRvIHx8IHJvb3QuZW5kZXIgfHwgcm9vdC4kKTtcbiAgfVxuXG59KShmdW5jdGlvbihyb290LCBCYWNrYm9uZSwgXywgJCkge1xuXG4gIC8vIEluaXRpYWwgU2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgQmFja2JvbmVgIHZhcmlhYmxlLCBzbyB0aGF0IGl0IGNhbiBiZVxuICAvLyByZXN0b3JlZCBsYXRlciBvbiwgaWYgYG5vQ29uZmxpY3RgIGlzIHVzZWQuXG4gIHZhciBwcmV2aW91c0JhY2tib25lID0gcm9vdC5CYWNrYm9uZTtcblxuICAvLyBDcmVhdGUgYSBsb2NhbCByZWZlcmVuY2UgdG8gYSBjb21tb24gYXJyYXkgbWV0aG9kIHdlJ2xsIHdhbnQgdG8gdXNlIGxhdGVyLlxuICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbiAgLy8gQ3VycmVudCB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5LiBLZWVwIGluIHN5bmMgd2l0aCBgcGFja2FnZS5qc29uYC5cbiAgQmFja2JvbmUuVkVSU0lPTiA9ICcxLjQuMCc7XG5cbiAgLy8gRm9yIEJhY2tib25lJ3MgcHVycG9zZXMsIGpRdWVyeSwgWmVwdG8sIEVuZGVyLCBvciBNeSBMaWJyYXJ5IChraWRkaW5nKSBvd25zXG4gIC8vIHRoZSBgJGAgdmFyaWFibGUuXG4gIEJhY2tib25lLiQgPSAkO1xuXG4gIC8vIFJ1bnMgQmFja2JvbmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYEJhY2tib25lYCB2YXJpYWJsZVxuICAvLyB0byBpdHMgcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhpcyBCYWNrYm9uZSBvYmplY3QuXG4gIEJhY2tib25lLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290LkJhY2tib25lID0gcHJldmlvdXNCYWNrYm9uZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBUdXJuIG9uIGBlbXVsYXRlSFRUUGAgdG8gc3VwcG9ydCBsZWdhY3kgSFRUUCBzZXJ2ZXJzLiBTZXR0aW5nIHRoaXMgb3B0aW9uXG4gIC8vIHdpbGwgZmFrZSBgXCJQQVRDSFwiYCwgYFwiUFVUXCJgIGFuZCBgXCJERUxFVEVcImAgcmVxdWVzdHMgdmlhIHRoZSBgX21ldGhvZGAgcGFyYW1ldGVyIGFuZFxuICAvLyBzZXQgYSBgWC1IdHRwLU1ldGhvZC1PdmVycmlkZWAgaGVhZGVyLlxuICBCYWNrYm9uZS5lbXVsYXRlSFRUUCA9IGZhbHNlO1xuXG4gIC8vIFR1cm4gb24gYGVtdWxhdGVKU09OYCB0byBzdXBwb3J0IGxlZ2FjeSBzZXJ2ZXJzIHRoYXQgY2FuJ3QgZGVhbCB3aXRoIGRpcmVjdFxuICAvLyBgYXBwbGljYXRpb24vanNvbmAgcmVxdWVzdHMgLi4uIHRoaXMgd2lsbCBlbmNvZGUgdGhlIGJvZHkgYXNcbiAgLy8gYGFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZGAgaW5zdGVhZCBhbmQgd2lsbCBzZW5kIHRoZSBtb2RlbCBpbiBhXG4gIC8vIGZvcm0gcGFyYW0gbmFtZWQgYG1vZGVsYC5cbiAgQmFja2JvbmUuZW11bGF0ZUpTT04gPSBmYWxzZTtcblxuICAvLyBCYWNrYm9uZS5FdmVudHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gQSBtb2R1bGUgdGhhdCBjYW4gYmUgbWl4ZWQgaW4gdG8gKmFueSBvYmplY3QqIGluIG9yZGVyIHRvIHByb3ZpZGUgaXQgd2l0aFxuICAvLyBhIGN1c3RvbSBldmVudCBjaGFubmVsLiBZb3UgbWF5IGJpbmQgYSBjYWxsYmFjayB0byBhbiBldmVudCB3aXRoIGBvbmAgb3JcbiAgLy8gcmVtb3ZlIHdpdGggYG9mZmA7IGB0cmlnZ2VyYC1pbmcgYW4gZXZlbnQgZmlyZXMgYWxsIGNhbGxiYWNrcyBpblxuICAvLyBzdWNjZXNzaW9uLlxuICAvL1xuICAvLyAgICAgdmFyIG9iamVjdCA9IHt9O1xuICAvLyAgICAgXy5leHRlbmQob2JqZWN0LCBCYWNrYm9uZS5FdmVudHMpO1xuICAvLyAgICAgb2JqZWN0Lm9uKCdleHBhbmQnLCBmdW5jdGlvbigpeyBhbGVydCgnZXhwYW5kZWQnKTsgfSk7XG4gIC8vICAgICBvYmplY3QudHJpZ2dlcignZXhwYW5kJyk7XG4gIC8vXG4gIHZhciBFdmVudHMgPSBCYWNrYm9uZS5FdmVudHMgPSB7fTtcblxuICAvLyBSZWd1bGFyIGV4cHJlc3Npb24gdXNlZCB0byBzcGxpdCBldmVudCBzdHJpbmdzLlxuICB2YXIgZXZlbnRTcGxpdHRlciA9IC9cXHMrLztcblxuICAvLyBBIHByaXZhdGUgZ2xvYmFsIHZhcmlhYmxlIHRvIHNoYXJlIGJldHdlZW4gbGlzdGVuZXJzIGFuZCBsaXN0ZW5lZXMuXG4gIHZhciBfbGlzdGVuaW5nO1xuXG4gIC8vIEl0ZXJhdGVzIG92ZXIgdGhlIHN0YW5kYXJkIGBldmVudCwgY2FsbGJhY2tgIChhcyB3ZWxsIGFzIHRoZSBmYW5jeSBtdWx0aXBsZVxuICAvLyBzcGFjZS1zZXBhcmF0ZWQgZXZlbnRzIGBcImNoYW5nZSBibHVyXCIsIGNhbGxiYWNrYCBhbmQgalF1ZXJ5LXN0eWxlIGV2ZW50XG4gIC8vIG1hcHMgYHtldmVudDogY2FsbGJhY2t9YCkuXG4gIHZhciBldmVudHNBcGkgPSBmdW5jdGlvbihpdGVyYXRlZSwgZXZlbnRzLCBuYW1lLCBjYWxsYmFjaywgb3B0cykge1xuICAgIHZhciBpID0gMCwgbmFtZXM7XG4gICAgaWYgKG5hbWUgJiYgdHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAvLyBIYW5kbGUgZXZlbnQgbWFwcy5cbiAgICAgIGlmIChjYWxsYmFjayAhPT0gdm9pZCAwICYmICdjb250ZXh0JyBpbiBvcHRzICYmIG9wdHMuY29udGV4dCA9PT0gdm9pZCAwKSBvcHRzLmNvbnRleHQgPSBjYWxsYmFjaztcbiAgICAgIGZvciAobmFtZXMgPSBfLmtleXMobmFtZSk7IGkgPCBuYW1lcy5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgZXZlbnRzID0gZXZlbnRzQXBpKGl0ZXJhdGVlLCBldmVudHMsIG5hbWVzW2ldLCBuYW1lW25hbWVzW2ldXSwgb3B0cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChuYW1lICYmIGV2ZW50U3BsaXR0ZXIudGVzdChuYW1lKSkge1xuICAgICAgLy8gSGFuZGxlIHNwYWNlLXNlcGFyYXRlZCBldmVudCBuYW1lcyBieSBkZWxlZ2F0aW5nIHRoZW0gaW5kaXZpZHVhbGx5LlxuICAgICAgZm9yIChuYW1lcyA9IG5hbWUuc3BsaXQoZXZlbnRTcGxpdHRlcik7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBldmVudHMgPSBpdGVyYXRlZShldmVudHMsIG5hbWVzW2ldLCBjYWxsYmFjaywgb3B0cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZpbmFsbHksIHN0YW5kYXJkIGV2ZW50cy5cbiAgICAgIGV2ZW50cyA9IGl0ZXJhdGVlKGV2ZW50cywgbmFtZSwgY2FsbGJhY2ssIG9wdHMpO1xuICAgIH1cbiAgICByZXR1cm4gZXZlbnRzO1xuICB9O1xuXG4gIC8vIEJpbmQgYW4gZXZlbnQgdG8gYSBgY2FsbGJhY2tgIGZ1bmN0aW9uLiBQYXNzaW5nIGBcImFsbFwiYCB3aWxsIGJpbmRcbiAgLy8gdGhlIGNhbGxiYWNrIHRvIGFsbCBldmVudHMgZmlyZWQuXG4gIEV2ZW50cy5vbiA9IGZ1bmN0aW9uKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5fZXZlbnRzID0gZXZlbnRzQXBpKG9uQXBpLCB0aGlzLl9ldmVudHMgfHwge30sIG5hbWUsIGNhbGxiYWNrLCB7XG4gICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgY3R4OiB0aGlzLFxuICAgICAgbGlzdGVuaW5nOiBfbGlzdGVuaW5nXG4gICAgfSk7XG5cbiAgICBpZiAoX2xpc3RlbmluZykge1xuICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycyB8fCAodGhpcy5fbGlzdGVuZXJzID0ge30pO1xuICAgICAgbGlzdGVuZXJzW19saXN0ZW5pbmcuaWRdID0gX2xpc3RlbmluZztcbiAgICAgIC8vIEFsbG93IHRoZSBsaXN0ZW5pbmcgdG8gdXNlIGEgY291bnRlciwgaW5zdGVhZCBvZiB0cmFja2luZ1xuICAgICAgLy8gY2FsbGJhY2tzIGZvciBsaWJyYXJ5IGludGVyb3BcbiAgICAgIF9saXN0ZW5pbmcuaW50ZXJvcCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIEludmVyc2lvbi1vZi1jb250cm9sIHZlcnNpb25zIG9mIGBvbmAuIFRlbGwgKnRoaXMqIG9iamVjdCB0byBsaXN0ZW4gdG9cbiAgLy8gYW4gZXZlbnQgaW4gYW5vdGhlciBvYmplY3QuLi4ga2VlcGluZyB0cmFjayBvZiB3aGF0IGl0J3MgbGlzdGVuaW5nIHRvXG4gIC8vIGZvciBlYXNpZXIgdW5iaW5kaW5nIGxhdGVyLlxuICBFdmVudHMubGlzdGVuVG8gPSBmdW5jdGlvbihvYmosIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiB0aGlzO1xuICAgIHZhciBpZCA9IG9iai5fbGlzdGVuSWQgfHwgKG9iai5fbGlzdGVuSWQgPSBfLnVuaXF1ZUlkKCdsJykpO1xuICAgIHZhciBsaXN0ZW5pbmdUbyA9IHRoaXMuX2xpc3RlbmluZ1RvIHx8ICh0aGlzLl9saXN0ZW5pbmdUbyA9IHt9KTtcbiAgICB2YXIgbGlzdGVuaW5nID0gX2xpc3RlbmluZyA9IGxpc3RlbmluZ1RvW2lkXTtcblxuICAgIC8vIFRoaXMgb2JqZWN0IGlzIG5vdCBsaXN0ZW5pbmcgdG8gYW55IG90aGVyIGV2ZW50cyBvbiBgb2JqYCB5ZXQuXG4gICAgLy8gU2V0dXAgdGhlIG5lY2Vzc2FyeSByZWZlcmVuY2VzIHRvIHRyYWNrIHRoZSBsaXN0ZW5pbmcgY2FsbGJhY2tzLlxuICAgIGlmICghbGlzdGVuaW5nKSB7XG4gICAgICB0aGlzLl9saXN0ZW5JZCB8fCAodGhpcy5fbGlzdGVuSWQgPSBfLnVuaXF1ZUlkKCdsJykpO1xuICAgICAgbGlzdGVuaW5nID0gX2xpc3RlbmluZyA9IGxpc3RlbmluZ1RvW2lkXSA9IG5ldyBMaXN0ZW5pbmcodGhpcywgb2JqKTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIGNhbGxiYWNrcyBvbiBvYmouXG4gICAgdmFyIGVycm9yID0gdHJ5Q2F0Y2hPbihvYmosIG5hbWUsIGNhbGxiYWNrLCB0aGlzKTtcbiAgICBfbGlzdGVuaW5nID0gdm9pZCAwO1xuXG4gICAgaWYgKGVycm9yKSB0aHJvdyBlcnJvcjtcbiAgICAvLyBJZiB0aGUgdGFyZ2V0IG9iaiBpcyBub3QgQmFja2JvbmUuRXZlbnRzLCB0cmFjayBldmVudHMgbWFudWFsbHkuXG4gICAgaWYgKGxpc3RlbmluZy5pbnRlcm9wKSBsaXN0ZW5pbmcub24obmFtZSwgY2FsbGJhY2spO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gVGhlIHJlZHVjaW5nIEFQSSB0aGF0IGFkZHMgYSBjYWxsYmFjayB0byB0aGUgYGV2ZW50c2Agb2JqZWN0LlxuICB2YXIgb25BcGkgPSBmdW5jdGlvbihldmVudHMsIG5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgaGFuZGxlcnMgPSBldmVudHNbbmFtZV0gfHwgKGV2ZW50c1tuYW1lXSA9IFtdKTtcbiAgICAgIHZhciBjb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0LCBjdHggPSBvcHRpb25zLmN0eCwgbGlzdGVuaW5nID0gb3B0aW9ucy5saXN0ZW5pbmc7XG4gICAgICBpZiAobGlzdGVuaW5nKSBsaXN0ZW5pbmcuY291bnQrKztcblxuICAgICAgaGFuZGxlcnMucHVzaCh7Y2FsbGJhY2s6IGNhbGxiYWNrLCBjb250ZXh0OiBjb250ZXh0LCBjdHg6IGNvbnRleHQgfHwgY3R4LCBsaXN0ZW5pbmc6IGxpc3RlbmluZ30pO1xuICAgIH1cbiAgICByZXR1cm4gZXZlbnRzO1xuICB9O1xuXG4gIC8vIEFuIHRyeS1jYXRjaCBndWFyZGVkICNvbiBmdW5jdGlvbiwgdG8gcHJldmVudCBwb2lzb25pbmcgdGhlIGdsb2JhbFxuICAvLyBgX2xpc3RlbmluZ2AgdmFyaWFibGUuXG4gIHZhciB0cnlDYXRjaE9uID0gZnVuY3Rpb24ob2JqLCBuYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHRyeSB7XG4gICAgICBvYmoub24obmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBlO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZW1vdmUgb25lIG9yIG1hbnkgY2FsbGJhY2tzLiBJZiBgY29udGV4dGAgaXMgbnVsbCwgcmVtb3ZlcyBhbGxcbiAgLy8gY2FsbGJhY2tzIHdpdGggdGhhdCBmdW5jdGlvbi4gSWYgYGNhbGxiYWNrYCBpcyBudWxsLCByZW1vdmVzIGFsbFxuICAvLyBjYWxsYmFja3MgZm9yIHRoZSBldmVudC4gSWYgYG5hbWVgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGJvdW5kXG4gIC8vIGNhbGxiYWNrcyBmb3IgYWxsIGV2ZW50cy5cbiAgRXZlbnRzLm9mZiA9IGZ1bmN0aW9uKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiB0aGlzO1xuICAgIHRoaXMuX2V2ZW50cyA9IGV2ZW50c0FwaShvZmZBcGksIHRoaXMuX2V2ZW50cywgbmFtZSwgY2FsbGJhY2ssIHtcbiAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICBsaXN0ZW5lcnM6IHRoaXMuX2xpc3RlbmVyc1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gVGVsbCB0aGlzIG9iamVjdCB0byBzdG9wIGxpc3RlbmluZyB0byBlaXRoZXIgc3BlY2lmaWMgZXZlbnRzIC4uLiBvclxuICAvLyB0byBldmVyeSBvYmplY3QgaXQncyBjdXJyZW50bHkgbGlzdGVuaW5nIHRvLlxuICBFdmVudHMuc3RvcExpc3RlbmluZyA9IGZ1bmN0aW9uKG9iaiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgbGlzdGVuaW5nVG8gPSB0aGlzLl9saXN0ZW5pbmdUbztcbiAgICBpZiAoIWxpc3RlbmluZ1RvKSByZXR1cm4gdGhpcztcblxuICAgIHZhciBpZHMgPSBvYmogPyBbb2JqLl9saXN0ZW5JZF0gOiBfLmtleXMobGlzdGVuaW5nVG8pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbGlzdGVuaW5nID0gbGlzdGVuaW5nVG9baWRzW2ldXTtcblxuICAgICAgLy8gSWYgbGlzdGVuaW5nIGRvZXNuJ3QgZXhpc3QsIHRoaXMgb2JqZWN0IGlzIG5vdCBjdXJyZW50bHlcbiAgICAgIC8vIGxpc3RlbmluZyB0byBvYmouIEJyZWFrIG91dCBlYXJseS5cbiAgICAgIGlmICghbGlzdGVuaW5nKSBicmVhaztcblxuICAgICAgbGlzdGVuaW5nLm9iai5vZmYobmFtZSwgY2FsbGJhY2ssIHRoaXMpO1xuICAgICAgaWYgKGxpc3RlbmluZy5pbnRlcm9wKSBsaXN0ZW5pbmcub2ZmKG5hbWUsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgaWYgKF8uaXNFbXB0eShsaXN0ZW5pbmdUbykpIHRoaXMuX2xpc3RlbmluZ1RvID0gdm9pZCAwO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gVGhlIHJlZHVjaW5nIEFQSSB0aGF0IHJlbW92ZXMgYSBjYWxsYmFjayBmcm9tIHRoZSBgZXZlbnRzYCBvYmplY3QuXG4gIHZhciBvZmZBcGkgPSBmdW5jdGlvbihldmVudHMsIG5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgaWYgKCFldmVudHMpIHJldHVybjtcblxuICAgIHZhciBjb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0LCBsaXN0ZW5lcnMgPSBvcHRpb25zLmxpc3RlbmVycztcbiAgICB2YXIgaSA9IDAsIG5hbWVzO1xuXG4gICAgLy8gRGVsZXRlIGFsbCBldmVudCBsaXN0ZW5lcnMgYW5kIFwiZHJvcFwiIGV2ZW50cy5cbiAgICBpZiAoIW5hbWUgJiYgIWNvbnRleHQgJiYgIWNhbGxiYWNrKSB7XG4gICAgICBmb3IgKG5hbWVzID0gXy5rZXlzKGxpc3RlbmVycyk7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsaXN0ZW5lcnNbbmFtZXNbaV1dLmNsZWFudXAoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBuYW1lcyA9IG5hbWUgPyBbbmFtZV0gOiBfLmtleXMoZXZlbnRzKTtcbiAgICBmb3IgKDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBuYW1lID0gbmFtZXNbaV07XG4gICAgICB2YXIgaGFuZGxlcnMgPSBldmVudHNbbmFtZV07XG5cbiAgICAgIC8vIEJhaWwgb3V0IGlmIHRoZXJlIGFyZSBubyBldmVudHMgc3RvcmVkLlxuICAgICAgaWYgKCFoYW5kbGVycykgYnJlYWs7XG5cbiAgICAgIC8vIEZpbmQgYW55IHJlbWFpbmluZyBldmVudHMuXG4gICAgICB2YXIgcmVtYWluaW5nID0gW107XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBoYW5kbGVyID0gaGFuZGxlcnNbal07XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayAhPT0gaGFuZGxlci5jYWxsYmFjayAmJlxuICAgICAgICAgICAgY2FsbGJhY2sgIT09IGhhbmRsZXIuY2FsbGJhY2suX2NhbGxiYWNrIHx8XG4gICAgICAgICAgICAgIGNvbnRleHQgJiYgY29udGV4dCAhPT0gaGFuZGxlci5jb250ZXh0XG4gICAgICAgICkge1xuICAgICAgICAgIHJlbWFpbmluZy5wdXNoKGhhbmRsZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBsaXN0ZW5pbmcgPSBoYW5kbGVyLmxpc3RlbmluZztcbiAgICAgICAgICBpZiAobGlzdGVuaW5nKSBsaXN0ZW5pbmcub2ZmKG5hbWUsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBSZXBsYWNlIGV2ZW50cyBpZiB0aGVyZSBhcmUgYW55IHJlbWFpbmluZy4gIE90aGVyd2lzZSwgY2xlYW4gdXAuXG4gICAgICBpZiAocmVtYWluaW5nLmxlbmd0aCkge1xuICAgICAgICBldmVudHNbbmFtZV0gPSByZW1haW5pbmc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgZXZlbnRzW25hbWVdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBldmVudHM7XG4gIH07XG5cbiAgLy8gQmluZCBhbiBldmVudCB0byBvbmx5IGJlIHRyaWdnZXJlZCBhIHNpbmdsZSB0aW1lLiBBZnRlciB0aGUgZmlyc3QgdGltZVxuICAvLyB0aGUgY2FsbGJhY2sgaXMgaW52b2tlZCwgaXRzIGxpc3RlbmVyIHdpbGwgYmUgcmVtb3ZlZC4gSWYgbXVsdGlwbGUgZXZlbnRzXG4gIC8vIGFyZSBwYXNzZWQgaW4gdXNpbmcgdGhlIHNwYWNlLXNlcGFyYXRlZCBzeW50YXgsIHRoZSBoYW5kbGVyIHdpbGwgZmlyZVxuICAvLyBvbmNlIGZvciBlYWNoIGV2ZW50LCBub3Qgb25jZSBmb3IgYSBjb21iaW5hdGlvbiBvZiBhbGwgZXZlbnRzLlxuICBFdmVudHMub25jZSA9IGZ1bmN0aW9uKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgLy8gTWFwIHRoZSBldmVudCBpbnRvIGEgYHtldmVudDogb25jZX1gIG9iamVjdC5cbiAgICB2YXIgZXZlbnRzID0gZXZlbnRzQXBpKG9uY2VNYXAsIHt9LCBuYW1lLCBjYWxsYmFjaywgdGhpcy5vZmYuYmluZCh0aGlzKSk7XG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJyAmJiBjb250ZXh0ID09IG51bGwpIGNhbGxiYWNrID0gdm9pZCAwO1xuICAgIHJldHVybiB0aGlzLm9uKGV2ZW50cywgY2FsbGJhY2ssIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIEludmVyc2lvbi1vZi1jb250cm9sIHZlcnNpb25zIG9mIGBvbmNlYC5cbiAgRXZlbnRzLmxpc3RlblRvT25jZSA9IGZ1bmN0aW9uKG9iaiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgICAvLyBNYXAgdGhlIGV2ZW50IGludG8gYSBge2V2ZW50OiBvbmNlfWAgb2JqZWN0LlxuICAgIHZhciBldmVudHMgPSBldmVudHNBcGkob25jZU1hcCwge30sIG5hbWUsIGNhbGxiYWNrLCB0aGlzLnN0b3BMaXN0ZW5pbmcuYmluZCh0aGlzLCBvYmopKTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5UbyhvYmosIGV2ZW50cyk7XG4gIH07XG5cbiAgLy8gUmVkdWNlcyB0aGUgZXZlbnQgY2FsbGJhY2tzIGludG8gYSBtYXAgb2YgYHtldmVudDogb25jZVdyYXBwZXJ9YC5cbiAgLy8gYG9mZmVyYCB1bmJpbmRzIHRoZSBgb25jZVdyYXBwZXJgIGFmdGVyIGl0IGhhcyBiZWVuIGNhbGxlZC5cbiAgdmFyIG9uY2VNYXAgPSBmdW5jdGlvbihtYXAsIG5hbWUsIGNhbGxiYWNrLCBvZmZlcikge1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdmFyIG9uY2UgPSBtYXBbbmFtZV0gPSBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIG9mZmVyKG5hbWUsIG9uY2UpO1xuICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfSk7XG4gICAgICBvbmNlLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cbiAgICByZXR1cm4gbWFwO1xuICB9O1xuXG4gIC8vIFRyaWdnZXIgb25lIG9yIG1hbnkgZXZlbnRzLCBmaXJpbmcgYWxsIGJvdW5kIGNhbGxiYWNrcy4gQ2FsbGJhY2tzIGFyZVxuICAvLyBwYXNzZWQgdGhlIHNhbWUgYXJndW1lbnRzIGFzIGB0cmlnZ2VyYCBpcywgYXBhcnQgZnJvbSB0aGUgZXZlbnQgbmFtZVxuICAvLyAodW5sZXNzIHlvdSdyZSBsaXN0ZW5pbmcgb24gYFwiYWxsXCJgLCB3aGljaCB3aWxsIGNhdXNlIHlvdXIgY2FsbGJhY2sgdG9cbiAgLy8gcmVjZWl2ZSB0aGUgdHJ1ZSBuYW1lIG9mIHRoZSBldmVudCBhcyB0aGUgZmlyc3QgYXJndW1lbnQpLlxuICBFdmVudHMudHJpZ2dlciA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cykgcmV0dXJuIHRoaXM7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5tYXgoMCwgYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIHZhciBhcmdzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXTtcblxuICAgIGV2ZW50c0FwaSh0cmlnZ2VyQXBpLCB0aGlzLl9ldmVudHMsIG5hbWUsIHZvaWQgMCwgYXJncyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gSGFuZGxlcyB0cmlnZ2VyaW5nIHRoZSBhcHByb3ByaWF0ZSBldmVudCBjYWxsYmFja3MuXG4gIHZhciB0cmlnZ2VyQXBpID0gZnVuY3Rpb24ob2JqRXZlbnRzLCBuYW1lLCBjYWxsYmFjaywgYXJncykge1xuICAgIGlmIChvYmpFdmVudHMpIHtcbiAgICAgIHZhciBldmVudHMgPSBvYmpFdmVudHNbbmFtZV07XG4gICAgICB2YXIgYWxsRXZlbnRzID0gb2JqRXZlbnRzLmFsbDtcbiAgICAgIGlmIChldmVudHMgJiYgYWxsRXZlbnRzKSBhbGxFdmVudHMgPSBhbGxFdmVudHMuc2xpY2UoKTtcbiAgICAgIGlmIChldmVudHMpIHRyaWdnZXJFdmVudHMoZXZlbnRzLCBhcmdzKTtcbiAgICAgIGlmIChhbGxFdmVudHMpIHRyaWdnZXJFdmVudHMoYWxsRXZlbnRzLCBbbmFtZV0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iakV2ZW50cztcbiAgfTtcblxuICAvLyBBIGRpZmZpY3VsdC10by1iZWxpZXZlLCBidXQgb3B0aW1pemVkIGludGVybmFsIGRpc3BhdGNoIGZ1bmN0aW9uIGZvclxuICAvLyB0cmlnZ2VyaW5nIGV2ZW50cy4gVHJpZXMgdG8ga2VlcCB0aGUgdXN1YWwgY2FzZXMgc3BlZWR5IChtb3N0IGludGVybmFsXG4gIC8vIEJhY2tib25lIGV2ZW50cyBoYXZlIDMgYXJndW1lbnRzKS5cbiAgdmFyIHRyaWdnZXJFdmVudHMgPSBmdW5jdGlvbihldmVudHMsIGFyZ3MpIHtcbiAgICB2YXIgZXYsIGkgPSAtMSwgbCA9IGV2ZW50cy5sZW5ndGgsIGExID0gYXJnc1swXSwgYTIgPSBhcmdzWzFdLCBhMyA9IGFyZ3NbMl07XG4gICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOiB3aGlsZSAoKytpIDwgbCkgKGV2ID0gZXZlbnRzW2ldKS5jYWxsYmFjay5jYWxsKGV2LmN0eCk7IHJldHVybjtcbiAgICAgIGNhc2UgMTogd2hpbGUgKCsraSA8IGwpIChldiA9IGV2ZW50c1tpXSkuY2FsbGJhY2suY2FsbChldi5jdHgsIGExKTsgcmV0dXJuO1xuICAgICAgY2FzZSAyOiB3aGlsZSAoKytpIDwgbCkgKGV2ID0gZXZlbnRzW2ldKS5jYWxsYmFjay5jYWxsKGV2LmN0eCwgYTEsIGEyKTsgcmV0dXJuO1xuICAgICAgY2FzZSAzOiB3aGlsZSAoKytpIDwgbCkgKGV2ID0gZXZlbnRzW2ldKS5jYWxsYmFjay5jYWxsKGV2LmN0eCwgYTEsIGEyLCBhMyk7IHJldHVybjtcbiAgICAgIGRlZmF1bHQ6IHdoaWxlICgrK2kgPCBsKSAoZXYgPSBldmVudHNbaV0pLmNhbGxiYWNrLmFwcGx5KGV2LmN0eCwgYXJncyk7IHJldHVybjtcbiAgICB9XG4gIH07XG5cbiAgLy8gQSBsaXN0ZW5pbmcgY2xhc3MgdGhhdCB0cmFja3MgYW5kIGNsZWFucyB1cCBtZW1vcnkgYmluZGluZ3NcbiAgLy8gd2hlbiBhbGwgY2FsbGJhY2tzIGhhdmUgYmVlbiBvZmZlZC5cbiAgdmFyIExpc3RlbmluZyA9IGZ1bmN0aW9uKGxpc3RlbmVyLCBvYmopIHtcbiAgICB0aGlzLmlkID0gbGlzdGVuZXIuX2xpc3RlbklkO1xuICAgIHRoaXMubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgICB0aGlzLm9iaiA9IG9iajtcbiAgICB0aGlzLmludGVyb3AgPSB0cnVlO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHRoaXMuX2V2ZW50cyA9IHZvaWQgMDtcbiAgfTtcblxuICBMaXN0ZW5pbmcucHJvdG90eXBlLm9uID0gRXZlbnRzLm9uO1xuXG4gIC8vIE9mZnMgYSBjYWxsYmFjayAob3Igc2V2ZXJhbCkuXG4gIC8vIFVzZXMgYW4gb3B0aW1pemVkIGNvdW50ZXIgaWYgdGhlIGxpc3RlbmVlIHVzZXMgQmFja2JvbmUuRXZlbnRzLlxuICAvLyBPdGhlcndpc2UsIGZhbGxzIGJhY2sgdG8gbWFudWFsIHRyYWNraW5nIHRvIHN1cHBvcnQgZXZlbnRzXG4gIC8vIGxpYnJhcnkgaW50ZXJvcC5cbiAgTGlzdGVuaW5nLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbihuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBjbGVhbnVwO1xuICAgIGlmICh0aGlzLmludGVyb3ApIHtcbiAgICAgIHRoaXMuX2V2ZW50cyA9IGV2ZW50c0FwaShvZmZBcGksIHRoaXMuX2V2ZW50cywgbmFtZSwgY2FsbGJhY2ssIHtcbiAgICAgICAgY29udGV4dDogdm9pZCAwLFxuICAgICAgICBsaXN0ZW5lcnM6IHZvaWQgMFxuICAgICAgfSk7XG4gICAgICBjbGVhbnVwID0gIXRoaXMuX2V2ZW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb3VudC0tO1xuICAgICAgY2xlYW51cCA9IHRoaXMuY291bnQgPT09IDA7XG4gICAgfVxuICAgIGlmIChjbGVhbnVwKSB0aGlzLmNsZWFudXAoKTtcbiAgfTtcblxuICAvLyBDbGVhbnMgdXAgbWVtb3J5IGJpbmRpbmdzIGJldHdlZW4gdGhlIGxpc3RlbmVyIGFuZCB0aGUgbGlzdGVuZWUuXG4gIExpc3RlbmluZy5wcm90b3R5cGUuY2xlYW51cCA9IGZ1bmN0aW9uKCkge1xuICAgIGRlbGV0ZSB0aGlzLmxpc3RlbmVyLl9saXN0ZW5pbmdUb1t0aGlzLm9iai5fbGlzdGVuSWRdO1xuICAgIGlmICghdGhpcy5pbnRlcm9wKSBkZWxldGUgdGhpcy5vYmouX2xpc3RlbmVyc1t0aGlzLmlkXTtcbiAgfTtcblxuICAvLyBBbGlhc2VzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgRXZlbnRzLmJpbmQgICA9IEV2ZW50cy5vbjtcbiAgRXZlbnRzLnVuYmluZCA9IEV2ZW50cy5vZmY7XG5cbiAgLy8gQWxsb3cgdGhlIGBCYWNrYm9uZWAgb2JqZWN0IHRvIHNlcnZlIGFzIGEgZ2xvYmFsIGV2ZW50IGJ1cywgZm9yIGZvbGtzIHdob1xuICAvLyB3YW50IGdsb2JhbCBcInB1YnN1YlwiIGluIGEgY29udmVuaWVudCBwbGFjZS5cbiAgXy5leHRlbmQoQmFja2JvbmUsIEV2ZW50cyk7XG5cbiAgLy8gQmFja2JvbmUuTW9kZWxcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBCYWNrYm9uZSAqKk1vZGVscyoqIGFyZSB0aGUgYmFzaWMgZGF0YSBvYmplY3QgaW4gdGhlIGZyYW1ld29yayAtLVxuICAvLyBmcmVxdWVudGx5IHJlcHJlc2VudGluZyBhIHJvdyBpbiBhIHRhYmxlIGluIGEgZGF0YWJhc2Ugb24geW91ciBzZXJ2ZXIuXG4gIC8vIEEgZGlzY3JldGUgY2h1bmsgb2YgZGF0YSBhbmQgYSBidW5jaCBvZiB1c2VmdWwsIHJlbGF0ZWQgbWV0aG9kcyBmb3JcbiAgLy8gcGVyZm9ybWluZyBjb21wdXRhdGlvbnMgYW5kIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGF0IGRhdGEuXG5cbiAgLy8gQ3JlYXRlIGEgbmV3IG1vZGVsIHdpdGggdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGVzLiBBIGNsaWVudCBpZCAoYGNpZGApXG4gIC8vIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGFuZCBhc3NpZ25lZCBmb3IgeW91LlxuICB2YXIgTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbCA9IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgYXR0cnMgPSBhdHRyaWJ1dGVzIHx8IHt9O1xuICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG4gICAgdGhpcy5wcmVpbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5jaWQgPSBfLnVuaXF1ZUlkKHRoaXMuY2lkUHJlZml4KTtcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICBpZiAob3B0aW9ucy5jb2xsZWN0aW9uKSB0aGlzLmNvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb247XG4gICAgaWYgKG9wdGlvbnMucGFyc2UpIGF0dHJzID0gdGhpcy5wYXJzZShhdHRycywgb3B0aW9ucykgfHwge307XG4gICAgdmFyIGRlZmF1bHRzID0gXy5yZXN1bHQodGhpcywgJ2RlZmF1bHRzJyk7XG4gICAgYXR0cnMgPSBfLmRlZmF1bHRzKF8uZXh0ZW5kKHt9LCBkZWZhdWx0cywgYXR0cnMpLCBkZWZhdWx0cyk7XG4gICAgdGhpcy5zZXQoYXR0cnMsIG9wdGlvbnMpO1xuICAgIHRoaXMuY2hhbmdlZCA9IHt9O1xuICAgIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuXG4gIC8vIEF0dGFjaCBhbGwgaW5oZXJpdGFibGUgbWV0aG9kcyB0byB0aGUgTW9kZWwgcHJvdG90eXBlLlxuICBfLmV4dGVuZChNb2RlbC5wcm90b3R5cGUsIEV2ZW50cywge1xuXG4gICAgLy8gQSBoYXNoIG9mIGF0dHJpYnV0ZXMgd2hvc2UgY3VycmVudCBhbmQgcHJldmlvdXMgdmFsdWUgZGlmZmVyLlxuICAgIGNoYW5nZWQ6IG51bGwsXG5cbiAgICAvLyBUaGUgdmFsdWUgcmV0dXJuZWQgZHVyaW5nIHRoZSBsYXN0IGZhaWxlZCB2YWxpZGF0aW9uLlxuICAgIHZhbGlkYXRpb25FcnJvcjogbnVsbCxcblxuICAgIC8vIFRoZSBkZWZhdWx0IG5hbWUgZm9yIHRoZSBKU09OIGBpZGAgYXR0cmlidXRlIGlzIGBcImlkXCJgLiBNb25nb0RCIGFuZFxuICAgIC8vIENvdWNoREIgdXNlcnMgbWF5IHdhbnQgdG8gc2V0IHRoaXMgdG8gYFwiX2lkXCJgLlxuICAgIGlkQXR0cmlidXRlOiAnaWQnLFxuXG4gICAgLy8gVGhlIHByZWZpeCBpcyB1c2VkIHRvIGNyZWF0ZSB0aGUgY2xpZW50IGlkIHdoaWNoIGlzIHVzZWQgdG8gaWRlbnRpZnkgbW9kZWxzIGxvY2FsbHkuXG4gICAgLy8gWW91IG1heSB3YW50IHRvIG92ZXJyaWRlIHRoaXMgaWYgeW91J3JlIGV4cGVyaWVuY2luZyBuYW1lIGNsYXNoZXMgd2l0aCBtb2RlbCBpZHMuXG4gICAgY2lkUHJlZml4OiAnYycsXG5cbiAgICAvLyBwcmVpbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIFlvdSBjYW4gb3ZlcnJpZGUgaXQgd2l0aCBhIGZ1bmN0aW9uXG4gICAgLy8gb3Igb2JqZWN0LiAgcHJlaW5pdGlhbGl6ZSB3aWxsIHJ1biBiZWZvcmUgYW55IGluc3RhbnRpYXRpb24gbG9naWMgaXMgcnVuIGluIHRoZSBNb2RlbC5cbiAgICBwcmVpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cbiAgICAvLyBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cbiAgICAvLyBpbml0aWFsaXphdGlvbiBsb2dpYy5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cbiAgICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBtb2RlbCdzIGBhdHRyaWJ1dGVzYCBvYmplY3QuXG4gICAgdG9KU09OOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICByZXR1cm4gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgIH0sXG5cbiAgICAvLyBQcm94eSBgQmFja2JvbmUuc3luY2AgYnkgZGVmYXVsdCAtLSBidXQgb3ZlcnJpZGUgdGhpcyBpZiB5b3UgbmVlZFxuICAgIC8vIGN1c3RvbSBzeW5jaW5nIHNlbWFudGljcyBmb3IgKnRoaXMqIHBhcnRpY3VsYXIgbW9kZWwuXG4gICAgc3luYzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gQmFja2JvbmUuc3luYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICAvLyBHZXQgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgICBnZXQ6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gICAgfSxcblxuICAgIC8vIEdldCB0aGUgSFRNTC1lc2NhcGVkIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgICBlc2NhcGU6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiBfLmVzY2FwZSh0aGlzLmdldChhdHRyKSk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBhdHRyaWJ1dGUgY29udGFpbnMgYSB2YWx1ZSB0aGF0IGlzIG5vdCBudWxsXG4gICAgLy8gb3IgdW5kZWZpbmVkLlxuICAgIGhhczogZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KGF0dHIpICE9IG51bGw7XG4gICAgfSxcblxuICAgIC8vIFNwZWNpYWwtY2FzZWQgcHJveHkgdG8gdW5kZXJzY29yZSdzIGBfLm1hdGNoZXNgIG1ldGhvZC5cbiAgICBtYXRjaGVzOiBmdW5jdGlvbihhdHRycykge1xuICAgICAgcmV0dXJuICEhXy5pdGVyYXRlZShhdHRycywgdGhpcykodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICB9LFxuXG4gICAgLy8gU2V0IGEgaGFzaCBvZiBtb2RlbCBhdHRyaWJ1dGVzIG9uIHRoZSBvYmplY3QsIGZpcmluZyBgXCJjaGFuZ2VcImAuIFRoaXMgaXNcbiAgICAvLyB0aGUgY29yZSBwcmltaXRpdmUgb3BlcmF0aW9uIG9mIGEgbW9kZWwsIHVwZGF0aW5nIHRoZSBkYXRhIGFuZCBub3RpZnlpbmdcbiAgICAvLyBhbnlvbmUgd2hvIG5lZWRzIHRvIGtub3cgYWJvdXQgdGhlIGNoYW5nZSBpbiBzdGF0ZS4gVGhlIGhlYXJ0IG9mIHRoZSBiZWFzdC5cbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsLCBvcHRpb25zKSB7XG4gICAgICBpZiAoa2V5ID09IG51bGwpIHJldHVybiB0aGlzO1xuXG4gICAgICAvLyBIYW5kbGUgYm90aCBgXCJrZXlcIiwgdmFsdWVgIGFuZCBge2tleTogdmFsdWV9YCAtc3R5bGUgYXJndW1lbnRzLlxuICAgICAgdmFyIGF0dHJzO1xuICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGF0dHJzID0ga2V5O1xuICAgICAgICBvcHRpb25zID0gdmFsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgKGF0dHJzID0ge30pW2tleV0gPSB2YWw7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cbiAgICAgIC8vIFJ1biB2YWxpZGF0aW9uLlxuICAgICAgaWYgKCF0aGlzLl92YWxpZGF0ZShhdHRycywgb3B0aW9ucykpIHJldHVybiBmYWxzZTtcblxuICAgICAgLy8gRXh0cmFjdCBhdHRyaWJ1dGVzIGFuZCBvcHRpb25zLlxuICAgICAgdmFyIHVuc2V0ICAgICAgPSBvcHRpb25zLnVuc2V0O1xuICAgICAgdmFyIHNpbGVudCAgICAgPSBvcHRpb25zLnNpbGVudDtcbiAgICAgIHZhciBjaGFuZ2VzICAgID0gW107XG4gICAgICB2YXIgY2hhbmdpbmcgICA9IHRoaXMuX2NoYW5naW5nO1xuICAgICAgdGhpcy5fY2hhbmdpbmcgPSB0cnVlO1xuXG4gICAgICBpZiAoIWNoYW5naW5nKSB7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcyA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VkID0ge307XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5hdHRyaWJ1dGVzO1xuICAgICAgdmFyIGNoYW5nZWQgPSB0aGlzLmNoYW5nZWQ7XG4gICAgICB2YXIgcHJldiAgICA9IHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcztcblxuICAgICAgLy8gRm9yIGVhY2ggYHNldGAgYXR0cmlidXRlLCB1cGRhdGUgb3IgZGVsZXRlIHRoZSBjdXJyZW50IHZhbHVlLlxuICAgICAgZm9yICh2YXIgYXR0ciBpbiBhdHRycykge1xuICAgICAgICB2YWwgPSBhdHRyc1thdHRyXTtcbiAgICAgICAgaWYgKCFfLmlzRXF1YWwoY3VycmVudFthdHRyXSwgdmFsKSkgY2hhbmdlcy5wdXNoKGF0dHIpO1xuICAgICAgICBpZiAoIV8uaXNFcXVhbChwcmV2W2F0dHJdLCB2YWwpKSB7XG4gICAgICAgICAgY2hhbmdlZFthdHRyXSA9IHZhbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgY2hhbmdlZFthdHRyXTtcbiAgICAgICAgfVxuICAgICAgICB1bnNldCA/IGRlbGV0ZSBjdXJyZW50W2F0dHJdIDogY3VycmVudFthdHRyXSA9IHZhbDtcbiAgICAgIH1cblxuICAgICAgLy8gVXBkYXRlIHRoZSBgaWRgLlxuICAgICAgaWYgKHRoaXMuaWRBdHRyaWJ1dGUgaW4gYXR0cnMpIHRoaXMuaWQgPSB0aGlzLmdldCh0aGlzLmlkQXR0cmlidXRlKTtcblxuICAgICAgLy8gVHJpZ2dlciBhbGwgcmVsZXZhbnQgYXR0cmlidXRlIGNoYW5nZXMuXG4gICAgICBpZiAoIXNpbGVudCkge1xuICAgICAgICBpZiAoY2hhbmdlcy5sZW5ndGgpIHRoaXMuX3BlbmRpbmcgPSBvcHRpb25zO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZTonICsgY2hhbmdlc1tpXSwgdGhpcywgY3VycmVudFtjaGFuZ2VzW2ldXSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gWW91IG1pZ2h0IGJlIHdvbmRlcmluZyB3aHkgdGhlcmUncyBhIGB3aGlsZWAgbG9vcCBoZXJlLiBDaGFuZ2VzIGNhblxuICAgICAgLy8gYmUgcmVjdXJzaXZlbHkgbmVzdGVkIHdpdGhpbiBgXCJjaGFuZ2VcImAgZXZlbnRzLlxuICAgICAgaWYgKGNoYW5naW5nKSByZXR1cm4gdGhpcztcbiAgICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgIHdoaWxlICh0aGlzLl9wZW5kaW5nKSB7XG4gICAgICAgICAgb3B0aW9ucyA9IHRoaXMuX3BlbmRpbmc7XG4gICAgICAgICAgdGhpcy5fcGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJywgdGhpcywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuX3BlbmRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NoYW5naW5nID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gUmVtb3ZlIGFuIGF0dHJpYnV0ZSBmcm9tIHRoZSBtb2RlbCwgZmlyaW5nIGBcImNoYW5nZVwiYC4gYHVuc2V0YCBpcyBhIG5vb3BcbiAgICAvLyBpZiB0aGUgYXR0cmlidXRlIGRvZXNuJ3QgZXhpc3QuXG4gICAgdW5zZXQ6IGZ1bmN0aW9uKGF0dHIsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldChhdHRyLCB2b2lkIDAsIF8uZXh0ZW5kKHt9LCBvcHRpb25zLCB7dW5zZXQ6IHRydWV9KSk7XG4gICAgfSxcblxuICAgIC8vIENsZWFyIGFsbCBhdHRyaWJ1dGVzIG9uIHRoZSBtb2RlbCwgZmlyaW5nIGBcImNoYW5nZVwiYC5cbiAgICBjbGVhcjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIGF0dHJzID0ge307XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5hdHRyaWJ1dGVzKSBhdHRyc1trZXldID0gdm9pZCAwO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KGF0dHJzLCBfLmV4dGVuZCh7fSwgb3B0aW9ucywge3Vuc2V0OiB0cnVlfSkpO1xuICAgIH0sXG5cbiAgICAvLyBEZXRlcm1pbmUgaWYgdGhlIG1vZGVsIGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IGBcImNoYW5nZVwiYCBldmVudC5cbiAgICAvLyBJZiB5b3Ugc3BlY2lmeSBhbiBhdHRyaWJ1dGUgbmFtZSwgZGV0ZXJtaW5lIGlmIHRoYXQgYXR0cmlidXRlIGhhcyBjaGFuZ2VkLlxuICAgIGhhc0NoYW5nZWQ6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIGlmIChhdHRyID09IG51bGwpIHJldHVybiAhXy5pc0VtcHR5KHRoaXMuY2hhbmdlZCk7XG4gICAgICByZXR1cm4gXy5oYXModGhpcy5jaGFuZ2VkLCBhdHRyKTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgYXR0cmlidXRlcyB0aGF0IGhhdmUgY2hhbmdlZCwgb3JcbiAgICAvLyBmYWxzZSBpZiB0aGVyZSBhcmUgbm8gY2hhbmdlZCBhdHRyaWJ1dGVzLiBVc2VmdWwgZm9yIGRldGVybWluaW5nIHdoYXRcbiAgICAvLyBwYXJ0cyBvZiBhIHZpZXcgbmVlZCB0byBiZSB1cGRhdGVkIGFuZC9vciB3aGF0IGF0dHJpYnV0ZXMgbmVlZCB0byBiZVxuICAgIC8vIHBlcnNpc3RlZCB0byB0aGUgc2VydmVyLiBVbnNldCBhdHRyaWJ1dGVzIHdpbGwgYmUgc2V0IHRvIHVuZGVmaW5lZC5cbiAgICAvLyBZb3UgY2FuIGFsc28gcGFzcyBhbiBhdHRyaWJ1dGVzIG9iamVjdCB0byBkaWZmIGFnYWluc3QgdGhlIG1vZGVsLFxuICAgIC8vIGRldGVybWluaW5nIGlmIHRoZXJlICp3b3VsZCBiZSogYSBjaGFuZ2UuXG4gICAgY2hhbmdlZEF0dHJpYnV0ZXM6IGZ1bmN0aW9uKGRpZmYpIHtcbiAgICAgIGlmICghZGlmZikgcmV0dXJuIHRoaXMuaGFzQ2hhbmdlZCgpID8gXy5jbG9uZSh0aGlzLmNoYW5nZWQpIDogZmFsc2U7XG4gICAgICB2YXIgb2xkID0gdGhpcy5fY2hhbmdpbmcgPyB0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMgOiB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgICB2YXIgY2hhbmdlZCA9IHt9O1xuICAgICAgdmFyIGhhc0NoYW5nZWQ7XG4gICAgICBmb3IgKHZhciBhdHRyIGluIGRpZmYpIHtcbiAgICAgICAgdmFyIHZhbCA9IGRpZmZbYXR0cl07XG4gICAgICAgIGlmIChfLmlzRXF1YWwob2xkW2F0dHJdLCB2YWwpKSBjb250aW51ZTtcbiAgICAgICAgY2hhbmdlZFthdHRyXSA9IHZhbDtcbiAgICAgICAgaGFzQ2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGFzQ2hhbmdlZCA/IGNoYW5nZWQgOiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gR2V0IHRoZSBwcmV2aW91cyB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUsIHJlY29yZGVkIGF0IHRoZSB0aW1lIHRoZSBsYXN0XG4gICAgLy8gYFwiY2hhbmdlXCJgIGV2ZW50IHdhcyBmaXJlZC5cbiAgICBwcmV2aW91czogZnVuY3Rpb24oYXR0cikge1xuICAgICAgaWYgKGF0dHIgPT0gbnVsbCB8fCAhdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzKSByZXR1cm4gbnVsbDtcbiAgICAgIHJldHVybiB0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXNbYXR0cl07XG4gICAgfSxcblxuICAgIC8vIEdldCBhbGwgb2YgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIG1vZGVsIGF0IHRoZSB0aW1lIG9mIHRoZSBwcmV2aW91c1xuICAgIC8vIGBcImNoYW5nZVwiYCBldmVudC5cbiAgICBwcmV2aW91c0F0dHJpYnV0ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF8uY2xvbmUodGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzKTtcbiAgICB9LFxuXG4gICAgLy8gRmV0Y2ggdGhlIG1vZGVsIGZyb20gdGhlIHNlcnZlciwgbWVyZ2luZyB0aGUgcmVzcG9uc2Ugd2l0aCB0aGUgbW9kZWwnc1xuICAgIC8vIGxvY2FsIGF0dHJpYnV0ZXMuIEFueSBjaGFuZ2VkIGF0dHJpYnV0ZXMgd2lsbCB0cmlnZ2VyIGEgXCJjaGFuZ2VcIiBldmVudC5cbiAgICBmZXRjaDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtwYXJzZTogdHJ1ZX0sIG9wdGlvbnMpO1xuICAgICAgdmFyIG1vZGVsID0gdGhpcztcbiAgICAgIHZhciBzdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzO1xuICAgICAgb3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICB2YXIgc2VydmVyQXR0cnMgPSBvcHRpb25zLnBhcnNlID8gbW9kZWwucGFyc2UocmVzcCwgb3B0aW9ucykgOiByZXNwO1xuICAgICAgICBpZiAoIW1vZGVsLnNldChzZXJ2ZXJBdHRycywgb3B0aW9ucykpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHN1Y2Nlc3MuY2FsbChvcHRpb25zLmNvbnRleHQsIG1vZGVsLCByZXNwLCBvcHRpb25zKTtcbiAgICAgICAgbW9kZWwudHJpZ2dlcignc3luYycsIG1vZGVsLCByZXNwLCBvcHRpb25zKTtcbiAgICAgIH07XG4gICAgICB3cmFwRXJyb3IodGhpcywgb3B0aW9ucyk7XG4gICAgICByZXR1cm4gdGhpcy5zeW5jKCdyZWFkJywgdGhpcywgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFNldCBhIGhhc2ggb2YgbW9kZWwgYXR0cmlidXRlcywgYW5kIHN5bmMgdGhlIG1vZGVsIHRvIHRoZSBzZXJ2ZXIuXG4gICAgLy8gSWYgdGhlIHNlcnZlciByZXR1cm5zIGFuIGF0dHJpYnV0ZXMgaGFzaCB0aGF0IGRpZmZlcnMsIHRoZSBtb2RlbCdzXG4gICAgLy8gc3RhdGUgd2lsbCBiZSBgc2V0YCBhZ2Fpbi5cbiAgICBzYXZlOiBmdW5jdGlvbihrZXksIHZhbCwgb3B0aW9ucykge1xuICAgICAgLy8gSGFuZGxlIGJvdGggYFwia2V5XCIsIHZhbHVlYCBhbmQgYHtrZXk6IHZhbHVlfWAgLXN0eWxlIGFyZ3VtZW50cy5cbiAgICAgIHZhciBhdHRycztcbiAgICAgIGlmIChrZXkgPT0gbnVsbCB8fCB0eXBlb2Yga2V5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICBhdHRycyA9IGtleTtcbiAgICAgICAgb3B0aW9ucyA9IHZhbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChhdHRycyA9IHt9KVtrZXldID0gdmFsO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gXy5leHRlbmQoe3ZhbGlkYXRlOiB0cnVlLCBwYXJzZTogdHJ1ZX0sIG9wdGlvbnMpO1xuICAgICAgdmFyIHdhaXQgPSBvcHRpb25zLndhaXQ7XG5cbiAgICAgIC8vIElmIHdlJ3JlIG5vdCB3YWl0aW5nIGFuZCBhdHRyaWJ1dGVzIGV4aXN0LCBzYXZlIGFjdHMgYXNcbiAgICAgIC8vIGBzZXQoYXR0cikuc2F2ZShudWxsLCBvcHRzKWAgd2l0aCB2YWxpZGF0aW9uLiBPdGhlcndpc2UsIGNoZWNrIGlmXG4gICAgICAvLyB0aGUgbW9kZWwgd2lsbCBiZSB2YWxpZCB3aGVuIHRoZSBhdHRyaWJ1dGVzLCBpZiBhbnksIGFyZSBzZXQuXG4gICAgICBpZiAoYXR0cnMgJiYgIXdhaXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNldChhdHRycywgb3B0aW9ucykpIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX3ZhbGlkYXRlKGF0dHJzLCBvcHRpb25zKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIEFmdGVyIGEgc3VjY2Vzc2Z1bCBzZXJ2ZXItc2lkZSBzYXZlLCB0aGUgY2xpZW50IGlzIChvcHRpb25hbGx5KVxuICAgICAgLy8gdXBkYXRlZCB3aXRoIHRoZSBzZXJ2ZXItc2lkZSBzdGF0ZS5cbiAgICAgIHZhciBtb2RlbCA9IHRoaXM7XG4gICAgICB2YXIgc3VjY2VzcyA9IG9wdGlvbnMuc3VjY2VzcztcbiAgICAgIHZhciBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzO1xuICAgICAgb3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICAvLyBFbnN1cmUgYXR0cmlidXRlcyBhcmUgcmVzdG9yZWQgZHVyaW5nIHN5bmNocm9ub3VzIHNhdmVzLlxuICAgICAgICBtb2RlbC5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcbiAgICAgICAgdmFyIHNlcnZlckF0dHJzID0gb3B0aW9ucy5wYXJzZSA/IG1vZGVsLnBhcnNlKHJlc3AsIG9wdGlvbnMpIDogcmVzcDtcbiAgICAgICAgaWYgKHdhaXQpIHNlcnZlckF0dHJzID0gXy5leHRlbmQoe30sIGF0dHJzLCBzZXJ2ZXJBdHRycyk7XG4gICAgICAgIGlmIChzZXJ2ZXJBdHRycyAmJiAhbW9kZWwuc2V0KHNlcnZlckF0dHJzLCBvcHRpb25zKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoc3VjY2Vzcykgc3VjY2Vzcy5jYWxsKG9wdGlvbnMuY29udGV4dCwgbW9kZWwsIHJlc3AsIG9wdGlvbnMpO1xuICAgICAgICBtb2RlbC50cmlnZ2VyKCdzeW5jJywgbW9kZWwsIHJlc3AsIG9wdGlvbnMpO1xuICAgICAgfTtcbiAgICAgIHdyYXBFcnJvcih0aGlzLCBvcHRpb25zKTtcblxuICAgICAgLy8gU2V0IHRlbXBvcmFyeSBhdHRyaWJ1dGVzIGlmIGB7d2FpdDogdHJ1ZX1gIHRvIHByb3Blcmx5IGZpbmQgbmV3IGlkcy5cbiAgICAgIGlmIChhdHRycyAmJiB3YWl0KSB0aGlzLmF0dHJpYnV0ZXMgPSBfLmV4dGVuZCh7fSwgYXR0cmlidXRlcywgYXR0cnMpO1xuXG4gICAgICB2YXIgbWV0aG9kID0gdGhpcy5pc05ldygpID8gJ2NyZWF0ZScgOiBvcHRpb25zLnBhdGNoID8gJ3BhdGNoJyA6ICd1cGRhdGUnO1xuICAgICAgaWYgKG1ldGhvZCA9PT0gJ3BhdGNoJyAmJiAhb3B0aW9ucy5hdHRycykgb3B0aW9ucy5hdHRycyA9IGF0dHJzO1xuICAgICAgdmFyIHhociA9IHRoaXMuc3luYyhtZXRob2QsIHRoaXMsIG9wdGlvbnMpO1xuXG4gICAgICAvLyBSZXN0b3JlIGF0dHJpYnV0ZXMuXG4gICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuXG4gICAgICByZXR1cm4geGhyO1xuICAgIH0sXG5cbiAgICAvLyBEZXN0cm95IHRoaXMgbW9kZWwgb24gdGhlIHNlcnZlciBpZiBpdCB3YXMgYWxyZWFkeSBwZXJzaXN0ZWQuXG4gICAgLy8gT3B0aW1pc3RpY2FsbHkgcmVtb3ZlcyB0aGUgbW9kZWwgZnJvbSBpdHMgY29sbGVjdGlvbiwgaWYgaXQgaGFzIG9uZS5cbiAgICAvLyBJZiBgd2FpdDogdHJ1ZWAgaXMgcGFzc2VkLCB3YWl0cyBmb3IgdGhlIHNlcnZlciB0byByZXNwb25kIGJlZm9yZSByZW1vdmFsLlxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zID8gXy5jbG9uZShvcHRpb25zKSA6IHt9O1xuICAgICAgdmFyIG1vZGVsID0gdGhpcztcbiAgICAgIHZhciBzdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzO1xuICAgICAgdmFyIHdhaXQgPSBvcHRpb25zLndhaXQ7XG5cbiAgICAgIHZhciBkZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIG1vZGVsLnN0b3BMaXN0ZW5pbmcoKTtcbiAgICAgICAgbW9kZWwudHJpZ2dlcignZGVzdHJveScsIG1vZGVsLCBtb2RlbC5jb2xsZWN0aW9uLCBvcHRpb25zKTtcbiAgICAgIH07XG5cbiAgICAgIG9wdGlvbnMuc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3ApIHtcbiAgICAgICAgaWYgKHdhaXQpIGRlc3Ryb3koKTtcbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHN1Y2Nlc3MuY2FsbChvcHRpb25zLmNvbnRleHQsIG1vZGVsLCByZXNwLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKCFtb2RlbC5pc05ldygpKSBtb2RlbC50cmlnZ2VyKCdzeW5jJywgbW9kZWwsIHJlc3AsIG9wdGlvbnMpO1xuICAgICAgfTtcblxuICAgICAgdmFyIHhociA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMuaXNOZXcoKSkge1xuICAgICAgICBfLmRlZmVyKG9wdGlvbnMuc3VjY2Vzcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cmFwRXJyb3IodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHhociA9IHRoaXMuc3luYygnZGVsZXRlJywgdGhpcywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBpZiAoIXdhaXQpIGRlc3Ryb3koKTtcbiAgICAgIHJldHVybiB4aHI7XG4gICAgfSxcblxuICAgIC8vIERlZmF1bHQgVVJMIGZvciB0aGUgbW9kZWwncyByZXByZXNlbnRhdGlvbiBvbiB0aGUgc2VydmVyIC0tIGlmIHlvdSdyZVxuICAgIC8vIHVzaW5nIEJhY2tib25lJ3MgcmVzdGZ1bCBtZXRob2RzLCBvdmVycmlkZSB0aGlzIHRvIGNoYW5nZSB0aGUgZW5kcG9pbnRcbiAgICAvLyB0aGF0IHdpbGwgYmUgY2FsbGVkLlxuICAgIHVybDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmFzZSA9XG4gICAgICAgIF8ucmVzdWx0KHRoaXMsICd1cmxSb290JykgfHxcbiAgICAgICAgXy5yZXN1bHQodGhpcy5jb2xsZWN0aW9uLCAndXJsJykgfHxcbiAgICAgICAgdXJsRXJyb3IoKTtcbiAgICAgIGlmICh0aGlzLmlzTmV3KCkpIHJldHVybiBiYXNlO1xuICAgICAgdmFyIGlkID0gdGhpcy5nZXQodGhpcy5pZEF0dHJpYnV0ZSk7XG4gICAgICByZXR1cm4gYmFzZS5yZXBsYWNlKC9bXlxcL10kLywgJyQmLycpICsgZW5jb2RlVVJJQ29tcG9uZW50KGlkKTtcbiAgICB9LFxuXG4gICAgLy8gKipwYXJzZSoqIGNvbnZlcnRzIGEgcmVzcG9uc2UgaW50byB0aGUgaGFzaCBvZiBhdHRyaWJ1dGVzIHRvIGJlIGBzZXRgIG9uXG4gICAgLy8gdGhlIG1vZGVsLiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBpcyBqdXN0IHRvIHBhc3MgdGhlIHJlc3BvbnNlIGFsb25nLlxuICAgIHBhcnNlOiBmdW5jdGlvbihyZXNwLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gcmVzcDtcbiAgICB9LFxuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IG1vZGVsIHdpdGggaWRlbnRpY2FsIGF0dHJpYnV0ZXMgdG8gdGhpcyBvbmUuXG4gICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgfSxcblxuICAgIC8vIEEgbW9kZWwgaXMgbmV3IGlmIGl0IGhhcyBuZXZlciBiZWVuIHNhdmVkIHRvIHRoZSBzZXJ2ZXIsIGFuZCBsYWNrcyBhbiBpZC5cbiAgICBpc05ldzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXRoaXMuaGFzKHRoaXMuaWRBdHRyaWJ1dGUpO1xuICAgIH0sXG5cbiAgICAvLyBDaGVjayBpZiB0aGUgbW9kZWwgaXMgY3VycmVudGx5IGluIGEgdmFsaWQgc3RhdGUuXG4gICAgaXNWYWxpZDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZhbGlkYXRlKHt9LCBfLmV4dGVuZCh7fSwgb3B0aW9ucywge3ZhbGlkYXRlOiB0cnVlfSkpO1xuICAgIH0sXG5cbiAgICAvLyBSdW4gdmFsaWRhdGlvbiBhZ2FpbnN0IHRoZSBuZXh0IGNvbXBsZXRlIHNldCBvZiBtb2RlbCBhdHRyaWJ1dGVzLFxuICAgIC8vIHJldHVybmluZyBgdHJ1ZWAgaWYgYWxsIGlzIHdlbGwuIE90aGVyd2lzZSwgZmlyZSBhbiBgXCJpbnZhbGlkXCJgIGV2ZW50LlxuICAgIF92YWxpZGF0ZTogZnVuY3Rpb24oYXR0cnMsIG9wdGlvbnMpIHtcbiAgICAgIGlmICghb3B0aW9ucy52YWxpZGF0ZSB8fCAhdGhpcy52YWxpZGF0ZSkgcmV0dXJuIHRydWU7XG4gICAgICBhdHRycyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJzKTtcbiAgICAgIHZhciBlcnJvciA9IHRoaXMudmFsaWRhdGlvbkVycm9yID0gdGhpcy52YWxpZGF0ZShhdHRycywgb3B0aW9ucykgfHwgbnVsbDtcbiAgICAgIGlmICghZXJyb3IpIHJldHVybiB0cnVlO1xuICAgICAgdGhpcy50cmlnZ2VyKCdpbnZhbGlkJywgdGhpcywgZXJyb3IsIF8uZXh0ZW5kKG9wdGlvbnMsIHt2YWxpZGF0aW9uRXJyb3I6IGVycm9yfSkpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICB9KTtcblxuICAvLyBCYWNrYm9uZS5Db2xsZWN0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBJZiBtb2RlbHMgdGVuZCB0byByZXByZXNlbnQgYSBzaW5nbGUgcm93IG9mIGRhdGEsIGEgQmFja2JvbmUgQ29sbGVjdGlvbiBpc1xuICAvLyBtb3JlIGFuYWxvZ291cyB0byBhIHRhYmxlIGZ1bGwgb2YgZGF0YSAuLi4gb3IgYSBzbWFsbCBzbGljZSBvciBwYWdlIG9mIHRoYXRcbiAgLy8gdGFibGUsIG9yIGEgY29sbGVjdGlvbiBvZiByb3dzIHRoYXQgYmVsb25nIHRvZ2V0aGVyIGZvciBhIHBhcnRpY3VsYXIgcmVhc29uXG4gIC8vIC0tIGFsbCBvZiB0aGUgbWVzc2FnZXMgaW4gdGhpcyBwYXJ0aWN1bGFyIGZvbGRlciwgYWxsIG9mIHRoZSBkb2N1bWVudHNcbiAgLy8gYmVsb25naW5nIHRvIHRoaXMgcGFydGljdWxhciBhdXRob3IsIGFuZCBzbyBvbi4gQ29sbGVjdGlvbnMgbWFpbnRhaW5cbiAgLy8gaW5kZXhlcyBvZiB0aGVpciBtb2RlbHMsIGJvdGggaW4gb3JkZXIsIGFuZCBmb3IgbG9va3VwIGJ5IGBpZGAuXG5cbiAgLy8gQ3JlYXRlIGEgbmV3ICoqQ29sbGVjdGlvbioqLCBwZXJoYXBzIHRvIGNvbnRhaW4gYSBzcGVjaWZpYyB0eXBlIG9mIGBtb2RlbGAuXG4gIC8vIElmIGEgYGNvbXBhcmF0b3JgIGlzIHNwZWNpZmllZCwgdGhlIENvbGxlY3Rpb24gd2lsbCBtYWludGFpblxuICAvLyBpdHMgbW9kZWxzIGluIHNvcnQgb3JkZXIsIGFzIHRoZXkncmUgYWRkZWQgYW5kIHJlbW92ZWQuXG4gIHZhciBDb2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG4gICAgdGhpcy5wcmVpbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKG9wdGlvbnMubW9kZWwpIHRoaXMubW9kZWwgPSBvcHRpb25zLm1vZGVsO1xuICAgIGlmIChvcHRpb25zLmNvbXBhcmF0b3IgIT09IHZvaWQgMCkgdGhpcy5jb21wYXJhdG9yID0gb3B0aW9ucy5jb21wYXJhdG9yO1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKG1vZGVscykgdGhpcy5yZXNldChtb2RlbHMsIF8uZXh0ZW5kKHtzaWxlbnQ6IHRydWV9LCBvcHRpb25zKSk7XG4gIH07XG5cbiAgLy8gRGVmYXVsdCBvcHRpb25zIGZvciBgQ29sbGVjdGlvbiNzZXRgLlxuICB2YXIgc2V0T3B0aW9ucyA9IHthZGQ6IHRydWUsIHJlbW92ZTogdHJ1ZSwgbWVyZ2U6IHRydWV9O1xuICB2YXIgYWRkT3B0aW9ucyA9IHthZGQ6IHRydWUsIHJlbW92ZTogZmFsc2V9O1xuXG4gIC8vIFNwbGljZXMgYGluc2VydGAgaW50byBgYXJyYXlgIGF0IGluZGV4IGBhdGAuXG4gIHZhciBzcGxpY2UgPSBmdW5jdGlvbihhcnJheSwgaW5zZXJ0LCBhdCkge1xuICAgIGF0ID0gTWF0aC5taW4oTWF0aC5tYXgoYXQsIDApLCBhcnJheS5sZW5ndGgpO1xuICAgIHZhciB0YWlsID0gQXJyYXkoYXJyYXkubGVuZ3RoIC0gYXQpO1xuICAgIHZhciBsZW5ndGggPSBpbnNlcnQubGVuZ3RoO1xuICAgIHZhciBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCB0YWlsLmxlbmd0aDsgaSsrKSB0YWlsW2ldID0gYXJyYXlbaSArIGF0XTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIGFycmF5W2kgKyBhdF0gPSBpbnNlcnRbaV07XG4gICAgZm9yIChpID0gMDsgaSA8IHRhaWwubGVuZ3RoOyBpKyspIGFycmF5W2kgKyBsZW5ndGggKyBhdF0gPSB0YWlsW2ldO1xuICB9O1xuXG4gIC8vIERlZmluZSB0aGUgQ29sbGVjdGlvbidzIGluaGVyaXRhYmxlIG1ldGhvZHMuXG4gIF8uZXh0ZW5kKENvbGxlY3Rpb24ucHJvdG90eXBlLCBFdmVudHMsIHtcblxuICAgIC8vIFRoZSBkZWZhdWx0IG1vZGVsIGZvciBhIGNvbGxlY3Rpb24gaXMganVzdCBhICoqQmFja2JvbmUuTW9kZWwqKi5cbiAgICAvLyBUaGlzIHNob3VsZCBiZSBvdmVycmlkZGVuIGluIG1vc3QgY2FzZXMuXG4gICAgbW9kZWw6IE1vZGVsLFxuXG5cbiAgICAvLyBwcmVpbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIFlvdSBjYW4gb3ZlcnJpZGUgaXQgd2l0aCBhIGZ1bmN0aW9uXG4gICAgLy8gb3Igb2JqZWN0LiAgcHJlaW5pdGlhbGl6ZSB3aWxsIHJ1biBiZWZvcmUgYW55IGluc3RhbnRpYXRpb24gbG9naWMgaXMgcnVuIGluIHRoZSBDb2xsZWN0aW9uLlxuICAgIHByZWluaXRpYWxpemU6IGZ1bmN0aW9uKCl7fSxcblxuICAgIC8vIEluaXRpYWxpemUgaXMgYW4gZW1wdHkgZnVuY3Rpb24gYnkgZGVmYXVsdC4gT3ZlcnJpZGUgaXQgd2l0aCB5b3VyIG93blxuICAgIC8vIGluaXRpYWxpemF0aW9uIGxvZ2ljLlxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7fSxcblxuICAgIC8vIFRoZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIGEgQ29sbGVjdGlvbiBpcyBhbiBhcnJheSBvZiB0aGVcbiAgICAvLyBtb2RlbHMnIGF0dHJpYnV0ZXMuXG4gICAgdG9KU09OOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24obW9kZWwpIHsgcmV0dXJuIG1vZGVsLnRvSlNPTihvcHRpb25zKTsgfSk7XG4gICAgfSxcblxuICAgIC8vIFByb3h5IGBCYWNrYm9uZS5zeW5jYCBieSBkZWZhdWx0LlxuICAgIHN5bmM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIEJhY2tib25lLnN5bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgLy8gQWRkIGEgbW9kZWwsIG9yIGxpc3Qgb2YgbW9kZWxzIHRvIHRoZSBzZXQuIGBtb2RlbHNgIG1heSBiZSBCYWNrYm9uZVxuICAgIC8vIE1vZGVscyBvciByYXcgSmF2YVNjcmlwdCBvYmplY3RzIHRvIGJlIGNvbnZlcnRlZCB0byBNb2RlbHMsIG9yIGFueVxuICAgIC8vIGNvbWJpbmF0aW9uIG9mIHRoZSB0d28uXG4gICAgYWRkOiBmdW5jdGlvbihtb2RlbHMsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldChtb2RlbHMsIF8uZXh0ZW5kKHttZXJnZTogZmFsc2V9LCBvcHRpb25zLCBhZGRPcHRpb25zKSk7XG4gICAgfSxcblxuICAgIC8vIFJlbW92ZSBhIG1vZGVsLCBvciBhIGxpc3Qgb2YgbW9kZWxzIGZyb20gdGhlIHNldC5cbiAgICByZW1vdmU6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBvcHRpb25zKTtcbiAgICAgIHZhciBzaW5ndWxhciA9ICFfLmlzQXJyYXkobW9kZWxzKTtcbiAgICAgIG1vZGVscyA9IHNpbmd1bGFyID8gW21vZGVsc10gOiBtb2RlbHMuc2xpY2UoKTtcbiAgICAgIHZhciByZW1vdmVkID0gdGhpcy5fcmVtb3ZlTW9kZWxzKG1vZGVscywgb3B0aW9ucyk7XG4gICAgICBpZiAoIW9wdGlvbnMuc2lsZW50ICYmIHJlbW92ZWQubGVuZ3RoKSB7XG4gICAgICAgIG9wdGlvbnMuY2hhbmdlcyA9IHthZGRlZDogW10sIG1lcmdlZDogW10sIHJlbW92ZWQ6IHJlbW92ZWR9O1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ3VwZGF0ZScsIHRoaXMsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNpbmd1bGFyID8gcmVtb3ZlZFswXSA6IHJlbW92ZWQ7XG4gICAgfSxcblxuICAgIC8vIFVwZGF0ZSBhIGNvbGxlY3Rpb24gYnkgYHNldGAtaW5nIGEgbmV3IGxpc3Qgb2YgbW9kZWxzLCBhZGRpbmcgbmV3IG9uZXMsXG4gICAgLy8gcmVtb3ZpbmcgbW9kZWxzIHRoYXQgYXJlIG5vIGxvbmdlciBwcmVzZW50LCBhbmQgbWVyZ2luZyBtb2RlbHMgdGhhdFxuICAgIC8vIGFscmVhZHkgZXhpc3QgaW4gdGhlIGNvbGxlY3Rpb24sIGFzIG5lY2Vzc2FyeS4gU2ltaWxhciB0byAqKk1vZGVsI3NldCoqLFxuICAgIC8vIHRoZSBjb3JlIG9wZXJhdGlvbiBmb3IgdXBkYXRpbmcgdGhlIGRhdGEgY29udGFpbmVkIGJ5IHRoZSBjb2xsZWN0aW9uLlxuICAgIHNldDogZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XG4gICAgICBpZiAobW9kZWxzID09IG51bGwpIHJldHVybjtcblxuICAgICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBzZXRPcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmIChvcHRpb25zLnBhcnNlICYmICF0aGlzLl9pc01vZGVsKG1vZGVscykpIHtcbiAgICAgICAgbW9kZWxzID0gdGhpcy5wYXJzZShtb2RlbHMsIG9wdGlvbnMpIHx8IFtdO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2luZ3VsYXIgPSAhXy5pc0FycmF5KG1vZGVscyk7XG4gICAgICBtb2RlbHMgPSBzaW5ndWxhciA/IFttb2RlbHNdIDogbW9kZWxzLnNsaWNlKCk7XG5cbiAgICAgIHZhciBhdCA9IG9wdGlvbnMuYXQ7XG4gICAgICBpZiAoYXQgIT0gbnVsbCkgYXQgPSArYXQ7XG4gICAgICBpZiAoYXQgPiB0aGlzLmxlbmd0aCkgYXQgPSB0aGlzLmxlbmd0aDtcbiAgICAgIGlmIChhdCA8IDApIGF0ICs9IHRoaXMubGVuZ3RoICsgMTtcblxuICAgICAgdmFyIHNldCA9IFtdO1xuICAgICAgdmFyIHRvQWRkID0gW107XG4gICAgICB2YXIgdG9NZXJnZSA9IFtdO1xuICAgICAgdmFyIHRvUmVtb3ZlID0gW107XG4gICAgICB2YXIgbW9kZWxNYXAgPSB7fTtcblxuICAgICAgdmFyIGFkZCA9IG9wdGlvbnMuYWRkO1xuICAgICAgdmFyIG1lcmdlID0gb3B0aW9ucy5tZXJnZTtcbiAgICAgIHZhciByZW1vdmUgPSBvcHRpb25zLnJlbW92ZTtcblxuICAgICAgdmFyIHNvcnQgPSBmYWxzZTtcbiAgICAgIHZhciBzb3J0YWJsZSA9IHRoaXMuY29tcGFyYXRvciAmJiBhdCA9PSBudWxsICYmIG9wdGlvbnMuc29ydCAhPT0gZmFsc2U7XG4gICAgICB2YXIgc29ydEF0dHIgPSBfLmlzU3RyaW5nKHRoaXMuY29tcGFyYXRvcikgPyB0aGlzLmNvbXBhcmF0b3IgOiBudWxsO1xuXG4gICAgICAvLyBUdXJuIGJhcmUgb2JqZWN0cyBpbnRvIG1vZGVsIHJlZmVyZW5jZXMsIGFuZCBwcmV2ZW50IGludmFsaWQgbW9kZWxzXG4gICAgICAvLyBmcm9tIGJlaW5nIGFkZGVkLlxuICAgICAgdmFyIG1vZGVsLCBpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IG1vZGVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICBtb2RlbCA9IG1vZGVsc1tpXTtcblxuICAgICAgICAvLyBJZiBhIGR1cGxpY2F0ZSBpcyBmb3VuZCwgcHJldmVudCBpdCBmcm9tIGJlaW5nIGFkZGVkIGFuZFxuICAgICAgICAvLyBvcHRpb25hbGx5IG1lcmdlIGl0IGludG8gdGhlIGV4aXN0aW5nIG1vZGVsLlxuICAgICAgICB2YXIgZXhpc3RpbmcgPSB0aGlzLmdldChtb2RlbCk7XG4gICAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICAgIGlmIChtZXJnZSAmJiBtb2RlbCAhPT0gZXhpc3RpbmcpIHtcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuX2lzTW9kZWwobW9kZWwpID8gbW9kZWwuYXR0cmlidXRlcyA6IG1vZGVsO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMucGFyc2UpIGF0dHJzID0gZXhpc3RpbmcucGFyc2UoYXR0cnMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgZXhpc3Rpbmcuc2V0KGF0dHJzLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRvTWVyZ2UucHVzaChleGlzdGluZyk7XG4gICAgICAgICAgICBpZiAoc29ydGFibGUgJiYgIXNvcnQpIHNvcnQgPSBleGlzdGluZy5oYXNDaGFuZ2VkKHNvcnRBdHRyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFtb2RlbE1hcFtleGlzdGluZy5jaWRdKSB7XG4gICAgICAgICAgICBtb2RlbE1hcFtleGlzdGluZy5jaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIHNldC5wdXNoKGV4aXN0aW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbW9kZWxzW2ldID0gZXhpc3Rpbmc7XG5cbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhIG5ldywgdmFsaWQgbW9kZWwsIHB1c2ggaXQgdG8gdGhlIGB0b0FkZGAgbGlzdC5cbiAgICAgICAgfSBlbHNlIGlmIChhZGQpIHtcbiAgICAgICAgICBtb2RlbCA9IG1vZGVsc1tpXSA9IHRoaXMuX3ByZXBhcmVNb2RlbChtb2RlbCwgb3B0aW9ucyk7XG4gICAgICAgICAgaWYgKG1vZGVsKSB7XG4gICAgICAgICAgICB0b0FkZC5wdXNoKG1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMuX2FkZFJlZmVyZW5jZShtb2RlbCwgb3B0aW9ucyk7XG4gICAgICAgICAgICBtb2RlbE1hcFttb2RlbC5jaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIHNldC5wdXNoKG1vZGVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlIHN0YWxlIG1vZGVscy5cbiAgICAgIGlmIChyZW1vdmUpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBtb2RlbCA9IHRoaXMubW9kZWxzW2ldO1xuICAgICAgICAgIGlmICghbW9kZWxNYXBbbW9kZWwuY2lkXSkgdG9SZW1vdmUucHVzaChtb2RlbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvUmVtb3ZlLmxlbmd0aCkgdGhpcy5fcmVtb3ZlTW9kZWxzKHRvUmVtb3ZlLCBvcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgLy8gU2VlIGlmIHNvcnRpbmcgaXMgbmVlZGVkLCB1cGRhdGUgYGxlbmd0aGAgYW5kIHNwbGljZSBpbiBuZXcgbW9kZWxzLlxuICAgICAgdmFyIG9yZGVyQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgdmFyIHJlcGxhY2UgPSAhc29ydGFibGUgJiYgYWRkICYmIHJlbW92ZTtcbiAgICAgIGlmIChzZXQubGVuZ3RoICYmIHJlcGxhY2UpIHtcbiAgICAgICAgb3JkZXJDaGFuZ2VkID0gdGhpcy5sZW5ndGggIT09IHNldC5sZW5ndGggfHwgXy5zb21lKHRoaXMubW9kZWxzLCBmdW5jdGlvbihtLCBpbmRleCkge1xuICAgICAgICAgIHJldHVybiBtICE9PSBzZXRbaW5kZXhdO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tb2RlbHMubGVuZ3RoID0gMDtcbiAgICAgICAgc3BsaWNlKHRoaXMubW9kZWxzLCBzZXQsIDApO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubW9kZWxzLmxlbmd0aDtcbiAgICAgIH0gZWxzZSBpZiAodG9BZGQubGVuZ3RoKSB7XG4gICAgICAgIGlmIChzb3J0YWJsZSkgc29ydCA9IHRydWU7XG4gICAgICAgIHNwbGljZSh0aGlzLm1vZGVscywgdG9BZGQsIGF0ID09IG51bGwgPyB0aGlzLmxlbmd0aCA6IGF0KTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLm1vZGVscy5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIC8vIFNpbGVudGx5IHNvcnQgdGhlIGNvbGxlY3Rpb24gaWYgYXBwcm9wcmlhdGUuXG4gICAgICBpZiAoc29ydCkgdGhpcy5zb3J0KHtzaWxlbnQ6IHRydWV9KTtcblxuICAgICAgLy8gVW5sZXNzIHNpbGVuY2VkLCBpdCdzIHRpbWUgdG8gZmlyZSBhbGwgYXBwcm9wcmlhdGUgYWRkL3NvcnQvdXBkYXRlIGV2ZW50cy5cbiAgICAgIGlmICghb3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRvQWRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGF0ICE9IG51bGwpIG9wdGlvbnMuaW5kZXggPSBhdCArIGk7XG4gICAgICAgICAgbW9kZWwgPSB0b0FkZFtpXTtcbiAgICAgICAgICBtb2RlbC50cmlnZ2VyKCdhZGQnLCBtb2RlbCwgdGhpcywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNvcnQgfHwgb3JkZXJDaGFuZ2VkKSB0aGlzLnRyaWdnZXIoJ3NvcnQnLCB0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKHRvQWRkLmxlbmd0aCB8fCB0b1JlbW92ZS5sZW5ndGggfHwgdG9NZXJnZS5sZW5ndGgpIHtcbiAgICAgICAgICBvcHRpb25zLmNoYW5nZXMgPSB7XG4gICAgICAgICAgICBhZGRlZDogdG9BZGQsXG4gICAgICAgICAgICByZW1vdmVkOiB0b1JlbW92ZSxcbiAgICAgICAgICAgIG1lcmdlZDogdG9NZXJnZVxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCd1cGRhdGUnLCB0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBSZXR1cm4gdGhlIGFkZGVkIChvciBtZXJnZWQpIG1vZGVsIChvciBtb2RlbHMpLlxuICAgICAgcmV0dXJuIHNpbmd1bGFyID8gbW9kZWxzWzBdIDogbW9kZWxzO1xuICAgIH0sXG5cbiAgICAvLyBXaGVuIHlvdSBoYXZlIG1vcmUgaXRlbXMgdGhhbiB5b3Ugd2FudCB0byBhZGQgb3IgcmVtb3ZlIGluZGl2aWR1YWxseSxcbiAgICAvLyB5b3UgY2FuIHJlc2V0IHRoZSBlbnRpcmUgc2V0IHdpdGggYSBuZXcgbGlzdCBvZiBtb2RlbHMsIHdpdGhvdXQgZmlyaW5nXG4gICAgLy8gYW55IGdyYW51bGFyIGBhZGRgIG9yIGByZW1vdmVgIGV2ZW50cy4gRmlyZXMgYHJlc2V0YCB3aGVuIGZpbmlzaGVkLlxuICAgIC8vIFVzZWZ1bCBmb3IgYnVsayBvcGVyYXRpb25zIGFuZCBvcHRpbWl6YXRpb25zLlxuICAgIHJlc2V0OiBmdW5jdGlvbihtb2RlbHMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zID8gXy5jbG9uZShvcHRpb25zKSA6IHt9O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm1vZGVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLl9yZW1vdmVSZWZlcmVuY2UodGhpcy5tb2RlbHNbaV0sIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgb3B0aW9ucy5wcmV2aW91c01vZGVscyA9IHRoaXMubW9kZWxzO1xuICAgICAgdGhpcy5fcmVzZXQoKTtcbiAgICAgIG1vZGVscyA9IHRoaXMuYWRkKG1vZGVscywgXy5leHRlbmQoe3NpbGVudDogdHJ1ZX0sIG9wdGlvbnMpKTtcbiAgICAgIGlmICghb3B0aW9ucy5zaWxlbnQpIHRoaXMudHJpZ2dlcigncmVzZXQnLCB0aGlzLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBtb2RlbHM7XG4gICAgfSxcblxuICAgIC8vIEFkZCBhIG1vZGVsIHRvIHRoZSBlbmQgb2YgdGhlIGNvbGxlY3Rpb24uXG4gICAgcHVzaDogZnVuY3Rpb24obW9kZWwsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZChtb2RlbCwgXy5leHRlbmQoe2F0OiB0aGlzLmxlbmd0aH0sIG9wdGlvbnMpKTtcbiAgICB9LFxuXG4gICAgLy8gUmVtb3ZlIGEgbW9kZWwgZnJvbSB0aGUgZW5kIG9mIHRoZSBjb2xsZWN0aW9uLlxuICAgIHBvcDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIG1vZGVsID0gdGhpcy5hdCh0aGlzLmxlbmd0aCAtIDEpO1xuICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlKG1vZGVsLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLy8gQWRkIGEgbW9kZWwgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgY29sbGVjdGlvbi5cbiAgICB1bnNoaWZ0OiBmdW5jdGlvbihtb2RlbCwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkKG1vZGVsLCBfLmV4dGVuZCh7YXQ6IDB9LCBvcHRpb25zKSk7XG4gICAgfSxcblxuICAgIC8vIFJlbW92ZSBhIG1vZGVsIGZyb20gdGhlIGJlZ2lubmluZyBvZiB0aGUgY29sbGVjdGlvbi5cbiAgICBzaGlmdDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIG1vZGVsID0gdGhpcy5hdCgwKTtcbiAgICAgIHJldHVybiB0aGlzLnJlbW92ZShtb2RlbCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFNsaWNlIG91dCBhIHN1Yi1hcnJheSBvZiBtb2RlbHMgZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICBzbGljZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc2xpY2UuYXBwbHkodGhpcy5tb2RlbHMsIGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIC8vIEdldCBhIG1vZGVsIGZyb20gdGhlIHNldCBieSBpZCwgY2lkLCBtb2RlbCBvYmplY3Qgd2l0aCBpZCBvciBjaWRcbiAgICAvLyBwcm9wZXJ0aWVzLCBvciBhbiBhdHRyaWJ1dGVzIG9iamVjdCB0aGF0IGlzIHRyYW5zZm9ybWVkIHRocm91Z2ggbW9kZWxJZC5cbiAgICBnZXQ6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgICAgcmV0dXJuIHRoaXMuX2J5SWRbb2JqXSB8fFxuICAgICAgICB0aGlzLl9ieUlkW3RoaXMubW9kZWxJZCh0aGlzLl9pc01vZGVsKG9iaikgPyBvYmouYXR0cmlidXRlcyA6IG9iaildIHx8XG4gICAgICAgIG9iai5jaWQgJiYgdGhpcy5fYnlJZFtvYmouY2lkXTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG1vZGVsIGlzIGluIHRoZSBjb2xsZWN0aW9uLlxuICAgIGhhczogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQob2JqKSAhPSBudWxsO1xuICAgIH0sXG5cbiAgICAvLyBHZXQgdGhlIG1vZGVsIGF0IHRoZSBnaXZlbiBpbmRleC5cbiAgICBhdDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgIGlmIChpbmRleCA8IDApIGluZGV4ICs9IHRoaXMubGVuZ3RoO1xuICAgICAgcmV0dXJuIHRoaXMubW9kZWxzW2luZGV4XTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJuIG1vZGVscyB3aXRoIG1hdGNoaW5nIGF0dHJpYnV0ZXMuIFVzZWZ1bCBmb3Igc2ltcGxlIGNhc2VzIG9mXG4gICAgLy8gYGZpbHRlcmAuXG4gICAgd2hlcmU6IGZ1bmN0aW9uKGF0dHJzLCBmaXJzdCkge1xuICAgICAgcmV0dXJuIHRoaXNbZmlyc3QgPyAnZmluZCcgOiAnZmlsdGVyJ10oYXR0cnMpO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm4gdGhlIGZpcnN0IG1vZGVsIHdpdGggbWF0Y2hpbmcgYXR0cmlidXRlcy4gVXNlZnVsIGZvciBzaW1wbGUgY2FzZXNcbiAgICAvLyBvZiBgZmluZGAuXG4gICAgZmluZFdoZXJlOiBmdW5jdGlvbihhdHRycykge1xuICAgICAgcmV0dXJuIHRoaXMud2hlcmUoYXR0cnMsIHRydWUpO1xuICAgIH0sXG5cbiAgICAvLyBGb3JjZSB0aGUgY29sbGVjdGlvbiB0byByZS1zb3J0IGl0c2VsZi4gWW91IGRvbid0IG5lZWQgdG8gY2FsbCB0aGlzIHVuZGVyXG4gICAgLy8gbm9ybWFsIGNpcmN1bXN0YW5jZXMsIGFzIHRoZSBzZXQgd2lsbCBtYWludGFpbiBzb3J0IG9yZGVyIGFzIGVhY2ggaXRlbVxuICAgIC8vIGlzIGFkZGVkLlxuICAgIHNvcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHZhciBjb21wYXJhdG9yID0gdGhpcy5jb21wYXJhdG9yO1xuICAgICAgaWYgKCFjb21wYXJhdG9yKSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzb3J0IGEgc2V0IHdpdGhvdXQgYSBjb21wYXJhdG9yJyk7XG4gICAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuXG4gICAgICB2YXIgbGVuZ3RoID0gY29tcGFyYXRvci5sZW5ndGg7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKGNvbXBhcmF0b3IpKSBjb21wYXJhdG9yID0gY29tcGFyYXRvci5iaW5kKHRoaXMpO1xuXG4gICAgICAvLyBSdW4gc29ydCBiYXNlZCBvbiB0eXBlIG9mIGBjb21wYXJhdG9yYC5cbiAgICAgIGlmIChsZW5ndGggPT09IDEgfHwgXy5pc1N0cmluZyhjb21wYXJhdG9yKSkge1xuICAgICAgICB0aGlzLm1vZGVscyA9IHRoaXMuc29ydEJ5KGNvbXBhcmF0b3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb2RlbHMuc29ydChjb21wYXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIGlmICghb3B0aW9ucy5zaWxlbnQpIHRoaXMudHJpZ2dlcignc29ydCcsIHRoaXMsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIFBsdWNrIGFuIGF0dHJpYnV0ZSBmcm9tIGVhY2ggbW9kZWwgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAgcGx1Y2s6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcChhdHRyICsgJycpO1xuICAgIH0sXG5cbiAgICAvLyBGZXRjaCB0aGUgZGVmYXVsdCBzZXQgb2YgbW9kZWxzIGZvciB0aGlzIGNvbGxlY3Rpb24sIHJlc2V0dGluZyB0aGVcbiAgICAvLyBjb2xsZWN0aW9uIHdoZW4gdGhleSBhcnJpdmUuIElmIGByZXNldDogdHJ1ZWAgaXMgcGFzc2VkLCB0aGUgcmVzcG9uc2VcbiAgICAvLyBkYXRhIHdpbGwgYmUgcGFzc2VkIHRocm91Z2ggdGhlIGByZXNldGAgbWV0aG9kIGluc3RlYWQgb2YgYHNldGAuXG4gICAgZmV0Y2g6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7cGFyc2U6IHRydWV9LCBvcHRpb25zKTtcbiAgICAgIHZhciBzdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzO1xuICAgICAgdmFyIGNvbGxlY3Rpb24gPSB0aGlzO1xuICAgICAgb3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICB2YXIgbWV0aG9kID0gb3B0aW9ucy5yZXNldCA/ICdyZXNldCcgOiAnc2V0JztcbiAgICAgICAgY29sbGVjdGlvblttZXRob2RdKHJlc3AsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoc3VjY2Vzcykgc3VjY2Vzcy5jYWxsKG9wdGlvbnMuY29udGV4dCwgY29sbGVjdGlvbiwgcmVzcCwgb3B0aW9ucyk7XG4gICAgICAgIGNvbGxlY3Rpb24udHJpZ2dlcignc3luYycsIGNvbGxlY3Rpb24sIHJlc3AsIG9wdGlvbnMpO1xuICAgICAgfTtcbiAgICAgIHdyYXBFcnJvcih0aGlzLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiB0aGlzLnN5bmMoJ3JlYWQnLCB0aGlzLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGEgbW9kZWwgaW4gdGhpcyBjb2xsZWN0aW9uLiBBZGQgdGhlIG1vZGVsIHRvIHRoZVxuICAgIC8vIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHksIHVubGVzcyBgd2FpdDogdHJ1ZWAgaXMgcGFzc2VkLCBpbiB3aGljaCBjYXNlIHdlXG4gICAgLy8gd2FpdCBmb3IgdGhlIHNlcnZlciB0byBhZ3JlZS5cbiAgICBjcmVhdGU6IGZ1bmN0aW9uKG1vZGVsLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyA/IF8uY2xvbmUob3B0aW9ucykgOiB7fTtcbiAgICAgIHZhciB3YWl0ID0gb3B0aW9ucy53YWl0O1xuICAgICAgbW9kZWwgPSB0aGlzLl9wcmVwYXJlTW9kZWwobW9kZWwsIG9wdGlvbnMpO1xuICAgICAgaWYgKCFtb2RlbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCF3YWl0KSB0aGlzLmFkZChtb2RlbCwgb3B0aW9ucyk7XG4gICAgICB2YXIgY29sbGVjdGlvbiA9IHRoaXM7XG4gICAgICB2YXIgc3VjY2VzcyA9IG9wdGlvbnMuc3VjY2VzcztcbiAgICAgIG9wdGlvbnMuc3VjY2VzcyA9IGZ1bmN0aW9uKG0sIHJlc3AsIGNhbGxiYWNrT3B0cykge1xuICAgICAgICBpZiAod2FpdCkgY29sbGVjdGlvbi5hZGQobSwgY2FsbGJhY2tPcHRzKTtcbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHN1Y2Nlc3MuY2FsbChjYWxsYmFja09wdHMuY29udGV4dCwgbSwgcmVzcCwgY2FsbGJhY2tPcHRzKTtcbiAgICAgIH07XG4gICAgICBtb2RlbC5zYXZlKG51bGwsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH0sXG5cbiAgICAvLyAqKnBhcnNlKiogY29udmVydHMgYSByZXNwb25zZSBpbnRvIGEgbGlzdCBvZiBtb2RlbHMgdG8gYmUgYWRkZWQgdG8gdGhlXG4gICAgLy8gY29sbGVjdGlvbi4gVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gaXMganVzdCB0byBwYXNzIGl0IHRocm91Z2guXG4gICAgcGFyc2U6IGZ1bmN0aW9uKHJlc3AsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiByZXNwO1xuICAgIH0sXG5cbiAgICAvLyBDcmVhdGUgYSBuZXcgY29sbGVjdGlvbiB3aXRoIGFuIGlkZW50aWNhbCBsaXN0IG9mIG1vZGVscyBhcyB0aGlzIG9uZS5cbiAgICBjbG9uZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5tb2RlbHMsIHtcbiAgICAgICAgbW9kZWw6IHRoaXMubW9kZWwsXG4gICAgICAgIGNvbXBhcmF0b3I6IHRoaXMuY29tcGFyYXRvclxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIERlZmluZSBob3cgdG8gdW5pcXVlbHkgaWRlbnRpZnkgbW9kZWxzIGluIHRoZSBjb2xsZWN0aW9uLlxuICAgIG1vZGVsSWQ6IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgICByZXR1cm4gYXR0cnNbdGhpcy5tb2RlbC5wcm90b3R5cGUuaWRBdHRyaWJ1dGUgfHwgJ2lkJ107XG4gICAgfSxcblxuICAgIC8vIEdldCBhbiBpdGVyYXRvciBvZiBhbGwgbW9kZWxzIGluIHRoaXMgY29sbGVjdGlvbi5cbiAgICB2YWx1ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBDb2xsZWN0aW9uSXRlcmF0b3IodGhpcywgSVRFUkFUT1JfVkFMVUVTKTtcbiAgICB9LFxuXG4gICAgLy8gR2V0IGFuIGl0ZXJhdG9yIG9mIGFsbCBtb2RlbCBJRHMgaW4gdGhpcyBjb2xsZWN0aW9uLlxuICAgIGtleXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBDb2xsZWN0aW9uSXRlcmF0b3IodGhpcywgSVRFUkFUT1JfS0VZUyk7XG4gICAgfSxcblxuICAgIC8vIEdldCBhbiBpdGVyYXRvciBvZiBhbGwgW0lELCBtb2RlbF0gdHVwbGVzIGluIHRoaXMgY29sbGVjdGlvbi5cbiAgICBlbnRyaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgQ29sbGVjdGlvbkl0ZXJhdG9yKHRoaXMsIElURVJBVE9SX0tFWVNWQUxVRVMpO1xuICAgIH0sXG5cbiAgICAvLyBQcml2YXRlIG1ldGhvZCB0byByZXNldCBhbGwgaW50ZXJuYWwgc3RhdGUuIENhbGxlZCB3aGVuIHRoZSBjb2xsZWN0aW9uXG4gICAgLy8gaXMgZmlyc3QgaW5pdGlhbGl6ZWQgb3IgcmVzZXQuXG4gICAgX3Jlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgIHRoaXMubW9kZWxzID0gW107XG4gICAgICB0aGlzLl9ieUlkICA9IHt9O1xuICAgIH0sXG5cbiAgICAvLyBQcmVwYXJlIGEgaGFzaCBvZiBhdHRyaWJ1dGVzIChvciBvdGhlciBtb2RlbCkgdG8gYmUgYWRkZWQgdG8gdGhpc1xuICAgIC8vIGNvbGxlY3Rpb24uXG4gICAgX3ByZXBhcmVNb2RlbDogZnVuY3Rpb24oYXR0cnMsIG9wdGlvbnMpIHtcbiAgICAgIGlmICh0aGlzLl9pc01vZGVsKGF0dHJzKSkge1xuICAgICAgICBpZiAoIWF0dHJzLmNvbGxlY3Rpb24pIGF0dHJzLmNvbGxlY3Rpb24gPSB0aGlzO1xuICAgICAgICByZXR1cm4gYXR0cnM7XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyA/IF8uY2xvbmUob3B0aW9ucykgOiB7fTtcbiAgICAgIG9wdGlvbnMuY29sbGVjdGlvbiA9IHRoaXM7XG4gICAgICB2YXIgbW9kZWwgPSBuZXcgdGhpcy5tb2RlbChhdHRycywgb3B0aW9ucyk7XG4gICAgICBpZiAoIW1vZGVsLnZhbGlkYXRpb25FcnJvcikgcmV0dXJuIG1vZGVsO1xuICAgICAgdGhpcy50cmlnZ2VyKCdpbnZhbGlkJywgdGhpcywgbW9kZWwudmFsaWRhdGlvbkVycm9yLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gSW50ZXJuYWwgbWV0aG9kIGNhbGxlZCBieSBib3RoIHJlbW92ZSBhbmQgc2V0LlxuICAgIF9yZW1vdmVNb2RlbHM6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuICAgICAgdmFyIHJlbW92ZWQgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9kZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBtb2RlbCA9IHRoaXMuZ2V0KG1vZGVsc1tpXSk7XG4gICAgICAgIGlmICghbW9kZWwpIGNvbnRpbnVlO1xuXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuaW5kZXhPZihtb2RlbCk7XG4gICAgICAgIHRoaXMubW9kZWxzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHRoaXMubGVuZ3RoLS07XG5cbiAgICAgICAgLy8gUmVtb3ZlIHJlZmVyZW5jZXMgYmVmb3JlIHRyaWdnZXJpbmcgJ3JlbW92ZScgZXZlbnQgdG8gcHJldmVudCBhblxuICAgICAgICAvLyBpbmZpbml0ZSBsb29wLiAjMzY5M1xuICAgICAgICBkZWxldGUgdGhpcy5fYnlJZFttb2RlbC5jaWRdO1xuICAgICAgICB2YXIgaWQgPSB0aGlzLm1vZGVsSWQobW9kZWwuYXR0cmlidXRlcyk7XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSBkZWxldGUgdGhpcy5fYnlJZFtpZF07XG5cbiAgICAgICAgaWYgKCFvcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgIG9wdGlvbnMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICBtb2RlbC50cmlnZ2VyKCdyZW1vdmUnLCBtb2RlbCwgdGhpcywgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVkLnB1c2gobW9kZWwpO1xuICAgICAgICB0aGlzLl9yZW1vdmVSZWZlcmVuY2UobW9kZWwsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbW92ZWQ7XG4gICAgfSxcblxuICAgIC8vIE1ldGhvZCBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3Qgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYSBtb2RlbCBmb3JcbiAgICAvLyB0aGUgcHVycG9zZXMgb2YgYWRkaW5nIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgIF9pc01vZGVsOiBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgcmV0dXJuIG1vZGVsIGluc3RhbmNlb2YgTW9kZWw7XG4gICAgfSxcblxuICAgIC8vIEludGVybmFsIG1ldGhvZCB0byBjcmVhdGUgYSBtb2RlbCdzIHRpZXMgdG8gYSBjb2xsZWN0aW9uLlxuICAgIF9hZGRSZWZlcmVuY2U6IGZ1bmN0aW9uKG1vZGVsLCBvcHRpb25zKSB7XG4gICAgICB0aGlzLl9ieUlkW21vZGVsLmNpZF0gPSBtb2RlbDtcbiAgICAgIHZhciBpZCA9IHRoaXMubW9kZWxJZChtb2RlbC5hdHRyaWJ1dGVzKTtcbiAgICAgIGlmIChpZCAhPSBudWxsKSB0aGlzLl9ieUlkW2lkXSA9IG1vZGVsO1xuICAgICAgbW9kZWwub24oJ2FsbCcsIHRoaXMuX29uTW9kZWxFdmVudCwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8vIEludGVybmFsIG1ldGhvZCB0byBzZXZlciBhIG1vZGVsJ3MgdGllcyB0byBhIGNvbGxlY3Rpb24uXG4gICAgX3JlbW92ZVJlZmVyZW5jZTogZnVuY3Rpb24obW9kZWwsIG9wdGlvbnMpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ieUlkW21vZGVsLmNpZF07XG4gICAgICB2YXIgaWQgPSB0aGlzLm1vZGVsSWQobW9kZWwuYXR0cmlidXRlcyk7XG4gICAgICBpZiAoaWQgIT0gbnVsbCkgZGVsZXRlIHRoaXMuX2J5SWRbaWRdO1xuICAgICAgaWYgKHRoaXMgPT09IG1vZGVsLmNvbGxlY3Rpb24pIGRlbGV0ZSBtb2RlbC5jb2xsZWN0aW9uO1xuICAgICAgbW9kZWwub2ZmKCdhbGwnLCB0aGlzLl9vbk1vZGVsRXZlbnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvLyBJbnRlcm5hbCBtZXRob2QgY2FsbGVkIGV2ZXJ5IHRpbWUgYSBtb2RlbCBpbiB0aGUgc2V0IGZpcmVzIGFuIGV2ZW50LlxuICAgIC8vIFNldHMgbmVlZCB0byB1cGRhdGUgdGhlaXIgaW5kZXhlcyB3aGVuIG1vZGVscyBjaGFuZ2UgaWRzLiBBbGwgb3RoZXJcbiAgICAvLyBldmVudHMgc2ltcGx5IHByb3h5IHRocm91Z2guIFwiYWRkXCIgYW5kIFwicmVtb3ZlXCIgZXZlbnRzIHRoYXQgb3JpZ2luYXRlXG4gICAgLy8gaW4gb3RoZXIgY29sbGVjdGlvbnMgYXJlIGlnbm9yZWQuXG4gICAgX29uTW9kZWxFdmVudDogZnVuY3Rpb24oZXZlbnQsIG1vZGVsLCBjb2xsZWN0aW9uLCBvcHRpb25zKSB7XG4gICAgICBpZiAobW9kZWwpIHtcbiAgICAgICAgaWYgKChldmVudCA9PT0gJ2FkZCcgfHwgZXZlbnQgPT09ICdyZW1vdmUnKSAmJiBjb2xsZWN0aW9uICE9PSB0aGlzKSByZXR1cm47XG4gICAgICAgIGlmIChldmVudCA9PT0gJ2Rlc3Ryb3knKSB0aGlzLnJlbW92ZShtb2RlbCwgb3B0aW9ucyk7XG4gICAgICAgIGlmIChldmVudCA9PT0gJ2NoYW5nZScpIHtcbiAgICAgICAgICB2YXIgcHJldklkID0gdGhpcy5tb2RlbElkKG1vZGVsLnByZXZpb3VzQXR0cmlidXRlcygpKTtcbiAgICAgICAgICB2YXIgaWQgPSB0aGlzLm1vZGVsSWQobW9kZWwuYXR0cmlidXRlcyk7XG4gICAgICAgICAgaWYgKHByZXZJZCAhPT0gaWQpIHtcbiAgICAgICAgICAgIGlmIChwcmV2SWQgIT0gbnVsbCkgZGVsZXRlIHRoaXMuX2J5SWRbcHJldklkXTtcbiAgICAgICAgICAgIGlmIChpZCAhPSBudWxsKSB0aGlzLl9ieUlkW2lkXSA9IG1vZGVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy50cmlnZ2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gIH0pO1xuXG4gIC8vIERlZmluaW5nIGFuIEBAaXRlcmF0b3IgbWV0aG9kIGltcGxlbWVudHMgSmF2YVNjcmlwdCdzIEl0ZXJhYmxlIHByb3RvY29sLlxuICAvLyBJbiBtb2Rlcm4gRVMyMDE1IGJyb3dzZXJzLCB0aGlzIHZhbHVlIGlzIGZvdW5kIGF0IFN5bWJvbC5pdGVyYXRvci5cbiAgLyogZ2xvYmFsIFN5bWJvbCAqL1xuICB2YXIgJCRpdGVyYXRvciA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICBpZiAoJCRpdGVyYXRvcikge1xuICAgIENvbGxlY3Rpb24ucHJvdG90eXBlWyQkaXRlcmF0b3JdID0gQ29sbGVjdGlvbi5wcm90b3R5cGUudmFsdWVzO1xuICB9XG5cbiAgLy8gQ29sbGVjdGlvbkl0ZXJhdG9yXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEEgQ29sbGVjdGlvbkl0ZXJhdG9yIGltcGxlbWVudHMgSmF2YVNjcmlwdCdzIEl0ZXJhdG9yIHByb3RvY29sLCBhbGxvd2luZyB0aGVcbiAgLy8gdXNlIG9mIGBmb3Igb2ZgIGxvb3BzIGluIG1vZGVybiBicm93c2VycyBhbmQgaW50ZXJvcGVyYXRpb24gYmV0d2VlblxuICAvLyBCYWNrYm9uZS5Db2xsZWN0aW9uIGFuZCBvdGhlciBKYXZhU2NyaXB0IGZ1bmN0aW9ucyBhbmQgdGhpcmQtcGFydHkgbGlicmFyaWVzXG4gIC8vIHdoaWNoIGNhbiBvcGVyYXRlIG9uIEl0ZXJhYmxlcy5cbiAgdmFyIENvbGxlY3Rpb25JdGVyYXRvciA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGtpbmQpIHtcbiAgICB0aGlzLl9jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcbiAgICB0aGlzLl9raW5kID0ga2luZDtcbiAgICB0aGlzLl9pbmRleCA9IDA7XG4gIH07XG5cbiAgLy8gVGhpcyBcImVudW1cIiBkZWZpbmVzIHRoZSB0aHJlZSBwb3NzaWJsZSBraW5kcyBvZiB2YWx1ZXMgd2hpY2ggY2FuIGJlIGVtaXR0ZWRcbiAgLy8gYnkgYSBDb2xsZWN0aW9uSXRlcmF0b3IgdGhhdCBjb3JyZXNwb25kIHRvIHRoZSB2YWx1ZXMoKSwga2V5cygpIGFuZCBlbnRyaWVzKClcbiAgLy8gbWV0aG9kcyBvbiBDb2xsZWN0aW9uLCByZXNwZWN0aXZlbHkuXG4gIHZhciBJVEVSQVRPUl9WQUxVRVMgPSAxO1xuICB2YXIgSVRFUkFUT1JfS0VZUyA9IDI7XG4gIHZhciBJVEVSQVRPUl9LRVlTVkFMVUVTID0gMztcblxuICAvLyBBbGwgSXRlcmF0b3JzIHNob3VsZCB0aGVtc2VsdmVzIGJlIEl0ZXJhYmxlLlxuICBpZiAoJCRpdGVyYXRvcikge1xuICAgIENvbGxlY3Rpb25JdGVyYXRvci5wcm90b3R5cGVbJCRpdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gIH1cblxuICBDb2xsZWN0aW9uSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fY29sbGVjdGlvbikge1xuXG4gICAgICAvLyBPbmx5IGNvbnRpbnVlIGl0ZXJhdGluZyBpZiB0aGUgaXRlcmF0ZWQgY29sbGVjdGlvbiBpcyBsb25nIGVub3VnaC5cbiAgICAgIGlmICh0aGlzLl9pbmRleCA8IHRoaXMuX2NvbGxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIHZhciBtb2RlbCA9IHRoaXMuX2NvbGxlY3Rpb24uYXQodGhpcy5faW5kZXgpO1xuICAgICAgICB0aGlzLl9pbmRleCsrO1xuXG4gICAgICAgIC8vIENvbnN0cnVjdCBhIHZhbHVlIGRlcGVuZGluZyBvbiB3aGF0IGtpbmQgb2YgdmFsdWVzIHNob3VsZCBiZSBpdGVyYXRlZC5cbiAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICBpZiAodGhpcy5fa2luZCA9PT0gSVRFUkFUT1JfVkFMVUVTKSB7XG4gICAgICAgICAgdmFsdWUgPSBtb2RlbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgaWQgPSB0aGlzLl9jb2xsZWN0aW9uLm1vZGVsSWQobW9kZWwuYXR0cmlidXRlcyk7XG4gICAgICAgICAgaWYgKHRoaXMuX2tpbmQgPT09IElURVJBVE9SX0tFWVMpIHtcbiAgICAgICAgICAgIHZhbHVlID0gaWQ7XG4gICAgICAgICAgfSBlbHNlIHsgLy8gSVRFUkFUT1JfS0VZU1ZBTFVFU1xuICAgICAgICAgICAgdmFsdWUgPSBbaWQsIG1vZGVsXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6IGZhbHNlfTtcbiAgICAgIH1cblxuICAgICAgLy8gT25jZSBleGhhdXN0ZWQsIHJlbW92ZSB0aGUgcmVmZXJlbmNlIHRvIHRoZSBjb2xsZWN0aW9uIHNvIGZ1dHVyZVxuICAgICAgLy8gY2FsbHMgdG8gdGhlIG5leHQgbWV0aG9kIGFsd2F5cyByZXR1cm4gZG9uZS5cbiAgICAgIHRoaXMuX2NvbGxlY3Rpb24gPSB2b2lkIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHt2YWx1ZTogdm9pZCAwLCBkb25lOiB0cnVlfTtcbiAgfTtcblxuICAvLyBCYWNrYm9uZS5WaWV3XG4gIC8vIC0tLS0tLS0tLS0tLS1cblxuICAvLyBCYWNrYm9uZSBWaWV3cyBhcmUgYWxtb3N0IG1vcmUgY29udmVudGlvbiB0aGFuIHRoZXkgYXJlIGFjdHVhbCBjb2RlLiBBIFZpZXdcbiAgLy8gaXMgc2ltcGx5IGEgSmF2YVNjcmlwdCBvYmplY3QgdGhhdCByZXByZXNlbnRzIGEgbG9naWNhbCBjaHVuayBvZiBVSSBpbiB0aGVcbiAgLy8gRE9NLiBUaGlzIG1pZ2h0IGJlIGEgc2luZ2xlIGl0ZW0sIGFuIGVudGlyZSBsaXN0LCBhIHNpZGViYXIgb3IgcGFuZWwsIG9yXG4gIC8vIGV2ZW4gdGhlIHN1cnJvdW5kaW5nIGZyYW1lIHdoaWNoIHdyYXBzIHlvdXIgd2hvbGUgYXBwLiBEZWZpbmluZyBhIGNodW5rIG9mXG4gIC8vIFVJIGFzIGEgKipWaWV3KiogYWxsb3dzIHlvdSB0byBkZWZpbmUgeW91ciBET00gZXZlbnRzIGRlY2xhcmF0aXZlbHksIHdpdGhvdXRcbiAgLy8gaGF2aW5nIHRvIHdvcnJ5IGFib3V0IHJlbmRlciBvcmRlciAuLi4gYW5kIG1ha2VzIGl0IGVhc3kgZm9yIHRoZSB2aWV3IHRvXG4gIC8vIHJlYWN0IHRvIHNwZWNpZmljIGNoYW5nZXMgaW4gdGhlIHN0YXRlIG9mIHlvdXIgbW9kZWxzLlxuXG4gIC8vIENyZWF0aW5nIGEgQmFja2JvbmUuVmlldyBjcmVhdGVzIGl0cyBpbml0aWFsIGVsZW1lbnQgb3V0c2lkZSBvZiB0aGUgRE9NLFxuICAvLyBpZiBhbiBleGlzdGluZyBlbGVtZW50IGlzIG5vdCBwcm92aWRlZC4uLlxuICB2YXIgVmlldyA9IEJhY2tib25lLlZpZXcgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5jaWQgPSBfLnVuaXF1ZUlkKCd2aWV3Jyk7XG4gICAgdGhpcy5wcmVpbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgXy5leHRlbmQodGhpcywgXy5waWNrKG9wdGlvbnMsIHZpZXdPcHRpb25zKSk7XG4gICAgdGhpcy5fZW5zdXJlRWxlbWVudCgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuXG4gIC8vIENhY2hlZCByZWdleCB0byBzcGxpdCBrZXlzIGZvciBgZGVsZWdhdGVgLlxuICB2YXIgZGVsZWdhdGVFdmVudFNwbGl0dGVyID0gL14oXFxTKylcXHMqKC4qKSQvO1xuXG4gIC8vIExpc3Qgb2YgdmlldyBvcHRpb25zIHRvIGJlIHNldCBhcyBwcm9wZXJ0aWVzLlxuICB2YXIgdmlld09wdGlvbnMgPSBbJ21vZGVsJywgJ2NvbGxlY3Rpb24nLCAnZWwnLCAnaWQnLCAnYXR0cmlidXRlcycsICdjbGFzc05hbWUnLCAndGFnTmFtZScsICdldmVudHMnXTtcblxuICAvLyBTZXQgdXAgYWxsIGluaGVyaXRhYmxlICoqQmFja2JvbmUuVmlldyoqIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuXG4gIF8uZXh0ZW5kKFZpZXcucHJvdG90eXBlLCBFdmVudHMsIHtcblxuICAgIC8vIFRoZSBkZWZhdWx0IGB0YWdOYW1lYCBvZiBhIFZpZXcncyBlbGVtZW50IGlzIGBcImRpdlwiYC5cbiAgICB0YWdOYW1lOiAnZGl2JyxcblxuICAgIC8vIGpRdWVyeSBkZWxlZ2F0ZSBmb3IgZWxlbWVudCBsb29rdXAsIHNjb3BlZCB0byBET00gZWxlbWVudHMgd2l0aGluIHRoZVxuICAgIC8vIGN1cnJlbnQgdmlldy4gVGhpcyBzaG91bGQgYmUgcHJlZmVycmVkIHRvIGdsb2JhbCBsb29rdXBzIHdoZXJlIHBvc3NpYmxlLlxuICAgICQ6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy4kZWwuZmluZChzZWxlY3Rvcik7XG4gICAgfSxcblxuICAgIC8vIHByZWluaXRpYWxpemUgaXMgYW4gZW1wdHkgZnVuY3Rpb24gYnkgZGVmYXVsdC4gWW91IGNhbiBvdmVycmlkZSBpdCB3aXRoIGEgZnVuY3Rpb25cbiAgICAvLyBvciBvYmplY3QuICBwcmVpbml0aWFsaXplIHdpbGwgcnVuIGJlZm9yZSBhbnkgaW5zdGFudGlhdGlvbiBsb2dpYyBpcyBydW4gaW4gdGhlIFZpZXdcbiAgICBwcmVpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cbiAgICAvLyBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cbiAgICAvLyBpbml0aWFsaXphdGlvbiBsb2dpYy5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cbiAgICAvLyAqKnJlbmRlcioqIGlzIHRoZSBjb3JlIGZ1bmN0aW9uIHRoYXQgeW91ciB2aWV3IHNob3VsZCBvdmVycmlkZSwgaW4gb3JkZXJcbiAgICAvLyB0byBwb3B1bGF0ZSBpdHMgZWxlbWVudCAoYHRoaXMuZWxgKSwgd2l0aCB0aGUgYXBwcm9wcmlhdGUgSFRNTC4gVGhlXG4gICAgLy8gY29udmVudGlvbiBpcyBmb3IgKipyZW5kZXIqKiB0byBhbHdheXMgcmV0dXJuIGB0aGlzYC5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIFJlbW92ZSB0aGlzIHZpZXcgYnkgdGFraW5nIHRoZSBlbGVtZW50IG91dCBvZiB0aGUgRE9NLCBhbmQgcmVtb3ZpbmcgYW55XG4gICAgLy8gYXBwbGljYWJsZSBCYWNrYm9uZS5FdmVudHMgbGlzdGVuZXJzLlxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9yZW1vdmVFbGVtZW50KCk7XG4gICAgICB0aGlzLnN0b3BMaXN0ZW5pbmcoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBSZW1vdmUgdGhpcyB2aWV3J3MgZWxlbWVudCBmcm9tIHRoZSBkb2N1bWVudCBhbmQgYWxsIGV2ZW50IGxpc3RlbmVyc1xuICAgIC8vIGF0dGFjaGVkIHRvIGl0LiBFeHBvc2VkIGZvciBzdWJjbGFzc2VzIHVzaW5nIGFuIGFsdGVybmF0aXZlIERPTVxuICAgIC8vIG1hbmlwdWxhdGlvbiBBUEkuXG4gICAgX3JlbW92ZUVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlKCk7XG4gICAgfSxcblxuICAgIC8vIENoYW5nZSB0aGUgdmlldydzIGVsZW1lbnQgKGB0aGlzLmVsYCBwcm9wZXJ0eSkgYW5kIHJlLWRlbGVnYXRlIHRoZVxuICAgIC8vIHZpZXcncyBldmVudHMgb24gdGhlIG5ldyBlbGVtZW50LlxuICAgIHNldEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIHRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgICAgdGhpcy5fc2V0RWxlbWVudChlbGVtZW50KTtcbiAgICAgIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBDcmVhdGVzIHRoZSBgdGhpcy5lbGAgYW5kIGB0aGlzLiRlbGAgcmVmZXJlbmNlcyBmb3IgdGhpcyB2aWV3IHVzaW5nIHRoZVxuICAgIC8vIGdpdmVuIGBlbGAuIGBlbGAgY2FuIGJlIGEgQ1NTIHNlbGVjdG9yIG9yIGFuIEhUTUwgc3RyaW5nLCBhIGpRdWVyeVxuICAgIC8vIGNvbnRleHQgb3IgYW4gZWxlbWVudC4gU3ViY2xhc3NlcyBjYW4gb3ZlcnJpZGUgdGhpcyB0byB1dGlsaXplIGFuXG4gICAgLy8gYWx0ZXJuYXRpdmUgRE9NIG1hbmlwdWxhdGlvbiBBUEkgYW5kIGFyZSBvbmx5IHJlcXVpcmVkIHRvIHNldCB0aGVcbiAgICAvLyBgdGhpcy5lbGAgcHJvcGVydHkuXG4gICAgX3NldEVsZW1lbnQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB0aGlzLiRlbCA9IGVsIGluc3RhbmNlb2YgQmFja2JvbmUuJCA/IGVsIDogQmFja2JvbmUuJChlbCk7XG4gICAgICB0aGlzLmVsID0gdGhpcy4kZWxbMF07XG4gICAgfSxcblxuICAgIC8vIFNldCBjYWxsYmFja3MsIHdoZXJlIGB0aGlzLmV2ZW50c2AgaXMgYSBoYXNoIG9mXG4gICAgLy9cbiAgICAvLyAqe1wiZXZlbnQgc2VsZWN0b3JcIjogXCJjYWxsYmFja1wifSpcbiAgICAvL1xuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgJ21vdXNlZG93biAudGl0bGUnOiAgJ2VkaXQnLFxuICAgIC8vICAgICAgICdjbGljayAuYnV0dG9uJzogICAgICdzYXZlJyxcbiAgICAvLyAgICAgICAnY2xpY2sgLm9wZW4nOiAgICAgICBmdW5jdGlvbihlKSB7IC4uLiB9XG4gICAgLy8gICAgIH1cbiAgICAvL1xuICAgIC8vIHBhaXJzLiBDYWxsYmFja3Mgd2lsbCBiZSBib3VuZCB0byB0aGUgdmlldywgd2l0aCBgdGhpc2Agc2V0IHByb3Blcmx5LlxuICAgIC8vIFVzZXMgZXZlbnQgZGVsZWdhdGlvbiBmb3IgZWZmaWNpZW5jeS5cbiAgICAvLyBPbWl0dGluZyB0aGUgc2VsZWN0b3IgYmluZHMgdGhlIGV2ZW50IHRvIGB0aGlzLmVsYC5cbiAgICBkZWxlZ2F0ZUV2ZW50czogZnVuY3Rpb24oZXZlbnRzKSB7XG4gICAgICBldmVudHMgfHwgKGV2ZW50cyA9IF8ucmVzdWx0KHRoaXMsICdldmVudHMnKSk7XG4gICAgICBpZiAoIWV2ZW50cykgcmV0dXJuIHRoaXM7XG4gICAgICB0aGlzLnVuZGVsZWdhdGVFdmVudHMoKTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBldmVudHMpIHtcbiAgICAgICAgdmFyIG1ldGhvZCA9IGV2ZW50c1trZXldO1xuICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihtZXRob2QpKSBtZXRob2QgPSB0aGlzW21ldGhvZF07XG4gICAgICAgIGlmICghbWV0aG9kKSBjb250aW51ZTtcbiAgICAgICAgdmFyIG1hdGNoID0ga2V5Lm1hdGNoKGRlbGVnYXRlRXZlbnRTcGxpdHRlcik7XG4gICAgICAgIHRoaXMuZGVsZWdhdGUobWF0Y2hbMV0sIG1hdGNoWzJdLCBtZXRob2QuYmluZCh0aGlzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gQWRkIGEgc2luZ2xlIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSB2aWV3J3MgZWxlbWVudCAob3IgYSBjaGlsZCBlbGVtZW50XG4gICAgLy8gdXNpbmcgYHNlbGVjdG9yYCkuIFRoaXMgb25seSB3b3JrcyBmb3IgZGVsZWdhdGUtYWJsZSBldmVudHM6IG5vdCBgZm9jdXNgLFxuICAgIC8vIGBibHVyYCwgYW5kIG5vdCBgY2hhbmdlYCwgYHN1Ym1pdGAsIGFuZCBgcmVzZXRgIGluIEludGVybmV0IEV4cGxvcmVyLlxuICAgIGRlbGVnYXRlOiBmdW5jdGlvbihldmVudE5hbWUsIHNlbGVjdG9yLCBsaXN0ZW5lcikge1xuICAgICAgdGhpcy4kZWwub24oZXZlbnROYW1lICsgJy5kZWxlZ2F0ZUV2ZW50cycgKyB0aGlzLmNpZCwgc2VsZWN0b3IsIGxpc3RlbmVyKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBDbGVhcnMgYWxsIGNhbGxiYWNrcyBwcmV2aW91c2x5IGJvdW5kIHRvIHRoZSB2aWV3IGJ5IGBkZWxlZ2F0ZUV2ZW50c2AuXG4gICAgLy8gWW91IHVzdWFsbHkgZG9uJ3QgbmVlZCB0byB1c2UgdGhpcywgYnV0IG1heSB3aXNoIHRvIGlmIHlvdSBoYXZlIG11bHRpcGxlXG4gICAgLy8gQmFja2JvbmUgdmlld3MgYXR0YWNoZWQgdG8gdGhlIHNhbWUgRE9NIGVsZW1lbnQuXG4gICAgdW5kZWxlZ2F0ZUV2ZW50czogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy4kZWwpIHRoaXMuJGVsLm9mZignLmRlbGVnYXRlRXZlbnRzJyArIHRoaXMuY2lkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBBIGZpbmVyLWdyYWluZWQgYHVuZGVsZWdhdGVFdmVudHNgIGZvciByZW1vdmluZyBhIHNpbmdsZSBkZWxlZ2F0ZWQgZXZlbnQuXG4gICAgLy8gYHNlbGVjdG9yYCBhbmQgYGxpc3RlbmVyYCBhcmUgYm90aCBvcHRpb25hbC5cbiAgICB1bmRlbGVnYXRlOiBmdW5jdGlvbihldmVudE5hbWUsIHNlbGVjdG9yLCBsaXN0ZW5lcikge1xuICAgICAgdGhpcy4kZWwub2ZmKGV2ZW50TmFtZSArICcuZGVsZWdhdGVFdmVudHMnICsgdGhpcy5jaWQsIHNlbGVjdG9yLCBsaXN0ZW5lcik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gUHJvZHVjZXMgYSBET00gZWxlbWVudCB0byBiZSBhc3NpZ25lZCB0byB5b3VyIHZpZXcuIEV4cG9zZWQgZm9yXG4gICAgLy8gc3ViY2xhc3NlcyB1c2luZyBhbiBhbHRlcm5hdGl2ZSBET00gbWFuaXB1bGF0aW9uIEFQSS5cbiAgICBfY3JlYXRlRWxlbWVudDogZnVuY3Rpb24odGFnTmFtZSkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgfSxcblxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBWaWV3IGhhcyBhIERPTSBlbGVtZW50IHRvIHJlbmRlciBpbnRvLlxuICAgIC8vIElmIGB0aGlzLmVsYCBpcyBhIHN0cmluZywgcGFzcyBpdCB0aHJvdWdoIGAkKClgLCB0YWtlIHRoZSBmaXJzdFxuICAgIC8vIG1hdGNoaW5nIGVsZW1lbnQsIGFuZCByZS1hc3NpZ24gaXQgdG8gYGVsYC4gT3RoZXJ3aXNlLCBjcmVhdGVcbiAgICAvLyBhbiBlbGVtZW50IGZyb20gdGhlIGBpZGAsIGBjbGFzc05hbWVgIGFuZCBgdGFnTmFtZWAgcHJvcGVydGllcy5cbiAgICBfZW5zdXJlRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMuZWwpIHtcbiAgICAgICAgdmFyIGF0dHJzID0gXy5leHRlbmQoe30sIF8ucmVzdWx0KHRoaXMsICdhdHRyaWJ1dGVzJykpO1xuICAgICAgICBpZiAodGhpcy5pZCkgYXR0cnMuaWQgPSBfLnJlc3VsdCh0aGlzLCAnaWQnKTtcbiAgICAgICAgaWYgKHRoaXMuY2xhc3NOYW1lKSBhdHRyc1snY2xhc3MnXSA9IF8ucmVzdWx0KHRoaXMsICdjbGFzc05hbWUnKTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50KHRoaXMuX2NyZWF0ZUVsZW1lbnQoXy5yZXN1bHQodGhpcywgJ3RhZ05hbWUnKSkpO1xuICAgICAgICB0aGlzLl9zZXRBdHRyaWJ1dGVzKGF0dHJzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudChfLnJlc3VsdCh0aGlzLCAnZWwnKSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFNldCBhdHRyaWJ1dGVzIGZyb20gYSBoYXNoIG9uIHRoaXMgdmlldydzIGVsZW1lbnQuICBFeHBvc2VkIGZvclxuICAgIC8vIHN1YmNsYXNzZXMgdXNpbmcgYW4gYWx0ZXJuYXRpdmUgRE9NIG1hbmlwdWxhdGlvbiBBUEkuXG4gICAgX3NldEF0dHJpYnV0ZXM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMpIHtcbiAgICAgIHRoaXMuJGVsLmF0dHIoYXR0cmlidXRlcyk7XG4gICAgfVxuXG4gIH0pO1xuXG4gIC8vIFByb3h5IEJhY2tib25lIGNsYXNzIG1ldGhvZHMgdG8gVW5kZXJzY29yZSBmdW5jdGlvbnMsIHdyYXBwaW5nIHRoZSBtb2RlbCdzXG4gIC8vIGBhdHRyaWJ1dGVzYCBvYmplY3Qgb3IgY29sbGVjdGlvbidzIGBtb2RlbHNgIGFycmF5IGJlaGluZCB0aGUgc2NlbmVzLlxuICAvL1xuICAvLyBjb2xsZWN0aW9uLmZpbHRlcihmdW5jdGlvbihtb2RlbCkgeyByZXR1cm4gbW9kZWwuZ2V0KCdhZ2UnKSA+IDEwIH0pO1xuICAvLyBjb2xsZWN0aW9uLmVhY2godGhpcy5hZGRWaWV3KTtcbiAgLy9cbiAgLy8gYEZ1bmN0aW9uI2FwcGx5YCBjYW4gYmUgc2xvdyBzbyB3ZSB1c2UgdGhlIG1ldGhvZCdzIGFyZyBjb3VudCwgaWYgd2Uga25vdyBpdC5cbiAgdmFyIGFkZE1ldGhvZCA9IGZ1bmN0aW9uKGJhc2UsIGxlbmd0aCwgbWV0aG9kLCBhdHRyaWJ1dGUpIHtcbiAgICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBiYXNlW21ldGhvZF0odGhpc1thdHRyaWJ1dGVdKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gYmFzZVttZXRob2RdKHRoaXNbYXR0cmlidXRlXSwgdmFsdWUpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBiYXNlW21ldGhvZF0odGhpc1thdHRyaWJ1dGVdLCBjYihpdGVyYXRlZSwgdGhpcyksIGNvbnRleHQpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGl0ZXJhdGVlLCBkZWZhdWx0VmFsLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBiYXNlW21ldGhvZF0odGhpc1thdHRyaWJ1dGVdLCBjYihpdGVyYXRlZSwgdGhpcyksIGRlZmF1bHRWYWwsIGNvbnRleHQpO1xuICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIGFyZ3MudW5zaGlmdCh0aGlzW2F0dHJpYnV0ZV0pO1xuICAgICAgICByZXR1cm4gYmFzZVttZXRob2RdLmFwcGx5KGJhc2UsIGFyZ3MpO1xuICAgICAgfTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGFkZFVuZGVyc2NvcmVNZXRob2RzID0gZnVuY3Rpb24oQ2xhc3MsIGJhc2UsIG1ldGhvZHMsIGF0dHJpYnV0ZSkge1xuICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihsZW5ndGgsIG1ldGhvZCkge1xuICAgICAgaWYgKGJhc2VbbWV0aG9kXSkgQ2xhc3MucHJvdG90eXBlW21ldGhvZF0gPSBhZGRNZXRob2QoYmFzZSwgbGVuZ3RoLCBtZXRob2QsIGF0dHJpYnV0ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gU3VwcG9ydCBgY29sbGVjdGlvbi5zb3J0QnkoJ2F0dHInKWAgYW5kIGBjb2xsZWN0aW9uLmZpbmRXaGVyZSh7aWQ6IDF9KWAuXG4gIHZhciBjYiA9IGZ1bmN0aW9uKGl0ZXJhdGVlLCBpbnN0YW5jZSkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXRlcmF0ZWUpKSByZXR1cm4gaXRlcmF0ZWU7XG4gICAgaWYgKF8uaXNPYmplY3QoaXRlcmF0ZWUpICYmICFpbnN0YW5jZS5faXNNb2RlbChpdGVyYXRlZSkpIHJldHVybiBtb2RlbE1hdGNoZXIoaXRlcmF0ZWUpO1xuICAgIGlmIChfLmlzU3RyaW5nKGl0ZXJhdGVlKSkgcmV0dXJuIGZ1bmN0aW9uKG1vZGVsKSB7IHJldHVybiBtb2RlbC5nZXQoaXRlcmF0ZWUpOyB9O1xuICAgIHJldHVybiBpdGVyYXRlZTtcbiAgfTtcbiAgdmFyIG1vZGVsTWF0Y2hlciA9IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgdmFyIG1hdGNoZXIgPSBfLm1hdGNoZXMoYXR0cnMpO1xuICAgIHJldHVybiBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgcmV0dXJuIG1hdGNoZXIobW9kZWwuYXR0cmlidXRlcyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBVbmRlcnNjb3JlIG1ldGhvZHMgdGhhdCB3ZSB3YW50IHRvIGltcGxlbWVudCBvbiB0aGUgQ29sbGVjdGlvbi5cbiAgLy8gOTAlIG9mIHRoZSBjb3JlIHVzZWZ1bG5lc3Mgb2YgQmFja2JvbmUgQ29sbGVjdGlvbnMgaXMgYWN0dWFsbHkgaW1wbGVtZW50ZWRcbiAgLy8gcmlnaHQgaGVyZTpcbiAgdmFyIGNvbGxlY3Rpb25NZXRob2RzID0ge2ZvckVhY2g6IDMsIGVhY2g6IDMsIG1hcDogMywgY29sbGVjdDogMywgcmVkdWNlOiAwLFxuICAgIGZvbGRsOiAwLCBpbmplY3Q6IDAsIHJlZHVjZVJpZ2h0OiAwLCBmb2xkcjogMCwgZmluZDogMywgZGV0ZWN0OiAzLCBmaWx0ZXI6IDMsXG4gICAgc2VsZWN0OiAzLCByZWplY3Q6IDMsIGV2ZXJ5OiAzLCBhbGw6IDMsIHNvbWU6IDMsIGFueTogMywgaW5jbHVkZTogMywgaW5jbHVkZXM6IDMsXG4gICAgY29udGFpbnM6IDMsIGludm9rZTogMCwgbWF4OiAzLCBtaW46IDMsIHRvQXJyYXk6IDEsIHNpemU6IDEsIGZpcnN0OiAzLFxuICAgIGhlYWQ6IDMsIHRha2U6IDMsIGluaXRpYWw6IDMsIHJlc3Q6IDMsIHRhaWw6IDMsIGRyb3A6IDMsIGxhc3Q6IDMsXG4gICAgd2l0aG91dDogMCwgZGlmZmVyZW5jZTogMCwgaW5kZXhPZjogMywgc2h1ZmZsZTogMSwgbGFzdEluZGV4T2Y6IDMsXG4gICAgaXNFbXB0eTogMSwgY2hhaW46IDEsIHNhbXBsZTogMywgcGFydGl0aW9uOiAzLCBncm91cEJ5OiAzLCBjb3VudEJ5OiAzLFxuICAgIHNvcnRCeTogMywgaW5kZXhCeTogMywgZmluZEluZGV4OiAzLCBmaW5kTGFzdEluZGV4OiAzfTtcblxuXG4gIC8vIFVuZGVyc2NvcmUgbWV0aG9kcyB0aGF0IHdlIHdhbnQgdG8gaW1wbGVtZW50IG9uIHRoZSBNb2RlbCwgbWFwcGVkIHRvIHRoZVxuICAvLyBudW1iZXIgb2YgYXJndW1lbnRzIHRoZXkgdGFrZS5cbiAgdmFyIG1vZGVsTWV0aG9kcyA9IHtrZXlzOiAxLCB2YWx1ZXM6IDEsIHBhaXJzOiAxLCBpbnZlcnQ6IDEsIHBpY2s6IDAsXG4gICAgb21pdDogMCwgY2hhaW46IDEsIGlzRW1wdHk6IDF9O1xuXG4gIC8vIE1peCBpbiBlYWNoIFVuZGVyc2NvcmUgbWV0aG9kIGFzIGEgcHJveHkgdG8gYENvbGxlY3Rpb24jbW9kZWxzYC5cblxuICBfLmVhY2goW1xuICAgIFtDb2xsZWN0aW9uLCBjb2xsZWN0aW9uTWV0aG9kcywgJ21vZGVscyddLFxuICAgIFtNb2RlbCwgbW9kZWxNZXRob2RzLCAnYXR0cmlidXRlcyddXG4gIF0sIGZ1bmN0aW9uKGNvbmZpZykge1xuICAgIHZhciBCYXNlID0gY29uZmlnWzBdLFxuICAgICAgICBtZXRob2RzID0gY29uZmlnWzFdLFxuICAgICAgICBhdHRyaWJ1dGUgPSBjb25maWdbMl07XG5cbiAgICBCYXNlLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgbWFwcGluZ3MgPSBfLnJlZHVjZShfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihtZW1vLCBuYW1lKSB7XG4gICAgICAgIG1lbW9bbmFtZV0gPSAwO1xuICAgICAgICByZXR1cm4gbWVtbztcbiAgICAgIH0sIHt9KTtcbiAgICAgIGFkZFVuZGVyc2NvcmVNZXRob2RzKEJhc2UsIG9iaiwgbWFwcGluZ3MsIGF0dHJpYnV0ZSk7XG4gICAgfTtcblxuICAgIGFkZFVuZGVyc2NvcmVNZXRob2RzKEJhc2UsIF8sIG1ldGhvZHMsIGF0dHJpYnV0ZSk7XG4gIH0pO1xuXG4gIC8vIEJhY2tib25lLnN5bmNcbiAgLy8gLS0tLS0tLS0tLS0tLVxuXG4gIC8vIE92ZXJyaWRlIHRoaXMgZnVuY3Rpb24gdG8gY2hhbmdlIHRoZSBtYW5uZXIgaW4gd2hpY2ggQmFja2JvbmUgcGVyc2lzdHNcbiAgLy8gbW9kZWxzIHRvIHRoZSBzZXJ2ZXIuIFlvdSB3aWxsIGJlIHBhc3NlZCB0aGUgdHlwZSBvZiByZXF1ZXN0LCBhbmQgdGhlXG4gIC8vIG1vZGVsIGluIHF1ZXN0aW9uLiBCeSBkZWZhdWx0LCBtYWtlcyBhIFJFU1RmdWwgQWpheCByZXF1ZXN0XG4gIC8vIHRvIHRoZSBtb2RlbCdzIGB1cmwoKWAuIFNvbWUgcG9zc2libGUgY3VzdG9taXphdGlvbnMgY291bGQgYmU6XG4gIC8vXG4gIC8vICogVXNlIGBzZXRUaW1lb3V0YCB0byBiYXRjaCByYXBpZC1maXJlIHVwZGF0ZXMgaW50byBhIHNpbmdsZSByZXF1ZXN0LlxuICAvLyAqIFNlbmQgdXAgdGhlIG1vZGVscyBhcyBYTUwgaW5zdGVhZCBvZiBKU09OLlxuICAvLyAqIFBlcnNpc3QgbW9kZWxzIHZpYSBXZWJTb2NrZXRzIGluc3RlYWQgb2YgQWpheC5cbiAgLy9cbiAgLy8gVHVybiBvbiBgQmFja2JvbmUuZW11bGF0ZUhUVFBgIGluIG9yZGVyIHRvIHNlbmQgYFBVVGAgYW5kIGBERUxFVEVgIHJlcXVlc3RzXG4gIC8vIGFzIGBQT1NUYCwgd2l0aCBhIGBfbWV0aG9kYCBwYXJhbWV0ZXIgY29udGFpbmluZyB0aGUgdHJ1ZSBIVFRQIG1ldGhvZCxcbiAgLy8gYXMgd2VsbCBhcyBhbGwgcmVxdWVzdHMgd2l0aCB0aGUgYm9keSBhcyBgYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkYFxuICAvLyBpbnN0ZWFkIG9mIGBhcHBsaWNhdGlvbi9qc29uYCB3aXRoIHRoZSBtb2RlbCBpbiBhIHBhcmFtIG5hbWVkIGBtb2RlbGAuXG4gIC8vIFVzZWZ1bCB3aGVuIGludGVyZmFjaW5nIHdpdGggc2VydmVyLXNpZGUgbGFuZ3VhZ2VzIGxpa2UgKipQSFAqKiB0aGF0IG1ha2VcbiAgLy8gaXQgZGlmZmljdWx0IHRvIHJlYWQgdGhlIGJvZHkgb2YgYFBVVGAgcmVxdWVzdHMuXG4gIEJhY2tib25lLnN5bmMgPSBmdW5jdGlvbihtZXRob2QsIG1vZGVsLCBvcHRpb25zKSB7XG4gICAgdmFyIHR5cGUgPSBtZXRob2RNYXBbbWV0aG9kXTtcblxuICAgIC8vIERlZmF1bHQgb3B0aW9ucywgdW5sZXNzIHNwZWNpZmllZC5cbiAgICBfLmRlZmF1bHRzKG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSksIHtcbiAgICAgIGVtdWxhdGVIVFRQOiBCYWNrYm9uZS5lbXVsYXRlSFRUUCxcbiAgICAgIGVtdWxhdGVKU09OOiBCYWNrYm9uZS5lbXVsYXRlSlNPTlxuICAgIH0pO1xuXG4gICAgLy8gRGVmYXVsdCBKU09OLXJlcXVlc3Qgb3B0aW9ucy5cbiAgICB2YXIgcGFyYW1zID0ge3R5cGU6IHR5cGUsIGRhdGFUeXBlOiAnanNvbid9O1xuXG4gICAgLy8gRW5zdXJlIHRoYXQgd2UgaGF2ZSBhIFVSTC5cbiAgICBpZiAoIW9wdGlvbnMudXJsKSB7XG4gICAgICBwYXJhbXMudXJsID0gXy5yZXN1bHQobW9kZWwsICd1cmwnKSB8fCB1cmxFcnJvcigpO1xuICAgIH1cblxuICAgIC8vIEVuc3VyZSB0aGF0IHdlIGhhdmUgdGhlIGFwcHJvcHJpYXRlIHJlcXVlc3QgZGF0YS5cbiAgICBpZiAob3B0aW9ucy5kYXRhID09IG51bGwgJiYgbW9kZWwgJiYgKG1ldGhvZCA9PT0gJ2NyZWF0ZScgfHwgbWV0aG9kID09PSAndXBkYXRlJyB8fCBtZXRob2QgPT09ICdwYXRjaCcpKSB7XG4gICAgICBwYXJhbXMuY29udGVudFR5cGUgPSAnYXBwbGljYXRpb24vanNvbic7XG4gICAgICBwYXJhbXMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuYXR0cnMgfHwgbW9kZWwudG9KU09OKG9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICAvLyBGb3Igb2xkZXIgc2VydmVycywgZW11bGF0ZSBKU09OIGJ5IGVuY29kaW5nIHRoZSByZXF1ZXN0IGludG8gYW4gSFRNTC1mb3JtLlxuICAgIGlmIChvcHRpb25zLmVtdWxhdGVKU09OKSB7XG4gICAgICBwYXJhbXMuY29udGVudFR5cGUgPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJztcbiAgICAgIHBhcmFtcy5kYXRhID0gcGFyYW1zLmRhdGEgPyB7bW9kZWw6IHBhcmFtcy5kYXRhfSA6IHt9O1xuICAgIH1cblxuICAgIC8vIEZvciBvbGRlciBzZXJ2ZXJzLCBlbXVsYXRlIEhUVFAgYnkgbWltaWNraW5nIHRoZSBIVFRQIG1ldGhvZCB3aXRoIGBfbWV0aG9kYFxuICAgIC8vIEFuZCBhbiBgWC1IVFRQLU1ldGhvZC1PdmVycmlkZWAgaGVhZGVyLlxuICAgIGlmIChvcHRpb25zLmVtdWxhdGVIVFRQICYmICh0eXBlID09PSAnUFVUJyB8fCB0eXBlID09PSAnREVMRVRFJyB8fCB0eXBlID09PSAnUEFUQ0gnKSkge1xuICAgICAgcGFyYW1zLnR5cGUgPSAnUE9TVCc7XG4gICAgICBpZiAob3B0aW9ucy5lbXVsYXRlSlNPTikgcGFyYW1zLmRhdGEuX21ldGhvZCA9IHR5cGU7XG4gICAgICB2YXIgYmVmb3JlU2VuZCA9IG9wdGlvbnMuYmVmb3JlU2VuZDtcbiAgICAgIG9wdGlvbnMuYmVmb3JlU2VuZCA9IGZ1bmN0aW9uKHhocikge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignWC1IVFRQLU1ldGhvZC1PdmVycmlkZScsIHR5cGUpO1xuICAgICAgICBpZiAoYmVmb3JlU2VuZCkgcmV0dXJuIGJlZm9yZVNlbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRG9uJ3QgcHJvY2VzcyBkYXRhIG9uIGEgbm9uLUdFVCByZXF1ZXN0LlxuICAgIGlmIChwYXJhbXMudHlwZSAhPT0gJ0dFVCcgJiYgIW9wdGlvbnMuZW11bGF0ZUpTT04pIHtcbiAgICAgIHBhcmFtcy5wcm9jZXNzRGF0YSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFBhc3MgYWxvbmcgYHRleHRTdGF0dXNgIGFuZCBgZXJyb3JUaHJvd25gIGZyb20galF1ZXJ5LlxuICAgIHZhciBlcnJvciA9IG9wdGlvbnMuZXJyb3I7XG4gICAgb3B0aW9ucy5lcnJvciA9IGZ1bmN0aW9uKHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgIG9wdGlvbnMudGV4dFN0YXR1cyA9IHRleHRTdGF0dXM7XG4gICAgICBvcHRpb25zLmVycm9yVGhyb3duID0gZXJyb3JUaHJvd247XG4gICAgICBpZiAoZXJyb3IpIGVycm9yLmNhbGwob3B0aW9ucy5jb250ZXh0LCB4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKTtcbiAgICB9O1xuXG4gICAgLy8gTWFrZSB0aGUgcmVxdWVzdCwgYWxsb3dpbmcgdGhlIHVzZXIgdG8gb3ZlcnJpZGUgYW55IEFqYXggb3B0aW9ucy5cbiAgICB2YXIgeGhyID0gb3B0aW9ucy54aHIgPSBCYWNrYm9uZS5hamF4KF8uZXh0ZW5kKHBhcmFtcywgb3B0aW9ucykpO1xuICAgIG1vZGVsLnRyaWdnZXIoJ3JlcXVlc3QnLCBtb2RlbCwgeGhyLCBvcHRpb25zKTtcbiAgICByZXR1cm4geGhyO1xuICB9O1xuXG4gIC8vIE1hcCBmcm9tIENSVUQgdG8gSFRUUCBmb3Igb3VyIGRlZmF1bHQgYEJhY2tib25lLnN5bmNgIGltcGxlbWVudGF0aW9uLlxuICB2YXIgbWV0aG9kTWFwID0ge1xuICAgIGNyZWF0ZTogJ1BPU1QnLFxuICAgIHVwZGF0ZTogJ1BVVCcsXG4gICAgcGF0Y2g6ICdQQVRDSCcsXG4gICAgZGVsZXRlOiAnREVMRVRFJyxcbiAgICByZWFkOiAnR0VUJ1xuICB9O1xuXG4gIC8vIFNldCB0aGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBgQmFja2JvbmUuYWpheGAgdG8gcHJveHkgdGhyb3VnaCB0byBgJGAuXG4gIC8vIE92ZXJyaWRlIHRoaXMgaWYgeW91J2QgbGlrZSB0byB1c2UgYSBkaWZmZXJlbnQgbGlicmFyeS5cbiAgQmFja2JvbmUuYWpheCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBCYWNrYm9uZS4kLmFqYXguYXBwbHkoQmFja2JvbmUuJCwgYXJndW1lbnRzKTtcbiAgfTtcblxuICAvLyBCYWNrYm9uZS5Sb3V0ZXJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUm91dGVycyBtYXAgZmF1eC1VUkxzIHRvIGFjdGlvbnMsIGFuZCBmaXJlIGV2ZW50cyB3aGVuIHJvdXRlcyBhcmVcbiAgLy8gbWF0Y2hlZC4gQ3JlYXRpbmcgYSBuZXcgb25lIHNldHMgaXRzIGByb3V0ZXNgIGhhc2gsIGlmIG5vdCBzZXQgc3RhdGljYWxseS5cbiAgdmFyIFJvdXRlciA9IEJhY2tib25lLlJvdXRlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuICAgIHRoaXMucHJlaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChvcHRpb25zLnJvdXRlcykgdGhpcy5yb3V0ZXMgPSBvcHRpb25zLnJvdXRlcztcbiAgICB0aGlzLl9iaW5kUm91dGVzKCk7XG4gICAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgLy8gQ2FjaGVkIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIG1hdGNoaW5nIG5hbWVkIHBhcmFtIHBhcnRzIGFuZCBzcGxhdHRlZFxuICAvLyBwYXJ0cyBvZiByb3V0ZSBzdHJpbmdzLlxuICB2YXIgb3B0aW9uYWxQYXJhbSA9IC9cXCgoLio/KVxcKS9nO1xuICB2YXIgbmFtZWRQYXJhbSAgICA9IC8oXFwoXFw/KT86XFx3Ky9nO1xuICB2YXIgc3BsYXRQYXJhbSAgICA9IC9cXCpcXHcrL2c7XG4gIHZhciBlc2NhcGVSZWdFeHAgID0gL1tcXC17fVxcW1xcXSs/LixcXFxcXFxeJHwjXFxzXS9nO1xuXG4gIC8vIFNldCB1cCBhbGwgaW5oZXJpdGFibGUgKipCYWNrYm9uZS5Sb3V0ZXIqKiBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLlxuICBfLmV4dGVuZChSb3V0ZXIucHJvdG90eXBlLCBFdmVudHMsIHtcblxuICAgIC8vIHByZWluaXRpYWxpemUgaXMgYW4gZW1wdHkgZnVuY3Rpb24gYnkgZGVmYXVsdC4gWW91IGNhbiBvdmVycmlkZSBpdCB3aXRoIGEgZnVuY3Rpb25cbiAgICAvLyBvciBvYmplY3QuICBwcmVpbml0aWFsaXplIHdpbGwgcnVuIGJlZm9yZSBhbnkgaW5zdGFudGlhdGlvbiBsb2dpYyBpcyBydW4gaW4gdGhlIFJvdXRlci5cbiAgICBwcmVpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cbiAgICAvLyBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cbiAgICAvLyBpbml0aWFsaXphdGlvbiBsb2dpYy5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cbiAgICAvLyBNYW51YWxseSBiaW5kIGEgc2luZ2xlIG5hbWVkIHJvdXRlIHRvIGEgY2FsbGJhY2suIEZvciBleGFtcGxlOlxuICAgIC8vXG4gICAgLy8gICAgIHRoaXMucm91dGUoJ3NlYXJjaC86cXVlcnkvcDpudW0nLCAnc2VhcmNoJywgZnVuY3Rpb24ocXVlcnksIG51bSkge1xuICAgIC8vICAgICAgIC4uLlxuICAgIC8vICAgICB9KTtcbiAgICAvL1xuICAgIHJvdXRlOiBmdW5jdGlvbihyb3V0ZSwgbmFtZSwgY2FsbGJhY2spIHtcbiAgICAgIGlmICghXy5pc1JlZ0V4cChyb3V0ZSkpIHJvdXRlID0gdGhpcy5fcm91dGVUb1JlZ0V4cChyb3V0ZSk7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG5hbWUpKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmFtZTtcbiAgICAgICAgbmFtZSA9ICcnO1xuICAgICAgfVxuICAgICAgaWYgKCFjYWxsYmFjaykgY2FsbGJhY2sgPSB0aGlzW25hbWVdO1xuICAgICAgdmFyIHJvdXRlciA9IHRoaXM7XG4gICAgICBCYWNrYm9uZS5oaXN0b3J5LnJvdXRlKHJvdXRlLCBmdW5jdGlvbihmcmFnbWVudCkge1xuICAgICAgICB2YXIgYXJncyA9IHJvdXRlci5fZXh0cmFjdFBhcmFtZXRlcnMocm91dGUsIGZyYWdtZW50KTtcbiAgICAgICAgaWYgKHJvdXRlci5leGVjdXRlKGNhbGxiYWNrLCBhcmdzLCBuYW1lKSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICByb3V0ZXIudHJpZ2dlci5hcHBseShyb3V0ZXIsIFsncm91dGU6JyArIG5hbWVdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgcm91dGVyLnRyaWdnZXIoJ3JvdXRlJywgbmFtZSwgYXJncyk7XG4gICAgICAgICAgQmFja2JvbmUuaGlzdG9yeS50cmlnZ2VyKCdyb3V0ZScsIHJvdXRlciwgbmFtZSwgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIEV4ZWN1dGUgYSByb3V0ZSBoYW5kbGVyIHdpdGggdGhlIHByb3ZpZGVkIHBhcmFtZXRlcnMuICBUaGlzIGlzIGFuXG4gICAgLy8gZXhjZWxsZW50IHBsYWNlIHRvIGRvIHByZS1yb3V0ZSBzZXR1cCBvciBwb3N0LXJvdXRlIGNsZWFudXAuXG4gICAgZXhlY3V0ZTogZnVuY3Rpb24oY2FsbGJhY2ssIGFyZ3MsIG5hbWUpIHtcbiAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSxcblxuICAgIC8vIFNpbXBsZSBwcm94eSB0byBgQmFja2JvbmUuaGlzdG9yeWAgdG8gc2F2ZSBhIGZyYWdtZW50IGludG8gdGhlIGhpc3RvcnkuXG4gICAgbmF2aWdhdGU6IGZ1bmN0aW9uKGZyYWdtZW50LCBvcHRpb25zKSB7XG4gICAgICBCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKGZyYWdtZW50LCBvcHRpb25zKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBCaW5kIGFsbCBkZWZpbmVkIHJvdXRlcyB0byBgQmFja2JvbmUuaGlzdG9yeWAuIFdlIGhhdmUgdG8gcmV2ZXJzZSB0aGVcbiAgICAvLyBvcmRlciBvZiB0aGUgcm91dGVzIGhlcmUgdG8gc3VwcG9ydCBiZWhhdmlvciB3aGVyZSB0aGUgbW9zdCBnZW5lcmFsXG4gICAgLy8gcm91dGVzIGNhbiBiZSBkZWZpbmVkIGF0IHRoZSBib3R0b20gb2YgdGhlIHJvdXRlIG1hcC5cbiAgICBfYmluZFJvdXRlczogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMucm91dGVzKSByZXR1cm47XG4gICAgICB0aGlzLnJvdXRlcyA9IF8ucmVzdWx0KHRoaXMsICdyb3V0ZXMnKTtcbiAgICAgIHZhciByb3V0ZSwgcm91dGVzID0gXy5rZXlzKHRoaXMucm91dGVzKTtcbiAgICAgIHdoaWxlICgocm91dGUgPSByb3V0ZXMucG9wKCkpICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yb3V0ZShyb3V0ZSwgdGhpcy5yb3V0ZXNbcm91dGVdKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIHJvdXRlIHN0cmluZyBpbnRvIGEgcmVndWxhciBleHByZXNzaW9uLCBzdWl0YWJsZSBmb3IgbWF0Y2hpbmdcbiAgICAvLyBhZ2FpbnN0IHRoZSBjdXJyZW50IGxvY2F0aW9uIGhhc2guXG4gICAgX3JvdXRlVG9SZWdFeHA6IGZ1bmN0aW9uKHJvdXRlKSB7XG4gICAgICByb3V0ZSA9IHJvdXRlLnJlcGxhY2UoZXNjYXBlUmVnRXhwLCAnXFxcXCQmJylcbiAgICAgICAgLnJlcGxhY2Uob3B0aW9uYWxQYXJhbSwgJyg/OiQxKT8nKVxuICAgICAgICAucmVwbGFjZShuYW1lZFBhcmFtLCBmdW5jdGlvbihtYXRjaCwgb3B0aW9uYWwpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9uYWwgPyBtYXRjaCA6ICcoW14vP10rKSc7XG4gICAgICAgIH0pXG4gICAgICAgIC5yZXBsYWNlKHNwbGF0UGFyYW0sICcoW14/XSo/KScpO1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJ14nICsgcm91dGUgKyAnKD86XFxcXD8oW1xcXFxzXFxcXFNdKikpPyQnKTtcbiAgICB9LFxuXG4gICAgLy8gR2l2ZW4gYSByb3V0ZSwgYW5kIGEgVVJMIGZyYWdtZW50IHRoYXQgaXQgbWF0Y2hlcywgcmV0dXJuIHRoZSBhcnJheSBvZlxuICAgIC8vIGV4dHJhY3RlZCBkZWNvZGVkIHBhcmFtZXRlcnMuIEVtcHR5IG9yIHVubWF0Y2hlZCBwYXJhbWV0ZXJzIHdpbGwgYmVcbiAgICAvLyB0cmVhdGVkIGFzIGBudWxsYCB0byBub3JtYWxpemUgY3Jvc3MtYnJvd3NlciBiZWhhdmlvci5cbiAgICBfZXh0cmFjdFBhcmFtZXRlcnM6IGZ1bmN0aW9uKHJvdXRlLCBmcmFnbWVudCkge1xuICAgICAgdmFyIHBhcmFtcyA9IHJvdXRlLmV4ZWMoZnJhZ21lbnQpLnNsaWNlKDEpO1xuICAgICAgcmV0dXJuIF8ubWFwKHBhcmFtcywgZnVuY3Rpb24ocGFyYW0sIGkpIHtcbiAgICAgICAgLy8gRG9uJ3QgZGVjb2RlIHRoZSBzZWFyY2ggcGFyYW1zLlxuICAgICAgICBpZiAoaSA9PT0gcGFyYW1zLmxlbmd0aCAtIDEpIHJldHVybiBwYXJhbSB8fCBudWxsO1xuICAgICAgICByZXR1cm4gcGFyYW0gPyBkZWNvZGVVUklDb21wb25lbnQocGFyYW0pIDogbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICB9KTtcblxuICAvLyBCYWNrYm9uZS5IaXN0b3J5XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBIYW5kbGVzIGNyb3NzLWJyb3dzZXIgaGlzdG9yeSBtYW5hZ2VtZW50LCBiYXNlZCBvbiBlaXRoZXJcbiAgLy8gW3B1c2hTdGF0ZV0oaHR0cDovL2RpdmVpbnRvaHRtbDUuaW5mby9oaXN0b3J5Lmh0bWwpIGFuZCByZWFsIFVSTHMsIG9yXG4gIC8vIFtvbmhhc2hjaGFuZ2VdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvRE9NL3dpbmRvdy5vbmhhc2hjaGFuZ2UpXG4gIC8vIGFuZCBVUkwgZnJhZ21lbnRzLiBJZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBuZWl0aGVyIChvbGQgSUUsIG5hdGNoKSxcbiAgLy8gZmFsbHMgYmFjayB0byBwb2xsaW5nLlxuICB2YXIgSGlzdG9yeSA9IEJhY2tib25lLkhpc3RvcnkgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhhbmRsZXJzID0gW107XG4gICAgdGhpcy5jaGVja1VybCA9IHRoaXMuY2hlY2tVcmwuYmluZCh0aGlzKTtcblxuICAgIC8vIEVuc3VyZSB0aGF0IGBIaXN0b3J5YCBjYW4gYmUgdXNlZCBvdXRzaWRlIG9mIHRoZSBicm93c2VyLlxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5sb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgIHRoaXMuaGlzdG9yeSA9IHdpbmRvdy5oaXN0b3J5O1xuICAgIH1cbiAgfTtcblxuICAvLyBDYWNoZWQgcmVnZXggZm9yIHN0cmlwcGluZyBhIGxlYWRpbmcgaGFzaC9zbGFzaCBhbmQgdHJhaWxpbmcgc3BhY2UuXG4gIHZhciByb3V0ZVN0cmlwcGVyID0gL15bI1xcL118XFxzKyQvZztcblxuICAvLyBDYWNoZWQgcmVnZXggZm9yIHN0cmlwcGluZyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzLlxuICB2YXIgcm9vdFN0cmlwcGVyID0gL15cXC8rfFxcLyskL2c7XG5cbiAgLy8gQ2FjaGVkIHJlZ2V4IGZvciBzdHJpcHBpbmcgdXJscyBvZiBoYXNoLlxuICB2YXIgcGF0aFN0cmlwcGVyID0gLyMuKiQvO1xuXG4gIC8vIEhhcyB0aGUgaGlzdG9yeSBoYW5kbGluZyBhbHJlYWR5IGJlZW4gc3RhcnRlZD9cbiAgSGlzdG9yeS5zdGFydGVkID0gZmFsc2U7XG5cbiAgLy8gU2V0IHVwIGFsbCBpbmhlcml0YWJsZSAqKkJhY2tib25lLkhpc3RvcnkqKiBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLlxuICBfLmV4dGVuZChIaXN0b3J5LnByb3RvdHlwZSwgRXZlbnRzLCB7XG5cbiAgICAvLyBUaGUgZGVmYXVsdCBpbnRlcnZhbCB0byBwb2xsIGZvciBoYXNoIGNoYW5nZXMsIGlmIG5lY2Vzc2FyeSwgaXNcbiAgICAvLyB0d2VudHkgdGltZXMgYSBzZWNvbmQuXG4gICAgaW50ZXJ2YWw6IDUwLFxuXG4gICAgLy8gQXJlIHdlIGF0IHRoZSBhcHAgcm9vdD9cbiAgICBhdFJvb3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBhdGggPSB0aGlzLmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1teXFwvXSQvLCAnJCYvJyk7XG4gICAgICByZXR1cm4gcGF0aCA9PT0gdGhpcy5yb290ICYmICF0aGlzLmdldFNlYXJjaCgpO1xuICAgIH0sXG5cbiAgICAvLyBEb2VzIHRoZSBwYXRobmFtZSBtYXRjaCB0aGUgcm9vdD9cbiAgICBtYXRjaFJvb3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBhdGggPSB0aGlzLmRlY29kZUZyYWdtZW50KHRoaXMubG9jYXRpb24ucGF0aG5hbWUpO1xuICAgICAgdmFyIHJvb3RQYXRoID0gcGF0aC5zbGljZSgwLCB0aGlzLnJvb3QubGVuZ3RoIC0gMSkgKyAnLyc7XG4gICAgICByZXR1cm4gcm9vdFBhdGggPT09IHRoaXMucm9vdDtcbiAgICB9LFxuXG4gICAgLy8gVW5pY29kZSBjaGFyYWN0ZXJzIGluIGBsb2NhdGlvbi5wYXRobmFtZWAgYXJlIHBlcmNlbnQgZW5jb2RlZCBzbyB0aGV5J3JlXG4gICAgLy8gZGVjb2RlZCBmb3IgY29tcGFyaXNvbi4gYCUyNWAgc2hvdWxkIG5vdCBiZSBkZWNvZGVkIHNpbmNlIGl0IG1heSBiZSBwYXJ0XG4gICAgLy8gb2YgYW4gZW5jb2RlZCBwYXJhbWV0ZXIuXG4gICAgZGVjb2RlRnJhZ21lbnQ6IGZ1bmN0aW9uKGZyYWdtZW50KSB7XG4gICAgICByZXR1cm4gZGVjb2RlVVJJKGZyYWdtZW50LnJlcGxhY2UoLyUyNS9nLCAnJTI1MjUnKSk7XG4gICAgfSxcblxuICAgIC8vIEluIElFNiwgdGhlIGhhc2ggZnJhZ21lbnQgYW5kIHNlYXJjaCBwYXJhbXMgYXJlIGluY29ycmVjdCBpZiB0aGVcbiAgICAvLyBmcmFnbWVudCBjb250YWlucyBgP2AuXG4gICAgZ2V0U2VhcmNoOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtYXRjaCA9IHRoaXMubG9jYXRpb24uaHJlZi5yZXBsYWNlKC8jLiovLCAnJykubWF0Y2goL1xcPy4rLyk7XG4gICAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFswXSA6ICcnO1xuICAgIH0sXG5cbiAgICAvLyBHZXRzIHRoZSB0cnVlIGhhc2ggdmFsdWUuIENhbm5vdCB1c2UgbG9jYXRpb24uaGFzaCBkaXJlY3RseSBkdWUgdG8gYnVnXG4gICAgLy8gaW4gRmlyZWZveCB3aGVyZSBsb2NhdGlvbi5oYXNoIHdpbGwgYWx3YXlzIGJlIGRlY29kZWQuXG4gICAgZ2V0SGFzaDogZnVuY3Rpb24od2luZG93KSB7XG4gICAgICB2YXIgbWF0Y2ggPSAod2luZG93IHx8IHRoaXMpLmxvY2F0aW9uLmhyZWYubWF0Y2goLyMoLiopJC8pO1xuICAgICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiAnJztcbiAgICB9LFxuXG4gICAgLy8gR2V0IHRoZSBwYXRobmFtZSBhbmQgc2VhcmNoIHBhcmFtcywgd2l0aG91dCB0aGUgcm9vdC5cbiAgICBnZXRQYXRoOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwYXRoID0gdGhpcy5kZWNvZGVGcmFnbWVudChcbiAgICAgICAgdGhpcy5sb2NhdGlvbi5wYXRobmFtZSArIHRoaXMuZ2V0U2VhcmNoKClcbiAgICAgICkuc2xpY2UodGhpcy5yb290Lmxlbmd0aCAtIDEpO1xuICAgICAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLycgPyBwYXRoLnNsaWNlKDEpIDogcGF0aDtcbiAgICB9LFxuXG4gICAgLy8gR2V0IHRoZSBjcm9zcy1icm93c2VyIG5vcm1hbGl6ZWQgVVJMIGZyYWdtZW50IGZyb20gdGhlIHBhdGggb3IgaGFzaC5cbiAgICBnZXRGcmFnbWVudDogZnVuY3Rpb24oZnJhZ21lbnQpIHtcbiAgICAgIGlmIChmcmFnbWVudCA9PSBudWxsKSB7XG4gICAgICAgIGlmICh0aGlzLl91c2VQdXNoU3RhdGUgfHwgIXRoaXMuX3dhbnRzSGFzaENoYW5nZSkge1xuICAgICAgICAgIGZyYWdtZW50ID0gdGhpcy5nZXRQYXRoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnJhZ21lbnQgPSB0aGlzLmdldEhhc2goKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyYWdtZW50LnJlcGxhY2Uocm91dGVTdHJpcHBlciwgJycpO1xuICAgIH0sXG5cbiAgICAvLyBTdGFydCB0aGUgaGFzaCBjaGFuZ2UgaGFuZGxpbmcsIHJldHVybmluZyBgdHJ1ZWAgaWYgdGhlIGN1cnJlbnQgVVJMIG1hdGNoZXNcbiAgICAvLyBhbiBleGlzdGluZyByb3V0ZSwgYW5kIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgIHN0YXJ0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBpZiAoSGlzdG9yeS5zdGFydGVkKSB0aHJvdyBuZXcgRXJyb3IoJ0JhY2tib25lLmhpc3RvcnkgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkJyk7XG4gICAgICBIaXN0b3J5LnN0YXJ0ZWQgPSB0cnVlO1xuXG4gICAgICAvLyBGaWd1cmUgb3V0IHRoZSBpbml0aWFsIGNvbmZpZ3VyYXRpb24uIERvIHdlIG5lZWQgYW4gaWZyYW1lP1xuICAgICAgLy8gSXMgcHVzaFN0YXRlIGRlc2lyZWQgLi4uIGlzIGl0IGF2YWlsYWJsZT9cbiAgICAgIHRoaXMub3B0aW9ucyAgICAgICAgICA9IF8uZXh0ZW5kKHtyb290OiAnLyd9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5yb290ICAgICAgICAgICAgID0gdGhpcy5vcHRpb25zLnJvb3Q7XG4gICAgICB0aGlzLl93YW50c0hhc2hDaGFuZ2UgPSB0aGlzLm9wdGlvbnMuaGFzaENoYW5nZSAhPT0gZmFsc2U7XG4gICAgICB0aGlzLl9oYXNIYXNoQ2hhbmdlICAgPSAnb25oYXNoY2hhbmdlJyBpbiB3aW5kb3cgJiYgKGRvY3VtZW50LmRvY3VtZW50TW9kZSA9PT0gdm9pZCAwIHx8IGRvY3VtZW50LmRvY3VtZW50TW9kZSA+IDcpO1xuICAgICAgdGhpcy5fdXNlSGFzaENoYW5nZSAgID0gdGhpcy5fd2FudHNIYXNoQ2hhbmdlICYmIHRoaXMuX2hhc0hhc2hDaGFuZ2U7XG4gICAgICB0aGlzLl93YW50c1B1c2hTdGF0ZSAgPSAhIXRoaXMub3B0aW9ucy5wdXNoU3RhdGU7XG4gICAgICB0aGlzLl9oYXNQdXNoU3RhdGUgICAgPSAhISh0aGlzLmhpc3RvcnkgJiYgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZSk7XG4gICAgICB0aGlzLl91c2VQdXNoU3RhdGUgICAgPSB0aGlzLl93YW50c1B1c2hTdGF0ZSAmJiB0aGlzLl9oYXNQdXNoU3RhdGU7XG4gICAgICB0aGlzLmZyYWdtZW50ICAgICAgICAgPSB0aGlzLmdldEZyYWdtZW50KCk7XG5cbiAgICAgIC8vIE5vcm1hbGl6ZSByb290IHRvIGFsd2F5cyBpbmNsdWRlIGEgbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2guXG4gICAgICB0aGlzLnJvb3QgPSAoJy8nICsgdGhpcy5yb290ICsgJy8nKS5yZXBsYWNlKHJvb3RTdHJpcHBlciwgJy8nKTtcblxuICAgICAgLy8gVHJhbnNpdGlvbiBmcm9tIGhhc2hDaGFuZ2UgdG8gcHVzaFN0YXRlIG9yIHZpY2UgdmVyc2EgaWYgYm90aCBhcmVcbiAgICAgIC8vIHJlcXVlc3RlZC5cbiAgICAgIGlmICh0aGlzLl93YW50c0hhc2hDaGFuZ2UgJiYgdGhpcy5fd2FudHNQdXNoU3RhdGUpIHtcblxuICAgICAgICAvLyBJZiB3ZSd2ZSBzdGFydGVkIG9mZiB3aXRoIGEgcm91dGUgZnJvbSBhIGBwdXNoU3RhdGVgLWVuYWJsZWRcbiAgICAgICAgLy8gYnJvd3NlciwgYnV0IHdlJ3JlIGN1cnJlbnRseSBpbiBhIGJyb3dzZXIgdGhhdCBkb2Vzbid0IHN1cHBvcnQgaXQuLi5cbiAgICAgICAgaWYgKCF0aGlzLl9oYXNQdXNoU3RhdGUgJiYgIXRoaXMuYXRSb290KCkpIHtcbiAgICAgICAgICB2YXIgcm9vdFBhdGggPSB0aGlzLnJvb3Quc2xpY2UoMCwgLTEpIHx8ICcvJztcbiAgICAgICAgICB0aGlzLmxvY2F0aW9uLnJlcGxhY2Uocm9vdFBhdGggKyAnIycgKyB0aGlzLmdldFBhdGgoKSk7XG4gICAgICAgICAgLy8gUmV0dXJuIGltbWVkaWF0ZWx5IGFzIGJyb3dzZXIgd2lsbCBkbyByZWRpcmVjdCB0byBuZXcgdXJsXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gT3IgaWYgd2UndmUgc3RhcnRlZCBvdXQgd2l0aCBhIGhhc2gtYmFzZWQgcm91dGUsIGJ1dCB3ZSdyZSBjdXJyZW50bHlcbiAgICAgICAgLy8gaW4gYSBicm93c2VyIHdoZXJlIGl0IGNvdWxkIGJlIGBwdXNoU3RhdGVgLWJhc2VkIGluc3RlYWQuLi5cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9oYXNQdXNoU3RhdGUgJiYgdGhpcy5hdFJvb3QoKSkge1xuICAgICAgICAgIHRoaXMubmF2aWdhdGUodGhpcy5nZXRIYXNoKCksIHtyZXBsYWNlOiB0cnVlfSk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAvLyBQcm94eSBhbiBpZnJhbWUgdG8gaGFuZGxlIGxvY2F0aW9uIGV2ZW50cyBpZiB0aGUgYnJvd3NlciBkb2Vzbid0XG4gICAgICAvLyBzdXBwb3J0IHRoZSBgaGFzaGNoYW5nZWAgZXZlbnQsIEhUTUw1IGhpc3RvcnksIG9yIHRoZSB1c2VyIHdhbnRzXG4gICAgICAvLyBgaGFzaENoYW5nZWAgYnV0IG5vdCBgcHVzaFN0YXRlYC5cbiAgICAgIGlmICghdGhpcy5faGFzSGFzaENoYW5nZSAmJiB0aGlzLl93YW50c0hhc2hDaGFuZ2UgJiYgIXRoaXMuX3VzZVB1c2hTdGF0ZSkge1xuICAgICAgICB0aGlzLmlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgICAgICB0aGlzLmlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDowJztcbiAgICAgICAgdGhpcy5pZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgdGhpcy5pZnJhbWUudGFiSW5kZXggPSAtMTtcbiAgICAgICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgICAvLyBVc2luZyBgYXBwZW5kQ2hpbGRgIHdpbGwgdGhyb3cgb24gSUUgPCA5IGlmIHRoZSBkb2N1bWVudCBpcyBub3QgcmVhZHkuXG4gICAgICAgIHZhciBpV2luZG93ID0gYm9keS5pbnNlcnRCZWZvcmUodGhpcy5pZnJhbWUsIGJvZHkuZmlyc3RDaGlsZCkuY29udGVudFdpbmRvdztcbiAgICAgICAgaVdpbmRvdy5kb2N1bWVudC5vcGVuKCk7XG4gICAgICAgIGlXaW5kb3cuZG9jdW1lbnQuY2xvc2UoKTtcbiAgICAgICAgaVdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJyMnICsgdGhpcy5mcmFnbWVudDtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIGEgY3Jvc3MtcGxhdGZvcm0gYGFkZEV2ZW50TGlzdGVuZXJgIHNoaW0gZm9yIG9sZGVyIGJyb3dzZXJzLlxuICAgICAgdmFyIGFkZEV2ZW50TGlzdGVuZXIgPSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciB8fCBmdW5jdGlvbihldmVudE5hbWUsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBhdHRhY2hFdmVudCgnb24nICsgZXZlbnROYW1lLCBsaXN0ZW5lcik7XG4gICAgICB9O1xuXG4gICAgICAvLyBEZXBlbmRpbmcgb24gd2hldGhlciB3ZSdyZSB1c2luZyBwdXNoU3RhdGUgb3IgaGFzaGVzLCBhbmQgd2hldGhlclxuICAgICAgLy8gJ29uaGFzaGNoYW5nZScgaXMgc3VwcG9ydGVkLCBkZXRlcm1pbmUgaG93IHdlIGNoZWNrIHRoZSBVUkwgc3RhdGUuXG4gICAgICBpZiAodGhpcy5fdXNlUHVzaFN0YXRlKSB7XG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgdGhpcy5jaGVja1VybCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl91c2VIYXNoQ2hhbmdlICYmICF0aGlzLmlmcmFtZSkge1xuICAgICAgICBhZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5jaGVja1VybCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl93YW50c0hhc2hDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tVcmxJbnRlcnZhbCA9IHNldEludGVydmFsKHRoaXMuY2hlY2tVcmwsIHRoaXMuaW50ZXJ2YWwpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaWxlbnQpIHJldHVybiB0aGlzLmxvYWRVcmwoKTtcbiAgICB9LFxuXG4gICAgLy8gRGlzYWJsZSBCYWNrYm9uZS5oaXN0b3J5LCBwZXJoYXBzIHRlbXBvcmFyaWx5LiBOb3QgdXNlZnVsIGluIGEgcmVhbCBhcHAsXG4gICAgLy8gYnV0IHBvc3NpYmx5IHVzZWZ1bCBmb3IgdW5pdCB0ZXN0aW5nIFJvdXRlcnMuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBBZGQgYSBjcm9zcy1wbGF0Zm9ybSBgcmVtb3ZlRXZlbnRMaXN0ZW5lcmAgc2hpbSBmb3Igb2xkZXIgYnJvd3NlcnMuXG4gICAgICB2YXIgcmVtb3ZlRXZlbnRMaXN0ZW5lciA9IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyIHx8IGZ1bmN0aW9uKGV2ZW50TmFtZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIGRldGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIFJlbW92ZSB3aW5kb3cgbGlzdGVuZXJzLlxuICAgICAgaWYgKHRoaXMuX3VzZVB1c2hTdGF0ZSkge1xuICAgICAgICByZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHRoaXMuY2hlY2tVcmwsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fdXNlSGFzaENoYW5nZSAmJiAhdGhpcy5pZnJhbWUpIHtcbiAgICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMuY2hlY2tVcmwsIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2xlYW4gdXAgdGhlIGlmcmFtZSBpZiBuZWNlc3NhcnkuXG4gICAgICBpZiAodGhpcy5pZnJhbWUpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmlmcmFtZSk7XG4gICAgICAgIHRoaXMuaWZyYW1lID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gU29tZSBlbnZpcm9ubWVudHMgd2lsbCB0aHJvdyB3aGVuIGNsZWFyaW5nIGFuIHVuZGVmaW5lZCBpbnRlcnZhbC5cbiAgICAgIGlmICh0aGlzLl9jaGVja1VybEludGVydmFsKSBjbGVhckludGVydmFsKHRoaXMuX2NoZWNrVXJsSW50ZXJ2YWwpO1xuICAgICAgSGlzdG9yeS5zdGFydGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIEFkZCBhIHJvdXRlIHRvIGJlIHRlc3RlZCB3aGVuIHRoZSBmcmFnbWVudCBjaGFuZ2VzLiBSb3V0ZXMgYWRkZWQgbGF0ZXJcbiAgICAvLyBtYXkgb3ZlcnJpZGUgcHJldmlvdXMgcm91dGVzLlxuICAgIHJvdXRlOiBmdW5jdGlvbihyb3V0ZSwgY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuaGFuZGxlcnMudW5zaGlmdCh7cm91dGU6IHJvdXRlLCBjYWxsYmFjazogY2FsbGJhY2t9KTtcbiAgICB9LFxuXG4gICAgLy8gQ2hlY2tzIHRoZSBjdXJyZW50IFVSTCB0byBzZWUgaWYgaXQgaGFzIGNoYW5nZWQsIGFuZCBpZiBpdCBoYXMsXG4gICAgLy8gY2FsbHMgYGxvYWRVcmxgLCBub3JtYWxpemluZyBhY3Jvc3MgdGhlIGhpZGRlbiBpZnJhbWUuXG4gICAgY2hlY2tVcmw6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5nZXRGcmFnbWVudCgpO1xuXG4gICAgICAvLyBJZiB0aGUgdXNlciBwcmVzc2VkIHRoZSBiYWNrIGJ1dHRvbiwgdGhlIGlmcmFtZSdzIGhhc2ggd2lsbCBoYXZlXG4gICAgICAvLyBjaGFuZ2VkIGFuZCB3ZSBzaG91bGQgdXNlIHRoYXQgZm9yIGNvbXBhcmlzb24uXG4gICAgICBpZiAoY3VycmVudCA9PT0gdGhpcy5mcmFnbWVudCAmJiB0aGlzLmlmcmFtZSkge1xuICAgICAgICBjdXJyZW50ID0gdGhpcy5nZXRIYXNoKHRoaXMuaWZyYW1lLmNvbnRlbnRXaW5kb3cpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudCA9PT0gdGhpcy5mcmFnbWVudCkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKHRoaXMuaWZyYW1lKSB0aGlzLm5hdmlnYXRlKGN1cnJlbnQpO1xuICAgICAgdGhpcy5sb2FkVXJsKCk7XG4gICAgfSxcblxuICAgIC8vIEF0dGVtcHQgdG8gbG9hZCB0aGUgY3VycmVudCBVUkwgZnJhZ21lbnQuIElmIGEgcm91dGUgc3VjY2VlZHMgd2l0aCBhXG4gICAgLy8gbWF0Y2gsIHJldHVybnMgYHRydWVgLiBJZiBubyBkZWZpbmVkIHJvdXRlcyBtYXRjaGVzIHRoZSBmcmFnbWVudCxcbiAgICAvLyByZXR1cm5zIGBmYWxzZWAuXG4gICAgbG9hZFVybDogZnVuY3Rpb24oZnJhZ21lbnQpIHtcbiAgICAgIC8vIElmIHRoZSByb290IGRvZXNuJ3QgbWF0Y2gsIG5vIHJvdXRlcyBjYW4gbWF0Y2ggZWl0aGVyLlxuICAgICAgaWYgKCF0aGlzLm1hdGNoUm9vdCgpKSByZXR1cm4gZmFsc2U7XG4gICAgICBmcmFnbWVudCA9IHRoaXMuZnJhZ21lbnQgPSB0aGlzLmdldEZyYWdtZW50KGZyYWdtZW50KTtcbiAgICAgIHJldHVybiBfLnNvbWUodGhpcy5oYW5kbGVycywgZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICBpZiAoaGFuZGxlci5yb3V0ZS50ZXN0KGZyYWdtZW50KSkge1xuICAgICAgICAgIGhhbmRsZXIuY2FsbGJhY2soZnJhZ21lbnQpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8gU2F2ZSBhIGZyYWdtZW50IGludG8gdGhlIGhhc2ggaGlzdG9yeSwgb3IgcmVwbGFjZSB0aGUgVVJMIHN0YXRlIGlmIHRoZVxuICAgIC8vICdyZXBsYWNlJyBvcHRpb24gaXMgcGFzc2VkLiBZb3UgYXJlIHJlc3BvbnNpYmxlIGZvciBwcm9wZXJseSBVUkwtZW5jb2RpbmdcbiAgICAvLyB0aGUgZnJhZ21lbnQgaW4gYWR2YW5jZS5cbiAgICAvL1xuICAgIC8vIFRoZSBvcHRpb25zIG9iamVjdCBjYW4gY29udGFpbiBgdHJpZ2dlcjogdHJ1ZWAgaWYgeW91IHdpc2ggdG8gaGF2ZSB0aGVcbiAgICAvLyByb3V0ZSBjYWxsYmFjayBiZSBmaXJlZCAobm90IHVzdWFsbHkgZGVzaXJhYmxlKSwgb3IgYHJlcGxhY2U6IHRydWVgLCBpZlxuICAgIC8vIHlvdSB3aXNoIHRvIG1vZGlmeSB0aGUgY3VycmVudCBVUkwgd2l0aG91dCBhZGRpbmcgYW4gZW50cnkgdG8gdGhlIGhpc3RvcnkuXG4gICAgbmF2aWdhdGU6IGZ1bmN0aW9uKGZyYWdtZW50LCBvcHRpb25zKSB7XG4gICAgICBpZiAoIUhpc3Rvcnkuc3RhcnRlZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFvcHRpb25zIHx8IG9wdGlvbnMgPT09IHRydWUpIG9wdGlvbnMgPSB7dHJpZ2dlcjogISFvcHRpb25zfTtcblxuICAgICAgLy8gTm9ybWFsaXplIHRoZSBmcmFnbWVudC5cbiAgICAgIGZyYWdtZW50ID0gdGhpcy5nZXRGcmFnbWVudChmcmFnbWVudCB8fCAnJyk7XG5cbiAgICAgIC8vIERvbid0IGluY2x1ZGUgYSB0cmFpbGluZyBzbGFzaCBvbiB0aGUgcm9vdC5cbiAgICAgIHZhciByb290UGF0aCA9IHRoaXMucm9vdDtcbiAgICAgIGlmIChmcmFnbWVudCA9PT0gJycgfHwgZnJhZ21lbnQuY2hhckF0KDApID09PSAnPycpIHtcbiAgICAgICAgcm9vdFBhdGggPSByb290UGF0aC5zbGljZSgwLCAtMSkgfHwgJy8nO1xuICAgICAgfVxuICAgICAgdmFyIHVybCA9IHJvb3RQYXRoICsgZnJhZ21lbnQ7XG5cbiAgICAgIC8vIFN0cmlwIHRoZSBmcmFnbWVudCBvZiB0aGUgcXVlcnkgYW5kIGhhc2ggZm9yIG1hdGNoaW5nLlxuICAgICAgZnJhZ21lbnQgPSBmcmFnbWVudC5yZXBsYWNlKHBhdGhTdHJpcHBlciwgJycpO1xuXG4gICAgICAvLyBEZWNvZGUgZm9yIG1hdGNoaW5nLlxuICAgICAgdmFyIGRlY29kZWRGcmFnbWVudCA9IHRoaXMuZGVjb2RlRnJhZ21lbnQoZnJhZ21lbnQpO1xuXG4gICAgICBpZiAodGhpcy5mcmFnbWVudCA9PT0gZGVjb2RlZEZyYWdtZW50KSByZXR1cm47XG4gICAgICB0aGlzLmZyYWdtZW50ID0gZGVjb2RlZEZyYWdtZW50O1xuXG4gICAgICAvLyBJZiBwdXNoU3RhdGUgaXMgYXZhaWxhYmxlLCB3ZSB1c2UgaXQgdG8gc2V0IHRoZSBmcmFnbWVudCBhcyBhIHJlYWwgVVJMLlxuICAgICAgaWYgKHRoaXMuX3VzZVB1c2hTdGF0ZSkge1xuICAgICAgICB0aGlzLmhpc3Rvcnlbb3B0aW9ucy5yZXBsYWNlID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJ10oe30sIGRvY3VtZW50LnRpdGxlLCB1cmwpO1xuXG4gICAgICAvLyBJZiBoYXNoIGNoYW5nZXMgaGF2ZW4ndCBiZWVuIGV4cGxpY2l0bHkgZGlzYWJsZWQsIHVwZGF0ZSB0aGUgaGFzaFxuICAgICAgLy8gZnJhZ21lbnQgdG8gc3RvcmUgaGlzdG9yeS5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fd2FudHNIYXNoQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUhhc2godGhpcy5sb2NhdGlvbiwgZnJhZ21lbnQsIG9wdGlvbnMucmVwbGFjZSk7XG4gICAgICAgIGlmICh0aGlzLmlmcmFtZSAmJiBmcmFnbWVudCAhPT0gdGhpcy5nZXRIYXNoKHRoaXMuaWZyYW1lLmNvbnRlbnRXaW5kb3cpKSB7XG4gICAgICAgICAgdmFyIGlXaW5kb3cgPSB0aGlzLmlmcmFtZS5jb250ZW50V2luZG93O1xuXG4gICAgICAgICAgLy8gT3BlbmluZyBhbmQgY2xvc2luZyB0aGUgaWZyYW1lIHRyaWNrcyBJRTcgYW5kIGVhcmxpZXIgdG8gcHVzaCBhXG4gICAgICAgICAgLy8gaGlzdG9yeSBlbnRyeSBvbiBoYXNoLXRhZyBjaGFuZ2UuICBXaGVuIHJlcGxhY2UgaXMgdHJ1ZSwgd2UgZG9uJ3RcbiAgICAgICAgICAvLyB3YW50IHRoaXMuXG4gICAgICAgICAgaWYgKCFvcHRpb25zLnJlcGxhY2UpIHtcbiAgICAgICAgICAgIGlXaW5kb3cuZG9jdW1lbnQub3BlbigpO1xuICAgICAgICAgICAgaVdpbmRvdy5kb2N1bWVudC5jbG9zZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX3VwZGF0ZUhhc2goaVdpbmRvdy5sb2NhdGlvbiwgZnJhZ21lbnQsIG9wdGlvbnMucmVwbGFjZSk7XG4gICAgICAgIH1cblxuICAgICAgLy8gSWYgeW91J3ZlIHRvbGQgdXMgdGhhdCB5b3UgZXhwbGljaXRseSBkb24ndCB3YW50IGZhbGxiYWNrIGhhc2hjaGFuZ2UtXG4gICAgICAvLyBiYXNlZCBoaXN0b3J5LCB0aGVuIGBuYXZpZ2F0ZWAgYmVjb21lcyBhIHBhZ2UgcmVmcmVzaC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2F0aW9uLmFzc2lnbih1cmwpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMudHJpZ2dlcikgcmV0dXJuIHRoaXMubG9hZFVybChmcmFnbWVudCk7XG4gICAgfSxcblxuICAgIC8vIFVwZGF0ZSB0aGUgaGFzaCBsb2NhdGlvbiwgZWl0aGVyIHJlcGxhY2luZyB0aGUgY3VycmVudCBlbnRyeSwgb3IgYWRkaW5nXG4gICAgLy8gYSBuZXcgb25lIHRvIHRoZSBicm93c2VyIGhpc3RvcnkuXG4gICAgX3VwZGF0ZUhhc2g6IGZ1bmN0aW9uKGxvY2F0aW9uLCBmcmFnbWVudCwgcmVwbGFjZSkge1xuICAgICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgICAgdmFyIGhyZWYgPSBsb2NhdGlvbi5ocmVmLnJlcGxhY2UoLyhqYXZhc2NyaXB0OnwjKS4qJC8sICcnKTtcbiAgICAgICAgbG9jYXRpb24ucmVwbGFjZShocmVmICsgJyMnICsgZnJhZ21lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU29tZSBicm93c2VycyByZXF1aXJlIHRoYXQgYGhhc2hgIGNvbnRhaW5zIGEgbGVhZGluZyAjLlxuICAgICAgICBsb2NhdGlvbi5oYXNoID0gJyMnICsgZnJhZ21lbnQ7XG4gICAgICB9XG4gICAgfVxuXG4gIH0pO1xuXG4gIC8vIENyZWF0ZSB0aGUgZGVmYXVsdCBCYWNrYm9uZS5oaXN0b3J5LlxuICBCYWNrYm9uZS5oaXN0b3J5ID0gbmV3IEhpc3Rvcnk7XG5cbiAgLy8gSGVscGVyc1xuICAvLyAtLS0tLS0tXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvcnJlY3RseSBzZXQgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiBmb3Igc3ViY2xhc3Nlcy5cbiAgLy8gU2ltaWxhciB0byBgZ29vZy5pbmhlcml0c2AsIGJ1dCB1c2VzIGEgaGFzaCBvZiBwcm90b3R5cGUgcHJvcGVydGllcyBhbmRcbiAgLy8gY2xhc3MgcHJvcGVydGllcyB0byBiZSBleHRlbmRlZC5cbiAgdmFyIGV4dGVuZCA9IGZ1bmN0aW9uKHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgdmFyIHBhcmVudCA9IHRoaXM7XG4gICAgdmFyIGNoaWxkO1xuXG4gICAgLy8gVGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciB0aGUgbmV3IHN1YmNsYXNzIGlzIGVpdGhlciBkZWZpbmVkIGJ5IHlvdVxuICAgIC8vICh0aGUgXCJjb25zdHJ1Y3RvclwiIHByb3BlcnR5IGluIHlvdXIgYGV4dGVuZGAgZGVmaW5pdGlvbiksIG9yIGRlZmF1bHRlZFxuICAgIC8vIGJ5IHVzIHRvIHNpbXBseSBjYWxsIHRoZSBwYXJlbnQgY29uc3RydWN0b3IuXG4gICAgaWYgKHByb3RvUHJvcHMgJiYgXy5oYXMocHJvdG9Qcm9wcywgJ2NvbnN0cnVjdG9yJykpIHtcbiAgICAgIGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGQgPSBmdW5jdGlvbigpeyByZXR1cm4gcGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgfVxuXG4gICAgLy8gQWRkIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiwgaWYgc3VwcGxpZWQuXG4gICAgXy5leHRlbmQoY2hpbGQsIHBhcmVudCwgc3RhdGljUHJvcHMpO1xuXG4gICAgLy8gU2V0IHRoZSBwcm90b3R5cGUgY2hhaW4gdG8gaW5oZXJpdCBmcm9tIGBwYXJlbnRgLCB3aXRob3V0IGNhbGxpbmdcbiAgICAvLyBgcGFyZW50YCdzIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGFuZCBhZGQgdGhlIHByb3RvdHlwZSBwcm9wZXJ0aWVzLlxuICAgIGNoaWxkLnByb3RvdHlwZSA9IF8uY3JlYXRlKHBhcmVudC5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGNoaWxkLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNoaWxkO1xuXG4gICAgLy8gU2V0IGEgY29udmVuaWVuY2UgcHJvcGVydHkgaW4gY2FzZSB0aGUgcGFyZW50J3MgcHJvdG90eXBlIGlzIG5lZWRlZFxuICAgIC8vIGxhdGVyLlxuICAgIGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XG5cbiAgICByZXR1cm4gY2hpbGQ7XG4gIH07XG5cbiAgLy8gU2V0IHVwIGluaGVyaXRhbmNlIGZvciB0aGUgbW9kZWwsIGNvbGxlY3Rpb24sIHJvdXRlciwgdmlldyBhbmQgaGlzdG9yeS5cbiAgTW9kZWwuZXh0ZW5kID0gQ29sbGVjdGlvbi5leHRlbmQgPSBSb3V0ZXIuZXh0ZW5kID0gVmlldy5leHRlbmQgPSBIaXN0b3J5LmV4dGVuZCA9IGV4dGVuZDtcblxuICAvLyBUaHJvdyBhbiBlcnJvciB3aGVuIGEgVVJMIGlzIG5lZWRlZCwgYW5kIG5vbmUgaXMgc3VwcGxpZWQuXG4gIHZhciB1cmxFcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQSBcInVybFwiIHByb3BlcnR5IG9yIGZ1bmN0aW9uIG11c3QgYmUgc3BlY2lmaWVkJyk7XG4gIH07XG5cbiAgLy8gV3JhcCBhbiBvcHRpb25hbCBlcnJvciBjYWxsYmFjayB3aXRoIGEgZmFsbGJhY2sgZXJyb3IgZXZlbnQuXG4gIHZhciB3cmFwRXJyb3IgPSBmdW5jdGlvbihtb2RlbCwgb3B0aW9ucykge1xuICAgIHZhciBlcnJvciA9IG9wdGlvbnMuZXJyb3I7XG4gICAgb3B0aW9ucy5lcnJvciA9IGZ1bmN0aW9uKHJlc3ApIHtcbiAgICAgIGlmIChlcnJvcikgZXJyb3IuY2FsbChvcHRpb25zLmNvbnRleHQsIG1vZGVsLCByZXNwLCBvcHRpb25zKTtcbiAgICAgIG1vZGVsLnRyaWdnZXIoJ2Vycm9yJywgbW9kZWwsIHJlc3AsIG9wdGlvbnMpO1xuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIEJhY2tib25lO1xufSk7XG4iXX0=
},{"jquery":12,"underscore":14}],3:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":4,"./handlebars/exception":5,"./handlebars/runtime":6,"./handlebars/safe-string":7,"./handlebars/utils":8}],4:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) {
              data.key = key;
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":5,"./utils":8}],5:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],6:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":4,"./exception":5,"./utils":8}],7:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],8:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":7}],9:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":3}],10:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":9}],11:[function(require,module,exports){
/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2014 Rico Sta. Cruz
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

/* jshint expr: true */

;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(root.jQuery);
  }

}(this, function($) {

  $.transit = {
    version: "0.9.12",

    // Map of $.css() keys to values for 'transitionProperty'.
    // See https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
    propertyMap: {
      marginLeft    : 'margin',
      marginRight   : 'margin',
      marginBottom  : 'margin',
      marginTop     : 'margin',
      paddingLeft   : 'padding',
      paddingRight  : 'padding',
      paddingBottom : 'padding',
      paddingTop    : 'padding'
    },

    // Will simply transition "instantly" if false
    enabled: true,

    // Set this to false if you don't want to use the transition end property.
    useTransitionEnd: false
  };

  var div = document.createElement('div');
  var support = {};

  // Helper function to get the proper vendor property name.
  // (`transition` => `WebkitTransition`)
  function getVendorPropertyName(prop) {
    // Handle unprefixed versions (FF16+, for example)
    if (prop in div.style) return prop;

    var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
    var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

    for (var i=0; i<prefixes.length; ++i) {
      var vendorProp = prefixes[i] + prop_;
      if (vendorProp in div.style) { return vendorProp; }
    }
  }

  // Helper function to check if transform3D is supported.
  // Should return true for Webkits and Firefox 10+.
  function checkTransform3dSupport() {
    div.style[support.transform] = '';
    div.style[support.transform] = 'rotateY(90deg)';
    return div.style[support.transform] !== '';
  }

  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

  // Check for the browser's transitions support.
  support.transition      = getVendorPropertyName('transition');
  support.transitionDelay = getVendorPropertyName('transitionDelay');
  support.transform       = getVendorPropertyName('transform');
  support.transformOrigin = getVendorPropertyName('transformOrigin');
  support.filter          = getVendorPropertyName('Filter');
  support.transform3d     = checkTransform3dSupport();

  var eventNames = {
    'transition':       'transitionend',
    'MozTransition':    'transitionend',
    'OTransition':      'oTransitionEnd',
    'WebkitTransition': 'webkitTransitionEnd',
    'msTransition':     'MSTransitionEnd'
  };

  // Detect the 'transitionend' event needed.
  var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

  // Populate jQuery's `$.support` with the vendor prefixes we know.
  // As per [jQuery's cssHooks documentation](http://api.jquery.com/jQuery.cssHooks/),
  // we set $.support.transition to a string of the actual property name used.
  for (var key in support) {
    if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
      $.support[key] = support[key];
    }
  }

  // Avoid memory leak in IE.
  div = null;

  // ## $.cssEase
  // List of easing aliases that you can use with `$.fn.transition`.
  $.cssEase = {
    '_default':       'ease',
    'in':             'ease-in',
    'out':            'ease-out',
    'in-out':         'ease-in-out',
    'snap':           'cubic-bezier(0,1,.5,1)',
    // Penner equations
    'easeInCubic':    'cubic-bezier(.550,.055,.675,.190)',
    'easeOutCubic':   'cubic-bezier(.215,.61,.355,1)',
    'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
    'easeInCirc':     'cubic-bezier(.6,.04,.98,.335)',
    'easeOutCirc':    'cubic-bezier(.075,.82,.165,1)',
    'easeInOutCirc':  'cubic-bezier(.785,.135,.15,.86)',
    'easeInExpo':     'cubic-bezier(.95,.05,.795,.035)',
    'easeOutExpo':    'cubic-bezier(.19,1,.22,1)',
    'easeInOutExpo':  'cubic-bezier(1,0,0,1)',
    'easeInQuad':     'cubic-bezier(.55,.085,.68,.53)',
    'easeOutQuad':    'cubic-bezier(.25,.46,.45,.94)',
    'easeInOutQuad':  'cubic-bezier(.455,.03,.515,.955)',
    'easeInQuart':    'cubic-bezier(.895,.03,.685,.22)',
    'easeOutQuart':   'cubic-bezier(.165,.84,.44,1)',
    'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
    'easeInQuint':    'cubic-bezier(.755,.05,.855,.06)',
    'easeOutQuint':   'cubic-bezier(.23,1,.32,1)',
    'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
    'easeInSine':     'cubic-bezier(.47,0,.745,.715)',
    'easeOutSine':    'cubic-bezier(.39,.575,.565,1)',
    'easeInOutSine':  'cubic-bezier(.445,.05,.55,.95)',
    'easeInBack':     'cubic-bezier(.6,-.28,.735,.045)',
    'easeOutBack':    'cubic-bezier(.175, .885,.32,1.275)',
    'easeInOutBack':  'cubic-bezier(.68,-.55,.265,1.55)'
  };

  // ## 'transform' CSS hook
  // Allows you to use the `transform` property in CSS.
  //
  //     $("#hello").css({ transform: "rotate(90deg)" });
  //
  //     $("#hello").css('transform');
  //     //=> { rotate: '90deg' }
  //
  $.cssHooks['transit:transform'] = {
    // The getter returns a `Transform` object.
    get: function(elem) {
      return $(elem).data('transform') || new Transform();
    },

    // The setter accepts a `Transform` object or a string.
    set: function(elem, v) {
      var value = v;

      if (!(value instanceof Transform)) {
        value = new Transform(value);
      }

      // We've seen the 3D version of Scale() not work in Chrome when the
      // element being scaled extends outside of the viewport.  Thus, we're
      // forcing Chrome to not use the 3d transforms as well.  Not sure if
      // translate is affectede, but not risking it.  Detection code from
      // http://davidwalsh.name/detecting-google-chrome-javascript
      if (support.transform === 'WebkitTransform' && !isChrome) {
        elem.style[support.transform] = value.toString(true);
      } else {
        elem.style[support.transform] = value.toString();
      }

      $(elem).data('transform', value);
    }
  };

  // Add a CSS hook for `.css({ transform: '...' })`.
  // In jQuery 1.8+, this will intentionally override the default `transform`
  // CSS hook so it'll play well with Transit. (see issue #62)
  $.cssHooks.transform = {
    set: $.cssHooks['transit:transform'].set
  };

  // ## 'filter' CSS hook
  // Allows you to use the `filter` property in CSS.
  //
  //     $("#hello").css({ filter: 'blur(10px)' });
  //
  $.cssHooks.filter = {
    get: function(elem) {
      return elem.style[support.filter];
    },
    set: function(elem, value) {
      elem.style[support.filter] = value;
    }
  };

  // jQuery 1.8+ supports prefix-free transitions, so these polyfills will not
  // be necessary.
  if ($.fn.jquery < "1.8") {
    // ## 'transformOrigin' CSS hook
    // Allows the use for `transformOrigin` to define where scaling and rotation
    // is pivoted.
    //
    //     $("#hello").css({ transformOrigin: '0 0' });
    //
    $.cssHooks.transformOrigin = {
      get: function(elem) {
        return elem.style[support.transformOrigin];
      },
      set: function(elem, value) {
        elem.style[support.transformOrigin] = value;
      }
    };

    // ## 'transition' CSS hook
    // Allows you to use the `transition` property in CSS.
    //
    //     $("#hello").css({ transition: 'all 0 ease 0' });
    //
    $.cssHooks.transition = {
      get: function(elem) {
        return elem.style[support.transition];
      },
      set: function(elem, value) {
        elem.style[support.transition] = value;
      }
    };
  }

  // ## Other CSS hooks
  // Allows you to rotate, scale and translate.
  registerCssHook('scale');
  registerCssHook('scaleX');
  registerCssHook('scaleY');
  registerCssHook('translate');
  registerCssHook('rotate');
  registerCssHook('rotateX');
  registerCssHook('rotateY');
  registerCssHook('rotate3d');
  registerCssHook('perspective');
  registerCssHook('skewX');
  registerCssHook('skewY');
  registerCssHook('x', true);
  registerCssHook('y', true);

  // ## Transform class
  // This is the main class of a transformation property that powers
  // `$.fn.css({ transform: '...' })`.
  //
  // This is, in essence, a dictionary object with key/values as `-transform`
  // properties.
  //
  //     var t = new Transform("rotate(90) scale(4)");
  //
  //     t.rotate             //=> "90deg"
  //     t.scale              //=> "4,4"
  //
  // Setters are accounted for.
  //
  //     t.set('rotate', 4)
  //     t.rotate             //=> "4deg"
  //
  // Convert it to a CSS string using the `toString()` and `toString(true)` (for WebKit)
  // functions.
  //
  //     t.toString()         //=> "rotate(90deg) scale(4,4)"
  //     t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
  //
  function Transform(str) {
    if (typeof str === 'string') { this.parse(str); }
    return this;
  }

  Transform.prototype = {
    // ### setFromString()
    // Sets a property from a string.
    //
    //     t.setFromString('scale', '2,4');
    //     // Same as set('scale', '2', '4');
    //
    setFromString: function(prop, val) {
      var args =
        (typeof val === 'string')  ? val.split(',') :
        (val.constructor === Array) ? val :
        [ val ];

      args.unshift(prop);

      Transform.prototype.set.apply(this, args);
    },

    // ### set()
    // Sets a property.
    //
    //     t.set('scale', 2, 4);
    //
    set: function(prop) {
      var args = Array.prototype.slice.apply(arguments, [1]);
      if (this.setter[prop]) {
        this.setter[prop].apply(this, args);
      } else {
        this[prop] = args.join(',');
      }
    },

    get: function(prop) {
      if (this.getter[prop]) {
        return this.getter[prop].apply(this);
      } else {
        return this[prop] || 0;
      }
    },

    setter: {
      // ### rotate
      //
      //     .css({ rotate: 30 })
      //     .css({ rotate: "30" })
      //     .css({ rotate: "30deg" })
      //     .css({ rotate: "30deg" })
      //
      rotate: function(theta) {
        this.rotate = unit(theta, 'deg');
      },

      rotateX: function(theta) {
        this.rotateX = unit(theta, 'deg');
      },

      rotateY: function(theta) {
        this.rotateY = unit(theta, 'deg');
      },

      // ### scale
      //
      //     .css({ scale: 9 })      //=> "scale(9,9)"
      //     .css({ scale: '3,2' })  //=> "scale(3,2)"
      //
      scale: function(x, y) {
        if (y === undefined) { y = x; }
        this.scale = x + "," + y;
      },

      // ### skewX + skewY
      skewX: function(x) {
        this.skewX = unit(x, 'deg');
      },

      skewY: function(y) {
        this.skewY = unit(y, 'deg');
      },

      // ### perspectvie
      perspective: function(dist) {
        this.perspective = unit(dist, 'px');
      },

      // ### x / y
      // Translations. Notice how this keeps the other value.
      //
      //     .css({ x: 4 })       //=> "translate(4px, 0)"
      //     .css({ y: 10 })      //=> "translate(4px, 10px)"
      //
      x: function(x) {
        this.set('translate', x, null);
      },

      y: function(y) {
        this.set('translate', null, y);
      },

      // ### translate
      // Notice how this keeps the other value.
      //
      //     .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
      //
      translate: function(x, y) {
        if (this._translateX === undefined) { this._translateX = 0; }
        if (this._translateY === undefined) { this._translateY = 0; }

        if (x !== null && x !== undefined) { this._translateX = unit(x, 'px'); }
        if (y !== null && y !== undefined) { this._translateY = unit(y, 'px'); }

        this.translate = this._translateX + "," + this._translateY;
      }
    },

    getter: {
      x: function() {
        return this._translateX || 0;
      },

      y: function() {
        return this._translateY || 0;
      },

      scale: function() {
        var s = (this.scale || "1,1").split(',');
        if (s[0]) { s[0] = parseFloat(s[0]); }
        if (s[1]) { s[1] = parseFloat(s[1]); }

        // "2.5,2.5" => 2.5
        // "2.5,1" => [2.5,1]
        return (s[0] === s[1]) ? s[0] : s;
      },

      rotate3d: function() {
        var s = (this.rotate3d || "0,0,0,0deg").split(',');
        for (var i=0; i<=3; ++i) {
          if (s[i]) { s[i] = parseFloat(s[i]); }
        }
        if (s[3]) { s[3] = unit(s[3], 'deg'); }

        return s;
      }
    },

    // ### parse()
    // Parses from a string. Called on constructor.
    parse: function(str) {
      var self = this;
      str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
        self.setFromString(prop, val);
      });
    },

    // ### toString()
    // Converts to a `transition` CSS property string. If `use3d` is given,
    // it converts to a `-webkit-transition` CSS property string instead.
    toString: function(use3d) {
      var re = [];

      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          // Don't use 3D transformations if the browser can't support it.
          if ((!support.transform3d) && (
            (i === 'rotateX') ||
            (i === 'rotateY') ||
            (i === 'perspective') ||
            (i === 'transformOrigin'))) { continue; }

          if (i[0] !== '_') {
            if (use3d && (i === 'scale')) {
              re.push(i + "3d(" + this[i] + ",1)");
            } else if (use3d && (i === 'translate')) {
              re.push(i + "3d(" + this[i] + ",0)");
            } else {
              re.push(i + "(" + this[i] + ")");
            }
          }
        }
      }

      return re.join(" ");
    }
  };

  function callOrQueue(self, queue, fn) {
    if (queue === true) {
      self.queue(fn);
    } else if (queue) {
      self.queue(queue, fn);
    } else {
      self.each(function () {
                fn.call(this);
            });
    }
  }

  // ### getProperties(dict)
  // Returns properties (for `transition-property`) for dictionary `props`. The
  // value of `props` is what you would expect in `$.css(...)`.
  function getProperties(props) {
    var re = [];

    $.each(props, function(key) {
      key = $.camelCase(key); // Convert "text-align" => "textAlign"
      key = $.transit.propertyMap[key] || $.cssProps[key] || key;
      key = uncamel(key); // Convert back to dasherized

      // Get vendor specify propertie
      if (support[key])
        key = uncamel(support[key]);

      if ($.inArray(key, re) === -1) { re.push(key); }
    });

    return re;
  }

  // ### getTransition()
  // Returns the transition string to be used for the `transition` CSS property.
  //
  // Example:
  //
  //     getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
  //     //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
  //
  function getTransition(properties, duration, easing, delay) {
    // Get the CSS properties needed.
    var props = getProperties(properties);

    // Account for aliases (`in` => `ease-in`).
    if ($.cssEase[easing]) { easing = $.cssEase[easing]; }

    // Build the duration/easing/delay attributes for it.
    var attribs = '' + toMS(duration) + ' ' + easing;
    if (parseInt(delay, 10) > 0) { attribs += ' ' + toMS(delay); }

    // For more properties, add them this way:
    // "margin 200ms ease, padding 200ms ease, ..."
    var transitions = [];
    $.each(props, function(i, name) {
      transitions.push(name + ' ' + attribs);
    });

    return transitions.join(', ');
  }

  // ## $.fn.transition
  // Works like $.fn.animate(), but uses CSS transitions.
  //
  //     $("...").transition({ opacity: 0.1, scale: 0.3 });
  //
  //     // Specific duration
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500);
  //
  //     // With duration and easing
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');
  //
  //     // With callback
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, function() { ... });
  //
  //     // With everything
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in', function() { ... });
  //
  //     // Alternate syntax
  //     $("...").transition({
  //       opacity: 0.1,
  //       duration: 200,
  //       delay: 40,
  //       easing: 'in',
  //       complete: function() { /* ... */ }
  //      });
  //
  $.fn.transition = $.fn.transit = function(properties, duration, easing, callback) {
    var self  = this;
    var delay = 0;
    var queue = true;

    var theseProperties = $.extend(true, {}, properties);

    // Account for `.transition(properties, callback)`.
    if (typeof duration === 'function') {
      callback = duration;
      duration = undefined;
    }

    // Account for `.transition(properties, options)`.
    if (typeof duration === 'object') {
      easing = duration.easing;
      delay = duration.delay || 0;
      queue = typeof duration.queue === "undefined" ? true : duration.queue;
      callback = duration.complete;
      duration = duration.duration;
    }

    // Account for `.transition(properties, duration, callback)`.
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    // Alternate syntax.
    if (typeof theseProperties.easing !== 'undefined') {
      easing = theseProperties.easing;
      delete theseProperties.easing;
    }

    if (typeof theseProperties.duration !== 'undefined') {
      duration = theseProperties.duration;
      delete theseProperties.duration;
    }

    if (typeof theseProperties.complete !== 'undefined') {
      callback = theseProperties.complete;
      delete theseProperties.complete;
    }

    if (typeof theseProperties.queue !== 'undefined') {
      queue = theseProperties.queue;
      delete theseProperties.queue;
    }

    if (typeof theseProperties.delay !== 'undefined') {
      delay = theseProperties.delay;
      delete theseProperties.delay;
    }

    // Set defaults. (`400` duration, `ease` easing)
    if (typeof duration === 'undefined') { duration = $.fx.speeds._default; }
    if (typeof easing === 'undefined')   { easing = $.cssEase._default; }

    duration = toMS(duration);

    // Build the `transition` property.
    var transitionValue = getTransition(theseProperties, duration, easing, delay);

    // Compute delay until callback.
    // If this becomes 0, don't bother setting the transition property.
    var work = $.transit.enabled && support.transition;
    var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

    // If there's nothing to do...
    if (i === 0) {
      var fn = function(next) {
        self.css(theseProperties);
        if (callback) { callback.apply(self); }
        if (next) { next(); }
      };

      callOrQueue(self, queue, fn);
      return self;
    }

    // Save the old transitions of each element so we can restore it later.
    var oldTransitions = {};

    var run = function(nextCall) {
      var bound = false;

      // Prepare the callback.
      var cb = function() {
        if (bound) { self.unbind(transitionEnd, cb); }

        if (i > 0) {
          self.each(function() {
            this.style[support.transition] = (oldTransitions[this] || null);
          });
        }

        if (typeof callback === 'function') { callback.apply(self); }
        if (typeof nextCall === 'function') { nextCall(); }
      };

      if ((i > 0) && (transitionEnd) && ($.transit.useTransitionEnd)) {
        // Use the 'transitionend' event if it's available.
        bound = true;
        self.bind(transitionEnd, cb);
      } else {
        // Fallback to timers if the 'transitionend' event isn't supported.
        window.setTimeout(cb, i);
      }

      // Apply transitions.
      self.each(function() {
        if (i > 0) {
          this.style[support.transition] = transitionValue;
        }
        $(this).css(theseProperties);
      });
    };

    // Defer running. This allows the browser to paint any pending CSS it hasn't
    // painted yet before doing the transitions.
    var deferredRun = function(next) {
        this.offsetWidth; // force a repaint
        run(next);
    };

    // Use jQuery's fx queue.
    callOrQueue(self, queue, deferredRun);

    // Chainability.
    return this;
  };

  function registerCssHook(prop, isPixels) {
    // For certain properties, the 'px' should not be implied.
    if (!isPixels) { $.cssNumber[prop] = true; }

    $.transit.propertyMap[prop] = support.transform;

    $.cssHooks[prop] = {
      get: function(elem) {
        var t = $(elem).css('transit:transform');
        return t.get(prop);
      },

      set: function(elem, value) {
        var t = $(elem).css('transit:transform');
        t.setFromString(prop, value);

        $(elem).css({ 'transit:transform': t });
      }
    };

  }

  // ### uncamel(str)
  // Converts a camelcase string to a dasherized string.
  // (`marginLeft` => `margin-left`)
  function uncamel(str) {
    return str.replace(/([A-Z])/g, function(letter) { return '-' + letter.toLowerCase(); });
  }

  // ### unit(number, unit)
  // Ensures that number `number` has a unit. If no unit is found, assume the
  // default is `unit`.
  //
  //     unit(2, 'px')          //=> "2px"
  //     unit("30deg", 'rad')   //=> "30deg"
  //
  function unit(i, units) {
    if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
      return i;
    } else {
      return "" + i + units;
    }
  }

  // ### toMS(duration)
  // Converts given `duration` to a millisecond string.
  //
  // toMS('fast') => $.fx.speeds[i] => "200ms"
  // toMS('normal') //=> $.fx.speeds._default => "400ms"
  // toMS(10) //=> '10ms'
  // toMS('100ms') //=> '100ms'
  //
  function toMS(duration) {
    var i = duration;

    // Allow string durations like 'fast' and 'slow', without overriding numeric values.
    if (typeof i === 'string' && (!i.match(/^[\-0-9\.]+/))) { i = $.fx.speeds[i] || $.fx.speeds._default; }

    return unit(i, 'ms');
  }

  // Export some functions for testable-ness.
  $.transit.getTransitionValue = getTransition;

  return $;
}));

},{"jquery":12}],12:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.2.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:23Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var arr = [];

var document = window.document;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "2.2.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isPlainObject: function( obj ) {
		var key;

		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype || {}, "isPrototypeOf" ) ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {

			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf( "use strict" ) === 1 ) {
				script = document.createElement( "script" );
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {

				// Otherwise, avoid the DOM node creation, insertion
				// and removal by using an indirect global eval

				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Support: Blackberry 4.6
					// gEBID returns nodes no longer in the document (#6963)
					if ( elem && elem.parentNode ) {

						// Inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE9-10 only
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	register: function( owner, initial ) {
		var value = initial || {};

		// If it is a node unlikely to be stringify-ed or looped over
		// use plain assignment
		if ( owner.nodeType ) {
			owner[ this.expando ] = value;

		// Otherwise secure it in a non-enumerable, non-writable property
		// configurability must be true to allow the property to be
		// deleted with the delete operator
		} else {
			Object.defineProperty( owner, this.expando, {
				value: value,
				writable: true,
				configurable: true
			} );
		}
		return owner[ this.expando ];
	},
	cache: function( owner ) {

		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return an empty object.
		if ( !acceptData( owner ) ) {
			return {};
		}

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ prop ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :
			owner[ this.expando ] && owner[ this.expando ][ key ];
	},
	access: function( owner, key, value ) {
		var stored;

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase( key ) );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key === undefined ) {
			this.register( owner );

		} else {

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );

				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;

			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <= 35-45+
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://code.google.com/p/chromium/issues/detail?id=378607
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data, camelKey;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// with the key as-is
				data = dataUser.get( elem, key ) ||

					// Try to find dashed key if it exists (gh-2779)
					// This is for 2.2.x only
					dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );

				if ( data !== undefined ) {
					return data;
				}

				camelKey = jQuery.camelCase( key );

				// Attempt to get data from the cache
				// with the key camelized
				data = dataUser.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			camelKey = jQuery.camelCase( key );
			this.each( function() {

				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = dataUser.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				dataUser.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
					dataUser.set( this, key, value );
				}
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE9
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0-4.3, Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
			"screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome<28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {
	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {
		div.style.cssText =

			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );
	}

	jQuery.extend( support, {
		pixelPosition: function() {

			// This test is executed only once but we still do memoizing
			// since we can use the boxSizingReliable pre-computing.
			// No need to check if the test was already performed, though.
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
			// since that compresses better and they're computed together anyway.
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		},
		reliableMarginRight: function() {

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// This support function is only executed once so no memoizing is needed.
			var ret,
				marginDiv = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			marginDiv.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;box-sizing:content-box;" +
				"display:block;margin:0;border:0;padding:0";
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			documentElement.appendChild( container );

			ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );

			documentElement.removeChild( container );
			div.removeChild( marginDiv );

			return ret;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );
	ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

	// Support: Opera 12.1x only
	// Fall back to style even without computed
	// computed is undefined for elems on document fragments
	if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
		ret = jQuery.style( elem, name );
	}

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE9-11+
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = dataPriv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = dataPriv.access(
					elem,
					"olddisplay",
					defaultDisplay( elem.nodeName )
				);
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				dataPriv.set(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				style[ name ] = value;
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = dataPriv.access( elem, "fxshow", {} );
		}

		// Store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;

			dataPriv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
		opt.duration : opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );

	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// Handle most common string cases
					ret.replace( rreturn, "" ) :

					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" ).replace( rhash, "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE8-11+
			// IE throws exception if url is malformed, e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE8-11+
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


jQuery.expr.filters.hidden = function( elem ) {
	return !jQuery.expr.filters.visible( elem );
};
jQuery.expr.filters.visible = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	// Use OR instead of AND as the element is not visible if either is true
	// See tickets #10406 and #13132
	return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE9
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE9
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		box = elem.getBoundingClientRect();
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},
	size: function() {
		return this.length;
	}
} );

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));

},{}],13:[function(require,module,exports){
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/sole/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/sole/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// Date.now shim for (ahem) Internet Explo(d|r)er
if ( Date.now === undefined ) {

	Date.now = function () {

		return new Date().valueOf();

	};

}

var TWEEN = TWEEN || ( function () {

	var _tweens = [];

	return {

		REVISION: '14',

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function ( tween ) {

			_tweens.push( tween );

		},

		remove: function ( tween ) {

			var i = _tweens.indexOf( tween );

			if ( i !== -1 ) {

				_tweens.splice( i, 1 );

			}

		},

		update: function ( time ) {

			if ( _tweens.length === 0 ) return false;

			var i = 0;

			time = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );

			while ( i < _tweens.length ) {

				if ( _tweens[ i ].update( time ) ) {

					i++;

				} else {

					_tweens.splice( i, 1 );

				}

			}

			return true;

		}
	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for ( var field in object ) {

		_valuesStart[ field ] = parseFloat(object[field], 10);

	}

	this.to = function ( properties, duration ) {

		if ( duration !== undefined ) {

			_duration = duration;

		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function ( time ) {

		TWEEN.add( this );

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
		_startTime += _delayTime;

		for ( var property in _valuesEnd ) {

			// check if an Array was provided as property value
			if ( _valuesEnd[ property ] instanceof Array ) {

				if ( _valuesEnd[ property ].length === 0 ) {

					continue;

				}

				// create a local copy of the Array with the start value at the front
				_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

			}

			_valuesStart[ property ] = _object[ property ];

			if( ( _valuesStart[ property ] instanceof Array ) === false ) {
				_valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;

		}

		return this;

	};

	this.stop = function () {

		if ( !_isPlaying ) {
			return this;
		}

		TWEEN.remove( this );
		_isPlaying = false;

		if ( _onStopCallback !== null ) {

			_onStopCallback.call( _object );

		}

		this.stopChainedTweens();
		return this;

	};

	this.stopChainedTweens = function () {

		for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

			_chainedTweens[ i ].stop();

		}

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function ( times ) {

		_repeat = times;
		return this;

	};

	this.yoyo = function( yoyo ) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function ( interpolation ) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function ( callback ) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function ( callback ) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function ( callback ) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function ( callback ) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function ( time ) {

		var property;

		if ( time < _startTime ) {

			return true;

		}

		if ( _onStartCallbackFired === false ) {

			if ( _onStartCallback !== null ) {

				_onStartCallback.call( _object );

			}

			_onStartCallbackFired = true;

		}

		var elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		var value = _easingFunction( elapsed );

		for ( property in _valuesEnd ) {

			var start = _valuesStart[ property ] || 0;
			var end = _valuesEnd[ property ];

			if ( end instanceof Array ) {

				_object[ property ] = _interpolationFunction( end, value );

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if ( typeof(end) === "string" ) {
					end = start + parseFloat(end, 10);
				}

				// protect against non numeric properties.
				if ( typeof(end) === "number" ) {
					_object[ property ] = start + ( end - start ) * value;
				}

			}

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _repeat > 0 ) {

				if( isFinite( _repeat ) ) {
					_repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for( property in _valuesStartRepeat ) {

					if ( typeof( _valuesEnd[ property ] ) === "string" ) {
						_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[ property ];
						_valuesStartRepeat[ property ] = _valuesEnd[ property ];
						_valuesEnd[ property ] = tmp;
					}

					_valuesStart[ property ] = _valuesStartRepeat[ property ];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if ( _onCompleteCallback !== null ) {

					_onCompleteCallback.call( _object );

				}

				for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

					_chainedTweens[ i ].start( time );

				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function ( k ) {

			return k;

		}

	},

	Quadratic: {

		In: function ( k ) {

			return k * k;

		},

		Out: function ( k ) {

			return k * ( 2 - k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );

		}

	},

	Cubic: {

		In: function ( k ) {

			return k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );

		}

	},

	Quartic: {

		In: function ( k ) {

			return k * k * k * k;

		},

		Out: function ( k ) {

			return 1 - ( --k * k * k * k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

		}

	},

	Quintic: {

		In: function ( k ) {

			return k * k * k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

		}

	},

	Sinusoidal: {

		In: function ( k ) {

			return 1 - Math.cos( k * Math.PI / 2 );

		},

		Out: function ( k ) {

			return Math.sin( k * Math.PI / 2 );

		},

		InOut: function ( k ) {

			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

		}

	},

	Exponential: {

		In: function ( k ) {

			return k === 0 ? 0 : Math.pow( 1024, k - 1 );

		},

		Out: function ( k ) {

			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

		},

		InOut: function ( k ) {

			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

		}

	},

	Circular: {

		In: function ( k ) {

			return 1 - Math.sqrt( 1 - k * k );

		},

		Out: function ( k ) {

			return Math.sqrt( 1 - ( --k * k ) );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

		},

		Out: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

		},

		InOut: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

		}

	},

	Back: {

		In: function ( k ) {

			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );

		},

		Out: function ( k ) {

			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;

		},

		InOut: function ( k ) {

			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

		}

	},

	Bounce: {

		In: function ( k ) {

			return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

		},

		Out: function ( k ) {

			if ( k < ( 1 / 2.75 ) ) {

				return 7.5625 * k * k;

			} else if ( k < ( 2 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

			} else if ( k < ( 2.5 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

			} else {

				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

			}

		},

		InOut: function ( k ) {

			if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
			return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

		if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
		if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

		return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

	},

	Bezier: function ( v, k ) {

		var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

		for ( i = 0; i <= n; i++ ) {
			b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
		}

		return b;

	},

	CatmullRom: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

		if ( v[ 0 ] === v[ m ] ) {

			if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

			return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

		} else {

			if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
			if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

			return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

		}

	},

	Utils: {

		Linear: function ( p0, p1, t ) {

			return ( p1 - p0 ) * t + p0;

		},

		Bernstein: function ( n , i ) {

			var fc = TWEEN.Interpolation.Utils.Factorial;
			return fc( n ) / fc( i ) / fc( n - i );

		},

		Factorial: ( function () {

			var a = [ 1 ];

			return function ( n ) {

				var s = 1, i;
				if ( a[ n ] ) return a[ n ];
				for ( i = n; i > 1; i-- ) s *= i;
				return a[ n ] = s;

			};

		} )(),

		CatmullRom: function ( p0, p1, p2, p3, t ) {

			var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		}

	}

};

module.exports=TWEEN;
},{}],14:[function(require,module,exports){
(function (global){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('underscore', factory) :
  (function() {
  	var current = global._;
  	var exports = factory();
  	global._ = exports;
  	exports.noConflict = function() { global._ = current; return exports; };
  })();
}(this, (function () {

  //     Underscore.js 1.10.2
  //     https://underscorejs.org
  //     (c) 2009-2020 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
  //     Underscore may be freely distributed under the MIT license.

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            Function('return this')() ||
            {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Create references to these builtin functions because we override them.
  var _isNaN = root.isNaN,
      _isFinite = root.isFinite;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // The Underscore object. All exported functions below are added to it in the
  // modules/index-all.js using the mixin function.
  function _(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  }

  // Current version.
  var VERSION = _.VERSION = '1.10.2';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  function optimizeCb(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  }

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  function baseIteratee(value, context, argCount) {
    if (value == null) return identity;
    if (isFunction(value)) return optimizeCb(value, context, argCount);
    if (isObject(value) && !isArray(value)) return matcher(value);
    return property(value);
  }

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = iteratee;
  function iteratee(value, context) {
    return baseIteratee(value, context, Infinity);
  }

  // The function we actually call internally. It invokes _.iteratee if
  // overridden, otherwise baseIteratee.
  function cb(value, context, argCount) {
    if (_.iteratee !== iteratee) return _.iteratee(value, context);
    return baseIteratee(value, context, argCount);
  }

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  }

  // An internal function for creating a new object that inherits from another.
  function baseCreate(prototype) {
    if (!isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  }

  function shallowProperty(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  }

  function _has(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  function deepGet(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  }

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  function isArrayLike(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  }

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  function each(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var _keys = keys(obj);
      for (i = 0, length = _keys.length; i < length; i++) {
        iteratee(obj[_keys[i]], _keys[i], obj);
      }
    }
    return obj;
  }

  // Return the results of applying the iteratee to each element.
  function map(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var _keys = !isArrayLike(obj) && keys(obj),
          length = (_keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[_keys ? _keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = _keys ? _keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  var reduce = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  var reduceRight = createReduce(-1);

  // Return the first value which passes a truth test.
  function find(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? findIndex : findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  }

  // Return all the elements that pass a truth test.
  function filter(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  }

  // Return all the elements for which a truth test fails.
  function reject(obj, predicate, context) {
    return filter(obj, negate(cb(predicate)), context);
  }

  // Determine whether all of the elements match a truth test.
  function every(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  }

  // Determine if at least one element in the object matches a truth test.
  function some(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  }

  // Determine if the array or object contains a given item (using `===`).
  function contains(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return indexOf(obj, item, fromIndex) >= 0;
  }

  // Invoke a method (with arguments) on every item in a collection.
  var invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (isFunction(path)) {
      func = path;
    } else if (isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  function pluck(obj, key) {
    return map(obj, property(key));
  }

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  function where(obj, attrs) {
    return filter(obj, matcher(attrs));
  }

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  function findWhere(obj, attrs) {
    return find(obj, matcher(attrs));
  }

  // Return the maximum element (or element-based computation).
  function max(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Return the minimum element (or element-based computation).
  function min(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Shuffle a collection.
  function shuffle(obj) {
    return sample(obj, Infinity);
  }

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  function sample(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = values(obj);
      return obj[random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? clone(obj) : values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  }

  // Sort the object's values by a criterion produced by an iteratee.
  function sortBy(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return pluck(map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  }

  // An internal function used for aggregate "group by" operations.
  function group(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  }

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  var groupBy = group(function(result, value, key) {
    if (_has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  var indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  var countBy = group(function(result, value, key) {
    if (_has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  function toArray(obj) {
    if (!obj) return [];
    if (isArray(obj)) return slice.call(obj);
    if (isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return map(obj, identity);
    return values(obj);
  }

  // Return the number of elements in an object.
  function size(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : keys(obj).length;
  }

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  var partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. The **guard** check allows it to work with `map`.
  function first(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return initial(array, array.length - n);
  }

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  function initial(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  }

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  function last(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return rest(array, Math.max(0, array.length - n));
  }

  // Returns everything but the first entry of the array. Especially useful on
  // the arguments object. Passing an **n** will return the rest N values in the
  // array.
  function rest(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  }

  // Trim out all falsy values from an array.
  function compact(array) {
    return filter(array, Boolean);
  }

  // Internal implementation of a recursive `flatten` function.
  function _flatten(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (isArray(value) || isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          _flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }

  // Flatten out an array, either recursively (by default), or just one level.
  function flatten(array, shallow) {
    return _flatten(array, shallow, false);
  }

  // Return a version of the array that does not contain the specified value(s).
  var without = restArguments(function(array, otherArrays) {
    return difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  function uniq(array, isSorted, iteratee, context) {
    if (!isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  }

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  var union = restArguments(function(arrays) {
    return uniq(_flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  function intersection(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  }

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  var difference = restArguments(function(array, rest) {
    rest = _flatten(rest, true, true);
    return filter(array, function(value){
      return !contains(rest, value);
    });
  });

  // Complement of zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  function unzip(array) {
    var length = array && max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = pluck(array, index);
    }
    return result;
  }

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  var zip = restArguments(unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of pairs.
  function object(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  }

  // Generator function to create the findIndex and findLastIndex functions.
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test.
  var findIndex = createPredicateIndexFinder(1);
  var findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  function sortedIndex(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  }

  // Generator function to create the indexOf and lastIndexOf functions.
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  var indexOf = createIndexFinder(1, findIndex, sortedIndex);
  var lastIndexOf = createIndexFinder(-1, findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](https://docs.python.org/library/functions.html#range).
  function range(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  }

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  function chunk(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  }

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (isObject(result)) return result;
    return self;
  }

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  var bind = restArguments(function(func, context, args) {
    if (!isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `partial.placeholder` for a custom placeholder argument.
  var partial = restArguments(function(func, boundArgs) {
    var placeholder = partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  var bindAll = restArguments(function(obj, _keys) {
    _keys = _flatten(_keys, false, false);
    var index = _keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = _keys[index];
      obj[key] = bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  }

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  var delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  var defer = partial(delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var _now = now();
      if (!previous && options.leading === false) previous = _now;
      var remaining = wait - (_now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = _now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  }

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  function wrap(func, wrapper) {
    return partial(wrapper, func);
  }

  // Returns a negated version of the passed-in predicate.
  function negate(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  }

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  function compose() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  }

  // Returns a function that will only be executed on and after the Nth call.
  function after(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  // Returns a function that will only be executed up to (but not including) the Nth call.
  function before(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  }

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  var once = partial(before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, _keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_has(obj, prop) && !contains(_keys, prop)) _keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !contains(_keys, prop)) {
        _keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  function keys(obj) {
    if (!isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var _keys = [];
    for (var key in obj) if (_has(obj, key)) _keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, _keys);
    return _keys;
  }

  // Retrieve all the property names of an object.
  function allKeys(obj) {
    if (!isObject(obj)) return [];
    var _keys = [];
    for (var key in obj) _keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, _keys);
    return _keys;
  }

  // Retrieve the values of an object's properties.
  function values(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[_keys[i]];
    }
    return values;
  }

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to map it returns an object.
  function mapObject(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = keys(obj),
        length = _keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = _keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of object.
  function pairs(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [_keys[i], obj[_keys[i]]];
    }
    return pairs;
  }

  // Invert the keys and values of an object. The values must be serializable.
  function invert(obj) {
    var result = {};
    var _keys = keys(obj);
    for (var i = 0, length = _keys.length; i < length; i++) {
      result[obj[_keys[i]]] = _keys[i];
    }
    return result;
  }

  // Return a sorted list of the function names available on the object.
  function functions(obj) {
    var names = [];
    for (var key in obj) {
      if (isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  }

  // An internal function for creating assigner functions.
  function createAssigner(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            _keys = keysFunc(source),
            l = _keys.length;
        for (var i = 0; i < l; i++) {
          var key = _keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  }

  // Extend a given object with all the properties in passed-in object(s).
  var extend = createAssigner(allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  var extendOwn = createAssigner(keys);

  // Returns the first key on an object that passes a predicate test.
  function findKey(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = keys(obj), key;
    for (var i = 0, length = _keys.length; i < length; i++) {
      key = _keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  }

  // Internal pick helper function to determine if `obj` has key `key`.
  function keyInObj(value, key, obj) {
    return key in obj;
  }

  // Return a copy of the object only containing the whitelisted properties.
  var pick = restArguments(function(obj, _keys) {
    var result = {}, iteratee = _keys[0];
    if (obj == null) return result;
    if (isFunction(iteratee)) {
      if (_keys.length > 1) iteratee = optimizeCb(iteratee, _keys[1]);
      _keys = allKeys(obj);
    } else {
      iteratee = keyInObj;
      _keys = _flatten(_keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = _keys.length; i < length; i++) {
      var key = _keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  var omit = restArguments(function(obj, _keys) {
    var iteratee = _keys[0], context;
    if (isFunction(iteratee)) {
      iteratee = negate(iteratee);
      if (_keys.length > 1) context = _keys[1];
    } else {
      _keys = map(_flatten(_keys, false, false), String);
      iteratee = function(value, key) {
        return !contains(_keys, key);
      };
    }
    return pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  var defaults = createAssigner(allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  function create(prototype, props) {
    var result = baseCreate(prototype);
    if (props) extendOwn(result, props);
    return result;
  }

  // Create a (shallow-cloned) duplicate of an object.
  function clone(obj) {
    if (!isObject(obj)) return obj;
    return isArray(obj) ? obj.slice() : extend({}, obj);
  }

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
  }

  // Returns whether an object has a given set of `key:value` pairs.
  function isMatch(object, attrs) {
    var _keys = keys(attrs), length = _keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = _keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  }


  // Internal recursive comparison function for `isEqual`.
  function eq(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  }

  // Internal recursive comparison function for `isEqual`.
  function deepEq(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
                               isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var _keys = keys(a), key;
      length = _keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = _keys[length];
        if (!(_has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  }

  // Perform a deep comparison to check if two objects are equal.
  function isEqual(a, b) {
    return eq(a, b);
  }

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  function isEmpty(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (isArray(obj) || isString(obj) || isArguments(obj))) return obj.length === 0;
    return keys(obj).length === 0;
  }

  // Is a given value a DOM element?
  function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
  }

  // Internal function for creating a toString-based type tester.
  function tagTester(name) {
    return function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  }

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  var isArray = nativeIsArray || tagTester('Array');

  // Is a given variable an object?
  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  var isArguments = tagTester('Arguments');
  var isFunction = tagTester('Function');
  var isString = tagTester('String');
  var isNumber = tagTester('Number');
  var isDate = tagTester('Date');
  var isRegExp = tagTester('RegExp');
  var isError = tagTester('Error');
  var isSymbol = tagTester('Symbol');
  var isMap = tagTester('Map');
  var isWeakMap = tagTester('WeakMap');
  var isSet = tagTester('Set');
  var isWeakSet = tagTester('WeakSet');

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  (function() {
    if (!isArguments(arguments)) {
      isArguments = function(obj) {
        return _has(obj, 'callee');
      };
    }
  }());

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  function isFinite(obj) {
    return !isSymbol(obj) && _isFinite(obj) && !_isNaN(parseFloat(obj));
  }

  // Is the given value `NaN`?
  function isNaN(obj) {
    return isNumber(obj) && _isNaN(obj);
  }

  // Is a given value a boolean?
  function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  }

  // Is a given value equal to null?
  function isNull(obj) {
    return obj === null;
  }

  // Is a given variable undefined?
  function isUndefined(obj) {
    return obj === void 0;
  }

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  function has(obj, path) {
    if (!isArray(path)) {
      return _has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  }

  // Utility Functions
  // -----------------

  // Keep the identity function around for default iteratees.
  function identity(value) {
    return value;
  }

  // Predicate-generating functions. Often useful outside of Underscore.
  function constant(value) {
    return function() {
      return value;
    };
  }

  function noop(){}

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  function property(path) {
    if (!isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  }

  // Generates a function for a given object that returns a given property.
  function propertyOf(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !isArray(path) ? obj[path] : deepGet(obj, path);
    };
  }

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  function matcher(attrs) {
    attrs = extendOwn({}, attrs);
    return function(obj) {
      return isMatch(obj, attrs);
    };
  }

  // Run a function **n** times.
  function times(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  }

  // Return a random integer between min and max (inclusive).
  function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  // A (possibly faster) way to get the current timestamp as an integer.
  var now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  function createEscaper(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  }
  var escape = createEscaper(escapeMap);
  var unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  function result(obj, path, fallback) {
    if (!isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  }

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  function uniqueId(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  }

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  var templateSettings = _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  function template(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  }

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  function chain(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  }

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  function chainResult(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  }

  // Add your own custom functions to the Underscore object.
  function mixin(obj) {
    each(functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  }

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  var allExports = ({
    'default': _,
    VERSION: VERSION,
    iteratee: iteratee,
    restArguments: restArguments,
    each: each,
    forEach: each,
    map: map,
    collect: map,
    reduce: reduce,
    foldl: reduce,
    inject: reduce,
    reduceRight: reduceRight,
    foldr: reduceRight,
    find: find,
    detect: find,
    filter: filter,
    select: filter,
    reject: reject,
    every: every,
    all: every,
    some: some,
    any: some,
    contains: contains,
    includes: contains,
    include: contains,
    invoke: invoke,
    pluck: pluck,
    where: where,
    findWhere: findWhere,
    max: max,
    min: min,
    shuffle: shuffle,
    sample: sample,
    sortBy: sortBy,
    groupBy: groupBy,
    indexBy: indexBy,
    countBy: countBy,
    toArray: toArray,
    size: size,
    partition: partition,
    first: first,
    head: first,
    take: first,
    initial: initial,
    last: last,
    rest: rest,
    tail: rest,
    drop: rest,
    compact: compact,
    flatten: flatten,
    without: without,
    uniq: uniq,
    unique: uniq,
    union: union,
    intersection: intersection,
    difference: difference,
    unzip: unzip,
    zip: zip,
    object: object,
    findIndex: findIndex,
    findLastIndex: findLastIndex,
    sortedIndex: sortedIndex,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    range: range,
    chunk: chunk,
    bind: bind,
    partial: partial,
    bindAll: bindAll,
    memoize: memoize,
    delay: delay,
    defer: defer,
    throttle: throttle,
    debounce: debounce,
    wrap: wrap,
    negate: negate,
    compose: compose,
    after: after,
    before: before,
    once: once,
    keys: keys,
    allKeys: allKeys,
    values: values,
    mapObject: mapObject,
    pairs: pairs,
    invert: invert,
    functions: functions,
    methods: functions,
    extend: extend,
    extendOwn: extendOwn,
    assign: extendOwn,
    findKey: findKey,
    pick: pick,
    omit: omit,
    defaults: defaults,
    create: create,
    clone: clone,
    tap: tap,
    isMatch: isMatch,
    isEqual: isEqual,
    isEmpty: isEmpty,
    isElement: isElement,
    isArray: isArray,
    isObject: isObject,
    isArguments: isArguments,
    isFunction: isFunction,
    isString: isString,
    isNumber: isNumber,
    isDate: isDate,
    isRegExp: isRegExp,
    isError: isError,
    isSymbol: isSymbol,
    isMap: isMap,
    isWeakMap: isWeakMap,
    isSet: isSet,
    isWeakSet: isWeakSet,
    isFinite: isFinite,
    isNaN: isNaN,
    isBoolean: isBoolean,
    isNull: isNull,
    isUndefined: isUndefined,
    has: has,
    identity: identity,
    constant: constant,
    noop: noop,
    property: property,
    propertyOf: propertyOf,
    matcher: matcher,
    matches: matcher,
    times: times,
    random: random,
    now: now,
    escape: escape,
    unescape: unescape,
    result: result,
    uniqueId: uniqueId,
    templateSettings: templateSettings,
    template: template,
    chain: chain,
    mixin: mixin
  });

  // Add all of the Underscore functions to the wrapper object.
  var _$1 = mixin(allExports);
  // Legacy Node.js API
  _$1._ = _$1;

  return _$1;

})));


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZSgndW5kZXJzY29yZScsIGZhY3RvcnkpIDpcbiAgKGZ1bmN0aW9uKCkge1xuICBcdHZhciBjdXJyZW50ID0gZ2xvYmFsLl87XG4gIFx0dmFyIGV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIFx0Z2xvYmFsLl8gPSBleHBvcnRzO1xuICBcdGV4cG9ydHMubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkgeyBnbG9iYWwuXyA9IGN1cnJlbnQ7IHJldHVybiBleHBvcnRzOyB9O1xuICB9KSgpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkge1xuXG4gIC8vICAgICBVbmRlcnNjb3JlLmpzIDEuMTAuMlxuICAvLyAgICAgaHR0cHM6Ly91bmRlcnNjb3JlanMub3JnXG4gIC8vICAgICAoYykgMjAwOS0yMDIwIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gIC8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgKGBzZWxmYCkgaW4gdGhlIGJyb3dzZXIsIGBnbG9iYWxgXG4gIC8vIG9uIHRoZSBzZXJ2ZXIsIG9yIGB0aGlzYCBpbiBzb21lIHZpcnR1YWwgbWFjaGluZXMuIFdlIHVzZSBgc2VsZmBcbiAgLy8gaW5zdGVhZCBvZiBgd2luZG93YCBmb3IgYFdlYldvcmtlcmAgc3VwcG9ydC5cbiAgdmFyIHJvb3QgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmLnNlbGYgPT09IHNlbGYgJiYgc2VsZiB8fFxuICAgICAgICAgICAgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwuZ2xvYmFsID09PSBnbG9iYWwgJiYgZ2xvYmFsIHx8XG4gICAgICAgICAgICBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpIHx8XG4gICAgICAgICAgICB7fTtcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgU3ltYm9sUHJvdG8gPSB0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyA/IFN5bWJvbC5wcm90b3R5cGUgOiBudWxsO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXIgcHVzaCA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICAgIHNsaWNlID0gQXJyYXlQcm90by5zbGljZSxcbiAgICAgIHRvU3RyaW5nID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgICBoYXNPd25Qcm9wZXJ0eSA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyIG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5LFxuICAgICAgbmF0aXZlS2V5cyA9IE9iamVjdC5rZXlzLFxuICAgICAgbmF0aXZlQ3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuICAvLyBDcmVhdGUgcmVmZXJlbmNlcyB0byB0aGVzZSBidWlsdGluIGZ1bmN0aW9ucyBiZWNhdXNlIHdlIG92ZXJyaWRlIHRoZW0uXG4gIHZhciBfaXNOYU4gPSByb290LmlzTmFOLFxuICAgICAgX2lzRmluaXRlID0gcm9vdC5pc0Zpbml0ZTtcblxuICAvLyBOYWtlZCBmdW5jdGlvbiByZWZlcmVuY2UgZm9yIHN1cnJvZ2F0ZS1wcm90b3R5cGUtc3dhcHBpbmcuXG4gIHZhciBDdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4gIC8vIFRoZSBVbmRlcnNjb3JlIG9iamVjdC4gQWxsIGV4cG9ydGVkIGZ1bmN0aW9ucyBiZWxvdyBhcmUgYWRkZWQgdG8gaXQgaW4gdGhlXG4gIC8vIG1vZHVsZXMvaW5kZXgtYWxsLmpzIHVzaW5nIHRoZSBtaXhpbiBmdW5jdGlvbi5cbiAgZnVuY3Rpb24gXyhvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIHZhciBWRVJTSU9OID0gXy5WRVJTSU9OID0gJzEuMTAuMic7XG5cbiAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVmZmljaWVudCAoZm9yIGN1cnJlbnQgZW5naW5lcykgdmVyc2lvblxuICAvLyBvZiB0aGUgcGFzc2VkLWluIGNhbGxiYWNrLCB0byBiZSByZXBlYXRlZGx5IGFwcGxpZWQgaW4gb3RoZXIgVW5kZXJzY29yZVxuICAvLyBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIG9wdGltaXplQ2IoZnVuYywgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAoY29udGV4dCA9PT0gdm9pZCAwKSByZXR1cm4gZnVuYztcbiAgICBzd2l0Y2ggKGFyZ0NvdW50ID09IG51bGwgPyAzIDogYXJnQ291bnQpIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICAgIC8vIFRoZSAyLWFyZ3VtZW50IGNhc2UgaXMgb21pdHRlZCBiZWNhdXNlIHdl4oCZcmUgbm90IHVzaW5nIGl0LlxuICAgICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBjYWxsYmFja3MgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBlYWNoXG4gIC8vIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uLCByZXR1cm5pbmcgdGhlIGRlc2lyZWQgcmVzdWx0IOKAlCBlaXRoZXIgYGlkZW50aXR5YCxcbiAgLy8gYW4gYXJiaXRyYXJ5IGNhbGxiYWNrLCBhIHByb3BlcnR5IG1hdGNoZXIsIG9yIGEgcHJvcGVydHkgYWNjZXNzb3IuXG4gIGZ1bmN0aW9uIGJhc2VJdGVyYXRlZSh2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIGlkZW50aXR5O1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIG9wdGltaXplQ2IodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KTtcbiAgICBpZiAoaXNPYmplY3QodmFsdWUpICYmICFpc0FycmF5KHZhbHVlKSkgcmV0dXJuIG1hdGNoZXIodmFsdWUpO1xuICAgIHJldHVybiBwcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICAvLyBFeHRlcm5hbCB3cmFwcGVyIGZvciBvdXIgY2FsbGJhY2sgZ2VuZXJhdG9yLiBVc2VycyBtYXkgY3VzdG9taXplXG4gIC8vIGBfLml0ZXJhdGVlYCBpZiB0aGV5IHdhbnQgYWRkaXRpb25hbCBwcmVkaWNhdGUvaXRlcmF0ZWUgc2hvcnRoYW5kIHN0eWxlcy5cbiAgLy8gVGhpcyBhYnN0cmFjdGlvbiBoaWRlcyB0aGUgaW50ZXJuYWwtb25seSBhcmdDb3VudCBhcmd1bWVudC5cbiAgXy5pdGVyYXRlZSA9IGl0ZXJhdGVlO1xuICBmdW5jdGlvbiBpdGVyYXRlZSh2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBiYXNlSXRlcmF0ZWUodmFsdWUsIGNvbnRleHQsIEluZmluaXR5KTtcbiAgfVxuXG4gIC8vIFRoZSBmdW5jdGlvbiB3ZSBhY3R1YWxseSBjYWxsIGludGVybmFsbHkuIEl0IGludm9rZXMgXy5pdGVyYXRlZSBpZlxuICAvLyBvdmVycmlkZGVuLCBvdGhlcndpc2UgYmFzZUl0ZXJhdGVlLlxuICBmdW5jdGlvbiBjYih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAoXy5pdGVyYXRlZSAhPT0gaXRlcmF0ZWUpIHJldHVybiBfLml0ZXJhdGVlKHZhbHVlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gYmFzZUl0ZXJhdGVlKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCk7XG4gIH1cblxuICAvLyBTb21lIGZ1bmN0aW9ucyB0YWtlIGEgdmFyaWFibGUgbnVtYmVyIG9mIGFyZ3VtZW50cywgb3IgYSBmZXcgZXhwZWN0ZWRcbiAgLy8gYXJndW1lbnRzIGF0IHRoZSBiZWdpbm5pbmcgYW5kIHRoZW4gYSB2YXJpYWJsZSBudW1iZXIgb2YgdmFsdWVzIHRvIG9wZXJhdGVcbiAgLy8gb24uIFRoaXMgaGVscGVyIGFjY3VtdWxhdGVzIGFsbCByZW1haW5pbmcgYXJndW1lbnRzIHBhc3QgdGhlIGZ1bmN0aW9u4oCZc1xuICAvLyBhcmd1bWVudCBsZW5ndGggKG9yIGFuIGV4cGxpY2l0IGBzdGFydEluZGV4YCksIGludG8gYW4gYXJyYXkgdGhhdCBiZWNvbWVzXG4gIC8vIHRoZSBsYXN0IGFyZ3VtZW50LiBTaW1pbGFyIHRvIEVTNuKAmXMgXCJyZXN0IHBhcmFtZXRlclwiLlxuICBmdW5jdGlvbiByZXN0QXJndW1lbnRzKGZ1bmMsIHN0YXJ0SW5kZXgpIHtcbiAgICBzdGFydEluZGV4ID0gc3RhcnRJbmRleCA9PSBudWxsID8gZnVuYy5sZW5ndGggLSAxIDogK3N0YXJ0SW5kZXg7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KGFyZ3VtZW50cy5sZW5ndGggLSBzdGFydEluZGV4LCAwKSxcbiAgICAgICAgICByZXN0ID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICBmb3IgKDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgcmVzdFtpbmRleF0gPSBhcmd1bWVudHNbaW5kZXggKyBzdGFydEluZGV4XTtcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAoc3RhcnRJbmRleCkge1xuICAgICAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpcywgcmVzdCk7XG4gICAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmd1bWVudHNbMF0sIHJlc3QpO1xuICAgICAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0sIHJlc3QpO1xuICAgICAgfVxuICAgICAgdmFyIGFyZ3MgPSBBcnJheShzdGFydEluZGV4ICsgMSk7XG4gICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBzdGFydEluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGFyZ3NbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4XTtcbiAgICAgIH1cbiAgICAgIGFyZ3Nbc3RhcnRJbmRleF0gPSByZXN0O1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIGFub3RoZXIuXG4gIGZ1bmN0aW9uIGJhc2VDcmVhdGUocHJvdG90eXBlKSB7XG4gICAgaWYgKCFpc09iamVjdChwcm90b3R5cGUpKSByZXR1cm4ge307XG4gICAgaWYgKG5hdGl2ZUNyZWF0ZSkgcmV0dXJuIG5hdGl2ZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIEN0b3IucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgIHZhciByZXN1bHQgPSBuZXcgQ3RvcjtcbiAgICBDdG9yLnByb3RvdHlwZSA9IG51bGw7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNoYWxsb3dQcm9wZXJ0eShrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09IG51bGwgPyB2b2lkIDAgOiBvYmpba2V5XTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2hhcyhvYmosIHBhdGgpIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHBhdGgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVlcEdldChvYmosIHBhdGgpIHtcbiAgICB2YXIgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgICAgb2JqID0gb2JqW3BhdGhbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gbGVuZ3RoID8gb2JqIDogdm9pZCAwO1xuICB9XG5cbiAgLy8gSGVscGVyIGZvciBjb2xsZWN0aW9uIG1ldGhvZHMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2xsZWN0aW9uXG4gIC8vIHNob3VsZCBiZSBpdGVyYXRlZCBhcyBhbiBhcnJheSBvciBhcyBhbiBvYmplY3QuXG4gIC8vIFJlbGF0ZWQ6IGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aFxuICAvLyBBdm9pZHMgYSB2ZXJ5IG5hc3R5IGlPUyA4IEpJVCBidWcgb24gQVJNLTY0LiAjMjA5NFxuICB2YXIgTUFYX0FSUkFZX0lOREVYID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcbiAgdmFyIGdldExlbmd0aCA9IHNoYWxsb3dQcm9wZXJ0eSgnbGVuZ3RoJyk7XG4gIGZ1bmN0aW9uIGlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiB0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInICYmIGxlbmd0aCA+PSAwICYmIGxlbmd0aCA8PSBNQVhfQVJSQVlfSU5ERVg7XG4gIH1cblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIHJhdyBvYmplY3RzIGluIGFkZGl0aW9uIHRvIGFycmF5LWxpa2VzLiBUcmVhdHMgYWxsXG4gIC8vIHNwYXJzZSBhcnJheS1saWtlcyBhcyBpZiB0aGV5IHdlcmUgZGVuc2UuXG4gIGZ1bmN0aW9uIGVhY2gob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGksIGxlbmd0aDtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtpXSwgaSwgb2JqKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIF9rZXlzID0ga2V5cyhvYmopO1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gX2tleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW19rZXlzW2ldXSwgX2tleXNbaV0sIG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudC5cbiAgZnVuY3Rpb24gbWFwKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgX2tleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBrZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChfa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0cyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBfa2V5cyA/IF9rZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgcmVzdWx0c1tpbmRleF0gPSBpdGVyYXRlZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGEgcmVkdWNpbmcgZnVuY3Rpb24gaXRlcmF0aW5nIGxlZnQgb3IgcmlnaHQuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlZHVjZShkaXIpIHtcbiAgICAvLyBXcmFwIGNvZGUgdGhhdCByZWFzc2lnbnMgYXJndW1lbnQgdmFyaWFibGVzIGluIGEgc2VwYXJhdGUgZnVuY3Rpb24gdGhhblxuICAgIC8vIHRoZSBvbmUgdGhhdCBhY2Nlc3NlcyBgYXJndW1lbnRzLmxlbmd0aGAgdG8gYXZvaWQgYSBwZXJmIGhpdC4gKCMxOTkxKVxuICAgIHZhciByZWR1Y2VyID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgaW5pdGlhbCkge1xuICAgICAgdmFyIF9rZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYga2V5cyhvYmopLFxuICAgICAgICAgIGxlbmd0aCA9IChfa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgICBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gb2JqW19rZXlzID8gX2tleXNbaW5kZXhdIDogaW5kZXhdO1xuICAgICAgICBpbmRleCArPSBkaXI7XG4gICAgICB9XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIHZhciBjdXJyZW50S2V5ID0gX2tleXMgPyBfa2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdGVlKG1lbW8sIG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgY29udGV4dCkge1xuICAgICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID49IDM7XG4gICAgICByZXR1cm4gcmVkdWNlcihvYmosIG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDQpLCBtZW1vLCBpbml0aWFsKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLlxuICB2YXIgcmVkdWNlID0gY3JlYXRlUmVkdWNlKDEpO1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICB2YXIgcmVkdWNlUmlnaHQgPSBjcmVhdGVSZWR1Y2UoLTEpO1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC5cbiAgZnVuY3Rpb24gZmluZChvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBrZXlGaW5kZXIgPSBpc0FycmF5TGlrZShvYmopID8gZmluZEluZGV4IDogZmluZEtleTtcbiAgICB2YXIga2V5ID0ga2V5RmluZGVyKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBpZiAoa2V5ICE9PSB2b2lkIDAgJiYga2V5ICE9PSAtMSkgcmV0dXJuIG9ialtrZXldO1xuICB9XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgZnVuY3Rpb24gZmlsdGVyKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGZvciB3aGljaCBhIHRydXRoIHRlc3QgZmFpbHMuXG4gIGZ1bmN0aW9uIHJlamVjdChvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBmaWx0ZXIob2JqLCBuZWdhdGUoY2IocHJlZGljYXRlKSksIGNvbnRleHQpO1xuICB9XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIGZ1bmN0aW9uIGV2ZXJ5KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgX2tleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBrZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChfa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IF9rZXlzID8gX2tleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAoIXByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgZnVuY3Rpb24gc29tZShvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIF9rZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYga2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoX2tleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBfa2V5cyA/IF9rZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIGl0ZW0gKHVzaW5nIGA9PT1gKS5cbiAgZnVuY3Rpb24gY29udGFpbnMob2JqLCBpdGVtLCBmcm9tSW5kZXgsIGd1YXJkKSB7XG4gICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSB2YWx1ZXMob2JqKTtcbiAgICBpZiAodHlwZW9mIGZyb21JbmRleCAhPSAnbnVtYmVyJyB8fCBndWFyZCkgZnJvbUluZGV4ID0gMDtcbiAgICByZXR1cm4gaW5kZXhPZihvYmosIGl0ZW0sIGZyb21JbmRleCkgPj0gMDtcbiAgfVxuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICB2YXIgaW52b2tlID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihvYmosIHBhdGgsIGFyZ3MpIHtcbiAgICB2YXIgY29udGV4dFBhdGgsIGZ1bmM7XG4gICAgaWYgKGlzRnVuY3Rpb24ocGF0aCkpIHtcbiAgICAgIGZ1bmMgPSBwYXRoO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShwYXRoKSkge1xuICAgICAgY29udGV4dFBhdGggPSBwYXRoLnNsaWNlKDAsIC0xKTtcbiAgICAgIHBhdGggPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XG4gICAgfVxuICAgIHJldHVybiBtYXAob2JqLCBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICB2YXIgbWV0aG9kID0gZnVuYztcbiAgICAgIGlmICghbWV0aG9kKSB7XG4gICAgICAgIGlmIChjb250ZXh0UGF0aCAmJiBjb250ZXh0UGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICBjb250ZXh0ID0gZGVlcEdldChjb250ZXh0LCBjb250ZXh0UGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbnRleHQgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgbWV0aG9kID0gY29udGV4dFtwYXRoXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZXRob2QgPT0gbnVsbCA/IG1ldGhvZCA6IG1ldGhvZC5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgZnVuY3Rpb24gcGx1Y2sob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gbWFwKG9iaiwgcHJvcGVydHkoa2V5KSk7XG4gIH1cblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIGZ1bmN0aW9uIHdoZXJlKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gZmlsdGVyKG9iaiwgbWF0Y2hlcihhdHRycykpO1xuICB9XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBmdW5jdGlvbiBmaW5kV2hlcmUob2JqLCBhdHRycykge1xuICAgIHJldHVybiBmaW5kKG9iaiwgbWF0Y2hlcihhdHRycykpO1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBmdW5jdGlvbiBtYXgob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSAtSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IC1JbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsIHx8IHR5cGVvZiBpdGVyYXRlZSA9PSAnbnVtYmVyJyAmJiB0eXBlb2Ygb2JqWzBdICE9ICdvYmplY3QnICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogdmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgZWFjaChvYmosIGZ1bmN0aW9uKHYsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodiwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IC1JbmZpbml0eSAmJiByZXN1bHQgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHY7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBmdW5jdGlvbiBtaW4ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSBJbmZpbml0eSwgbGFzdENvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCB8fCB0eXBlb2YgaXRlcmF0ZWUgPT0gJ251bWJlcicgJiYgdHlwZW9mIG9ialswXSAhPSAnb2JqZWN0JyAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IHZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPCByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIGVhY2gob2JqLCBmdW5jdGlvbih2LCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHYsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkIDwgbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSBJbmZpbml0eSAmJiByZXN1bHQgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdjtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBTaHVmZmxlIGEgY29sbGVjdGlvbi5cbiAgZnVuY3Rpb24gc2h1ZmZsZShvYmopIHtcbiAgICByZXR1cm4gc2FtcGxlKG9iaiwgSW5maW5pdHkpO1xuICB9XG5cbiAgLy8gU2FtcGxlICoqbioqIHJhbmRvbSB2YWx1ZXMgZnJvbSBhIGNvbGxlY3Rpb24gdXNpbmcgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZVxuICAvLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlcuKAk1lhdGVzX3NodWZmbGUpLlxuICAvLyBJZiAqKm4qKiBpcyBub3Qgc3BlY2lmaWVkLCByZXR1cm5zIGEgc2luZ2xlIHJhbmRvbSBlbGVtZW50LlxuICAvLyBUaGUgaW50ZXJuYWwgYGd1YXJkYCBhcmd1bWVudCBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBtYXBgLlxuICBmdW5jdGlvbiBzYW1wbGUob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gdmFsdWVzKG9iaik7XG4gICAgICByZXR1cm4gb2JqW3JhbmRvbShvYmoubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICB2YXIgc2FtcGxlID0gaXNBcnJheUxpa2Uob2JqKSA/IGNsb25lKG9iaikgOiB2YWx1ZXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKHNhbXBsZSk7XG4gICAgbiA9IE1hdGgubWF4KE1hdGgubWluKG4sIGxlbmd0aCksIDApO1xuICAgIHZhciBsYXN0ID0gbGVuZ3RoIC0gMTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbjsgaW5kZXgrKykge1xuICAgICAgdmFyIHJhbmQgPSByYW5kb20oaW5kZXgsIGxhc3QpO1xuICAgICAgdmFyIHRlbXAgPSBzYW1wbGVbaW5kZXhdO1xuICAgICAgc2FtcGxlW2luZGV4XSA9IHNhbXBsZVtyYW5kXTtcbiAgICAgIHNhbXBsZVtyYW5kXSA9IHRlbXA7XG4gICAgfVxuICAgIHJldHVybiBzYW1wbGUuc2xpY2UoMCwgbik7XG4gIH1cblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0ZWUuXG4gIGZ1bmN0aW9uIHNvcnRCeShvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gcGx1Y2sobWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgbGlzdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBpbmRleDogaW5kZXgrKyxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdGVlKHZhbHVlLCBrZXksIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH1cblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIGZ1bmN0aW9uIGdyb3VwKGJlaGF2aW9yLCBwYXJ0aXRpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHBhcnRpdGlvbiA/IFtbXSwgW11dIDoge307XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGtleSA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgICAgYmVoYXZpb3IocmVzdWx0LCB2YWx1ZSwga2V5KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgdmFyIGdyb3VwQnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoX2hhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldLnB1c2godmFsdWUpOyBlbHNlIHJlc3VsdFtrZXldID0gW3ZhbHVlXTtcbiAgfSk7XG5cbiAgLy8gSW5kZXhlcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLCBzaW1pbGFyIHRvIGBncm91cEJ5YCwgYnV0IGZvclxuICAvLyB3aGVuIHlvdSBrbm93IHRoYXQgeW91ciBpbmRleCB2YWx1ZXMgd2lsbCBiZSB1bmlxdWUuXG4gIHZhciBpbmRleEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIHZhciBjb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF9oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XSsrOyBlbHNlIHJlc3VsdFtrZXldID0gMTtcbiAgfSk7XG5cbiAgdmFyIHJlU3RyU3ltYm9sID0gL1teXFx1ZDgwMC1cXHVkZmZmXXxbXFx1ZDgwMC1cXHVkYmZmXVtcXHVkYzAwLVxcdWRmZmZdfFtcXHVkODAwLVxcdWRmZmZdL2c7XG4gIC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG4gIGZ1bmN0aW9uIHRvQXJyYXkob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoaXNBcnJheShvYmopKSByZXR1cm4gc2xpY2UuY2FsbChvYmopO1xuICAgIGlmIChpc1N0cmluZyhvYmopKSB7XG4gICAgICAvLyBLZWVwIHN1cnJvZ2F0ZSBwYWlyIGNoYXJhY3RlcnMgdG9nZXRoZXJcbiAgICAgIHJldHVybiBvYmoubWF0Y2gocmVTdHJTeW1ib2wpO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkgcmV0dXJuIG1hcChvYmosIGlkZW50aXR5KTtcbiAgICByZXR1cm4gdmFsdWVzKG9iaik7XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIGZ1bmN0aW9uIHNpemUob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gaXNBcnJheUxpa2Uob2JqKSA/IG9iai5sZW5ndGggOiBrZXlzKG9iaikubGVuZ3RoO1xuICB9XG5cbiAgLy8gU3BsaXQgYSBjb2xsZWN0aW9uIGludG8gdHdvIGFycmF5czogb25lIHdob3NlIGVsZW1lbnRzIGFsbCBzYXRpc2Z5IHRoZSBnaXZlblxuICAvLyBwcmVkaWNhdGUsIGFuZCBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIGRvIG5vdCBzYXRpc2Z5IHRoZSBwcmVkaWNhdGUuXG4gIHZhciBwYXJ0aXRpb24gPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBwYXNzKSB7XG4gICAgcmVzdWx0W3Bhc3MgPyAwIDogMV0ucHVzaCh2YWx1ZSk7XG4gIH0sIHRydWUpO1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKiBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBtYXBgLlxuICBmdW5jdGlvbiBmaXJzdChhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCB8fCBhcnJheS5sZW5ndGggPCAxKSByZXR1cm4gbiA9PSBudWxsID8gdm9pZCAwIDogW107XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5WzBdO1xuICAgIHJldHVybiBpbml0aWFsKGFycmF5LCBhcnJheS5sZW5ndGggLSBuKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLlxuICBmdW5jdGlvbiBpbml0aWFsKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSAobiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pKSk7XG4gIH1cblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIGZ1bmN0aW9uIGxhc3QoYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwgfHwgYXJyYXkubGVuZ3RoIDwgMSkgcmV0dXJuIG4gPT0gbnVsbCA/IHZvaWQgMCA6IFtdO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gcmVzdChhcnJheSwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gbikpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVybiB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGVcbiAgLy8gYXJyYXkuXG4gIGZ1bmN0aW9uIHJlc3QoYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfVxuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgZnVuY3Rpb24gY29tcGFjdChhcnJheSkge1xuICAgIHJldHVybiBmaWx0ZXIoYXJyYXksIEJvb2xlYW4pO1xuICB9XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICBmdW5jdGlvbiBfZmxhdHRlbihpbnB1dCwgc2hhbGxvdywgc3RyaWN0LCBvdXRwdXQpIHtcbiAgICBvdXRwdXQgPSBvdXRwdXQgfHwgW107XG4gICAgdmFyIGlkeCA9IG91dHB1dC5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChpbnB1dCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gaW5wdXRbaV07XG4gICAgICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmIChpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkpKSB7XG4gICAgICAgIC8vIEZsYXR0ZW4gY3VycmVudCBsZXZlbCBvZiBhcnJheSBvciBhcmd1bWVudHMgb2JqZWN0LlxuICAgICAgICBpZiAoc2hhbGxvdykge1xuICAgICAgICAgIHZhciBqID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgIHdoaWxlIChqIDwgbGVuKSBvdXRwdXRbaWR4KytdID0gdmFsdWVbaisrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgc3RyaWN0LCBvdXRwdXQpO1xuICAgICAgICAgIGlkeCA9IG91dHB1dC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCkge1xuICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvLyBGbGF0dGVuIG91dCBhbiBhcnJheSwgZWl0aGVyIHJlY3Vyc2l2ZWx5IChieSBkZWZhdWx0KSwgb3IganVzdCBvbmUgbGV2ZWwuXG4gIGZ1bmN0aW9uIGZsYXR0ZW4oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gX2ZsYXR0ZW4oYXJyYXksIHNoYWxsb3csIGZhbHNlKTtcbiAgfVxuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICB2YXIgd2l0aG91dCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oYXJyYXksIG90aGVyQXJyYXlzKSB7XG4gICAgcmV0dXJuIGRpZmZlcmVuY2UoYXJyYXksIG90aGVyQXJyYXlzKTtcbiAgfSk7XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBUaGUgZmFzdGVyIGFsZ29yaXRobSB3aWxsIG5vdCB3b3JrIHdpdGggYW4gaXRlcmF0ZWUgaWYgdGhlIGl0ZXJhdGVlXG4gIC8vIGlzIG5vdCBhIG9uZS10by1vbmUgZnVuY3Rpb24sIHNvIHByb3ZpZGluZyBhbiBpdGVyYXRlZSB3aWxsIGRpc2FibGVcbiAgLy8gdGhlIGZhc3RlciBhbGdvcml0aG0uXG4gIGZ1bmN0aW9uIHVuaXEoYXJyYXksIGlzU29ydGVkLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmICghaXNCb29sZWFuKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdGVlO1xuICAgICAgaXRlcmF0ZWUgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpdGVyYXRlZSAhPSBudWxsKSBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXSxcbiAgICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUsIGksIGFycmF5KSA6IHZhbHVlO1xuICAgICAgaWYgKGlzU29ydGVkICYmICFpdGVyYXRlZSkge1xuICAgICAgICBpZiAoIWkgfHwgc2VlbiAhPT0gY29tcHV0ZWQpIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgc2VlbiA9IGNvbXB1dGVkO1xuICAgICAgfSBlbHNlIGlmIChpdGVyYXRlZSkge1xuICAgICAgICBpZiAoIWNvbnRhaW5zKHNlZW4sIGNvbXB1dGVkKSkge1xuICAgICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFjb250YWlucyhyZXN1bHQsIHZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIHZhciB1bmlvbiA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oYXJyYXlzKSB7XG4gICAgcmV0dXJuIHVuaXEoX2ZsYXR0ZW4oYXJyYXlzLCB0cnVlLCB0cnVlKSk7XG4gIH0pO1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgZnVuY3Rpb24gaW50ZXJzZWN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGFycmF5W2ldO1xuICAgICAgaWYgKGNvbnRhaW5zKHJlc3VsdCwgaXRlbSkpIGNvbnRpbnVlO1xuICAgICAgdmFyIGo7XG4gICAgICBmb3IgKGogPSAxOyBqIDwgYXJnc0xlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICghY29udGFpbnMoYXJndW1lbnRzW2pdLCBpdGVtKSkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaiA9PT0gYXJnc0xlbmd0aCkgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIHZhciBkaWZmZXJlbmNlID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihhcnJheSwgcmVzdCkge1xuICAgIHJlc3QgPSBfZmxhdHRlbihyZXN0LCB0cnVlLCB0cnVlKTtcbiAgICByZXR1cm4gZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICByZXR1cm4gIWNvbnRhaW5zKHJlc3QsIHZhbHVlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gQ29tcGxlbWVudCBvZiB6aXAuIFVuemlwIGFjY2VwdHMgYW4gYXJyYXkgb2YgYXJyYXlzIGFuZCBncm91cHNcbiAgLy8gZWFjaCBhcnJheSdzIGVsZW1lbnRzIG9uIHNoYXJlZCBpbmRpY2VzLlxuICBmdW5jdGlvbiB1bnppcChhcnJheSkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheSAmJiBtYXgoYXJyYXksIGdldExlbmd0aCkubGVuZ3RoIHx8IDA7XG4gICAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByZXN1bHRbaW5kZXhdID0gcGx1Y2soYXJyYXksIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIHZhciB6aXAgPSByZXN0QXJndW1lbnRzKHVuemlwKTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuIFBhc3NpbmcgYnkgcGFpcnMgaXMgdGhlIHJldmVyc2Ugb2YgcGFpcnMuXG4gIGZ1bmN0aW9uIG9iamVjdChsaXN0LCB2YWx1ZXMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChsaXN0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBmaW5kSW5kZXggYW5kIGZpbmRMYXN0SW5kZXggZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcihkaXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgdmFyIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBpbmRleCBvbiBhbiBhcnJheS1saWtlIHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3QuXG4gIHZhciBmaW5kSW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigxKTtcbiAgdmFyIGZpbmRMYXN0SW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigtMSk7XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIGZ1bmN0aW9uIHNvcnRlZEluZGV4KGFycmF5LCBvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0ZWUob2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSBNYXRoLmZsb29yKChsb3cgKyBoaWdoKSAvIDIpO1xuICAgICAgaWYgKGl0ZXJhdGVlKGFycmF5W21pZF0pIDwgdmFsdWUpIGxvdyA9IG1pZCArIDE7IGVsc2UgaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIGluZGV4T2YgYW5kIGxhc3RJbmRleE9mIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gY3JlYXRlSW5kZXhGaW5kZXIoZGlyLCBwcmVkaWNhdGVGaW5kLCBzb3J0ZWRJbmRleCkge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgaXRlbSwgaWR4KSB7XG4gICAgICB2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgICBpZiAodHlwZW9mIGlkeCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoZGlyID4gMCkge1xuICAgICAgICAgIGkgPSBpZHggPj0gMCA/IGlkeCA6IE1hdGgubWF4KGlkeCArIGxlbmd0aCwgaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGVuZ3RoID0gaWR4ID49IDAgPyBNYXRoLm1pbihpZHggKyAxLCBsZW5ndGgpIDogaWR4ICsgbGVuZ3RoICsgMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzb3J0ZWRJbmRleCAmJiBpZHggJiYgbGVuZ3RoKSB7XG4gICAgICAgIGlkeCA9IHNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2lkeF0gPT09IGl0ZW0gPyBpZHggOiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtICE9PSBpdGVtKSB7XG4gICAgICAgIGlkeCA9IHByZWRpY2F0ZUZpbmQoc2xpY2UuY2FsbChhcnJheSwgaSwgbGVuZ3RoKSwgaXNOYU4pO1xuICAgICAgICByZXR1cm4gaWR4ID49IDAgPyBpZHggKyBpIDogLTE7XG4gICAgICB9XG4gICAgICBmb3IgKGlkeCA9IGRpciA+IDAgPyBpIDogbGVuZ3RoIC0gMTsgaWR4ID49IDAgJiYgaWR4IDwgbGVuZ3RoOyBpZHggKz0gZGlyKSB7XG4gICAgICAgIGlmIChhcnJheVtpZHhdID09PSBpdGVtKSByZXR1cm4gaWR4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuIGl0ZW0gaW4gYW4gYXJyYXksXG4gIC8vIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICB2YXIgaW5kZXhPZiA9IGNyZWF0ZUluZGV4RmluZGVyKDEsIGZpbmRJbmRleCwgc29ydGVkSW5kZXgpO1xuICB2YXIgbGFzdEluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigtMSwgZmluZExhc3RJbmRleCk7XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwczovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L2Z1bmN0aW9ucy5odG1sI3JhbmdlKS5cbiAgZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoc3RvcCA9PSBudWxsKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgaWYgKCFzdGVwKSB7XG4gICAgICBzdGVwID0gc3RvcCA8IHN0YXJ0ID8gLTEgOiAxO1xuICAgIH1cblxuICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIHJhbmdlID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGxlbmd0aDsgaWR4KyssIHN0YXJ0ICs9IHN0ZXApIHtcbiAgICAgIHJhbmdlW2lkeF0gPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH1cblxuICAvLyBDaHVuayBhIHNpbmdsZSBhcnJheSBpbnRvIG11bHRpcGxlIGFycmF5cywgZWFjaCBjb250YWluaW5nIGBjb3VudGAgb3IgZmV3ZXJcbiAgLy8gaXRlbXMuXG4gIGZ1bmN0aW9uIGNodW5rKGFycmF5LCBjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50IDwgMSkgcmV0dXJuIFtdO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAoaSA8IGxlbmd0aCkge1xuICAgICAgcmVzdWx0LnB1c2goc2xpY2UuY2FsbChhcnJheSwgaSwgaSArPSBjb3VudCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZXhlY3V0ZSBhIGZ1bmN0aW9uIGFzIGEgY29uc3RydWN0b3JcbiAgLy8gb3IgYSBub3JtYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnRzLlxuICBmdW5jdGlvbiBleGVjdXRlQm91bmQoc291cmNlRnVuYywgYm91bmRGdW5jLCBjb250ZXh0LCBjYWxsaW5nQ29udGV4dCwgYXJncykge1xuICAgIGlmICghKGNhbGxpbmdDb250ZXh0IGluc3RhbmNlb2YgYm91bmRGdW5jKSkgcmV0dXJuIHNvdXJjZUZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgdmFyIHNlbGYgPSBiYXNlQ3JlYXRlKHNvdXJjZUZ1bmMucHJvdG90eXBlKTtcbiAgICB2YXIgcmVzdWx0ID0gc291cmNlRnVuYy5hcHBseShzZWxmLCBhcmdzKTtcbiAgICBpZiAoaXNPYmplY3QocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgdmFyIGJpbmQgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQsIGFyZ3MpIHtcbiAgICBpZiAoIWlzRnVuY3Rpb24oZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JpbmQgbXVzdCBiZSBjYWxsZWQgb24gYSBmdW5jdGlvbicpO1xuICAgIHZhciBib3VuZCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oY2FsbEFyZ3MpIHtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIGNvbnRleHQsIHRoaXMsIGFyZ3MuY29uY2F0KGNhbGxBcmdzKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9KTtcblxuICAvLyBQYXJ0aWFsbHkgYXBwbHkgYSBmdW5jdGlvbiBieSBjcmVhdGluZyBhIHZlcnNpb24gdGhhdCBoYXMgaGFkIHNvbWUgb2YgaXRzXG4gIC8vIGFyZ3VtZW50cyBwcmUtZmlsbGVkLCB3aXRob3V0IGNoYW5naW5nIGl0cyBkeW5hbWljIGB0aGlzYCBjb250ZXh0LiBfIGFjdHNcbiAgLy8gYXMgYSBwbGFjZWhvbGRlciBieSBkZWZhdWx0LCBhbGxvd2luZyBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzIHRvIGJlXG4gIC8vIHByZS1maWxsZWQuIFNldCBgcGFydGlhbC5wbGFjZWhvbGRlcmAgZm9yIGEgY3VzdG9tIHBsYWNlaG9sZGVyIGFyZ3VtZW50LlxuICB2YXIgcGFydGlhbCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oZnVuYywgYm91bmRBcmdzKSB7XG4gICAgdmFyIHBsYWNlaG9sZGVyID0gcGFydGlhbC5wbGFjZWhvbGRlcjtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IDAsIGxlbmd0aCA9IGJvdW5kQXJncy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IEFycmF5KGxlbmd0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFyZ3NbaV0gPSBib3VuZEFyZ3NbaV0gPT09IHBsYWNlaG9sZGVyID8gYXJndW1lbnRzW3Bvc2l0aW9uKytdIDogYm91bmRBcmdzW2ldO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgYXJndW1lbnRzLmxlbmd0aCkgYXJncy5wdXNoKGFyZ3VtZW50c1twb3NpdGlvbisrXSk7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCB0aGlzLCB0aGlzLCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfSk7XG5cbiAgcGFydGlhbC5wbGFjZWhvbGRlciA9IF87XG5cbiAgLy8gQmluZCBhIG51bWJlciBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBSZW1haW5pbmcgYXJndW1lbnRzXG4gIC8vIGFyZSB0aGUgbWV0aG9kIG5hbWVzIHRvIGJlIGJvdW5kLiBVc2VmdWwgZm9yIGVuc3VyaW5nIHRoYXQgYWxsIGNhbGxiYWNrc1xuICAvLyBkZWZpbmVkIG9uIGFuIG9iamVjdCBiZWxvbmcgdG8gaXQuXG4gIHZhciBiaW5kQWxsID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihvYmosIF9rZXlzKSB7XG4gICAgX2tleXMgPSBfZmxhdHRlbihfa2V5cywgZmFsc2UsIGZhbHNlKTtcbiAgICB2YXIgaW5kZXggPSBfa2V5cy5sZW5ndGg7XG4gICAgaWYgKGluZGV4IDwgMSkgdGhyb3cgbmV3IEVycm9yKCdiaW5kQWxsIG11c3QgYmUgcGFzc2VkIGZ1bmN0aW9uIG5hbWVzJyk7XG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIHZhciBrZXkgPSBfa2V5c1tpbmRleF07XG4gICAgICBvYmpba2V5XSA9IGJpbmQob2JqW2tleV0sIG9iaik7XG4gICAgfVxuICB9KTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vaXplID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgY2FjaGUgPSBtZW1vaXplLmNhY2hlO1xuICAgICAgdmFyIGFkZHJlc3MgPSAnJyArIChoYXNoZXIgPyBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGtleSk7XG4gICAgICBpZiAoIV9oYXMoY2FjaGUsIGFkZHJlc3MpKSBjYWNoZVthZGRyZXNzXSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBjYWNoZVthZGRyZXNzXTtcbiAgICB9O1xuICAgIG1lbW9pemUuY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gbWVtb2l6ZTtcbiAgfVxuXG4gIC8vIERlbGF5cyBhIGZ1bmN0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gY2FsbHNcbiAgLy8gaXQgd2l0aCB0aGUgYXJndW1lbnRzIHN1cHBsaWVkLlxuICB2YXIgZGVsYXkgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGFyZ3MpIHtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9KTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgdmFyIGRlZmVyID0gcGFydGlhbChkZWxheSwgXywgMSk7XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBmdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIHRpbWVvdXQsIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogbm93KCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuXG4gICAgdmFyIHRocm90dGxlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF9ub3cgPSBub3coKTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBfbm93O1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAoX25vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHByZXZpb3VzID0gX25vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdGhyb3R0bGVkLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgcHJldmlvdXMgPSAwO1xuICAgICAgdGltZW91dCA9IGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRocm90dGxlZDtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAgLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICAvLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAgLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIHJlc3VsdDtcblxuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKGNvbnRleHQsIGFyZ3MpIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgaWYgKGFyZ3MpIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcblxuICAgIHZhciBkZWJvdW5jZWQgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgIGlmICh0aW1lb3V0KSBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICBpZiAoaW1tZWRpYXRlKSB7XG4gICAgICAgIHZhciBjYWxsTm93ID0gIXRpbWVvdXQ7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgICAgaWYgKGNhbGxOb3cpIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aW1lb3V0ID0gZGVsYXkobGF0ZXIsIHdhaXQsIHRoaXMsIGFyZ3MpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgZGVib3VuY2VkLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgfTtcblxuICAgIHJldHVybiBkZWJvdW5jZWQ7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBmdW5jdGlvbiB3cmFwKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gcGFydGlhbCh3cmFwcGVyLCBmdW5jKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBuZWdhdGVkIHZlcnNpb24gb2YgdGhlIHBhc3NlZC1pbiBwcmVkaWNhdGUuXG4gIGZ1bmN0aW9uIG5lZ2F0ZShwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgYSBsaXN0IG9mIGZ1bmN0aW9ucywgZWFjaFxuICAvLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICBmdW5jdGlvbiBjb21wb3NlKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdGFydCA9IGFyZ3MubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSA9IHN0YXJ0O1xuICAgICAgdmFyIHJlc3VsdCA9IGFyZ3Nbc3RhcnRdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB3aGlsZSAoaS0tKSByZXN1bHQgPSBhcmdzW2ldLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBvbiBhbmQgYWZ0ZXIgdGhlIE50aCBjYWxsLlxuICBmdW5jdGlvbiBhZnRlcih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgdXAgdG8gKGJ1dCBub3QgaW5jbHVkaW5nKSB0aGUgTnRoIGNhbGwuXG4gIGZ1bmN0aW9uIGJlZm9yZSh0aW1lcywgZnVuYykge1xuICAgIHZhciBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzID4gMCkge1xuICAgICAgICBtZW1vID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgaWYgKHRpbWVzIDw9IDEpIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICB2YXIgb25jZSA9IHBhcnRpYWwoYmVmb3JlLCAyKTtcblxuICAvLyBPYmplY3QgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBLZXlzIGluIElFIDwgOSB0aGF0IHdvbid0IGJlIGl0ZXJhdGVkIGJ5IGBmb3Iga2V5IGluIC4uLmAgYW5kIHRodXMgbWlzc2VkLlxuICB2YXIgaGFzRW51bUJ1ZyA9ICF7dG9TdHJpbmc6IG51bGx9LnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpO1xuICB2YXIgbm9uRW51bWVyYWJsZVByb3BzID0gWyd2YWx1ZU9mJywgJ2lzUHJvdG90eXBlT2YnLCAndG9TdHJpbmcnLFxuICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdoYXNPd25Qcm9wZXJ0eScsICd0b0xvY2FsZVN0cmluZyddO1xuXG4gIGZ1bmN0aW9uIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBfa2V5cykge1xuICAgIHZhciBub25FbnVtSWR4ID0gbm9uRW51bWVyYWJsZVByb3BzLmxlbmd0aDtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBvYmouY29uc3RydWN0b3I7XG4gICAgdmFyIHByb3RvID0gaXNGdW5jdGlvbihjb25zdHJ1Y3RvcikgJiYgY29uc3RydWN0b3IucHJvdG90eXBlIHx8IE9ialByb3RvO1xuXG4gICAgLy8gQ29uc3RydWN0b3IgaXMgYSBzcGVjaWFsIGNhc2UuXG4gICAgdmFyIHByb3AgPSAnY29uc3RydWN0b3InO1xuICAgIGlmIChfaGFzKG9iaiwgcHJvcCkgJiYgIWNvbnRhaW5zKF9rZXlzLCBwcm9wKSkgX2tleXMucHVzaChwcm9wKTtcblxuICAgIHdoaWxlIChub25FbnVtSWR4LS0pIHtcbiAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbm9uRW51bUlkeF07XG4gICAgICBpZiAocHJvcCBpbiBvYmogJiYgb2JqW3Byb3BdICE9PSBwcm90b1twcm9wXSAmJiAhY29udGFpbnMoX2tleXMsIHByb3ApKSB7XG4gICAgICAgIF9rZXlzLnB1c2gocHJvcCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgLlxuICBmdW5jdGlvbiBrZXlzKG9iaikge1xuICAgIGlmICghaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIGlmIChuYXRpdmVLZXlzKSByZXR1cm4gbmF0aXZlS2V5cyhvYmopO1xuICAgIHZhciBfa2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfaGFzKG9iaiwga2V5KSkgX2tleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIF9rZXlzKTtcbiAgICByZXR1cm4gX2tleXM7XG4gIH1cblxuICAvLyBSZXRyaWV2ZSBhbGwgdGhlIHByb3BlcnR5IG5hbWVzIG9mIGFuIG9iamVjdC5cbiAgZnVuY3Rpb24gYWxsS2V5cyhvYmopIHtcbiAgICBpZiAoIWlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICB2YXIgX2tleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBfa2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwgX2tleXMpO1xuICAgIHJldHVybiBfa2V5cztcbiAgfVxuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgZnVuY3Rpb24gdmFsdWVzKG9iaikge1xuICAgIHZhciBfa2V5cyA9IGtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gX2tleXMubGVuZ3RoO1xuICAgIHZhciB2YWx1ZXMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IG9ialtfa2V5c1tpXV07XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQgb2YgdGhlIG9iamVjdC5cbiAgLy8gSW4gY29udHJhc3QgdG8gbWFwIGl0IHJldHVybnMgYW4gb2JqZWN0LlxuICBmdW5jdGlvbiBtYXBPYmplY3Qob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBfa2V5cyA9IGtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gX2tleXMubGVuZ3RoLFxuICAgICAgICByZXN1bHRzID0ge307XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBfa2V5c1tpbmRleF07XG4gICAgICByZXN1bHRzW2N1cnJlbnRLZXldID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICAvLyBUaGUgb3Bwb3NpdGUgb2Ygb2JqZWN0LlxuICBmdW5jdGlvbiBwYWlycyhvYmopIHtcbiAgICB2YXIgX2tleXMgPSBrZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IF9rZXlzLmxlbmd0aDtcbiAgICB2YXIgcGFpcnMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW19rZXlzW2ldLCBvYmpbX2tleXNbaV1dXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBmdW5jdGlvbiBpbnZlcnQob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBfa2V5cyA9IGtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gX2tleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpbX2tleXNbaV1dXSA9IF9rZXlzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICBmdW5jdGlvbiBmdW5jdGlvbnMob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKGlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lcy5zb3J0KCk7XG4gIH1cblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYXNzaWduZXIgZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBjcmVhdGVBc3NpZ25lcihrZXlzRnVuYywgZGVmYXVsdHMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmIChkZWZhdWx0cykgb2JqID0gT2JqZWN0KG9iaik7XG4gICAgICBpZiAobGVuZ3RoIDwgMiB8fCBvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF0sXG4gICAgICAgICAgICBfa2V5cyA9IGtleXNGdW5jKHNvdXJjZSksXG4gICAgICAgICAgICBsID0gX2tleXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHZhciBrZXkgPSBfa2V5c1tpXTtcbiAgICAgICAgICBpZiAoIWRlZmF1bHRzIHx8IG9ialtrZXldID09PSB2b2lkIDApIG9ialtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICB2YXIgZXh0ZW5kID0gY3JlYXRlQXNzaWduZXIoYWxsS2V5cyk7XG5cbiAgLy8gQXNzaWducyBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgb3duIHByb3BlcnRpZXMgaW4gdGhlIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIC8vIChodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduKVxuICB2YXIgZXh0ZW5kT3duID0gY3JlYXRlQXNzaWduZXIoa2V5cyk7XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3Qga2V5IG9uIGFuIG9iamVjdCB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0LlxuICBmdW5jdGlvbiBmaW5kS2V5KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgX2tleXMgPSBrZXlzKG9iaiksIGtleTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gX2tleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IF9rZXlzW2ldO1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpba2V5XSwga2V5LCBvYmopKSByZXR1cm4ga2V5O1xuICAgIH1cbiAgfVxuXG4gIC8vIEludGVybmFsIHBpY2sgaGVscGVyIGZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBgb2JqYCBoYXMga2V5IGBrZXlgLlxuICBmdW5jdGlvbiBrZXlJbk9iaih2YWx1ZSwga2V5LCBvYmopIHtcbiAgICByZXR1cm4ga2V5IGluIG9iajtcbiAgfVxuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIHZhciBwaWNrID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihvYmosIF9rZXlzKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9LCBpdGVyYXRlZSA9IF9rZXlzWzBdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAoaXNGdW5jdGlvbihpdGVyYXRlZSkpIHtcbiAgICAgIGlmIChfa2V5cy5sZW5ndGggPiAxKSBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIF9rZXlzWzFdKTtcbiAgICAgIF9rZXlzID0gYWxsS2V5cyhvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGtleUluT2JqO1xuICAgICAgX2tleXMgPSBfZmxhdHRlbihfa2V5cywgZmFsc2UsIGZhbHNlKTtcbiAgICAgIG9iaiA9IE9iamVjdChvYmopO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gX2tleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBfa2V5c1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKGl0ZXJhdGVlKHZhbHVlLCBrZXksIG9iaikpIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBibGFja2xpc3RlZCBwcm9wZXJ0aWVzLlxuICB2YXIgb21pdCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24ob2JqLCBfa2V5cykge1xuICAgIHZhciBpdGVyYXRlZSA9IF9rZXlzWzBdLCBjb250ZXh0O1xuICAgIGlmIChpc0Z1bmN0aW9uKGl0ZXJhdGVlKSkge1xuICAgICAgaXRlcmF0ZWUgPSBuZWdhdGUoaXRlcmF0ZWUpO1xuICAgICAgaWYgKF9rZXlzLmxlbmd0aCA+IDEpIGNvbnRleHQgPSBfa2V5c1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2tleXMgPSBtYXAoX2ZsYXR0ZW4oX2tleXMsIGZhbHNlLCBmYWxzZSksIFN0cmluZyk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuICFjb250YWlucyhfa2V5cywga2V5KTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBwaWNrKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpO1xuICB9KTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICB2YXIgZGVmYXVsdHMgPSBjcmVhdGVBc3NpZ25lcihhbGxLZXlzLCB0cnVlKTtcblxuICAvLyBDcmVhdGVzIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhlIGdpdmVuIHByb3RvdHlwZSBvYmplY3QuXG4gIC8vIElmIGFkZGl0aW9uYWwgcHJvcGVydGllcyBhcmUgcHJvdmlkZWQgdGhlbiB0aGV5IHdpbGwgYmUgYWRkZWQgdG8gdGhlXG4gIC8vIGNyZWF0ZWQgb2JqZWN0LlxuICBmdW5jdGlvbiBjcmVhdGUocHJvdG90eXBlLCBwcm9wcykge1xuICAgIHZhciByZXN1bHQgPSBiYXNlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgaWYgKHByb3BzKSBleHRlbmRPd24ocmVzdWx0LCBwcm9wcyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgZnVuY3Rpb24gY2xvbmUob2JqKSB7XG4gICAgaWYgKCFpc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBpc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IGV4dGVuZCh7fSwgb2JqKTtcbiAgfVxuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBmdW5jdGlvbiB0YXAob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIC8vIFJldHVybnMgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBmdW5jdGlvbiBpc01hdGNoKG9iamVjdCwgYXR0cnMpIHtcbiAgICB2YXIgX2tleXMgPSBrZXlzKGF0dHJzKSwgbGVuZ3RoID0gX2tleXMubGVuZ3RoO1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuICFsZW5ndGg7XG4gICAgdmFyIG9iaiA9IE9iamVjdChvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBfa2V5c1tpXTtcbiAgICAgIGlmIChhdHRyc1trZXldICE9PSBvYmpba2V5XSB8fCAhKGtleSBpbiBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICBmdW5jdGlvbiBlcShhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cHM6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbCkuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09PSAxIC8gYjtcbiAgICAvLyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgb25seSBlcXVhbCB0byBpdHNlbGYgKHN0cmljdCBjb21wYXJpc29uKS5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuXG4gICAgaWYgKGEgIT09IGEpIHJldHVybiBiICE9PSBiO1xuICAgIC8vIEV4aGF1c3QgcHJpbWl0aXZlIGNoZWNrc1xuICAgIHZhciB0eXBlID0gdHlwZW9mIGE7XG4gICAgaWYgKHR5cGUgIT09ICdmdW5jdGlvbicgJiYgdHlwZSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gZGVlcEVxKGEsIGIsIGFTdGFjaywgYlN0YWNrKTtcbiAgfVxuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIGZ1bmN0aW9uIGRlZXBFcShhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT09IHRvU3RyaW5nLmNhbGwoYikpIHJldHVybiBmYWxzZTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgLy8gU3RyaW5ncywgbnVtYmVycywgcmVndWxhciBleHByZXNzaW9ucywgZGF0ZXMsIGFuZCBib29sZWFucyBhcmUgY29tcGFyZWQgYnkgdmFsdWUuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgLy8gUmVnRXhwcyBhcmUgY29lcmNlZCB0byBzdHJpbmdzIGZvciBjb21wYXJpc29uIChOb3RlOiAnJyArIC9hL2kgPT09ICcvYS9pJylcbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuICcnICsgYSA9PT0gJycgKyBiO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS5cbiAgICAgICAgLy8gT2JqZWN0KE5hTikgaXMgZXF1aXZhbGVudCB0byBOYU4uXG4gICAgICAgIGlmICgrYSAhPT0gK2EpIHJldHVybiArYiAhPT0gK2I7XG4gICAgICAgIC8vIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3Igb3RoZXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgIHJldHVybiArYSA9PT0gMCA/IDEgLyArYSA9PT0gMSAvIGIgOiArYSA9PT0gK2I7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT09ICtiO1xuICAgICAgY2FzZSAnW29iamVjdCBTeW1ib2xdJzpcbiAgICAgICAgcmV0dXJuIFN5bWJvbFByb3RvLnZhbHVlT2YuY2FsbChhKSA9PT0gU3ltYm9sUHJvdG8udmFsdWVPZi5jYWxsKGIpO1xuICAgIH1cblxuICAgIHZhciBhcmVBcnJheXMgPSBjbGFzc05hbWUgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgaWYgKCFhcmVBcnJheXMpIHtcbiAgICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHMgb3IgYEFycmF5YHNcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoaXNGdW5jdGlvbihhQ3RvcikgJiYgYUN0b3IgaW5zdGFuY2VvZiBhQ3RvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRnVuY3Rpb24oYkN0b3IpICYmIGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmICgnY29uc3RydWN0b3InIGluIGEgJiYgJ2NvbnN0cnVjdG9yJyBpbiBiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cblxuICAgIC8vIEluaXRpYWxpemluZyBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICAvLyBJdCdzIGRvbmUgaGVyZSBzaW5jZSB3ZSBvbmx5IG5lZWQgdGhlbSBmb3Igb2JqZWN0cyBhbmQgYXJyYXlzIGNvbXBhcmlzb24uXG4gICAgYVN0YWNrID0gYVN0YWNrIHx8IFtdO1xuICAgIGJTdGFjayA9IGJTdGFjayB8fCBbXTtcbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT09IGI7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuXG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGFyZUFycmF5cykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmICghZXEoYVtsZW5ndGhdLCBiW2xlbmd0aF0sIGFTdGFjaywgYlN0YWNrKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIHZhciBfa2V5cyA9IGtleXMoYSksIGtleTtcbiAgICAgIGxlbmd0aCA9IF9rZXlzLmxlbmd0aDtcbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzIGJlZm9yZSBjb21wYXJpbmcgZGVlcCBlcXVhbGl0eS5cbiAgICAgIGlmIChrZXlzKGIpLmxlbmd0aCAhPT0gbGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyXG4gICAgICAgIGtleSA9IF9rZXlzW2xlbmd0aF07XG4gICAgICAgIGlmICghKF9oYXMoYiwga2V5KSAmJiBlcShhW2tleV0sIGJba2V5XSwgYVN0YWNrLCBiU3RhY2spKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIGZ1bmN0aW9uIGlzRXF1YWwoYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiKTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBmdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikgJiYgKGlzQXJyYXkob2JqKSB8fCBpc1N0cmluZyhvYmopIHx8IGlzQXJndW1lbnRzKG9iaikpKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICByZXR1cm4ga2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgZnVuY3Rpb24gaXNFbGVtZW50KG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfVxuXG4gIC8vIEludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIHRvU3RyaW5nLWJhc2VkIHR5cGUgdGVzdGVyLlxuICBmdW5jdGlvbiB0YWdUZXN0ZXIobmFtZSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICB2YXIgaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgdGFnVGVzdGVyKCdBcnJheScpO1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBmdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG4gICAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XG4gIH1cblxuICAvLyBBZGQgc29tZSBpc1R5cGUgbWV0aG9kczogaXNBcmd1bWVudHMsIGlzRnVuY3Rpb24sIGlzU3RyaW5nLCBpc051bWJlciwgaXNEYXRlLCBpc1JlZ0V4cCwgaXNFcnJvciwgaXNNYXAsIGlzV2Vha01hcCwgaXNTZXQsIGlzV2Vha1NldC5cbiAgdmFyIGlzQXJndW1lbnRzID0gdGFnVGVzdGVyKCdBcmd1bWVudHMnKTtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0YWdUZXN0ZXIoJ0Z1bmN0aW9uJyk7XG4gIHZhciBpc1N0cmluZyA9IHRhZ1Rlc3RlcignU3RyaW5nJyk7XG4gIHZhciBpc051bWJlciA9IHRhZ1Rlc3RlcignTnVtYmVyJyk7XG4gIHZhciBpc0RhdGUgPSB0YWdUZXN0ZXIoJ0RhdGUnKTtcbiAgdmFyIGlzUmVnRXhwID0gdGFnVGVzdGVyKCdSZWdFeHAnKTtcbiAgdmFyIGlzRXJyb3IgPSB0YWdUZXN0ZXIoJ0Vycm9yJyk7XG4gIHZhciBpc1N5bWJvbCA9IHRhZ1Rlc3RlcignU3ltYm9sJyk7XG4gIHZhciBpc01hcCA9IHRhZ1Rlc3RlcignTWFwJyk7XG4gIHZhciBpc1dlYWtNYXAgPSB0YWdUZXN0ZXIoJ1dlYWtNYXAnKTtcbiAgdmFyIGlzU2V0ID0gdGFnVGVzdGVyKCdTZXQnKTtcbiAgdmFyIGlzV2Vha1NldCA9IHRhZ1Rlc3RlcignV2Vha1NldCcpO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUgPCA5KSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgKGZ1bmN0aW9uKCkge1xuICAgIGlmICghaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgICAgaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuIF9oYXMob2JqLCAnY2FsbGVlJyk7XG4gICAgICB9O1xuICAgIH1cbiAgfSgpKTtcblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuIFdvcmsgYXJvdW5kIHNvbWUgdHlwZW9mIGJ1Z3MgaW4gb2xkIHY4LFxuICAvLyBJRSAxMSAoIzE2MjEpLCBTYWZhcmkgOCAoIzE5MjkpLCBhbmQgUGhhbnRvbUpTICgjMjIzNikuXG4gIHZhciBub2RlbGlzdCA9IHJvb3QuZG9jdW1lbnQgJiYgcm9vdC5kb2N1bWVudC5jaGlsZE5vZGVzO1xuICBpZiAodHlwZW9mIC8uLyAhPSAnZnVuY3Rpb24nICYmIHR5cGVvZiBJbnQ4QXJyYXkgIT0gJ29iamVjdCcgJiYgdHlwZW9mIG5vZGVsaXN0ICE9ICdmdW5jdGlvbicpIHtcbiAgICBpc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIGZ1bmN0aW9uIGlzRmluaXRlKG9iaikge1xuICAgIHJldHVybiAhaXNTeW1ib2wob2JqKSAmJiBfaXNGaW5pdGUob2JqKSAmJiAhX2lzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG4gIH1cblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/XG4gIGZ1bmN0aW9uIGlzTmFOKG9iaikge1xuICAgIHJldHVybiBpc051bWJlcihvYmopICYmIF9pc05hTihvYmopO1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIGZ1bmN0aW9uIGlzQm9vbGVhbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIGZ1bmN0aW9uIGlzTnVsbChvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfVxuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgZnVuY3Rpb24gaGFzKG9iaiwgcGF0aCkge1xuICAgIGlmICghaXNBcnJheShwYXRoKSkge1xuICAgICAgcmV0dXJuIF9oYXMob2JqLCBwYXRoKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBwYXRoW2ldO1xuICAgICAgaWYgKG9iaiA9PSBudWxsIHx8ICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBvYmogPSBvYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuICEhbGVuZ3RoO1xuICB9XG5cbiAgLy8gVXRpbGl0eSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0ZWVzLlxuICBmdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIFByZWRpY2F0ZS1nZW5lcmF0aW5nIGZ1bmN0aW9ucy4gT2Z0ZW4gdXNlZnVsIG91dHNpZGUgb2YgVW5kZXJzY29yZS5cbiAgZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vb3AoKXt9XG5cbiAgLy8gQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gcGFzc2VkIGFuIG9iamVjdCwgd2lsbCB0cmF2ZXJzZSB0aGF0IG9iamVjdOKAmXNcbiAgLy8gcHJvcGVydGllcyBkb3duIHRoZSBnaXZlbiBgcGF0aGAsIHNwZWNpZmllZCBhcyBhbiBhcnJheSBvZiBrZXlzIG9yIGluZGV4ZXMuXG4gIGZ1bmN0aW9uIHByb3BlcnR5KHBhdGgpIHtcbiAgICBpZiAoIWlzQXJyYXkocGF0aCkpIHtcbiAgICAgIHJldHVybiBzaGFsbG93UHJvcGVydHkocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBkZWVwR2V0KG9iaiwgcGF0aCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRlcyBhIGZ1bmN0aW9uIGZvciBhIGdpdmVuIG9iamVjdCB0aGF0IHJldHVybnMgYSBnaXZlbiBwcm9wZXJ0eS5cbiAgZnVuY3Rpb24gcHJvcGVydHlPZihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpe307XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICByZXR1cm4gIWlzQXJyYXkocGF0aCkgPyBvYmpbcGF0aF0gOiBkZWVwR2V0KG9iaiwgcGF0aCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBwcmVkaWNhdGUgZm9yIGNoZWNraW5nIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZlxuICAvLyBga2V5OnZhbHVlYCBwYWlycy5cbiAgZnVuY3Rpb24gbWF0Y2hlcihhdHRycykge1xuICAgIGF0dHJzID0gZXh0ZW5kT3duKHt9LCBhdHRycyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIGlzTWF0Y2gob2JqLCBhdHRycyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBmdW5jdGlvbiB0aW1lcyhuLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KE1hdGgubWF4KDAsIG4pKTtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdGVlKGkpO1xuICAgIHJldHVybiBhY2N1bTtcbiAgfVxuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIGZ1bmN0aW9uIHJhbmRvbShtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH1cblxuICAvLyBBIChwb3NzaWJseSBmYXN0ZXIpIHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wIGFzIGFuIGludGVnZXIuXG4gIHZhciBub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH07XG5cbiAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVzY2FwZU1hcCA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICdgJzogJyYjeDYwOydcbiAgfTtcbiAgdmFyIHVuZXNjYXBlTWFwID0gaW52ZXJ0KGVzY2FwZU1hcCk7XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICBmdW5jdGlvbiBjcmVhdGVFc2NhcGVyKG1hcCkge1xuICAgIHZhciBlc2NhcGVyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXBbbWF0Y2hdO1xuICAgIH07XG4gICAgLy8gUmVnZXhlcyBmb3IgaWRlbnRpZnlpbmcgYSBrZXkgdGhhdCBuZWVkcyB0byBiZSBlc2NhcGVkLlxuICAgIHZhciBzb3VyY2UgPSAnKD86JyArIGtleXMobWFwKS5qb2luKCd8JykgKyAnKSc7XG4gICAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcbiAgICB2YXIgcmVwbGFjZVJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UsICdnJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgc3RyaW5nID0gc3RyaW5nID09IG51bGwgPyAnJyA6ICcnICsgc3RyaW5nO1xuICAgICAgcmV0dXJuIHRlc3RSZWdleHAudGVzdChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UocmVwbGFjZVJlZ2V4cCwgZXNjYXBlcikgOiBzdHJpbmc7XG4gICAgfTtcbiAgfVxuICB2YXIgZXNjYXBlID0gY3JlYXRlRXNjYXBlcihlc2NhcGVNYXApO1xuICB2YXIgdW5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKHVuZXNjYXBlTWFwKTtcblxuICAvLyBUcmF2ZXJzZXMgdGhlIGNoaWxkcmVuIG9mIGBvYmpgIGFsb25nIGBwYXRoYC4gSWYgYSBjaGlsZCBpcyBhIGZ1bmN0aW9uLCBpdFxuICAvLyBpcyBpbnZva2VkIHdpdGggaXRzIHBhcmVudCBhcyBjb250ZXh0LiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgZmluYWxcbiAgLy8gY2hpbGQsIG9yIGBmYWxsYmFja2AgaWYgYW55IGNoaWxkIGlzIHVuZGVmaW5lZC5cbiAgZnVuY3Rpb24gcmVzdWx0KG9iaiwgcGF0aCwgZmFsbGJhY2spIHtcbiAgICBpZiAoIWlzQXJyYXkocGF0aCkpIHBhdGggPSBbcGF0aF07XG4gICAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICByZXR1cm4gaXNGdW5jdGlvbihmYWxsYmFjaykgPyBmYWxsYmFjay5jYWxsKG9iaikgOiBmYWxsYmFjaztcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHByb3AgPSBvYmogPT0gbnVsbCA/IHZvaWQgMCA6IG9ialtwYXRoW2ldXTtcbiAgICAgIGlmIChwcm9wID09PSB2b2lkIDApIHtcbiAgICAgICAgcHJvcCA9IGZhbGxiYWNrO1xuICAgICAgICBpID0gbGVuZ3RoOyAvLyBFbnN1cmUgd2UgZG9uJ3QgY29udGludWUgaXRlcmF0aW5nLlxuICAgICAgfVxuICAgICAgb2JqID0gaXNGdW5jdGlvbihwcm9wKSA/IHByb3AuY2FsbChvYmopIDogcHJvcDtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBmdW5jdGlvbiB1bmlxdWVJZChwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgdmFyIHRlbXBsYXRlU2V0dGluZ3MgPSBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGU6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGU6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZTogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogXCInXCIsXG4gICAgJ1xcXFwnOiAnXFxcXCcsXG4gICAgJ1xccic6ICdyJyxcbiAgICAnXFxuJzogJ24nLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICB2YXIgZXNjYXBlUmVnRXhwID0gL1xcXFx8J3xcXHJ8XFxufFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIHZhciBlc2NhcGVDaGFyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07XG4gIH07XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgLy8gTkI6IGBvbGRTZXR0aW5nc2Agb25seSBleGlzdHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICBmdW5jdGlvbiB0ZW1wbGF0ZSh0ZXh0LCBzZXR0aW5ncywgb2xkU2V0dGluZ3MpIHtcbiAgICBpZiAoIXNldHRpbmdzICYmIG9sZFNldHRpbmdzKSBzZXR0aW5ncyA9IG9sZFNldHRpbmdzO1xuICAgIHNldHRpbmdzID0gZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UoZXNjYXBlUmVnRXhwLCBlc2NhcGVDaGFyKTtcbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuXG4gICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgZXNjYXBlICsgXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuXG4gICAgICAvLyBBZG9iZSBWTXMgbmVlZCB0aGUgbWF0Y2ggcmV0dXJuZWQgdG8gcHJvZHVjZSB0aGUgY29ycmVjdCBvZmZzZXQuXG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyAncmV0dXJuIF9fcDtcXG4nO1xuXG4gICAgdmFyIHJlbmRlcjtcbiAgICB0cnkge1xuICAgICAgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHZhciBhcmd1bWVudCA9IHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonO1xuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgYXJndW1lbnQgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLiBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gIGZ1bmN0aW9uIGNoYWluKG9iaikge1xuICAgIHZhciBpbnN0YW5jZSA9IF8ob2JqKTtcbiAgICBpbnN0YW5jZS5fY2hhaW4gPSB0cnVlO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIGZ1bmN0aW9uIGNoYWluUmVzdWx0KGluc3RhbmNlLCBvYmopIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuX2NoYWluID8gXyhvYmopLmNoYWluKCkgOiBvYmo7XG4gIH1cblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIGZ1bmN0aW9uIG1peGluKG9iaikge1xuICAgIGVhY2goZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBjaGFpblJlc3VsdCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIF87XG4gIH1cblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09PSAnc2hpZnQnIHx8IG5hbWUgPT09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIGNoYWluUmVzdWx0KHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIGVhY2goWydjb25jYXQnLCAnam9pbicsICdzbGljZSddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjaGFpblJlc3VsdCh0aGlzLCBtZXRob2QuYXBwbHkodGhpcy5fd3JhcHBlZCwgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRXh0cmFjdHMgdGhlIHJlc3VsdCBmcm9tIGEgd3JhcHBlZCBhbmQgY2hhaW5lZCBvYmplY3QuXG4gIF8ucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbiAgLy8gUHJvdmlkZSB1bndyYXBwaW5nIHByb3h5IGZvciBzb21lIG1ldGhvZHMgdXNlZCBpbiBlbmdpbmUgb3BlcmF0aW9uc1xuICAvLyBzdWNoIGFzIGFyaXRobWV0aWMgYW5kIEpTT04gc3RyaW5naWZpY2F0aW9uLlxuICBfLnByb3RvdHlwZS52YWx1ZU9mID0gXy5wcm90b3R5cGUudG9KU09OID0gXy5wcm90b3R5cGUudmFsdWU7XG5cbiAgXy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gU3RyaW5nKHRoaXMuX3dyYXBwZWQpO1xuICB9O1xuXG4gIHZhciBhbGxFeHBvcnRzID0gKHtcbiAgICAnZGVmYXVsdCc6IF8sXG4gICAgVkVSU0lPTjogVkVSU0lPTixcbiAgICBpdGVyYXRlZTogaXRlcmF0ZWUsXG4gICAgcmVzdEFyZ3VtZW50czogcmVzdEFyZ3VtZW50cyxcbiAgICBlYWNoOiBlYWNoLFxuICAgIGZvckVhY2g6IGVhY2gsXG4gICAgbWFwOiBtYXAsXG4gICAgY29sbGVjdDogbWFwLFxuICAgIHJlZHVjZTogcmVkdWNlLFxuICAgIGZvbGRsOiByZWR1Y2UsXG4gICAgaW5qZWN0OiByZWR1Y2UsXG4gICAgcmVkdWNlUmlnaHQ6IHJlZHVjZVJpZ2h0LFxuICAgIGZvbGRyOiByZWR1Y2VSaWdodCxcbiAgICBmaW5kOiBmaW5kLFxuICAgIGRldGVjdDogZmluZCxcbiAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICBzZWxlY3Q6IGZpbHRlcixcbiAgICByZWplY3Q6IHJlamVjdCxcbiAgICBldmVyeTogZXZlcnksXG4gICAgYWxsOiBldmVyeSxcbiAgICBzb21lOiBzb21lLFxuICAgIGFueTogc29tZSxcbiAgICBjb250YWluczogY29udGFpbnMsXG4gICAgaW5jbHVkZXM6IGNvbnRhaW5zLFxuICAgIGluY2x1ZGU6IGNvbnRhaW5zLFxuICAgIGludm9rZTogaW52b2tlLFxuICAgIHBsdWNrOiBwbHVjayxcbiAgICB3aGVyZTogd2hlcmUsXG4gICAgZmluZFdoZXJlOiBmaW5kV2hlcmUsXG4gICAgbWF4OiBtYXgsXG4gICAgbWluOiBtaW4sXG4gICAgc2h1ZmZsZTogc2h1ZmZsZSxcbiAgICBzYW1wbGU6IHNhbXBsZSxcbiAgICBzb3J0Qnk6IHNvcnRCeSxcbiAgICBncm91cEJ5OiBncm91cEJ5LFxuICAgIGluZGV4Qnk6IGluZGV4QnksXG4gICAgY291bnRCeTogY291bnRCeSxcbiAgICB0b0FycmF5OiB0b0FycmF5LFxuICAgIHNpemU6IHNpemUsXG4gICAgcGFydGl0aW9uOiBwYXJ0aXRpb24sXG4gICAgZmlyc3Q6IGZpcnN0LFxuICAgIGhlYWQ6IGZpcnN0LFxuICAgIHRha2U6IGZpcnN0LFxuICAgIGluaXRpYWw6IGluaXRpYWwsXG4gICAgbGFzdDogbGFzdCxcbiAgICByZXN0OiByZXN0LFxuICAgIHRhaWw6IHJlc3QsXG4gICAgZHJvcDogcmVzdCxcbiAgICBjb21wYWN0OiBjb21wYWN0LFxuICAgIGZsYXR0ZW46IGZsYXR0ZW4sXG4gICAgd2l0aG91dDogd2l0aG91dCxcbiAgICB1bmlxOiB1bmlxLFxuICAgIHVuaXF1ZTogdW5pcSxcbiAgICB1bmlvbjogdW5pb24sXG4gICAgaW50ZXJzZWN0aW9uOiBpbnRlcnNlY3Rpb24sXG4gICAgZGlmZmVyZW5jZTogZGlmZmVyZW5jZSxcbiAgICB1bnppcDogdW56aXAsXG4gICAgemlwOiB6aXAsXG4gICAgb2JqZWN0OiBvYmplY3QsXG4gICAgZmluZEluZGV4OiBmaW5kSW5kZXgsXG4gICAgZmluZExhc3RJbmRleDogZmluZExhc3RJbmRleCxcbiAgICBzb3J0ZWRJbmRleDogc29ydGVkSW5kZXgsXG4gICAgaW5kZXhPZjogaW5kZXhPZixcbiAgICBsYXN0SW5kZXhPZjogbGFzdEluZGV4T2YsXG4gICAgcmFuZ2U6IHJhbmdlLFxuICAgIGNodW5rOiBjaHVuayxcbiAgICBiaW5kOiBiaW5kLFxuICAgIHBhcnRpYWw6IHBhcnRpYWwsXG4gICAgYmluZEFsbDogYmluZEFsbCxcbiAgICBtZW1vaXplOiBtZW1vaXplLFxuICAgIGRlbGF5OiBkZWxheSxcbiAgICBkZWZlcjogZGVmZXIsXG4gICAgdGhyb3R0bGU6IHRocm90dGxlLFxuICAgIGRlYm91bmNlOiBkZWJvdW5jZSxcbiAgICB3cmFwOiB3cmFwLFxuICAgIG5lZ2F0ZTogbmVnYXRlLFxuICAgIGNvbXBvc2U6IGNvbXBvc2UsXG4gICAgYWZ0ZXI6IGFmdGVyLFxuICAgIGJlZm9yZTogYmVmb3JlLFxuICAgIG9uY2U6IG9uY2UsXG4gICAga2V5czoga2V5cyxcbiAgICBhbGxLZXlzOiBhbGxLZXlzLFxuICAgIHZhbHVlczogdmFsdWVzLFxuICAgIG1hcE9iamVjdDogbWFwT2JqZWN0LFxuICAgIHBhaXJzOiBwYWlycyxcbiAgICBpbnZlcnQ6IGludmVydCxcbiAgICBmdW5jdGlvbnM6IGZ1bmN0aW9ucyxcbiAgICBtZXRob2RzOiBmdW5jdGlvbnMsXG4gICAgZXh0ZW5kOiBleHRlbmQsXG4gICAgZXh0ZW5kT3duOiBleHRlbmRPd24sXG4gICAgYXNzaWduOiBleHRlbmRPd24sXG4gICAgZmluZEtleTogZmluZEtleSxcbiAgICBwaWNrOiBwaWNrLFxuICAgIG9taXQ6IG9taXQsXG4gICAgZGVmYXVsdHM6IGRlZmF1bHRzLFxuICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgIGNsb25lOiBjbG9uZSxcbiAgICB0YXA6IHRhcCxcbiAgICBpc01hdGNoOiBpc01hdGNoLFxuICAgIGlzRXF1YWw6IGlzRXF1YWwsXG4gICAgaXNFbXB0eTogaXNFbXB0eSxcbiAgICBpc0VsZW1lbnQ6IGlzRWxlbWVudCxcbiAgICBpc0FycmF5OiBpc0FycmF5LFxuICAgIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgICBpc0FyZ3VtZW50czogaXNBcmd1bWVudHMsXG4gICAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgICBpc1N0cmluZzogaXNTdHJpbmcsXG4gICAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICAgIGlzRGF0ZTogaXNEYXRlLFxuICAgIGlzUmVnRXhwOiBpc1JlZ0V4cCxcbiAgICBpc0Vycm9yOiBpc0Vycm9yLFxuICAgIGlzU3ltYm9sOiBpc1N5bWJvbCxcbiAgICBpc01hcDogaXNNYXAsXG4gICAgaXNXZWFrTWFwOiBpc1dlYWtNYXAsXG4gICAgaXNTZXQ6IGlzU2V0LFxuICAgIGlzV2Vha1NldDogaXNXZWFrU2V0LFxuICAgIGlzRmluaXRlOiBpc0Zpbml0ZSxcbiAgICBpc05hTjogaXNOYU4sXG4gICAgaXNCb29sZWFuOiBpc0Jvb2xlYW4sXG4gICAgaXNOdWxsOiBpc051bGwsXG4gICAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICAgIGhhczogaGFzLFxuICAgIGlkZW50aXR5OiBpZGVudGl0eSxcbiAgICBjb25zdGFudDogY29uc3RhbnQsXG4gICAgbm9vcDogbm9vcCxcbiAgICBwcm9wZXJ0eTogcHJvcGVydHksXG4gICAgcHJvcGVydHlPZjogcHJvcGVydHlPZixcbiAgICBtYXRjaGVyOiBtYXRjaGVyLFxuICAgIG1hdGNoZXM6IG1hdGNoZXIsXG4gICAgdGltZXM6IHRpbWVzLFxuICAgIHJhbmRvbTogcmFuZG9tLFxuICAgIG5vdzogbm93LFxuICAgIGVzY2FwZTogZXNjYXBlLFxuICAgIHVuZXNjYXBlOiB1bmVzY2FwZSxcbiAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICB1bmlxdWVJZDogdW5pcXVlSWQsXG4gICAgdGVtcGxhdGVTZXR0aW5nczogdGVtcGxhdGVTZXR0aW5ncyxcbiAgICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gICAgY2hhaW46IGNoYWluLFxuICAgIG1peGluOiBtaXhpblxuICB9KTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIHZhciBfJDEgPSBtaXhpbihhbGxFeHBvcnRzKTtcbiAgLy8gTGVnYWN5IE5vZGUuanMgQVBJXG4gIF8kMS5fID0gXyQxO1xuXG4gIHJldHVybiBfJDE7XG5cbn0pKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD11bmRlcnNjb3JlLmpzLm1hcFxuIl19
},{}],15:[function(require,module,exports){
'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var transit = require('jquery.transit');
Backbone.$ = $;

var ArtworkModel = require('models/artwork');

module.exports = Backbone.Collection.extend({

  model: ArtworkModel

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L2NvbGxlY3Rpb25zL2FydHdvcmtzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDOUIsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWYsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRTdDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7O0FBRTFDLE9BQUssRUFBRSxZQUFZOztDQUVwQixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2pvcmlzL1NpdGVzL3BsYXlncm91bmQvbnMwMi1uZXZlcmxhbmRzcGFjZS9yZXNvdXJjZXMvYXNzZXRzL2pzL3NwYWNlL2RlZmF1bHQvY29sbGVjdGlvbnMvYXJ0d29ya3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIHRyYW5zaXQgPSByZXF1aXJlKCdqcXVlcnkudHJhbnNpdCcpO1xuQmFja2JvbmUuJCA9ICQ7XG5cbnZhciBBcnR3b3JrTW9kZWwgPSByZXF1aXJlKCdtb2RlbHMvYXJ0d29yaycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblxuICBtb2RlbDogQXJ0d29ya01vZGVsXG5cbn0pOyJdfQ==
},{"backbone":2,"jquery":12,"jquery.transit":11,"models/artwork":18,"underscore":14}],16:[function(require,module,exports){
/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * @author mrdoob / http://mrdoob.com/
 */

'use strict';

THREE.CSS3DObject = function (element) {

	THREE.Object3D.call(this);

	this.element = element;
	this.element.style.position = 'absolute';

	this.addEventListener('removed', function (event) {

		if (this.element.parentNode !== null) {

			this.element.parentNode.removeChild(this.element);
		}
	});
};

THREE.CSS3DObject.prototype = Object.create(THREE.Object3D.prototype);

THREE.CSS3DSprite = function (element) {

	THREE.CSS3DObject.call(this, element);
};

THREE.CSS3DSprite.prototype = Object.create(THREE.CSS3DObject.prototype);

//

THREE.CSS3DRenderer = function () {

	console.log('THREE.CSS3DRenderer', THREE.REVISION);

	var _width, _height;
	var _widthHalf, _heightHalf;

	var matrix = new THREE.Matrix4();

	var cache = {
		camera: { fov: 0, style: '' },
		objects: {}
	};

	var domElement = document.createElement('div');
	domElement.style.overflow = 'hidden';

	domElement.style.WebkitTransformStyle = 'preserve-3d';
	domElement.style.MozTransformStyle = 'preserve-3d';
	domElement.style.oTransformStyle = 'preserve-3d';
	domElement.style.msTransformStyle = 'preserve-3d';
	domElement.style.transformStyle = 'preserve-3d';

	this.domElement = domElement;

	var cameraElement = document.createElement('div');

	cameraElement.style.WebkitTransformStyle = 'preserve-3d';
	cameraElement.style.MozTransformStyle = 'preserve-3d';
	cameraElement.style.oTransformStyle = 'preserve-3d';
	cameraElement.style.msTransformStyle = 'preserve-3d';
	cameraElement.style.transformStyle = 'preserve-3d';

	domElement.appendChild(cameraElement);

	this.setClearColor = function () {};

	this.setSize = function (width, height) {

		_width = width;
		_height = height;

		_widthHalf = _width / 2;
		_heightHalf = _height / 2;

		domElement.style.width = width + 'px';
		domElement.style.height = height + 'px';

		cameraElement.style.width = width + 'px';
		cameraElement.style.height = height + 'px';
	};

	var epsilon = function epsilon(value) {

		return Math.abs(value) < 0.000001 ? 0 : value;
	};

	var getCameraCSSMatrix = function getCameraCSSMatrix(matrix) {

		var elements = matrix.elements;

		return 'matrix3d(' + epsilon(elements[0]) + ',' + epsilon(-elements[1]) + ',' + epsilon(elements[2]) + ',' + epsilon(elements[3]) + ',' + epsilon(elements[4]) + ',' + epsilon(-elements[5]) + ',' + epsilon(elements[6]) + ',' + epsilon(elements[7]) + ',' + epsilon(elements[8]) + ',' + epsilon(-elements[9]) + ',' + epsilon(elements[10]) + ',' + epsilon(elements[11]) + ',' + epsilon(elements[12]) + ',' + epsilon(-elements[13]) + ',' + epsilon(elements[14]) + ',' + epsilon(elements[15]) + ')';
	};

	var getObjectCSSMatrix = function getObjectCSSMatrix(matrix) {

		var elements = matrix.elements;

		return 'translate3d(-50%,-50%,0) matrix3d(' + epsilon(elements[0]) + ',' + epsilon(elements[1]) + ',' + epsilon(elements[2]) + ',' + epsilon(elements[3]) + ',' + epsilon(-elements[4]) + ',' + epsilon(-elements[5]) + ',' + epsilon(-elements[6]) + ',' + epsilon(-elements[7]) + ',' + epsilon(elements[8]) + ',' + epsilon(elements[9]) + ',' + epsilon(elements[10]) + ',' + epsilon(elements[11]) + ',' + epsilon(elements[12]) + ',' + epsilon(elements[13]) + ',' + epsilon(elements[14]) + ',' + epsilon(elements[15]) + ')';
	};

	var renderObject = function renderObject(object, camera) {

		if (object instanceof THREE.CSS3DObject) {

			var style;

			if (object instanceof THREE.CSS3DSprite) {

				// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

				matrix.copy(camera.matrixWorldInverse);
				matrix.transpose();
				matrix.copyPosition(object.matrixWorld);
				matrix.scale(object.scale);

				matrix.elements[3] = 0;
				matrix.elements[7] = 0;
				matrix.elements[11] = 0;
				matrix.elements[15] = 1;

				style = getObjectCSSMatrix(matrix);
			} else {

				style = getObjectCSSMatrix(object.matrixWorld);
			}

			var element = object.element;
			var cachedStyle = cache.objects[object.id];

			if (cachedStyle === undefined || cachedStyle !== style) {

				element.style.WebkitTransform = style;
				element.style.MozTransform = style;
				element.style.oTransform = style;
				element.style.msTransform = style;
				element.style.transform = style;

				cache.objects[object.id] = style;
			}

			if (element.parentNode !== cameraElement) {

				cameraElement.appendChild(element);
			}
		}

		for (var i = 0, l = object.children.length; i < l; i++) {

			renderObject(object.children[i], camera);
		}
	};

	this.render = function (scene, camera) {

		var fov = 0.5 / Math.tan(THREE.Math.degToRad(camera.fov * 0.5)) * _height;

		if (cache.camera.fov !== fov) {

			domElement.style.WebkitPerspective = fov + "px";
			domElement.style.MozPerspective = fov + "px";
			domElement.style.oPerspective = fov + "px";
			domElement.style.msPerspective = fov + "px";
			domElement.style.perspective = fov + "px";

			cache.camera.fov = fov;
		}

		scene.updateMatrixWorld();

		if (camera.parent === undefined) camera.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse(camera.matrixWorld);

		var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix(camera.matrixWorldInverse) + " translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";

		if (cache.camera.style !== style) {

			cameraElement.style.WebkitTransform = style;
			cameraElement.style.MozTransform = style;
			cameraElement.style.oTransform = style;
			cameraElement.style.msTransform = style;
			cameraElement.style.transform = style;

			cache.camera.style = style;
		}

		renderObject(scene, camera);
	};
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L2xpYnMvQ1NTM0RSZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBS0EsS0FBSyxDQUFDLFdBQVcsR0FBRyxVQUFXLE9BQU8sRUFBRzs7QUFFeEMsTUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFFLENBQUM7O0FBRTVCLEtBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7O0FBRXpDLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBRSxTQUFTLEVBQUUsVUFBVyxLQUFLLEVBQUc7O0FBRXBELE1BQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssSUFBSSxFQUFHOztBQUV2QyxPQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBRSxDQUFDO0dBRXBEO0VBRUQsQ0FBRSxDQUFDO0NBRUosQ0FBQzs7QUFFRixLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFFLENBQUM7O0FBRXhFLEtBQUssQ0FBQyxXQUFXLEdBQUcsVUFBVyxPQUFPLEVBQUc7O0FBRXhDLE1BQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFFLElBQUksRUFBRSxPQUFPLENBQUUsQ0FBQztDQUV4QyxDQUFDOztBQUVGLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUUsQ0FBQzs7OztBQUkzRSxLQUFLLENBQUMsYUFBYSxHQUFHLFlBQVk7O0FBRWpDLFFBQU8s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QyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7O0FBRTFDLFFBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztHQUV2Qjs7QUFFRCxPQUFLLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFMUIsTUFBSyxNQUFNLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFOUQsUUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBRSxNQUFNLENBQUMsV0FBVyxDQUFFLENBQUM7O0FBRTNELE1BQUksS0FBSyxHQUFHLGtCQUFrQixHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsa0JBQWtCLENBQUUsTUFBTSxDQUFDLGtCQUFrQixDQUFFLEdBQzdGLGVBQWUsR0FBRyxVQUFVLEdBQUcsS0FBSyxHQUFHLFdBQVcsR0FBRyxRQUFRLENBQUM7O0FBRS9ELE1BQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFHOztBQUVuQyxnQkFBYSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO0FBQzVDLGdCQUFhLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDekMsZ0JBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN2QyxnQkFBYSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3hDLGdCQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7O0FBRXRDLFFBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztHQUUzQjs7QUFFRCxjQUFZLENBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBRSxDQUFDO0VBRTlCLENBQUM7Q0FFRixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L2xpYnMvQ1NTM0RSZW5kZXJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQmFzZWQgb24gaHR0cDovL3d3dy5lbWFnaXgubmV0L2FjYWRlbWljL21zY3MtcHJvamVjdC9pdGVtL2NhbWVyYS1zeW5jLXdpdGgtY3NzMy1hbmQtd2ViZ2wtdGhyZWVqc1xuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbS9cbiAqL1xuXG5USFJFRS5DU1MzRE9iamVjdCA9IGZ1bmN0aW9uICggZWxlbWVudCApIHtcblxuXHRUSFJFRS5PYmplY3QzRC5jYWxsKCB0aGlzICk7XG5cblx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblx0dGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblxuXHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoICdyZW1vdmVkJywgZnVuY3Rpb24gKCBldmVudCApIHtcblxuXHRcdGlmICggdGhpcy5lbGVtZW50LnBhcmVudE5vZGUgIT09IG51bGwgKSB7XG5cblx0XHRcdHRoaXMuZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCB0aGlzLmVsZW1lbnQgKTtcblxuXHRcdH1cblxuXHR9ICk7XG5cbn07XG5cblRIUkVFLkNTUzNET2JqZWN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFRIUkVFLk9iamVjdDNELnByb3RvdHlwZSApO1xuXG5USFJFRS5DU1MzRFNwcml0ZSA9IGZ1bmN0aW9uICggZWxlbWVudCApIHtcblxuXHRUSFJFRS5DU1MzRE9iamVjdC5jYWxsKCB0aGlzLCBlbGVtZW50ICk7XG5cbn07XG5cblRIUkVFLkNTUzNEU3ByaXRlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFRIUkVFLkNTUzNET2JqZWN0LnByb3RvdHlwZSApO1xuXG4vL1xuXG5USFJFRS5DU1MzRFJlbmRlcmVyID0gZnVuY3Rpb24gKCkge1xuXG5cdGNvbnNvbGUubG9nKCAnVEhSRUUuQ1NTM0RSZW5kZXJlcicsIFRIUkVFLlJFVklTSU9OICk7XG5cblx0dmFyIF93aWR0aCwgX2hlaWdodDtcblx0dmFyIF93aWR0aEhhbGYsIF9oZWlnaHRIYWxmO1xuXG5cdHZhciBtYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuXHRcblx0dmFyIGNhY2hlID0ge1xuXHRcdGNhbWVyYTogeyBmb3Y6IDAsIHN0eWxlOiAnJyB9LFxuXHRcdG9iamVjdHM6IHt9XG5cdH07XG5cblx0dmFyIGRvbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRkb21FbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG5cblx0ZG9tRWxlbWVudC5zdHlsZS5XZWJraXRUcmFuc2Zvcm1TdHlsZSA9ICdwcmVzZXJ2ZS0zZCc7XG5cdGRvbUVsZW1lbnQuc3R5bGUuTW96VHJhbnNmb3JtU3R5bGUgPSAncHJlc2VydmUtM2QnO1xuXHRkb21FbGVtZW50LnN0eWxlLm9UcmFuc2Zvcm1TdHlsZSA9ICdwcmVzZXJ2ZS0zZCc7XG5cdGRvbUVsZW1lbnQuc3R5bGUubXNUcmFuc2Zvcm1TdHlsZSA9ICdwcmVzZXJ2ZS0zZCc7XG5cdGRvbUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtU3R5bGUgPSAncHJlc2VydmUtM2QnO1xuXG5cdHRoaXMuZG9tRWxlbWVudCA9IGRvbUVsZW1lbnQ7XG5cblx0dmFyIGNhbWVyYUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXG5cdGNhbWVyYUVsZW1lbnQuc3R5bGUuV2Via2l0VHJhbnNmb3JtU3R5bGUgPSAncHJlc2VydmUtM2QnO1xuXHRjYW1lcmFFbGVtZW50LnN0eWxlLk1velRyYW5zZm9ybVN0eWxlID0gJ3ByZXNlcnZlLTNkJztcblx0Y2FtZXJhRWxlbWVudC5zdHlsZS5vVHJhbnNmb3JtU3R5bGUgPSAncHJlc2VydmUtM2QnO1xuXHRjYW1lcmFFbGVtZW50LnN0eWxlLm1zVHJhbnNmb3JtU3R5bGUgPSAncHJlc2VydmUtM2QnO1xuXHRjYW1lcmFFbGVtZW50LnN0eWxlLnRyYW5zZm9ybVN0eWxlID0gJ3ByZXNlcnZlLTNkJztcblxuXHRkb21FbGVtZW50LmFwcGVuZENoaWxkKCBjYW1lcmFFbGVtZW50ICk7XG5cblx0dGhpcy5zZXRDbGVhckNvbG9yID0gZnVuY3Rpb24gKCkge1xuXG5cdH07XG5cblx0dGhpcy5zZXRTaXplID0gZnVuY3Rpb24gKCB3aWR0aCwgaGVpZ2h0ICkge1xuXG5cdFx0X3dpZHRoID0gd2lkdGg7XG5cdFx0X2hlaWdodCA9IGhlaWdodDtcblxuXHRcdF93aWR0aEhhbGYgPSBfd2lkdGggLyAyO1xuXHRcdF9oZWlnaHRIYWxmID0gX2hlaWdodCAvIDI7XG5cblx0XHRkb21FbGVtZW50LnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuXHRcdGRvbUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuXHRcdGNhbWVyYUVsZW1lbnQuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG5cdFx0Y2FtZXJhRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG5cdH07XG5cblx0dmFyIGVwc2lsb24gPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuXG5cdFx0cmV0dXJuIE1hdGguYWJzKCB2YWx1ZSApIDwgMC4wMDAwMDEgPyAwIDogdmFsdWU7XG5cblx0fTtcblxuXHR2YXIgZ2V0Q2FtZXJhQ1NTTWF0cml4ID0gZnVuY3Rpb24gKCBtYXRyaXggKSB7XG5cblx0XHR2YXIgZWxlbWVudHMgPSBtYXRyaXguZWxlbWVudHM7XG5cblx0XHRyZXR1cm4gJ21hdHJpeDNkKCcgK1xuXHRcdFx0ZXBzaWxvbiggZWxlbWVudHNbIDAgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIC0gZWxlbWVudHNbIDEgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIGVsZW1lbnRzWyAyIF0gKSArICcsJyArXG5cdFx0XHRlcHNpbG9uKCBlbGVtZW50c1sgMyBdICkgKyAnLCcgK1xuXHRcdFx0ZXBzaWxvbiggZWxlbWVudHNbIDQgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIC0gZWxlbWVudHNbIDUgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIGVsZW1lbnRzWyA2IF0gKSArICcsJyArXG5cdFx0XHRlcHNpbG9uKCBlbGVtZW50c1sgNyBdICkgKyAnLCcgK1xuXHRcdFx0ZXBzaWxvbiggZWxlbWVudHNbIDggXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIC0gZWxlbWVudHNbIDkgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIGVsZW1lbnRzWyAxMCBdICkgKyAnLCcgK1xuXHRcdFx0ZXBzaWxvbiggZWxlbWVudHNbIDExIF0gKSArICcsJyArXG5cdFx0XHRlcHNpbG9uKCBlbGVtZW50c1sgMTIgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIC0gZWxlbWVudHNbIDEzIF0gKSArICcsJyArXG5cdFx0XHRlcHNpbG9uKCBlbGVtZW50c1sgMTQgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIGVsZW1lbnRzWyAxNSBdICkgK1xuXHRcdCcpJztcblxuXHR9O1xuXG5cdHZhciBnZXRPYmplY3RDU1NNYXRyaXggPSBmdW5jdGlvbiAoIG1hdHJpeCApIHtcblxuXHRcdHZhciBlbGVtZW50cyA9IG1hdHJpeC5lbGVtZW50cztcblxuXHRcdHJldHVybiAndHJhbnNsYXRlM2QoLTUwJSwtNTAlLDApIG1hdHJpeDNkKCcgK1xuXHRcdFx0ZXBzaWxvbiggZWxlbWVudHNbIDAgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIGVsZW1lbnRzWyAxIF0gKSArICcsJyArXG5cdFx0XHRlcHNpbG9uKCBlbGVtZW50c1sgMiBdICkgKyAnLCcgK1xuXHRcdFx0ZXBzaWxvbiggZWxlbWVudHNbIDMgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIC0gZWxlbWVudHNbIDQgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIC0gZWxlbWVudHNbIDUgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIC0gZWxlbWVudHNbIDYgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIC0gZWxlbWVudHNbIDcgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIGVsZW1lbnRzWyA4IF0gKSArICcsJyArXG5cdFx0XHRlcHNpbG9uKCBlbGVtZW50c1sgOSBdICkgKyAnLCcgK1xuXHRcdFx0ZXBzaWxvbiggZWxlbWVudHNbIDEwIF0gKSArICcsJyArXG5cdFx0XHRlcHNpbG9uKCBlbGVtZW50c1sgMTEgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIGVsZW1lbnRzWyAxMiBdICkgKyAnLCcgK1xuXHRcdFx0ZXBzaWxvbiggZWxlbWVudHNbIDEzIF0gKSArICcsJyArXG5cdFx0XHRlcHNpbG9uKCBlbGVtZW50c1sgMTQgXSApICsgJywnICtcblx0XHRcdGVwc2lsb24oIGVsZW1lbnRzWyAxNSBdICkgK1xuXHRcdCcpJztcblxuXHR9O1xuXG5cdHZhciByZW5kZXJPYmplY3QgPSBmdW5jdGlvbiAoIG9iamVjdCwgY2FtZXJhICkge1xuXG5cdFx0aWYgKCBvYmplY3QgaW5zdGFuY2VvZiBUSFJFRS5DU1MzRE9iamVjdCApIHtcblxuXHRcdFx0dmFyIHN0eWxlO1xuXG5cdFx0XHRpZiAoIG9iamVjdCBpbnN0YW5jZW9mIFRIUkVFLkNTUzNEU3ByaXRlICkge1xuXG5cdFx0XHRcdC8vIGh0dHA6Ly9zd2lmdGNvZGVyLndvcmRwcmVzcy5jb20vMjAwOC8xMS8yNS9jb25zdHJ1Y3RpbmctYS1iaWxsYm9hcmQtbWF0cml4L1xuXG5cdFx0XHRcdG1hdHJpeC5jb3B5KCBjYW1lcmEubWF0cml4V29ybGRJbnZlcnNlICk7XG5cdFx0XHRcdG1hdHJpeC50cmFuc3Bvc2UoKTtcblx0XHRcdFx0bWF0cml4LmNvcHlQb3NpdGlvbiggb2JqZWN0Lm1hdHJpeFdvcmxkICk7XG5cdFx0XHRcdG1hdHJpeC5zY2FsZSggb2JqZWN0LnNjYWxlICk7XG5cblx0XHRcdFx0bWF0cml4LmVsZW1lbnRzWyAzIF0gPSAwO1xuXHRcdFx0XHRtYXRyaXguZWxlbWVudHNbIDcgXSA9IDA7XG5cdFx0XHRcdG1hdHJpeC5lbGVtZW50c1sgMTEgXSA9IDA7XG5cdFx0XHRcdG1hdHJpeC5lbGVtZW50c1sgMTUgXSA9IDE7XG5cblx0XHRcdFx0c3R5bGUgPSBnZXRPYmplY3RDU1NNYXRyaXgoIG1hdHJpeCApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHN0eWxlID0gZ2V0T2JqZWN0Q1NTTWF0cml4KCBvYmplY3QubWF0cml4V29ybGQgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgZWxlbWVudCA9IG9iamVjdC5lbGVtZW50O1xuXHRcdFx0dmFyIGNhY2hlZFN0eWxlID0gY2FjaGUub2JqZWN0c1sgb2JqZWN0LmlkIF07XG5cblx0XHRcdGlmICggY2FjaGVkU3R5bGUgPT09IHVuZGVmaW5lZCB8fCBjYWNoZWRTdHlsZSAhPT0gc3R5bGUgKSB7XG5cblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5XZWJraXRUcmFuc2Zvcm0gPSBzdHlsZTtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5Nb3pUcmFuc2Zvcm0gPSBzdHlsZTtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5vVHJhbnNmb3JtID0gc3R5bGU7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUubXNUcmFuc2Zvcm0gPSBzdHlsZTtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBzdHlsZTtcblxuXHRcdFx0XHRjYWNoZS5vYmplY3RzWyBvYmplY3QuaWQgXSA9IHN0eWxlO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggZWxlbWVudC5wYXJlbnROb2RlICE9PSBjYW1lcmFFbGVtZW50ICkge1xuXG5cdFx0XHRcdGNhbWVyYUVsZW1lbnQuYXBwZW5kQ2hpbGQoIGVsZW1lbnQgKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Zm9yICggdmFyIGkgPSAwLCBsID0gb2JqZWN0LmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XG5cblx0XHRcdHJlbmRlck9iamVjdCggb2JqZWN0LmNoaWxkcmVuWyBpIF0sIGNhbWVyYSApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5yZW5kZXIgPSBmdW5jdGlvbiAoIHNjZW5lLCBjYW1lcmEgKSB7XG5cblx0XHR2YXIgZm92ID0gMC41IC8gTWF0aC50YW4oIFRIUkVFLk1hdGguZGVnVG9SYWQoIGNhbWVyYS5mb3YgKiAwLjUgKSApICogX2hlaWdodDtcblxuXHRcdGlmICggY2FjaGUuY2FtZXJhLmZvdiAhPT0gZm92ICkge1xuXG5cdFx0XHRkb21FbGVtZW50LnN0eWxlLldlYmtpdFBlcnNwZWN0aXZlID0gZm92ICsgXCJweFwiO1xuXHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5Nb3pQZXJzcGVjdGl2ZSA9IGZvdiArIFwicHhcIjtcblx0XHRcdGRvbUVsZW1lbnQuc3R5bGUub1BlcnNwZWN0aXZlID0gZm92ICsgXCJweFwiO1xuXHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5tc1BlcnNwZWN0aXZlID0gZm92ICsgXCJweFwiO1xuXHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5wZXJzcGVjdGl2ZSA9IGZvdiArIFwicHhcIjtcblxuXHRcdFx0Y2FjaGUuY2FtZXJhLmZvdiA9IGZvdjtcblxuXHRcdH1cblxuXHRcdHNjZW5lLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG5cblx0XHRpZiAoIGNhbWVyYS5wYXJlbnQgPT09IHVuZGVmaW5lZCApIGNhbWVyYS51cGRhdGVNYXRyaXhXb3JsZCgpO1xuXG5cdFx0Y2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZS5nZXRJbnZlcnNlKCBjYW1lcmEubWF0cml4V29ybGQgKTtcblxuXHRcdHZhciBzdHlsZSA9IFwidHJhbnNsYXRlM2QoMCwwLFwiICsgZm92ICsgXCJweClcIiArIGdldENhbWVyYUNTU01hdHJpeCggY2FtZXJhLm1hdHJpeFdvcmxkSW52ZXJzZSApICtcblx0XHRcdFwiIHRyYW5zbGF0ZTNkKFwiICsgX3dpZHRoSGFsZiArIFwicHgsXCIgKyBfaGVpZ2h0SGFsZiArIFwicHgsIDApXCI7XG5cblx0XHRpZiAoIGNhY2hlLmNhbWVyYS5zdHlsZSAhPT0gc3R5bGUgKSB7XG5cblx0XHRcdGNhbWVyYUVsZW1lbnQuc3R5bGUuV2Via2l0VHJhbnNmb3JtID0gc3R5bGU7XG5cdFx0XHRjYW1lcmFFbGVtZW50LnN0eWxlLk1velRyYW5zZm9ybSA9IHN0eWxlO1xuXHRcdFx0Y2FtZXJhRWxlbWVudC5zdHlsZS5vVHJhbnNmb3JtID0gc3R5bGU7XG5cdFx0XHRjYW1lcmFFbGVtZW50LnN0eWxlLm1zVHJhbnNmb3JtID0gc3R5bGU7XG5cdFx0XHRjYW1lcmFFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IHN0eWxlO1xuXHRcdFx0XG5cdFx0XHRjYWNoZS5jYW1lcmEuc3R5bGUgPSBzdHlsZTtcblxuXHRcdH1cblxuXHRcdHJlbmRlck9iamVjdCggc2NlbmUsIGNhbWVyYSApO1xuXG5cdH07XG5cbn07XG4iXX0=
},{}],17:[function(require,module,exports){
/*!
 * 360 degree Image Slider v2.0.4
 * http://gaurav.jassal.me
 *
 * Copyright 2015, gaurav@jassal.me
 * Dual licensed under the MIT or GPL Version 3 licenses.
 *
 */
'use strict';

(function ($) {
  'use strict';
  /**
   * @class ThreeSixty
   * **The ThreeSixty slider class**.
   *
   * This as jQuery plugin to create 360 degree product image slider.
   * The plugin is full customizable with number of options provided. The plugin
   * have the power to display images in any angle 360 degrees. This feature can be
   * used successfully in many use cases e.g. on an e-commerce site to help customers
   * look products in detail, from any angle they desire.
   *
   * **Features**
   *
   * - Smooth Animation
   * - Plenty of option parameters for customization
   * - Api interaction
   * - Simple mouse interaction
   * - Custom behavior tweaking
   * - Support for touch devices
   * - Easy to integrate
   * - No flash
   *
   * Example code:
   *      var product1 = $('.product1').ThreeSixty({
   *        totalFrames: 72,
   *        endFrame: 72,
   *        currentFrame: 1,
   *        imgList: '.threesixty_images',
   *        progress: '.spinner',
   *        imagePath:'/assets/product1/',
   *        filePrefix: 'ipod-',
   *        ext: '.jpg',
   *        height: 265,
   *        width: 400,
   *        navigation: true
   *      });
   * **Note:** There are loads other options that you can override to customize
   * this plugin.
    * @extends jQuery
   * @singleton
   * @param {String} [el] jQuery selector string for the parent container
   * @param {Object} [options] An optional config object
   *
   * @return this
   */
  $.ThreeSixty = function (el, options) {
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this,
        AppConfig,
        frames = [],
        VERSION = '2.0.5';
    // Access to jQuery and DOM versions of element
    /**
     * @property {$el}
     * jQuery Dom node attached to the slider inherits all jQuery public functions.
     */
    base.$el = $(el);
    base.el = el;
    // Add a reverse reference to the DOM object
    base.$el.data('ThreeSixty', base);
    /**
     * @method init
     * The function extends the user options with default settings for the
     * slider and initilize the slider.
     * **Style Override example**
     *
     *      var product1 = $('.product1').ThreeSixty({
     *        totalFrames: 72,
     *        endFrame: 72,
     *        currentFrame: 1,
     *        imgList: '.threesixty_images',
     *        progress: '.spinner',
     *        imagePath:'/assets/product1/',
     *        filePrefix: 'ipod-',
     *        ext: '.jpg',
     *        height: 265,
     *        width: 400,
     *        navigation: true,
     *        styles: {
     *          border: 2px solide #b4b4b4,
     *          background: url(http://example.com/images/loader.gif) no-repeat
     *        }
     *      });
     */
    base.init = function () {
      AppConfig = $.extend({}, $.ThreeSixty.defaultOptions, options);
      if (AppConfig.disableSpin) {
        AppConfig.currentFrame = 1;
        AppConfig.endFrame = 1;
      }
      base.initProgress();
      base.loadImages();
    };

    /*
     * Function to resize the height of responsive slider.
     */
    base.resize = function () {
      // calculate height
    };
    /**
     * @method initProgress
     * The function sets initial styles and start the progress indicator
     * to show loading of images.
     *
     * @private
     */
    base.initProgress = function () {
      base.$el.css({
        width: AppConfig.width + 'px',
        height: AppConfig.height + 'px',
        'background-image': 'none !important'
      });
      if (AppConfig.styles) {
        base.$el.css(AppConfig.styles);
      }

      base.responsive();

      base.$el.find(AppConfig.progress).css({
        marginTop: AppConfig.height / 2 - 15 + 'px'
      });
      base.$el.find(AppConfig.progress).fadeIn('slow');
      base.$el.find(AppConfig.imgList).hide();
    };

    /**
     * @method loadImages
     * @private
     * The function asynchronously loads images and inject into the slider.
     */
    base.loadImages = function () {
      var li, imageName, image, host, baseIndex;
      li = document.createElement('li');
      baseIndex = AppConfig.zeroBased ? 0 : 1;
      imageName = !AppConfig.imgArray ? AppConfig.domain + AppConfig.imagePath + AppConfig.filePrefix + base.zeroPad(AppConfig.loadedImages + baseIndex) + AppConfig.ext + (base.browser.isIE() ? '?' + new Date().getTime() : '') : AppConfig.imgArray[AppConfig.loadedImages];
      image = $('<img>').attr('src', imageName).addClass('previous-image').appendTo(li);

      frames.push(image);

      base.$el.find(AppConfig.imgList).append(li);

      base.imageLoaded();
      // $(image).load(function () {
      // });
    };

    /**
     * @method loadImages
     * @private
     * The function gets triggers once the image is loaded. We also update
     * the progress percentage in this function.
     */
    base.imageLoaded = function () {
      AppConfig.loadedImages += 1;
      $(AppConfig.progress + ' span').text(Math.floor(AppConfig.loadedImages / AppConfig.totalFrames * 100) + '%');
      if (AppConfig.loadedImages >= AppConfig.totalFrames) {
        if (AppConfig.disableSpin) {
          frames[0].removeClass('previous-image').addClass('current-image');
        }
        // console.log('images loaded');
        base.showImages();
        base.showNavigation();
        $(AppConfig.progress).fadeOut('slow', function () {
          $(this).hide();
        });
      } else {
        base.loadImages();
      }
    };

    /**
     * @method loadImages
     * @private
     * This function is called when all the images are loaded.
     * **The function does following operations**
     * - Removes background image placeholder
     * - Displays the 360 images
     * - Initilizes mouse intraction events
     */
    base.showImages = function () {
      base.$el.find('.txtC').fadeIn();
      base.$el.find(AppConfig.imgList).fadeIn();
      base.ready = true;
      AppConfig.ready = true;

      if (AppConfig.drag) {
        base.initEvents();
      }
      base.refresh();
      base.initPlugins();
      AppConfig.onReady();

      setTimeout(function () {
        base.responsive();
      }, 50);
    };

    /**
     * The function to initilize external plugin
     */
    base.initPlugins = function () {
      $.each(AppConfig.plugins, function (i, plugin) {
        if (typeof $[plugin] === 'function') {
          $[plugin].call(base, base.$el, AppConfig);
        } else {
          throw new Error(plugin + ' not available.');
        }
      });
    };

    /**
     * @method showNavigation
     * Creates a navigation panel if navigation is set to true in the
     * settings.
     */
    base.showNavigation = function () {
      if (AppConfig.navigation && !AppConfig.navigation_init) {
        var nav_bar, next, previous, play_stop;

        nav_bar = $('<div/>').attr('class', 'nav_bar');

        next = $('<a/>').attr({
          'href': '#',
          'class': 'nav_bar_next'
        }).html('next');

        previous = $('<a/>').attr({
          'href': '#',
          'class': 'nav_bar_previous'
        }).html('previous');

        play_stop = $('<a/>').attr({
          'href': '#',
          'class': 'nav_bar_play'
        }).html('play');

        nav_bar.append(previous);
        nav_bar.append(play_stop);
        nav_bar.append(next);

        base.$el.prepend(nav_bar);

        next.bind('mousedown touchstart', base.next);
        previous.bind('mousedown touchstart', base.previous);
        play_stop.bind('mousedown touchstart', base.play_stop);
        AppConfig.navigation_init = true;
      }
    };

    /**
     * @method play_stop
     * @private
     * Function toggles the autoplay rotation of 360 slider
     * @param {Object} [event] jQuery events object.
     *
     */

    base.play_stop = function (event) {
      event.preventDefault();

      if (!AppConfig.autoplay) {
        AppConfig.autoplay = true;
        AppConfig.play = setInterval(base.moveToNextFrame, AppConfig.playSpeed);
        $(event.currentTarget).removeClass('nav_bar_play').addClass('nav_bar_stop');
      } else {
        AppConfig.autoplay = false;
        $(event.currentTarget).removeClass('nav_bar_stop').addClass('nav_bar_play');
        clearInterval(AppConfig.play);
        AppConfig.play = null;
      }
    };

    /**
     * @method next
     * Using this function you can rotate 360 to next 5 frames.
     * @param {Object} [event] jQuery events object.
     *
     */

    base.next = function (event) {
      if (event) {
        event.preventDefault();
      }
      AppConfig.endFrame -= 5;
      base.refresh();
    };

    /**
     * @method previous
     * Using this function you can rotate 360 to previous 5 frames.
     * @param {Object} [event] jQuery events object.
     *
     */
    base.previous = function (event) {
      if (event) {
        event.preventDefault();
      }
      AppConfig.endFrame += 5;
      base.refresh();
    };

    /**
     * @method play
     * You are start the auto rotaion for the slider with this function.
     *
     */
    base.play = function (speed) {
      var _speed = speed || AppConfig.playSpeed;
      if (!AppConfig.autoplay) {
        AppConfig.autoplay = true;
        AppConfig.play = setInterval(base.moveToNextFrame, _speed);
      }
    };

    /**
     * @method stop
     * You can stop the auto rotation of the 360 slider with this function.
     *
     */

    base.stop = function () {
      if (AppConfig.autoplay) {
        AppConfig.autoplay = false;
        clearInterval(AppConfig.play);
        AppConfig.play = null;
      }
    };

    /**
     * @method endFrame
     * @private
     * Function animates to previous frame
     *
     */
    base.moveToNextFrame = function () {
      if (AppConfig.autoplayDirection === 1) {
        AppConfig.endFrame -= 1;
      } else {
        AppConfig.endFrame += 1;
      }
      base.refresh();
    };

    /**
     * @method gotoAndPlay
     * @public
     * Function animates to previous frame
     *
     */
    base.gotoAndPlay = function (n) {
      if (AppConfig.disableWrap) {
        AppConfig.endFrame = n;
        base.refresh();
      } else {
        // Since we could be looped around grab the multiplier
        var multiplier = Math.ceil(AppConfig.endFrame / AppConfig.totalFrames);
        if (multiplier === 0) {
          multiplier = 1;
        }

        // Figure out the quickest path to the requested frame
        var realEndFrame = multiplier > 1 ? AppConfig.endFrame - (multiplier - 1) * AppConfig.totalFrames : AppConfig.endFrame;

        var currentFromEnd = AppConfig.totalFrames - realEndFrame;

        // Jump past end if it's faster
        var newEndFrame = 0;
        if (n - realEndFrame > 0) {
          // Faster to move the difference ahead?
          if (n - realEndFrame < realEndFrame + (AppConfig.totalFrames - n)) {
            newEndFrame = AppConfig.endFrame + (n - realEndFrame);
          } else {
            newEndFrame = AppConfig.endFrame - (realEndFrame + (AppConfig.totalFrames - n));
          }
        } else {
          // Faster to move the distance back?
          if (realEndFrame - n < currentFromEnd + n) {
            newEndFrame = AppConfig.endFrame - (realEndFrame - n);
          } else {
            newEndFrame = AppConfig.endFrame + (currentFromEnd + n);
          }
        }

        // Now set the end frame
        if (realEndFrame !== n) {
          AppConfig.endFrame = newEndFrame;
          base.refresh();
        }
      }
    };

    /**
     * @method initEvents
     * @private
     * Function initilizes all the mouse and touch events for 360 slider movement.
     *
     */
    base.initEvents = function () {
      base.$el.bind('mousedown touchstart touchmove touchend mousemove click', function (event) {

        event.preventDefault();

        if (event.type === 'mousedown' && event.which === 1 || event.type === 'touchstart') {
          AppConfig.pointerStartPosX = base.getPointerEvent(event).pageX;
          AppConfig.dragging = true;
        } else if (event.type === 'touchmove') {
          base.trackPointer(event);
        } else if (event.type === 'touchend') {
          AppConfig.dragging = false;
        }
      });

      $(document).bind('mouseup', function (event) {
        //event.preventDefault();
        AppConfig.dragging = false;
        $(this).css('cursor', 'none');
      });

      $(window).bind('resize', function (event) {
        base.responsive();
      });

      $(document).bind('mousemove', function (event) {
        if (AppConfig.dragging) {
          event.preventDefault();
          if (!base.browser.isIE && AppConfig.showCursor) {
            base.$el.css('cursor', 'url(assets/images/hand_closed.png), auto');
          }
        } else {
          if (!base.browser.isIE && AppConfig.showCursor) {
            base.$el.css('cursor', 'url(assets/images/hand_open.png), auto');
          }
        }
        base.trackPointer(event);
      });

      $(window).resize(function () {
        base.resize();
      });
    };

    /**
     * @method getPointerEvent
     * @private
     * Function returns touch pointer events
     *
     * @params {Object} [event]
     */
    base.getPointerEvent = function (event) {
      return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
    };

    /**
     * @method trackPointer
     * @private
     * Function calculates the distance between the start pointer and end pointer/
     *
     * @params {Object} [event]
     */
    base.trackPointer = function (event) {
      if (AppConfig.ready && AppConfig.dragging) {
        AppConfig.pointerEndPosX = base.getPointerEvent(event).pageX;
        if (AppConfig.monitorStartTime < new Date().getTime() - AppConfig.monitorInt) {
          AppConfig.pointerDistance = AppConfig.pointerEndPosX - AppConfig.pointerStartPosX;
          if (AppConfig.pointerDistance > 0) {
            AppConfig.endFrame = AppConfig.currentFrame + Math.ceil((AppConfig.totalFrames - 1) * AppConfig.speedMultiplier * (AppConfig.pointerDistance / base.$el.width()));
          } else {
            AppConfig.endFrame = AppConfig.currentFrame + Math.floor((AppConfig.totalFrames - 1) * AppConfig.speedMultiplier * (AppConfig.pointerDistance / base.$el.width()));
          }

          if (AppConfig.disableWrap) {
            AppConfig.endFrame = Math.min(AppConfig.totalFrames - (AppConfig.zeroBased ? 1 : 0), AppConfig.endFrame);
            AppConfig.endFrame = Math.max(AppConfig.zeroBased ? 0 : 1, AppConfig.endFrame);
          }

          base.refresh();
          AppConfig.monitorStartTime = new Date().getTime();
          AppConfig.pointerStartPosX = base.getPointerEvent(event).pageX;
        }
      }
    };

    /**
     * @method refresh
     * @public
     * Function refeshes the timer and set interval for render cycle.
     *
     */

    base.refresh = function () {
      if (AppConfig.ticker === 0) {
        AppConfig.ticker = setInterval(base.render, Math.round(1000 / AppConfig.framerate));
      }
    };

    /**
    * @method refresh
    * @private
    * Function render the animation frames on the screen with easing effect.
    */

    base.render = function () {
      var frameEasing;
      if (AppConfig.currentFrame !== AppConfig.endFrame) {
        frameEasing = AppConfig.endFrame < AppConfig.currentFrame ? Math.floor((AppConfig.endFrame - AppConfig.currentFrame) * 0.1) : Math.ceil((AppConfig.endFrame - AppConfig.currentFrame) * 0.1);
        base.hidePreviousFrame();
        AppConfig.currentFrame += frameEasing;
        base.showCurrentFrame();
        base.$el.trigger('frameIndexChanged', [base.getNormalizedCurrentFrame(), AppConfig.totalFrames]);
      } else {
        window.clearInterval(AppConfig.ticker);
        AppConfig.ticker = 0;
      }
    };

    /**
     * @method hidePreviousFrame
     * @private
     * Function hide the previous frame in the animation loop.
     */

    base.hidePreviousFrame = function () {
      if (frames[base.getNormalizedCurrentFrame() - 1]) frames[base.getNormalizedCurrentFrame() - 1].removeClass('current-image').addClass('previous-image');
    };

    /**
     * @method showCurrentFrame
     * @private
     * Function shows the current frame in the animation loop.
     */
    base.showCurrentFrame = function () {
      if (frames[base.getNormalizedCurrentFrame() - 1]) frames[base.getNormalizedCurrentFrame() - 1].removeClass('previous-image').addClass('current-image');
    };

    /**
     * @method getNormalizedCurrentFrame
     * @private
     * Function normalize and calculate the current frame once the user release the mouse and release touch event.
     */

    base.getNormalizedCurrentFrame = function () {
      var c, e;

      if (!AppConfig.disableWrap) {
        c = Math.ceil(AppConfig.currentFrame % AppConfig.totalFrames);
        if (c < 0) {
          c += AppConfig.totalFrames - (AppConfig.zeroBased ? 1 : 0);
        }
      } else {
        c = Math.min(AppConfig.currentFrame, AppConfig.totalFrames - (AppConfig.zeroBased ? 1 : 0));
        e = Math.min(AppConfig.endFrame, AppConfig.totalFrames - (AppConfig.zeroBased ? 1 : 0));
        c = Math.max(c, AppConfig.zeroBased ? 0 : 1);
        e = Math.max(e, AppConfig.zeroBased ? 0 : 1);
        AppConfig.currentFrame = c;
        AppConfig.endFrame = e;
      }

      return c;
    };

    /*
     * @method getCurrentFrame
     * Function returns the current active frame.
     *
     * @return Number
     */

    base.getCurrentFrame = function () {
      return AppConfig.currentFrame;
    };

    /*
    * @method responsive
    * Function calculates and set responsive height and width
    *
    */

    base.responsive = function () {
      if (AppConfig.responsive) {
        base.$el.css({
          height: base.$el.find('.current-image').first().css('height'),
          width: '100%'
        });
      }
    };

    /**
     * Function to return with zero padding.
     */
    base.zeroPad = function (num) {
      function pad(number, length) {
        var str = number.toString();
        if (AppConfig.zeroPadding) {
          while (str.length < length) {
            str = '0' + str;
          }
        }
        return str;
      }

      var approximateLog = Math.log(AppConfig.totalFrames) / Math.LN10;
      var roundTo = 1e3;
      var roundedLog = Math.round(approximateLog * roundTo) / roundTo;
      var numChars = Math.floor(roundedLog) + 1;
      return pad(num, numChars);
    };

    base.browser = {};

    /**
     * Function to detect if the brower is IE
     * @return {boolean}
     *
     * http://msdn.microsoft.com/en-gb/library/ms537509(v=vs.85).aspx
     */
    base.browser.isIE = function () {
      var rv = -1;
      if (navigator.appName === 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');
        if (re.exec(ua) !== null) {
          rv = parseFloat(RegExp.$1);
        }
      }

      return rv !== -1;
    };

    /**
     * @method getConfig
     * The function returns the extended version of config object the plugin is going to
     * user.
     *
     * @public
     *
     * @return Object
     */
    base.getConfig = function () {
      return AppConfig;
    };

    $.ThreeSixty.defaultOptions = {
      /**
       * @cfg {Boolean} dragging [dragging=false]
       * @private
       * Private propery contains a flags if users is in dragging mode.
       */
      dragging: false,
      /**
       * @cfg {Boolean} ready [ready=false]
       * @private
       * Private propery is set to true is all assets are loading and application is
       * ready to render 360 slider.
       */
      ready: false,
      /**
       * @cfg {Number} pointerStartPosX
       * @private
       * private property mouse pointer start x position when user starts dragging slider.
       */
      pointerStartPosX: 0,
      /**
       * @cfg {Number} pointerEndPosX
       * @private
       * private property mouse pointer start x position when user end dragging slider.
       */
      pointerEndPosX: 0,
      /**
       * @cfg {Number} pointerDistance
       * @private
       * private property contains the distance between the pointerStartPosX and pointerEndPosX
       */
      pointerDistance: 0,
      /**
       * @cfg {Number} monitorStartTime
       * @private
       * private property contains time user took in dragging mouse from pointerStartPosX and pointerEndPosX
       */
      monitorStartTime: 0,
      monitorInt: 10,
      /**
       * @cfg {Number} ticker
       * @private
       * Timer event that renders the 360
       */
      ticker: 0,
      /**
       * @cfg {Number} speedMultiplier
       * This property controls the sensitivity for the 360 slider
       */
      speedMultiplier: 7,
      /**
       * @cfg {Number} totalFrames
       * Set total number for frames used in the 360 rotation
       */
      totalFrames: 180,
      /**
       * @cfg {Number} currentFrame
       * Current frame of the slider.
       */
      currentFrame: 0,
      /**
       * @cfg {Array} endFrame
       * Private perperty contains information about the end frame when user slides the slider.
       */
      endFrame: 0,
      /**
       * @cfg {Number} loadedImages
       * Private property contains count of loaded images.
       */
      loadedImages: 0,
      /**
       * @cfg {Array} framerate
       * Set framerate for the slider animation
       */
      framerate: 60,
      /**
       * @cfg {String} domains
       * Set comma seprated list of all parallel domain from where 360 assets needs to be loaded.
       */
      domains: null,
      /**
       * @cfg {String} domain
       * Domain from where assets needs to be loaded. Use this propery is you want to load all assets from
       * single domain.
       */
      domain: '',
      /**
       * @cfg {Boolean} parallel
       * Set to true if you want to load assets from parallel domain. Default false
       */
      parallel: false,
      /**
       * @cfg {Number} queueAmount
       * Set number of calls to be made on parallel domains.
       */
      queueAmount: 8,
      /**
       * @cfg {Number} idle
       * Mouse Inactivite idle time in seconds. If set more than 0 will auto spine the slider
       */
      idle: 0,
      /**
       * @cfg {String} filePrefix
       * Prefix for the image file name before the numeric value.
       */
      filePrefix: '',
      /**
       * @cfg {String} ext [ext=.png]
       * Slider image extension.
       */
      ext: 'png',
      /**
       * @cfg {Object} height [300]
       * Height of the slider
       */
      height: 300,
      /**
       * @cfg {Number} width [300]
       * Width of the slider
       */
      width: 300,
      /**
       * @cfg {Object} styles
       * CSS Styles for the 360 slider
       */
      styles: {},
      /**
       * @cfg {Boolean} navigation[false]
       * State if navigation controls are visible or not.
       */
      navigation: false,
      /**
       * @cfg {Boolean} autoplay[false]
       * Autoplay the 360 animation
       */
      autoplay: false,
      /**
       * @cfg {number} autoplayDirection [1]
       * Direction for autoplay the 360 animation. 1 for right spin, and -1 for left spin.
       */
      autoplayDirection: 1,
      /**
       * Property to disable auto spin
       * @type {Boolean}
       */
      disableSpin: false,
      /**
       * Property to disable infinite wrap
       * @type {Boolean}
       */
      disableWrap: false,
      /**
       * Responsive width
       * @type {Boolean}
       */
      responsive: false,
      /**
       * Zero Padding for filenames
       * @type {Boolean}
       */
      zeroPadding: false,
      /**
       * Zero based for image filenames starting at 0
       * @type {Boolean}
       */
      zeroBased: false,
      /**
       * @type {Array}
       * List of plugins
       */
      plugins: [],
      /**
       * @type {Boolean}
       * Show hand cursor on drag
       */
      showCursor: false,
      /**
       * @cfg {Boolean} drag
       * Set it to false if you want to disable mousedrag or touch events
       */
      drag: true,
      /**
       * @cfg {Function} onReady
       * Callback triggers once all images are loaded and ready to render on the screen
       */
      onReady: function onReady() {},
      /**
       * @cfg {String} imgList
       * Set ul element where image will be loaded
       */
      imgList: '.threesixty_images',
      /**
       * @cfg {Array} imgArray
       * Use set of images in array to load images
       */
      imgArray: null,
      /**
      * @cfg {Number} playSpeed
      * Value to control the speed of play button rotation
      */
      playSpeed: 100
    };
    base.init();
  };

  $.fn.ThreeSixty = function (options) {
    return Object.create(new $.ThreeSixty(this, options));
  };
})(jQuery);
/**
 *
 * Object.create method for perform as a fallback if method not available.
 * The syntax just takes away the illusion that JavaScript uses Classical Inheritance.
 */
if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    'use strict';

    function F() {}
    F.prototype = o;
    return new F();
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L2xpYnMvdGhyZWVzaXh0eS5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBLEFBQUMsQ0FBQSxVQUFTLENBQUMsRUFBRTtBQUNYLGNBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOENiLEdBQUMsQ0FBQyxVQUFVLEdBQUcsVUFBUyxFQUFFLEVBQUUsT0FBTyxFQUFFOzs7QUFHbkMsUUFBSSxJQUFJLEdBQUcsSUFBSTtRQUNiLFNBQVM7UUFBRSxNQUFNLEdBQUcsRUFBRTtRQUN0QixPQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7QUFNcEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakIsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBRWIsUUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJsQyxRQUFJLENBQUMsSUFBSSxHQUFHLFlBQVc7QUFDckIsZUFBUyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9ELFVBQUcsU0FBUyxDQUFDLFdBQVcsRUFBRTtBQUN4QixpQkFBUyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDM0IsaUJBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO09BQ3hCO0FBQ0QsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUNuQixDQUFDOzs7OztBQUtGLFFBQUksQ0FBQyxNQUFNLEdB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QyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDdkQsQ0FBQztDQUNILENBQUEsQ0FBQyxNQUFNLENBQUMsQ0FBRTs7Ozs7O0FBTVgsSUFBRyxPQUFPLE1BQU0sQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO0FBQ3RDLFFBQU0sQ0FBQyxNQUFNLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDMUIsZ0JBQVksQ0FBQzs7QUFFYixhQUFTLENBQUMsR0FBRyxFQUFFO0FBQ2YsS0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDaEIsV0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0dBQ2hCLENBQUM7Q0FDSCIsImZpbGUiOiIvVXNlcnMvam9yaXMvU2l0ZXMvcGxheWdyb3VuZC9uczAyLW5ldmVybGFuZHNwYWNlL3Jlc291cmNlcy9hc3NldHMvanMvc3BhY2UvZGVmYXVsdC9saWJzL3RocmVlc2l4dHkubWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiAzNjAgZGVncmVlIEltYWdlIFNsaWRlciB2Mi4wLjRcbiAqIGh0dHA6Ly9nYXVyYXYuamFzc2FsLm1lXG4gKlxuICogQ29weXJpZ2h0IDIwMTUsIGdhdXJhdkBqYXNzYWwubWVcbiAqIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBvciBHUEwgVmVyc2lvbiAzIGxpY2Vuc2VzLlxuICpcbiAqL1xuKGZ1bmN0aW9uKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQGNsYXNzIFRocmVlU2l4dHlcbiAgICogKipUaGUgVGhyZWVTaXh0eSBzbGlkZXIgY2xhc3MqKi5cbiAgICpcbiAgICogVGhpcyBhcyBqUXVlcnkgcGx1Z2luIHRvIGNyZWF0ZSAzNjAgZGVncmVlIHByb2R1Y3QgaW1hZ2Ugc2xpZGVyLlxuICAgKiBUaGUgcGx1Z2luIGlzIGZ1bGwgY3VzdG9taXphYmxlIHdpdGggbnVtYmVyIG9mIG9wdGlvbnMgcHJvdmlkZWQuIFRoZSBwbHVnaW5cbiAgICogaGF2ZSB0aGUgcG93ZXIgdG8gZGlzcGxheSBpbWFnZXMgaW4gYW55IGFuZ2xlIDM2MCBkZWdyZWVzLiBUaGlzIGZlYXR1cmUgY2FuIGJlXG4gICAqIHVzZWQgc3VjY2Vzc2Z1bGx5IGluIG1hbnkgdXNlIGNhc2VzIGUuZy4gb24gYW4gZS1jb21tZXJjZSBzaXRlIHRvIGhlbHAgY3VzdG9tZXJzXG4gICAqIGxvb2sgcHJvZHVjdHMgaW4gZGV0YWlsLCBmcm9tIGFueSBhbmdsZSB0aGV5IGRlc2lyZS5cbiAgICpcbiAgICogKipGZWF0dXJlcyoqXG4gICAqXG4gICAqIC0gU21vb3RoIEFuaW1hdGlvblxuICAgKiAtIFBsZW50eSBvZiBvcHRpb24gcGFyYW1ldGVycyBmb3IgY3VzdG9taXphdGlvblxuICAgKiAtIEFwaSBpbnRlcmFjdGlvblxuICAgKiAtIFNpbXBsZSBtb3VzZSBpbnRlcmFjdGlvblxuICAgKiAtIEN1c3RvbSBiZWhhdmlvciB0d2Vha2luZ1xuICAgKiAtIFN1cHBvcnQgZm9yIHRvdWNoIGRldmljZXNcbiAgICogLSBFYXN5IHRvIGludGVncmF0ZVxuICAgKiAtIE5vIGZsYXNoXG4gICAqXG4gICAqIEV4YW1wbGUgY29kZTpcbiAgICogICAgICB2YXIgcHJvZHVjdDEgPSAkKCcucHJvZHVjdDEnKS5UaHJlZVNpeHR5KHtcbiAgICogICAgICAgIHRvdGFsRnJhbWVzOiA3MixcbiAgICogICAgICAgIGVuZEZyYW1lOiA3MixcbiAgICogICAgICAgIGN1cnJlbnRGcmFtZTogMSxcbiAgICogICAgICAgIGltZ0xpc3Q6ICcudGhyZWVzaXh0eV9pbWFnZXMnLFxuICAgKiAgICAgICAgcHJvZ3Jlc3M6ICcuc3Bpbm5lcicsXG4gICAqICAgICAgICBpbWFnZVBhdGg6Jy9hc3NldHMvcHJvZHVjdDEvJyxcbiAgICogICAgICAgIGZpbGVQcmVmaXg6ICdpcG9kLScsXG4gICAqICAgICAgICBleHQ6ICcuanBnJyxcbiAgICogICAgICAgIGhlaWdodDogMjY1LFxuICAgKiAgICAgICAgd2lkdGg6IDQwMCxcbiAgICogICAgICAgIG5hdmlnYXRpb246IHRydWVcbiAgICogICAgICB9KTtcbiAgICogKipOb3RlOioqIFRoZXJlIGFyZSBsb2FkcyBvdGhlciBvcHRpb25zIHRoYXQgeW91IGNhbiBvdmVycmlkZSB0byBjdXN0b21pemVcbiAgICogdGhpcyBwbHVnaW4uXG5cbiAgICogQGV4dGVuZHMgalF1ZXJ5XG4gICAqIEBzaW5nbGV0b25cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtlbF0galF1ZXJ5IHNlbGVjdG9yIHN0cmluZyBmb3IgdGhlIHBhcmVudCBjb250YWluZXJcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBBbiBvcHRpb25hbCBjb25maWcgb2JqZWN0XG4gICAqXG4gICAqIEByZXR1cm4gdGhpc1xuICAgKi9cbiAgJC5UaHJlZVNpeHR5ID0gZnVuY3Rpb24oZWwsIG9wdGlvbnMpIHtcbiAgICAvLyBUbyBhdm9pZCBzY29wZSBpc3N1ZXMsIHVzZSAnYmFzZScgaW5zdGVhZCBvZiAndGhpcydcbiAgICAvLyB0byByZWZlcmVuY2UgdGhpcyBjbGFzcyBmcm9tIGludGVybmFsIGV2ZW50cyBhbmQgZnVuY3Rpb25zLlxuICAgIHZhciBiYXNlID0gdGhpcyxcbiAgICAgIEFwcENvbmZpZywgZnJhbWVzID0gW10sXG4gICAgICBWRVJTSU9OID0gJzIuMC41JztcbiAgICAvLyBBY2Nlc3MgdG8galF1ZXJ5IGFuZCBET00gdmVyc2lvbnMgb2YgZWxlbWVudFxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7JGVsfVxuICAgICAqIGpRdWVyeSBEb20gbm9kZSBhdHRhY2hlZCB0byB0aGUgc2xpZGVyIGluaGVyaXRzIGFsbCBqUXVlcnkgcHVibGljIGZ1bmN0aW9ucy5cbiAgICAgKi9cbiAgICBiYXNlLiRlbCA9ICQoZWwpO1xuICAgIGJhc2UuZWwgPSBlbDtcbiAgICAvLyBBZGQgYSByZXZlcnNlIHJlZmVyZW5jZSB0byB0aGUgRE9NIG9iamVjdFxuICAgIGJhc2UuJGVsLmRhdGEoJ1RocmVlU2l4dHknLCBiYXNlKTtcbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGluaXRcbiAgICAgKiBUaGUgZnVuY3Rpb24gZXh0ZW5kcyB0aGUgdXNlciBvcHRpb25zIHdpdGggZGVmYXVsdCBzZXR0aW5ncyBmb3IgdGhlXG4gICAgICogc2xpZGVyIGFuZCBpbml0aWxpemUgdGhlIHNsaWRlci5cbiAgICAgKiAqKlN0eWxlIE92ZXJyaWRlIGV4YW1wbGUqKlxuICAgICAqXG4gICAgICogICAgICB2YXIgcHJvZHVjdDEgPSAkKCcucHJvZHVjdDEnKS5UaHJlZVNpeHR5KHtcbiAgICAgKiAgICAgICAgdG90YWxGcmFtZXM6IDcyLFxuICAgICAqICAgICAgICBlbmRGcmFtZTogNzIsXG4gICAgICogICAgICAgIGN1cnJlbnRGcmFtZTogMSxcbiAgICAgKiAgICAgICAgaW1nTGlzdDogJy50aHJlZXNpeHR5X2ltYWdlcycsXG4gICAgICogICAgICAgIHByb2dyZXNzOiAnLnNwaW5uZXInLFxuICAgICAqICAgICAgICBpbWFnZVBhdGg6Jy9hc3NldHMvcHJvZHVjdDEvJyxcbiAgICAgKiAgICAgICAgZmlsZVByZWZpeDogJ2lwb2QtJyxcbiAgICAgKiAgICAgICAgZXh0OiAnLmpwZycsXG4gICAgICogICAgICAgIGhlaWdodDogMjY1LFxuICAgICAqICAgICAgICB3aWR0aDogNDAwLFxuICAgICAqICAgICAgICBuYXZpZ2F0aW9uOiB0cnVlLFxuICAgICAqICAgICAgICBzdHlsZXM6IHtcbiAgICAgKiAgICAgICAgICBib3JkZXI6IDJweCBzb2xpZGUgI2I0YjRiNCxcbiAgICAgKiAgICAgICAgICBiYWNrZ3JvdW5kOiB1cmwoaHR0cDovL2V4YW1wbGUuY29tL2ltYWdlcy9sb2FkZXIuZ2lmKSBuby1yZXBlYXRcbiAgICAgKiAgICAgICAgfVxuICAgICAqICAgICAgfSk7XG4gICAgICovXG4gICAgYmFzZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBBcHBDb25maWcgPSAkLmV4dGVuZCh7fSwgJC5UaHJlZVNpeHR5LmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmKEFwcENvbmZpZy5kaXNhYmxlU3Bpbikge1xuICAgICAgICBBcHBDb25maWcuY3VycmVudEZyYW1lID0gMTtcbiAgICAgICAgQXBwQ29uZmlnLmVuZEZyYW1lID0gMTtcbiAgICAgIH1cbiAgICAgIGJhc2UuaW5pdFByb2dyZXNzKCk7XG4gICAgICBiYXNlLmxvYWRJbWFnZXMoKTtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBGdW5jdGlvbiB0byByZXNpemUgdGhlIGhlaWdodCBvZiByZXNwb25zaXZlIHNsaWRlci5cbiAgICAgKi9cbiAgICBiYXNlLnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gY2FsY3VsYXRlIGhlaWdodFxuICAgIH07XG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBpbml0UHJvZ3Jlc3NcbiAgICAgKiBUaGUgZnVuY3Rpb24gc2V0cyBpbml0aWFsIHN0eWxlcyBhbmQgc3RhcnQgdGhlIHByb2dyZXNzIGluZGljYXRvclxuICAgICAqIHRvIHNob3cgbG9hZGluZyBvZiBpbWFnZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGJhc2UuaW5pdFByb2dyZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICBiYXNlLiRlbC5jc3Moe1xuICAgICAgICB3aWR0aDogQXBwQ29uZmlnLndpZHRoICsgJ3B4JyxcbiAgICAgICAgaGVpZ2h0OiBBcHBDb25maWcuaGVpZ2h0ICsgJ3B4JyxcbiAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiAnbm9uZSAhaW1wb3J0YW50J1xuICAgICAgfSk7XG4gICAgICBpZihBcHBDb25maWcuc3R5bGVzKSB7XG4gICAgICAgIGJhc2UuJGVsLmNzcyhBcHBDb25maWcuc3R5bGVzKTtcbiAgICAgIH1cblxuICAgICAgYmFzZS5yZXNwb25zaXZlKCk7XG5cbiAgICAgIGJhc2UuJGVsLmZpbmQoQXBwQ29uZmlnLnByb2dyZXNzKS5jc3Moe1xuICAgICAgICBtYXJnaW5Ub3A6ICgoQXBwQ29uZmlnLmhlaWdodCAvIDIpIC0gMTUpICsgJ3B4J1xuICAgICAgfSk7XG4gICAgICBiYXNlLiRlbC5maW5kKEFwcENvbmZpZy5wcm9ncmVzcykuZmFkZUluKCdzbG93Jyk7XG4gICAgICBiYXNlLiRlbC5maW5kKEFwcENvbmZpZy5pbWdMaXN0KS5oaWRlKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgbG9hZEltYWdlc1xuICAgICAqIEBwcml2YXRlXG4gICAgICogVGhlIGZ1bmN0aW9uIGFzeW5jaHJvbm91c2x5IGxvYWRzIGltYWdlcyBhbmQgaW5qZWN0IGludG8gdGhlIHNsaWRlci5cbiAgICAgKi9cbiAgICBiYXNlLmxvYWRJbWFnZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsaSwgaW1hZ2VOYW1lLCBpbWFnZSwgaG9zdCwgYmFzZUluZGV4O1xuICAgICAgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgYmFzZUluZGV4ID0gQXBwQ29uZmlnLnplcm9CYXNlZCA/IDAgOiAxO1xuICAgICAgaW1hZ2VOYW1lID0gIUFwcENvbmZpZy5pbWdBcnJheSA/XG4gICAgICBBcHBDb25maWcuZG9tYWluICsgQXBwQ29uZmlnLmltYWdlUGF0aCArIEFwcENvbmZpZy5maWxlUHJlZml4ICsgYmFzZS56ZXJvUGFkKChBcHBDb25maWcubG9hZGVkSW1hZ2VzICsgYmFzZUluZGV4KSkgKyBBcHBDb25maWcuZXh0ICsgKChiYXNlLmJyb3dzZXIuaXNJRSgpKSA/ICc/JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpIDogJycpIDpcbiAgICAgIEFwcENvbmZpZy5pbWdBcnJheVtBcHBDb25maWcubG9hZGVkSW1hZ2VzXTtcbiAgICAgIGltYWdlID0gJCgnPGltZz4nKS5hdHRyKCdzcmMnLCBpbWFnZU5hbWUpLmFkZENsYXNzKCdwcmV2aW91cy1pbWFnZScpLmFwcGVuZFRvKGxpKTtcblxuICAgICAgZnJhbWVzLnB1c2goaW1hZ2UpO1xuXG4gICAgICBiYXNlLiRlbC5maW5kKEFwcENvbmZpZy5pbWdMaXN0KS5hcHBlbmQobGkpO1xuXG4gICAgICBiYXNlLmltYWdlTG9hZGVkKCk7XG4gICAgICAvLyAkKGltYWdlKS5sb2FkKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGxvYWRJbWFnZXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIFRoZSBmdW5jdGlvbiBnZXRzIHRyaWdnZXJzIG9uY2UgdGhlIGltYWdlIGlzIGxvYWRlZC4gV2UgYWxzbyB1cGRhdGVcbiAgICAgKiB0aGUgcHJvZ3Jlc3MgcGVyY2VudGFnZSBpbiB0aGlzIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGJhc2UuaW1hZ2VMb2FkZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBBcHBDb25maWcubG9hZGVkSW1hZ2VzICs9IDE7XG4gICAgICAkKEFwcENvbmZpZy5wcm9ncmVzcyArICcgc3BhbicpLnRleHQoTWF0aC5mbG9vcihBcHBDb25maWcubG9hZGVkSW1hZ2VzIC8gQXBwQ29uZmlnLnRvdGFsRnJhbWVzICogMTAwKSArICclJyk7XG4gICAgICBpZiAoQXBwQ29uZmlnLmxvYWRlZEltYWdlcyA+PSBBcHBDb25maWcudG90YWxGcmFtZXMpIHtcbiAgICAgICAgaWYoQXBwQ29uZmlnLmRpc2FibGVTcGluKSB7XG4gICAgICAgICAgZnJhbWVzWzBdLnJlbW92ZUNsYXNzKCdwcmV2aW91cy1pbWFnZScpLmFkZENsYXNzKCdjdXJyZW50LWltYWdlJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2ltYWdlcyBsb2FkZWQnKTtcbiAgICAgICAgYmFzZS5zaG93SW1hZ2VzKCk7XG4gICAgICAgIGJhc2Uuc2hvd05hdmlnYXRpb24oKTtcbiAgICAgICAgJChBcHBDb25maWcucHJvZ3Jlc3MpLmZhZGVPdXQoJ3Nsb3cnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCh0aGlzKS5oaWRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFzZS5sb2FkSW1hZ2VzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgbG9hZEltYWdlc1xuICAgICAqIEBwcml2YXRlXG4gICAgICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiBhbGwgdGhlIGltYWdlcyBhcmUgbG9hZGVkLlxuICAgICAqICoqVGhlIGZ1bmN0aW9uIGRvZXMgZm9sbG93aW5nIG9wZXJhdGlvbnMqKlxuICAgICAqIC0gUmVtb3ZlcyBiYWNrZ3JvdW5kIGltYWdlIHBsYWNlaG9sZGVyXG4gICAgICogLSBEaXNwbGF5cyB0aGUgMzYwIGltYWdlc1xuICAgICAqIC0gSW5pdGlsaXplcyBtb3VzZSBpbnRyYWN0aW9uIGV2ZW50c1xuICAgICAqL1xuICAgIGJhc2Uuc2hvd0ltYWdlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGJhc2UuJGVsLmZpbmQoJy50eHRDJykuZmFkZUluKCk7XG4gICAgICBiYXNlLiRlbC5maW5kKEFwcENvbmZpZy5pbWdMaXN0KS5mYWRlSW4oKTtcbiAgICAgIGJhc2UucmVhZHkgPSB0cnVlO1xuICAgICAgQXBwQ29uZmlnLnJlYWR5ID0gdHJ1ZTtcblxuICAgICAgaWYgKEFwcENvbmZpZy5kcmFnKSB7XG4gICAgICAgIGJhc2UuaW5pdEV2ZW50cygpO1xuICAgICAgfVxuICAgICAgYmFzZS5yZWZyZXNoKCk7XG4gICAgICBiYXNlLmluaXRQbHVnaW5zKCk7XG4gICAgICBBcHBDb25maWcub25SZWFkeSgpO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBiYXNlLnJlc3BvbnNpdmUoKTsgfSwgNTApO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZnVuY3Rpb24gdG8gaW5pdGlsaXplIGV4dGVybmFsIHBsdWdpblxuICAgICAqL1xuICAgIGJhc2UuaW5pdFBsdWdpbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkLmVhY2goQXBwQ29uZmlnLnBsdWdpbnMsIGZ1bmN0aW9uKGksIHBsdWdpbikge1xuICAgICAgICBpZih0eXBlb2YgJFtwbHVnaW5dID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgJFtwbHVnaW5dLmNhbGwoYmFzZSwgYmFzZS4kZWwsIEFwcENvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBsdWdpbiArICcgbm90IGF2YWlsYWJsZS4nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2Qgc2hvd05hdmlnYXRpb25cbiAgICAgKiBDcmVhdGVzIGEgbmF2aWdhdGlvbiBwYW5lbCBpZiBuYXZpZ2F0aW9uIGlzIHNldCB0byB0cnVlIGluIHRoZVxuICAgICAqIHNldHRpbmdzLlxuICAgICAqL1xuICAgIGJhc2Uuc2hvd05hdmlnYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChBcHBDb25maWcubmF2aWdhdGlvbiAmJiAhQXBwQ29uZmlnLm5hdmlnYXRpb25faW5pdCkge1xuICAgICAgICB2YXIgbmF2X2JhciwgbmV4dCwgcHJldmlvdXMsIHBsYXlfc3RvcDtcblxuICAgICAgICBuYXZfYmFyID0gJCgnPGRpdi8+JykuYXR0cignY2xhc3MnLCAnbmF2X2JhcicpO1xuXG4gICAgICAgIG5leHQgPSAkKCc8YS8+JykuYXR0cih7XG4gICAgICAgICAgJ2hyZWYnOiAnIycsXG4gICAgICAgICAgJ2NsYXNzJzogJ25hdl9iYXJfbmV4dCdcbiAgICAgICAgfSkuaHRtbCgnbmV4dCcpO1xuXG4gICAgICAgIHByZXZpb3VzID0gJCgnPGEvPicpLmF0dHIoe1xuICAgICAgICAgICdocmVmJzogJyMnLFxuICAgICAgICAgICdjbGFzcyc6ICduYXZfYmFyX3ByZXZpb3VzJ1xuICAgICAgICB9KS5odG1sKCdwcmV2aW91cycpO1xuXG4gICAgICAgIHBsYXlfc3RvcCA9ICQoJzxhLz4nKS5hdHRyKHtcbiAgICAgICAgICAnaHJlZic6ICcjJyxcbiAgICAgICAgICAnY2xhc3MnOiAnbmF2X2Jhcl9wbGF5J1xuICAgICAgICB9KS5odG1sKCdwbGF5Jyk7XG5cbiAgICAgICAgbmF2X2Jhci5hcHBlbmQocHJldmlvdXMpO1xuICAgICAgICBuYXZfYmFyLmFwcGVuZChwbGF5X3N0b3ApO1xuICAgICAgICBuYXZfYmFyLmFwcGVuZChuZXh0KTtcblxuICAgICAgICBiYXNlLiRlbC5wcmVwZW5kKG5hdl9iYXIpO1xuXG4gICAgICAgIG5leHQuYmluZCgnbW91c2Vkb3duIHRvdWNoc3RhcnQnLCBiYXNlLm5leHQpO1xuICAgICAgICBwcmV2aW91cy5iaW5kKCdtb3VzZWRvd24gdG91Y2hzdGFydCcsIGJhc2UucHJldmlvdXMpO1xuICAgICAgICBwbGF5X3N0b3AuYmluZCgnbW91c2Vkb3duIHRvdWNoc3RhcnQnLCBiYXNlLnBsYXlfc3RvcCk7XG4gICAgICAgIEFwcENvbmZpZy5uYXZpZ2F0aW9uX2luaXQgPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHBsYXlfc3RvcFxuICAgICAqIEBwcml2YXRlXG4gICAgICogRnVuY3Rpb24gdG9nZ2xlcyB0aGUgYXV0b3BsYXkgcm90YXRpb24gb2YgMzYwIHNsaWRlclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbZXZlbnRdIGpRdWVyeSBldmVudHMgb2JqZWN0LlxuICAgICAqXG4gICAgICovXG5cbiAgICBiYXNlLnBsYXlfc3RvcCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAoIUFwcENvbmZpZy5hdXRvcGxheSkge1xuICAgICAgICBBcHBDb25maWcuYXV0b3BsYXkgPSB0cnVlO1xuICAgICAgICBBcHBDb25maWcucGxheSA9IHNldEludGVydmFsKGJhc2UubW92ZVRvTmV4dEZyYW1lLCBBcHBDb25maWcucGxheVNwZWVkKTtcbiAgICAgICAgJChldmVudC5jdXJyZW50VGFyZ2V0KS5yZW1vdmVDbGFzcygnbmF2X2Jhcl9wbGF5JykuYWRkQ2xhc3MoJ25hdl9iYXJfc3RvcCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQXBwQ29uZmlnLmF1dG9wbGF5ID0gZmFsc2U7XG4gICAgICAgICQoZXZlbnQuY3VycmVudFRhcmdldCkucmVtb3ZlQ2xhc3MoJ25hdl9iYXJfc3RvcCcpLmFkZENsYXNzKCduYXZfYmFyX3BsYXknKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChBcHBDb25maWcucGxheSk7XG4gICAgICAgIEFwcENvbmZpZy5wbGF5ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBuZXh0XG4gICAgICogVXNpbmcgdGhpcyBmdW5jdGlvbiB5b3UgY2FuIHJvdGF0ZSAzNjAgdG8gbmV4dCA1IGZyYW1lcy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2V2ZW50XSBqUXVlcnkgZXZlbnRzIG9iamVjdC5cbiAgICAgKlxuICAgICAqL1xuXG4gICAgYmFzZS5uZXh0ID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGlmIChldmVudCkgeyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyB9XG4gICAgICBBcHBDb25maWcuZW5kRnJhbWUgLT0gNTtcbiAgICAgIGJhc2UucmVmcmVzaCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHByZXZpb3VzXG4gICAgICogVXNpbmcgdGhpcyBmdW5jdGlvbiB5b3UgY2FuIHJvdGF0ZSAzNjAgdG8gcHJldmlvdXMgNSBmcmFtZXMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtldmVudF0galF1ZXJ5IGV2ZW50cyBvYmplY3QuXG4gICAgICpcbiAgICAgKi9cbiAgICBiYXNlLnByZXZpb3VzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGlmIChldmVudCkgeyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyB9XG4gICAgICBBcHBDb25maWcuZW5kRnJhbWUgKz0gNTtcbiAgICAgIGJhc2UucmVmcmVzaCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHBsYXlcbiAgICAgKiBZb3UgYXJlIHN0YXJ0IHRoZSBhdXRvIHJvdGFpb24gZm9yIHRoZSBzbGlkZXIgd2l0aCB0aGlzIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICovXG4gICAgYmFzZS5wbGF5ID0gZnVuY3Rpb24oc3BlZWQpIHtcbiAgICAgIHZhciBfc3BlZWQgPSBzcGVlZCB8fCBBcHBDb25maWcucGxheVNwZWVkO1xuICAgICAgaWYgKCFBcHBDb25maWcuYXV0b3BsYXkpIHtcbiAgICAgICAgQXBwQ29uZmlnLmF1dG9wbGF5ID0gdHJ1ZTtcbiAgICAgICAgQXBwQ29uZmlnLnBsYXkgPSBzZXRJbnRlcnZhbChiYXNlLm1vdmVUb05leHRGcmFtZSwgX3NwZWVkKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBzdG9wXG4gICAgICogWW91IGNhbiBzdG9wIHRoZSBhdXRvIHJvdGF0aW9uIG9mIHRoZSAzNjAgc2xpZGVyIHdpdGggdGhpcyBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqL1xuXG4gICAgYmFzZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoQXBwQ29uZmlnLmF1dG9wbGF5KSB7XG4gICAgICAgIEFwcENvbmZpZy5hdXRvcGxheSA9IGZhbHNlO1xuICAgICAgICBjbGVhckludGVydmFsKEFwcENvbmZpZy5wbGF5KTtcbiAgICAgICAgQXBwQ29uZmlnLnBsYXkgPSBudWxsO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGVuZEZyYW1lXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBGdW5jdGlvbiBhbmltYXRlcyB0byBwcmV2aW91cyBmcmFtZVxuICAgICAqXG4gICAgICovXG4gICAgYmFzZS5tb3ZlVG9OZXh0RnJhbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoQXBwQ29uZmlnLmF1dG9wbGF5RGlyZWN0aW9uID09PSAxKSB7XG4gICAgICAgIEFwcENvbmZpZy5lbmRGcmFtZSAtPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQXBwQ29uZmlnLmVuZEZyYW1lICs9IDE7XG4gICAgICB9XG4gICAgICBiYXNlLnJlZnJlc2goKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnb3RvQW5kUGxheVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBGdW5jdGlvbiBhbmltYXRlcyB0byBwcmV2aW91cyBmcmFtZVxuICAgICAqXG4gICAgICovXG4gICAgYmFzZS5nb3RvQW5kUGxheSA9IGZ1bmN0aW9uIChuKSB7XG4gICAgICBpZiggQXBwQ29uZmlnLmRpc2FibGVXcmFwICkge1xuICAgICAgICBBcHBDb25maWcuZW5kRnJhbWUgPSBuO1xuICAgICAgICBiYXNlLnJlZnJlc2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFNpbmNlIHdlIGNvdWxkIGJlIGxvb3BlZCBhcm91bmQgZ3JhYiB0aGUgbXVsdGlwbGllclxuICAgICAgICB2YXIgbXVsdGlwbGllciA9IE1hdGguY2VpbChBcHBDb25maWcuZW5kRnJhbWUgLyBBcHBDb25maWcudG90YWxGcmFtZXMpO1xuICAgICAgICBpZihtdWx0aXBsaWVyID09PSAwKSB7XG4gICAgICAgICAgbXVsdGlwbGllciA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaWd1cmUgb3V0IHRoZSBxdWlja2VzdCBwYXRoIHRvIHRoZSByZXF1ZXN0ZWQgZnJhbWVcbiAgICAgICAgdmFyIHJlYWxFbmRGcmFtZSA9IChtdWx0aXBsaWVyID4gMSkgP1xuICAgICAgICAgIEFwcENvbmZpZy5lbmRGcmFtZSAtICgobXVsdGlwbGllciAtIDEpICogQXBwQ29uZmlnLnRvdGFsRnJhbWVzKSA6XG4gICAgICAgICAgQXBwQ29uZmlnLmVuZEZyYW1lO1xuXG4gICAgICAgIHZhciBjdXJyZW50RnJvbUVuZCA9IEFwcENvbmZpZy50b3RhbEZyYW1lcyAtIHJlYWxFbmRGcmFtZTtcblxuICAgICAgICAvLyBKdW1wIHBhc3QgZW5kIGlmIGl0J3MgZmFzdGVyXG4gICAgICAgIHZhciBuZXdFbmRGcmFtZSA9IDA7XG4gICAgICAgIGlmKG4gLSByZWFsRW5kRnJhbWUgPiAwKSB7XG4gICAgICAgICAgLy8gRmFzdGVyIHRvIG1vdmUgdGhlIGRpZmZlcmVuY2UgYWhlYWQ/XG4gICAgICAgICAgaWYobiAtIHJlYWxFbmRGcmFtZSA8IHJlYWxFbmRGcmFtZSArIChBcHBDb25maWcudG90YWxGcmFtZXMgLSBuKSkge1xuICAgICAgICAgICAgbmV3RW5kRnJhbWUgPSBBcHBDb25maWcuZW5kRnJhbWUgKyAobiAtIHJlYWxFbmRGcmFtZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0VuZEZyYW1lID0gQXBwQ29uZmlnLmVuZEZyYW1lIC0gKHJlYWxFbmRGcmFtZSArIChBcHBDb25maWcudG90YWxGcmFtZXMgLSBuKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRmFzdGVyIHRvIG1vdmUgdGhlIGRpc3RhbmNlIGJhY2s/XG4gICAgICAgICAgICBpZihyZWFsRW5kRnJhbWUgLSBuIDwgY3VycmVudEZyb21FbmQgKyBuKSB7XG4gICAgICAgICAgICAgIG5ld0VuZEZyYW1lID0gQXBwQ29uZmlnLmVuZEZyYW1lIC0gKHJlYWxFbmRGcmFtZSAtIG4pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbmV3RW5kRnJhbWUgPSBBcHBDb25maWcuZW5kRnJhbWUgKyAoY3VycmVudEZyb21FbmQgKyBuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdyBzZXQgdGhlIGVuZCBmcmFtZVxuICAgICAgICBpZihyZWFsRW5kRnJhbWUgIT09IG4pIHtcbiAgICAgICAgICBBcHBDb25maWcuZW5kRnJhbWUgPSBuZXdFbmRGcmFtZTtcbiAgICAgICAgICBiYXNlLnJlZnJlc2goKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgaW5pdEV2ZW50c1xuICAgICAqIEBwcml2YXRlXG4gICAgICogRnVuY3Rpb24gaW5pdGlsaXplcyBhbGwgdGhlIG1vdXNlIGFuZCB0b3VjaCBldmVudHMgZm9yIDM2MCBzbGlkZXIgbW92ZW1lbnQuXG4gICAgICpcbiAgICAgKi9cbiAgICBiYXNlLmluaXRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBiYXNlLiRlbC5iaW5kKCdtb3VzZWRvd24gdG91Y2hzdGFydCB0b3VjaG1vdmUgdG91Y2hlbmQgbW91c2Vtb3ZlIGNsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAoKGV2ZW50LnR5cGUgPT09ICdtb3VzZWRvd24nICYmIGV2ZW50LndoaWNoID09PSAxKSB8fCBldmVudC50eXBlID09PSAndG91Y2hzdGFydCcpIHtcbiAgICAgICAgICBBcHBDb25maWcucG9pbnRlclN0YXJ0UG9zWCA9IGJhc2UuZ2V0UG9pbnRlckV2ZW50KGV2ZW50KS5wYWdlWDtcbiAgICAgICAgICBBcHBDb25maWcuZHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICd0b3VjaG1vdmUnKSB7XG4gICAgICAgICAgYmFzZS50cmFja1BvaW50ZXIoZXZlbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICd0b3VjaGVuZCcpIHtcbiAgICAgICAgICBBcHBDb25maWcuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgICQoZG9jdW1lbnQpLmJpbmQoJ21vdXNldXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBBcHBDb25maWcuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgJCh0aGlzKS5jc3MoJ2N1cnNvcicsICdub25lJyk7XG4gICAgICB9KTtcblxuICAgICAgJCh3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBiYXNlLnJlc3BvbnNpdmUoKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKGRvY3VtZW50KS5iaW5kKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKEFwcENvbmZpZy5kcmFnZ2luZykge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgaWYoIWJhc2UuYnJvd3Nlci5pc0lFICYmIEFwcENvbmZpZy5zaG93Q3Vyc29yKSB7XG4gICAgICAgICAgICBiYXNlLiRlbC5jc3MoJ2N1cnNvcicsICd1cmwoYXNzZXRzL2ltYWdlcy9oYW5kX2Nsb3NlZC5wbmcpLCBhdXRvJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmKCFiYXNlLmJyb3dzZXIuaXNJRSAmJiBBcHBDb25maWcuc2hvd0N1cnNvcikge1xuICAgICAgICAgICAgYmFzZS4kZWwuY3NzKCdjdXJzb3InLCAndXJsKGFzc2V0cy9pbWFnZXMvaGFuZF9vcGVuLnBuZyksIGF1dG8nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYmFzZS50cmFja1BvaW50ZXIoZXZlbnQpO1xuXG4gICAgICB9KTtcblxuICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICAgICAgYmFzZS5yZXNpemUoKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldFBvaW50ZXJFdmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICogRnVuY3Rpb24gcmV0dXJucyB0b3VjaCBwb2ludGVyIGV2ZW50c1xuICAgICAqXG4gICAgICogQHBhcmFtcyB7T2JqZWN0fSBbZXZlbnRdXG4gICAgICovXG4gICAgYmFzZS5nZXRQb2ludGVyRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHJldHVybiBldmVudC5vcmlnaW5hbEV2ZW50LnRhcmdldFRvdWNoZXMgPyBldmVudC5vcmlnaW5hbEV2ZW50LnRhcmdldFRvdWNoZXNbMF0gOiBldmVudDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCB0cmFja1BvaW50ZXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEZ1bmN0aW9uIGNhbGN1bGF0ZXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHN0YXJ0IHBvaW50ZXIgYW5kIGVuZCBwb2ludGVyL1xuICAgICAqXG4gICAgICogQHBhcmFtcyB7T2JqZWN0fSBbZXZlbnRdXG4gICAgICovXG4gICAgYmFzZS50cmFja1BvaW50ZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChBcHBDb25maWcucmVhZHkgJiYgQXBwQ29uZmlnLmRyYWdnaW5nKSB7XG4gICAgICAgIEFwcENvbmZpZy5wb2ludGVyRW5kUG9zWCA9IGJhc2UuZ2V0UG9pbnRlckV2ZW50KGV2ZW50KS5wYWdlWDtcbiAgICAgICAgaWYgKEFwcENvbmZpZy5tb25pdG9yU3RhcnRUaW1lIDwgbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBBcHBDb25maWcubW9uaXRvckludCkge1xuICAgICAgICAgIEFwcENvbmZpZy5wb2ludGVyRGlzdGFuY2UgPSBBcHBDb25maWcucG9pbnRlckVuZFBvc1ggLSBBcHBDb25maWcucG9pbnRlclN0YXJ0UG9zWDtcbiAgICAgICAgICBpZihBcHBDb25maWcucG9pbnRlckRpc3RhbmNlID4gMCl7XG4gICAgICAgICAgQXBwQ29uZmlnLmVuZEZyYW1lID0gQXBwQ29uZmlnLmN1cnJlbnRGcmFtZSArIE1hdGguY2VpbCgoQXBwQ29uZmlnLnRvdGFsRnJhbWVzIC0gMSkgKiBBcHBDb25maWcuc3BlZWRNdWx0aXBsaWVyICogKEFwcENvbmZpZy5wb2ludGVyRGlzdGFuY2UgLyBiYXNlLiRlbC53aWR0aCgpKSk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgQXBwQ29uZmlnLmVuZEZyYW1lID0gQXBwQ29uZmlnLmN1cnJlbnRGcmFtZSArIE1hdGguZmxvb3IoKEFwcENvbmZpZy50b3RhbEZyYW1lcyAtIDEpICogQXBwQ29uZmlnLnNwZWVkTXVsdGlwbGllciAqIChBcHBDb25maWcucG9pbnRlckRpc3RhbmNlIC8gYmFzZS4kZWwud2lkdGgoKSkpO1xuICAgICAgICAgIH1cblxuXG4gICAgICAgICAgaWYoIEFwcENvbmZpZy5kaXNhYmxlV3JhcCApIHtcbiAgICAgICAgICAgIEFwcENvbmZpZy5lbmRGcmFtZSA9IE1hdGgubWluKEFwcENvbmZpZy50b3RhbEZyYW1lcyAtIChBcHBDb25maWcuemVyb0Jhc2VkID8gMSA6IDApLCBBcHBDb25maWcuZW5kRnJhbWUpO1xuICAgICAgICAgICAgQXBwQ29uZmlnLmVuZEZyYW1lID0gTWF0aC5tYXgoKEFwcENvbmZpZy56ZXJvQmFzZWQgPyAwIDogMSksIEFwcENvbmZpZy5lbmRGcmFtZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmFzZS5yZWZyZXNoKCk7XG4gICAgICAgICAgQXBwQ29uZmlnLm1vbml0b3JTdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICBBcHBDb25maWcucG9pbnRlclN0YXJ0UG9zWCA9IGJhc2UuZ2V0UG9pbnRlckV2ZW50KGV2ZW50KS5wYWdlWDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHJlZnJlc2hcbiAgICAgKiBAcHVibGljXG4gICAgICogRnVuY3Rpb24gcmVmZXNoZXMgdGhlIHRpbWVyIGFuZCBzZXQgaW50ZXJ2YWwgZm9yIHJlbmRlciBjeWNsZS5cbiAgICAgKlxuICAgICAqL1xuXG4gICAgYmFzZS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKEFwcENvbmZpZy50aWNrZXIgPT09IDApIHtcbiAgICAgICAgQXBwQ29uZmlnLnRpY2tlciA9IHNldEludGVydmFsKGJhc2UucmVuZGVyLCBNYXRoLnJvdW5kKDEwMDAgLyBBcHBDb25maWcuZnJhbWVyYXRlKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICAvKipcbiAgICAgKiBAbWV0aG9kIHJlZnJlc2hcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEZ1bmN0aW9uIHJlbmRlciB0aGUgYW5pbWF0aW9uIGZyYW1lcyBvbiB0aGUgc2NyZWVuIHdpdGggZWFzaW5nIGVmZmVjdC5cbiAgICAgKi9cblxuICAgIGJhc2UucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGZyYW1lRWFzaW5nO1xuICAgICAgaWYgKEFwcENvbmZpZy5jdXJyZW50RnJhbWUgIT09IEFwcENvbmZpZy5lbmRGcmFtZSkge1xuICAgICAgICBmcmFtZUVhc2luZyA9IEFwcENvbmZpZy5lbmRGcmFtZSA8IEFwcENvbmZpZy5jdXJyZW50RnJhbWUgPyBNYXRoLmZsb29yKChBcHBDb25maWcuZW5kRnJhbWUgLSBBcHBDb25maWcuY3VycmVudEZyYW1lKSAqIDAuMSkgOiBNYXRoLmNlaWwoKEFwcENvbmZpZy5lbmRGcmFtZSAtIEFwcENvbmZpZy5jdXJyZW50RnJhbWUpICogMC4xKTtcbiAgICAgICAgYmFzZS5oaWRlUHJldmlvdXNGcmFtZSgpO1xuICAgICAgICBBcHBDb25maWcuY3VycmVudEZyYW1lICs9IGZyYW1lRWFzaW5nO1xuICAgICAgICBiYXNlLnNob3dDdXJyZW50RnJhbWUoKTtcbiAgICAgICAgYmFzZS4kZWwudHJpZ2dlcignZnJhbWVJbmRleENoYW5nZWQnLCBbYmFzZS5nZXROb3JtYWxpemVkQ3VycmVudEZyYW1lKCksIEFwcENvbmZpZy50b3RhbEZyYW1lc10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwoQXBwQ29uZmlnLnRpY2tlcik7XG4gICAgICAgIEFwcENvbmZpZy50aWNrZXIgPSAwO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGhpZGVQcmV2aW91c0ZyYW1lXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBGdW5jdGlvbiBoaWRlIHRoZSBwcmV2aW91cyBmcmFtZSBpbiB0aGUgYW5pbWF0aW9uIGxvb3AuXG4gICAgICovXG5cbiAgICBiYXNlLmhpZGVQcmV2aW91c0ZyYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYoZnJhbWVzW2Jhc2UuZ2V0Tm9ybWFsaXplZEN1cnJlbnRGcmFtZSgpLTFdKSBmcmFtZXNbYmFzZS5nZXROb3JtYWxpemVkQ3VycmVudEZyYW1lKCktMV0ucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtaW1hZ2UnKS5hZGRDbGFzcygncHJldmlvdXMtaW1hZ2UnKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBzaG93Q3VycmVudEZyYW1lXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBGdW5jdGlvbiBzaG93cyB0aGUgY3VycmVudCBmcmFtZSBpbiB0aGUgYW5pbWF0aW9uIGxvb3AuXG4gICAgICovXG4gICAgYmFzZS5zaG93Q3VycmVudEZyYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYoZnJhbWVzW2Jhc2UuZ2V0Tm9ybWFsaXplZEN1cnJlbnRGcmFtZSgpLTFdKSBmcmFtZXNbYmFzZS5nZXROb3JtYWxpemVkQ3VycmVudEZyYW1lKCktMV0ucmVtb3ZlQ2xhc3MoJ3ByZXZpb3VzLWltYWdlJykuYWRkQ2xhc3MoJ2N1cnJlbnQtaW1hZ2UnKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXROb3JtYWxpemVkQ3VycmVudEZyYW1lXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBGdW5jdGlvbiBub3JtYWxpemUgYW5kIGNhbGN1bGF0ZSB0aGUgY3VycmVudCBmcmFtZSBvbmNlIHRoZSB1c2VyIHJlbGVhc2UgdGhlIG1vdXNlIGFuZCByZWxlYXNlIHRvdWNoIGV2ZW50LlxuICAgICAqL1xuXG4gICAgYmFzZS5nZXROb3JtYWxpemVkQ3VycmVudEZyYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGMsIGU7XG5cbiAgICAgIGlmICggIUFwcENvbmZpZy5kaXNhYmxlV3JhcCApIHtcbiAgICAgICAgYyA9IE1hdGguY2VpbChBcHBDb25maWcuY3VycmVudEZyYW1lICUgQXBwQ29uZmlnLnRvdGFsRnJhbWVzKTtcbiAgICAgICAgaWYgKGMgPCAwKSB7XG4gICAgICAgICAgYyArPSBBcHBDb25maWcudG90YWxGcmFtZXMgLSAoQXBwQ29uZmlnLnplcm9CYXNlZCA/IDEgOiAwKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYyA9IE1hdGgubWluKEFwcENvbmZpZy5jdXJyZW50RnJhbWUsIEFwcENvbmZpZy50b3RhbEZyYW1lcyAtIChBcHBDb25maWcuemVyb0Jhc2VkID8gMSA6IDApKTtcbiAgICAgICAgZSA9IE1hdGgubWluKEFwcENvbmZpZy5lbmRGcmFtZSwgQXBwQ29uZmlnLnRvdGFsRnJhbWVzIC0gKEFwcENvbmZpZy56ZXJvQmFzZWQgPyAxIDogMCkpO1xuICAgICAgICBjID0gTWF0aC5tYXgoYywgKEFwcENvbmZpZy56ZXJvQmFzZWQgPyAwIDogMSkpO1xuICAgICAgICBlID0gTWF0aC5tYXgoZSwgKEFwcENvbmZpZy56ZXJvQmFzZWQgPyAwIDogMSkpO1xuICAgICAgICBBcHBDb25maWcuY3VycmVudEZyYW1lID0gYztcbiAgICAgICAgQXBwQ29uZmlnLmVuZEZyYW1lID0gZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGM7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogQG1ldGhvZCBnZXRDdXJyZW50RnJhbWVcbiAgICAgKiBGdW5jdGlvbiByZXR1cm5zIHRoZSBjdXJyZW50IGFjdGl2ZSBmcmFtZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gTnVtYmVyXG4gICAgICovXG5cbiAgICBiYXNlLmdldEN1cnJlbnRGcmFtZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIEFwcENvbmZpZy5jdXJyZW50RnJhbWU7XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiBAbWV0aG9kIHJlc3BvbnNpdmVcbiAgICAqIEZ1bmN0aW9uIGNhbGN1bGF0ZXMgYW5kIHNldCByZXNwb25zaXZlIGhlaWdodCBhbmQgd2lkdGhcbiAgICAqXG4gICAgKi9cblxuICAgIGJhc2UucmVzcG9uc2l2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYoQXBwQ29uZmlnLnJlc3BvbnNpdmUpIHtcbiAgICAgICAgYmFzZS4kZWwuY3NzKHtcbiAgICAgICAgICBoZWlnaHQ6IGJhc2UuJGVsLmZpbmQoJy5jdXJyZW50LWltYWdlJykuZmlyc3QoKS5jc3MoJ2hlaWdodCcpLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIHJldHVybiB3aXRoIHplcm8gcGFkZGluZy5cbiAgICAgKi9cbiAgICBiYXNlLnplcm9QYWQgPSBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgIGZ1bmN0aW9uIHBhZChudW1iZXIsIGxlbmd0aCkge1xuICAgICAgICAgIHZhciBzdHIgPSBudW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgICBpZihBcHBDb25maWcuemVyb1BhZGRpbmcpIHtcbiAgICAgICAgICAgIHdoaWxlIChzdHIubGVuZ3RoIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gJzAnICsgc3RyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFwcHJveGltYXRlTG9nID0gTWF0aC5sb2coQXBwQ29uZmlnLnRvdGFsRnJhbWVzKSAvIE1hdGguTE4xMDtcbiAgICAgICAgdmFyIHJvdW5kVG8gPSAxZTM7XG4gICAgICAgIHZhciByb3VuZGVkTG9nID0gTWF0aC5yb3VuZChhcHByb3hpbWF0ZUxvZyAqIHJvdW5kVG8pIC8gcm91bmRUbztcbiAgICAgICAgdmFyIG51bUNoYXJzID0gTWF0aC5mbG9vcihyb3VuZGVkTG9nKSArIDE7XG4gICAgICAgIHJldHVybiBwYWQobnVtLCBudW1DaGFycyk7XG4gICAgfTtcblxuICAgIGJhc2UuYnJvd3NlciA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdG8gZGV0ZWN0IGlmIHRoZSBicm93ZXIgaXMgSUVcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqXG4gICAgICogaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi1nYi9saWJyYXJ5L21zNTM3NTA5KHY9dnMuODUpLmFzcHhcbiAgICAgKi9cbiAgICBiYXNlLmJyb3dzZXIuaXNJRSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBydiA9IC0xO1xuICAgICAgaWYgKG5hdmlnYXRvci5hcHBOYW1lID09PSAnTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyJylcbiAgICAgIHtcbiAgICAgICAgdmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAgICAgdmFyIHJlICA9IG5ldyBSZWdFeHAoJ01TSUUgKFswLTldezEsfVtcXFxcLjAtOV17MCx9KScpO1xuICAgICAgICBpZiAocmUuZXhlYyh1YSkgIT09IG51bGwpe1xuICAgICAgICAgIHJ2ID0gcGFyc2VGbG9hdCggUmVnRXhwLiQxICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJ2ICE9PSAtMTtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldENvbmZpZ1xuICAgICAqIFRoZSBmdW5jdGlvbiByZXR1cm5zIHRoZSBleHRlbmRlZCB2ZXJzaW9uIG9mIGNvbmZpZyBvYmplY3QgdGhlIHBsdWdpbiBpcyBnb2luZyB0b1xuICAgICAqIHVzZXIuXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIE9iamVjdFxuICAgICAqL1xuICAgIGJhc2UuZ2V0Q29uZmlnID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gQXBwQ29uZmlnO1xuICAgIH07XG5cbiAgICAkLlRocmVlU2l4dHkuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAvKipcbiAgICAgICAqIEBjZmcge0Jvb2xlYW59IGRyYWdnaW5nIFtkcmFnZ2luZz1mYWxzZV1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKiBQcml2YXRlIHByb3BlcnkgY29udGFpbnMgYSBmbGFncyBpZiB1c2VycyBpcyBpbiBkcmFnZ2luZyBtb2RlLlxuICAgICAgICovXG4gICAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIEBjZmcge0Jvb2xlYW59IHJlYWR5IFtyZWFkeT1mYWxzZV1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKiBQcml2YXRlIHByb3BlcnkgaXMgc2V0IHRvIHRydWUgaXMgYWxsIGFzc2V0cyBhcmUgbG9hZGluZyBhbmQgYXBwbGljYXRpb24gaXNcbiAgICAgICAqIHJlYWR5IHRvIHJlbmRlciAzNjAgc2xpZGVyLlxuICAgICAgICovXG4gICAgICByZWFkeTogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIEBjZmcge051bWJlcn0gcG9pbnRlclN0YXJ0UG9zWFxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIHByaXZhdGUgcHJvcGVydHkgbW91c2UgcG9pbnRlciBzdGFydCB4IHBvc2l0aW9uIHdoZW4gdXNlciBzdGFydHMgZHJhZ2dpbmcgc2xpZGVyLlxuICAgICAgICovXG4gICAgICBwb2ludGVyU3RhcnRQb3NYOiAwLFxuICAgICAgLyoqXG4gICAgICAgKiBAY2ZnIHtOdW1iZXJ9IHBvaW50ZXJFbmRQb3NYXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICogcHJpdmF0ZSBwcm9wZXJ0eSBtb3VzZSBwb2ludGVyIHN0YXJ0IHggcG9zaXRpb24gd2hlbiB1c2VyIGVuZCBkcmFnZ2luZyBzbGlkZXIuXG4gICAgICAgKi9cbiAgICAgIHBvaW50ZXJFbmRQb3NYOiAwLFxuICAgICAgLyoqXG4gICAgICAgKiBAY2ZnIHtOdW1iZXJ9IHBvaW50ZXJEaXN0YW5jZVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIHByaXZhdGUgcHJvcGVydHkgY29udGFpbnMgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHBvaW50ZXJTdGFydFBvc1ggYW5kIHBvaW50ZXJFbmRQb3NYXG4gICAgICAgKi9cbiAgICAgIHBvaW50ZXJEaXN0YW5jZTogMCxcbiAgICAgIC8qKlxuICAgICAgICogQGNmZyB7TnVtYmVyfSBtb25pdG9yU3RhcnRUaW1lXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICogcHJpdmF0ZSBwcm9wZXJ0eSBjb250YWlucyB0aW1lIHVzZXIgdG9vayBpbiBkcmFnZ2luZyBtb3VzZSBmcm9tIHBvaW50ZXJTdGFydFBvc1ggYW5kIHBvaW50ZXJFbmRQb3NYXG4gICAgICAgKi9cbiAgICAgIG1vbml0b3JTdGFydFRpbWU6IDAsXG4gICAgICBtb25pdG9ySW50OiAxMCxcbiAgICAgIC8qKlxuICAgICAgICogQGNmZyB7TnVtYmVyfSB0aWNrZXJcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKiBUaW1lciBldmVudCB0aGF0IHJlbmRlcnMgdGhlIDM2MFxuICAgICAgICovXG4gICAgICB0aWNrZXI6IDAsXG4gICAgICAvKipcbiAgICAgICAqIEBjZmcge051bWJlcn0gc3BlZWRNdWx0aXBsaWVyXG4gICAgICAgKiBUaGlzIHByb3BlcnR5IGNvbnRyb2xzIHRoZSBzZW5zaXRpdml0eSBmb3IgdGhlIDM2MCBzbGlkZXJcbiAgICAgICAqL1xuICAgICAgc3BlZWRNdWx0aXBsaWVyOiA3LFxuICAgICAgLyoqXG4gICAgICAgKiBAY2ZnIHtOdW1iZXJ9IHRvdGFsRnJhbWVzXG4gICAgICAgKiBTZXQgdG90YWwgbnVtYmVyIGZvciBmcmFtZXMgdXNlZCBpbiB0aGUgMzYwIHJvdGF0aW9uXG4gICAgICAgKi9cbiAgICAgIHRvdGFsRnJhbWVzOiAxODAsXG4gICAgICAvKipcbiAgICAgICAqIEBjZmcge051bWJlcn0gY3VycmVudEZyYW1lXG4gICAgICAgKiBDdXJyZW50IGZyYW1lIG9mIHRoZSBzbGlkZXIuXG4gICAgICAgKi9cbiAgICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICAgIC8qKlxuICAgICAgICogQGNmZyB7QXJyYXl9IGVuZEZyYW1lXG4gICAgICAgKiBQcml2YXRlIHBlcnBlcnR5IGNvbnRhaW5zIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbmQgZnJhbWUgd2hlbiB1c2VyIHNsaWRlcyB0aGUgc2xpZGVyLlxuICAgICAgICovXG4gICAgICBlbmRGcmFtZTogMCxcbiAgICAgIC8qKlxuICAgICAgICogQGNmZyB7TnVtYmVyfSBsb2FkZWRJbWFnZXNcbiAgICAgICAqIFByaXZhdGUgcHJvcGVydHkgY29udGFpbnMgY291bnQgb2YgbG9hZGVkIGltYWdlcy5cbiAgICAgICAqL1xuICAgICAgbG9hZGVkSW1hZ2VzOiAwLFxuICAgICAgLyoqXG4gICAgICAgKiBAY2ZnIHtBcnJheX0gZnJhbWVyYXRlXG4gICAgICAgKiBTZXQgZnJhbWVyYXRlIGZvciB0aGUgc2xpZGVyIGFuaW1hdGlvblxuICAgICAgICovXG4gICAgICBmcmFtZXJhdGU6IDYwLFxuICAgICAgLyoqXG4gICAgICAgKiBAY2ZnIHtTdHJpbmd9IGRvbWFpbnNcbiAgICAgICAqIFNldCBjb21tYSBzZXByYXRlZCBsaXN0IG9mIGFsbCBwYXJhbGxlbCBkb21haW4gZnJvbSB3aGVyZSAzNjAgYXNzZXRzIG5lZWRzIHRvIGJlIGxvYWRlZC5cbiAgICAgICAqL1xuICAgICAgZG9tYWluczogbnVsbCxcbiAgICAgIC8qKlxuICAgICAgICogQGNmZyB7U3RyaW5nfSBkb21haW5cbiAgICAgICAqIERvbWFpbiBmcm9tIHdoZXJlIGFzc2V0cyBuZWVkcyB0byBiZSBsb2FkZWQuIFVzZSB0aGlzIHByb3BlcnkgaXMgeW91IHdhbnQgdG8gbG9hZCBhbGwgYXNzZXRzIGZyb21cbiAgICAgICAqIHNpbmdsZSBkb21haW4uXG4gICAgICAgKi9cbiAgICAgIGRvbWFpbjogJycsXG4gICAgICAvKipcbiAgICAgICAqIEBjZmcge0Jvb2xlYW59IHBhcmFsbGVsXG4gICAgICAgKiBTZXQgdG8gdHJ1ZSBpZiB5b3Ugd2FudCB0byBsb2FkIGFzc2V0cyBmcm9tIHBhcmFsbGVsIGRvbWFpbi4gRGVmYXVsdCBmYWxzZVxuICAgICAgICovXG4gICAgICBwYXJhbGxlbDogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIEBjZmcge051bWJlcn0gcXVldWVBbW91bnRcbiAgICAgICAqIFNldCBudW1iZXIgb2YgY2FsbHMgdG8gYmUgbWFkZSBvbiBwYXJhbGxlbCBkb21haW5zLlxuICAgICAgICovXG4gICAgICBxdWV1ZUFtb3VudDogOCxcbiAgICAgIC8qKlxuICAgICAgICogQGNmZyB7TnVtYmVyfSBpZGxlXG4gICAgICAgKiBNb3VzZSBJbmFjdGl2aXRlIGlkbGUgdGltZSBpbiBzZWNvbmRzLiBJZiBzZXQgbW9yZSB0aGFuIDAgd2lsbCBhdXRvIHNwaW5lIHRoZSBzbGlkZXJcbiAgICAgICAqL1xuICAgICAgaWRsZTogMCxcbiAgICAgIC8qKlxuICAgICAgICogQGNmZyB7U3RyaW5nfSBmaWxlUHJlZml4XG4gICAgICAgKiBQcmVmaXggZm9yIHRoZSBpbWFnZSBmaWxlIG5hbWUgYmVmb3JlIHRoZSBudW1lcmljIHZhbHVlLlxuICAgICAgICovXG4gICAgICBmaWxlUHJlZml4OiAnJyxcbiAgICAgIC8qKlxuICAgICAgICogQGNmZyB7U3RyaW5nfSBleHQgW2V4dD0ucG5nXVxuICAgICAgICogU2xpZGVyIGltYWdlIGV4dGVuc2lvbi5cbiAgICAgICAqL1xuICAgICAgZXh0OiAncG5nJyxcbiAgICAgIC8qKlxuICAgICAgICogQGNmZyB7T2JqZWN0fSBoZWlnaHQgWzMwMF1cbiAgICAgICAqIEhlaWdodCBvZiB0aGUgc2xpZGVyXG4gICAgICAgKi9cbiAgICAgIGhlaWdodDogMzAwLFxuICAgICAgLyoqXG4gICAgICAgKiBAY2ZnIHtOdW1iZXJ9IHdpZHRoIFszMDBdXG4gICAgICAgKiBXaWR0aCBvZiB0aGUgc2xpZGVyXG4gICAgICAgKi9cbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICAvKipcbiAgICAgICAqIEBjZmcge09iamVjdH0gc3R5bGVzXG4gICAgICAgKiBDU1MgU3R5bGVzIGZvciB0aGUgMzYwIHNsaWRlclxuICAgICAgICovXG4gICAgICBzdHlsZXM6IHt9LFxuICAgICAgLyoqXG4gICAgICAgKiBAY2ZnIHtCb29sZWFufSBuYXZpZ2F0aW9uW2ZhbHNlXVxuICAgICAgICogU3RhdGUgaWYgbmF2aWdhdGlvbiBjb250cm9scyBhcmUgdmlzaWJsZSBvciBub3QuXG4gICAgICAgKi9cbiAgICAgIG5hdmlnYXRpb246IGZhbHNlLFxuICAgICAgLyoqXG4gICAgICAgKiBAY2ZnIHtCb29sZWFufSBhdXRvcGxheVtmYWxzZV1cbiAgICAgICAqIEF1dG9wbGF5IHRoZSAzNjAgYW5pbWF0aW9uXG4gICAgICAgKi9cbiAgICAgIGF1dG9wbGF5OiBmYWxzZSxcbiAgICAgIC8qKlxuICAgICAgICogQGNmZyB7bnVtYmVyfSBhdXRvcGxheURpcmVjdGlvbiBbMV1cbiAgICAgICAqIERpcmVjdGlvbiBmb3IgYXV0b3BsYXkgdGhlIDM2MCBhbmltYXRpb24uIDEgZm9yIHJpZ2h0IHNwaW4sIGFuZCAtMSBmb3IgbGVmdCBzcGluLlxuICAgICAgICovXG4gICAgICBhdXRvcGxheURpcmVjdGlvbjogMSxcbiAgICAgIC8qKlxuICAgICAgICogUHJvcGVydHkgdG8gZGlzYWJsZSBhdXRvIHNwaW5cbiAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICovXG4gICAgICBkaXNhYmxlU3BpbjogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIFByb3BlcnR5IHRvIGRpc2FibGUgaW5maW5pdGUgd3JhcFxuICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgKi9cbiAgICAgIGRpc2FibGVXcmFwOiBmYWxzZSxcbiAgICAgIC8qKlxuICAgICAgICogUmVzcG9uc2l2ZSB3aWR0aFxuICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgKi9cbiAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxuICAgICAgLyoqXG4gICAgICAgKiBaZXJvIFBhZGRpbmcgZm9yIGZpbGVuYW1lc1xuICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgKi9cbiAgICAgIHplcm9QYWRkaW5nOiBmYWxzZSxcbiAgICAgIC8qKlxuICAgICAgICogWmVybyBiYXNlZCBmb3IgaW1hZ2UgZmlsZW5hbWVzIHN0YXJ0aW5nIGF0IDBcbiAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICovXG4gICAgICB6ZXJvQmFzZWQ6IGZhbHNlLFxuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgKiBMaXN0IG9mIHBsdWdpbnNcbiAgICAgICAqL1xuICAgICAgcGx1Z2luczogW10sXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICogU2hvdyBoYW5kIGN1cnNvciBvbiBkcmFnXG4gICAgICAgKi9cbiAgICAgIHNob3dDdXJzb3I6IGZhbHNlLFxuICAgICAgLyoqXG4gICAgICAgKiBAY2ZnIHtCb29sZWFufSBkcmFnXG4gICAgICAgKiBTZXQgaXQgdG8gZmFsc2UgaWYgeW91IHdhbnQgdG8gZGlzYWJsZSBtb3VzZWRyYWcgb3IgdG91Y2ggZXZlbnRzXG4gICAgICAgKi9cbiAgICAgIGRyYWc6IHRydWUsXG4gICAgICAvKipcbiAgICAgICAqIEBjZmcge0Z1bmN0aW9ufSBvblJlYWR5XG4gICAgICAgKiBDYWxsYmFjayB0cmlnZ2VycyBvbmNlIGFsbCBpbWFnZXMgYXJlIGxvYWRlZCBhbmQgcmVhZHkgdG8gcmVuZGVyIG9uIHRoZSBzY3JlZW5cbiAgICAgICAqL1xuICAgICAgb25SZWFkeTogZnVuY3Rpb24oKSB7fSxcbiAgICAgIC8qKlxuICAgICAgICogQGNmZyB7U3RyaW5nfSBpbWdMaXN0XG4gICAgICAgKiBTZXQgdWwgZWxlbWVudCB3aGVyZSBpbWFnZSB3aWxsIGJlIGxvYWRlZFxuICAgICAgICovXG4gICAgICBpbWdMaXN0OiAnLnRocmVlc2l4dHlfaW1hZ2VzJyxcbiAgICAgIC8qKlxuICAgICAgICogQGNmZyB7QXJyYXl9IGltZ0FycmF5XG4gICAgICAgKiBVc2Ugc2V0IG9mIGltYWdlcyBpbiBhcnJheSB0byBsb2FkIGltYWdlc1xuICAgICAgICovXG4gICAgICBpbWdBcnJheTogbnVsbCxcbiAgICAgIC8qKlxuICAgICAgKiBAY2ZnIHtOdW1iZXJ9IHBsYXlTcGVlZFxuICAgICAgKiBWYWx1ZSB0byBjb250cm9sIHRoZSBzcGVlZCBvZiBwbGF5IGJ1dHRvbiByb3RhdGlvblxuICAgICAgKi9cbiAgICAgIHBsYXlTcGVlZDogMTAwXG4gICAgfTtcbiAgICBiYXNlLmluaXQoKTtcbiAgfTtcblxuICAkLmZuLlRocmVlU2l4dHkgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUobmV3ICQuVGhyZWVTaXh0eSh0aGlzLCBvcHRpb25zKSk7XG4gIH07XG59KGpRdWVyeSkpO1xuLyoqXG4gKlxuICogT2JqZWN0LmNyZWF0ZSBtZXRob2QgZm9yIHBlcmZvcm0gYXMgYSBmYWxsYmFjayBpZiBtZXRob2Qgbm90IGF2YWlsYWJsZS5cbiAqIFRoZSBzeW50YXgganVzdCB0YWtlcyBhd2F5IHRoZSBpbGx1c2lvbiB0aGF0IEphdmFTY3JpcHQgdXNlcyBDbGFzc2ljYWwgSW5oZXJpdGFuY2UuXG4gKi9cbmlmKHR5cGVvZiBPYmplY3QuY3JlYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gIE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbihvKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gRigpIHt9XG4gICAgRi5wcm90b3R5cGUgPSBvO1xuICAgIHJldHVybiBuZXcgRigpO1xuICB9O1xufVxuIl19
},{}],18:[function(require,module,exports){
'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.Model.extend({

  initialize: function initialize() {
    var rot = this.get('rotation');
    rot[0] = rot[0] * Math.PI / 180;
    rot[1] = rot[1] * Math.PI / 180;
    rot[2] = rot[2] * Math.PI / 180;
    this.set('rotation', rot);
  },

  defaults: {
    "id": 0,
    "name": "",
    "url": "#",
    "size": [0, 0],
    "position": [0, 0, 0],
    "rotation": [0, 0, 0],
    "viewport": "full"
  },

  validate: function validate(attrs) {}

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L21vZGVscy9hcnR3b3JrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFZixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDOztBQUVyQyxZQUFVLEVBQUUsc0JBQVc7QUFDckIsUUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQixPQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2hDLE9BQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDaEMsT0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNoQyxRQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztHQUMzQjs7QUFFRCxVQUFRLEVBQUU7QUFDUixRQUFJLEVBQUUsQ0FBQztBQUNQLFVBQU0sRUFBRSxFQUFFO0FBQ1YsU0FBSyxFQUFFLEdBQUc7QUFDVixVQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQ2IsY0FBVSxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDbkIsY0FBVSxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDbkIsY0FBVSxFQUFFLE1BQU07R0FDbkI7O0FBRUQsVUFBUSxFQUFFLGtCQUFTLEtBQUssRUFBRSxFQUN6Qjs7Q0FFRixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2pvcmlzL1NpdGVzL3BsYXlncm91bmQvbnMwMi1uZXZlcmxhbmRzcGFjZS9yZXNvdXJjZXMvYXNzZXRzL2pzL3NwYWNlL2RlZmF1bHQvbW9kZWxzL2FydHdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbkJhY2tib25lLiQgPSAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJvdCA9IHRoaXMuZ2V0KCdyb3RhdGlvbicpO1xuICAgIHJvdFswXSA9IHJvdFswXSAqIE1hdGguUEkgLyAxODA7XG4gICAgcm90WzFdID0gcm90WzFdICogTWF0aC5QSSAvIDE4MDtcbiAgICByb3RbMl0gPSByb3RbMl0gKiBNYXRoLlBJIC8gMTgwO1xuICAgIHRoaXMuc2V0KCdyb3RhdGlvbicsIHJvdCk7XG4gIH0sXG5cbiAgZGVmYXVsdHM6IHtcbiAgICBcImlkXCI6IDAsXG4gICAgXCJuYW1lXCI6IFwiXCIsXG4gICAgXCJ1cmxcIjogXCIjXCIsXG4gICAgXCJzaXplXCI6IFswLDBdLFxuICAgIFwicG9zaXRpb25cIjogWzAsMCwwXSxcbiAgICBcInJvdGF0aW9uXCI6IFswLDAsMF0sXG4gICAgXCJ2aWV3cG9ydFwiOiBcImZ1bGxcIlxuICB9LFxuXG4gIHZhbGlkYXRlOiBmdW5jdGlvbihhdHRycykge1xuICB9XG5cbn0pOyJdfQ==
},{"backbone":2,"jquery":12}],19:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"ns-iframe__container\" style=\"background-image:url('";
  if (helper = helpers.image) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.image); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "');\">\n  <iframe class=\"ns-iframe__iframe\" frameborder=\"0\" scrolling=\"no\" ></iframe>\n  <div class=\"ns-iframe__overlay\" style=\"background-image:url('";
  if (helper = helpers.image) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.image); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "');\"></div>\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":10}],20:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<img class=\"ns-image__image\" src=\"";
  if (helper = helpers.image) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.image); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n<div class=\"ns-image__poster\" style=\"background-image:url(";
  if (helper = helpers.poster) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.poster); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ")\"></div>";
  return buffer;
  });

},{"hbsfy/runtime":10}],21:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};



  return "<div class=\"spinner\" style=\"display:none;\"><span></span></div>\n<ol class=\"ns-scrub__list threesixty_images\"></ol>";
  });

},{"hbsfy/runtime":10}],22:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {


  return "loop ";
  }

function program3(depth0,data) {


  return "controls ";
  }

function program5(depth0,data) {

  var buffer = "", stack1, helper;
  buffer += "\n        <source src=\"";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"  type=\"";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n    ";
  return buffer;
  }

  buffer += "<div class=\"vid-container\" style=\"background-image:url('";
  if (helper = helpers.image) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.image); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'); width:"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.size)),stack1 == null || stack1 === false ? stack1 : stack1[0])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "px; height:"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.size)),stack1 == null || stack1 === false ? stack1 : stack1[1])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "px;\">\n  <video class=\"vid-player\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.loop), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.controls), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "width=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.size)),stack1 == null || stack1 === false ? stack1 : stack1[0])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" height=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.size)),stack1 == null || stack1 === false ? stack1 : stack1[1])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.videos), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </video>\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":10}],23:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {

  var buffer = "", stack1;
  buffer += "\n  <a href=\""
    + escapeExpression(((stack1 = (depth0 && depth0.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"exhibitions__item exhibitions__item--"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <div class=\"exhibitions__image\" style=\"background-image:url('"
    + escapeExpression(((stack1 = (depth0 && depth0.image)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "')\"></div>\n    <h2 class=\"exhibitions__headline\">";
  stack1 = ((stack1 = (depth0 && depth0.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2>\n    <span class=\"exhibitions__artist\">by <span class=\"artist__name\">"
    + escapeExpression(((stack1 = (depth0 && depth0.artist)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></span>\n  </a>\n";
  return buffer;
  }

  buffer += "<a href=\"/\" class=\"endslide__logo\">\n  <svg>\n    <path d=\"M17.44,28 L23.02,28 L23.02,0.928 L17.836,0.928 L17.836,19.108 L17.764,19.108 L6.784,0.928 L0.988,0.928 L0.988,28 L6.172,28 L6.172,9.532 L6.244,9.532 L17.44,28 Z\" id=\"nav__logo__letter\"></path>\n  </svg>\n</a>\n<a href=\"#\" class=\"arrow--back js-back\"></a>\n<div class=\"playnav\">\n  <a href=\"#\" class=\"playnav__btn js-rewind\">Again</a>\n  <a href=\"/\" class=\"playnav__btn\">Exit</a>\n</div>\n<div class=\"share\">\n  Share:\n  <a target=\"_blank\" href=\"https://www.facebook.com/sharer/sharer.php?u=";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"share__link\">Facebook</a>\n  <a target=\"_blank\" href=\"https://twitter.com/intent/tweet?url=";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"share__link\">Twitter</a>\n  <a target=\"_blank\" href=\"https://plus.google.com/share?url=";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"share__link\">Google+</a>\n  <a href=\"mailto:?&subject=Neverland Space&body=";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"share__link\">E-Mail</a>\n</div>\n<h1 class=\"endslide__headline\">More Exhibitions</h1>\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.suggestions), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });

},{"hbsfy/runtime":10}],24:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"homewrap\">\n  <nav class=\"nav-main\">\n    <ul class=\"nav-main-list\">\n      <li><a class=\"nav-main-link\" href=\"/\">Exhibitions</a>\n      <li><a class=\"nav-main-link\" href=\"/about\">About</a>\n     </ul>\n  </nav>\n  <div class=\"homewrap__inner\">\n    <div class=\"home__background\" style=\"background-image:url('";
  if (helper = helpers.preview) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.preview); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "');\"></div>\n    <div class=\"homewrap__content\">\n      <h1>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h1>\n      <span class=\"homewrap__artist\">by <span class=\"homewrap__artist__name\">";
  if (helper = helpers.artist) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.artist); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></span>\n      <p>";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n    </div>\n  </div>\n  <a href=\"#\" class=\"homewrap__enterbtn js-enterspace\"></a>  \n</div>";
  return buffer;
  });

},{"hbsfy/runtime":10}],25:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"space-container\" style=\"background-color: ";
  if (helper = helpers.backgroundColor) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.backgroundColor); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ";\">\n  <div class=\"nav\">\n    <a href=\"/\" class=\"nav__logo\" title=\"Neverland Space\">\n      <svg>\n        <path d=\"M17.44,28 L23.02,28 L23.02,0.928 L17.836,0.928 L17.836,19.108 L17.764,19.108 L6.784,0.928 L0.988,0.928 L0.988,28 L6.172,28 L6.172,9.532 L6.244,9.532 L17.44,28 Z\" id=\"nav__logo__letter\"></path>\n      </svg>\n    </a>\n    <ul class=\"nav__list is-hidden\">\n      <li class=\"nav__item\"><a href=\"#\" class=\"nav__link js-birdseye\">Bird's Eye</a></li>\n      <li class=\"nav__item\"><a href=\"/\" class=\"nav__link\">Exit</a></li>\n    </ul>\n  </div>\n  <a href=\"#\" class=\"space__arrow prev js-prevartwork\"></a>\n  <a href=\"#\" class=\"space__arrow next js-nextartwork\"></a>\n  <div class=\"title-container\">\n    <div class=\"title__instruction\">...</div>\n    <div class=\"title__description\">...</div>\n  </div>\n  <div class=\"space__endslide\"></div>\n</div>\n";
  return buffer;
  });

},{"hbsfy/runtime":10}],26:[function(require,module,exports){
'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
Backbone.$ = $;

var Artwork = require('models/artwork');

var artworkTemplate = require('templates/artworks/iframeartwork.hbs');

module.exports = Backbone.View.extend({

  events: {
    'click': 'handleClick',
    'mouseover': 'handleMouseOver',
    'mouseout': 'handleMouseOut'
  },

  initialize: function initialize(args) {
    var self = this;

    $(window).on('resize', function () {
      self.handleResize();
    });

    this.space = args.space;
    this.oldId = args.oldId;

    // console.log(this.model.get('name'));
  },

  render: function render() {

    this.$el.addClass('ns-aw-container ns-iframe');
    this.$el.css({ width: this.model.get('size')[0] + 'px', height: this.model.get('size')[1] + 'px' });

    var compiledTemplate = artworkTemplate(this.model.attributes);
    this.$el.html(compiledTemplate);

    this.$container = this.$el.find('.ns-iframe__container');
    this.$iframe = this.$container.find('.ns-iframe__iframe');
    this.$overlay = this.$container.find('.ns-iframe__overlay');

    //this.$iframe.attr('src', '');

    if (this.model.get('fittoscreen')) {
      this.adaptScreenRatio();
    }

    // this.$iframe.remove();
  },

  activate: function activate() {

    // console.log(this.model.get('name') + ' is active');

    this.$el.addClass('is-active');

    // this.$iframe.css('display', 'block');
    // this.$container.append(this.$iframe);
    this.$iframe.attr('src', this.model.get('url'));
    this.$overlay.fadeOut(1000);
  },

  deactivate: function deactivate() {
    var self = this;

    // console.log(this.model.get('name') + ' is deactivated');

    this.$el.removeClass('is-active');

    this.$overlay.fadeIn(500, function () {
      self.$iframe.attr('src', '');
      // self.$iframe.remove();
    });
  },

  handleClick: function handleClick(e) {
    // console.log('click');

    if (this.space.birdseyeActive) {
      this.space.showArtworkById(this.oldId, 2000);
    }
  },

  handleMouseOver: function handleMouseOver(e) {
    // console.log('mouse over');
    if (this.space.birdseyeActive) {
      this.$el.addClass('is-highlighted');
    }
  },

  handleMouseOut: function handleMouseOut(e) {
    // console.log('mouse out');
    if (this.space.birdseyeActive) {
      this.$el.removeClass('is-highlighted');
    }
  },

  adaptScreenRatio: function adaptScreenRatio() {
    // var w = this.$el.width();
    // var newH = (window.innerHeight / window.innerWidth) * w;

    // this.$el.css({ 'height': newH+'px' });

    // var h = this.$el.height();
    // var newW = (window.innerWidth / window.innerHeight) * h;

    var h = window.innerHeight;
    var w = window.innerWidth;

    this.model.set('size', [w, h]);

    this.$el.css({ 'width': w + 'px', 'height': h + 'px' });
  },

  handleResize: function handleResize() {
    this.adaptScreenRatio();
  },

  loadAssets: function loadAssets(callback) {
    var url = this.model.get('image');

    if (url != '') {
      $('<img>').attr('src', url).load(function () {
        $(this).remove();
        callback();
      });
    } else {
      callback();
    }
  }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L3ZpZXdzL2FydHdvcmtzL2lmcmFtZWFydHdvcmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM5QixRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFZixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFeEMsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7O0FBRXRFLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7O0FBRXBDLFFBQU0sRUFBRTtBQUNOLFdBQU8sRUFBRSxhQUFhO0FBQ3RCLGVBQVcsRUFBRSxpQkFBaUI7QUFDOUIsY0FBVSxFQUFFLGdCQUFnQjtHQUM3Qjs7QUFFRCxZQUFVLEVBQUUsb0JBQVMsSUFBSSxFQUFFO0FBQ3pCLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsS0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsWUFBVztBQUNoQyxVQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDckIsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN4QixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7OztHQUl6Qjs7QUFFRCxRQUFNLEVBQUUsa0JBQVc7O0FBRWpCLFFBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDOztBQUVoRyxRQUFJLGdCQUFnQixHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzlELFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBSWhDLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN6RCxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDMUQsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOzs7O0FBSzVELFFBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDaEMsVUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7S0FDekI7OztHQUlGOztBQUVELFVBQVEsRUFBRSxvQkFBVzs7OztBQUluQixRQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7OztBQUkvQixRQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNoRCxRQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUU3Qjs7QUFFRCxZQUFVLEVBQUUsc0JBQVc7QUFDckIsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOzs7O0FBSWhCLFFBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVsQyxRQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsWUFBVztBQUNuQyxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7O0tBRTlCLENBQUMsQ0FBQztHQUVKOztBQUVELGFBQVcsRUFBRSxxQkFBUyxDQUFDLEVBQUU7OztBQUd2QixRQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFO0FBQzVCLFVBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDOUM7R0FDRjs7QUFFRCxpQkFBZSxFQUFFLHlCQUFTLENBQUMsRUFBRTs7QUFFM0IsUUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRTtBQUM1QixVQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ3JDO0dBQ0Y7O0FBRUQsZ0JBQWMsRUFBRSx3QkFBUyxDQUFDLEVBQUU7O0FBRTFCLFFBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUU7QUFDNUIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUN4QztHQUNGOztBQUVELGtCQUFnQixFQUFFLDRCQUFXOzs7Ozs7Ozs7QUFTM0IsUUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUMzQixRQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDOztBQUUxQixRQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxHQUFDLElBQUksRUFBRSxDQUFDLENBQUM7R0FDckQ7O0FBRUQsY0FBWSxFQUFFLHdCQUFXO0FBQ3ZCLFFBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0dBQ3pCOztBQUVELFlBQVUsRUFBRSxvQkFBUyxRQUFRLEVBQUU7QUFDN0IsUUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRWxDLFFBQUcsR0FBRyxJQUFJLEVBQUUsRUFBRTtBQUNaLE9BQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFXO0FBQzFDLFNBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNqQixnQkFBUSxFQUFFLENBQUM7T0FDWixDQUFDLENBQUM7S0FDSixNQUFJO0FBQ0gsY0FBUSxFQUFFLENBQUM7S0FDWjtHQUNGOztDQUVGLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvam9yaXMvU2l0ZXMvcGxheWdyb3VuZC9uczAyLW5ldmVybGFuZHNwYWNlL3Jlc291cmNlcy9hc3NldHMvanMvc3BhY2UvZGVmYXVsdC92aWV3cy9hcnR3b3Jrcy9pZnJhbWVhcnR3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbkJhY2tib25lLiQgPSAkO1xuXG52YXIgQXJ0d29yayA9IHJlcXVpcmUoJ21vZGVscy9hcnR3b3JrJyk7XG5cbnZhciBhcnR3b3JrVGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvYXJ0d29ya3MvaWZyYW1lYXJ0d29yay5oYnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrJzogJ2hhbmRsZUNsaWNrJyxcbiAgICAnbW91c2VvdmVyJzogJ2hhbmRsZU1vdXNlT3ZlcicsXG4gICAgJ21vdXNlb3V0JzogJ2hhbmRsZU1vdXNlT3V0J1xuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5oYW5kbGVSZXNpemUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3BhY2UgPSBhcmdzLnNwYWNlO1xuICAgIHRoaXMub2xkSWQgPSBhcmdzLm9sZElkO1xuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5tb2RlbC5nZXQoJ25hbWUnKSk7XG5cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ25zLWF3LWNvbnRhaW5lciBucy1pZnJhbWUnKTtcbiAgICB0aGlzLiRlbC5jc3MoeyB3aWR0aDogdGhpcy5tb2RlbC5nZXQoJ3NpemUnKVswXSsncHgnLCBoZWlnaHQ6IHRoaXMubW9kZWwuZ2V0KCdzaXplJylbMV0rJ3B4JyB9KTtcblxuICAgIHZhciBjb21waWxlZFRlbXBsYXRlID0gYXJ0d29ya1RlbXBsYXRlKHRoaXMubW9kZWwuYXR0cmlidXRlcyk7XG4gICAgdGhpcy4kZWwuaHRtbChjb21waWxlZFRlbXBsYXRlKTtcblxuXG5cbiAgICB0aGlzLiRjb250YWluZXIgPSB0aGlzLiRlbC5maW5kKCcubnMtaWZyYW1lX19jb250YWluZXInKTtcbiAgICB0aGlzLiRpZnJhbWUgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLm5zLWlmcmFtZV9faWZyYW1lJyk7XG4gICAgdGhpcy4kb3ZlcmxheSA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcubnMtaWZyYW1lX19vdmVybGF5Jyk7XG5cblxuICAgIC8vdGhpcy4kaWZyYW1lLmF0dHIoJ3NyYycsICcnKTtcblxuICAgIGlmKHRoaXMubW9kZWwuZ2V0KCdmaXR0b3NjcmVlbicpKcKge1xuICAgICAgdGhpcy5hZGFwdFNjcmVlblJhdGlvKCk7XG4gICAgfVxuXG4gICAgLy8gdGhpcy4kaWZyYW1lLnJlbW92ZSgpO1xuXG4gIH0sXG5cbiAgYWN0aXZhdGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5tb2RlbC5nZXQoJ25hbWUnKSArICcgaXMgYWN0aXZlJyk7XG5cbiAgICB0aGlzLiRlbC5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICAvLyB0aGlzLiRpZnJhbWUuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgLy8gdGhpcy4kY29udGFpbmVyLmFwcGVuZCh0aGlzLiRpZnJhbWUpO1xuICAgIHRoaXMuJGlmcmFtZS5hdHRyKCdzcmMnLCB0aGlzLm1vZGVsLmdldCgndXJsJykpO1xuICAgIHRoaXMuJG92ZXJsYXkuZmFkZU91dCgxMDAwKTtcblxuICB9LFxuXG4gIGRlYWN0aXZhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMubW9kZWwuZ2V0KCduYW1lJykgKyAnIGlzIGRlYWN0aXZhdGVkJyk7XG5cbiAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICB0aGlzLiRvdmVybGF5LmZhZGVJbig1MDAsIGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi4kaWZyYW1lLmF0dHIoJ3NyYycsICcnKTtcbiAgICAgIC8vIHNlbGYuJGlmcmFtZS5yZW1vdmUoKTtcbiAgICB9KTtcblxuICB9LFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ2NsaWNrJyk7XG5cbiAgICBpZih0aGlzLnNwYWNlLmJpcmRzZXllQWN0aXZlKSB7XG4gICAgICB0aGlzLnNwYWNlLnNob3dBcnR3b3JrQnlJZCh0aGlzLm9sZElkLCAyMDAwKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlTW91c2VPdmVyOiBmdW5jdGlvbihlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ21vdXNlIG92ZXInKTtcbiAgICBpZih0aGlzLnNwYWNlLmJpcmRzZXllQWN0aXZlKSB7XG4gICAgICB0aGlzLiRlbC5hZGRDbGFzcygnaXMtaGlnaGxpZ2h0ZWQnKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlTW91c2VPdXQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnbW91c2Ugb3V0Jyk7XG4gICAgaWYodGhpcy5zcGFjZS5iaXJkc2V5ZUFjdGl2ZSkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2hsaWdodGVkJyk7XG4gICAgfVxuICB9LFxuXG4gIGFkYXB0U2NyZWVuUmF0aW86IGZ1bmN0aW9uKCkge1xuICAgIC8vIHZhciB3ID0gdGhpcy4kZWwud2lkdGgoKTtcbiAgICAvLyB2YXIgbmV3SCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyB3aW5kb3cuaW5uZXJXaWR0aCkgKiB3O1xuXG4gICAgLy8gdGhpcy4kZWwuY3NzKHsgJ2hlaWdodCc6IG5ld0grJ3B4JyB9KTtcblxuICAgIC8vIHZhciBoID0gdGhpcy4kZWwuaGVpZ2h0KCk7XG4gICAgLy8gdmFyIG5ld1cgPSAod2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQpICogaDtcblxuICAgIHZhciBoID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHZhciB3ID0gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgICB0aGlzLm1vZGVsLnNldCgnc2l6ZScsIFt3LCBoXSk7XG5cbiAgICB0aGlzLiRlbC5jc3MoeyAnd2lkdGgnOiB3KydweCcsICdoZWlnaHQnOiBoKydweCcgfSk7XG4gIH0sXG5cbiAgaGFuZGxlUmVzaXplOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFkYXB0U2NyZWVuUmF0aW8oKTtcbiAgfSxcblxuICBsb2FkQXNzZXRzOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHZhciB1cmwgPSB0aGlzLm1vZGVsLmdldCgnaW1hZ2UnKTtcblxuICAgIGlmKHVybCAhPSAnJykge1xuICAgICAgJCgnPGltZz4nKS5hdHRyKCdzcmMnLCB1cmwpLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9ZWxzZXtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbn0pOyJdfQ==
},{"backbone":2,"jquery":12,"models/artwork":18,"templates/artworks/iframeartwork.hbs":19,"underscore":14}],27:[function(require,module,exports){
'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
Backbone.$ = $;

var Artwork = require('models/artwork');

var artworkTemplate = require('templates/artworks/imageartwork.hbs');

module.exports = Backbone.View.extend({

  events: {
    'click': 'handleClick',
    'mouseover': 'handleMouseOver',
    'mouseout': 'handleMouseOut'
  },

  birdsEyeActive: false,
  hasPoster: false,

  initialize: function initialize(args) {

    // console.log(this.model.get('name'));

    this.space = args.space;
    this.oldId = args.oldId;
  },

  render: function render() {

    this.$el.addClass('ns-aw-container ns-image');
    this.$el.css({ 'width': this.model.get('size')[0] + 'px', 'height': this.model.get('size')[1] + 'px' });

    var compiledTemplate = artworkTemplate(this.model.attributes);
    this.$el.html(compiledTemplate);

    this.$img = this.$el.find('.ns-image__image');
    this.$poster = this.$el.find('.ns-image__poster');

    if (this.model.get('poster') && this.model.get('poster') != '' && this.model.get('poster') != '/posters/original/missing.png') {
      this.hasPoster = true;
      // this.$el.css({'background-image': 'url('+this.model.get('poster')+')'});
    } else {
        this.$img.css({ 'display': 'block', 'opacity': 1 });
      }
  },

  activate: function activate() {

    // console.log(this.model.get('name') + ' is active');

    this.$el.addClass('is-active');

    if (this.hasPoster) {
      this.$img.css({ 'display': 'block', 'opacity': 1 });
      this.$poster.css({ 'display': 'none' });
    }
  },

  deactivate: function deactivate() {

    // console.log(this.model.get('name') + ' is deactivated');

    this.$el.removeClass('is-active');

    if (this.hasPoster) {
      this.$poster.css({ 'display': 'block' });
      this.$img.css('display', 'none');
    }
  },

  handleClick: function handleClick(e) {
    // console.log('click');

    if (this.space.birdseyeActive) {
      this.space.showArtworkById(this.oldId, 2000);
    }
  },

  handleMouseOver: function handleMouseOver(e) {
    // console.log('mouse over');
    if (this.space.birdseyeActive) {
      this.$el.addClass('is-highlighted');
    }
  },

  handleMouseOut: function handleMouseOut(e) {
    // console.log('mouse out');
    if (this.space.birdseyeActive) {
      this.$el.removeClass('is-highlighted');
    }
  },

  loadAssets: function loadAssets(callback) {

    var url = this.model.get('image');

    if (url != '') {
      $('<img>').attr('src', url).load(function () {
        $(this).remove();
        callback();
      });
    } else {
      callback();
    }
  }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L3ZpZXdzL2FydHdvcmtzL2ltYWdlYXJ0d29yay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzlCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVmLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUV4QyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQzs7QUFFckUsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFcEMsUUFBTSxFQUFFO0FBQ04sV0FBTyxFQUFFLGFBQWE7QUFDdEIsZUFBVyxFQUFFLGlCQUFpQjtBQUM5QixjQUFVLEVBQUUsZ0JBQWdCO0dBQzdCOztBQUVELGdCQUFjLEVBQUUsS0FBSztBQUNyQixXQUFTLEVBQUUsS0FBSzs7QUFFaEIsWUFBVSxFQUFFLG9CQUFTLElBQUksRUFBRTs7OztBQUl6QixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDeEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0dBRXpCOztBQUVELFFBQU0sRUFBRSxrQkFBVzs7QUFFakIsUUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUM5QyxRQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FB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O0FBRWxDLFFBQUcsR0FBRyxJQUFJLEVBQUUsRUFBRTtBQUNaLE9BQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFXO0FBQzFDLFNBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNqQixnQkFBUSxFQUFFLENBQUM7T0FDWixDQUFDLENBQUM7S0FDSixNQUFJO0FBQ0gsY0FBUSxFQUFFLENBQUM7S0FDWjtHQUNGOztDQUVGLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvam9yaXMvU2l0ZXMvcGxheWdyb3VuZC9uczAyLW5ldmVybGFuZHNwYWNlL3Jlc291cmNlcy9hc3NldHMvanMvc3BhY2UvZGVmYXVsdC92aWV3cy9hcnR3b3Jrcy9pbWFnZWFydHdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuQmFja2JvbmUuJCA9ICQ7XG5cbnZhciBBcnR3b3JrID0gcmVxdWlyZSgnbW9kZWxzL2FydHdvcmsnKTtcblxudmFyIGFydHdvcmtUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9hcnR3b3Jrcy9pbWFnZWFydHdvcmsuaGJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gIGV2ZW50czoge1xuICAgICdjbGljayc6ICdoYW5kbGVDbGljaycsXG4gICAgJ21vdXNlb3Zlcic6ICdoYW5kbGVNb3VzZU92ZXInLFxuICAgICdtb3VzZW91dCc6ICdoYW5kbGVNb3VzZU91dCcsXG4gIH0sXG5cbiAgYmlyZHNFeWVBY3RpdmU6IGZhbHNlLFxuICBoYXNQb3N0ZXI6IGZhbHNlLFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGFyZ3MpIHtcblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMubW9kZWwuZ2V0KCduYW1lJykpO1xuXG4gICAgdGhpcy5zcGFjZSA9IGFyZ3Muc3BhY2U7XG4gICAgdGhpcy5vbGRJZCA9IGFyZ3Mub2xkSWQ7XG5cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ25zLWF3LWNvbnRhaW5lciBucy1pbWFnZScpO1xuICAgIHRoaXMuJGVsLmNzcyh7J3dpZHRoJzogdGhpcy5tb2RlbC5nZXQoJ3NpemUnKVswXSsncHgnLCAnaGVpZ2h0JzogdGhpcy5tb2RlbC5nZXQoJ3NpemUnKVsxXSsncHgnfSk7XG5cbiAgICB2YXIgY29tcGlsZWRUZW1wbGF0ZSA9IGFydHdvcmtUZW1wbGF0ZSh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMpO1xuICAgIHRoaXMuJGVsLmh0bWwoY29tcGlsZWRUZW1wbGF0ZSk7XG5cbiAgICB0aGlzLiRpbWcgPSB0aGlzLiRlbC5maW5kKCcubnMtaW1hZ2VfX2ltYWdlJyk7XG4gICAgdGhpcy4kcG9zdGVyID0gdGhpcy4kZWwuZmluZCgnLm5zLWltYWdlX19wb3N0ZXInKTtcblxuICAgIGlmKHRoaXMubW9kZWwuZ2V0KCdwb3N0ZXInKSAmJiB0aGlzLm1vZGVsLmdldCgncG9zdGVyJykgIT0gJycgJiYgdGhpcy5tb2RlbC5nZXQoJ3Bvc3RlcicpICE9ICcvcG9zdGVycy9vcmlnaW5hbC9taXNzaW5nLnBuZycpwqB7XG4gICAgICB0aGlzLmhhc1Bvc3RlciA9IHRydWU7XG4gICAgICAvLyB0aGlzLiRlbC5jc3MoeydiYWNrZ3JvdW5kLWltYWdlJzogJ3VybCgnK3RoaXMubW9kZWwuZ2V0KCdwb3N0ZXInKSsnKSd9KTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMuJGltZy5jc3MoeydkaXNwbGF5JzonYmxvY2snLCAnb3BhY2l0eSc6MX0pO1xuICAgIH1cbiAgfSxcblxuICBhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLm1vZGVsLmdldCgnbmFtZScpICsgJyBpcyBhY3RpdmUnKTtcblxuICAgIHRoaXMuJGVsLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgIGlmKHRoaXMuaGFzUG9zdGVyKSB7XG4gICAgICB0aGlzLiRpbWcuY3NzKHsnZGlzcGxheSc6J2Jsb2NrJywgJ29wYWNpdHknOjF9KTtcbiAgICAgIHRoaXMuJHBvc3Rlci5jc3MoeydkaXNwbGF5Jzonbm9uZSd9KTtcbiAgICB9XG5cbiAgfSxcblxuICBkZWFjdGl2YXRlOiBmdW5jdGlvbigpIHtcblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMubW9kZWwuZ2V0KCduYW1lJykgKyAnIGlzIGRlYWN0aXZhdGVkJyk7XG5cbiAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICBpZih0aGlzLmhhc1Bvc3RlcinCoHtcbiAgICAgIHRoaXMuJHBvc3Rlci5jc3MoeydkaXNwbGF5JzonYmxvY2snfSk7XG4gICAgICB0aGlzLiRpbWcuY3NzKCdkaXNwbGF5Jywnbm9uZScpO1xuICAgIH1cblxuICB9LFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ2NsaWNrJyk7XG5cbiAgICBpZih0aGlzLnNwYWNlLmJpcmRzZXllQWN0aXZlKSB7XG4gICAgICB0aGlzLnNwYWNlLnNob3dBcnR3b3JrQnlJZCh0aGlzLm9sZElkLCAyMDAwKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlTW91c2VPdmVyOiBmdW5jdGlvbihlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ21vdXNlIG92ZXInKTtcbiAgICBpZih0aGlzLnNwYWNlLmJpcmRzZXllQWN0aXZlKSB7XG4gICAgICB0aGlzLiRlbC5hZGRDbGFzcygnaXMtaGlnaGxpZ2h0ZWQnKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlTW91c2VPdXQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnbW91c2Ugb3V0Jyk7XG4gICAgaWYodGhpcy5zcGFjZS5iaXJkc2V5ZUFjdGl2ZSkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2hsaWdodGVkJyk7XG4gICAgfVxuICB9LFxuXG4gIGxvYWRBc3NldHM6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cbiAgICB2YXIgdXJsID0gdGhpcy5tb2RlbC5nZXQoJ2ltYWdlJyk7XG5cbiAgICBpZih1cmwgIT0gJycpIHtcbiAgICAgICQoJzxpbWc+JykuYXR0cignc3JjJywgdXJsKS5sb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG59KTsiXX0=
},{"backbone":2,"jquery":12,"models/artwork":18,"templates/artworks/imageartwork.hbs":20,"underscore":14}],28:[function(require,module,exports){
(function (global){
'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
global.jQuery = $;
global.$ = $;
var _ = require('underscore');
Backbone.$ = $;
var ThreeSixty = require('libs/threesixty.min');
ThreeSixty.$ = $;

var Artwork = require('models/artwork');

var artworkTemplate = require('templates/artworks/scrubartwork.hbs');

module.exports = Backbone.View.extend({

  images: [],
  frames: [],
  totalFrames: 0,

  events: {
    'click': 'handleClick',
    'mouseover': 'handleMouseOver',
    'mouseout': 'handleMouseOut'
  },

  initialize: function initialize(args) {

    this.images = new Array();
    this.frames = new Array();

    this.totalFrames = this.model.get('totalFrames');
    this.endFrame = this.totalFrames;

    this.$el.addClass('threesixty');

    // this.endFrame = -720;
    this.initializeFrames();

    this.space = args.space;
    this.oldId = args.oldId;
    this.$list = this.$el.find('.ns-scrub__list');
  },

  render: function render() {
    var size = this.model.get('size');

    this.$el.addClass('ns-aw-container ns-scrub').css({
      'width': size[0] + 'px',
      'height': size[1] + 'px'
    });
    if (this.model.get('poster') && this.model.get('poster') != '' && this.model.get('poster') != '/posters/original/missing.png') {
      this.$el.css('background-image', 'url(' + this.model.get('poster') + ')');
    }
    var compiledTemplate = artworkTemplate(this.model.attributes);
    this.$el.html(compiledTemplate);

    this.renderFrames();
  },

  activate: function activate() {

    // console.log(this.model.get('name') + ' is active');

    this.$el.addClass('is-active');
  },

  deactivate: function deactivate() {

    // console.log(this.model.get('name') + ' is deactivated');

    this.$el.removeClass('is-active');
  },

  handleMouseOver: function handleMouseOver(e) {
    // console.log('mouse over');
    if (this.space.birdseyeActive) {
      this.$el.addClass('is-highlighted');
    }
  },

  handleMouseOut: function handleMouseOut(e) {
    // console.log('mouse out');
    if (this.space.birdseyeActive) {
      this.$el.removeClass('is-highlighted');
    }
  },

  handleClick: function handleClick(e) {
    // console.log('click');

    if (this.space.birdseyeActive) {
      this.space.showArtworkById(this.oldId, 2000);
    }
  },

  loadAssets: function loadAssets(callback) {
    var self = this;
    self.loadCount = 0;

    $.each(this.images, function (k, v) {
      if (v != '') {
        $('<img>').attr('src', v).load(function () {
          $(this).remove();
          self.loadCount++;

          if (self.loadCount >= self.totalFrames) {
            callback();
          }
        });
      } else {
        self.loadCount++;

        if (self.loadCount >= self.totalFrames) {
          callback();
        }
      }
    });
  },

  initializeFrames: function initializeFrames() {

    var self = this;
    var url = this.model.get('url');

    for (var i = 0; i < this.totalFrames; i++) {
      var frameUrl = url.replace('__frame__', i + 1);
      self.images.push(frameUrl);
    }
  },

  renderFrames: function renderFrames() {
    var self = this;

    var url = this.model.get('url').replace('__frame__.jpg', '');
    var loop = this.model.get('loop') == 0 ? true : false;
    var size = this.model.get('size');

    this.treesixty = this.$el.ThreeSixty({
      totalFrames: self.totalFrames,
      endFrame: self.totalFrames,
      currentFrame: 1,
      imgList: '.ns-scrub__list',
      imagePath: url,
      ext: '.jpg',
      width: size[0],
      height: size[1],
      navigation: false,
      disableSpin: true,
      disableWrap: loop
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L3ZpZXdzL2FydHdvcmtzL3NjcnViYXJ0d29yay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzlCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDaEQsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWpCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUV4QyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQzs7QUFFckUsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFcEMsUUFBTSxFQUFFLEVBQUU7QUFDVixRQUFNLEVBQUUsRUFBRTtBQUNWLGFBQVcsRUFBRSxDQUFDOztBQUVkLFFBQU0sRUFBRTtBQUNOLFdBQU8sRUFBRSxhQUFhO0FBQ3RCLGVBQVcsRUFBRSxpQkFBaUI7QUFDOUIsY0FBVSxFQUFFLGdCQUFnQjtHQUM3Qjs7QUFFRCxZQUFVLEVBQUUsb0JBQVMsSUFBSSxFQUFFOztBQUV6QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDMUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDOztBQUUxQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2pELFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzs7QUFFakMsUUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7OztBQUdoQyxRQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN4QixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7R0FFL0M7O0FBRUQsUUFBTSxFQUFFLGtCQUFXO0FBQ2pCLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVsQyxRQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUNoRCxhQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUk7QUFDdkIsY0FBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJO0tBQ3pCLENBQUMsQ0FBQztBQUNILFFBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLCtCQUErQixFQUFFO0FBQzVILFVBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQTtLQUN0RTtBQUNELFFBQUksZ0JBQWdCLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDOUQsUUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFaEMsUUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0dBRXJCOztBQUVELFVBQVEsRUFBRSxvQkFBVzs7OztBQUluQixRQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztHQUdoQzs7QUFFRCxZQUFVLEVBQUUsc0JBQVc7Ozs7QUFJckIsUUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7R0FFbkM7O0FBRUQsaUJBQWUsRUFBRSx5QkFBUyxDQUFDLEVBQUU7O0FBRTNCLFFBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUU7QUFDNUIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUNyQztHQUNGOztBQUVELGdCQUFjLEVBQUUsd0JBQVMsQ0FBQyxFQUFFOztBQUUxQixRQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFO0FBQzVCLFVBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDeEM7R0FDRjs7QUFFRCxhQUFXLEVBQUUscUJBQVMsQ0FBQyxFQUFFOzs7QUFHdkIsUUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRTtBQUM1QixVQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzlDO0dBQ0Y7O0FBRUQsWUFBVSxFQUFFLG9CQUFTLFFBQVEsRUFBRTtBQUM3QixRQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7O0FBRW5CLEtBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDakMsVUFBRyxDQUFDLElBQUksRUFBRSxFQUFFO0FBQ1YsU0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDeEMsV0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2pCLGNBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFakIsY0FBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDdEMsb0JBQVEsRUFBRSxDQUFDO1dBQ1o7U0FDRixDQUFDLENBQUM7T0FDSixNQUFJO0FBQ0gsWUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVqQixZQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUN0QyxrQkFBUSxFQUFFLENBQUM7U0FDWjtPQUNGO0tBQ0YsQ0FBQyxDQUFDO0dBRUo7O0FBRUQsa0JBQWdCLEVBQUUsNEJBQVc7O0FBRTNCLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixRQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFaEMsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekMsVUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzVCO0dBRUY7O0FBRUQsY0FBWSxFQUFFLHdCQUFXO0FBQ3ZCLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsUUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM3RCxRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztBQUN0RCxRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFbEMsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztBQUNuQyxpQkFBVyxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQzdCLGNBQVEsRUFBRSxJQUFJLENBQUMsV0FBVztBQUMxQixrQkFBWSxFQUFFLENBQUM7QUFDZixhQUFPLEVBQUUsaUJBQWlCO0FBQzFCLGVBQVMsRUFBRSxHQUFHO0FBQ2QsU0FBRyxFQUFFLE1BQU07QUFDWCxXQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNkLFlBQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2YsZ0JBQVUsRUFBRSxLQUFLO0FBQ2pCLGlCQUFXLEVBQUUsSUFBSTtBQUNqQixpQkFBVyxFQUFFLElBQUk7S0FDbEIsQ0FBQyxDQUFDO0dBQ0o7O0NBRUYsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbmdsb2JhbC5qUXVlcnkgPSAkO1xuZ2xvYmFsLiQgPSAkO1xudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5CYWNrYm9uZS4kID0gJDtcbnZhciBUaHJlZVNpeHR5ID0gcmVxdWlyZSgnbGlicy90aHJlZXNpeHR5Lm1pbicpO1xuVGhyZWVTaXh0eS4kID0gJDtcblxudmFyIEFydHdvcmsgPSByZXF1aXJlKCdtb2RlbHMvYXJ0d29yaycpO1xuXG52YXIgYXJ0d29ya1RlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL2FydHdvcmtzL3NjcnViYXJ0d29yay5oYnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgaW1hZ2VzOiBbXSxcbiAgZnJhbWVzOiBbXSxcbiAgdG90YWxGcmFtZXM6IDAsXG5cbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrJzogJ2hhbmRsZUNsaWNrJyxcbiAgICAnbW91c2VvdmVyJzogJ2hhbmRsZU1vdXNlT3ZlcicsXG4gICAgJ21vdXNlb3V0JzogJ2hhbmRsZU1vdXNlT3V0JyxcbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbihhcmdzKSB7XG5cbiAgICB0aGlzLmltYWdlcyA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMuZnJhbWVzID0gbmV3IEFycmF5KCk7XG5cbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gdGhpcy5tb2RlbC5nZXQoJ3RvdGFsRnJhbWVzJyk7XG4gICAgdGhpcy5lbmRGcmFtZSA9IHRoaXMudG90YWxGcmFtZXM7XG5cbiAgICB0aGlzLiRlbC5hZGRDbGFzcygndGhyZWVzaXh0eScpO1xuXG4gICAgLy8gdGhpcy5lbmRGcmFtZSA9IC03MjA7XG4gICAgdGhpcy5pbml0aWFsaXplRnJhbWVzKCk7XG5cbiAgICB0aGlzLnNwYWNlID0gYXJncy5zcGFjZTtcbiAgICB0aGlzLm9sZElkID0gYXJncy5vbGRJZDtcbiAgICB0aGlzLiRsaXN0ID0gdGhpcy4kZWwuZmluZCgnLm5zLXNjcnViX19saXN0Jyk7XG5cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzaXplID0gdGhpcy5tb2RlbC5nZXQoJ3NpemUnKTtcblxuICAgIHRoaXMuJGVsLmFkZENsYXNzKCducy1hdy1jb250YWluZXIgbnMtc2NydWInKS5jc3Moe1xuICAgICAgJ3dpZHRoJzogc2l6ZVswXSArICdweCcsXG4gICAgICAnaGVpZ2h0Jzogc2l6ZVsxXSArICdweCdcbiAgICB9KTtcbiAgICBpZih0aGlzLm1vZGVsLmdldCgncG9zdGVyJykgJiYgdGhpcy5tb2RlbC5nZXQoJ3Bvc3RlcicpICE9ICcnICYmIHRoaXMubW9kZWwuZ2V0KCdwb3N0ZXInKSAhPSAnL3Bvc3RlcnMvb3JpZ2luYWwvbWlzc2luZy5wbmcnKcKge1xuICAgICAgdGhpcy4kZWwuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnK3RoaXMubW9kZWwuZ2V0KCdwb3N0ZXInKSsnKScpXG4gICAgfVxuICAgIHZhciBjb21waWxlZFRlbXBsYXRlID0gYXJ0d29ya1RlbXBsYXRlKHRoaXMubW9kZWwuYXR0cmlidXRlcyk7XG4gICAgdGhpcy4kZWwuaHRtbChjb21waWxlZFRlbXBsYXRlKTtcblxuICAgIHRoaXMucmVuZGVyRnJhbWVzKCk7XG5cbiAgfSxcblxuICBhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLm1vZGVsLmdldCgnbmFtZScpICsgJyBpcyBhY3RpdmUnKTtcblxuICAgIHRoaXMuJGVsLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuXG4gIH0sXG5cbiAgZGVhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLm1vZGVsLmdldCgnbmFtZScpICsgJyBpcyBkZWFjdGl2YXRlZCcpO1xuXG4gICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG4gIH0sXG5cbiAgaGFuZGxlTW91c2VPdmVyOiBmdW5jdGlvbihlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ21vdXNlIG92ZXInKTtcbiAgICBpZih0aGlzLnNwYWNlLmJpcmRzZXllQWN0aXZlKSB7XG4gICAgICB0aGlzLiRlbC5hZGRDbGFzcygnaXMtaGlnaGxpZ2h0ZWQnKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlTW91c2VPdXQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnbW91c2Ugb3V0Jyk7XG4gICAgaWYodGhpcy5zcGFjZS5iaXJkc2V5ZUFjdGl2ZSkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2hsaWdodGVkJyk7XG4gICAgfVxuICB9LFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ2NsaWNrJyk7XG5cbiAgICBpZih0aGlzLnNwYWNlLmJpcmRzZXllQWN0aXZlKSB7XG4gICAgICB0aGlzLnNwYWNlLnNob3dBcnR3b3JrQnlJZCh0aGlzLm9sZElkLCAyMDAwKTtcbiAgICB9XG4gIH0sXG5cbiAgbG9hZEFzc2V0czogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5sb2FkQ291bnQgPSAwO1xuXG4gICAgJC5lYWNoKHRoaXMuaW1hZ2VzLCBmdW5jdGlvbihrLCB2KSB7XG4gICAgICBpZih2ICE9ICcnKSB7ICAgICAgXG4gICAgICAgICQoJzxpbWc+JykuYXR0cignc3JjJywgdikubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICAgIHNlbGYubG9hZENvdW50Kys7XG5cbiAgICAgICAgICBpZiAoc2VsZi5sb2FkQ291bnQgPj0gc2VsZi50b3RhbEZyYW1lcykge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHNlbGYubG9hZENvdW50Kys7XG5cbiAgICAgICAgaWYgKHNlbGYubG9hZENvdW50ID49IHNlbGYudG90YWxGcmFtZXMpIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfSxcblxuICBpbml0aWFsaXplRnJhbWVzOiBmdW5jdGlvbigpIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgdXJsID0gdGhpcy5tb2RlbC5nZXQoJ3VybCcpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvdGFsRnJhbWVzOyBpKyspIHtcbiAgICAgIHZhciBmcmFtZVVybCA9IHVybC5yZXBsYWNlKCdfX2ZyYW1lX18nLCBpICsgMSk7XG4gICAgICBzZWxmLmltYWdlcy5wdXNoKGZyYW1lVXJsKTtcbiAgICB9XG5cbiAgfSxcblxuICByZW5kZXJGcmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciB1cmwgPSB0aGlzLm1vZGVsLmdldCgndXJsJykucmVwbGFjZSgnX19mcmFtZV9fLmpwZycsICcnKTtcbiAgICB2YXIgbG9vcCA9IHRoaXMubW9kZWwuZ2V0KCdsb29wJykgPT0gMCA/IHRydWUgOiBmYWxzZTtcbiAgICB2YXIgc2l6ZSA9IHRoaXMubW9kZWwuZ2V0KCdzaXplJyk7XG5cbiAgICB0aGlzLnRyZWVzaXh0eSA9IHRoaXMuJGVsLlRocmVlU2l4dHkoe1xuICAgICAgdG90YWxGcmFtZXM6IHNlbGYudG90YWxGcmFtZXMsXG4gICAgICBlbmRGcmFtZTogc2VsZi50b3RhbEZyYW1lcyxcbiAgICAgIGN1cnJlbnRGcmFtZTogMSxcbiAgICAgIGltZ0xpc3Q6ICcubnMtc2NydWJfX2xpc3QnLFxuICAgICAgaW1hZ2VQYXRoOiB1cmwsXG4gICAgICBleHQ6ICcuanBnJyxcbiAgICAgIHdpZHRoOiBzaXplWzBdLFxuICAgICAgaGVpZ2h0OiBzaXplWzFdLFxuICAgICAgbmF2aWdhdGlvbjogZmFsc2UsXG4gICAgICBkaXNhYmxlU3BpbjogdHJ1ZSxcbiAgICAgIGRpc2FibGVXcmFwOiBsb29wXG4gICAgfSk7XG4gIH1cblxufSk7Il19
},{"backbone":2,"jquery":12,"libs/threesixty.min":17,"models/artwork":18,"templates/artworks/scrubartwork.hbs":21,"underscore":14}],29:[function(require,module,exports){
'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
Backbone.$ = $;

var Artwork = require('models/artwork');

var artworkTemplate = require('templates/artworks/videoartwork.hbs');

module.exports = Backbone.View.extend({

  events: {
    'click': 'handleClick',
    'mouseover': 'handleMouseOver',
    'mouseout': 'handleMouseOut'
  },

  initialize: function initialize(args) {

    // console.log(this.model.get('name'));
    this.space = args.space;
    this.oldId = args.oldId;
  },

  render: function render() {
    if (!this.model.get('size')[0]) this.model.set('size', [1280, this.model.get('size')[1]]);
    if (!this.model.get('size')[1]) this.model.set('size', [this.model.get('size')[0], 720]);

    this.$el.addClass('ns-aw-container ns-video');
    var compiledTemplate = artworkTemplate(this.model.attributes);
    this.$el.html(compiledTemplate);

    this.$player = this.$el.find('.vid-player');
    this.player = this.$player[0];
    this.$container = this.$el.find('.vid-container');
  },

  activate: function activate() {

    // console.log(this.model.get('name') + ' is active');

    this.$el.addClass('is-active');

    this.$player.css({ 'display': 'block', 'opacity': 0 }).transition({ 'opacity': 1 }, 1000);

    if (this.model.get('autoplay')) {
      this.player.play();
    }
  },

  deactivate: function deactivate() {

    // console.log(this.model.get('name') + ' is deactivated');

    this.player.pause();

    this.$el.removeClass('is-active');
    this.$el.find('.vid-player').transition({ 'opacity': 0 }, 1000).queue(function () {
      $(this).css('display', 'none').dequeue();
    });
  },

  handleClick: function handleClick(e) {
    // console.log('click');

    if (this.space.birdseyeActive) {
      e.preventDefault();
      this.space.showArtworkById(this.oldId, 2000);
    }
  },

  handleMouseOver: function handleMouseOver(e) {
    // console.log('mouse over');
    if (this.space.birdseyeActive) {
      this.$el.addClass('is-highlighted');
    }
  },

  handleMouseOut: function handleMouseOut(e) {
    // console.log('mouse out');
    if (this.space.birdseyeActive) {
      this.$el.removeClass('is-highlighted');
    }
  },

  loadAssets: function loadAssets(callback) {
    var url = this.model.get('image');

    if (url != '') {
      $('<img>').attr('src', url).load(function () {
        $(this).remove();
        callback();
      });
    } else {
      callback();
    }
  }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L3ZpZXdzL2FydHdvcmtzL3ZpZGVvYXJ0d29yay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzlCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVmLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUV4QyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQzs7QUFFckUsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFcEMsUUFBTSxFQUFFO0FBQ04sV0FBTyxFQUFFLGFBQWE7QUFDdEIsZUFBVyxFQUFFLGlCQUFpQjtBQUM5QixjQUFVLEVBQUUsZ0JBQWdCO0dBQzdCOztBQUVELFlBQVUsRUFBRSxvQkFBUyxJQUFJLEVBQUU7OztBQUd6QixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDeEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0dBRXpCOztBQUVELFFBQU0sRUFBRSxrQkFBVztBQUNqQixRQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1B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N0IsUUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRWxDLFFBQUcsR0FBRyxJQUFJLEVBQUUsRUFBRTtBQUNaLE9BQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFXO0FBQzFDLFNBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNqQixnQkFBUSxFQUFFLENBQUM7T0FDWixDQUFDLENBQUM7S0FDSixNQUFJO0FBQ0gsY0FBUSxFQUFFLENBQUM7S0FDWjtHQUVGOztDQUVGLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvam9yaXMvU2l0ZXMvcGxheWdyb3VuZC9uczAyLW5ldmVybGFuZHNwYWNlL3Jlc291cmNlcy9hc3NldHMvanMvc3BhY2UvZGVmYXVsdC92aWV3cy9hcnR3b3Jrcy92aWRlb2FydHdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuQmFja2JvbmUuJCA9ICQ7XG5cbnZhciBBcnR3b3JrID0gcmVxdWlyZSgnbW9kZWxzL2FydHdvcmsnKTtcblxudmFyIGFydHdvcmtUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9hcnR3b3Jrcy92aWRlb2FydHdvcmsuaGJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gIGV2ZW50czoge1xuICAgICdjbGljayc6ICdoYW5kbGVDbGljaycsXG4gICAgJ21vdXNlb3Zlcic6ICdoYW5kbGVNb3VzZU92ZXInLFxuICAgICdtb3VzZW91dCc6ICdoYW5kbGVNb3VzZU91dCcsXG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oYXJncykge1xuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5tb2RlbC5nZXQoJ25hbWUnKSk7XG4gICAgdGhpcy5zcGFjZSA9IGFyZ3Muc3BhY2U7XG4gICAgdGhpcy5vbGRJZCA9IGFyZ3Mub2xkSWQ7XG5cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIGlmKCF0aGlzLm1vZGVsLmdldCgnc2l6ZScpWzBdKSB0aGlzLm1vZGVsLnNldCgnc2l6ZScsIFsxMjgwLCB0aGlzLm1vZGVsLmdldCgnc2l6ZScpWzFdXSlcbiAgICBpZighdGhpcy5tb2RlbC5nZXQoJ3NpemUnKVsxXSkgdGhpcy5tb2RlbC5zZXQoJ3NpemUnLCBbdGhpcy5tb2RlbC5nZXQoJ3NpemUnKVswXSwgNzIwXSlcblxuICAgIHRoaXMuJGVsLmFkZENsYXNzKCducy1hdy1jb250YWluZXIgbnMtdmlkZW8nKTtcbiAgICB2YXIgY29tcGlsZWRUZW1wbGF0ZSA9IGFydHdvcmtUZW1wbGF0ZSh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMpO1xuICAgIHRoaXMuJGVsLmh0bWwoY29tcGlsZWRUZW1wbGF0ZSk7XG5cbiAgICB0aGlzLiRwbGF5ZXIgPSB0aGlzLiRlbC5maW5kKCcudmlkLXBsYXllcicpO1xuICAgIHRoaXMucGxheWVyID0gdGhpcy4kcGxheWVyWzBdO1xuICAgIHRoaXMuJGNvbnRhaW5lciA9IHRoaXMuJGVsLmZpbmQoJy52aWQtY29udGFpbmVyJyk7XG5cbiAgfSxcblxuICBhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLm1vZGVsLmdldCgnbmFtZScpICsgJyBpcyBhY3RpdmUnKTtcblxuICAgIHRoaXMuJGVsLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgIHRoaXMuJHBsYXllci5jc3MoeydkaXNwbGF5JzonYmxvY2snLCAnb3BhY2l0eSc6MH0pLnRyYW5zaXRpb24oeydvcGFjaXR5JzoxfSwxMDAwKTtcblxuICAgIGlmKHRoaXMubW9kZWwuZ2V0KCdhdXRvcGxheScpKSB7XG4gICAgICB0aGlzLnBsYXllci5wbGF5KCk7XG4gICAgfVxuICAgIFxuICB9LFxuXG4gIGRlYWN0aXZhdGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5tb2RlbC5nZXQoJ25hbWUnKSArICcgaXMgZGVhY3RpdmF0ZWQnKTtcblxuICAgIHRoaXMucGxheWVyLnBhdXNlKCk7XG5cbiAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgdGhpcy4kZWwuZmluZCgnLnZpZC1wbGF5ZXInKS50cmFuc2l0aW9uKHsnb3BhY2l0eSc6MH0sMTAwMCkucXVldWUoZnVuY3Rpb24oKXtcbiAgICAgICQodGhpcykuY3NzKCdkaXNwbGF5Jywnbm9uZScpLmRlcXVldWUoKTtcbiAgICB9KTtcblxuICB9LFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ2NsaWNrJyk7XG5cbiAgICBpZih0aGlzLnNwYWNlLmJpcmRzZXllQWN0aXZlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnNwYWNlLnNob3dBcnR3b3JrQnlJZCh0aGlzLm9sZElkLCAyMDAwKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlTW91c2VPdmVyOiBmdW5jdGlvbihlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ21vdXNlIG92ZXInKTtcbiAgICBpZih0aGlzLnNwYWNlLmJpcmRzZXllQWN0aXZlKSB7XG4gICAgICB0aGlzLiRlbC5hZGRDbGFzcygnaXMtaGlnaGxpZ2h0ZWQnKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlTW91c2VPdXQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnbW91c2Ugb3V0Jyk7XG4gICAgaWYodGhpcy5zcGFjZS5iaXJkc2V5ZUFjdGl2ZSkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2hsaWdodGVkJyk7XG4gICAgfVxuICB9LFxuXG4gIGxvYWRBc3NldHM6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdmFyIHVybCA9IHRoaXMubW9kZWwuZ2V0KCdpbWFnZScpO1xuXG4gICAgaWYodXJsICE9ICcnKSB7XG4gICAgICAkKCc8aW1nPicpLmF0dHIoJ3NyYycsIHVybCkubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH1lbHNle1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG5cbiAgfVxuXG59KTsiXX0=
},{"backbone":2,"jquery":12,"models/artwork":18,"templates/artworks/videoartwork.hbs":22,"underscore":14}],30:[function(require,module,exports){
'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var transit = require('jquery.transit');
Backbone.$ = $;

var endTemplate = require('templates/endslide.hbs');

module.exports = Backbone.View.extend({

  isActive: false,

  events: {
    'click .js-rewind': 'rewindExhibition',
    'click .js-back': 'backToLast'
  },

  initialize: function initialize(options, space) {
    var self = this;
    this.space = space;
    this.render();
    // this.setElement(options.el);
  },

  render: function render() {
    var self = this;

    var compiledTemplate = endTemplate({
      suggestions: window.suggestions,
      url: window.exhibition.url
    });
    this.$el.append(compiledTemplate);
    this.hide();
    // this.$el.find('.js-rewind').click(this.rewindExhibition);
  },

  hide: function hide() {
    var self = this;

    this.isActive = false;
    // this.$el.removeClass('is-visible');
    this.$el.transition({ 'opacity': 0 }, 700, function () {
      self.$el.css('display', 'none');
    });
  },

  show: function show() {
    this.isActive = true;
    // this.$el.addClass('is-visible');
    this.$el.css({ 'display': 'block', 'opacity': 0 }).transition({ 'opacity': 1 }, 1000);

    this.$el.find('.exhibitions__item').each(function (k, v) {
      var $item = $(v);
      $item.css({ 'opacity': 0, 'scale': '1.2' }).delay(k * 250 + 500).transition({ 'opacity': 1, 'scale': 1 }, 1000);
    });
  },

  rewindExhibition: function rewindExhibition(e) {
    if (e) e.preventDefault();

    this.space.showArtwork(this.space.artworkViews[0], 3000);
    this.space.threejsView.tweenFov(75, 1500);
    this.hide();
  },

  backToLast: function backToLast(e) {
    if (e) e.preventDefault();

    this.space.showArtworkById(this.space.artworkViews.length - 1, 3000);
    this.space.threejsView.tweenFov(75, 1500);
    this.hide();
  }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L3ZpZXdzL2VuZHNsaWRldmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzlCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVmLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOztBQUVwRCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUVwQyxVQUFRLEVBQUUsS0FBSzs7QUFFZixRQUFNLEVBQUU7QUFDTixzQkFBa0IsRUFBRSxrQkFBa0I7QUFDdEMsb0JBQWdCLEVBQUUsWUFBWTtHQUMvQjs7QUFFRCxZQUFVLEVBQUUsb0JBQVMsT0FBTyxFQUFFLEtBQUssRUFBRTtBQUNuQyxRQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOztHQUVmOztBQUVELFFBQU0sRUFBRSxrQkFBVztBQUNqQixRQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWhCLFFBQUksZ0JBQWdCLEdBQUcsV0FBVyxDQUFDO0FBQ2pDLGlCQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVc7QUFDL0IsU0FBRyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRztLQUMzQixDQUFDLENBQUM7QUFDSCxRQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2xDLFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7R0FFYjs7QUFFRCxNQUFJLEVBQUUsZ0JBQVc7QUFDZixRQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDOztBQUV0QixRQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFDLFNBQVMsRUFBQyxDQUFDLEVBQUMsRUFBRSxHQUFHLEVBQUUsWUFBVztBQUNqRCxVQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDakMsQ0FBQyxDQUFDO0dBQ0o7O0FBRUQsTUFBSSxFQUFFLGdCQUFXO0FBQ2YsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBQyxTQUFTLEVBQUMsQ0FBQyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRWpGLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsQ0FBQyxFQUFDLENBQUMsRUFBRTtBQUNyRCxVQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsV0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUMsU0FBUyxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDekcsQ0FBQyxDQUFDO0dBQ0o7O0FBRUQsa0JBQWdCLEVBQUUsMEJBQVMsQ0FBQyxFQUFFO0FBQzVCLFFBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekQsUUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMxQyxRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDYjs7QUFFRCxZQUFVLEVBQUUsb0JBQVMsQ0FBQyxFQUFFO0FBQ3RCLFFBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuRSxRQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFDLFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNiOztDQUVGLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvam9yaXMvU2l0ZXMvcGxheWdyb3VuZC9uczAyLW5ldmVybGFuZHNwYWNlL3Jlc291cmNlcy9hc3NldHMvanMvc3BhY2UvZGVmYXVsdC92aWV3cy9lbmRzbGlkZXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIHRyYW5zaXQgPSByZXF1aXJlKCdqcXVlcnkudHJhbnNpdCcpO1xuQmFja2JvbmUuJCA9ICQ7XG5cbnZhciBlbmRUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9lbmRzbGlkZS5oYnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgaXNBY3RpdmU6IGZhbHNlLFxuXG4gIGV2ZW50czoge1xuICAgICdjbGljayAuanMtcmV3aW5kJzogJ3Jld2luZEV4aGliaXRpb24nLFxuICAgICdjbGljayAuanMtYmFjayc6ICdiYWNrVG9MYXN0J1xuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMsIHNwYWNlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuc3BhY2UgPSBzcGFjZTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIC8vIHRoaXMuc2V0RWxlbWVudChvcHRpb25zLmVsKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBjb21waWxlZFRlbXBsYXRlID0gZW5kVGVtcGxhdGUoe1xuICAgICAgc3VnZ2VzdGlvbnM6IHdpbmRvdy5zdWdnZXN0aW9ucyxcbiAgICAgIHVybDogd2luZG93LmV4aGliaXRpb24udXJsXG4gICAgfSk7XG4gICAgdGhpcy4kZWwuYXBwZW5kKGNvbXBpbGVkVGVtcGxhdGUpO1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIC8vIHRoaXMuJGVsLmZpbmQoJy5qcy1yZXdpbmQnKS5jbGljayh0aGlzLnJld2luZEV4aGliaXRpb24pO1xuICB9LFxuXG4gIGhpZGU6IGZ1bmN0aW9uKCnCoHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgLy8gdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2lzLXZpc2libGUnKTtcbiAgICB0aGlzLiRlbC50cmFuc2l0aW9uKHsnb3BhY2l0eSc6MH0sIDcwMCwgZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLiRlbC5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIH0pO1xuICB9LFxuXG4gIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuICAgIC8vIHRoaXMuJGVsLmFkZENsYXNzKCdpcy12aXNpYmxlJyk7XG4gICAgdGhpcy4kZWwuY3NzKHsnZGlzcGxheSc6ICdibG9jaycsICdvcGFjaXR5JzogMH0pLnRyYW5zaXRpb24oeydvcGFjaXR5JzoxfSwgMTAwMCk7XG5cbiAgICB0aGlzLiRlbC5maW5kKCcuZXhoaWJpdGlvbnNfX2l0ZW0nKS5lYWNoKGZ1bmN0aW9uKGssdikge1xuICAgICAgdmFyICRpdGVtID0gJCh2KTtcbiAgICAgICRpdGVtLmNzcyh7J29wYWNpdHknOiAwLCAnc2NhbGUnOiAnMS4yJ30pLmRlbGF5KGsqMjUwICsgNTAwKS50cmFuc2l0aW9uKHsnb3BhY2l0eSc6MSwgJ3NjYWxlJzoxfSwgMTAwMCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgcmV3aW5kRXhoaWJpdGlvbjogZnVuY3Rpb24oZSkge1xuICAgIGlmKGUpIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHRoaXMuc3BhY2Uuc2hvd0FydHdvcmsodGhpcy5zcGFjZS5hcnR3b3JrVmlld3NbMF0sIDMwMDApO1xuICAgIHRoaXMuc3BhY2UudGhyZWVqc1ZpZXcudHdlZW5Gb3YoNzUsIDE1MDApO1xuICAgIHRoaXMuaGlkZSgpO1xuICB9LFxuXG4gIGJhY2tUb0xhc3Q6IGZ1bmN0aW9uKGUpIHtcbiAgICBpZihlKSBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB0aGlzLnNwYWNlLnNob3dBcnR3b3JrQnlJZCh0aGlzLnNwYWNlLmFydHdvcmtWaWV3cy5sZW5ndGgtMSwgMzAwMCk7XG4gICAgdGhpcy5zcGFjZS50aHJlZWpzVmlldy50d2VlbkZvdig3NSwgMTUwMCk7XG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxufSk7Il19
},{"backbone":2,"jquery":12,"jquery.transit":11,"templates/endslide.hbs":23,"underscore":14}],31:[function(require,module,exports){
'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var transit = require('jquery.transit');
Backbone.$ = $;

var ArtworkCollection = require('collections/artworks');
var Artwork = require('models/artwork');
var SpaceView = require('views/spaceview');

var homeTemplate = require('templates/home.hbs');

module.exports = Backbone.View.extend({

  el: $(".content-wrap"),
  json: document.URL,

  events: {
    'click .js-enterspace': 'enterSpace'
  },

  initialize: function initialize() {

    var self = this;

    this.loadData();
  },

  loadData: function loadData() {
    var self = this;

    //var data = JSON.parse(window.exhibition_data);

    //$.getJSON(this.json, function(data) {
    //
    //  window.exhibition = data.exhibition;
    //  window.suggestions = data.suggestions;

    // console.log(data.exhibition);

    //var exhibition = JSON.parse(window.exhibition);
    //window.suggestions = JSON.parse(window.suggestions);

    self.setArtworks(window.exhibition.artworks);
    self.spaceView = new SpaceView(self.artworks);
    self.render();

    //});
  },

  render: function render() {

    var desc = window.exhibition.description.replace(/(?:\r\n|\r|\n)/g, '<br>');

    var compiledTemplate = homeTemplate({
      name: window.exhibition.title,
      artist: window.exhibition.artist,
      description: desc,
      preview: window.exhibition.preview
    });
    this.$el.html(compiledTemplate);
    this.$el.find('.home-content').addClass('is-visible');

    this.loadAssets(function () {
      $('.homewrap__enterbtn').html('Enter Exhibition').addClass('is-visible');
    });

    $('.homewrap__content h1').css({ y: '50px', opacity: 0 }).transition({ y: 0, opacity: 1 }, 1500, 'ease-out');
    $('.homewrap__artist').css({ y: '70px', opacity: 0 }).transition({ y: 0, opacity: 1 }, 1500, 'ease-out');
    $('.homewrap__content p').css({ y: '90px', opacity: 0 }).transition({ y: 0, opacity: 1 }, 1500, 'ease-out');

    // var isMobile = false;
    // (function(a) {
    //   if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) isMobile = true
    // })(navigator.userAgent || navigator.vendor || window.opera);

    // if (isMobile) {
    //   $('body').addClass('mobile');
    // }

    // $('.js-hideMobileAlert').click(function(e)  {
    //   e.preventDefault();
    //   $('.mobile-alert').fadeOut(200);
    // })

    // this.enterSpace();
  },

  setArtworks: function setArtworks(artworks) {

    var self = this;

    this.artworks = new ArtworkCollection();

    _.each(artworks, function (a) {

      var artwork = new Artwork(a);
      self.artworks.add(artwork);
    });
  },

  loadAssets: function loadAssets(callback) {
    var self = this;
    $('.homewrap__enterbtn').html('Loading Artworks');

    this.spaceView.preload(function () {
      callback();
    }, function (a, b) {
      $('.homewrap__enterbtn').html('Loading Artwork ' + a + ' / ' + b);
    });

    $('<img>').attr('src', window.exhibition.preview).load(function () {
      window.setTimeout(function () {
        $('.home__background').addClass('is-visible');
      }, 100);
    });
  },

  enterSpace: function enterSpace(e) {
    if (e) e.preventDefault();

    var self = this;

    $('.homewrap').transition({ scale: 2, opacity: 0 }, 1000, function () {
      $('.homewrap').remove();
    });

    self.spaceView.render();
  }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L3ZpZXdzL2hvbWV2aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDOUIsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWYsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUN4RCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4QyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFM0MsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRWpELE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7O0FBRXBDLElBQUUsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDO0FBQ3RCLE1BQUksRUFBRSxRQUFRLENBQUMsR0FBRzs7QUFFbEIsUUFBTSxFQUFFO0FBQ04sMEJBQXNCLEVBQUUsWUFBWTtHQUNyQzs7QUFFRCxZQUFVLEVBQUUsc0JBQVc7O0FBRXJCLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBRWpCOztBQUVELFVBQVEsRUFBRSxvQkFBVztBQUNuQixRQUFJLElBQUksR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBY2QsUUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLFFBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7O0dBR2pCOztBQUVELFFBQU0sRUFBRSxrQkFBVzs7QUFFakIsUUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUU1RSxRQUFJLGdCQUFnQixHQUFHLFlBQVksQ0FBQztBQUNsQyxVQUFJLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLO0FBQzdCLFlBQU0sRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU07QUFDaEMsaUJBQVcsRUFBRSxJQUFJO0FBQ2pCLGFBQU8sRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU87S0FDbkMsQ0FBQyxDQUFDO0FBQ0gsUUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNoQyxRQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRXRELFFBQUksQ0FBQyxVQUFVLENBQUMsWUFBVTtBQUN4QixPQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDMUUsQ0FBQyxDQUFDOztBQUVILEtBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxFQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3JHLEtBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxFQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2pHLEtBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxFQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCckc7O0FBRUQsYUFBVyxFQUFFLHFCQUFTLFFBQVEsRUFBRTs7QUFFOUIsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQzs7QUFFeEMsS0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBUyxDQUFDLEVBQUU7O0FBRTNCLFVBQUksT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLFVBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBRTVCLENBQUMsQ0FBQztHQUVKOztBQUVELFlBQVUsRUFBRSxvQkFBUyxRQUFRLEVBQUU7QUFDN0IsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLEtBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUVsRCxRQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFVO0FBQy9CLGNBQVEsRUFBRSxDQUFDO0tBQ1osRUFBRSxVQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEIsT0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDbkUsQ0FBQyxDQUFDOztBQUVILEtBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDaEUsWUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFVO0FBQzFCLFNBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUMvQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ1QsQ0FBQyxDQUFDO0dBRUo7O0FBRUQsWUFBVSxFQUFFLG9CQUFTLENBQUMsRUFBRTtBQUN0QixRQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRXpCLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsS0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsRUFBQyxFQUFFLElBQUksRUFBRSxZQUFXO0FBQy9ELE9BQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUN6QixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztHQUV6Qjs7Q0FFRixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2pvcmlzL1NpdGVzL3BsYXlncm91bmQvbnMwMi1uZXZlcmxhbmRzcGFjZS9yZXNvdXJjZXMvYXNzZXRzL2pzL3NwYWNlL2RlZmF1bHQvdmlld3MvaG9tZXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIHRyYW5zaXQgPSByZXF1aXJlKCdqcXVlcnkudHJhbnNpdCcpO1xuQmFja2JvbmUuJCA9ICQ7XG5cbnZhciBBcnR3b3JrQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2NvbGxlY3Rpb25zL2FydHdvcmtzJyk7XG52YXIgQXJ0d29yayA9IHJlcXVpcmUoJ21vZGVscy9hcnR3b3JrJyk7XG52YXIgU3BhY2VWaWV3ID0gcmVxdWlyZSgndmlld3Mvc3BhY2V2aWV3Jyk7XG5cbnZhciBob21lVGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvaG9tZS5oYnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgZWw6ICQoXCIuY29udGVudC13cmFwXCIpLFxuICBqc29uOiBkb2N1bWVudC5VUkwsXG5cbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIC5qcy1lbnRlcnNwYWNlJzogJ2VudGVyU3BhY2UnXG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLmxvYWREYXRhKCk7XG5cbiAgfSxcblxuICBsb2FkRGF0YTogZnVuY3Rpb24oKcKge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vdmFyIGRhdGEgPSBKU09OLnBhcnNlKHdpbmRvdy5leGhpYml0aW9uX2RhdGEpO1xuXG4gICAgLy8kLmdldEpTT04odGhpcy5qc29uLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgLy9cbiAgICAvLyAgd2luZG93LmV4aGliaXRpb24gPSBkYXRhLmV4aGliaXRpb247XG4gICAgLy8gIHdpbmRvdy5zdWdnZXN0aW9ucyA9IGRhdGEuc3VnZ2VzdGlvbnM7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEuZXhoaWJpdGlvbik7XG5cbiAgICAvL3ZhciBleGhpYml0aW9uID0gSlNPTi5wYXJzZSh3aW5kb3cuZXhoaWJpdGlvbik7XG4gICAgLy93aW5kb3cuc3VnZ2VzdGlvbnMgPSBKU09OLnBhcnNlKHdpbmRvdy5zdWdnZXN0aW9ucyk7XG5cbiAgICAgIHNlbGYuc2V0QXJ0d29ya3Mod2luZG93LmV4aGliaXRpb24uYXJ0d29ya3MpO1xuICAgICAgc2VsZi5zcGFjZVZpZXcgPSBuZXcgU3BhY2VWaWV3KHNlbGYuYXJ0d29ya3MpO1xuICAgICAgc2VsZi5yZW5kZXIoKTtcblxuICAgIC8vfSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICAgIHZhciBkZXNjID0gd2luZG93LmV4aGliaXRpb24uZGVzY3JpcHRpb24ucmVwbGFjZSgvKD86XFxyXFxufFxccnxcXG4pL2csICc8YnI+Jyk7XG5cbiAgICB2YXIgY29tcGlsZWRUZW1wbGF0ZSA9IGhvbWVUZW1wbGF0ZSh7XG4gICAgICBuYW1lOiB3aW5kb3cuZXhoaWJpdGlvbi50aXRsZSxcbiAgICAgIGFydGlzdDogd2luZG93LmV4aGliaXRpb24uYXJ0aXN0LFxuICAgICAgZGVzY3JpcHRpb246IGRlc2MsXG4gICAgICBwcmV2aWV3OiB3aW5kb3cuZXhoaWJpdGlvbi5wcmV2aWV3XG4gICAgfSk7XG4gICAgdGhpcy4kZWwuaHRtbChjb21waWxlZFRlbXBsYXRlKTtcbiAgICB0aGlzLiRlbC5maW5kKCcuaG9tZS1jb250ZW50JykuYWRkQ2xhc3MoJ2lzLXZpc2libGUnKTtcblxuICAgIHRoaXMubG9hZEFzc2V0cyhmdW5jdGlvbigpe1xuICAgICAgJCgnLmhvbWV3cmFwX19lbnRlcmJ0bicpLmh0bWwoJ0VudGVyIEV4aGliaXRpb24nKS5hZGRDbGFzcygnaXMtdmlzaWJsZScpO1xuICAgIH0pO1xuXG4gICAgJCgnLmhvbWV3cmFwX19jb250ZW50IGgxJykuY3NzKHt5Oic1MHB4Jywgb3BhY2l0eTowfSkudHJhbnNpdGlvbih7eTowLCBvcGFjaXR5OjF9LCAxNTAwLCAnZWFzZS1vdXQnKTtcbiAgICAkKCcuaG9tZXdyYXBfX2FydGlzdCcpLmNzcyh7eTonNzBweCcsIG9wYWNpdHk6MH0pLnRyYW5zaXRpb24oe3k6MCwgb3BhY2l0eToxfSwgMTUwMCwgJ2Vhc2Utb3V0Jyk7XG4gICAgJCgnLmhvbWV3cmFwX19jb250ZW50IHAnKS5jc3Moe3k6JzkwcHgnLCBvcGFjaXR5OjB9KS50cmFuc2l0aW9uKHt5OjAsIG9wYWNpdHk6MX0sIDE1MDAsICdlYXNlLW91dCcpO1xuXG4gICAgLy8gdmFyIGlzTW9iaWxlID0gZmFsc2U7XG4gICAgLy8gKGZ1bmN0aW9uKGEpIHtcbiAgICAvLyAgIGlmICgvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vfGFuZHJvaWR8aXBhZHxwbGF5Ym9va3xzaWxrL2kudGVzdChhKSB8fCAvMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaS50ZXN0KGEuc3Vic3RyKDAsIDQpKSkgaXNNb2JpbGUgPSB0cnVlXG4gICAgLy8gfSkobmF2aWdhdG9yLnVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudmVuZG9yIHx8IHdpbmRvdy5vcGVyYSk7XG5cbiAgICAvLyBpZiAoaXNNb2JpbGUpIHtcbiAgICAvLyAgICQoJ2JvZHknKS5hZGRDbGFzcygnbW9iaWxlJyk7XG4gICAgLy8gfVxuXG4gICAgLy8gJCgnLmpzLWhpZGVNb2JpbGVBbGVydCcpLmNsaWNrKGZ1bmN0aW9uKGUpwqAge1xuICAgIC8vICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vICAgJCgnLm1vYmlsZS1hbGVydCcpLmZhZGVPdXQoMjAwKTtcbiAgICAvLyB9KVxuICAgIFxuICAgIC8vIHRoaXMuZW50ZXJTcGFjZSgpO1xuICB9LFxuXG4gIHNldEFydHdvcmtzOiBmdW5jdGlvbihhcnR3b3Jrcykge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5hcnR3b3JrcyA9IG5ldyBBcnR3b3JrQ29sbGVjdGlvbigpO1xuXG4gICAgXy5lYWNoKGFydHdvcmtzLCBmdW5jdGlvbihhKSB7XG5cbiAgICAgIHZhciBhcnR3b3JrID0gbmV3IEFydHdvcmsoYSk7XG4gICAgICBzZWxmLmFydHdvcmtzLmFkZChhcnR3b3JrKTtcblxuICAgIH0pO1xuXG4gIH0sXG5cbiAgbG9hZEFzc2V0czogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgJCgnLmhvbWV3cmFwX19lbnRlcmJ0bicpLmh0bWwoJ0xvYWRpbmcgQXJ0d29ya3MnKTtcblxuICAgIHRoaXMuc3BhY2VWaWV3LnByZWxvYWQoZnVuY3Rpb24oKXtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSwgZnVuY3Rpb24oYSwgYikge1xuICAgICAgJCgnLmhvbWV3cmFwX19lbnRlcmJ0bicpLmh0bWwoJ0xvYWRpbmcgQXJ0d29yayAnICsgYSArICcgLyAnICsgYik7XG4gICAgfSk7XG5cbiAgICAkKCc8aW1nPicpLmF0dHIoJ3NyYycsIHdpbmRvdy5leGhpYml0aW9uLnByZXZpZXcpLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAkKCcuaG9tZV9fYmFja2dyb3VuZCcpLmFkZENsYXNzKCdpcy12aXNpYmxlJyk7XG4gICAgICB9LCAxMDApO1xuICAgIH0pO1xuICBcbiAgfSxcblxuICBlbnRlclNwYWNlOiBmdW5jdGlvbihlKSB7XG4gICAgaWYoZSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgJCgnLmhvbWV3cmFwJykudHJhbnNpdGlvbih7c2NhbGU6Miwgb3BhY2l0eTowfSwgMTAwMCwgZnVuY3Rpb24oKcKge1xuICAgICAgJCgnLmhvbWV3cmFwJykucmVtb3ZlKCk7XG4gICAgfSk7XG4gICAgXG4gICAgc2VsZi5zcGFjZVZpZXcucmVuZGVyKCk7XG5cbiAgfVxuXG59KTtcblxuIl19
},{"backbone":2,"collections/artworks":15,"jquery":12,"jquery.transit":11,"models/artwork":18,"templates/home.hbs":24,"underscore":14,"views/spaceview":32}],32:[function(require,module,exports){
'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var transit = require('jquery.transit');
Backbone.$ = $;

var ArtworkCollection = require('collections/artworks');
var Artwork = require('models/artwork');
var ThreeJSView = require('views/threejsview');
var EndSlideView = require('views/endslideview');

var ImageArtworkView = require('views/artworks/imageartwork');
var VideoArtworkView = require('views/artworks/videoartwork');
var IframeArtworkView = require('views/artworks/iframeartwork');
var ScrubArtworkView = require('views/artworks/scrubartwork');

var spaceTemplate = require('templates/space.hbs');

module.exports = Backbone.View.extend({

  el: $(".content-wrap"),
  artworkViews: [],
  activeId: 0,
  activeArtwork: null,
  birdseyeActive: false,

  events: {
    'click .js-nextartwork': 'showNext',
    'click .js-prevartwork': 'showPrev',
    'click .js-birdseye': 'toggleBirdsEye',
    'mousemove': 'handleMouseMove'
  },

  initialize: function initialize(artworks) {
    var self = this;

    this.artworks = artworks;

    this.artworks.each(function (a, i) {

      var args = {
        model: a,
        space: self,
        oldId: i
      };

      switch (a.get('type')) {
        case 'image':
          self.artworkViews.push(new ImageArtworkView(args));
          break;
        case 'video':
          self.artworkViews.push(new VideoArtworkView(args));
          break;
        case 'iframe':
          self.artworkViews.push(new IframeArtworkView(args));
          break;
        case 'scrub':
          self.artworkViews.push(new ScrubArtworkView(args));
          break;
      }
    });

    var self = this;
    $(document).bind('keydown', function (e) {
      self.handleKey(e);
    });
  },

  render: function render() {
    var self = this;

    var compiledTemplate = spaceTemplate(window.exhibition.space);
    this.$el.append(compiledTemplate);

    this.endSlide = new EndSlideView({
      el: '.space__endslide'
    }, this);
    // this.endSlide.render();

    this.threejsView = new ThreeJSView(this.artworkViews);
    this.threejsView.render();
    var $cont = this.$el.find('.space-container');
    $cont.append(this.threejsView.el).hide().fadeIn(2000);

    this.showArtworkById(0, 3000);
  },

  preload: function preload(callback, update) {

    var aLength = this.artworkViews.length;
    var aCount = 0;

    $.each(this.artworkViews, function (k, v) {
      v.loadAssets(function () {
        // console.log(aCount, aLength);
        aCount++;
        update(aCount, aLength);

        if (aCount >= aLength) {
          callback();
        }
      });
    });
  },

  showArtwork: function showArtwork(artwork, s) {

    this.activeArtwork = artwork;

    if (this.birdseyeActive) {
      this.birdseyeActive = false;
      $('.space__arrow, .title-container').show();
      $('.ns-aw-container.is-highlighted').removeClass('is-highlighted');

      this.threejsView.birdseyeActive = false;
      this.threejsView.fogActive = true;
    }

    this.threejsView.moveToArtwork(artwork.model.get('id'), s);

    var currentCount = parseInt(this.activeId) + 1;
    var awName = '<span class="title__num">' + currentCount + '/' + this.artworks.length + '</span>';
    if (artwork.model.get('name') !== '') {
      awName += '<span class="title__name">' + artwork.model.get('name') + '</span>';
    }
    this.$el.find('.title__description').html(awName);
    this.$el.find('.title__instruction').html(artwork.model.get('instruction'));

    this.setColors({
      foregroundColor: artwork.model.get('foregroundColor'),
      backgroundColor: artwork.model.get('backgroundColor')
    });

    $('.space__arrow').show();
    if (this.activeId == 0) {
      $('.space__arrow.prev').hide();
    }
  },

  setColors: function setColors(args) {

    this.$el.find('.space-container').transition({ 'background-color': args.backgroundColor }, 1000);
    this.$el.find('.title-container, .nav').transition({ 'color': args.foregroundColor }, 1000);
    this.$el.find('#nav__logo__letter').transition({ 'fill': args.foregroundColor }, 1000);
    this.$el.find('.space__arrow').transition({ 'border-color': args.foregroundColor }, 1000);
    this.$el.find('.nav__link').attr('data-color', args.foregroundColor);
    this.$el.find('.nav__link').transition({ 'border-color': args.foregroundColor }, 1000);
  },

  showArtworkById: function showArtworkById(id, s) {
    this.activeId = id;
    this.showArtwork(this.artworkViews[id], s);
  },

  showNext: function showNext(e) {
    if (e) e.preventDefault();
    if (this.activeId < this.artworkViews.length - 1) {
      this.activeId++;
      this.showArtworkById(this.activeId, 1500);
    } else {
      this.activeId = 0;
      this.showEndSlide();
      $('.space__arrow').hide();
    }
  },

  showPrev: function showPrev(e) {
    if (e) e.preventDefault();
    if (this.activeId > 0) {
      this.activeId--;
      this.showArtworkById(this.activeId, 1500);
    } else if (this.endSlide.isActive) {
      this.endSlide.backToLast();
    }
  },

  handleKey: function handleKey(e) {
    var code = e.keyCode || e.which;

    if (code == 39) this.showNext();
    if (code == 37) this.showPrev();
  },

  showEndSlide: function showEndSlide() {
    this.endSlide.show();
    this.threejsView.tweenFov(115, 800);
  },

  toggleBirdsEye: function toggleBirdsEye(e) {
    if (e) e.preventDefault();

    this.threejsView.toggleBirdsEye(window.exhibition.space.birdseye);

    if (!this.birdseyeActive) {
      this.birdseyeActive = true;
      $('.space__arrow, .title-container').hide();

      $.each(this.artworkViews, function (k, v) {
        v.deactivate();
      });

      this.setColors({
        foregroundColor: window.exhibition.space.foregroundColor,
        backgroundColor: window.exhibition.space.backgroundColor
      });
    } else {
      this.birdseyeActive = false;
      $('.ns-aw-container.is-highlighted').removeClass('is-highlighted');
      $('.space__arrow, .title-container').show();

      this.setColors({
        foregroundColor: this.activeArtwork.model.get('foregroundColor'),
        backgroundColor: this.activeArtwork.model.get('backgroundColor')
      });
    }
  },

  handleMouseMove: function handleMouseMove(e) {
    // var windowH = window.innerHeight;
    var mouseY = e.clientY;
    var thresholdY = 150;

    if (mouseY < thresholdY) {
      if ($('.nav__list').hasClass('is-hidden')) $('.nav__list').removeClass('is-hidden');
    } else if (mouseY > thresholdY) {
      if (!$('.nav__list').hasClass('is-hidden')) $('.nav__list').addClass('is-hidden');
    }

    var mouseX = e.clientX;
    var thresholdX = 150;

    if (mouseX > thresholdX) {}
  }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L3ZpZXdzL3NwYWNldmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzlCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVmLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDeEQsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDL0MsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRWpELElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDOUQsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUM5RCxJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQ2hFLElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRTlELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztBQUVuRCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUVwQyxJQUFFLEVBQUUsQ0FBQyxD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QUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNwRixNQUFLLElBQUcsTUFBTSxHQUFHLFVBQVUsRUFBRTtBQUM1QixVQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ2xGOztBQUVELFFBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDdkIsUUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDOztBQUVyQixRQUFHLE1BQU0sR0FBRyxVQUFVLEVBQUUsRUFFdkI7R0FDRjs7Q0FFRixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2pvcmlzL1NpdGVzL3BsYXlncm91bmQvbnMwMi1uZXZlcmxhbmRzcGFjZS9yZXNvdXJjZXMvYXNzZXRzL2pzL3NwYWNlL2RlZmF1bHQvdmlld3Mvc3BhY2V2aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciB0cmFuc2l0ID0gcmVxdWlyZSgnanF1ZXJ5LnRyYW5zaXQnKTtcbkJhY2tib25lLiQgPSAkO1xuXG52YXIgQXJ0d29ya0NvbGxlY3Rpb24gPSByZXF1aXJlKCdjb2xsZWN0aW9ucy9hcnR3b3JrcycpO1xudmFyIEFydHdvcmsgPSByZXF1aXJlKCdtb2RlbHMvYXJ0d29yaycpO1xudmFyIFRocmVlSlNWaWV3ID0gcmVxdWlyZSgndmlld3MvdGhyZWVqc3ZpZXcnKTtcbnZhciBFbmRTbGlkZVZpZXcgPSByZXF1aXJlKCd2aWV3cy9lbmRzbGlkZXZpZXcnKTtcblxudmFyIEltYWdlQXJ0d29ya1ZpZXcgPSByZXF1aXJlKCd2aWV3cy9hcnR3b3Jrcy9pbWFnZWFydHdvcmsnKTtcbnZhciBWaWRlb0FydHdvcmtWaWV3ID0gcmVxdWlyZSgndmlld3MvYXJ0d29ya3MvdmlkZW9hcnR3b3JrJyk7XG52YXIgSWZyYW1lQXJ0d29ya1ZpZXcgPSByZXF1aXJlKCd2aWV3cy9hcnR3b3Jrcy9pZnJhbWVhcnR3b3JrJyk7XG52YXIgU2NydWJBcnR3b3JrVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL2FydHdvcmtzL3NjcnViYXJ0d29yaycpO1xuXG52YXIgc3BhY2VUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9zcGFjZS5oYnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgZWw6ICQoXCIuY29udGVudC13cmFwXCIpLFxuICBhcnR3b3JrVmlld3M6IFtdLFxuICBhY3RpdmVJZDogMCxcbiAgYWN0aXZlQXJ0d29yazogbnVsbCxcbiAgYmlyZHNleWVBY3RpdmU6IGZhbHNlLFxuXG4gIGV2ZW50czoge1xuICAgICdjbGljayAuanMtbmV4dGFydHdvcmsnOiAnc2hvd05leHQnLFxuICAgICdjbGljayAuanMtcHJldmFydHdvcmsnOiAnc2hvd1ByZXYnLFxuICAgICdjbGljayAuanMtYmlyZHNleWUnOiAndG9nZ2xlQmlyZHNFeWUnLFxuICAgICdtb3VzZW1vdmUnOiAnaGFuZGxlTW91c2VNb3ZlJ1xuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGFydHdvcmtzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5hcnR3b3JrcyA9IGFydHdvcmtzO1xuXG4gICAgdGhpcy5hcnR3b3Jrcy5lYWNoKGZ1bmN0aW9uKGEsIGkpwqAge1xuXG4gICAgICB2YXIgYXJncyA9IHtcbiAgICAgICAgbW9kZWw6IGEsXG4gICAgICAgIHNwYWNlOiBzZWxmLFxuICAgICAgICBvbGRJZDogaVxuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKGEuZ2V0KCd0eXBlJykpwqAge1xuICAgICAgICBjYXNlICdpbWFnZSc6XG4gICAgICAgICAgc2VsZi5hcnR3b3JrVmlld3MucHVzaChuZXcgSW1hZ2VBcnR3b3JrVmlldyhhcmdzKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3ZpZGVvJzpcbiAgICAgICAgICBzZWxmLmFydHdvcmtWaWV3cy5wdXNoKG5ldyBWaWRlb0FydHdvcmtWaWV3KGFyZ3MpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnaWZyYW1lJzpcbiAgICAgICAgICBzZWxmLmFydHdvcmtWaWV3cy5wdXNoKG5ldyBJZnJhbWVBcnR3b3JrVmlldyhhcmdzKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3NjcnViJzpcbiAgICAgICAgICBzZWxmLmFydHdvcmtWaWV3cy5wdXNoKG5ldyBTY3J1YkFydHdvcmtWaWV3KGFyZ3MpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAkKGRvY3VtZW50KS5iaW5kKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgc2VsZi5oYW5kbGVLZXkoZSk7XG4gICAgfSk7XG5cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBjb21waWxlZFRlbXBsYXRlID0gc3BhY2VUZW1wbGF0ZSh3aW5kb3cuZXhoaWJpdGlvbi5zcGFjZSk7XG4gICAgdGhpcy4kZWwuYXBwZW5kKGNvbXBpbGVkVGVtcGxhdGUpO1xuXG4gICAgdGhpcy5lbmRTbGlkZSA9IG5ldyBFbmRTbGlkZVZpZXcoe1xuICAgICAgZWw6ICcuc3BhY2VfX2VuZHNsaWRlJ1xuICAgIH0sIHRoaXMpO1xuICAgIC8vIHRoaXMuZW5kU2xpZGUucmVuZGVyKCk7XG5cbiAgICB0aGlzLnRocmVlanNWaWV3ID0gbmV3IFRocmVlSlNWaWV3KHRoaXMuYXJ0d29ya1ZpZXdzKTtcbiAgICB0aGlzLnRocmVlanNWaWV3LnJlbmRlcigpO1xuICAgIHZhciAkY29udCA9IHRoaXMuJGVsLmZpbmQoJy5zcGFjZS1jb250YWluZXInKTtcbiAgICAkY29udC5hcHBlbmQodGhpcy50aHJlZWpzVmlldy5lbCkuaGlkZSgpLmZhZGVJbigyMDAwKTtcblxuICAgIHRoaXMuc2hvd0FydHdvcmtCeUlkKDAsIDMwMDApO1xuICB9LFxuXG4gIHByZWxvYWQ6IGZ1bmN0aW9uKGNhbGxiYWNrLCB1cGRhdGUpIHtcblxuICAgIHZhciBhTGVuZ3RoID0gdGhpcy5hcnR3b3JrVmlld3MubGVuZ3RoO1xuICAgIHZhciBhQ291bnQgPSAwO1xuXG5cbiAgICAkLmVhY2godGhpcy5hcnR3b3JrVmlld3MsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIHYubG9hZEFzc2V0cyhmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYUNvdW50LCBhTGVuZ3RoKTtcbiAgICAgICAgYUNvdW50Kys7XG4gICAgICAgIHVwZGF0ZShhQ291bnQsIGFMZW5ndGgpO1xuXG4gICAgICAgIGlmIChhQ291bnQgPj0gYUxlbmd0aCkge1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIH0sXG5cbiAgc2hvd0FydHdvcms6IGZ1bmN0aW9uKGFydHdvcmssIHMpIHtcblxuICAgIHRoaXMuYWN0aXZlQXJ0d29yayA9IGFydHdvcms7XG5cbiAgICBpZih0aGlzLmJpcmRzZXllQWN0aXZlKSB7XG4gICAgICB0aGlzLmJpcmRzZXllQWN0aXZlID0gZmFsc2U7XG4gICAgICAkKCcuc3BhY2VfX2Fycm93LCAudGl0bGUtY29udGFpbmVyJykuc2hvdygpO1xuICAgICAgJCgnLm5zLWF3LWNvbnRhaW5lci5pcy1oaWdobGlnaHRlZCcpLnJlbW92ZUNsYXNzKCdpcy1oaWdobGlnaHRlZCcpO1xuXG4gICAgICB0aGlzLnRocmVlanNWaWV3LmJpcmRzZXllQWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLnRocmVlanNWaWV3LmZvZ0FjdGl2ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy50aHJlZWpzVmlldy5tb3ZlVG9BcnR3b3JrKGFydHdvcmsubW9kZWwuZ2V0KCdpZCcpLCBzKTtcblxuICAgIHZhciBjdXJyZW50Q291bnQgPSBwYXJzZUludCh0aGlzLmFjdGl2ZUlkKSArIDE7XG4gICAgdmFyIGF3TmFtZSA9ICc8c3BhbiBjbGFzcz1cInRpdGxlX19udW1cIj4nICsgY3VycmVudENvdW50ICsgJy8nICsgdGhpcy5hcnR3b3Jrcy5sZW5ndGggKyAnPC9zcGFuPic7XG4gICAgaWYoYXJ0d29yay5tb2RlbC5nZXQoJ25hbWUnKSAhPT0gJycpIHtcbiAgICAgIGF3TmFtZSArPSAnPHNwYW4gY2xhc3M9XCJ0aXRsZV9fbmFtZVwiPicgKyBhcnR3b3JrLm1vZGVsLmdldCgnbmFtZScpICsgJzwvc3Bhbj4nO1xuICAgIH1cbiAgICB0aGlzLiRlbC5maW5kKCcudGl0bGVfX2Rlc2NyaXB0aW9uJykuaHRtbChhd05hbWUpO1xuICAgIHRoaXMuJGVsLmZpbmQoJy50aXRsZV9faW5zdHJ1Y3Rpb24nKS5odG1sKGFydHdvcmsubW9kZWwuZ2V0KCdpbnN0cnVjdGlvbicpKTtcblxuICAgIHRoaXMuc2V0Q29sb3JzKHtcbiAgICAgIGZvcmVncm91bmRDb2xvcjogYXJ0d29yay5tb2RlbC5nZXQoJ2ZvcmVncm91bmRDb2xvcicpLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBhcnR3b3JrLm1vZGVsLmdldCgnYmFja2dyb3VuZENvbG9yJylcbiAgICB9KVxuXG4gICAgJCgnLnNwYWNlX19hcnJvdycpLnNob3coKTtcbiAgICBpZiAodGhpcy5hY3RpdmVJZCA9PSAwKSB7XG4gICAgICAkKCcuc3BhY2VfX2Fycm93LnByZXYnKS5oaWRlKCk7XG4gICAgfVxuICB9LFxuXG4gIHNldENvbG9yczogZnVuY3Rpb24oYXJncykge1xuXG4gICAgdGhpcy4kZWwuZmluZCgnLnNwYWNlLWNvbnRhaW5lcicpLnRyYW5zaXRpb24oeydiYWNrZ3JvdW5kLWNvbG9yJzogYXJncy5iYWNrZ3JvdW5kQ29sb3J9LCAxMDAwKTtcbiAgICB0aGlzLiRlbC5maW5kKCcudGl0bGUtY29udGFpbmVyLCAubmF2JykudHJhbnNpdGlvbih7J2NvbG9yJzogYXJncy5mb3JlZ3JvdW5kQ29sb3J9LCAxMDAwKTtcbiAgICB0aGlzLiRlbC5maW5kKCcjbmF2X19sb2dvX19sZXR0ZXInKS50cmFuc2l0aW9uKHsnZmlsbCc6IGFyZ3MuZm9yZWdyb3VuZENvbG9yfSwgMTAwMCk7XG4gICAgdGhpcy4kZWwuZmluZCgnLnNwYWNlX19hcnJvdycpLnRyYW5zaXRpb24oeydib3JkZXItY29sb3InOiBhcmdzLmZvcmVncm91bmRDb2xvcn0sIDEwMDApO1xuICAgIHRoaXMuJGVsLmZpbmQoJy5uYXZfX2xpbmsnKS5hdHRyKCdkYXRhLWNvbG9yJywgYXJncy5mb3JlZ3JvdW5kQ29sb3IpO1xuICAgIHRoaXMuJGVsLmZpbmQoJy5uYXZfX2xpbmsnKS50cmFuc2l0aW9uKHsnYm9yZGVyLWNvbG9yJzogYXJncy5mb3JlZ3JvdW5kQ29sb3J9LCAxMDAwKTtcblxuICB9LFxuXG4gIHNob3dBcnR3b3JrQnlJZDogZnVuY3Rpb24oaWQsIHMpIHtcbiAgICB0aGlzLmFjdGl2ZUlkID0gaWQ7XG4gICAgdGhpcy5zaG93QXJ0d29yayh0aGlzLmFydHdvcmtWaWV3c1tpZF0sIHMpO1xuICB9LFxuXG4gIHNob3dOZXh0OiBmdW5jdGlvbihlKSB7XG4gICAgaWYoZSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICh0aGlzLmFjdGl2ZUlkIDwgdGhpcy5hcnR3b3JrVmlld3MubGVuZ3RoIC0gMSkge1xuICAgICAgdGhpcy5hY3RpdmVJZCsrO1xuICAgICAgdGhpcy5zaG93QXJ0d29ya0J5SWQodGhpcy5hY3RpdmVJZCwgMTUwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWN0aXZlSWQgPSAwO1xuICAgICAgdGhpcy5zaG93RW5kU2xpZGUoKTtcbiAgICAgICQoJy5zcGFjZV9fYXJyb3cnKS5oaWRlKCk7XG4gICAgfVxuICB9LFxuXG4gIHNob3dQcmV2OiBmdW5jdGlvbihlKSB7XG4gICAgaWYoZSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICh0aGlzLmFjdGl2ZUlkID4gMCkge1xuICAgICAgdGhpcy5hY3RpdmVJZC0tO1xuICAgICAgdGhpcy5zaG93QXJ0d29ya0J5SWQodGhpcy5hY3RpdmVJZCwgMTUwMCk7XG4gICAgfWVsc2UgaWYodGhpcy5lbmRTbGlkZS5pc0FjdGl2ZSl7XG4gICAgICB0aGlzLmVuZFNsaWRlLmJhY2tUb0xhc3QoKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlS2V5OiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGNvZGUgPSBlLmtleUNvZGUgfHwgZS53aGljaDtcblxuICAgIGlmIChjb2RlID09IDM5KSB0aGlzLnNob3dOZXh0KCk7XG4gICAgaWYgKGNvZGUgPT0gMzcpIHRoaXMuc2hvd1ByZXYoKTtcbiAgfSxcblxuICBzaG93RW5kU2xpZGU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZW5kU2xpZGUuc2hvdygpO1xuICAgIHRoaXMudGhyZWVqc1ZpZXcudHdlZW5Gb3YoMTE1LCA4MDApO1xuICB9LFxuXG4gIHRvZ2dsZUJpcmRzRXllOiBmdW5jdGlvbihlKcKgIHtcbiAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy50aHJlZWpzVmlldy50b2dnbGVCaXJkc0V5ZSh3aW5kb3cuZXhoaWJpdGlvbi5zcGFjZS5iaXJkc2V5ZSk7XG5cbiAgICBpZiAoIXRoaXMuYmlyZHNleWVBY3RpdmUpIHtcbiAgICAgIHRoaXMuYmlyZHNleWVBY3RpdmUgPSB0cnVlO1xuICAgICAgJCgnLnNwYWNlX19hcnJvdywgLnRpdGxlLWNvbnRhaW5lcicpLmhpZGUoKTtcblxuICAgICAgJC5lYWNoKHRoaXMuYXJ0d29ya1ZpZXdzLCBmdW5jdGlvbihrLHYpwqB7XG4gICAgICAgIHYuZGVhY3RpdmF0ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc2V0Q29sb3JzKHtcbiAgICAgICAgZm9yZWdyb3VuZENvbG9yOiB3aW5kb3cuZXhoaWJpdGlvbi5zcGFjZS5mb3JlZ3JvdW5kQ29sb3IsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogd2luZG93LmV4aGliaXRpb24uc3BhY2UuYmFja2dyb3VuZENvbG9yXG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJpcmRzZXllQWN0aXZlID0gZmFsc2U7XG4gICAgICAkKCcubnMtYXctY29udGFpbmVyLmlzLWhpZ2hsaWdodGVkJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2hsaWdodGVkJyk7XG4gICAgICAkKCcuc3BhY2VfX2Fycm93LCAudGl0bGUtY29udGFpbmVyJykuc2hvdygpO1xuXG4gICAgICB0aGlzLnNldENvbG9ycyh7XG4gICAgICAgIGZvcmVncm91bmRDb2xvcjogdGhpcy5hY3RpdmVBcnR3b3JrLm1vZGVsLmdldCgnZm9yZWdyb3VuZENvbG9yJyksXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5hY3RpdmVBcnR3b3JrLm1vZGVsLmdldCgnYmFja2dyb3VuZENvbG9yJylcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICBoYW5kbGVNb3VzZU1vdmU6IGZ1bmN0aW9uKGUpIHtcbiAgICAvLyB2YXIgd2luZG93SCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB2YXIgbW91c2VZID0gZS5jbGllbnRZO1xuICAgIHZhciB0aHJlc2hvbGRZID0gMTUwO1xuXG4gICAgaWYobW91c2VZIDwgdGhyZXNob2xkWSkge1xuICAgICAgaWYoJCgnLm5hdl9fbGlzdCcpLmhhc0NsYXNzKCdpcy1oaWRkZW4nKSkgJCgnLm5hdl9fbGlzdCcpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgICB9ZWxzZSBpZihtb3VzZVkgPiB0aHJlc2hvbGRZKSB7XG4gICAgICBpZighJCgnLm5hdl9fbGlzdCcpLmhhc0NsYXNzKCdpcy1oaWRkZW4nKSkgJCgnLm5hdl9fbGlzdCcpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcbiAgICB9XG5cbiAgICB2YXIgbW91c2VYID0gZS5jbGllbnRYO1xuICAgIHZhciB0aHJlc2hvbGRYID0gMTUwO1xuXG4gICAgaWYobW91c2VYID4gdGhyZXNob2xkWCkge1xuXG4gICAgfVxuICB9XG5cbn0pOyJdfQ==
},{"backbone":2,"collections/artworks":15,"jquery":12,"jquery.transit":11,"models/artwork":18,"templates/space.hbs":25,"underscore":14,"views/artworks/iframeartwork":26,"views/artworks/imageartwork":27,"views/artworks/scrubartwork":28,"views/artworks/videoartwork":29,"views/endslideview":30,"views/threejsview":33}],33:[function(require,module,exports){
(function (global){
'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
Backbone.$ = $;

var ArtworkCollection = require('collections/artworks');
var Artwork = require('models/artwork');
var ThreeJSView = require('views/threejsview');

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TWEEN = require('tween.js');
var CSS3DRenderer = require('libs/CSS3DRenderer');

module.exports = Backbone.View.extend({

  objects: [],
  activeId: 'd',
  camPos: {},
  camRot: {},
  tiltSpeed: 40,
  mouseX: 0, mouseY: 0,
  mouseTilt: true,
  birdseyeActive: false,
  fogActive: true,

  initialize: function initialize(artworkviews) {
    var self = this;

    this.artworkViews = artworkviews;
    this.$birdBtn = $('.js-birdseye');

    var self = this;
    $(document).bind('mousemove', function (e) {
      self.handleMouseMove(e);
    });

    $(window).on('resize', function () {
      self.handleResize();
    });
  },

  render: function render() {
    var self = this;

    this.initScene();
    this.animate();

    // var pos = [800,0,500];
    // this.moveCamera(pos);
  },

  handleResize: function handleResize(e) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  },

  initScene: function initScene() {
    var self = this;

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    this.camera.position.y = 0;
    this.camera.position.z = 1500;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.CSS3DRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = 0;
    this.$el.append(this.renderer.domElement);

    _.each(this.artworkViews, function (a) {
      a.render();
      var object = new THREE.CSS3DObject(a.el);
      self.scene.add(object);

      var pos = a.model.get('position');
      var rot = a.model.get('rotation');
      object.position.x = pos[0];
      object.position.y = pos[1];
      object.position.z = pos[2];
      object.rotation.x = rot[0];
      object.rotation.y = rot[1];
      object.rotation.z = rot[2];
      self.objects.push(object);
    });

    var dummyEl = document.createElement('div');
    this.dummyObj = new THREE.CSS3DObject(dummyEl);
  },

  moveToArtwork: function moveToArtwork(id, s) {
    var self = this;
    var pos = this.artworkViews[id].model.get('position');
    var rot = this.artworkViews[id].model.get('rotation');
    var speed = s;

    this.mouseTilt = this.artworkViews[id].model.get('fittoscreen') ? false : true;

    self.oldActiveId = self.activeId;
    self.activeId = id;
    // if(self.oldActiveId != 'd' && self.oldActiveId != id) {
    //   window.setTimeout(function() {
    //   }, s);
    // }
    if (self.oldActiveId != 'd') self.artworkViews[self.oldActiveId].deactivate();
    // self.artworkViews[self.activeId].activate();

    this.dummyObj.position.set(pos[0], pos[1], pos[2]);
    this.dummyObj.rotation.set(rot[0], rot[1], rot[2]);
    this.dummyObj.translateZ(this.calculateDistance(this.artworkViews[id].model.get('viewport'), this.artworkViews[id].model.get('size')));

    this.camPos = this.dummyObj.position;
    this.camRot = this.dummyObj.rotation;

    this.$birdBtn.css('pointer-events', 'none');

    new TWEEN.Tween(self.camera.position).to(self.camPos, speed).easing(TWEEN.Easing.Cubic.InOut).start();

    new TWEEN.Tween(self.camera.rotation).to({ x: self.camRot.x, y: self.camRot.y, z: self.camRot.z }, speed).easing(TWEEN.Easing.Cubic.InOut).onComplete(function () {
      self.$birdBtn.css('pointer-events', 'auto');
      self.artworkViews[self.activeId].activate();
    }).start();
  },

  animate: function animate() {
    var self = this;

    requestAnimationFrame(this.animate.bind(this));

    TWEEN.update();

    this.renderer.render(this.scene, this.camera);

    /* object opacity */

    if (this.fogActive) {
      $.each(this.objects, function () {
        var dist = self.distanceToCamera(this.position);
        dist -= 1000;
        dist = dist < 0 ? 0 : dist;
        var opac = 1 - dist / 900;
        if (opac <= 0) opac = .05;
        $(this.element).css('opacity', opac);
      });
    } else {
      $.each(this.objects, function () {
        var opac = 1;
        $(this.element).css('opacity', opac);
      });
    }

    /* camera tilt */

    if (this.mouseTilt && !this.birdseyeActive) {

      var xPerc = 100 / window.innerWidth * this.mouseX;
      var yPerc = 100 / window.innerHeight * this.mouseY;
      var xTilt = .1 / 100 * (xPerc - 50) * -1;
      var yTilt = .1 / 100 * (yPerc - 50) * -1;

      this.camera.rotation.x += (this.camRot.x + yTilt - this.camera.rotation.x) / this.tiltSpeed;
      this.camera.rotation.y += (this.camRot.y + xTilt - this.camera.rotation.y) / this.tiltSpeed;
    }
  },

  calculateDistance: function calculateDistance(vp, size) {
    var dx = size[0];
    var dy = size[1];
    var dist = dy / 2 / Math.tan(Math.PI * 75 / 360);

    if (vp == 'cover') {

      return dist;
    } else if (vp == 'contain') {

      return dist + 200;
    } else {

      return vp;
    }
  },

  handleMouseMove: function handleMouseMove(e) {
    this.mouseX = e.pageX;
    this.mouseY = e.pageY;
  },

  distanceToCamera: function distanceToCamera(v1) {
    var v2 = this.camera.position;
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },

  toggleBirdsEye: function toggleBirdsEye(coords) {
    var self = this;
    var speed = 1000;

    if (this.birdseyeActive) {
      this.moveToArtwork(this.activeId, 1000);
      this.birdseyeActive = false;
      this.fogActive = true;
    } else {
      this.birdseyeActive = true;
      this.fogActive = false;

      // $('.space-container').transition({'background-color': '#aaffff'}, 1000);

      new TWEEN.Tween(self.camera.position).to({ x: coords.position[0], y: coords.position[1], z: coords.position[2] }, speed).easing(TWEEN.Easing.Cubic.InOut).start();

      var rotX = coords.rotation[0] * Math.PI / 180;
      var rotY = coords.rotation[1] * Math.PI / 180;
      var rotZ = coords.rotation[2] * Math.PI / 180;

      new TWEEN.Tween(self.camera.rotation).to({ x: rotX, y: rotY, z: rotZ }, speed).easing(TWEEN.Easing.Cubic.InOut).start();
    }
  },

  tweenFov: function tweenFov(newFov, speed) {
    var self = this;
    var oldFov = self.camera.fov;
    var newFov = newFov;

    new TWEEN.Tween({ fov: oldFov }).to({ fov: newFov }, speed).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function (k) {
      self.camera.fov = this.fov;
    }).start();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3Jpcy9TaXRlcy9wbGF5Z3JvdW5kL25zMDItbmV2ZXJsYW5kc3BhY2UvcmVzb3VyY2VzL2Fzc2V0cy9qcy9zcGFjZS9kZWZhdWx0L3ZpZXdzL3RocmVlanN2aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzlCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVmLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDeEQsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0FBRS9DLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDaEMsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRWxELE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7O0FBRXBDLFNBQU8sRUFBRSxFQUFFO0FBQ1gsVUFBUSxFQUFFLEdBQUc7QUFDYixRQUFNLEVBQUUsRUFBRTtBQUNWLFFBQU0sRUFBRSxFQUFFO0FBQ1YsV0FBUyxFQUFFLEVBQUU7QUFDYixRQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3BCLFdBQVMsRUFBRSxJQUFJO0FBQ2YsZ0JBQWMsRUFBRSxLQUFLO0FBQ3JCLFdBQVMsRUFBRSxJQUFJOztBQUVmLFlBQVUsRUFBRSxvQkFB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bEMsWUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0IsWUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FFM0IsQ0FBQyxDQUFDOztBQUVILFFBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUMsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUUsT0FBTyxDQUFFLENBQUM7R0FDbEQ7O0FBRUQsZUFBYSxFQUFFLHVCQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDN0IsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN0RCxRQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdEQsUUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDOztBQUVkLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMs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RUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsS0FBSyxDQUFFLENBQzVCLE1BQU0sQ0FBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUUsQ0FDdkMsUUFBUSxDQUFDLFVBQVMsQ0FBQyxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDNUIsQ0FBQyxDQUNELEtBQUssRUFBRSxDQUFDO0dBQ1o7O0NBRUYsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuQmFja2JvbmUuJCA9ICQ7XG5cbnZhciBBcnR3b3JrQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2NvbGxlY3Rpb25zL2FydHdvcmtzJyk7XG52YXIgQXJ0d29yayA9IHJlcXVpcmUoJ21vZGVscy9hcnR3b3JrJyk7XG52YXIgVGhyZWVKU1ZpZXcgPSByZXF1aXJlKCd2aWV3cy90aHJlZWpzdmlldycpO1xuXG52YXIgVEhSRUUgPSByZXF1aXJlKCd0aHJlZScpO1xudmFyIFRXRUVOID0gcmVxdWlyZSgndHdlZW4uanMnKTtcbnZhciBDU1MzRFJlbmRlcmVyID0gcmVxdWlyZSgnbGlicy9DU1MzRFJlbmRlcmVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gIG9iamVjdHM6IFtdLFxuICBhY3RpdmVJZDogJ2QnLFxuICBjYW1Qb3M6IHt9LCBcbiAgY2FtUm90OiB7fSxcbiAgdGlsdFNwZWVkOiA0MCxcbiAgbW91c2VYOiAwLCBtb3VzZVk6IDAsXG4gIG1vdXNlVGlsdDogdHJ1ZSxcbiAgYmlyZHNleWVBY3RpdmU6IGZhbHNlLFxuICBmb2dBY3RpdmU6IHRydWUsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oYXJ0d29ya3ZpZXdzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5hcnR3b3JrVmlld3MgPSBhcnR3b3Jrdmlld3M7XG4gICAgdGhpcy4kYmlyZEJ0biA9ICQoJy5qcy1iaXJkc2V5ZScpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICQoZG9jdW1lbnQpLmJpbmQoJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHNlbGYuaGFuZGxlTW91c2VNb3ZlKGUpO1xuICAgIH0pO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYuaGFuZGxlUmVzaXplKCk7XG4gICAgfSk7XG5cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuXG4gICAgdGhpcy5pbml0U2NlbmUoKTtcbiAgICB0aGlzLmFuaW1hdGUoKTtcblxuICAgIC8vIHZhciBwb3MgPSBbODAwLDAsNTAwXTtcbiAgICAvLyB0aGlzLm1vdmVDYW1lcmEocG9zKTtcblxuICB9LFxuXG4gIGhhbmRsZVJlc2l6ZTogZnVuY3Rpb24oZSkge1xuICAgIHRoaXMuY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xuICB9LFxuXG4gIGluaXRTY2VuZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoIDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMSwgNTAwMCApO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSAxNTAwO1xuXG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5DU1MzRFJlbmRlcmVyKCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XG4gICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gMDtcbiAgICB0aGlzLiRlbC5hcHBlbmQoIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCApO1xuXG4gICAgXy5lYWNoKHRoaXMuYXJ0d29ya1ZpZXdzLCBmdW5jdGlvbihhKcKge1xuICAgICAgYS5yZW5kZXIoKTtcbiAgICAgIHZhciBvYmplY3QgPSBuZXcgVEhSRUUuQ1NTM0RPYmplY3QoIGEuZWwgKTtcbiAgICAgIHNlbGYuc2NlbmUuYWRkKG9iamVjdCk7XG5cbiAgICAgIHZhciBwb3MgPSBhLm1vZGVsLmdldCgncG9zaXRpb24nKTtcbiAgICAgIHZhciByb3QgPSBhLm1vZGVsLmdldCgncm90YXRpb24nKTtcbiAgICAgIG9iamVjdC5wb3NpdGlvbi54ID0gcG9zWzBdO1xuICAgICAgb2JqZWN0LnBvc2l0aW9uLnkgPSBwb3NbMV07XG4gICAgICBvYmplY3QucG9zaXRpb24ueiA9IHBvc1syXTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi54ID0gcm90WzBdO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnkgPSByb3RbMV07XG4gICAgICBvYmplY3Qucm90YXRpb24ueiA9IHJvdFsyXTtcbiAgICAgIHNlbGYub2JqZWN0cy5wdXNoKG9iamVjdCk7XG5cbiAgICB9KTtcblxuICAgIHZhciBkdW1teUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5kdW1teU9iaiA9IG5ldyBUSFJFRS5DU1MzRE9iamVjdCggZHVtbXlFbCApO1xuICB9LFxuXG4gIG1vdmVUb0FydHdvcms6IGZ1bmN0aW9uKGlkLCBzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBwb3MgPSB0aGlzLmFydHdvcmtWaWV3c1tpZF0ubW9kZWwuZ2V0KCdwb3NpdGlvbicpO1xuICAgIHZhciByb3QgPSB0aGlzLmFydHdvcmtWaWV3c1tpZF0ubW9kZWwuZ2V0KCdyb3RhdGlvbicpO1xuICAgIHZhciBzcGVlZCA9IHM7XG5cbiAgICB0aGlzLm1vdXNlVGlsdCA9IHRoaXMuYXJ0d29ya1ZpZXdzW2lkXS5tb2RlbC5nZXQoJ2ZpdHRvc2NyZWVuJykgPyBmYWxzZSA6IHRydWU7XG5cbiAgICBzZWxmLm9sZEFjdGl2ZUlkID0gc2VsZi5hY3RpdmVJZDtcbiAgICBzZWxmLmFjdGl2ZUlkID0gaWQ7XG4gICAgLy8gaWYoc2VsZi5vbGRBY3RpdmVJZCAhPSAnZCcgJiYgc2VsZi5vbGRBY3RpdmVJZCAhPSBpZCkge1xuICAgIC8vICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKcKge1xuICAgIC8vICAgfSwgcyk7XG4gICAgLy8gfVxuICAgIGlmKHNlbGYub2xkQWN0aXZlSWQgIT0gJ2QnKSBzZWxmLmFydHdvcmtWaWV3c1tzZWxmLm9sZEFjdGl2ZUlkXS5kZWFjdGl2YXRlKCk7XG4gICAgLy8gc2VsZi5hcnR3b3JrVmlld3Nbc2VsZi5hY3RpdmVJZF0uYWN0aXZhdGUoKTtcblxuICAgIHRoaXMuZHVtbXlPYmoucG9zaXRpb24uc2V0KHBvc1swXSwgcG9zWzFdLCBwb3NbMl0pO1xuICAgIHRoaXMuZHVtbXlPYmoucm90YXRpb24uc2V0KHJvdFswXSwgcm90WzFdLCByb3RbMl0pO1xuICAgIHRoaXMuZHVtbXlPYmoudHJhbnNsYXRlWih0aGlzLmNhbGN1bGF0ZURpc3RhbmNlKHRoaXMuYXJ0d29ya1ZpZXdzW2lkXS5tb2RlbC5nZXQoJ3ZpZXdwb3J0JyksIHRoaXMuYXJ0d29ya1ZpZXdzW2lkXS5tb2RlbC5nZXQoJ3NpemUnKSkpO1xuXG4gICAgdGhpcy5jYW1Qb3MgPSB0aGlzLmR1bW15T2JqLnBvc2l0aW9uO1xuICAgIHRoaXMuY2FtUm90ID0gdGhpcy5kdW1teU9iai5yb3RhdGlvbjtcblxuICAgIHRoaXMuJGJpcmRCdG4uY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG5cbiAgICBuZXcgVFdFRU4uVHdlZW4oIHNlbGYuY2FtZXJhLnBvc2l0aW9uIClcbiAgICAgIC50byggc2VsZi5jYW1Qb3MsIHNwZWVkIClcbiAgICAgIC5lYXNpbmcoIFRXRUVOLkVhc2luZy5DdWJpYy5Jbk91dCApXG4gICAgICAuc3RhcnQoKTtcblxuICAgIG5ldyBUV0VFTi5Ud2Vlbiggc2VsZi5jYW1lcmEucm90YXRpb24gKVxuICAgICAgLnRvKCB7IHg6IHNlbGYuY2FtUm90LngsIHk6IHNlbGYuY2FtUm90LnksIHo6IHNlbGYuY2FtUm90LnogfSwgc3BlZWQgKVxuICAgICAgLmVhc2luZyggVFdFRU4uRWFzaW5nLkN1YmljLkluT3V0IClcbiAgICAgIC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7XG4gICAgICAgIHNlbGYuJGJpcmRCdG4uY3NzKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyk7XG4gICAgICAgIHNlbGYuYXJ0d29ya1ZpZXdzW3NlbGYuYWN0aXZlSWRdLmFjdGl2YXRlKCk7XG4gICAgICB9KVxuICAgICAgLnN0YXJ0KCk7XG5cbiAgfSxcblxuICBhbmltYXRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRlLmJpbmQodGhpcykpO1xuXG4gICAgVFdFRU4udXBkYXRlKCk7XG5cbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSk7XG5cbiAgICAvKiBvYmplY3Qgb3BhY2l0eSAqL1xuXG4gICAgaWYodGhpcy5mb2dBY3RpdmUpIHtcbiAgICAgICQuZWFjaCh0aGlzLm9iamVjdHMsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGlzdCA9IHNlbGYuZGlzdGFuY2VUb0NhbWVyYSh0aGlzLnBvc2l0aW9uKTtcbiAgICAgICAgZGlzdCAtPSAxMDAwO1xuICAgICAgICBkaXN0ID0gZGlzdCA8IDAgPyAwIDogZGlzdDtcbiAgICAgICAgdmFyIG9wYWMgPSAxIC0gKGRpc3QgLyA5MDApO1xuICAgICAgICBpZihvcGFjIDw9IDApIG9wYWMgPSAuMDU7XG4gICAgICAgICQodGhpcy5lbGVtZW50KS5jc3MoJ29wYWNpdHknLCBvcGFjKTtcbiAgICAgIH0pO1xuICAgIH1lbHNle1xuICAgICAgJC5lYWNoKHRoaXMub2JqZWN0cywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvcGFjID0gMTtcbiAgICAgICAgJCh0aGlzLmVsZW1lbnQpLmNzcygnb3BhY2l0eScsIG9wYWMpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyogY2FtZXJhIHRpbHQgKi9cblxuICAgIGlmKHRoaXMubW91c2VUaWx0ICYmICF0aGlzLmJpcmRzZXllQWN0aXZlKSB7XG5cbiAgICAgIHZhciB4UGVyYyA9IDEwMCAvIHdpbmRvdy5pbm5lcldpZHRoICogdGhpcy5tb3VzZVg7XG4gICAgICB2YXIgeVBlcmMgPSAxMDAgLyB3aW5kb3cuaW5uZXJIZWlnaHQgKiB0aGlzLm1vdXNlWTtcbiAgICAgIHZhciB4VGlsdCA9ICguMSAvIDEwMCAqICh4UGVyYyAtIDUwKSkgKiAtMTtcbiAgICAgIHZhciB5VGlsdCA9ICguMSAvIDEwMCAqICh5UGVyYyAtIDUwKSkgKiAtMTtcblxuICAgICAgdGhpcy5jYW1lcmEucm90YXRpb24ueCArPSAoKHRoaXMuY2FtUm90LnggKyB5VGlsdCkgLSB0aGlzLmNhbWVyYS5yb3RhdGlvbi54KSAvIHRoaXMudGlsdFNwZWVkO1xuICAgICAgdGhpcy5jYW1lcmEucm90YXRpb24ueSArPSAoKHRoaXMuY2FtUm90LnkgKyB4VGlsdCkgLSB0aGlzLmNhbWVyYS5yb3RhdGlvbi55KSAvIHRoaXMudGlsdFNwZWVkO1xuXG4gICAgfVxuXG4gIH0sXG5cbiAgY2FsY3VsYXRlRGlzdGFuY2U6IGZ1bmN0aW9uKHZwLCBzaXplKSB7XG4gICAgdmFyIGR4ID0gc2l6ZVswXTtcbiAgICB2YXIgZHkgPSBzaXplWzFdO1xuICAgIHZhciBkaXN0ID0gZHkgLyAyIC8gTWF0aC50YW4oTWF0aC5QSSAqIDc1IC8gMzYwKTtcblxuICAgIGlmKHZwID09ICdjb3ZlcicpIHtcblxuICAgICAgcmV0dXJuIGRpc3Q7XG5cbiAgICB9ZWxzZSBpZih2cCA9PSAnY29udGFpbicpIHtcblxuICAgICAgcmV0dXJuIGRpc3QgKyAyMDA7XG5cbiAgICB9ZWxzZXtcblxuICAgICAgcmV0dXJuIHZwO1xuXG4gICAgfVxuICB9LFxuXG4gIGhhbmRsZU1vdXNlTW92ZTogZnVuY3Rpb24oZSkge1xuICAgIHRoaXMubW91c2VYID0gZS5wYWdlWDtcbiAgICB0aGlzLm1vdXNlWSA9IGUucGFnZVk7XG4gIH0sXG5cbiAgZGlzdGFuY2VUb0NhbWVyYTogZnVuY3Rpb24odjEpIHtcbiAgICB2YXIgdjIgPSB0aGlzLmNhbWVyYS5wb3NpdGlvbjtcbiAgICB2YXIgZHggPSB2MS54IC0gdjIueDtcbiAgICB2YXIgZHkgPSB2MS55IC0gdjIueTtcbiAgICB2YXIgZHogPSB2MS56IC0gdjIuejtcblxuICAgIHJldHVybiBNYXRoLnNxcnQoZHgqZHgrZHkqZHkrZHoqZHopO1xuICB9LFxuXG4gIHRvZ2dsZUJpcmRzRXllOiBmdW5jdGlvbihjb29yZHMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHNwZWVkID0gMTAwMDtcblxuICAgIGlmKHRoaXMuYmlyZHNleWVBY3RpdmUpIHtcbiAgICAgIHRoaXMubW92ZVRvQXJ0d29yayh0aGlzLmFjdGl2ZUlkLCAxMDAwKTtcbiAgICAgIHRoaXMuYmlyZHNleWVBY3RpdmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZm9nQWN0aXZlID0gdHJ1ZTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMuYmlyZHNleWVBY3RpdmUgPSB0cnVlO1xuICAgICAgdGhpcy5mb2dBY3RpdmUgPSBmYWxzZTtcblxuICAgICAgLy8gJCgnLnNwYWNlLWNvbnRhaW5lcicpLnRyYW5zaXRpb24oeydiYWNrZ3JvdW5kLWNvbG9yJzogJyNhYWZmZmYnfSwgMTAwMCk7XG5cbiAgICAgIG5ldyBUV0VFTi5Ud2Vlbiggc2VsZi5jYW1lcmEucG9zaXRpb24gKVxuICAgICAgICAudG8oIHsgeDogY29vcmRzLnBvc2l0aW9uWzBdLCB5OiBjb29yZHMucG9zaXRpb25bMV0sIHo6IGNvb3Jkcy5wb3NpdGlvblsyXSB9LCBzcGVlZCApXG4gICAgICAgIC5lYXNpbmcoIFRXRUVOLkVhc2luZy5DdWJpYy5Jbk91dCApXG4gICAgICAgIC5zdGFydCgpO1xuXG4gICAgICB2YXIgcm90WCA9IGNvb3Jkcy5yb3RhdGlvblswXSAqIE1hdGguUEkgLyAxODA7XG4gICAgICB2YXIgcm90WSA9IGNvb3Jkcy5yb3RhdGlvblsxXSAqIE1hdGguUEkgLyAxODA7XG4gICAgICB2YXIgcm90WiA9IGNvb3Jkcy5yb3RhdGlvblsyXSAqIE1hdGguUEkgLyAxODA7XG5cbiAgICAgIG5ldyBUV0VFTi5Ud2Vlbiggc2VsZi5jYW1lcmEucm90YXRpb24gKVxuICAgICAgICAudG8oIHsgeDogcm90WCwgeTogcm90WSwgejogcm90WiB9LCBzcGVlZCApXG4gICAgICAgIC5lYXNpbmcoIFRXRUVOLkVhc2luZy5DdWJpYy5Jbk91dCApXG4gICAgICAgIC5zdGFydCgpO1xuICAgIH1cblxuICB9LFxuXG4gIHR3ZWVuRm92OiBmdW5jdGlvbihuZXdGb3YsIHNwZWVkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvbGRGb3YgPSBzZWxmLmNhbWVyYS5mb3Y7XG4gICAgdmFyIG5ld0ZvdiA9IG5ld0ZvdjtcblxuICAgIG5ldyBUV0VFTi5Ud2Vlbigge2Zvdjogb2xkRm92fSApXG4gICAgICAudG8oIHsgZm92OiBuZXdGb3YgfSwgc3BlZWQgKVxuICAgICAgLmVhc2luZyggVFdFRU4uRWFzaW5nLlNpbnVzb2lkYWwuSW5PdXQgKVxuICAgICAgLm9uVXBkYXRlKGZ1bmN0aW9uKGspwqB7XG4gICAgICAgIHNlbGYuY2FtZXJhLmZvdiA9IHRoaXMuZm92O1xuICAgICAgfSlcbiAgICAgIC5zdGFydCgpO1xuICB9XG5cbn0pOyJdfQ==
},{"backbone":2,"collections/artworks":15,"jquery":12,"libs/CSS3DRenderer":16,"models/artwork":18,"tween.js":13,"underscore":14,"views/threejsview":33}]},{},[1])