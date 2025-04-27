import { AdditionalService } from "../models/additionalService"


class AdditionalServiceService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Получение списка всех дополнительных услуг
  async getServices(): Promise<AdditionalService[]> {
    const response = await fetch(`${this.baseUrl}/AdditionalService`)
    if (!response.ok) throw new Error("Failed to fetch additional services")
    return await response.json()
  }

  // Создание новой дополнительной услуги
  async createService(service: Omit<AdditionalService, "id">): Promise<AdditionalService> {
    const response = await fetch(`${this.baseUrl}/AdditionalService`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    })

    const responseText = await response.text()

    if (!response.ok) {
      console.error(`Ошибка создания услуги: ${response.status} - ${responseText}`)
      throw new Error(`Failed to create additional service: ${response.status} - ${responseText}`)
    }

    return JSON.parse(responseText)
  }

  // Обновление дополнительной услуги
  async updateService(service: AdditionalService): Promise<AdditionalService> {
    const response = await fetch(`${this.baseUrl}/AdditionalService/${service.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ошибка обновления услуги: ${response.status} - ${errorText}`)
      throw new Error(`Failed to update additional service: ${response.status} - ${errorText}`)
    }

    return await response.json()
  }

  // Удаление услуги
  async deleteService(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/AdditionalService/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ошибка удаления услуги: ${response.status} - ${errorText}`)
      throw new Error(`Failed to delete additional service: ${response.status} - ${errorText}`)
    }
  }
}

export default new AdditionalServiceService("/api")
