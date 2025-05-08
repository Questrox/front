import { LoginRequest, LoginResponse, ApiError, RegisterRequest } from "../models/auth.models"

/**
 * Сервис для аутентификации пользователей (вход, регистрация, работа с токеном).
 */
class AuthService {
  private baseUrl: string
  // `baseUrl` — базовый URL API, передается при создании экземпляра класса.

  private tokenKey = "jwtToken"
  // `tokenKey` — ключ для хранения токена в `localStorage`.

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Конструктор принимает базовый URL для API.
  }

  /**
   * Выполняет вход пользователя.
   * @param credentials Учетные данные пользователя.
   * @returns Ответ с токеном и данными пользователя.
   * @throws Ошибка, если вход не удался.
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {

    const response = await fetch(`${this.baseUrl}/api/Account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      // Отправляем запрос с данными пользователя в теле запроса.
    })

    if (!response.ok) {
      // Если ответ не успешный (HTTP-код не 2xx), обрабатываем ошибку.
      const errorData: ApiError = await response.json().catch(() => ({}))
      // Пытаемся извлечь сообщение об ошибке из ответа. Если не удается, возвращаем пустой объект.
      throw new Error(errorData.message || "Login failed")
      // Бросаем исключение с сообщением об ошибке.
    }

    return (await response.json()) as LoginResponse
    // Если запрос успешен, возвращаем данные пользователя, приведённые к типу `LoginResponse`.
  }

  /**
   * Регистрирует нового пользователя.
   * @param data Данные для регистрации.
   * @throws Ошибки, если регистрация не удалась.
   */
  async register(data: RegisterRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/Account/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData
        .map((err: any) => err.description || err.message || JSON.stringify(err))
        .join('\n');
      throw new Error(message || "Registration failed");
    }
  }

  /**
   * Выполняет выход пользователя
   */
  async logout(): Promise<void> {
    console.log("Выполняем выход");
    await fetch(`${this.baseUrl}/api/Account/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    }).catch(() => {})
  }
  
  
  /**
   * Сохраняет JWT токен в localStorage.
   * @param token JWT токен.
   */
  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token)
  }

  /**
   * Получает JWT токен из localStorage.
   * @returns JWT токен или null, если он отсутствует.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }
 
  /**
   * Удаляет JWT токен из localStorage.
   */
  removeToken(): void {
    localStorage.removeItem(this.tokenKey)
  }

   /**
   * Проверяет, авторизован ли пользователь.
   * @returns `true`, если токен присутствует, иначе `false`.
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService("")
// Экспортируем экземпляр класса `AuthService` с пустым базовым URL.
