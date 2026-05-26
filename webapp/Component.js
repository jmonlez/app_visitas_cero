sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "visitas/cero/visitas0/model/models"
], (UIComponent, JSONModel, models) => {
    "use strict";

    return UIComponent.extend("visitas.cero.visitas0.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {

            UIComponent.prototype.init.apply(this, arguments);

            const oGlobalModel = new JSONModel({
                visitas: []
            });

            this.setModel(oGlobalModel, "global");

            this.getRouter().initialize();
        }
    });
});