sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("visitas.cero.visitas0.controller.Admin", {
        onInit: function () {
            
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteVisitas0");
        },

        onOpenObs: function (oEvent) {

    const oContext = oEvent.getSource().getBindingContext("global");
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