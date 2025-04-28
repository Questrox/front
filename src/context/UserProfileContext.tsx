import { createContext, ReactNode, useEffect, useState } from "react"
import { Reservation } from "../models/reservation"
import ReservationService from "../services/ReservationService"

// Интерфейс для контекста личного кабинета
interface UserProfileContextProps {
  reservations: Reservation[] 
  addReservation: (res: Omit<Reservation, "id">) => void 
  updateReservation: (res: Reservation) => void
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

  // Добавление нового бронирования
  const addReservation = async (res: Omit<Reservation, "id">) => {
    try {
      const created = await ReservationService.createReservation(res) 
      setReservations(prev => [...prev, created])
      
    } catch (error) {
      console.error("Ошибка при добавлении бронирования:", error)
    }
  }

  // Обновление бронирования
  const updateReservation = async (updatedRes: Reservation) => {
    try {
      const newRes = await ReservationService.updateReservation(updatedRes)
      setReservations((prev) => prev.map((res) => (res.id === res.id ? newRes : res)))
    } catch (error) {
      console.error("Ошибка при обновлении бронирования:", error)
    }
  }

  return (
    <UserProfileContext.Provider value={{ reservations, addReservation, updateReservation }}>
      {children}
    </UserProfileContext.Provider>
  )
}
