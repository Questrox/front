import { createContext, ReactNode, useEffect, useState } from "react"
import { Reservation } from "../models/reservation"
import ReservationService from "../services/ReservationService"
import { AdditionalService } from "../models/additionalService"
import AdditionalServiceService from "../services/AdditionalServiceService"
import { ServiceString } from "../models/serviceString"
import ServiceStringService from "../services/ServiceStringService"

// Интерфейс для контекста личного кабинета
interface UserProfileContextProps {
  reservations: Reservation[] 
  updateReservation: (res: Reservation) => void
  refreshReservations: () => void
  services: AdditionalService[]
  addServiceString: (servString: Omit<ServiceString, "id" | "serviceStatus">) => Promise<ServiceString | null>
  updateServiceString: (servString: ServiceString) => Promise<ServiceString | null>
}

// Создание контекста
export const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined)

// Провайдер контекста
export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [services, setServices] = useState<AdditionalService[]>([])

  useEffect(() => {
    fetchReservs();
    fetchServices();
  }, [])

  // Получение бронирований от API
  const fetchReservs = async () => {
    try {
      const data = await ReservationService.getReservationsForUser()
      setReservations(data || [])
    } catch (error) {
      console.error("Ошибка при загрузке бронирований:", error)
    }
  }

  //Получение дополнительных услуг от API
  const fetchServices = async () => {
    try {
      const data = await AdditionalServiceService.getServices()
      setServices(data || [])
    } catch (error) {
      console.error("Ошибка при загрузке дополнительных услуг:", error)
    }
  }

  // Обновление бронирования
  const updateReservation = async (updatedRes: Reservation) => {
    try {
      const newRes = await ReservationService.updateReservation(updatedRes)
      setReservations((prev) => prev.map((res) => (res.id === updatedRes.id ? newRes : res)))
    } catch (error) {
      console.error("Ошибка при обновлении бронирования:", error)
    }
  }

  //Обновление списка бронирований
  const refreshReservations = () => {
    fetchReservs()
  }

  //Добавление строки услуг
  const addServiceString = async (
    servString: Omit<ServiceString, "id" | "serviceStatus">
  ): Promise<ServiceString | null> => {
    try {
      const newServiceString = await ServiceStringService.createServiceString(servString);
      return newServiceString;
    } catch (error) {
      console.error("Ошибка при добавлении дополнительной услуги:", error);
      return null;
    }
  };

  //Обновление строки услуг
  const updateServiceString = async (servString: ServiceString): Promise<ServiceString | null> => {
    try {
      const updatedServString = await ServiceStringService.updateServiceString(servString);
      return updatedServString;
    } catch (error) {
      console.error("Ошибка при обновлении дополнительной услуги:", error);
      return null;
    }
  };
  

  return (
    <UserProfileContext.Provider value={{ reservations, updateReservation, refreshReservations, services, 
    addServiceString, updateServiceString }}>
      {children}
    </UserProfileContext.Provider>
  )
}
