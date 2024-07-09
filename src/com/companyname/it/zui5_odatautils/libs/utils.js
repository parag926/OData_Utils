/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
/* eslint-disable */
sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Creates a error message popup for functional errors in the footer bar and adds items in it
		 * @param {object} oModel Model bound to the footer bar
		 * @param {object} oMessageObject Message Data shown as the message 
		 * @returns {object} oModel to be set on the footer view
		 * @public
		 * */

		addMessageItem: function (oModel, oMessageObject) {
			if (!this.oMessagePopover) {
				var oMessageTemplate = new sap.m.MessagePopoverItem({
					type: "{type}",
					title: "{title}",
					description: "{description}",
					subtitle: "{subtitle}",
					counter: "{counter}"
				});
				this.oMessagePopover = new sap.m.MessagePopover({
					items: {
						path: "/messageItem",
						template: oMessageTemplate
					}
				});
			}
			var oData = oModel.getData();
			//check if the object is there
			if (oMessageObject) {
				//check if the error is from the same control and if the item is undefined
				//for the first run when no issue is raised.add the issue item
				//check if the oMessageObject.control is a control or backend error message
				if (oMessageObject.messageSource === "UI") {
					//set the statevalue for the control to error
					oMessageObject.control.setValueState(oMessageObject.type);
					//set the control id to the object oMessageObject which will be the unique id
					oMessageObject.control = oMessageObject.control.getId();
				}
				//check if the message is already added in the model which is set to the footer button
				if (oData.messageItemType[oMessageObject.control] === undefined || (oData.messageItemType[oMessageObject.control] !==
						undefined &&
						oData.messageItemType[oMessageObject.control] < 0)) {
					//push the error items in the 
					oData.messageItem.push(oMessageObject);
					oData.messageItemType[oMessageObject.control] = oData.messageItem.indexOf(oMessageObject);
					oData.messageLength = oData.messageItem.length;
					oData.messageVisible = true;
					this.oMessagePopover.setModel(oModel);
				}

			}
			return oModel;
		},
		checkErrorExistsInMsgModel: function () {
			var oMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
			var check = false;
			for (var i = 0; i < oMessages.length; i++) {
				if (oMessages[i].type === "Error") {
					check = true;
					break;
				}
			}
			return check;
		},

		removeMessageFromTarget: function (sTarget) {
			sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(function (oMessage) {
				if (oMessage.target === sTarget) {
					sap.ui.getCore().getMessageManager().removeMessages(oMessage);
				}
			}.bind(this));
		},
		removeBackendIssues: function (sTarget) {
			sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(function (oMessage) {
				if (oMessage.target === "/A_BusinessSolutionQuotation" && oMessage.target.code === "TCHK_MOVE_CORRESPONDING") {
					sap.ui.getCore().getMessageManager().removeMessages(oMessage);
				}
			}.bind(this));
		}, //manoj : to remove backend issues or error messages reported by standard odata services
		/**
		 * Checks the error message popup for functional errors in the footer bar and removes items in it
		 * @param {object} oModel Model bound to the footer bar
		 * @param {object} oControlId The  control that had issues or functional issue
		 * @returns {object} oModel to be set on the footer view
		 * @public
		 * */

		checkMessageItem: function (oModel, oControlId) {
			//can send the control id having the error
			if (this.oMessagePopover) {
				var oData = oModel.getData();
				//check which is the type of error has to be removed
				if (oControlId.messageSource === "UI") {
					//set the statevalue for the control to error none
					if (oControlId.control.setValueState) {
						oControlId.control.setValueState("None");
					}
					//set the control id to the object oMessageObject which will be the unique id
					oControlId.control = oControlId.control.getId();
					if (oData.messageItemType[oControlId.control] !== undefined) {
						//remove the error from the array and set the model again
						oData.messageItem.splice(oData.messageItemType[oControlId.control], 1);
						delete oData.messageItemType[oControlId.control];
					}
				} else {
					//check if it is first time
					if (oData.messageItem) {
						// loop the data to find the one to delete
						var aItems = [];
						//find the items with text functionalError
						for (var i = 0; i < Object.keys(oData.messageItem).length; i++) {
							//check to see if it matches
							if (oData.messageItem[i].control.match(oControlId.control)) {
								aItems.push(oData.messageItem[i].control);
							}
						}
						for (i = 0; i < aItems.length; i++) {
							//remove the error from the array and set the model again
							oData.messageItem.splice(oData.messageItemType[aItems[i]], 1);
							//update the index numbers in the messageItemType after the splicing
							for (var j = 0; j < oData.messageItem.length; j++) {
								oData.messageItemType[oData.messageItem[j].control] = oData.messageItem.indexOf(oData.messageItem[j]);
							}
							delete oData.messageItemType[aItems[i]];
						}
					}
				}
				oData.messageLength = oData.messageItem.length;
				//will show if other errors are there
				oData.messageVisible = oData.messageLength !== 0;
				this.oMessagePopover.setModel(oModel);
			}
			return oModel;
		},

		updateErrorModel: function (errorModel, oMessageData) {

			var oErrorModel;

			// //check for error if any message there or empty
			if (!jQuery.isEmptyObject(oMessageData)) {
				//remove all the error
				oErrorModel = this.checkMessageItem(errorModel, {
					control: "functionalError",
					messageSource: "BE"
				});

				if (oMessageData && oMessageData.length !== 0) {
					for (var i = 0; i < oMessageData.length; i++) {
						var oErrorObject = {
							//added because the BE gives all small letter while the type has camel casing
							type: oMessageData[i].severity.charAt(0).toUpperCase() + oMessageData[i].severity.slice(1),
							title: oMessageData[i].message,
							description: oMessageData[i].message,
							// i is required to make it unique
							control: "functionalError" + oMessageData[i].code + i,
							messageSource: "BE"
						};
						oErrorModel = this.addMessageItem(errorModel, oErrorObject);
						errorModel.setProperty("/", oErrorModel.getData());
					}
				}

			} else {
				//removes the messages
				oErrorModel = this.checkMessageItem(errorModel, {
					control: "functionalError",
					messageSource: "BE"
				});
				errorModel.setProperty("/", oErrorModel.getData());
			}
		}
	};
});