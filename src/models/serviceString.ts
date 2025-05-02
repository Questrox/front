import { AdditionalService } from "./additionalService";
import { ServiceStatus } from "./dictionaries";
import { Reservation } from "./reservation";

export interface ServiceString {
  id: number;
  count: number;
  deliveredCount: number;
  additionalServiceID: number;
  additionalService: AdditionalService;
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