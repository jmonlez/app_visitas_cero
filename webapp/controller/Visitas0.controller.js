sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], 
function (Controller, MessageBox){
    "use strict";

    return Controller.extend("visitas.cero.visitas0.controller.Visitas0", {
        onInit: function () {
        },
        onPress: function () {
            MessageBox.show("Hola mundo!");
        }
    });
});