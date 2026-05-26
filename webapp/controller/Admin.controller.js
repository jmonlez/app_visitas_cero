sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("visitas.cero.visitas0.controller.Admin", {

        onInit: function () {

        },

        onBack: function () {

            this.getOwnerComponent().getRouter().navTo("RouteVisitas0");

        },

        onDelete: function () {

        }

    });
});