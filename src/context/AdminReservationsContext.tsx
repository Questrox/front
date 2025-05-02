import { createContext, ReactNode, useEffect, useState } from "react"
import { Reservation } from "../models/reservation"
import ReservationService from "../services/ReservationService"
import ServiceStringService from "../services/ServiceStringService"
import { ServiceString } from "../models/serviceString"

// Интерфейс для контекста управления бронированиями для администратора
interface AdminReservationContextProps {
  reservations: Reservation[]
  getReservationsByPassport: (passport: string) => void
  getReservationById: (id: number) => Promise<Reservation>
  confirmLivingPayment: (res: Reservation) => Promise<Reservation>
  confirmServicesPayment: (res: Reservation) => Promise<Reservation>
  deliverService: (serviceStringID: number, amount: number) => Promise<ServiceString>
}

// Создание контекста
export const AdminReservationContext = createContext<AdminReservationContextProps | undefined>(undefined)

// Провайдер контекста
export const AdminReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Получение бронирований по паспорту
  const getReservationsByPassport = async (passport: string) => {
    const data = await ReservationService.getReservationsByPassport(passport);
    setReservations(data);
  }

  const getReservationById = async (id: number): Promise<Reservation> => {
    try {
      return await ReservationService.getReservationById(id) 
      
    } catch (error) {
      console.error("Ошибка при получении бронирования:", error)
      throw error;
    }
  }

  //Подтверждение оплаты проживания
  const confirmLivingPayment = async (res: Reservation): Promise<Reservation> => {
    try {
      res.reservationStatusID = 2;
      const updatedRes = await ReservationService.updateReservation(res);
      return updatedRes;
    } catch (error) {
      console.error("Ошибка при обновлении бронирования:", error)
      throw error;
    }
  }

  //Подтверждение оплаты услуг
  const confirmServicesPayment = async (res: Reservation): Promise<Reservation> => {
    try {
        const updatedRes = await ReservationService.confirmServicesPayment(res);
        return updatedRes;
      } catch (error) {
        console.error("Ошибка при обновлении бронирования:", error)
        throw error;
      }
  }
  
  //Оказание услуги
  const deliverService = async (serviceStringID: number, amount: number): Promise<ServiceString> => {
    try {
        const updatedServ = await ServiceStringService.deliverService(serviceStringID, amount);
        return updatedServ;
    } catch (error) {
        console.error("Ошибка при оказании услуги:", error)
      throw error;
    }
  }

  return (
    <AdminReservationContext.Provider value={{ reservations, getReservationsByPassport, getReservationById, confirmLivingPayment,
        confirmServicesPayment, deliverService }}>
      {children}
    </AdminReservationContext.Provider>
  )
}
