sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
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
    },

    onDelete: function (oEvent) {

        const oContext = oEvent.getSource().getBindingContext("global");
        const oModel = this.getOwnerComponent().getModel("global");
        const aVisitas = oModel.getProperty("/visitas");
        const oObject = oContext.getObject();

        sap.m.MessageBox.confirm("¿Seguro que quieres eliminar esta visita?", {
            title: "Confirmar eliminación",
            actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
            emphasizedAction: sap.m.MessageBox.Action.CANCEL,

            onClose: function (sAction) {
                if (sAction === MessageBox.Action.OK) {

                    const iIndex = aVisitas.indexOf(oObject);

                    if (iIndex > -1) {
                        aVisitas.splice(iIndex, 1);
                        oModel.setProperty("/visitas", aVisitas);
                    }

                    sap.m.MessageToast.show("Visita eliminada ✔");
                }
            }
        });
    }, 

    onEdit: function (oEvent) {

        const oContext = oEvent.getSource().getBindingContext("global");
        const oData = oContext.getObject();

        const oEditModel = new sap.ui.model.json.JSONModel(oData);

        this.getOwnerComponent().setModel(oEditModel, "edit");

        this.getOwnerComponent().getRouter().navTo("RouteVisitas0");
    }

    });

});