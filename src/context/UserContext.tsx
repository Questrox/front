import React, { createContext, useState, useEffect, ReactNode } from "react"
import APIService from "../services/APIService"
import { User } from "../models/user"

// Интерфейс для контекста пользователя
interface UserContextProps {
  users: User[] // Массив всех пользователей
  addUser: (user: Omit<User, "id">) => void // Добавление нового пользователя
  updateUser: (user: User) => void // Обновление пользователя
  deleteUser: (id: string) => void // Удаление пользователя
}

// Создание контекста
export const UserContext = createContext<UserContextProps | undefined>(undefined)

// Провайдер контекста для предоставления данных всему приложению
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]) // Локальное состояние для всех пользователей

  useEffect(() => {
    fetchUsers() // Загружаем пользователи при монтировании компонента
  }, [])

  // Получение пользователей от API
  const fetchUsers = async () => {
    const data = await APIService.getUsers()
    setUsers(data || [])
  }

  // Добавление нового пользователя
  const addUser = async (user: Omit<User, "id">) => {
    const newUser = await APIService.createUser(user)
    setUsers([...users, newUser]) // Обновляем состояние
  }

  // Обновление пользователя
  const updateUser = async (updatedUser: User) => {
    const newUser = await APIService.updateUser(updatedUser);
    setUsers(users.map((u) => (u.id === newUser.id ? newUser : u))); // Обновляем список
  };

  // Удаление пользователя
  const deleteUser = async (id: string) => {
    try {
      await APIService.deleteUser(id);
      // Обновляем список пользователей
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id)); 
    } catch (error: unknown) { 
      if (error instanceof Error) { 
        console.error("Ошибка при удалении пользователя:", error.message);
        alert(`Ошибка при удалении пользователя: ${error.message}`);
      } else {
        console.error("Неизвестная ошибка при удалении пользователя");
        alert("Неизвестная ошибка при удалении пользователя");
      }
    }
  };
  
  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>{children}</UserContext.Provider>
  )
}