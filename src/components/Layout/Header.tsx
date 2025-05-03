import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tooltip,
  ListItemIcon,
} from "@mui/material"
import {
  Hotel as HotelIcon,
  Home as HomeIcon,
  Mail as MailIcon,
  AccountBox as AccountBoxIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import React, { useState } from "react"

const NAV_ITEMS = [
  { label: "Домашняя", path: "/", icon: <HomeIcon fontSize="small" /> },
  { label: "Наши номера", path: "/page1", icon: <MailIcon fontSize="small" /> },
  { label: "Личный кабинет", path: "/userProfile", icon: <AccountBoxIcon fontSize="small" /> },
  { label: "Панель администратора", path: "/adminPanel", icon: <SettingsIcon fontSize="small" /> },
]

const Header = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => setAnchorEl(null)

  // Фильтруем пункты меню для обычного пользователя
  const navItems = user && isAdmin
    ? NAV_ITEMS
    : NAV_ITEMS.filter(item => item.path !== "/adminPanel")

  return (
    <AppBar
      position="fixed"
      elevation={3}
      sx={{
        background: "linear-gradient(90deg, #4fbc8b 0%, #6ec6ff 100%)",
        boxShadow: "0 4px 12px rgba(76, 175, 80, 0.18)",
      }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => navigate("/")}>
          <HotelIcon fontSize="large" />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            letterSpacing: 1,
            mr: 3,
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => navigate("/")}
        >
          Гостиница
        </Typography>

        {/* Навигация */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 0.5,
                  fontWeight: location.pathname === item.path ? 700 : 400,
                  bgcolor: location.pathname === item.path ? "rgba(255,255,255,0.12)" : "transparent",
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.18)",
                  },
                  transition: "background 0.2s",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Мобильное меню */}
        {isMobile && (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.path}
                  selected={location.pathname === item.path}
                  onClick={() => {
                    navigate(item.path)
                    handleMenuClose()
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}

        {/* Аутентификация */}
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <Tooltip title={user.userName}>
              <Avatar sx={{ bgcolor: "#fff", color: theme.palette.primary.main, width: 38, height: 38, mr: 1.5 }}>
                {user.userName.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
            <Typography sx={{ fontWeight: 500, mr: 1, display: { xs: "none", sm: "block" } }}>
              {user.userName.charAt(0).toUpperCase() + user.userName.slice(1)}
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => {
                navigate("/")
                setTimeout(() => logout(), 200); //Чтобы успел выполниться переход на главную
              }}
              sx={{ ml: 1 }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
            <Button
              color="inherit"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate("/register")}
              sx={{ fontWeight: 500 }}
            >
              Зарегистрироваться
            </Button>
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={() => navigate("/login")}
              sx={{ fontWeight: 500 }}
            >
              Войти
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
