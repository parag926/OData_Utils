sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/BusyDialog"
], function (Control, BusyDialog) {
	"use strict";

	return BusyDialog.extend("com.companyname.it.zui5_odataUtils.controls.ExtBusyDialog", {

		metadata: {
			properties: {
				isOpen: {
					type: "boolean",
					defaultValue: false
				},
				stackCount: {
					type: "int",
					defaultValue: 0
				},
				sOpenedBySrv: {
					type: "string",
					defaultValue: ""
				}
			},
			aggregations: {

			},
			events: {
				"busyOpen": {},
				"busyClose": {}
			}
		},

		init: function () {

			BusyDialog.prototype.init.call(this);

			this.attachBusyOpen(this.busyOpen);
			this.attachBusyClose(this.busyClose);
		},

		_setIsOpen: function (sValue) {
			this.setProperty("isOpen", sValue);
			return this;
		},

		getIsOpen: function () {
			return this.getProperty("isOpen");
		},

		getStackCount: function () {
			return this.getProperty("stackCount");
		},

		_setStackCount: function (value) {
			this.setProperty("stackCount", value);
			return this;
		},

		_increaseStackCount: function () {
			var count = this.getStackCount();
			count++;
			this._setStackCount(count);
		},

		_decreaseStackCount: function () {
			var count = this.getStackCount();
			count--;
			if (count < 0) {
				count = 0;
			}
			this._setStackCount(count);
		},

		setOpenedBySrv: function (sValue) {
			this.setProperty("sOpenedBySrv", sValue);
			return this;
		},

		getOpenedBySrv: function () {
			return this.getProperty("sOpenedBySrv");
		},

		busyOpen: function (oEvent) {
			if (this.getIsOpen() === false) {
				this._increaseStackCount();
				this._setIsOpen(true);
				this.open();
			} else {
				this._increaseStackCount();
			}
		},
		openBusyDialog: function(sOpenedBy){
			if(sOpenedBy){
				this.setOpenedBySrv(sOpenedBy);
			}
			this.fireBusyOpen();
		},
		busyClose: function (oEvent) {
			if (this.getStackCount() > 1) {
				this._decreaseStackCount();
			} else if (this.getIsOpen() === true) {
				this._setStackCount(0);
				this.setOpenedBySrv("");
				this._setIsOpen(false);
				this.close();
			}
		},
		closeBusyDialog: function (bForce) {
			if (bForce) {
				if (this.getIsOpen() === true) {
					this._setStackCount(0);
					this.setOpenedBySrv("");
					this._setIsOpen(false);
					this.close();
				}
			} else {
				this.fireBusyClose();
			}
		}

	});
});