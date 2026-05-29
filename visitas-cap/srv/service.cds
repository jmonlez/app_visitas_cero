using { visitas0.db as db } from '../db/schema';

service VisitasService {
  entity Visitas as projection on db.Visitas;
}
