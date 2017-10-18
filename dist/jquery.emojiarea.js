/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "903bddc8083c0b5db6e6"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(3)(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The EmojiUtil contains all functionality for handling emoji data and groups, but no html specific stuff.
 *
 * @author Wolfgang Stöttinger
 */

Data = {};

var EmojiUtil = function () {
  function EmojiUtil() {
    _classCallCheck(this, EmojiUtil);
  }

  /**
   *
   */


  _createClass(EmojiUtil, null, [{
    key: 'initialize',
    value: function initialize() {
      EmojiUtil.aliases = {};
      EmojiUtil.unicodes = {};

      var dataKeys = Object.keys(EmojiUtil.data);
      for (var e = 0; e < dataKeys.length; e++) {
        var key = dataKeys[e];
        var emojiData = EmojiUtil.data[key];
        if (emojiData) {
          var code = emojiData[EmojiUtil.EMOJI_UNICODE];

          EmojiUtil.aliases[emojiData[EmojiUtil.EMOJI_ALIASES]] = key;
          EmojiUtil.unicodes[code] = key;

          // also create unicode aliases for modified versions of emoticons
          if (code.length <= 2) {
            EmojiUtil.unicodes[code + EmojiUtil.MODIFIER_TEXT] = key;
            EmojiUtil.unicodes[code + EmojiUtil.MODIFIER_EMOJI] = key;
            if (EmojiUtil.MODIFIER) {
              // force text or emoji presentation with modifier
              emojiData[EmojiUtil.EMOJI_UNICODE] = code + EmojiUtil.MODIFIER;
            }
          }
        }
      }
    }
  }, {
    key: 'checkAlias',
    value: function checkAlias(alias) {
      return EmojiUtil.aliases.hasOwnProperty(alias);
    }
  }, {
    key: 'checkUnicode',
    value: function checkUnicode(alias) {
      return EmojiUtil.unicodes.hasOwnProperty(alias);
    }

    /**
     * @param alias
     * @param groupData if true returns an array including groupId, Col# and Row# of the Emoji
     * @returns {*}
     */

  }, {
    key: 'dataFromAlias',
    value: function dataFromAlias(alias) {
      var groupData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var key = EmojiUtil.aliases[alias];
      var data = EmojiUtil.data[key];
      if (!groupData || data[2]) // if group is set
        return data;

      for (var g = 0; g < EmojiUtil.groups.length; g++) {
        var group = EmojiUtil.groups[g];
        var d = group.dimensions;
        var pos = $.inArray(key, group.items);
        if (pos >= 0) {
          data[2] = g; // group
          data[3] = pos % d[0]; // column
          data[4] = pos / d[0] | 0; // row
          data[5] = d; // sprite dimensions
          return data;
        }
      }
      return data;
    }

    /**
     *
     * @param alias
     * @returns {*}
     */

  }, {
    key: 'unicodeFromAlias',
    value: function unicodeFromAlias(alias) {
      if (alias) {
        var key = EmojiUtil.aliases[alias];
        var emojiData = EmojiUtil.data[key];
        if (emojiData && emojiData[EmojiUtil.EMOJI_UNICODE]) return emojiData[EmojiUtil.EMOJI_UNICODE];
      }
      return null;
    }
  }, {
    key: 'unicodeFromAscii',
    value: function unicodeFromAscii(ascii) {
      return EmojiUtil.unicodeFromAlias(EmojiUtil.aliasFromAscii(ascii));
    }
  }, {
    key: 'aliasFromUnicode',
    value: function aliasFromUnicode(unicode) {
      if (unicode) {
        var key = EmojiUtil.unicodes[unicode];
        var emojiData = EmojiUtil.data[key];
        if (emojiData && emojiData[EmojiUtil.EMOJI_ALIASES]) return emojiData[EmojiUtil.EMOJI_ALIASES];
      }
      return null;
    }
  }, {
    key: 'aliasFromAscii',
    value: function aliasFromAscii(ascii) {
      return EmojiUtil.ascii[ascii] || null;
    }
  }]);

  return EmojiUtil;
}();

exports.default = EmojiUtil;


EmojiUtil.data = Data.data;
EmojiUtil.groups = Data.groups;
EmojiUtil.ascii = Data.ascii;

EmojiUtil.EMOJI_UNICODE = 0;
EmojiUtil.EMOJI_ALIASES = 1;
EmojiUtil.MODIFIER_TEXT = '\uFE0E';
EmojiUtil.MODIFIER_EMOJI = '\uFE0F';
EmojiUtil.MODIFIER = EmojiUtil.MODIFIER_EMOJI;

EmojiUtil.initialize();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * This EmojiArea is rewritten from ground up an based on the code from Brian Reavis <brian@diy.org>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Wolfgang Stöttinger
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _EmojiPicker = __webpack_require__(5);

var _EmojiPicker2 = _interopRequireDefault(_EmojiPicker);

var _EmojiUtil = __webpack_require__(1);

var _EmojiUtil2 = _interopRequireDefault(_EmojiUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EmojiArea = function () {
  function EmojiArea(emojiArea, options) {
    _classCallCheck(this, EmojiArea);

    this.o = options;
    this.$ea = (0, _jquery2.default)(emojiArea);
    this.$ti = this.$ea.find(options.inputSelector).hide();
    this.$b = this.$ea.find(options.buttonSelector).on('click', this.togglePicker.bind(this));

    this.$e = (0, _jquery2.default)('<div>').addClass('emoji-editor').attr('tabIndex', 0).attr('contentEditable', true).text(this.$ti.text()).on(options.inputEvent, this.onInput.bind(this)).on('copy', options.textClipboard ? this.clipboardCopy.bind(this) : function () {
      return true;
    }).on('paste', options.textClipboard ? this.clipboardPaste.bind(this) : function () {
      return true;
    }).appendTo(this.$ea);

    (0, _jquery2.default)(document.body).on('mousedown', this.saveSelection.bind(this));

    this._processElement(this.$e);
  }

  //
  // Clipboard handling
  //

  // noinspection JSMethodCanBeStatic


  _createClass(EmojiArea, [{
    key: 'clipboardCopy',
    value: function clipboardCopy(e) {
      // only allow plain text copy:
      var cbd = e.originalEvent.clipboardData || window.clipboardData;
      var content = window.getSelection().toString();
      window.clipboardData ? cbd.setData('text', content) : cbd.setData('text/plain', content);
      e.preventDefault();
    }
  }, {
    key: 'clipboardPaste',
    value: function clipboardPaste(e) {
      // only allow to paste plain text
      var cbd = e.originalEvent.clipboardData || window.clipboardData;
      var data = window.clipboardData ? cbd.getData('text') : cbd.getData('text/plain');

      this.saveSelection();
      this.selection.insertNode(document.createTextNode(data));
      this.selection.collapse(false);
      e.preventDefault();
      setTimeout(this.onInput.bind(this), 0);
    }

    //
    // Selection handling
    //

  }, {
    key: 'saveSelection',
    value: function saveSelection(event) {
      if (!event || event.target !== this.$e[0]) {
        var sel = window.getSelection();
        if (sel.focusNode && (sel.focusNode === this.$e[0] || sel.focusNode.parentNode === this.$e[0])) {
          this.selection = sel.getRangeAt(0);
        }
      }
    }
  }, {
    key: 'restoreSelection',
    value: function restoreSelection() {
      var range = this.selection;
      if (range) {
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(range);
      }
      return range;
    }
  }, {
    key: 'replaceSelection',
    value: function replaceSelection(content) {
      var range = this.restoreSelection();
      if (range) {
        var insert = _jquery2.default.parseHTML(content)[0];
        insert = document.importNode(insert, true); // this is necessary for IE
        range.deleteContents();
        range.insertNode(insert);
        range.selectNode(insert);
        range.collapse(false);
        return true;
      }
      return false;
    }
  }, {
    key: 'onInput',
    value: function onInput() {
      this.processContent();
      this.updateInput();
    }
  }, {
    key: 'updateInput',
    value: function updateInput() {
      this.$ti.val(this.$e.text());
      this.$ti.trigger(this.o.inputEvent);
    }
  }, {
    key: 'togglePicker',
    value: function togglePicker(e) {
      if (!this.picker || !this.picker.isVisible()) this.picker = _EmojiPicker2.default.show(this.insert.bind(this), this.$b, this.o);else this.picker.hide();

      e.stopPropagation();
      return false;
    }
  }, {
    key: 'insert',
    value: function insert(alias) {
      var content = EmojiArea.createEmoji(alias, this.o);
      if (!this.replaceSelection(content)) {
        this.$e.append(content);
        // todo place cursor to end of textfield
      }
      this.$e.focus().trigger(this.o.inputEvent);
    }
  }, {
    key: 'processContent',
    value: function processContent() {
      this.saveSelection();
      this._processElement(this.$e);
    }
  }, {
    key: '_processElement',
    value: function _processElement() {
      var _this = this;

      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$e;

      // this is a bit more complex becaue
      //  a) only text nodes should be replaced
      //  b) the cursor position should be kept after an alias is replaced

      element.contents().each(function (i, e) {
        if (e.nodeType === 1 || e.nodeType === 11) {
          // element or document fragment
          var $e = (0, _jquery2.default)(e);
          if (!$e.is('.emoji')) // skip emojis
            _this._processElement($e);
        } else if (e.nodeType === 3) {
          // text node
          // replace unicodes
          var parsed = e.nodeValue;

          if (_this.o.type !== 'unicode') {
            //convert existing unicodes
            parsed = parsed.replace(_this.o.unicodeRegex, function (match, unicode) {
              return _EmojiUtil2.default.checkUnicode(unicode) ? EmojiArea.createEmoji(null, _this.o, unicode) : unicode;
            });
          }

          parsed = parsed.replace(_this.o.emojiRegex, function (match, alias) {
            return _EmojiUtil2.default.checkAlias(alias) ? EmojiArea.createEmoji(alias, _this.o) : ':' + alias + ':';
          });

          if (parsed !== e.nodeValue) {
            var content = _jquery2.default.parseHTML(parsed);
            var wasSelected = _this.selection && _this.selection.endContainer === e;
            (0, _jquery2.default)(e).before(content).remove();
            var select = content.filter(function (e) {
              return e.nodeType !== 3;
            })[0];
            if (wasSelected && select) {
              _this.selection.selectNode(select);
              _this.selection.collapse(false);
            }
          }
        }
      });
    }
  }], [{
    key: 'createEmoji',
    value: function createEmoji(alias) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EmojiArea.DEFAULTS;
      var unicode = arguments[2];

      if (!alias && !unicode) return;
      alias = alias || _EmojiUtil2.default.aliasFromUnicode(unicode);
      unicode = unicode || _EmojiUtil2.default.unicodeFromAlias(alias);
      return unicode ? options.type === 'unicode' ? unicode : options.type === 'css' ? EmojiArea.generateEmojiTag(unicode, alias) : EmojiArea.generateEmojiImg(unicode, alias, options) : alias;
    }
  }, {
    key: 'generateEmojiTag',
    value: function generateEmojiTag(unicode, alias) {
      return '<i class="emoji emoji-' + alias + '" contenteditable="false">' + unicode + '</i>';
    }
  }, {
    key: 'generateEmojiImg',
    value: function generateEmojiImg(unicode, alias) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EmojiArea.DEFAULTS;

      var data = _EmojiUtil2.default.dataFromAlias(alias, true);
      var group = _EmojiUtil2.default.groups[data[2]];
      var dimensions = data[5];
      var iconSize = options.iconSize || 25;

      var style = 'background: url(\'' + options.assetPath + '/' + group.sprite + '\') ' + -iconSize * data[3] + 'px ' // data[3] = column
      + -iconSize * data[4] + 'px no-repeat; ' // data[4] = row
      + 'background-size: ' + dimensions[0] * iconSize + 'px ' + dimensions[1] * iconSize + 'px;'; // position

      return '<i class="emoji emoji-' + alias + ' emoji-image" contenteditable="false"><img src="' + options.assetPath + '/blank.gif" style="' + style + '" alt="' + unicode + '" contenteditable="false"/>' + unicode + '</i>';
    }
  }]);

  return EmojiArea;
}();

