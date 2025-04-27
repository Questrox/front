import { RoomCategory, RoomType } from "../models/roomType"

class DictionariesService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getRoomCategories(): Promise<RoomCategory[]> {
    const response = await fetch(`${this.baseUrl}/Dictionaries/roomCategories`)
    if (!response.ok) throw new Error("Failed to fetch room categories")
    return await response.json()
  }
}

export default new DictionariesService("/api")
