import { Reservation } from "../models/reservation"

class ReservationService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Получение списка всех бронирований
  async getReservations(): Promise<Reservation[]> {
    const response = await fetch(`${this.baseUrl}/Reservation`)
    if (!response.ok) throw new Error("Failed to fetch reservations")
    return await response.json()
  }

  // Получение списка всех бронирований текущего пользователя
  async getReservationsForUser(): Promise<Reservation[]> {
    const response = await fetch(`${this.baseUrl}/Reservation/userReservations`)
    if (!response.ok) throw new Error("Failed to fetch reservations")
    return await response.json()
  }

  // Создание нового бронирования
  async createReservation(res: Omit<Reservation, "id">): Promise<Reservation> {
    
    const response = await fetch(`${this.baseUrl}/Reservation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(res),
    })


    const responseText = await response.text()

    if (!response.ok) {
      console.error(`Ошибка создания бронирования: ${response.status} - ${responseText}`)
      throw new Error(`Failed to create reservation: ${response.status} - ${responseText}`)
    }

    return JSON.parse(responseText)
  }

  // Редактирование бронирования
  async updateReservation(res: Reservation): Promise<Reservation> {
    const response = await fetch(`${this.baseUrl}/Reservation/${res.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(res),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ошибка обновления бронирования: ${response.status} - ${errorText}`)
      throw new Error(`Failed to update reservation: ${response.status} - ${errorText}`)
    }

    return await response.json()
  }

  // Удаление бронирования
  async deleteReservation(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/Reservation/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ошибка удаления бронирования: ${response.status} - ${errorText}`)
      throw new Error(`Failed to delete reservation: ${response.status} - ${errorText}`)
    }
  }
}

export default new ReservationService("/api")
