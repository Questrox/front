export interface ReservationStatus {
    id: number;
    status: string;
  }

  export interface ServiceStatus {
    id: number;
    status: string;
  }

  export interface RoomTypeImage {
    id: number;
    imagePath: string;
    roomTypeID: number;
  }