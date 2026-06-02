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

            const btnStart = this.byId("btnStartVisit");
            const btnEnd = this.byId("btnEndVisit");

            if (this._editMode) {
                btnStart.setVisible(false);
                btnEnd.setVisible(false);
                return;
            }

            const state = this.getView().getModel("view").getProperty("/visitState");
            
                if (state === "START") {
                    btnStart.setVisible(true);
                    btnEnd.setVisible(false);
                } else if (state === "END") {
                    btnStart.setVisible(false);
                    btnEnd.setVisible(true);
                } else {
                    btnStart.setVisible(false);
                    btnEnd.setVisible(false);
                }

        },

        onInit: function () {

            this._editMode = false;

            const oViewModel = new JSONModel({
                visitState: "START"
            });

            this.getView().setModel(oViewModel, "view");

            this.getOwnerComponent()
                .getRouter()
                .getRoute("RouteVisitas0")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {

            const oEdit = this.getOwnerComponent().getModel("edit");

            if (!oEdit || !oEdit.oData || Object.keys(oEdit.oData).length === 0) {
                this.getOwnerComponent().setModel(null, "edit");
                this.getOwnerComponent()._oEditContext = null;

                this._editMode = false;

                this.onClear();

                this.byId("btnSave").setText("💾 Guardar visita");

                return;
            }

            this._editMode = true;

            this.getView().getModel("view").setProperty("/visitState", "DONE");

            this.byId("btnSave").setText("🔄 Actualizar visita");

            const data = oEdit.oData;

            this.byId("empresa").setValue(data.empresa || "");
            this.byId("direccion").setValue(data.direccion || "");
            this.byId("contacto").setValue(data.contacto || "");
            this.byId("email").setValue(data.email || "");
            this.byId("responsable").setValue(data.responsable || "");
            this.byId("empleado").setValue(data.empleado || "");
            this.byId("observaciones").setValue(data.observaciones || "");

            this._fecha = data.fecha;
            this._horaInicio = data.horaInicio;
            this._horaFin = data.horaFin;
            this._lat = data.latitud;
            this._lon = data.longitud;

            this.byId("txtFecha").setText("📅 Fecha: " + (data.fecha || "no establecida"));
            this.byId("txtHoraInicio").setText("⏰ Inicio visita: " + (data.horaInicio || "no registrada"));
            this.byId("txtHoraFin").setText("⏰ Fin visita: " + (data.horaFin || "no registrada"));

            const gps = (data.latitud && data.longitud)
                ? data.latitud + ", " + data.longitud
                : "no obtenido";

            this.byId("txtGPS").setText("📍 GPS: " + gps);
  
            const btnSave = this.byId("btnSave");

            if (this._editMode) {
                btnSave.setText("🔄 Actualizar visita");
            } else {
                btnSave.setText("💾 Guardar visita");
            }

            this._updateButtons();
        },

        onGetLocation: function () {

            if (this._editMode) return;

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

            if (this._editMode) return;

            const now = new Date();

            this._fecha = now.toISOString().split("T")[0];

            this.byId("txtFecha").setText("📅 Fecha: " + this._fecha);

            this.getView().getModel("view").setProperty("/dateSet", true);

            MessageToast.show("Fecha registrada ✔");

        },

        onStartVisit: function () {

            if (this._editMode) return;

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

            
            if (!this._editMode) {

                if (!this._fecha || !this._horaInicio || !this._horaFin) {
                    return MessageToast.show("Completa la visita (inicio y fin)");
                }

                if (!this._lat || !this._lon) {
                    return MessageToast.show("Debe obtener la ubicación GPS");
                }
            }
            
            Object.assign(data, {
                fecha: this._fecha,
                horaInicio: this._horaInicio,
                horaFin: this._horaFin,
                latitud: this._lat,
                longitud: this._lon
            });

            
            const oContext = this.getOwnerComponent()._oEditContext;

            if (oContext) {

                const now = new Date();

                const sFecha =
                    now.toLocaleTimeString("es-ES") + " " +
                    now.toLocaleDateString("es-ES");

                oContext.setProperty("empresa", data.empresa);
                oContext.setProperty("direccion", data.direccion);
                oContext.setProperty("contacto", data.contacto);
                oContext.setProperty("email", data.email);
                oContext.setProperty("responsable", data.responsable);
                oContext.setProperty("empleado", data.empleado);
                oContext.setProperty("observaciones", data.observaciones);

                oContext.setProperty("ultimaModificacion", sFecha);

                MessageToast.show("✅ Actualizada correctamente");

                this.getOwnerComponent().setModel(null, "edit");
                this.getOwnerComponent()._oEditContext = null;

                this.onClear();

                this.getOwnerComponent().getRouter().navTo("RouteAdmin");
            }

            oModel.bindList("/Visitas").create(data)
            MessageToast.show("✅ Guardado correctamente");
            this.onClear(true);
        },

        onNavAdmin: function () {
            this.getOwnerComponent().setModel(null, "edit");
            this.getOwnerComponent()._oEditContext = null;

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
            
            this._updateButtons();

            MessageToast.show("Formulario limpio 🧹");
        }

    });
});