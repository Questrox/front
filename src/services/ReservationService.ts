import { Reservation, ReservationToCreate } from "../models/reservation"
import { SelectedService, ServiceString } from "../models/serviceString"
/**
 * Класс для взаимодействия с бронированиями через API
 */
class ReservationService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Получает список всех бронирований
   * @returns Промис с массивом всех бронирований
   */
  async getReservations(): Promise<Reservation[]> {
    const response = await fetch(`${this.baseUrl}/Reservation`)
    if (!response.ok) throw new Error("Failed to fetch reservations")
    return await response.json()
  }

  /**
   * Получает бронирование по идентификатору
   * @param id Идентификатор бронирования
   * @returns Найденное бронирование
   * @throws Ошибка, если не удалось загрузить бронирование
   */
  async getReservationById(id: number): Promise<Reservation> {
    const response = await fetch(`${this.baseUrl}/Reservation/${id}`);
    if (!response.ok) {
      throw new Error("Ошибка загрузки бронирования");
    }
    return await response.json();
  }
  
  /**
   * Получает список бронирований для пользователя, который вошел в систему
   * @returns Список бронирований для текущего пользователя
   * @throws Ошибка, если не удалось получить бронирования
   */
  async getReservationsForUser(): Promise<Reservation[]> {
    const response = await fetch(`${this.baseUrl}/Reservation/userReservations`)
    if (!response.ok) throw new Error("Failed to fetch reservations")
    return await response.json()
  }

  /**
   * Получает бронирования для пользователя с данным паспортом
   * @param passport Паспортные данные пользователя
   * @returns Список бронирований для пользователя с данным паспортом
   * @throws Ошибка, если не удалось получить бронирования
   */
  async getReservationsByPassport(passport: string): Promise<Reservation[]> {
    const response = await fetch(`${this.baseUrl}/Reservation/passportReservations?passport=${encodeURIComponent(passport)}`);
    if (!response.ok) throw new Error("Failed to fetch reservations");
    return await response.json();
}

  /**
   * Подтверждает оплату дополнительных услуг в бронировании
   * @param res Бронирование, для которого происходит подтверждение
   * @returns Обновленное бронирование
   * @throws Ошибка, если бронирование не удалось обновить
   */
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

  /**
   * Создает бронирование
   * @param res Создаваемое бронирование (вместе со списком дополнительных услуг)
   * @returns Созданный объект бронирования
   * @throws Ошибка, если не удалось создать бронирование
   */
  async createReservation(res: ReservationToCreate): Promise<Reservation> {
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

  /**
   * Обновляет бронирование
   * @param res Бронирование с обновленными данными
   * @returns Обновленный объект бронирования
   * @throws Ошибка, если не удалось обновить бронирование
   */
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

  /**
   * Удаляет бронирование по идентификатору
   * @param id Идентификатор удаляемого бронирования
   * @throws Ошибка, если не удалось удалить бронирование
   */
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

  /**
   * Рассчитывает стоимость бронирования с учетом выбранных услуг
   * @param arrivalDate Дата заезда
   * @param departureDate Дата выезда
   * @param roomTypeID Идентификатор типа комнаты
   * @param services Массив выбранных дополнительных услуг
   * @returns Промежуточную стоимость бронирования
   * @throws Ошибка, если не удалось рассчитать стоимость
   */
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
