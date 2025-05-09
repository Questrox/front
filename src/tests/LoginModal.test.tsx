import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoginModal from "../components/Layout/LoginModal"

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}))

const mockLogin = jest.fn()

const renderModal = (open = true, onClose = jest.fn()) => {
  (useAuth as jest.Mock).mockReturnValue({ login: mockLogin })
  return render(
    <MemoryRouter>
      <LoginModal open={open} onClose={onClose} />
    </MemoryRouter>
  )
}

describe("LoginModal", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("загружает окно со всеми полями", () => {
    renderModal()
    expect(screen.getByLabelText(/имя пользователя/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /войти/i })).toBeInTheDocument()
  })

  it("кнопка входа выключается, если поля не заполнены", () => {
    renderModal()
    const button = screen.getByRole("button", { name: /войти/i })
    expect(button).toBeDisabled()
  })

  it("кнопка входа включается, когда заполняются поля", async () => {
    renderModal()
    const usernameInput = screen.getByLabelText(/имя пользователя/i)
    const passwordInput = screen.getByLabelText(/пароль/i)

    await userEvent.type(usernameInput, "testuser")
    await userEvent.type(passwordInput, "password")

    const button = screen.getByRole("button", { name: /войти/i })
    expect(button).toBeEnabled()
  })

  it("функция входа вызывается, при успешном входе окно закрывается", async () => {
    const mockOnClose = jest.fn()
    mockLogin.mockResolvedValueOnce(undefined)
    renderModal(true, mockOnClose)

    const usernameInput = screen.getByLabelText(/имя пользователя/i)
    const passwordInput = screen.getByLabelText(/пароль/i)
    const button = screen.getByRole("button", { name: /войти/i })

    await userEvent.type(usernameInput, "user")
    await userEvent.type(passwordInput, "pass")
    await userEvent.click(button)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("user", "pass")
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it("показывается ошибка при неудачном входе", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Ошибка входа"))
    renderModal()

    const usernameInput = screen.getByLabelText(/имя пользователя/i)
    const passwordInput = screen.getByLabelText(/пароль/i)
    const button = screen.getByRole("button", { name: /войти/i })

    await userEvent.type(usernameInput, "user")
    await userEvent.type(passwordInput, "wrongpass")
    await userEvent.click(button)

    expect(mockLogin).toHaveBeenCalledWith("user", "wrongpass")

    await waitFor(() => {
      expect(screen.getByText(/вход не выполнен/i)).toBeInTheDocument()
    })
  })
})
