import { RoomType } from "./roomType";

export interface Room {
    id: number;
    number: number;
    roomTypeID: number;
    roomType: RoomType;
  }