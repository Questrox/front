import { LoginRequest, LoginResponse, ApiError, RegisterRequest } from "../models/auth.models"

class AuthService {
  private baseUrl: string
  // `baseUrl` — базовый URL API, передается при создании экземпляра класса.

  private tokenKey = "jwtToken"
  // `tokenKey` — ключ для хранения токена в `localStorage`.

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Конструктор принимает базовый URL для API.
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Асинхронный метод для выполнения запроса входа (логина).

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

  async register(data: RegisterRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/Account/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Registration failed")
    }
  }
  

  storeToken(token: string): void {
    // Метод для сохранения токена в `localStorage`.
    localStorage.setItem(this.tokenKey, token)
  }

  getToken(): string | null {
    // Метод для получения токена из `localStorage`.
    return localStorage.getItem(this.tokenKey)
  }

  removeToken(): void {
    // Метод для удаления токена из `localStorage`.
    localStorage.removeItem(this.tokenKey)
  }

  isAuthenticated(): boolean {
    // Метод для проверки аутентификации пользователя.
    return !!this.getToken()
    // Если токен существует, возвращаем `true`, иначе — `false`.
  }
}

export const authService = new AuthService("")
// Экспортируем экземпляр класса `AuthService` с пустым базовым URL.
