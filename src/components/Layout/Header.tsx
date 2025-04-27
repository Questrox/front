import { AppBar, Toolbar, Typography, Button, IconButton, Avatar } from "@mui/material"
// Импорт компонентов из Material UI. Они используются для создания структуры заголовка.
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Header = () => {
  const { user, logout } = useAuth()
  // Получаем информацию о текущем пользователе (user) и функцию выхода (logout) из контекста.

  const navigate = useNavigate()

  return (
    <AppBar position="fixed">
      {/* Основной компонент Material UI для создания AppBar (панели заголовка). */}
      <Toolbar>
        {/* Компонент Toolbar для выравнивания содержимого на панели. */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Гостиница
          {/* Название приложения. FlexGrow используется для того, чтобы сдвинуть элементы справа к краю. */}
        </Typography>

        {user ? (
          // Если пользователь авторизован, отображаем его имя и кнопку выхода.
          <>
            <Typography sx={{ mr: 2 }}>
              {user.userName.charAt(0).toUpperCase() + user.userName.slice(1)}
            </Typography>
            {/* Вывод имени пользователя с отступом справа (mr = margin-right). */}
            <IconButton
              onClick={() => {
                logout()
                // При клике вызываем функцию выхода из системы.
                navigate("/")
                // Перенаправляем пользователя на главную страницу.
              }}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {/* Компонент Avatar показывает первую букву имени пользователя. */}
                {user.userName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </>
        ) : (
          // Если пользователь не авторизован, отображаем кнопки входа и регистрации
          <>
          <Button color="inherit" onClick={() => navigate("/register")}>
            Зарегистрироваться
            {/* Кнопка перенаправляет на страницу регистрации. */}
          </Button>
          <Button color="inherit" onClick={() => navigate("/login")}>
            Войти
            {/* Кнопка "Войти" перенаправляет на страницу авторизации. */}
          </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
