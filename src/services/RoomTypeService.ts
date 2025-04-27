import { RoomType } from "../models/roomType"

class RoomTypeService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Получение списка всех типов комнат
  async getRoomTypes(): Promise<RoomType[]> {
    const response = await fetch(`${this.baseUrl}/RoomType`)
    if (!response.ok) throw new Error("Failed to fetch room types")
    return await response.json()
  }

  // Создание нового типа комнаты
  async createRoomType(roomType: Omit<RoomType, "id" | "rooms">): Promise<RoomType> {
    
    const response = await fetch(`${this.baseUrl}/RoomType`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomType),
    })


    const responseText = await response.text()

    if (!response.ok) {
      console.error(`Ошибка создания типа комнаты: ${response.status} - ${responseText}`)
      throw new Error(`Failed to create room type: ${response.status} - ${responseText}`)
    }

    return JSON.parse(responseText)
  }

  // Редактирование типа комнаты
  async updateRoomType(roomType: RoomType): Promise<RoomType> {
    const response = await fetch(`${this.baseUrl}/RoomType/${roomType.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomType),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ошибка обновления типа комнаты: ${response.status} - ${errorText}`)
      throw new Error(`Failed to update room type: ${response.status} - ${errorText}`)
    }

    return await response.json()
  }

  // Удаление типа комнаты
  async deleteRoomType(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/RoomType/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ошибка удаления типа комнаты: ${response.status} - ${errorText}`)
      throw new Error(`Failed to delete room type: ${response.status} - ${errorText}`)
    }
  }
}

export default new RoomTypeService("/api")
