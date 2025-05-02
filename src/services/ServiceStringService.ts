import { ServiceString } from "../models/serviceString"

class ServiceStringService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Оказание услуги
  async deliverService(serviceStringID: number, amount: number): Promise<ServiceString> {
    const response = await fetch(`${this.baseUrl}/ServiceString/deliver`
      + `?serviceStringID=${encodeURIComponent(serviceStringID)}`
      + `&amount=${encodeURIComponent(amount)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!response.ok) {
      const errorData = await response.json(); // читаем JSON один раз
      console.error(`Ошибка оказания услуги: ${response.status} - ${JSON.stringify(errorData)}`);
      throw new Error(`Failed to deliver service: ${errorData.message || 'Unknown error'}`);
    }
  
    return await response.json(); // ← безопасно, потому что только при OK
  }
  

  // Получение всех строк услуг
  async getServiceStrings(): Promise<ServiceString[]> {
    const response = await fetch(`${this.baseUrl}/ServiceString`)
    if (!response.ok) throw new Error("Не удалось загрузить строки услуг")
    return await response.json()
  }

  // Создание новой строки услуги
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

  // Обновление строки услуги
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

  // Удаление строки услуги
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
