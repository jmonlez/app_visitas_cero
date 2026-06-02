sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("visitas.cero.visitas0.controller.Admin", {
        onInit: function () {
            const oEdit = this.getOwnerComponent().getModel("edit");

            const oViewModel = new JSONModel({
                sitState: oEdit ? "DONE" : "START"
            });

            this.getView().setModel(oViewModel, "view");
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteVisitas0");
        },

        onOpenObs: function (oEvent) {
            
            const oSource = oEvent.getSource();
            const oContext = oSource.getBindingContext();

            if (!oContext) {
                MessageToast.show("No se pudo leer la fila");
                return;
            }

            const sText = oContext.getProperty("observaciones");

            if (!this._oDialog) {

                this._oDialog = new sap.m.Dialog({
                    title: "📝 Observaciones",
                    contentWidth: "500px",
                    content: new sap.m.Text({
                        width: "100%",
                        wrapping: true   
                    }).addStyleClass("sapUiSmallMargin"),
                    endButton: new sap.m.Button({
                        text: "Cerrar",
                        press: function () {
                            this._oDialog.close();
                        }.bind(this)
                    })
                });

                this.getView().addDependent(this._oDialog);
            }

            this._oDialog.getContent()[0].setText(
                (sText && sText.trim() !== "")
                    ? sText
                    : "Sin observaciones"
            );

            this._oDialog.open();
        },

        onDelete: function (oEvent) {

        const oContext = oEvent.getSource().getBindingContext();

        sap.m.MessageBox.confirm("¿Seguro que quieres eliminar esta visita?", {
            title: "Confirmar eliminación",
            actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
            emphasizedAction: sap.m.MessageBox.Action.CANCEL,

            onClose: function (sAction) {
                if (sAction === MessageBox.Action.OK) {

                    oContext.delete().then(function () {
                        sap.m.MessageToast.show("Visita eliminada ✔");
                    }).catch(function (err) {
                        sap.m.MessageToast.show("Error al eliminar ❌");
                        console.error(err);
                    });

                    sap.m.MessageToast.show("Visita eliminada ✔");
                }
            }
        });
    }, 

    onEdit: function (oEvent) {

        const oContext = oEvent.getSource().getBindingContext();
        const oData = oContext.getObject();

        const oEditModel = new JSONModel(oData);
        this.getOwnerComponent().setModel(oEditModel, "edit");

        this.getOwnerComponent()._oEditContext = oContext;

        this.getOwnerComponent().getRouter().navTo("RouteVisitas0");
    }

    });

});