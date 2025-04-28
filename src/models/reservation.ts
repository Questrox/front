import { ReservationStatus } from "./dictionaries";
import { Room } from "./room";

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
}