import React, { createContext, useState, useEffect, ReactNode } from "react"
import roomTypeService from "../services/RoomTypeService"
import { RoomCategory, RoomType } from "../models/roomType"
import DictionariesService from "../services/DictionariesService"
import { Room } from "../models/room"
import RoomService from "../services/RoomService"

// Интерфейс для контекста типа комнаты
interface RoomTypeContextProps {
  roomTypes: RoomType[] 
  addType: (rt: Omit<RoomType, "id" | "rooms">) => void 
  updateType: (rt: RoomType) => void 
  deleteType: (id: number) => void 
  getRoomCategories: () => Promise<RoomCategory[]>
  getRooms: () => Promise<Room[]>
}

// Создание контекста
export const RoomTypeContext = createContext<RoomTypeContextProps | undefined>(undefined)

// Провайдер контекста
export const RoomTypeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])

  useEffect(() => {
    fetchRoomTypes()
  }, [])

  // Получение типов комнат от API
  const fetchRoomTypes = async () => {
    try {
      const data = await roomTypeService.getRoomTypes()
      setRoomTypes(data || [])
    } catch (error) {
      console.error("Ошибка при загрузке типов комнат:", error)
    }
  }

  // Добавление нового типа комнаты
  const addType = async (rt: Omit<RoomType, "id" | "rooms">) => {
    try {
      const created = await roomTypeService.createRoomType(rt) 
      setRoomTypes(prev => [...prev, created])
      
    } catch (error) {
      console.error("Ошибка при добавлении типа комнаты:", error)
    }
  }

  // Обновление типа комнаты
  const updateType = async (updatedType: RoomType) => {
    try {
      const newType = await roomTypeService.updateRoomType(updatedType)
      setRoomTypes((prev) => prev.map((rt) => (rt.id === newType.id ? newType : rt)))
    } catch (error) {
      console.error("Ошибка при обновлении типа комнаты:", error)
    }
  }

  // Удаление типа комнаты
  const deleteType = async (id: number) => {
    try {
      await roomTypeService.deleteRoomType(id)
      setRoomTypes((prev) => prev.filter((rt) => rt.id !== id))
    } catch (error) {
      console.error("Ошибка при удалении типа комнаты:", error)
    }
  }
  const getRoomCategories = async (): Promise<RoomCategory[]> => {
    const data = await DictionariesService.getRoomCategories();
    return data;
}
  const getRooms = async (): Promise<Room[]> => {
    const data = await RoomService.getRooms();
    return data;
  }

  return (
    <RoomTypeContext.Provider value={{ roomTypes, addType, updateType, deleteType, getRoomCategories, getRooms }}>
      {children}
    </RoomTypeContext.Provider>
  )
}
