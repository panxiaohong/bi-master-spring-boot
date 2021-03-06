/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _tokenRefreshInterceptorJq = __webpack_require__(9);

	var _tokenRefreshInterceptorJq2 = _interopRequireDefault(_tokenRefreshInterceptorJq);

	var _tokenRefreshInterceptor = __webpack_require__(3);

	var _credentials = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 为es5提供调用
	if (!window.ccmsSdk) window.ccmsSdk = {}; /**
	                                           * @author shuyun
	                                           * @homepage http://github.com/qixman
	                                           * @date 2016/11/16
	                                           */
	/**
	 * @author qix
	 * @homepage https://github.com/qixman/
	 * @since 2016-11-16
	 */

	Object.assign(window.ccmsSdk, {
	  tokenRefreshInterceptor: _tokenRefreshInterceptorJq2.default,
	  $ccmsAuth: {
	    setAuthFailedBehavior: _tokenRefreshInterceptor.setAuthFailedBehavior,
	    setRefreshTokenUrl: _tokenRefreshInterceptor.setRefreshTokenUrl,
	    getRequestCredential: _credentials.getRequestCredential,
	    setRequestCredential: _credentials.setRequestCredential
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = angular;

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.refreshTokenUrl = exports.execAuthFailure = undefined;
	exports.setAuthFailedBehavior = setAuthFailedBehavior;
	exports.setRefreshTokenUrl = setRefreshTokenUrl;

	var _credentials = __webpack_require__(4);

	var _metadata = __webpack_require__(6);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
	                                                                                                                                                                                                                   * @author Kuitos
	                                                                                                                                                                                                                   * @homepage https://github.com/kuitos/
	                                                                                                                                                                                                                   * @since 2016-09-09
	                                                                                                                                                                                                                   */


	var needToRefreshToken = false;

	var execAuthFailure = exports.execAuthFailure = function execAuthFailure() {};
	function setAuthFailedBehavior() {
		var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : execAuthFailure;


		exports.execAuthFailure = execAuthFailure = function execAuthFailure(rejection) {

			try {
				fn();
			} finally {
				(0, _credentials.removeRequestCredential)();
			}

			var ex = new TypeError('Unauthorized! Credential was expired or had been removed, pls set it before the get action!');
			console.error(ex);

			if (typeof rejection.abort === 'function') {
				rejection.abort(ex);
			} else {
				rejection.status = rejection.status || 401;
				rejection.statusText = rejection.statusText || 'Unauthorized!';
				var injector = __webpack_require__(7).default;
				return injector.get('$q').reject(rejection);
			}
		};
	}

	var refreshTokenUrl = exports.refreshTokenUrl = '';
	function setRefreshTokenUrl(url) {
		exports.refreshTokenUrl = refreshTokenUrl = url;
		_metadata.REQUEST_WHITE_LIST.push(url);
	}

	exports.default = {
		request: function request(config) {

			var credential = (0, _credentials.getRequestCredential)();
			// storage 里的状态有可能已经失效
			if (!credential) {
				return execAuthFailure({ config: config });
			}

			config.headers[_metadata.REQUEST_TOKEN_HEADER] = credential.id;

			// 白名单之外的url做校验
			// TODO 兼容处理,如果拿不到refreshToken说明系统还未升级,则不做刷新token逻辑
			if (credential.refreshToken && _metadata.REQUEST_WHITE_LIST.indexOf(config.url) === -1) {

				var expireTime = _metadata.Date.parse(credential.expireTime);
				var now = _metadata.Date.now();

				// token失效则直接跳转登录页面
				// token未失效但是可用时长已低于用户会话最短保留时间,则需要刷新token
				if (_metadata.USER_SESSION_AVAILABLE_TIME >= expireTime - now && expireTime - now >= 0) {
					needToRefreshToken = true;
				} else if (expireTime - now < 0) {
					// token失效
					return execAuthFailure({ config: config });
				}
			}

			return config;
		},
		response: function response(_response) {

			// 如果请求能正常响应,说明 storage 里的状态是存在的,所以这里不做判断
			var credential = (0, _credentials.getRequestCredential)();

			var injector = __webpack_require__(7).default;
			var $http = injector.get('$http');
			// 所有请求结束了才做refreshToken的操作,避免后端因为token被刷新而导致前一请求失败
			if (needToRefreshToken && $http.pendingRequests.length === 0) {

				needToRefreshToken = false;
				// refresh token
				$http.put(refreshTokenUrl, credential.refreshToken, { headers: _defineProperty({}, _metadata.REQUEST_TOKEN_HEADER, credential.id) }).then(function (response) {
					// 更新localStorage中token信息
					(0, _credentials.setRequestCredential)(response.data);
				}, execAuthFailure);
			}

			return _response;
		}
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getRequestCredential = getRequestCredential;
	exports.setRequestCredential = setRequestCredential;
	exports.removeRequestCredential = removeRequestCredential;

	var _jsCookie = __webpack_require__(5);

	var _jsCookie2 = _interopRequireDefault(_jsCookie);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var localStorage = window.localStorage; /**
	                                         * @author Kuitos
	                                         * @homepage https://github.com/kuitos/
	                                         * @since 2016-09-29
	                                         */

	var JSON = window.JSON;

	var REQUEST_TOKEN_STORAGE_KEY = 'ccmsRequestCredential';

	function getRequestCredential() {

		var credential = null;
		// get credential from cookie when inside an iframe
		if (window.self !== window.top) {
			credential = _jsCookie2.default.get(REQUEST_TOKEN_STORAGE_KEY) || null;
		} else {
			credential = localStorage.getItem(REQUEST_TOKEN_STORAGE_KEY) || null;
		}

		return JSON.parse(credential);
	}

	function setRequestCredential(credential) {
		localStorage.setItem(REQUEST_TOKEN_STORAGE_KEY, JSON.stringify(credential));
	}

	function removeRequestCredential() {
		localStorage.removeItem(REQUEST_TOKEN_STORAGE_KEY);
		_jsCookie2.default.remove(REQUEST_TOKEN_STORAGE_KEY);
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * JavaScript Cookie v2.1.3
	 * https://github.com/js-cookie/js-cookie
	 *
	 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
	 * Released under the MIT license
	 */
	;(function (factory) {
		var registeredInModuleLoader = false;
		if (true) {
			!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
			registeredInModuleLoader = true;
		}
		if (true) {
			module.exports = factory();
			registeredInModuleLoader = true;
		}
		if (!registeredInModuleLoader) {
			var OldCookies = window.Cookies;
			var api = window.Cookies = factory();
			api.noConflict = function () {
				window.Cookies = OldCookies;
				return api;
			};
		}
	}(function () {
		function extend () {
			var i = 0;
			var result = {};
			for (; i < arguments.length; i++) {
				var attributes = arguments[ i ];
				for (var key in attributes) {
					result[key] = attributes[key];
				}
			}
			return result;
		}

		function init (converter) {
			function api (key, value, attributes) {
				var result;
				if (typeof document === 'undefined') {
					return;
				}

				// Write

				if (arguments.length > 1) {
					attributes = extend({
						path: '/'
					}, api.defaults, attributes);

					if (typeof attributes.expires === 'number') {
						var expires = new Date();
						expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
						attributes.expires = expires;
					}

					try {
						result = JSON.stringify(value);
						if (/^[\{\[]/.test(result)) {
							value = result;
						}
					} catch (e) {}

					if (!converter.write) {
						value = encodeURIComponent(String(value))
							.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
					} else {
						value = converter.write(value, key);
					}

					key = encodeURIComponent(String(key));
					key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
					key = key.replace(/[\(\)]/g, escape);

					return (document.cookie = [
						key, '=', value,
						attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
						attributes.path ? '; path=' + attributes.path : '',
						attributes.domain ? '; domain=' + attributes.domain : '',
						attributes.secure ? '; secure' : ''
					].join(''));
				}

				// Read

				if (!key) {
					result = {};
				}

				// To prevent the for loop in the first place assign an empty array
				// in case there are no cookies at all. Also prevents odd result when
				// calling "get()"
				var cookies = document.cookie ? document.cookie.split('; ') : [];
				var rdecode = /(%[0-9A-Z]{2})+/g;
				var i = 0;

				for (; i < cookies.length; i++) {
					var parts = cookies[i].split('=');
					var cookie = parts.slice(1).join('=');

					if (cookie.charAt(0) === '"') {
						cookie = cookie.slice(1, -1);
					}

					try {
						var name = parts[0].replace(rdecode, decodeURIComponent);
						cookie = converter.read ?
							converter.read(cookie, name) : converter(cookie, name) ||
							cookie.replace(rdecode, decodeURIComponent);

						if (this.json) {
							try {
								cookie = JSON.parse(cookie);
							} catch (e) {}
						}

						if (key === name) {
							result = cookie;
							break;
						}

						if (!key) {
							result[name] = cookie;
						}
					} catch (e) {}
				}

				return result;
			}

			api.set = api;
			api.get = function (key) {
				return api.call(api, key);
			};
			api.getJSON = function () {
				return api.apply({
					json: true
				}, [].slice.call(arguments));
			};
			api.defaults = {};

			api.remove = function (key, attributes) {
				api(key, '', extend(attributes, {
					expires: -1
				}));
			};

			api.withConverter = init;

			return api;
		}

		return init(function () {});
	}));


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * @author qix
	 * @homepage https://github.com/qixman/
	 * @since 2016-10-21
	 */

	var Date = exports.Date = window.Date;
	var REQUEST_TOKEN_HEADER = exports.REQUEST_TOKEN_HEADER = 'X-TOKEN';
	var USER_SESSION_AVAILABLE_TIME = exports.USER_SESSION_AVAILABLE_TIME = 30 * 60 * 1000;
	var REQUEST_WHITE_LIST = exports.REQUEST_WHITE_LIST = [];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getInjector = getInjector;

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	var _dynamicExport = __webpack_require__(8);

	var _dynamicExport2 = _interopRequireDefault(_dynamicExport);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 获取应用的injector,默认查询被ng-app标记的节点,否则从document.documentElement开始找
	 * @param rootElement
	 */
	/**
	 * @author Kuitos
	 * @homepage https://github.com/kuitos/
	 * @since 2016-04-25
	 */

	function getInjector() {
		var rootElement = arguments.length <= 0 || arguments[0] === undefined ? document.querySelector('[ng-app]') || document.documentElement : arguments[0];


		var injector = _angular2.default.element(rootElement).injector();

		if (injector) {
			return injector;
		} else {

			var childNodes = rootElement.childNodes;

			for (var i = 0; i < childNodes.length; i++) {

				var _injector = getInjector(childNodes[i]);

				if (_injector) {
					return _injector;
				}
			}
		}

		return null;
	}

	// make commonjs have the same behavior with es6 module
	var injector = null;
	exports.default = injector;

	(0, _dynamicExport2.default)(exports, 'default', function () {
		return injector || (injector = getInjector());
	});

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	/**
	 * @author Kuitos
	 * @homepage https://github.com/kuitos/
	 * @since 2016-05-12
	 */

	/**
	 * dynamic export,make the commonjs export has the same behaviour with es module
	 * @param exportsRef exports reference
	 * @param prop
	 * @param getter
	 */
	exports.default = function (exportsRef, prop, getter) {

	  Object.defineProperty(exportsRef, prop, {
	    get: function get() {
	      return getter.apply(this);
	    }
	  });
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _credentials = __webpack_require__(4);

	var _metadata = __webpack_require__(6);

	var _tokenRefreshInterceptor = __webpack_require__(3);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
	                                                                                                                                                                                                                   * @author qix
	                                                                                                                                                                                                                   * @homepage https://github.com/qixman/
	                                                                                                                                                                                                                   * @since 2016-10-11
	                                                                                                                                                                                                                   */


	var needToRefreshToken = false;

	exports.default = {

		beforeSend: function beforeSend(xhr, config) {

			var credential = (0, _credentials.getRequestCredential)();
			if (!credential) {
				(0, _tokenRefreshInterceptor.execAuthFailure)(xhr);
				return;
			}

			xhr.setRequestHeader(_metadata.REQUEST_TOKEN_HEADER, credential.id);
			xhr[_metadata.REQUEST_TOKEN_HEADER] = credential.id;
			if (credential.refreshToken && _metadata.REQUEST_WHITE_LIST.indexOf(config.url) === -1) {

				var expireTime = _metadata.Date.parse(credential.expireTime);
				var now = _metadata.Date.now();

				// token失效则直接跳转登录页面
				// token未失效但是可用时长已低于用户会话最短保留时间,则需要刷新token
				if (_metadata.USER_SESSION_AVAILABLE_TIME >= expireTime - now && expireTime - now >= 0) {
					needToRefreshToken = true;
				} else if (expireTime - now < 0) {
					// token失效
					(0, _tokenRefreshInterceptor.execAuthFailure)(xhr);
				}
			}
		},
		complete: function complete(xhr) {

			// 如果请求能正常响应,说明 storage 里的状态是存在的,所以这里不做判断
			var credential = (0, _credentials.getRequestCredential)();
			var $ = window.$;

			// 所有请求结束了才做refreshToken的操作,避免后端因为token被刷新而导致前一请求失败
			if (needToRefreshToken && $.active <= 1) {
				needToRefreshToken = false;
				xhr[_metadata.REQUEST_TOKEN_HEADER] = credential.id;
				// refresh token
				$.ajax({
					url: _tokenRefreshInterceptor.refreshTokenUrl,
					method: 'PUT',
					data: credential.refreshToken,
					headers: _defineProperty({}, _metadata.REQUEST_TOKEN_HEADER, credential.id)
				}).done(function (response) {
					// 更新localStorage中token信息
					(0, _credentials.setRequestCredential)(JSON.parse(response));
				}).fail(function () {
					return (0, _tokenRefreshInterceptor.execAuthFailure)(xhr);
				});
			}
		}
	};

/***/ }
/******/ ]);
//# sourceMappingURL=interceptor-jq.js.map