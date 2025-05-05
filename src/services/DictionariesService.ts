import { RoomTypeImage } from "../models/dictionaries"
import { RoomCategory, RoomType } from "../models/roomType"

/**
 * Класс для взаимодействия со справочниками через API
 */
class DictionariesService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Получает список всех категорий комнат
   * @returns Промис с массивом всех категорий комнат
   */
  async getRoomCategories(): Promise<RoomCategory[]> {
    const response = await fetch(`${this.baseUrl}/Dictionaries/roomCategories`)
    if (!response.ok) throw new Error("Failed to fetch room categories")
    return await response.json()
  }
/**
 * Получает пути к изображениям для определенного типа комнаты
 * @param roomTypeID Идентификатор типа комнаты
 * @returns Массив объектов RoomTypeImage, в которых хранятся относительные пути к изображениям данного типа комнаты
 */
  async getRoomTypeImages(roomTypeID: number): Promise<RoomTypeImage[]> {
    const response = await fetch(`${this.baseUrl}/Dictionaries/images?roomTypeID=${encodeURIComponent(roomTypeID)}`)
    if (!response.ok) throw new Error("Failed to fetch images")
    return await response.json()
  }
}

export default new DictionariesService("/api")
