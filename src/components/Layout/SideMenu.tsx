import React from "react"
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
// Импорт компонентов Material UI для создания бокового меню.
import { Home, Settings, Info, Mail } from "@mui/icons-material"
// Импорт иконок из Material UI для отображения в меню.
import { useLocation } from "react-router-dom"

interface SideMenuProps {
  onMenuItemClick: (path: string) => void
  // Пропс отвечает за обработку кликов по элементам меню.
}

const MENU_ITEMS = [
  // Массив с настройками пунктов меню: текст, иконка и путь.
  { text: "Домашняя", icon: <Home />, path: "/" },
  { text: "Наши номера", icon: <Mail />, path: "/page1" },
  { text: "Забронировать номер", icon: <Info />, path: "/page2" },
  { text: "Панель администратора", icon: <Settings />, path: "/adminPanel" },
]

const SideMenu: React.FC<SideMenuProps> = ({ onMenuItemClick }) => {
  const location = useLocation()
  // Хук для получения текущего пути. Используется для подсветки активного элемента меню.

  return (
    <Drawer
      variant="permanent"
      // Тип `permanent` означает, что меню всегда отображается (не скрывается).
      sx={{
        width: 240,
        // Устанавливаем фиксированную ширину для бокового меню.
        flexShrink: 0,
        // Предотвращаем сужение бокового меню при изменении размера окна.
        "& .MuiDrawer-paper": {
          // Настройка внешнего вида панели внутри Drawer.
          width: 240,
          boxSizing: "border-box",
          marginTop: "64px", // Смещение вниз, чтобы меню отображалось под хедером.
          height: "calc(100vh - 64px)", // Устанавливаем высоту меню на весь экран минус высота хедера.
          borderRight: "none", // Убираем правую границу меню.
          backgroundColor: "#f5f5f5", // Легкий фон для панели меню.
        },
      }}
    >
      <List>
        {/* Перечисляем элементы меню. */}
        {MENU_ITEMS.map((item) => (
          <ListItemButton
            key={item.text}
            // `key` обязателен для корректного отображения списка React.
            onClick={() => onMenuItemClick(item.path)}
            // При клике вызываем функцию с соответствующим путём.
            sx={{
              backgroundColor:
                location.pathname === item.path ? "rgba(12, 124, 222, 0.5)" : "inherit",
              // Подсвечиваем активный элемент меню, если текущий путь совпадает с его путём.
              "&:hover": {
                backgroundColor: "#e0e0e0",
                // Меняем цвет фона элемента меню при наведении.
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            {/* Отображаем иконку элемента меню. */}
            <ListItemText primary={item.text} />
            {/* Отображаем текст элемента меню. */}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}

export default SideMenu
