import { Room } from "./room";

export interface RoomType {
    id: number;
    guestCapacity: number;
    price: number;
    description: string;
    roomCategoryID: number;
    roomCategory: RoomCategory;
    rooms: Room[];
  }

  export interface RoomCategory {
    id: number;
    category: string;
  }
  
  