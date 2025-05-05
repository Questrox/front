import { User } from "../models/user"

/**
 * Сервис для работы с пользователями.
 */
class UserService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Получает список всех пользователей.
   * @returns Массив пользователей.
   * @throws Ошибка при неудачном ответе от сервера.
   */
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/User`)
    if (!response.ok) throw new Error("Failed to fetch users")
    return await response.json()
  }

  /**
   * Создает нового пользователя.
   * @param user Данные нового пользователя (без id).
   * @returns Созданный пользователь.
   * @throws Ошибка при неудачном ответе от сервера.
   */
  async createUser(user: Omit<User, "id">): Promise<User> {
    const response = await fetch(`${this.baseUrl}/User`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
  
    const responseText = await response.text()
  
    if (!response.ok) {
      console.error(`Ошибка запроса: ${response.status} - ${responseText}`)
      throw new Error(`Failed to create user: ${response.status} - ${responseText}`)
    }
  
    return JSON.parse(responseText)
  }

  /**
   * Обновляет данные пользователя.
   * @param user Объект пользователя с обновленными данными.
   * @returns Обновленный пользователь.
   * @throws Ошибка при неудачном ответе от сервера.
   */
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
  
    return await response.json();
  }

  /**
   * Удаляет пользователя по ID.
   * @param id Идентификатор пользователя.
   * @throws Ошибка при неудачном ответе от сервера.
   */
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

export default new UserService("/api")
