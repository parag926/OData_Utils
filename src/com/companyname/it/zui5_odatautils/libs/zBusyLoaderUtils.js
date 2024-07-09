/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
/* eslint-disable */
sap.ui.define([
	"com/companyname/it/zui5_odatautils/controls/ExtBusyDialog"
], function (BusyDialog) {
	"use strict";

	return {
		__openBusyDialog: function (__sBusyOpenedBy) {
			if (!this.__oBusyDialog) {
				var _oBusyDialog = new BusyDialog();
				this.__oBusyDialog = _oBusyDialog;
				window.setTimeout(function () {
					this.__oBusyDialog.openBusyDialog(__sBusyOpenedBy);
				}.bind(this), 0);
			} else {
				window.setTimeout(function () {
					this.__oBusyDialog.openBusyDialog(__sBusyOpenedBy);
				}.bind(this), 0);
			}
		},

		__closeBusyDialog: function (bForceClose) {
			if (this.__oBusyDialog) {
				this.__oBusyDialog.closeBusyDialog(bForceClose);
			}
		},
		
		getBusyDialogOpened: function(){
			if(this.__oBusyDialog){
				return this.__oBusyDialog.getIsOpen();
			}else{
				return false;
			}
		}

	};
});