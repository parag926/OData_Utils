sap.ui.define([
	"com/companyname/it/zui5_odatautils/libs/zBusyLoaderUtils"
], function (BusyLoaderUtils) {
	"use strict";

	/* Create and manage global variables 
	 * @memberOf com.companyname.it.zui5_odataUtils.libs.zODataV4Utils
	 */
	/********** GLOBAL VARIABLES - BEGIN **********/

	/*********** GLOBAL VARIABLES - END ***********/

	return {

		/* This method is used for Odata v4 Read Call
		 * @memberOf com.companyname.it.zui5_odataUtils.libs.zODataV4Utils
		 */
		/*
		Properties in _options
		bGlobalBusy -> If true, Global Busy Dialog is used. If false busy dialog for respective control is used(oControl should be used if false).
		oControl -> The control to be set busy is passed in it. It is used with bGlobalBusy = false.
		sPath -> The binding path in the model(entity name or absolute path).
		isAbsolutePath -> True if we are sending entity with key id
		oFilters -> Dynamic filters for the entity call
		oSorters -> Dynamic sorters for the entity call
		oHeaders -> Headers to be set for the model
		sGroupId -> The group ID to be used for read requests
		sUpdateGroupId -> The group ID to be used for update requests
		expand -> The expand navigation property
		select -> Array of properties to be fetched.
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

				if (__bGlobalBusy === false) {
					if (_options.oControl) {
						if (!_options.oControl.getBusy() && !BusyLoaderUtils.getBusyDialogOpened()) {
							window.setTimeout(function () {
								_options.oControl.setBusyIndicatorDelay(0);
								_options.oControl.setBusy(true);
							});
						}
					}
				} else {
					BusyLoaderUtils.__openBusyDialog(_options.sPath);
				}

				var _oModel = _options.oModel,
					_oParameters = {},
					_oHeader;

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}
				_oModel.changeHttpHeaders(_oHeader);

				//Add GroupId
				if (_options.sGroupId) {
					_oParameters["$$groupId"] = _options.sGroupId;
				}

				//Add Update GroupId
				if (_options.sUpdateGroupId) {
					_oParameters["$$updateGroupId"] = _options.sUpdateGroupId;
				}

				if (_options.expand) {
					_oParameters["$expand"] = _options.expand;
				}

				if (_options.select) {
					_oParameters["$select"] = _options.select;
				}

				//oData Response Handling
				var fnReadAsyncCall = function (_oModel, _options, _oParameters) {
					var oListBinding,
						oListContext,
						oData;
					if (_options.isAbsolutePath) {
						oListContext = _oModel.bindContext(_options.sPath, null, _oParameters);
						oListContext.requestObject().then((oData) => {
								if (__bGlobalBusy === false) {
									if (_options.oControl) {
										_options.oControl.setBusy(false);
									}
								} else {
									BusyLoaderUtils.__closeBusyDialog(_options.sPath);
								}
								if (oData) {
									if (_options.fnSuccess) {
										_options.fnSuccess(oData);
									}
								}
							})
							.catch((err) => {
								if (__bGlobalBusy === false) {
									if (_options.oControl) {
										_options.oControl.setBusy(false);
									}
								} else {
									BusyLoaderUtils.__closeBusyDialog(_options.sPath);
								}
								if (err) {
									if (_options.fnError) {
										_options.fnError(err);
									}
								}
							});
					} else {
						oListBinding = _oModel.bindList(_options.sPath, null, _options.oSorters, _options.oFilters, _oParameters);
						oListBinding.requestContexts().then((oListContext) => {
								oData = oListContext.map(rowContext => rowContext.getObject());
								if (__bGlobalBusy === false) {
									if (_options.oControl) {
										_options.oControl.setBusy(false);
									}
								} else {
									BusyLoaderUtils.__closeBusyDialog(_options.sPath);
								}
								if (oData) {
									if (_options.fnSuccess) {
										_options.fnSuccess(oData);
									}
								}
							})
							.catch((err) => {
								if (__bGlobalBusy === false) {
									if (_options.oControl) {
										_options.oControl.setBusy(false);
									}
								} else {
									BusyLoaderUtils.__closeBusyDialog(_options.sPath);
								}
								if (err) {
									if (_options.fnError) {
										_options.fnError(err);
									}
								}
							});

					}
				};

				fnReadAsyncCall(_oModel, _options, _oParameters);

			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sPath);
				}
			}
		},

		/* This method is used for Odata v4 Delete Call
		 * @memberOf com.companyname.it.zui5_odataUtils.libs.zODataV4Utils
		 */
		/*
		Properties in _options
		bGlobalBusy -> If true, Global Busy Dialog is used. If false busy dialog for respective control is used(oControl should be used if false).
		oControl -> The control to be set busy is passed in it. It is used with bGlobalBusy = false.
		sPath -> The binding path in the model(entity name or absolute path).
		oHeaders -> Headers to be set for the model
		sGroupId -> The group ID to be used for read requests
		sUpdateGroupId -> The group ID to be used for update requests
		expand -> The expand navigation property
		select -> Array of properties to be fetched.
		fnSuccess -> Function to be called after the read operation is completed.
		*/
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
					_oHeader;

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}
				_oModel.changeHttpHeaders(_oHeader);

				//Add GroupId
				if (_options.sGroupId) {
					_oParameters["$$groupId"] = _options.sGroupId;
				}

				//Add Update GroupId
				if (_options.sUpdateGroupId) {
					_oParameters["$$updateGroupId"] = _options.sUpdateGroupId;
				}

				if (_options.expand) {
					_oParameters["$expand"] = _options.expand;
				}

				if (_options.select) {
					_oParameters["$select"] = _options.select;
				}

				//oData Response Handling
				var fnDeleteAsyncCall = function (_oModel, _options, _oParameters) {
					var oContext = _oModel.bindContext(_options.sPath, null, {}).getBoundContext();
					oContext.requestObject().then((deletedObj) => {
							oContext.delete().then((oData) => {
									if (__bGlobalBusy === false) {
										if (_options.oControl) {
											_options.oControl.setBusy(false);
										}
									} else {
										BusyLoaderUtils.__closeBusyDialog(_options.sPath);
									}
									if (_options.fnSuccess) {
										_options.fnSuccess(oData);
									}
								})
								.catch((err) => {
									if (__bGlobalBusy === false) {
										if (_options.oControl) {
											_options.oControl.setBusy(false);
										}
									} else {
										BusyLoaderUtils.__closeBusyDialog(_options.sPath);
									}
									if (err) {
										if (_options.fnError) {
											_options.fnError(err);
										}
									}
								});
						})
						.catch((err) => {
							if (__bGlobalBusy === false) {
								if (_options.oControl) {
									_options.oControl.setBusy(false);
								}
							} else {
								BusyLoaderUtils.__closeBusyDialog(_options.sPath);
							}
							if (err) {
								if (_options.fnError) {
									_options.fnError(err);
								}
							}
						});
				};

				fnDeleteAsyncCall(_oModel, _options, _oParameters);
			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sPath);
				}
			}
		},

		/* This method is used for Odata v4 Update Call
		 * @memberOf com.companyname.it.zui5_odataUtils.libs.zODataV4Utils
		 */
		/*
		Properties in _options
		bGlobalBusy -> If true, Global Busy Dialog is used. If false busy dialog for respective control is used(oControl should be used if false).
		oControl -> The control to be set busy is passed in it. It is used with bGlobalBusy = false.
		sPath -> The binding path in the model(entity name or absolute path).
		oHeaders -> Headers to be set for the model
		sGroupId -> The group ID to be used for read requests
		sUpdateGroupId -> The group ID to be used for update requests
		expand -> The expand navigation property
		select -> Array of properties to be fetched.
		fnSuccess -> Function to be called after the read operation is completed.
		*/
		__updateODataOperation: function (_options) {
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
							});
						}
					}
				} else {
					BusyLoaderUtils.__openBusyDialog(_options.sPath);
				}

				var _oModel = _options.oModel,
					_oParameters = {},
					_oHeader;

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}
				_oModel.changeHttpHeaders(_oHeader);

				//Add GroupId
				if (_options.sGroupId) {
					_oParameters["$$groupId"] = _options.sGroupId;
				}

				//Add Update GroupId
				if (_options.sUpdateGroupId) {
					_oParameters["$$updateGroupId"] = _options.sUpdateGroupId;
				}

				if (_options.expand) {
					_oParameters["$expand"] = _options.expand;
				}

				if (_options.select) {
					_oParameters["$select"] = _options.select;
				}
				var oContext;

				//oData Response Handling
				var fnUpdateAsyncCall = function (_oModel, _options, _oParameters) {
					oContext = _oModel.bindContext(_options.sPath, null, {}).getBoundContext();
					oContext.requestObject().then((oObject) => {
							var deferred = $.Deferred(),
								count = 0;
							if (oObject) {
								var keys = Object.keys(oObject);
								for (var i = 0; i < keys.length; i++) {
									if (oObject[keys[i]] !== _options.oRequestBody[keys[i]]) {
										oContext.setProperty(keys[i], _options.oRequestBody[keys[i]], _options.sUpdateGroupId).then((oData) => {
												if (count === 0) {
													count++;
													if (__bGlobalBusy === false) {
														if (_options.oControl) {
															_options.oControl.setBusy(false);
														}
													} else {
														BusyLoaderUtils.__closeBusyDialog(_options.sPath);
													}
													if (_options.fnSuccess) {
														_options.fnSuccess(oData);
													}
												}
											})
											.catch((err) => {
												if (__bGlobalBusy === false) {
													if (_options.oControl) {
														_options.oControl.setBusy(false);
													}
												} else {
													BusyLoaderUtils.__closeBusyDialog(_options.sPath);
												}
												if (err) {
													if (_options.fnError) {
														_options.fnError(err);
													}
												}
											});
									}
								}
							} else {
								if (count === 0) {
									if (__bGlobalBusy === false) {
										if (_options.oControl) {
											_options.oControl.setBusy(false);
										}
									} else {
										BusyLoaderUtils.__closeBusyDialog(_options.sPath);
									}
								}
							}
							deferred.done(function () {

							});

						})
						.catch((err) => {
							if (__bGlobalBusy === false) {
								if (_options.oControl) {
									_options.oControl.setBusy(false);
								}
							} else {
								BusyLoaderUtils.__closeBusyDialog(_options.sPath);
							}
							if (err) {
								if (_options.fnError) {
									_options.fnError(err);
								}
							}
						});

				};
				fnUpdateAsyncCall(_oModel, _options, _oParameters);

			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sPath);
				}
			}

		},

		/* This method is used for Odata v4 Create Call
		 * @memberOf com.companyname.it.zui5_odataUtils.libs.zODataV4Utils
		 */
		/*
		Properties in _options
		bGlobalBusy -> If true, Global Busy Dialog is used. If false busy dialog for respective control is used(oControl should be used if false).
		oControl -> The control to be set busy is passed in it. It is used with bGlobalBusy = false.
		sPath -> The binding path in the model(entity name or absolute path).
		oFilters -> Dynamic filters for the entity call
		oSorters -> Dynamic sorters for the entity call
		oHeaders -> Headers to be set for the model
		sGroupId -> The group ID to be used for read requests
		sUpdateGroupId -> The group ID to be used for update requests
		expand -> The expand navigation property
		select -> Array of properties to be fetched.
		fnSuccess -> Function to be called after the read operation is completed.
		*/
		__createODataOperation: function (_options) {
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
							});
						}
					}
				} else {
					BusyLoaderUtils.__openBusyDialog(_options.sPath);
				}

				var _oModel = _options.oModel,
					_oParameters = {},
					_oHeader;

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}
				_oModel.changeHttpHeaders(_oHeader);

				//Add GroupId
				if (_options.sGroupId) {
					_oParameters["$$groupId"] = _options.sGroupId;
				}

				//Add Update GroupId
				if (_options.sUpdateGroupId) {
					_oParameters["$$updateGroupId"] = _options.sUpdateGroupId;
				}

				if (_options.expand) {
					_oParameters["$expand"] = _options.expand;
				}

				if (_options.select) {
					_oParameters["$select"] = _options.select;
				}

				//oData Response Handling
				var fnCreateAsyncCall = function (_oModel, _options, _oParameters) {
					var oListBinding = _oModel.bindList(_options.sPath, null, _options.oSorters, _options.oFilters, _oParameters);
					var oContext = oListBinding.create(_options.oRequestBody);
					oContext.created().then(function () {
							var oData = oContext.getObject();
							if (__bGlobalBusy === false) {
								if (_options.oControl) {
									_options.oControl.setBusy(false);
								}
							} else {
								BusyLoaderUtils.__closeBusyDialog(_options.sPath);
							}
							if (_options.fnSuccess) {
								_options.fnSuccess(oData);
							}
						})
						.catch((err) => {
							if (__bGlobalBusy === false) {
								if (_options.oControl) {
									_options.oControl.setBusy(false);
								}
							} else {
								BusyLoaderUtils.__closeBusyDialog(_options.sPath);
							}
							if (_options.fnError) {
								_options.fnError(err);
							}
						});
				};

				fnCreateAsyncCall(_oModel, _options, _oParameters);

			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sPath);
				}
			}
		},

		/* This method is used for Odata v4 Submit Batch Call
		 * @memberOf com.companyname.it.zui5_odataUtils.libs.zODataV4Utils
		 */
		/*
		Properties in _options
		bGlobalBusy -> If true, Global Busy Dialog is used. If false busy dialog for respective control is used(oControl should be used if false).
		oControl -> The control to be set busy is passed in it. It is used with bGlobalBusy = false.
		sPath -> The binding path in the model(entity name or absolute path).
		oHeaders -> Headers to be set for the model
		sGroupId -> The group ID to be used for read requests
		fnSuccess -> Function to be called after the read operation is completed.
		*/
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
							});
						}
					}
				} else {
					BusyLoaderUtils.__openBusyDialog(_options.sGroupId);
				}

				var _oModel = _options.oModel,
					_oHeader;

				//Add Header Parameter
				if (_options.oHeaders) {
					Object.assign(_oHeader, _options.oHeaders);
				}
				_oModel.changeHttpHeaders(_oHeader);

				//OData Call Handling
				_oModel.submitBatch(_options.sGroupId).then(function (oData) {
						if (__bGlobalBusy === false) {
							if (_options.oControl) {
								_options.oControl.setBusy(false);
							}
						} else {
							BusyLoaderUtils.__closeBusyDialog(_options.sGroupId);
						}
						if (_options.fnSuccess) {
							_options.fnSuccess(oData);
						}
					})
					.catch((err) => {
						if (__bGlobalBusy === false) {
							if (_options.oControl) {
								_options.oControl.setBusy(false);
							}
						} else {
							BusyLoaderUtils.__closeBusyDialog(_options.sGroupId);
						}
						if (_options.fnError) {
							_options.fnError(err);
						}
					});
			} catch (err) {
				if (_options.oControl && __bGlobalBusy === false) {
					_options.oControl.setBusy(false);
				} else if (__bGlobalBusy === true) {
					BusyLoaderUtils.__closeBusyDialog(_options.sGroupId);
				}
			}
		}

	};
});