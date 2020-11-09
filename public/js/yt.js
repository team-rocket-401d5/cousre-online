'use strict';

function _instanceof(left, right) {
  if (right != null && typeof Symbol !== 'undefined' && right[Symbol.hasInstance]) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _typeof(obj) {
  '@babel/helpers - typeof';
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

/*! yt-player. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
import { EventEmitter } from 'events';

import loadScript from 'load-script2';

var YOUTUBE_IFRAME_API_SRC = 'https://www.youtube.com/iframe_api';
var YOUTUBE_STATES = {
  '-1': 'unstarted',
  0: 'ended',
  1: 'playing',
  2: 'paused',
  3: 'buffering',
  5: 'cued',
};
var YOUTUBE_ERROR = {
  // The request contains an invalid parameter value. For example, this error
  // occurs if you specify a videoId that does not have 11 characters, or if the
  // videoId contains invalid characters, such as exclamation points or asterisks.
  INVALID_PARAM: 2,
  // The requested content cannot be played in an HTML5 player or another error
  // related to the HTML5 player has occurred.
  HTML5_ERROR: 5,
  // The video requested was not found. This error occurs when a video has been
  // removed (for any reason) or has been marked as private.
  NOT_FOUND: 100,
  // The owner of the requested video does not allow it to be played in embedded
  // players.
  UNPLAYABLE_1: 101,
  // This error is the same as 101. It's just a 101 error in disguise!
  UNPLAYABLE_2: 150,
};
var loadIframeAPICallbacks = [];
/**
 * YouTube Player. Exposes a better API, with nicer events.
 * @param {HTMLElement|selector} element
 */

var YouTubePlayer = /*#__PURE__*/ (function (_EventEmitter) {
  _inherits(YouTubePlayer, _EventEmitter);

  var _super = _createSuper(YouTubePlayer);

  function YouTubePlayer(element, opts) {
    var _this;

    _classCallCheck(this, YouTubePlayer);

    _this = _super.call(this);
    var elem = typeof element === 'string' ? document.querySelector(element) : element;

    if (elem.id) {
      _this._id = elem.id; // use existing element id
    } else {
      _this._id = elem.id = 'ytplayer-' + Math.random().toString(16).slice(2, 8);
    }

    _this._opts = Object.assign(
      {
        width: 640,
        height: 360,
        autoplay: false,
        captions: undefined,
        controls: true,
        keyboard: true,
        fullscreen: true,
        annotations: true,
        modestBranding: false,
        related: true,
        timeupdateFrequency: 1000,
        playsInline: true,
        start: 0,
      },
      opts
    );
    _this.videoId = null;
    _this.destroyed = false;
    _this._api = null;
    _this._autoplay = false; // autoplay the first video?

    _this._player = null;
    _this._ready = false; // is player ready?

    _this._queue = [];
    _this._interval = null; // Setup listeners for 'timeupdate' events. The YouTube Player does not fire
    // 'timeupdate' events, so they are simulated using a setInterval().

    _this._startInterval = _this._startInterval.bind(_assertThisInitialized(_this));
    _this._stopInterval = _this._stopInterval.bind(_assertThisInitialized(_this));

    _this.on('playing', _this._startInterval);

    _this.on('unstarted', _this._stopInterval);

    _this.on('ended', _this._stopInterval);

    _this.on('paused', _this._stopInterval);

    _this.on('buffering', _this._stopInterval);

    _this._loadIframeAPI(function (err, api) {
      if (err) return _this._destroy(new Error('YouTube Iframe API failed to load'));
      _this._api = api; // If load(videoId, [autoplay, [size]]) was called before Iframe API
      // loaded, ensure it gets called again now

      if (_this.videoId) _this.load(_this.videoId, _this._autoplay, _this._start);
    });

    return _this;
  }

  _createClass(YouTubePlayer, [
    {
      key: 'load',
      value: function load(videoId) {
        var autoplay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        if (this.destroyed) return;
        this.videoId = videoId;
        this._autoplay = autoplay;
        this._start = start; // If the Iframe API is not ready yet, do nothing. Once the Iframe API is
        // ready, `load(this.videoId)` will be called.

        if (!this._api) return; // If there is no player instance, create one.

        if (!this._player) {
          this._createPlayer(videoId);

          return;
        } // If the player instance is not ready yet, do nothing. Once the player
        // instance is ready, `load(this.videoId)` will be called. This ensures that
        // the last call to `load()` is the one that takes effect.

        if (!this._ready) return; // If the player instance is ready, load the given `videoId`.

        if (autoplay) {
          this._player.loadVideoById(videoId, start);
        } else {
          this._player.cueVideoById(videoId, start);
        }
      },
    },
    {
      key: 'play',
      value: function play() {
        if (this._ready) this._player.playVideo();
        else this._queueCommand('play');
      },
    },
    {
      key: 'pause',
      value: function pause() {
        if (this._ready) this._player.pauseVideo();
        else this._queueCommand('pause');
      },
    },
    {
      key: 'stop',
      value: function stop() {
        if (this._ready) this._player.stopVideo();
        else this._queueCommand('stop');
      },
    },
    {
      key: 'seek',
      value: function seek(seconds) {
        if (this._ready) this._player.seekTo(seconds, true);
        else this._queueCommand('seek', seconds);
      },
    },
    {
      key: 'setVolume',
      value: function setVolume(volume) {
        if (this._ready) this._player.setVolume(volume);
        else this._queueCommand('setVolume', volume);
      },
    },
    {
      key: 'getVolume',
      value: function getVolume() {
        return (this._ready && this._player.getVolume()) || 0;
      },
    },
    {
      key: 'mute',
      value: function mute() {
        if (this._ready) this._player.mute();
        else this._queueCommand('mute');
      },
    },
    {
      key: 'unMute',
      value: function unMute() {
        if (this._ready) this._player.unMute();
        else this._queueCommand('unMute');
      },
    },
    {
      key: 'isMuted',
      value: function isMuted() {
        return (this._ready && this._player.isMuted()) || false;
      },
    },
    {
      key: 'setSize',
      value: function setSize(width, height) {
        if (this._ready) this._player.setSize(width, height);
        else this._queueCommand('setSize', width, height);
      },
    },
    {
      key: 'setPlaybackRate',
      value: function setPlaybackRate(rate) {
        if (this._ready) this._player.setPlaybackRate(rate);
        else this._queueCommand('setPlaybackRate', rate);
      },
    },
    {
      key: 'setPlaybackQuality',
      value: function setPlaybackQuality(suggestedQuality) {
        if (this._ready) this._player.setPlaybackQuality(suggestedQuality);
        else this._queueCommand('setPlaybackQuality', suggestedQuality);
      },
    },
    {
      key: 'getPlaybackRate',
      value: function getPlaybackRate() {
        return (this._ready && this._player.getPlaybackRate()) || 1;
      },
    },
    {
      key: 'getAvailablePlaybackRates',
      value: function getAvailablePlaybackRates() {
        return (this._ready && this._player.getAvailablePlaybackRates()) || [1];
      },
    },
    {
      key: 'getDuration',
      value: function getDuration() {
        return (this._ready && this._player.getDuration()) || 0;
      },
    },
    {
      key: 'getProgress',
      value: function getProgress() {
        return (this._ready && this._player.getVideoLoadedFraction()) || 0;
      },
    },
    {
      key: 'getState',
      value: function getState() {
        return (this._ready && YOUTUBE_STATES[this._player.getPlayerState()]) || 'unstarted';
      },
    },
    {
      key: 'getCurrentTime',
      value: function getCurrentTime() {
        return (this._ready && this._player.getCurrentTime()) || 0;
      },
    },
    {
      key: 'destroy',
      value: function destroy() {
        this._destroy();
      },
    },
    {
      key: '_destroy',
      value: function _destroy(err) {
        if (this.destroyed) return;
        this.destroyed = true;

        if (this._player) {
          this._player.stopVideo && this._player.stopVideo();

          this._player.destroy();
        }

        this.videoId = null;
        this._id = null;
        this._opts = null;
        this._api = null;
        this._player = null;
        this._ready = false;
        this._queue = null;

        this._stopInterval();

        this.removeListener('playing', this._startInterval);
        this.removeListener('paused', this._stopInterval);
        this.removeListener('buffering', this._stopInterval);
        this.removeListener('unstarted', this._stopInterval);
        this.removeListener('ended', this._stopInterval);
        if (err) this.emit('error', err);
      },
    },
    {
      key: '_queueCommand',
      value: function _queueCommand(command) {
        if (this.destroyed) return;

        for (
          var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1;
          _key < _len;
          _key++
        ) {
          args[_key - 1] = arguments[_key];
        }

        this._queue.push([command, args]);
      },
    },
    {
      key: '_flushQueue',
      value: function _flushQueue() {
        while (this._queue.length) {
          var command = this._queue.shift();

          this[command[0]].apply(this, command[1]);
        }
      },
    },
    {
      key: '_loadIframeAPI',
      value: function _loadIframeAPI(cb) {
        // If API is loaded, there is nothing else to do
        if (window.YT && typeof window.YT.Player === 'function') {
          return cb(null, window.YT);
        } // Otherwise, queue callback until API is loaded

        loadIframeAPICallbacks.push(cb);
        var scripts = Array.from(document.getElementsByTagName('script'));
        var isLoading = scripts.some(function (script) {
          return script.src === YOUTUBE_IFRAME_API_SRC;
        }); // If API <script> tag is not present in the page, inject it. Ensures that
        // if user includes a hardcoded <script> tag in HTML for performance, another
        // one will not be added

        if (!isLoading) {
          loadScript(YOUTUBE_IFRAME_API_SRC).catch(function (err) {
            while (loadIframeAPICallbacks.length) {
              var loadCb = loadIframeAPICallbacks.shift();
              loadCb(err);
            }
          });
        }

        var prevOnYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;

        window.onYouTubeIframeAPIReady = function () {
          if (typeof prevOnYouTubeIframeAPIReady === 'function') {
            prevOnYouTubeIframeAPIReady();
          }

          while (loadIframeAPICallbacks.length) {
            var loadCb = loadIframeAPICallbacks.shift();
            loadCb(null, window.YT);
          }
        };
      },
    },
    {
      key: '_createPlayer',
      value: function _createPlayer(videoId) {
        var _this2 = this;

        if (this.destroyed) return;
        var opts = this._opts;
        this._player = new this._api.Player(this._id, {
          width: opts.width,
          height: opts.height,
          videoId: videoId,
          // (Not part of documented API) This parameter controls the hostname that
          // videos are loaded from. Set to `'https://www.youtube-nocookie.com'`
          // for enhanced privacy.
          host: opts.host,
          playerVars: {
            // This parameter specifies whether the initial video will automatically
            // start to play when the player loads. Supported values are 0 or 1. The
            // default value is 0.
            autoplay: opts.autoplay ? 1 : 0,
            // Setting the parameter's value to 1 causes closed captions to be shown
            // by default, even if the user has turned captions off. The default
            // behavior is based on user preference.
            cc_load_policy: opts.captions != null ? (opts.captions !== false ? 1 : 0) : undefined,
            // default to not setting this option
            // Sets the player's interface language. The parameter value is an ISO
            // 639-1 two-letter language code or a fully specified locale. For
            // example, fr and fr-ca are both valid values. Other language input
            // codes, such as IETF language tags (BCP 47) might also be handled
            // properly.
            hl: opts.captions != null && opts.captions !== false ? opts.captions : undefined,
            // default to not setting this option
            // This parameter specifies the default language that the player will
            // use to display captions. Set the parameter's value to an ISO 639-1
            // two-letter language code.
            cc_lang_pref:
              opts.captions != null && opts.captions !== false ? opts.captions : undefined,
            // default to not setting this option
            // This parameter indicates whether the video player controls are
            // displayed. For IFrame embeds that load a Flash player, it also defines
            // when the controls display in the player as well as when the player
            // will load. Supported values are:
            //   - controls=0 – Player controls do not display in the player. For
            //                  IFrame embeds, the Flash player loads immediately.
            //   - controls=1 – (default) Player controls display in the player. For
            //                  IFrame embeds, the controls display immediately and
            //                  the Flash player also loads immediately.
            //   - controls=2 – Player controls display in the player. For IFrame
            //                  embeds, the controls display and the Flash player
            //                  loads after the user initiates the video playback.
            controls: opts.controls ? 2 : 0,
            // Setting the parameter's value to 1 causes the player to not respond to
            // keyboard controls. The default value is 0, which means that keyboard
            // controls are enabled.
            disablekb: opts.keyboard ? 0 : 1,
            // Setting the parameter's value to 1 enables the player to be
            // controlled via IFrame or JavaScript Player API calls. The default
            // value is 0, which means that the player cannot be controlled using
            // those APIs.
            enablejsapi: 1,
            // Setting this parameter to 0 prevents the fullscreen button from
            // displaying in the player. The default value is 1, which causes the
            // fullscreen button to display.
            fs: opts.fullscreen ? 1 : 0,
            // Setting the parameter's value to 1 causes video annotations to be
            // shown by default, whereas setting to 3 causes video annotations to not
            // be shown by default. The default value is 1.
            iv_load_policy: opts.annotations ? 1 : 3,
            // This parameter lets you use a YouTube player that does not show a
            // YouTube logo. Set the parameter value to 1 to prevent the YouTube logo
            // from displaying in the control bar. Note that a small YouTube text
            // label will still display in the upper-right corner of a paused video
            // when the user's mouse pointer hovers over the player.
            modestbranding: opts.modestBranding ? 1 : 0,
            // This parameter provides an extra security measure for the IFrame API
            // and is only supported for IFrame embeds. If you are using the IFrame
            // API, which means you are setting the enablejsapi parameter value to 1,
            // you should always specify your domain as the origin parameter value.
            origin: window.location.origin,
            // This parameter controls whether videos play inline or fullscreen in an
            // HTML5 player on iOS. Valid values are:
            //   - 0: This value causes fullscreen playback. This is currently the
            //        default value, though the default is subject to change.
            //   - 1: This value causes inline playback for UIWebViews created with
            //        the allowsInlineMediaPlayback property set to TRUE.
            playsinline: opts.playsInline ? 1 : 0,
            // This parameter indicates whether the player should show related
            // videos from the same channel (0) or from any channel (1) when
            // playback of the video ends. The default value is 1.
            rel: opts.related ? 1 : 0,
            // (Not part of documented API) Allow html elements with higher z-index
            // to be shown on top of the YouTube player.
            wmode: 'opaque',
            // This parameter causes the player to begin playing the video at the given number
            // of seconds from the start of the video. The parameter value is a positive integer.
            // Note that similar to the seek function, the player will look for the closest
            // keyframe to the time you specify. This means that sometimes the play head may seek
            // to just before the requested time, usually no more than around two seconds.
            start: opts.start,
          },
          events: {
            onReady: function onReady() {
              return _this2._onReady(videoId);
            },
            onStateChange: function onStateChange(data) {
              return _this2._onStateChange(data);
            },
            onPlaybackQualityChange: function onPlaybackQualityChange(data) {
              return _this2._onPlaybackQualityChange(data);
            },
            onPlaybackRateChange: function onPlaybackRateChange(data) {
              return _this2._onPlaybackRateChange(data);
            },
            onError: function onError(data) {
              return _this2._onError(data);
            },
          },
        });
      },
      /**
       * This event fires when the player has finished loading and is ready to begin
       * receiving API calls.
       */
    },
    {
      key: '_onReady',
      value: function _onReady(videoId) {
        if (this.destroyed) return;
        this._ready = true; // Once the player is ready, always call `load(videoId, [autoplay, [size]])`
        // to handle these possible cases:
        //
        //   1. `load(videoId, true)` was called before the player was ready. Ensure that
        //      the selected video starts to play.
        //
        //   2. `load(videoId, false)` was called before the player was ready. Now the
        //      player is ready and there's nothing to do.
        //
        //   3. `load(videoId, [autoplay])` was called multiple times before the player
        //      was ready. Therefore, the player was initialized with the wrong videoId,
        //      so load the latest videoId and potentially autoplay it.

        this.load(this.videoId, this._autoplay, this._start);

        this._flushQueue();
      },
      /**
       * Called when the player's state changes. We emit friendly events so the user
       * doesn't need to use YouTube's YT.PlayerState.* event constants.
       */
    },
    {
      key: '_onStateChange',
      value: function _onStateChange(data) {
        if (this.destroyed) return;
        var state = YOUTUBE_STATES[data.data];

        if (state) {
          // Send a 'timeupdate' anytime the state changes. When the video halts for any
          // reason ('paused', 'buffering', or 'ended') no further 'timeupdate' events
          // should fire until the video unhalts.
          if (['paused', 'buffering', 'ended'].includes(state)) this._onTimeupdate();
          this.emit(state); // When the video changes ('unstarted' or 'cued') or starts ('playing') then a
          // 'timeupdate' should follow afterwards (never before!) to reset the time.

          if (['unstarted', 'playing', 'cued'].includes(state)) this._onTimeupdate();
        } else {
          throw new Error('Unrecognized state change: ' + data);
        }
      },
      /**
       * This event fires whenever the video playback quality changes. Possible
       * values are: 'small', 'medium', 'large', 'hd720', 'hd1080', 'highres'.
       */
    },
    {
      key: '_onPlaybackQualityChange',
      value: function _onPlaybackQualityChange(data) {
        if (this.destroyed) return;
        this.emit('playbackQualityChange', data.data);
      },
      /**
       * This event fires whenever the video playback rate changes.
       */
    },
    {
      key: '_onPlaybackRateChange',
      value: function _onPlaybackRateChange(data) {
        if (this.destroyed) return;
        this.emit('playbackRateChange', data.data);
      },
      /**
       * This event fires if an error occurs in the player.
       */
    },
    {
      key: '_onError',
      value: function _onError(data) {
        if (this.destroyed) return;
        var code = data.data; // The HTML5_ERROR error occurs when the YouTube player needs to switch from
        // HTML5 to Flash to show an ad. Ignore it.

        if (code === YOUTUBE_ERROR.HTML5_ERROR) return; // The remaining error types occur when the YouTube player cannot play the
        // given video. This is not a fatal error. Report it as unplayable so the user
        // has an opportunity to play another video.

        if (
          code === YOUTUBE_ERROR.UNPLAYABLE_1 ||
          code === YOUTUBE_ERROR.UNPLAYABLE_2 ||
          code === YOUTUBE_ERROR.NOT_FOUND ||
          code === YOUTUBE_ERROR.INVALID_PARAM
        ) {
          return this.emit('unplayable', this.videoId);
        } // Unexpected error, does not match any known type

        this._destroy(new Error('YouTube Player Error. Unknown error code: ' + code));
      },
      /**
       * This event fires when the time indicated by the `getCurrentTime()` method
       * has been updated.
       */
    },
    {
      key: '_onTimeupdate',
      value: function _onTimeupdate() {
        this.emit('timeupdate', this.getCurrentTime());
      },
    },
    {
      key: '_startInterval',
      value: function _startInterval() {
        var _this3 = this;

        this._interval = setInterval(function () {
          return _this3._onTimeupdate();
        }, this._opts.timeupdateFrequency);
      },
    },
    {
      key: '_stopInterval',
      value: function _stopInterval() {
        clearInterval(this._interval);
        this._interval = null;
      },
    },
  ]);

  return YouTubePlayer;
})(EventEmitter);

export default YouTubePlayer;