exports.default = EmojiArea;


EmojiArea.DEFAULTS = {
  emojiRegex: /:([a-z0-9_]+?):/g,
  unicodeRegex: /((?:[\xA9\xAE\u2122\u23E9-\u23EF\u23F3\u23F8-\u23FA\u24C2\u25B6\u2600-\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDE51\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF]))/g,
  inputSelector: 'input:text, textarea',
  buttonSelector: '>.emoji-button',
  inputEvent: /Trident/.test(navigator.userAgent) ? 'textinput' : 'input',
  // todo: other pickerAnchorPositions:
  pickerAnchor: 'left',
  type: 'css', // can be one of (unicode|css|image)
  iconSize: 25, // only for css or image mode
  assetPath: '../images', // only for css or image mode
  textClipboard: true,
  globalPicker: true
};

EmojiArea.AUTOINIT = true;
EmojiArea.INJECT_STYLES = true; // only makes sense when EmojiArea.type != 'unicode'

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _generatePlugin = __webpack_require__(4);

var _generatePlugin2 = _interopRequireDefault(_generatePlugin);

var _EmojiArea = __webpack_require__(2);

var _EmojiArea2 = _interopRequireDefault(_EmojiArea);

var _EmojiStyleGenerator = __webpack_require__(6);

var _EmojiStyleGenerator2 = _interopRequireDefault(_EmojiStyleGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is the entry point for the library
 *
 * @author Wolfgang Stöttinger
 */

(0, _generatePlugin2.default)('emojiarea', _EmojiArea2.default);

/**
 * call auto initialization. This can be supresst by setting the static EmojiArea.AUTOINIT parameter to false
 */
(0, _jquery2.default)(function () {
  if (_EmojiArea2.default.AUTOINIT) {
    (0, _jquery2.default)('[data-emojiarea]').emojiarea();
  }
  if (_EmojiArea2.default.INJECT_STYLES) {
    _EmojiStyleGenerator2.default.injectImageStyles();
  }
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = generatePlugin;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generate a jQuery plugin
 * @param pluginName [string] Plugin name
 * @param className [object] Class of the plugin
 * @param shortHand [bool] Generate a shorthand as $.pluginName
 *
 * @example
 * import plugin from 'plugin';
 *
 * class MyPlugin {
 *     constructor(element, options) {
 *         // ...
 *     }
 * }
 *
 * MyPlugin.DEFAULTS = {};
 *
 * plugin('myPlugin', MyPlugin');
 */
function generatePlugin(pluginName, className) {
  var shortHand = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var instanceName = '__' + pluginName;
  var old = _jquery2.default.fn[pluginName];

  _jquery2.default.fn[pluginName] = function (option) {
    return this.each(function () {
      var $this = (0, _jquery2.default)(this);
      var instance = $this.data(instanceName);

      if (!instance && option !== 'destroy') {
        var _options = _jquery2.default.extend({}, className.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && option);
        $this.data(instanceName, instance = new className(this, _options));
      } else if (typeof instance.configure === 'function') {
        instance.configure(options);
      }

      if (typeof option === 'string') {
        if (option === 'destroy') {
          instance.destroy();
          $this.data(instanceName, false);
        } else {
          instance[option]();
        }
      }
    });
  };

  // - Short hand
  if (shortHand) {
    _jquery2.default[pluginName] = function (options) {
      return (0, _jquery2.default)({})[pluginName](options);
    };
  }

  // - No conflict
  _jquery2.default.fn[pluginName].noConflict = function () {
    return _jquery2.default.fn[pluginName] = old;
  };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Emoji Picker (Dropdown) can work as global singleton (one dropdown for all inputs on the page)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * or with separate instances (and settings) for each input.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Wolfgang Stöttinger
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _EmojiArea = __webpack_require__(2);

var _EmojiArea2 = _interopRequireDefault(_EmojiArea);

var _EmojiUtil = __webpack_require__(1);

var _EmojiUtil2 = _interopRequireDefault(_EmojiUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EmojiPicker = function () {
  function EmojiPicker(options) {
    var _this = this;

    _classCallCheck(this, EmojiPicker);

    this.o = options;
    var $body = (0, _jquery2.default)(document.body);
    $body.on('keydown', function (e) {
      if (e.keyCode === KEY_ESC || e.keyCode === KEY_TAB) _this.hide();
    });
    $body.on('click', function () {
      _this.hide();
    });
    (0, _jquery2.default)(window).on('resize', function () {
      if (_this.$p.is(':visible')) {
        _this.reposition();
      }
    });

    this.$p = (0, _jquery2.default)('<div>').addClass('emoji-picker').on('mouseup click', function (e) {
      return e.stopPropagation() && false;
    }).hide().appendTo($body);

    var tabs = this.loadPicker();
    setTimeout(this.loadEmojis.bind(this, tabs), 100);
  }

  _createClass(EmojiPicker, [{
    key: 'loadPicker',
    value: function loadPicker() {
      var _this2 = this;

      var ul = (0, _jquery2.default)('<ul>').addClass('emoji-selector nav nav-tabs');
      var tabs = (0, _jquery2.default)('<div>').addClass('tab-content');

      var _loop = function _loop(g) {
        var group = _EmojiUtil2.default.groups[g];
        var id = 'group_' + group.name;
        var gid = '#' + id;

        var a = (0, _jquery2.default)('<a>').html(_EmojiArea2.default.createEmoji(group.name, _this2.o)).data('toggle', 'tab').attr('href', gid);

        ul.append((0, _jquery2.default)('<li>').append(a));

        var tab = (0, _jquery2.default)('<div>').attr('id', id).addClass('emoji-group tab-pane').data('group', group.name);

        a.on('click', function (e) {
          (0, _jquery2.default)('.tab-pane').not(tab).hide().removeClass('active');
          tab.addClass('active').show();
          e.preventDefault();
        });
        tabs.append(tab);
      };

      for (var g = 0; g < _EmojiUtil2.default.groups.length; g++) {
        _loop(g);
      }

      tabs.find('.tab-pane').not(':first-child').hide().removeClass('active');

      this.$p.append(ul).append(tabs);
      return tabs.children();
    }
  }, {
    key: 'loadEmojis',
    value: function loadEmojis(tabs) {
      var _this3 = this;

      for (var g = 0; g < _EmojiUtil2.default.groups.length; g++) {
        var group = _EmojiUtil2.default.groups[g];
        var _tab = tabs[g];
        for (var e = 0; e < group.items.length; e++) {
          var emojiId = group.items[e];
          if (_EmojiUtil2.default.data.hasOwnProperty(emojiId)) {
            (function () {
              var word = _EmojiUtil2.default.data[emojiId][_EmojiUtil2.default.EMOJI_ALIASES] || '';
              var emojiElem = (0, _jquery2.default)('<a>').data('emoji', word).html(_EmojiArea2.default.createEmoji(word, _this3.o)).on('click', function () {
                _this3.insertEmoji(word);
              });
              (0, _jquery2.default)(_tab).append(emojiElem);
            })();
          }
        }
      }
    }
  }, {
    key: 'insertEmoji',
    value: function insertEmoji(emoji) {
      if (typeof this.cb === 'function') this.cb(emoji, this.o);
      this.hide();
    }
  }, {
    key: 'reposition',
    value: function reposition() {
      if (!this.anchor || this.anchor.length === 0) return;

      var $a = (0, _jquery2.default)(this.anchor);
      var offset = $a.offset();
      this.$p.css(_defineProperty({
        top: offset.top + this.anchor.outerHeight()
      }, this.anchorPosition, offset.left));
    }
  }, {
    key: 'show',
    value: function show(insertCallback, anchor, anchorPosition) {
      this.cb = insertCallback;
      this.anchor = anchor;

      if (anchorPosition !== 'right') this.anchorPosition = 'left';else this.anchorPosition = 'right';

      this.reposition();
      this.$p.show();
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.$p.hide();
    }
  }, {
    key: 'isVisible',
    value: function isVisible() {
      return this.$p.is(':visible');
    }
  }]);

  return EmojiPicker;
}();

exports.default = EmojiPicker;


EmojiPicker.show = function () {
  var globalPicker = null;
  return function (insertCallback, anchor) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _EmojiArea2.default.DEFAULTS;

    var picker = globalPicker;
    if (!options.globalPicker) picker = new EmojiPicker(options);
    if (!picker) picker = globalPicker = new EmojiPicker(options);
    picker.show(insertCallback, anchor, options.anchorPosition);
    return picker;
  };
}();

var KEY_ESC = 27;
var KEY_TAB = 9;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * This class generated css style which can automatically be injected into the head.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * This is not needed in unicode or image mode.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Wolfgang Stöttinger
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _EmojiUtil = __webpack_require__(1);

var _EmojiUtil2 = _interopRequireDefault(_EmojiUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EmojiStyleGenerator = function () {
  function EmojiStyleGenerator() {
    _classCallCheck(this, EmojiStyleGenerator);
  }

  _createClass(EmojiStyleGenerator, null, [{
    key: 'createImageStyles',
    value: function createImageStyles(options) {
      var iconSize = options.iconSize || 25;
      var assetPath = options.assetPath || '../images';

      var style = '';
      // with before pseudo doesn't work with selection
      // style += '.emoji { font-size: 0; }.emoji::before{display: inline-block;content: \'\';width: ' + iconSize + 'px;height: ' + iconSize + 'px;}';
      // style += '.emoji{color: transparent;}.emoji::selection{color: transparent; background-color:highlight}';

      for (var g = 0; g < _EmojiUtil2.default.groups.length; g++) {
        var group = _EmojiUtil2.default.groups[g];
        var d = group.dimensions;

        for (var e = 0; e < group.items.length; e++) {
          var key = group.items[e];
          var emojiData = _EmojiUtil2.default.data[key];
          if (!emojiData) continue;
          var alias = emojiData[_EmojiUtil2.default.EMOJI_ALIASES];
          if (alias) {
            var row = e / d[0] | 0;
            var col = e % d[0];
            style += '.emoji-' + alias + '{' + 'background: url(\'' + assetPath + '/' + group.sprite + '\') ' + -iconSize * col + 'px ' + -iconSize * row + 'px no-repeat;' + 'background-size: ' + d[0] * iconSize + 'px ' + d[1] * iconSize + 'px;' + '}';
          }
        }
      }

      return style;
    }
  }, {
    key: 'injectImageStyles',
    value: function injectImageStyles(options) {
      (0, _jquery2.default)('<style type="text/css">' + EmojiStyleGenerator.createImageStyles(options) + '</style>').appendTo("head");
    }
  }]);

  return EmojiStyleGenerator;
}();

exports.default = EmojiStyleGenerator;

/***/ })
/******/ ]);
//# sourceMappingURL=jquery.emojiarea.js.map