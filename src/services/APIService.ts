import { User } from "../models/user"

// Класс для работы с API
class APIService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Получение списка всех пользователей
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/User`)
    if (!response.ok) throw new Error("Failed to fetch users")
    return await response.json()
  }

  // Создание нового пользователя
  async createUser(user: Omit<User, "id">): Promise<User> {
    const response = await fetch(`${this.baseUrl}/User`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
  
    const responseText = await response.text() // Читаем тело ответа
  
    if (!response.ok) {
      console.error(`Ошибка запроса: ${response.status} - ${responseText}`)
      throw new Error(`Failed to create user: ${response.status} - ${responseText}`)
    }
  
    return JSON.parse(responseText)
  }

  // Редактирование пользователя
  async updateUser(user: User): Promise<User> {
    const response = await fetch(`${this.baseUrl}/User/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ошибка обновления: ${response.status} - ${errorText}`);
      throw new Error(`Failed to update user: ${response.status} - ${errorText}`);
    }
  
    return await response.json(); // Возвращаем обновленный объект пользователя
  }
  
  // Удаление пользователя
  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/User/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ошибка удаления: ${response.status} - ${errorText}`);
      throw new Error(`Failed to delete user: ${response.status} - ${errorText}`);
    }
  }


}

export default new APIService("/api") // Экспортируем инстанс с базовым URL
