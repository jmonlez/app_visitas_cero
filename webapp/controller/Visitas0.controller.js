sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], 
function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.visitas.visitasui.controller.Visitas", {

        _fecha: null,
        _horaInicio: null,
        _horaFin: null,
        _lat: null,
        _lon: null,

        _updateButtons: function () {
            const state = this.getView().getModel("view").getProperty("/visitState");

            const btnStart = this.byId("btnStartVisit");
            const btnEnd = this.byId("btnEndVisit");

            if (this._editMode) {
                btnStart.setVisible(false);
                btnEnd.setVisible(false);
                return;
            }

            btnStart.setVisible(state === "START");
            btnEnd.setVisible(state === "END");
        },

        onInit: function () {

            this._editMode = false;

            const oViewModel = new JSONModel({
                visitState: "START"
            });

            this.getView().setModel(oViewModel, "view");

            const oEdit = this.getOwnerComponent().getModel("edit");

            if (oEdit) {

                this._editMode = true;

                const data = oEdit.getData();

                this.byId("empresa").setValue(data.empresa);
                this.byId("direccion").setValue(data.direccion);
                this.byId("contacto").setValue(data.contacto);
                this.byId("email").setValue(data.email);
                this.byId("responsable").setValue(data.responsable);
                this.byId("empleado").setValue(data.empleado);
                this.byId("observaciones").setValue(data.observaciones);

            }

            this._updateButtons();
        },

        onGetLocation: function () {

            if (!navigator.geolocation) {
                return MessageToast.show("Geolocalización no soportada");
            }

            navigator.geolocation.getCurrentPosition((pos) => {

                this._lat = pos.coords.latitude;
                this._lon = pos.coords.longitude;

                this.byId("txtGPS").setText(
                    "📍 GPS: " + this._lat + ", " + this._lon
                );

                MessageToast.show("Ubicación registrada ✔");

            }, () => {
                MessageToast.show("Error al obtener ubicación");
            });

        },

        onSetDate: function () {

            const now = new Date();

            this._fecha = now.toISOString().split("T")[0];

            this.byId("txtFecha").setText("📅 Fecha: " + this._fecha);

            this.getView().getModel("view").setProperty("/dateSet", true);

            MessageToast.show("Fecha registrada ✔");

        },

        onStartVisit: function () {

            const now = new Date();
            this._horaInicio = now.toTimeString().split(" ")[0];

            this.byId("txtHoraInicio").setText("⏰ Inicio visita: " + this._horaInicio);

            this.getView().getModel("view").setProperty("/visitState", "END");

            this._updateButtons();

            MessageToast.show("Visita iniciada ✔");

        },

        onEndVisit: function () {

            const now = new Date();
            this._horaFin = now.toTimeString().split(" ")[0];

            this.byId("txtHoraFin").setText("⏰ Fin visita: " + this._horaFin);

            this.getView().getModel("view").setProperty("/visitState", "DONE");

            this._updateButtons();

            MessageToast.show("Visita finalizada ✔");

        },

        onSave: function () {

            const oModel = this.getView().getModel();

            const empresa = this.byId("empresa").getValue();
            const direccion = this.byId("direccion").getValue();
            const contacto = this.byId("contacto").getValue();
            const email = this.byId("email").getValue();
            const responsable = this.byId("responsable").getValue();
            const empleado = this.byId("empleado").getValue();
            const observaciones = this.byId("observaciones").getValue();

            const data = {
                empresa: empresa,
                direccion: direccion,
                contacto: contacto,
                email: email,
                responsable: responsable,
                empleado: empleado,
                observaciones: observaciones
            };

            if (!empresa) return MessageToast.show("Introduzca la empresa");
            if (!direccion) return MessageToast.show("Introduzca la dirección");
            if (!contacto) return MessageToast.show("Introduzca el contacto");
            if (!email) return MessageToast.show("Introduzca el email");
            if (!responsable) return MessageToast.show("Introduzca el responsable");
            if (!empleado) return MessageToast.show("Introduzca el empleado");

            if (!this._fecha || !this._horaInicio || !this._horaFin) {
                return MessageToast.show("Completa la visita (inicio y fin)");
            }

            if (!this._lat || !this._lon) return MessageToast.show("Debe obtener la ubicación GPS");
            
            Object.assign(data, {
                fecha: new Date(this._fecha),
                horaInicio: this._horaInicio,
                horaFin: this._horaFin,
                latitud: this._lat,
                longitud: this._lon
            });

            const oEdit = this.getOwnerComponent().getModel("edit");

            if (oEdit) {

                const sPath = oEdit.getPath();

                oModel.update(sPath, data, {
                    success: () => {
                        MessageToast.show("✔ Visita actualizada");

                        this.getOwnerComponent().setModel(null, "edit");
                        this.onClear(true);

                        this.getView().getModel("view").setProperty("/visitState", "START");
                        this._updateButtons();
                    },
                    error: (err) => {
                        MessageToast.show("Error al actualizar ❌");
                        console.error(err);
                    }
                });

                return;
            }

            oModel.bindList("/Visitas").create(data)
            MessageToast.show("✔ Visita guardada");
            this.onClear(true);
        },

        onNavAdmin: function () {
            this.getOwnerComponent().getRouter().navTo("RouteAdmin");
        },

        onClear: function () {

            this.byId("empresa").setValue("");
            this.byId("direccion").setValue("");
            this.byId("contacto").setValue("");
            this.byId("email").setValue("");
            this.byId("responsable").setValue("");
            this.byId("empleado").setValue("");
            this.byId("observaciones").setValue("");
            
            this.byId("txtFecha").setText("📅 Fecha: no establecida");
            this.byId("txtHoraInicio").setText("⏰ Inicio visita: no registrada");
            this.byId("txtHoraFin").setText("⏰ Fin visita: no registrada");
            this.byId("txtGPS").setText("📍 GPS: no obtenido");

            this._fecha = null;
            this._horaInicio = null;
            this._horaFin = null;
            this._lat = null;
            this._lon = null;

            this.getView().getModel("view").setProperty("/visitState", "START");
            
            MessageToast.show("Formulario limpio 🧹");
        }

    });
});