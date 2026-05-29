namespace visitas0.db;

entity Visitas {
  key ID            : UUID;
  empresa           : String;
  direccion         : String;
  contacto          : String;
  email             : String;
  responsable       : String;
  empleado          : String;
  observaciones     : String;

  fecha             : Date;
  horaInicio        : String;
  horaFin           : String;

  latitud           : Decimal(9,6);
  longitud          : Decimal(9,6);

  ultimaModificacion : String;
}