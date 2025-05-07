import { createContext, ReactNode, useEffect, useState } from "react"
import { Room } from "../models/room"
import RoomService from "../services/RoomService"
import { RoomType } from "../models/roomType"
import RoomTypeService from "../services/RoomTypeService"
import { PagedResult } from "../models/pagedResult"

// Интерфейс для контекста комнаты
interface RoomContextProps {
  rooms: Room[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  fetchRooms: (page: number) => Promise<void>;
  addRoom: (room: Omit<Room, "id">) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: number) => void;
  getRoomTypes: () => Promise<RoomType[]>;
}


// Создание контекста
export const RoomContext = createContext<RoomContextProps | undefined>(undefined)

// Провайдер контекста
export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);

  useEffect(() => {
      fetchRooms(currentPage)
    }, [])

  const fetchRooms = async (page: number) => {
    try {
      setCurrentPage(page);
      const data = await RoomService.getPaginatedRooms(page, pageSize);
      setRooms(data.items);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Ошибка при загрузке комнат:", error);
    }
  };

  const addRoom = async (room: Omit<Room, "id">) => {
    try {
      await RoomService.createRoom(room);
      await fetchRooms(currentPage); // или сохранить текущую страницу в useState
    } catch (error) {
      console.error("Ошибка при добавлении комнаты:", error);
    }
  };

  const updateRoom = async (updatedRoom: Room) => {
    try {
      await RoomService.updateRoom(updatedRoom);
      await fetchRooms(currentPage);
    } catch (error) {
      console.error("Ошибка при обновлении комнаты:", error);
    }
  };

  const deleteRoom = async (id: number) => {
    try {
      await RoomService.deleteRoom(id);
      await fetchRooms(currentPage);
    } catch (error) {
      console.error("Ошибка при удалении комнаты:", error);
    }
  };

  const getRoomTypes = async (): Promise<RoomType[]> => {
    return await RoomTypeService.getRoomTypes();
  };

  return (
    <RoomContext.Provider
      value={{ rooms, totalCount, page, setPage, pageSize, fetchRooms, addRoom, updateRoom, deleteRoom, getRoomTypes }}
    >
      {children}
    </RoomContext.Provider>
  );
};
