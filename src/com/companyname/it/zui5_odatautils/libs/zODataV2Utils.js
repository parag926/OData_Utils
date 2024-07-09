sap.ui.define([
	"com/companyname/it/zui5_odatautils/libs/zBusyLoaderUtils"
], function (BusyLoaderUtils) {
	"use strict";

	return {

		/* This method is for Read Operation for Odata V2 calls
		 * @memberOf com.companyname.it.zui5_odataUtils.libs.zODataV2Utils
		 */
		__readODataOperation: function (_options) {
			var __bGlobalBusy = true;
			try {
				if (_options.bGlobalBusy !== undefined) {
					if (_options.bGlobalBusy === false) {
						__bGlobalBusy = false;
					}
				}

				if (__bGlobalBusy === false) {
					if (_options.oControl) {
						if (!_options.oControl.getBusy() && !BusyLoaderUtils.getBusyDialogOpened()) {
							window.setTimeout(function () {
								_options.oControl.setBusyIndicatorDelay(0);
								_options.oControl.setBusy(true);
							}.bind(this), 0);
						}
					}
				} else {
					BusyLoaderUtils.__openBusyDialog(_options.sPath);
				}

				var _oModel = _options.oModel,
					_oParameters = {},
					_oHeader = {};

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}
				_oModel.setHeaders(_oHeader);

				//Add Batch GroupId
				if (_options.sBatchGroupId) {
					_oModel.setDeferredGroups([_options.sBatchGroupId]);
					_oParameters["groupId"] = _options.sBatchGroupId;
				}

				//Add Filter Parameters
				if (_options.oFilters) {
					_oParameters["filters"] = _options.oFilters;
				}

				/*SOC BADH PERFORMANCE FIXES 2022/09/07*/
				if (_options.oSorters) {
					_oParameters["sorters"] = _options.oSorters;
				}
				/*EOC BADH PERFORMANCE FIXES 2022/09/07*/

				if (_oModel.aUrlParams.length > 0) {
					_oModel.aUrlParams = [];
				}
				if (_options.aUrlParams) {
					_oModel.aUrlParams = _options.aUrlParams;
				}

				//Add URL Parameters
				if (_options.oURIParameters) {
					_oParameters["urlParameters"] = _options.oURIParameters;
				}

				//Add Async flag
				if (_options.bAsync) {
					_oParameters["async"] = _options.bAsync;
				}

				//OData Success Handling
				_oParameters["success"] = function (oData, oResponse) {
					if (__bGlobalBusy === false) {
						if (_options.oControl) {
							_options.oControl.setBusy(false);
						}
					} else {
						BusyLoaderUtils.__closeBusyDialog(_options.sPath);
					}
					if (_options.fnSuccess) {
						_options.fnSuccess(oData, oResponse);
					}
				}.bind(this);

				//OData Error Handling
				_oParameters["error"] = function (oErrResponse) {
					if (__bGlobalBusy === false) {
						if (_options.oControl) {
							_options.oControl.setBusy(false);
						}
					} else {
						BusyLoaderUtils.__closeBusyDialog(_options.sPath);
					}
					if (_options.fnError) {
						_options.fnError(oErrResponse);
					}
				}.bind(this);
				_oModel.read(_options.sPath, _oParameters);

			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sPath);
				}
			}
		},

		__deleteODataOperation: function (_options) {
			var __bGlobalBusy = true;
			try {
				if (_options.bGlobalBusy === false) {
					__bGlobalBusy = false;
				}
				if (__bGlobalBusy === false) {
					if (_options.oControl) {
						if (!_options.oControl.getBusy() && !BusyLoaderUtils.getBusyDialogOpened()) {
							_options.oControl.setBusyIndicatorDelay(0);
							_options.oControl.setBusy(true);
						}
					}
				} else {
					BusyLoaderUtils.__openBusyDialog(_options.sPath);
				}

				var _oModel = _options.oModel,
					_oParameters = {},
					_oHeader = {};

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}
				_oModel.setHeaders(_oHeader);

				//Add Batch GroupId
				if (_options.sBatchGroupId) {
					_oModel.setDeferredGroups([_options.sBatchGroupId]);
					_oParameters["groupId"] = _options.sBatchGroupId;
				}

				if (_oModel.aUrlParams.length > 0) {
					_oModel.aUrlParams = [];
				}
				if (_options.aUrlParams) {
					_oModel.aUrlParams = _options.aUrlParams;
				}

				//Add URL Parameters
				if (_options.oURIParameters) {
					_oParameters["urlParameters"] = _options.oURIParameters;
				}

				//Add Async flag
				if (_options.bAsync) {
					_oParameters["async"] = _options.bAsync;
				}

				//OData Success Handling
				_oParameters["success"] = function (oData, oResponse) {
					if (__bGlobalBusy === false) {
						if (_options.oControl) {
							_options.oControl.setBusy(false);
						}
					} else {
						BusyLoaderUtils.__closeBusyDialog(_options.sPath);
					}
					if (_options.fnSuccess) {
						_options.fnSuccess(oData, oResponse);
					}
				}.bind(this);

				//OData Error Handling
				_oParameters["error"] = function (oErrResponse) {
					if (__bGlobalBusy === false) {
						if (_options.oControl) {
							_options.oControl.setBusy(false);
						}
					} else {
						BusyLoaderUtils.__closeBusyDialog(_options.sPath);
					}
					if (_options.fnError) {
						_options.fnError(oErrResponse);
					}
				}.bind(this);
				_oModel.remove(_options.sPath, _oParameters);
			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sPath);
				}
			}
		},

		__updateODataOperation: function (_options) {
			var __bGlobalBusy = true,
				retPromise = Promise.resolve();
			try {
				if (_options.bGlobalBusy === false) {
					__bGlobalBusy = false;
				}
				if (__bGlobalBusy === false) {
					if (_options.oControl) {
						if (!_options.oControl.getBusy() && !BusyLoaderUtils.getBusyDialogOpened()) {
							window.setTimeout(function () {
								_options.oControl.setBusyIndicatorDelay(0);
								_options.oControl.setBusy(true);
							}.bind(this), 0);
						}
					}
				} else {
					BusyLoaderUtils.__openBusyDialog(_options.sPath);
				}

				var _oModel = _options.oModel,
					_oParameters = {},
					_oHeader = {};

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}
				_oModel.setHeaders(_oHeader);

				//Add Batch GroupId
				if (_options.sBatchGroupId) {
					_oModel.setDeferredGroups([_options.sBatchGroupId]);
					_oParameters["groupId"] = _options.sBatchGroupId;
				}

				//Add change set id
				if (_options.changeSetId) {
					_oParameters["changeSetId"] = _options.changeSetId;
				}

				if (_oModel.aUrlParams.length > 0) {
					_oModel.aUrlParams = [];
				}
				if (_options.aUrlParams) {
					_oModel.aUrlParams = _options.aUrlParams;
				}

				//Add URL Parameters
				if (_options.oURIParameters) {
					_oParameters["urlParameters"] = _options.oURIParameters;
				}

				//Add Async flag
				if (_options.bAsync) {
					_oParameters["async"] = _options.bAsync;
				}

				//Add Merge flag
				if (_options.bMerge) {
					_oParameters["merge"] = _options.bMerge;
				}

				//OData Success Handling
				_oParameters["success"] = function (oData, oResponse) {
					if (__bGlobalBusy === false) {
						if (_options.oControl) {
							_options.oControl.setBusy(false);
						}
					} else {
						BusyLoaderUtils.__closeBusyDialog(_options.sPath);
					}
					if (_options.fnSuccess) {
						_options.fnSuccess(oData, oResponse);
					}
					return retPromise;
				}.bind(this);

				//OData Error Handling
				_oParameters["error"] = function (oErrResponse) {
					if (__bGlobalBusy === false) {
						if (_options.oControl) {
							_options.oControl.setBusy(false);
						}
					} else {
						BusyLoaderUtils.__closeBusyDialog(_options.sPath);
					}
					if (_options.fnError) {
						_options.fnError(oErrResponse);
					}
					return retPromise;
				}.bind(this);
				_oModel.update(_options.sPath, _options.oRequestBody, _oParameters);

			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sPath);
				}
			}

		},

		__updateODataOperationPromise: function (_options) {
			var __oContext__ = this,
				retPromise = Promise.resolve(),
				__oUpdPromise__ = new Promise(function (oResolve, oReject) {
					var __bGlobalBusy = true;
					try {
						if (_options.bGlobalBusy === false) {
							__bGlobalBusy = false;
						}

						if (__bGlobalBusy === false) {
							if (_options.oControl) {
								if (!_options.oControl.getBusy() && !__oContext__.__isBusyDialogOpened()) {
									window.setTimeout(function () {
										_options.oControl.setBusyIndicatorDelay(0);
										_options.oControl.setBusy(true);
									}.bind(__oContext__), 0);
								}
							}
						} else {
							BusyLoaderUtils.__openBusyDialog(_options.sPath);
						}

						var _oModel = _options.oModel,
							_oParameters = {};

						//Add Headers
						if (_options.oHeaders) {
							var __oHeaders = Object.assign(_oModel.getHeaders(), _options.oHeaders);
							_oModel.setHeaders(__oHeaders);
						}
						//Add Batch GroupId
						if (_options.sBatchGroupId) {
							_oModel.setDeferredGroups([_options.sBatchGroupId]);
							_oParameters["groupId"] = _options.sBatchGroupId;
						}

						//Add change set id
						if (_options.changeSetId) {
							_oParameters["changeSetId"] = _options.changeSetId;
						}

						if (_oModel.aUrlParams.length > 0) {
							_oModel.aUrlParams = [];
						}
						if (_options.aUrlParams) {
							_oModel.aUrlParams = _options.aUrlParams;
						}

						//Add URL Parameters
						if (_options.oURIParameters) {
							_oParameters["urlParameters"] = _options.oURIParameters;
						}

						//Add Async flag
						if (_options.bAsync) {
							_oParameters["async"] = _options.bAsync;
						}

						//Add Merge flag
						if (_options.bMerge) {
							_oParameters["merge"] = _options.bMerge;
						}

						//OData Success Handling
						_oParameters["success"] = function (oData, oResponse) {
							if (__bGlobalBusy === false) {
								if (_options.oControl) {
									_options.oControl.setBusy(false);
								}
							} else {
								BusyLoaderUtils.__closeBusyDialog(_options.sPath);
							}
							if (_options.fnSuccess) {
								_options.fnSuccess(oData, oResponse);
							}
							oResolve(oData, oResponse);
						}.bind(__oContext__);

						//OData Error Handling
						_oParameters["error"] = function (oErrResponse) {
							if (__bGlobalBusy === false) {
								if (_options.oControl) {
									_options.oControl.setBusy(false);
								}
							} else {
								BusyLoaderUtils.__closeBusyDialog(_options.sPath);
							}
							if (_options.fnError) {
								_options.fnError(oErrResponse);
							}

							oReject(oErrResponse);
						}.bind(__oContext__);

						_oModel.update(_options.sPath, _options.oRequestBody, _oParameters);
					} catch (err) {
						if (_options.oControl && __bGlobalBusy === false) {
							_options.oControl.setBusy(false);
						} else if (__bGlobalBusy === true) {
							BusyLoaderUtils.__closeBusyDialog(_options.sPath);
						}
					}
				});

			if (_options["bAsync"] === false) {
				__oUpdPromise__.then(function(){
					return retPromise;
				});
			}
		},

		__createODataOperation: function (_options) {
			var __bGlobalBusy = true;
			try {
				if (_options.bGlobalBusy === false) {
					__bGlobalBusy = false;
				}

				if (__bGlobalBusy === false) {
					if (_options.oControl) {
						if (!_options.oControl.getBusy() && !BusyLoaderUtils.getBusyDialogOpened()) {
							window.setTimeout(function () {
								_options.oControl.setBusyIndicatorDelay(0);
								_options.oControl.setBusy(true);
							}.bind(this), 0);
						}
					}
				} else {
					BusyLoaderUtils.__openBusyDialog(_options.sPath);
				}

				var _oModel = _options.oModel,
					_oParameters = {},
					_oHeader = {};

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}
				_oModel.setHeaders(_oHeader);

				//Add Batch GroupId
				if (_options.sBatchGroupId) {
					_oModel.setDeferredGroups([_options.sBatchGroupId]);
					_oParameters["groupId"] = _options.sBatchGroupId;
				}

				if (_oModel.aUrlParams.length > 0) {
					_oModel.aUrlParams = [];
				}
				if (_options.aUrlParams) {
					_oModel.aUrlParams = _options.aUrlParams;
				}

				//Add URL Parameters
				if (_options.oURIParameters) {
					_oParameters["urlParameters"] = _options.oURIParameters;
				}

				//Add Async flag
				if (_options.bAsync) {
					_oParameters["async"] = _options.bAsync;
				}

				//Add change set id
				if (_options.changeSetId) {
					_oParameters["changeSetId"] = _options.changeSetId;
				}
				//OData Success Handling
				_oParameters["success"] = function (oData, oResponse) {
					if (__bGlobalBusy === false) {
						if (_options.oControl) {
							_options.oControl.setBusy(false);
						}
					} else {
						BusyLoaderUtils.__closeBusyDialog(_options.sPath);
					}
					if (_options.fnSuccess) {
						_options.fnSuccess(oData, oResponse);
					}
				}.bind(this);

				//OData Error Handling
				_oParameters["error"] = function (oErrResponse) {
					if (__bGlobalBusy === false) {
						if (_options.oControl) {
							_options.oControl.setBusy(false);
						}
					} else {
						BusyLoaderUtils.__closeBusyDialog(_options.sPath);
					}
					if (_options.fnError) {
						_options.fnError(oErrResponse);
					}
				}.bind(this);
				_oModel.create(_options.sPath, _options.oRequestBody, _oParameters);
			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sPath);
				}
			}
		},

		__callFunctionODataOperation: function (_options) {
			var __bGlobalBusy = true;
			try {
				if (_options.bGlobalBusy === false) {
					__bGlobalBusy = false;
				}
				if (__bGlobalBusy === false) {
					if (_options.oControl) {
						if (!_options.oControl.getBusy() && !BusyLoaderUtils.getBusyDialogOpened()) {
							window.setTimeout(function () {
								_options.oControl.setBusyIndicatorDelay(0);
								_options.oControl.setBusy(true);
							}.bind(this), 0);
						}
					}
				} else {
					BusyLoaderUtils.__openBusyDialog(_options.sPath);
				}

				var _oModel = _options.oModel,
					_oParameters = {},
					_oHeader = {};

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}
				_oModel.setHeaders(_oHeader);

				//Add Batch GroupId
				if (_options.sBatchGroupId) {
					_oModel.setDeferredGroups([_options.sBatchGroupId]);
					_oParameters["groupId"] = _options.sBatchGroupId;
				}

				if (_options.method) {
					_oParameters["method"] = _options.method;
				}

				if (_oModel.aUrlParams.length > 0) {
					_oModel.aUrlParams = [];
				}
				if (_options.aUrlParams) {
					_oModel.aUrlParams = _options.aUrlParams;
				}

				//Add URL Parameters
				if (_options.oURIParameters) {
					_oParameters["urlParameters"] = _options.oURIParameters;
				}

				//Add Async flag
				if (_options.bAsync) {
					_oParameters["async"] = _options.bAsync;
				}

				//OData Success Handling
				_oParameters["success"] = function (oData, oResponse) {
					if (__bGlobalBusy === false) {
						if (_options.oControl) {
							_options.oControl.setBusy(false);
						}
					} else {
						BusyLoaderUtils.__closeBusyDialog(_options.sPath);
					}
					if (_options.fnSuccess) {
						_options.fnSuccess(oData, oResponse);
					}
				}.bind(this);

				//OData Error Handling
				_oParameters["error"] = function (oErrResponse) {
					if (__bGlobalBusy === false) {
						if (_options.oControl) {
							_options.oControl.setBusy(false);
						}
					} else {
						BusyLoaderUtils.__closeBusyDialog(_options.sPath);
					}
					if (_options.fnError) {
						_options.fnError(oErrResponse);
					}
				}.bind(this);
				_oModel.callFunction(_options.sPath, _oParameters);

			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sPath);
				}
			}
		},

		__submitChangeODataOperation: function (_options) {
			var __bGlobalBusy = true;
			try {
				if (_options.bGlobalBusy === false) {
					__bGlobalBusy = false;
				}
				if (__bGlobalBusy === false) {
					if (_options.oControl) {
						if (!_options.oControl.getBusy() && !BusyLoaderUtils.getBusyDialogOpened()) {
							window.setTimeout(function () {
								_options.oControl.setBusyIndicatorDelay(0);
								_options.oControl.setBusy(true);
							}.bind(this), 0);
						}
					}
				} else {
					BusyLoaderUtils.__openBusyDialog(_options.sBatchGroupId);
				}

				var _oModel = _options.oModel,
					_oParameters = {},
					_oHeader = {};

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}
				_oModel.setHeaders(_oHeader);
				//Add Batch GroupId
				if (_options.sBatchGroupId) {
					_oModel.setDeferredGroups([_options.sBatchGroupId]);
					_oParameters["groupId"] = _options.sBatchGroupId;
				}
				//OData Success Handling
				_oParameters["success"] = function (oData, oResponse) {
					if (__bGlobalBusy === false) {
						if (_options.oControl) {
							_options.oControl.setBusy(false);
						}
					} else {
						BusyLoaderUtils.__closeBusyDialog(_options.sBatchGroupId);
					}
					if (_options.fnSuccess) {
						_options.fnSuccess(oData, oResponse);
					}
				}.bind(this);
				//OData Error Handling
				_oParameters["error"] = function (oErrResponse) {
					if (__bGlobalBusy === false) {
						if (_options.oControl) {
							_options.oControl.setBusy(false);
						}
					} else {
						BusyLoaderUtils.__closeBusyDialog(_options.sBatchGroupId);
					}
					if (_options.fnError) {
						_options.fnError(oErrResponse);
					}
				}.bind(this);
				_oModel.submitChanges(_oParameters);
			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sBatchGroupId);
				}
			}
		},

		__submitChangeODataOperationPromise: function (_options) {
			var __oContext__ = this,
				retPromise = Promise.resolve(),
				__oSubmitChgPromise__ = new Promise(function (oResolve, oReject) {
					var __bGlobalBusy = true;
					try {
						if (_options.bGlobalBusy === false) {
							__bGlobalBusy = false;
						}
						if (__bGlobalBusy === false) {
							if (_options.oControl) {
								if (!_options.oControl.getBusy() && !__oContext__.__isBusyDialogOpened()) {
									window.setTimeout(function () {
										_options.oControl.setBusyIndicatorDelay(0);
										_options.oControl.setBusy(true);
									}.bind(__oContext__), 0);
								}
							}
						} else {
							BusyLoaderUtils.__openBusyDialog(_options.sBatchGroupId);
						}

						var _oModel = _options.oModel,
							_oParameters = {},
							_oHeader = {};

						//Add Header Parameter
						if (_options.oHeaders) {
							Object.assign(_oHeader, _options.oHeaders);
						}
						_oModel.setHeaders(_oHeader);

						//Add Batch GroupId
						if (_options.sBatchGroupId) {
							_oModel.setDeferredGroups([_options.sBatchGroupId]);
							_oParameters["groupId"] = _options.sBatchGroupId;
						}

						//OData Success Handling
						_oParameters["success"] = function (oData, oResponse) {
							if (__bGlobalBusy === false) {
								if (_options.oControl) {
									_options.oControl.setBusy(false);
								}
							} else {
								BusyLoaderUtils.__closeBusyDialog(_options.sBatchGroupId);
							}
							if (_options.fnSuccess) {
								_options.fnSuccess(oData, oResponse);
							}
							oResolve(oData, oResponse);
						}.bind(__oContext__);

						//OData Error Handling
						_oParameters["error"] = function (oErrResponse) {
							if (__bGlobalBusy === false) {
								if (_options.oControl) {
									_options.oControl.setBusy(false);
								}
							} else {
								BusyLoaderUtils.__closeBusyDialog(_options.sBatchGroupId);
							}
							if (_options.fnError) {
								_options.fnError(oErrResponse);
							}
							oReject(oErrResponse);
						}.bind(__oContext__);
						_oModel.submitChanges(_oParameters);
					} catch (err) {
						if (_options.oControl && __bGlobalBusy === false) {
							_options.oControl.setBusy(false);
						} else if (__bGlobalBusy === true) {
							BusyLoaderUtils.__closeBusyDialog(_options.sBatchGroupId);
						}
					}
				});

			if (_options["bAsync"] === false) {
				__oSubmitChgPromise__.then(function(){
					return retPromise;
				});
			}
			return __oSubmitChgPromise__;
		}

	};
});
