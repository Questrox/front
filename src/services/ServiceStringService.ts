import { ServiceString } from "../models/serviceString"

class ServiceStringService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Получить все строки услуг
  async getServiceStrings(): Promise<ServiceString[]> {
    const response = await fetch(`${this.baseUrl}/ServiceString`)
    if (!response.ok) throw new Error("Не удалось загрузить строки услуг")
    return await response.json()
  }

  // Создать новую строку услуги
  async createServiceString(service: Omit<ServiceString, "id" | "serviceStatus">): Promise<ServiceString> {
    const response = await fetch(`${this.baseUrl}/ServiceString`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    })

    const responseText = await response.text()

    if (!response.ok) {
      console.error(`Ошибка создания строки услуги: ${response.status} - ${responseText}`)
      throw new Error(`Failed to create service string: ${response.status} - ${responseText}`)
    }

    return JSON.parse(responseText)
  }

  // Обновить строку услуги
  async updateServiceString(service: ServiceString): Promise<ServiceString> {
    const response = await fetch(`${this.baseUrl}/ServiceString/${service.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ошибка обновления строки услуги: ${response.status} - ${errorText}`)
      throw new Error(`Failed to update service string: ${response.status} - ${errorText}`)
    }

    return await response.json()
  }

  // Удалить строку услуги
  async deleteServiceString(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/ServiceString/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ошибка удаления строки услуги: ${response.status} - ${errorText}`)
      throw new Error(`Failed to delete service string: ${response.status} - ${errorText}`)
    }
  }
}

export default new ServiceStringService("/api")
