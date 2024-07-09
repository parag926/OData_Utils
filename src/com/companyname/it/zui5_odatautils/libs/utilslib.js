sap.ui.define([], function () {
	"use strict";
	var __sUserId,
		__oUserDtls;
	return {
		__fnGetDevOnlyEnabled: function (systemId) {
			var __bEnabled = false,
				__bLocal = true, //Only Enable for WEBIDE testing
				__sHost = window.location.host.toUpperCase();
			try {
				if (sap.ushell !== undefined) {
					var __oLogonSystem = sap.ushell.Container.getLogonSystem(),
						__sPlatform = __oLogonSystem.getPlatform(),
						__sName = __oLogonSystem.getName();
					if (__sPlatform === "local" && __bLocal === true) {
						__bEnabled = true;
					} else if (__sPlatform === "abap") {
						if (__sName === systemId) {
							__bEnabled = true;
						}
					}
				} else {
					if (__sHost.indexOf("WEBIDE") > -1 && __bLocal === true) {
						__bEnabled = true;
					} else if (__sHost.indexOf(systemId) > -1) {
						__bEnabled = true;
					}
				}
			} catch (err) {
				if (__sHost.indexOf("WEBIDE") > -1 && __bLocal === true) {
					__bEnabled = true;
				} else if (__sHost.indexOf(systemId) > -1) {
					__bEnabled = true;
				}
			}

			return __bEnabled;
		},

		fnGetUsersDetails: function () {
			try {
				if (!sap.ushell) {
					$.ajax({
						type: "GET",
						contentType: "application/json",
						url: "/sap/bc/ui2/start_up",
						dataType: "json",
						async: false,
						success: function (oData, txtStatus, jqXHR) {
							if (txtStatus.toUpperCase() === "SUCCESS" && jqXHR["status"] === 200) {
								__oUserDtls = oData;
								__sUserId = oData.id.toUpperCase();
							}
						},
						error: function (oErr) {
							__sUserId = "";
							__oUserDtls = {};
						}
					});
				} else {
					__sUserId = "";
					__oUserDtls = {};
				}
			} catch (err) {
				__sUserId = "";
				__oUserDtls = {};
			}
		},
		

		fnValidateUserAccess: function (aUsers) {
			var __bAccessAllowed = false;
			try {
				if (sap.ushell !== undefined) {
					var sUserId = new sap.ushell.services.UserInfo().getId();
					for (var oUser of aUsers) {
						if (sUserId.toUpperCase() === oUser.toUpperCase()) {
							__bAccessAllowed = true;
						}
					}
				} else {
					if(!__sUserId){
						this.fnGetUsersDetails();
					}
					for (var oUser of aUsers) {
						if (__sUserId === oUser.toUpperCase()) {
							__bAccessAllowed = true;
						}
					}
				}
			} catch (err) {
				__bAccessAllowed = false;
			}
			return __bAccessAllowed;
		},
		/* SOC PSENAPATI CUSTOM DEV Developer Options*/
		fnValidateDevelopers: function () {
			var aDevelopers = ["AVERMA4", "BDHRAMRAJDEL", "ACHOPRADELOI", "PSENAPATIDEL", "MSHEKHARDELO", "PGUPTADELOI4", "GSINGHDELOI1", "TWANGMO", "MMOHAN8"];
			if((this.fnValidateUserAccess(aDevelopers) && (this.__fnGetDevOnlyEnabled("DVE") || this.__fnGetDevOnlyEnabled("ITE"))) || window.location.host.toUpperCase().includes("WEBIDE")){
				return true;
			}else{
				return false;
			}
		}
		/* EOC PSENAPATI CUSTOM DEV Developer Options */

	};
});