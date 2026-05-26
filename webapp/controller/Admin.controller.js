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
                        empresa: "SAP León",
                        direccion: "Calle Falsa 123",
                        contacto: "987654321",
                        email: "test@sap.com",
                        responsable: "Carlos",
                        empleado: "Julia",
                        fecha: "2026-01-01",
                        horaInicio: "10:00",
                        horaFin: "11:00",
                        latitud: "42.6",
                        longitud: "-5.57",
                        observaciones: "Visita demo",
                        createdBy: "admin"
                    }
                ]
            };

            this.getView().setModel(new JSONModel(oData), "demo");
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteVisitas0");
        },

        onOpenObs: function (oEvent) {

    const oContext = oEvent.getSource().getBindingContext("demo");
    const sText = oContext.getProperty("observaciones");

    if (!this._oDialog) {

        this._oDialog = new sap.m.Dialog({
            title: "📝 Observaciones",
            contentWidth: "500px",
            content: new sap.m.Text({
                wrapping: true
            }),
            endButton: new sap.m.Button({
                text: "Cerrar",
                press: function () {
                    this._oDialog.close();
                }.bind(this)
            })
        });

        this.getView().addDependent(this._oDialog);
    }

    this._oDialog.getContent()[0].setText(sText || "Sin observaciones");
    this._oDialog.open();
}

    });

});