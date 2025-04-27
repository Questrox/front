import { createContext, ReactNode, useEffect, useState } from "react"
import { Room } from "../models/room"
import RoomService from "../services/RoomService"
import { RoomType } from "../models/roomType"
import RoomTypeService from "../services/RoomTypeService"

// Интерфейс для контекста комнаты
interface RoomContextProps {
  rooms: Room[] 
  addRoom: (rt: Omit<Room, "id">) => void 
  updateRoom: (rt: Room) => void 
  deleteRoom: (id: number) => void 
  getRoomTypes: () => Promise<RoomType[]>
}

// Создание контекста
export const RoomContext = createContext<RoomContextProps | undefined>(undefined)

// Провайдер контекста
export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    fetchRooms()
  }, [])

  // Получение комнат от API
  const fetchRooms = async () => {
    try {
      const data = await RoomService.getRooms()
      setRooms(data || [])
    } catch (error) {
      console.error("Ошибка при загрузке комнат:", error)
    }
  }

  // Добавление новой комнаты
  const addRoom = async (room: Omit<Room, "id">) => {
    try {
      const created = await RoomService.createRoom(room) 
      setRooms(prev => [...prev, created])
      
    } catch (error) {
      console.error("Ошибка при добавлении комнаты:", error)
    }
  }

  // Обновление комнаты
  const updateRoom = async (updatedRoom: Room) => {
    try {
      const newRoom = await RoomService.updateRoom(updatedRoom)
      setRooms((prev) => prev.map((room) => (room.id === newRoom.id ? newRoom : room)))
    } catch (error) {
      console.error("Ошибка при обновлении комнаты:", error)
    }
  }

  // Удаление комнаты
  const deleteRoom = async (id: number) => {
    try {
      await RoomService.deleteRoom(id)
      setRooms((prev) => prev.filter((room) => room.id !== id))
    } catch (error) {
      console.error("Ошибка при удалении комнаты:", error)
    }
  }
  const getRoomTypes = async (): Promise<RoomType[]> => {
    const data = await RoomTypeService.getRoomTypes();
    return data;
}

  return (
    <RoomContext.Provider value={{ rooms, addRoom, updateRoom, deleteRoom, getRoomTypes }}>
      {children}
    </RoomContext.Provider>
  )
}
