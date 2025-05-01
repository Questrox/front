import { ReservationStatus, ServiceStatus } from "./dictionaries";
import { Room } from "./room";
import { SelectedService, ServiceString } from "./serviceString";

export interface Reservation {
  id: number;
  arrivalDate: string;
  departureDate: string;
  fullPrice: number;
  livingPrice: number;
  servicesPrice: number;
  roomID: number;
  userID: string;
  reservationStatusID: number;
  room: Room;
  reservationStatus: ReservationStatus;
  serviceStrings: ServiceString[];
}

export interface ReservationToCreate {
  arrivalDate: string;
  departureDate: string;
  fullPrice: number;
  livingPrice: number;
  servicesPrice: number;
  roomID: number;
  userID: string;
  reservationStatusID: number;
  services: SelectedService[]
}