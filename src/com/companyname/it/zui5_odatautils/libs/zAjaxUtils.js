sap.ui.define([
	"com/companyname/it/zui5_odatautils/libs/zBusyLoaderUtils"
], function (BusyLoaderUtils) {
	"use strict";

	/* Create and manage global variables 
	 * @memberOf com.companyname.it.zui5_odataUtils.libs.zAjax4Utils
	 */
	/********** GLOBAL VARIABLES - BEGIN **********/
	var __ownerContext__,
		__context__;

	/*********** GLOBAL VARIABLES - END ***********/

	return {

		/* This method is used for Odata v4 Read Call
		 * @memberOf com.companyname.it.zui5_odataUtils.libs.zAjax4Utils
		 */
		/*
		Properties in _options
		bGlobalBusy -> If true, Global Busy Dialog is used. If false busy dialog for respective control is used(oControl should be used if false).
		oControl -> The control to be set busy is passed in it. It is used with bGlobalBusy = false.
		sPath -> The binding path in the model(entity name or absolute path).
		isAbsolutePath -> True if we are sending entity with key id
		oFilters -> Dynamic filters for the entity call
		oHeaders -> Headers to be set for the model
		fnSuccess -> Function to be called after the read operation is completed.
		*/
		__readODataOperation: function (_options) {
			var __bGlobalBusy = true;
			try {
				if (_options.bGlobalBusy !== undefined) {
					if (_options.bGlobalBusy === false) {
						__bGlobalBusy = false;
					}
				}

				var _oHeader;

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}

				//Add URL Filters
				if (_options.oFilters) {
					var sURL = "?$filter=(";
					if (_options.oFilters.length > 0) {
						var aFilters = _options.oFilters[0].getFilters();
						for (var i = 0; i < aFilters.length; i++) {
							sURL = sURL + aFilters[i].sPath + " " + aFilters[i].sOperator.toLowerCase() + " '" + aFilters[i].oValue1 + "'";
							if (i !== aFilters.length - 1) {
								sURL = sURL + ",";
							}else{
								sURL = sURL + ")";	
							}
						}
					} else if (_options.oFilters.sPath) {
						sURL = sURL + _options.oFilters.sPath + " " + _options.oFilters.sOperator.toLowerCase() + " '" + _options.oFilters.oValue1 + "')";
					}
				}
				if (sURL) {
					_options.sURL = _options.sURL + sURL;
				}

				//oData Response Handling
				var fnReadCall = function (_options) {

					var _oHeader = {
						'x-csrf-token': _options.csrfToken
					};
					if (_options.oHeaders) {
						Object.assign(_oHeader, _options.oHeaders);
					}

					$.ajax({
						url: _options.sURL,
						type: "GET",
						headers: _oHeader,
						beforeSend: function (xhr) {
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
								BusyLoaderUtils.__openBusyDialog(_options.sURL);
							}
						},
						complete: function (xhr) {
							if (__bGlobalBusy === false) {
								if (_options.oControl) {
									_options.oControl.setBusy(false);
								}
							} else {
								BusyLoaderUtils.__closeBusyDialog(_options.sURL);
							}
						},
						success: function (oData) {
							if (oData) {
								if (_options.fnSuccess) {
									_options.fnSuccess(oData);
								}
							}
						},
						error: function (error) {
							if (error.responseJSON.error.code === "/IWBEP/CM_V4H_RUN/043") {
								$.ajax({
									url: sURL,
									headers: {
										"x-csrf-token": "fetch"
									},
									type: "GET",
									beforeSend: function (xhr) {
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
											BusyLoaderUtils.__openBusyDialog(_options.sURL);
										}
									},
									success: function (data, status, xhr) {
										_options.csrfToken = xhr.getResponseHeader("x-csrf-token");
										fnReadCall(_options);
									},
									complete: function (xhr) {
										if (__bGlobalBusy === false) {
											if (_options.oControl) {
												_options.oControl.setBusy(false);
											}
										} else {
											BusyLoaderUtils.__closeBusyDialog(_options.sURL);
										}
									}
								});
							}
							console.log(`Error ${error}`);
							if (error) {
								if (_options.fnError) {
									_options.fnError(error);
								}
							}
						}
					});

				};

				fnReadCall(_options);

			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sPath);
				}
			}
		},

		/* This method is used for Odata v4 Delete Call
		 * @memberOf com.companyname.it.zui5_odataUtils.libs.zAjax4Utils
		 */
		/*
		Properties in _options
		bGlobalBusy -> If true, Global Busy Dialog is used. If false busy dialog for respective control is used(oControl should be used if false).
		oControl -> The control to be set busy is passed in it. It is used with bGlobalBusy = false.
		sURL -> The binding path in the model(entity name or absolute path).
		oHeaders -> Headers to be set for the model
		fnSuccess -> Function to be called after the read operation is completed.
		*/
		__deleteODataOperation: function (_options) {
			var __bGlobalBusy = true;
			try {
				if (_options.bGlobalBusy === false) {
					__bGlobalBusy = false;
				}
				

				var _oHeader;

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}

				

				//oData Response Handling
				var fnDeleteCall = function (_options) {

					var _oHeader = {
						'x-csrf-token': _options.csrfToken
					};
					if (_options.oHeaders) {
						Object.assign(_oHeader, _options.oHeaders);
					}

					$.ajax({
						url: _options.sURL,
						type: "DELETE",
						headers: _oHeader,
						beforeSend: function (xhr) {
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
								BusyLoaderUtils.__openBusyDialog(_options.sURL);
							}
						},
						complete: function (xhr) {
							if (__bGlobalBusy === false) {
								if (_options.oControl) {
									_options.oControl.setBusy(false);
								}
							} else {
								BusyLoaderUtils.__closeBusyDialog(_options.sURL);
							}
						},
						success: function (oData) {
							if (oData) {
								if (_options.fnSuccess) {
									_options.fnSuccess(oData);
								}
							}
						},
						error: function (error) {
							if (error.responseJSON.error.code === "/IWBEP/CM_V4H_RUN/043") {
								$.ajax({
									url: _options.sURL,
									headers: {
										"x-csrf-token": "fetch"
									},
									type: "GET",
									beforeSend: function (xhr) {
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
											BusyLoaderUtils.__openBusyDialog(_options.sURL);
										}
									},
									success: function (data, status, xhr) {
										_options.csrfToken = xhr.getResponseHeader("x-csrf-token");
										fnDeleteCall(_options);
									},
									complete: function (xhr) {
										if (__bGlobalBusy === false) {
											if (_options.oControl) {
												_options.oControl.setBusy(false);
											}
										} else {
											BusyLoaderUtils.__closeBusyDialog(_options.sURL);
										}
									}
								});
							}
							console.log(`Error ${error}`);
							if (error) {
								if (_options.fnError) {
									_options.fnError(error);
								}
							}
						}
					});

				};

				fnDeleteCall(_options);
			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sPath);
				}
			}
		},

		/* This method is used for Odata v4 Update Call
		 * @memberOf com.companyname.it.zui5_odataUtils.libs.zAjax4Utils
		 */
		/*
		Properties in _options
		bGlobalBusy -> If true, Global Busy Dialog is used. If false busy dialog for respective control is used(oControl should be used if false).
		oControl -> The control to be set busy is passed in it. It is used with bGlobalBusy = false.
		sURL -> The binding path in the model(entity name or absolute path).
		oHeaders -> Headers to be set for the model
		fnSuccess -> Function to be called after the read operation is completed.
		*/
		__postODataOperation: function (_options) {
			var __bGlobalBusy = true;
			try {
				if (_options.bGlobalBusy === false) {
					__bGlobalBusy = false;
				}
				

				var _oHeader;

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}
				

				//oData Response Handling
				var fnPostCall = function (_options) {

					var _oHeader = {
						'x-csrf-token': _options.csrfToken
					};
					if (_options.oHeaders) {
						Object.assign(_oHeader, _options.oHeaders);
					}

					$.ajax({
						url: _options.sURL,
						type: "POST",
						data: _options.oRequestBody,
						headers: _oHeader,
						beforeSend: function (xhr) {
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
								BusyLoaderUtils.__openBusyDialog(_options.sURL);
							}
						},
						complete: function (xhr) {
							if (__bGlobalBusy === false) {
								if (_options.oControl) {
									_options.oControl.setBusy(false);
								}
							} else {
								BusyLoaderUtils.__closeBusyDialog(_options.sURL);
							}
						},
						success: function (oData) {
							if (oData) {
								if (_options.fnSuccess) {
									_options.fnSuccess(oData);
								}
							}
						},
						error: function (error) {
							if (error.responseJSON.error.code === "/IWBEP/CM_V4H_RUN/043") {
								$.ajax({
									url: _options.sURL,
									headers: {
										"x-csrf-token": "fetch"
									},
									type: "GET",
									beforeSend: function (xhr) {
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
											BusyLoaderUtils.__openBusyDialog(_options.sURL);
										}
									},
									success: function (data, status, xhr) {
										_options.csrfToken = xhr.getResponseHeader("x-csrf-token");
										fnPostCall(_options);
									},
									complete: function (xhr) {
										if (__bGlobalBusy === false) {
											if (_options.oControl) {
												_options.oControl.setBusy(false);
											}
										} else {
											BusyLoaderUtils.__closeBusyDialog(_options.sURL);
										}
									}
								});
							}
							console.log(`Error ${error}`);
							if (error) {
								if (_options.fnError) {
									_options.fnError(error);
								}
							}
						}
					});

				};

				fnPostCall(_options);

			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sPath);
				}
			}

		}
		

	};
});