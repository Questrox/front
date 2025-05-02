import { Reservation, ReservationToCreate } from "../models/reservation"
import { SelectedService, ServiceString } from "../models/serviceString"

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

  // Получение бронирования по айди
  async getReservationById(id: number): Promise<Reservation> {
    const response = await fetch(`${this.baseUrl}/Reservation/${id}`);
    if (!response.ok) {
      throw new Error("Ошибка загрузки бронирования");
    }
    return await response.json();
  }
  
  // Получение списка всех бронирований текущего пользователя
  async getReservationsForUser(): Promise<Reservation[]> {
    const response = await fetch(`${this.baseUrl}/Reservation/userReservations`)
    if (!response.ok) throw new Error("Failed to fetch reservations")
    return await response.json()
  }

  //Получение списка бронирований для пользователя с указанным паспортом
  async getReservationsByPassport(passport: string): Promise<Reservation[]> {
    const response = await fetch(`${this.baseUrl}/Reservation/passportReservations?passport=${encodeURIComponent(passport)}`);
    if (!response.ok) throw new Error("Failed to fetch reservations");
    return await response.json();
}

  //Подтверждение оплаты доп.услуг
  async confirmServicesPayment(res: Reservation): Promise<Reservation> {
    const response = await fetch(`${this.baseUrl}/Reservation/confirmPayment`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(res),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ошибка подтверждения оплаты бронирования: ${response.status} - ${errorText}`)
      throw new Error(`Failed to update reservation: ${response.status} - ${errorText}`)
    }

    return await response.json()
  }

  // Создание нового бронирования
  async createReservation(res: ReservationToCreate): Promise<Reservation> {
    console.log("Отправляемое тело:", JSON.stringify(res, null, 2))

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

  //Расчет промежуточной цены
  async calculatePrice(
    arrivalDate: string,
    departureDate: string,
    roomTypeID: number,
    services: SelectedService[]
  ): Promise<number> {
    const response = await fetch("/api/Reservation/calculatePrice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        arrivalDate,
        departureDate,
        roomTypeID,
        services: services.map(s => ({
          Count: s.count,
          AdditionalServiceID: s.additionalServiceID,
          Price: s.price,
        })),
      }),
    })

    if (!response.ok) {
      throw new Error(`Ошибка при расчете стоимости: ${response.status}`)
    }
    const totalPrice = await response.json() as number
    return totalPrice
  }

}

export default new ReservationService("/api")
