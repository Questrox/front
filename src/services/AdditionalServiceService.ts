import { AdditionalService } from "../models/additionalService"

/**
 * Сервис для взаимодействия с дополнительными услугами через API.
 */
class AdditionalServiceService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Получает список всех дополнительных услуг.
   * @returns Промис с массивом дополнительных услуг.
   * @throws Ошибка, если запрос не удался.
   */
  async getServices(): Promise<AdditionalService[]> {
    const response = await fetch(`${this.baseUrl}/AdditionalService`)
    if (!response.ok) throw new Error("Failed to fetch additional services")
    return await response.json()
  }

  /**
   * Создает новую дополнительную услугу.
   * @param service Объект услуги без поля `id`.
   * @returns Промис с созданной услугой (включая присвоенный id).
   * @throws Ошибка, если запрос не удался.
   */
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

  /**
   * Обновляет существующую дополнительную услугу.
   * @param service Обновленная услуга.
   * @returns Промис с обновленным объектом услуги.
   * @throws Ошибка, если запрос не удался.
   */
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

  /**
   * Удаляет дополнительную услугу по идентификатору.
   * @param id Идентификатор услуги для удаления.
   * @returns Промис без значения при успешном удалении.
   * @throws Ошибка, если запрос не удался.
   */
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
