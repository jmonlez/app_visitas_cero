/*global QUnit*/

sap.ui.define([
	"visitas/cero/visitas0/controller/Visitas0.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Visitas0 Controller");

	QUnit.test("I should test the Visitas0 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
