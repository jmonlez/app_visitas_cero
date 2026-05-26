sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("visitas.cero.visitas0.controller.Admin", {

        onInit: function () {

            const oData = {
                visitas: [
                    {
                        empresa: "Demo 1",
                        empleado: "Juan",
                        fecha: "2026-01-01",
                        estado: "OK"
                    },
                    {
                        empresa: "Demo 2",
                        empleado: "Ana",
                        fecha: "2026-01-02",
                        estado: "OK"
                    }
                ]
            };

            const oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "demo");
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteVisitas0");
        },

        onDelete: function () {
            console.log("delete");
        }

    });
});