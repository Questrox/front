import { Room } from "../models/room"

/**
 * Сервис для управления комнатами.
 */
class RoomService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

   /**
   * Получает список всех комнат.
   * @returns Список комнат.
   * @throws Ошибка, если не удалось загрузить данные.
   */
  async getRooms(): Promise<Room[]> {
    const response = await fetch(`${this.baseUrl}/Room`)
    if (!response.ok) throw new Error("Failed to fetch rooms")
    return await response.json()
  }

  /**
   * Создает новую комнату.
   * @param room Объект комнаты без идентификатора.
   * @returns Созданная комната.
   * @throws Ошибка, если не удалось создать комнату.
   */
  async createRoom(room: Omit<Room, "id">): Promise<Room> {
    
    const response = await fetch(`${this.baseUrl}/Room`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    })


    const responseText = await response.text()

    if (!response.ok) {
      console.error(`Ошибка создания комнаты: ${response.status} - ${responseText}`)
      throw new Error(`Failed to create room: ${response.status} - ${responseText}`)
    }

    return JSON.parse(responseText)
  }

  /**
   * Обновляет данные комнаты.
   * @param room Обновленная информация о комнате.
   * @returns Обновленная комната.
   * @throws Ошибка, если не удалось обновить комнату.
   */
  async updateRoom(room: Room): Promise<Room> {
    const response = await fetch(`${this.baseUrl}/Room/${room.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ошибка обновления комнаты: ${response.status} - ${errorText}`)
      throw new Error(`Failed to update room: ${response.status} - ${errorText}`)
    }

    return await response.json()
  }

  /**
   * Удаляет комнату по идентификатору.
   * @param id Идентификатор комнаты.
   * @throws Ошибка, если не удалось удалить комнату.
   */
  async deleteRoom(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/Room/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ошибка удаления комнаты: ${response.status} - ${errorText}`)
      throw new Error(`Failed to delete room: ${response.status} - ${errorText}`)
    }
  }

/**
   * Получает список доступных комнат по заданным параметрам.
   * @param arrivalDate Дата заезда.
   * @param departureDate Дата выезда.
   * @param roomTypeID Идентификатор типа комнаты.
   * @returns Список свободных комнат данного типа в данный период.
   * @throws Ошибка, если не удалось получить список.
   */
async getAvailableRooms(arrivalDate: string, departureDate: string, roomTypeID: number): Promise<Room[]> {
  const url = `${this.baseUrl}/Room/available`
    + `?arrivalDate=${encodeURIComponent(arrivalDate)}`
    + `&departureDate=${encodeURIComponent(departureDate)}`
    + `&roomTypeID=${roomTypeID}`

  const response = await fetch(url, {
    method: "GET",
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(
      `Ошибка при получении доступных комнат: ${response.status} - ${errorText}`
    )
    throw new Error(`Failed to fetch available rooms: ${response.status} - ${errorText}`)
  }

  return await response.json()
}

}

export default new RoomService("/api")