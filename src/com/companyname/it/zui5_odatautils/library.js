/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library com.companyname.it.zui5_odatautils.
 */
sap.ui.define(["sap/ui/core/library"], // library dependency
	function () {

		"use strict";

		/**
		 *  Odata Utility
		 *
		 * @namespace
		 * @name com.companyname.it.zui5_odatautils
		 * @author SAP SE
		 * @version 1.0.0
		 * @public
		 */

		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "com.companyname.it.zui5_odatautils",
			version: "1.0.0",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			controls: [
				"com.companyname.it.zui5_odatautils.controls.ExtBusyDialog"
			],
			elements: []
		});

		/* eslint-disable */
		return com.companyname.it.zui5_odatautils;
		/* eslint-enable */

	}, /* bExport= */ false);