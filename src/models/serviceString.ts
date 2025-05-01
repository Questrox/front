import { ServiceStatus } from "./dictionaries";

export interface ServiceString {
  id: number;
  count: number;
  additionalServiceID: number;
  reservationID: number;
  price: number;
  serviceStatusID: number;
  serviceStatus: ServiceStatus;
}

export interface SelectedService {
    count: number;
    additionalServiceID: number;
    price: number;
}