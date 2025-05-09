import { ServiceString } from "../models/serviceString"

/**
 * Сервис для работы со строками услуг.
 */
class ServiceStringService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Оказывает определенное количество какой-то услуги.
   * @param serviceStringID Идентификатор строки услуги.
   * @param amount Количество оказываемых услуг.
   * @returns Обновленная строка услуги.
   * @throws Ошибка, если не удалось оказать услугу.
   */
  async deliverService(serviceStringID: number, amount: number): Promise<ServiceString> {
    const response = await fetch(`${this.baseUrl}/ServiceString/deliver`
      + `?serviceStringID=${encodeURIComponent(serviceStringID)}`
      + `&amount=${encodeURIComponent(amount)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Ошибка оказания услуги: ${response.status} - ${JSON.stringify(errorData)}`);
      throw new Error(`${errorData.message || 'Unknown error'}`);
    }
  
    return await response.json();
  }

  /**
   * Получает все строки услуг.
   * @returns Массив строк услуг.
   * @throws Ошибка, если не удалось загрузить строки.
   */
  async getServiceStrings(): Promise<ServiceString[]> {
    const response = await fetch(`${this.baseUrl}/ServiceString`)
    if (!response.ok) throw new Error("Не удалось загрузить строки услуг")
    return await response.json()
  }

  /**
   * Создает новую строку услуги.
   * @param service Данные новой строки услуги (без id и статуса).
   * @returns Созданная строка услуги.
   * @throws Ошибка, если не удалось создать строку
   */
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

  /**
   * Обновляет строку услуги.
   * @param service Обновленные данные строки услуги.
   * @returns Обновленная строка услуги.
   * @throws Ошибка, если не удалось обновить строку.
   */
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

  /**
   * Удаляет строку услуги по идентификатору.
   * @param id Идентификатор строки услуги.
   * @throws Ошибка, если не удалось удалить строку.
   */
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
