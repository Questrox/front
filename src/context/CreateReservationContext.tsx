import { createContext, ReactNode, useEffect, useState } from "react"
import { AdditionalService } from "../models/additionalService"
import { Reservation, ReservationToCreate } from "../models/reservation"
import AdditionalServiceService from "../services/AdditionalServiceService"
import ReservationService from "../services/ReservationService"
import { RoomType } from "../models/roomType"
import RoomService from "../services/RoomService"
import { Room } from "../models/room"
import RoomTypeService from "../services/RoomTypeService"
import { SelectedService, ServiceString } from "../models/serviceString"

// Интерфейс для контекста создания бронирования
interface CreateReservationContextProps {
  services: AdditionalService[] 
  roomTypes: RoomType[]
  addReservation: (res: ReservationToCreate) => void
  getAvailableRooms: (arrivalDate: string, departureDate: string, roomTypeID: number) => Promise<Room[]>
  calculatePrice: (arrivalDate: string, departureDate: string, roomTypeID: number, serviceStrings: SelectedService[]) => Promise<number>
}

// Создание контекста
export const CreateReservationContext = createContext<CreateReservationContextProps | undefined>(undefined)

// Провайдер контекста
export const CreateReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<AdditionalService[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])

  useEffect(() => {
    fetchServices()
    fetchRoomTypes()
  }, [])

  // Получение дополнительных услуг от API
  const fetchServices = async () => {
    try {
      const data = await AdditionalServiceService.getServices()
      setServices(data || [])
    } catch (error) {
      console.error("Ошибка при загрузке дополнительных услуг:", error)
    }
  }

  // Получение типов комнат
  const fetchRoomTypes = async () => {
    try {
      const data = await RoomTypeService.getRoomTypes()
      setRoomTypes(data || [])
    } catch (error) {
      console.error("Ошибка при загрузке типов комнат:", error)
    }
  }

  // Добавление нового бронирования
  const addReservation = async (res: ReservationToCreate) => {
    try {
      const created = await ReservationService.createReservation(res)
      
    } catch (error) {
      console.error("Ошибка при добавлении бронирования:", error)
      throw error;
    }
  }

  const getAvailableRooms = async (arrivalDate: string, departureDate: string, roomTypeID: number) : Promise<Room[]> => {
    const data = await RoomService.getAvailableRooms(arrivalDate, departureDate, roomTypeID);
    return data;
  }

  const calculatePrice = async (arrivalDate: string, departureDate: string, roomTypeID: number, serviceStrings: SelectedService[]) : Promise<number> => {
    const price = await ReservationService.calculatePrice(arrivalDate, departureDate, roomTypeID, serviceStrings);
    return price;
  }

  return (
    <CreateReservationContext.Provider value={{ services, roomTypes, addReservation, getAvailableRooms, calculatePrice }}>
      {children}
    </CreateReservationContext.Provider>
  )
}
