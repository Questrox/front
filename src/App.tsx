import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import Home from "./components/Pages/Home"
import Page1 from "./components/Pages/Page1"
import AdminPanel from "./components/Pages/AdminPanel"
import { AuthProvider } from "./context/AuthContext"
import { useAuth } from "./context/AuthContext"
import { UserProvider } from "./context/UserContext"
import UserList from "./components/CRUD/UserList"
import UserForm from "./components/CRUD/UserForm"
import UserDetails from "./components/CRUD/UserDetails"
// Импорт провайдера контекста авторизации и хука для доступа к контексту.
import LoginPage from "./components/Pages/LoginPage"
import RegisterPage from "./components/Pages/RegisterPage"
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import RoomTypeList from "./components/CRUD/RoomTypeList"
import RoomTypeForm from "./components/CRUD/RoomTypeForm"
import { RoomTypeProvider } from "./context/RoomTypeContext"
import RoomTypeDetails from "./components/CRUD/RoomTypeDetails"
import { RoomProvider } from "./context/RoomContext"
import RoomList from "./components/CRUD/RoomList"
import RoomForm from "./components/CRUD/RoomForm"
import RoomDetails from "./components/CRUD/RoomDetails"
import { AdditionalServiceProvider } from "./context/AdditionalServiceContext"
import AdditionalServiceList from "./components/CRUD/AdditionalServiceList"
import AdditionalServiceForm from "./components/CRUD/AdditionalServiceForm"
import AdditionalServiceDetails from "./components/CRUD/AdditionalServiceDetails"
import { UserProfileProvider } from "./context/UserProfileContext"
import UserProfile from "./components/Pages/UserProfile"
import dayjs from "dayjs"
import "dayjs/locale/ru";
import { CreateReservationProvider } from "./context/CreateReservationContext"
import { CircularProgress } from "@mui/material"
import ReservationDetailsPage from "./components/Pages/ReservationDetailsPage"
import { AdminReservationProvider } from "./context/AdminReservationsContext"
import AdminReservationsPage from "./components/Pages/AdminReservationsPage"
import AdminReservationDetailsPage from "./components/Pages/AdminReservationDetailsPage"
import ReservationPage from "./components/Pages/ReservationPage"

dayjs.locale("ru");

const ProtectedRoute: React.FC<{ children: React.ReactElement; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  // Этот компонент используется для защиты маршрутов.
  // Он проверяет, авторизован ли пользователь, и есть ли у него права администратора.

  const { user, isAdmin, isLoading } = useAuth()
  // Хук из контекста авторизации, чтобы получить данные о текущем пользователе и его правах.

  if (isLoading) {
    return <CircularProgress/>
  }

  if (!user) {
    alert("Необходимо выполнить вход!")
    // Если пользователь не авторизован, показываем уведомление.
    return <Navigate to="/" replace />
    // Перенаправляем на главную страницу.
  } else if (adminOnly && !isAdmin) {
    alert("Недостаточно прав пользователя!")
    // Если маршрут только для администраторов, а пользователь не администратор, показываем уведомление.
    return <Navigate to="/" replace />
    // Перенаправляем на главную страницу.
  }

  return children
  // Если все проверки пройдены, рендерим вложенные компоненты.
}

const App: React.FC = () => {
  // Главный компонент приложения, который объединяет маршруты, Layout и провайдер авторизации.

  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      {/* Обеспечиваем доступ к контексту авторизации для всех компонентов приложения. */}
      <Layout>
        {/* Оборачиваем приложение в Layout, который может содержать шапку, подвал и т.д. */}
        <Routes>
          {/* Определяем маршруты приложения. */}
          <Route path="/" element={<Home />} />
          {/* Маршрут главной страницы. */}
          <Route path="/login" element={<LoginPage />} />
          {/* Маршрут страницы входа. */}
          <Route path="/register" element={<RegisterPage />} />
          {/* Маршрут страницы регистрации. */}
          <Route path="/page1" element={<Page1 />} />
          {/* Маршрут для Page1 без ограничений. */}
          <Route
            path="/adminPanel"
            element={
              <ProtectedRoute adminOnly>
                {/* Ограниченный маршрут для панели администратора только для администраторов. */}
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userProfile/*"
            element={
              <ProtectedRoute>
                <CreateReservationProvider>
                <UserProfileProvider>
                  <Routes>
                    <Route path="" element={<UserProfile />} />
                    <Route path="booking" element={<ReservationPage />} />
                    <Route path=":id" element={<ReservationDetailsPage />} />
                  </Routes>
                </UserProfileProvider>
                </CreateReservationProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/*"
            element={
              <ProtectedRoute adminOnly>
                <UserProvider>
                  <Routes>
                    <Route path="" element={<UserList />} />
                    <Route path="add" element={<UserForm />} />
                    <Route path=":id" element={<UserDetails />} />
                  </Routes>
                </UserProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/roomTypes/*"
            element={
              <ProtectedRoute adminOnly>
                <RoomTypeProvider>
                  <Routes>
                    <Route path="" element={<RoomTypeList />} />
                    <Route path="add" element={<RoomTypeForm />} />
                    <Route path=":id" element={<RoomTypeDetails />} />
                  </Routes>
                </RoomTypeProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/*"
            element={
              <ProtectedRoute adminOnly>
                <RoomProvider>
                  <Routes>
                    <Route path="" element={<RoomList />} />
                    <Route path="add" element={<RoomForm />} />
                    <Route path=":id" element={<RoomDetails />} />
                  </Routes>
                </RoomProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/services/*"
            element={
              <ProtectedRoute adminOnly>
                <AdditionalServiceProvider>
                  <Routes>
                    <Route path="" element={<AdditionalServiceList />} />
                    <Route path="add" element={<AdditionalServiceForm />} />
                    <Route path=":id" element={<AdditionalServiceDetails />} />
                  </Routes>
                </AdditionalServiceProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminReservations/*"
            element={
              <ProtectedRoute adminOnly>
                <AdminReservationProvider>
                  <Routes>
                    <Route path="" element={<AdminReservationsPage />} />
                    <Route path=":id" element={<AdminReservationDetailsPage />} />
                  </Routes>
                </AdminReservationProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
      </LocalizationProvider>
    </AuthProvider>
  )
}

export default App
