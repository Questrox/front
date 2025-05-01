import { createContext, ReactNode, useEffect, useState } from "react"
import { Reservation } from "../models/reservation"
import ReservationService from "../services/ReservationService"

// Интерфейс для контекста личного кабинета
interface UserProfileContextProps {
  reservations: Reservation[] 
  updateReservation: (res: Reservation) => void
  refreshReservations: () => void
}

// Создание контекста
export const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined)

// Провайдер контекста
export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    fetchReservs()
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

  return (
    <UserProfileContext.Provider value={{ reservations, updateReservation, refreshReservations }}>
      {children}
    </UserProfileContext.Provider>
  )
}
