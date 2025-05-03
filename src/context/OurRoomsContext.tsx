import React, { createContext, useState, useEffect, ReactNode } from "react"
import { RoomType } from "../models/roomType"
import { RoomTypeImage } from "../models/dictionaries"
import RoomTypeService from "../services/RoomTypeService"
import DictionariesService from "../services/DictionariesService"

// Интерфейс для контекста просмотра комнат
interface OurRoomsContextProps {
  roomTypes: RoomType[]
  getImages: (roomTypeID: number) => Promise<RoomTypeImage[]>
}

// Создание контекста
export const OurRoomsContext = createContext<OurRoomsContextProps | undefined>(undefined)

// Провайдер контекста
export const OurRoomsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])

  useEffect(() => {
    fetchRoomTypes()
  }, [])

  // Получение типов комнат от API
  const fetchRoomTypes = async () => {
    try {
      const data = await RoomTypeService.getRoomTypes()
      setRoomTypes(data || [])
    } catch (error) {
      console.error("Ошибка при загрузке типов комнат:", error)
    }
  }

  // Добавление нового типа комнаты
  const getImages = async (roomTypeID: number) => {
    try {
      const images: RoomTypeImage[] = await DictionariesService.getRoomTypeImages(roomTypeID);
      return images;
    } catch (error) {
      console.error("Ошибка при получении изображений:", error);
      throw error;
    }
  }

  return (
    <OurRoomsContext.Provider value={{ roomTypes, getImages }}>
      {children}
    </OurRoomsContext.Provider>
  )
}
