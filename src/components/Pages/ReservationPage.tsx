import { useEffect, useState } from "react"
import {
  Typography,
  TextField,
  Autocomplete,
  Button,
  IconButton,
  Box,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Add, Remove } from "@mui/icons-material"
import dayjs, { Dayjs } from "dayjs"

// Примерные типы данных
type RoomType = { id: number; name: string; pricePerNight: number }
type Room = { id: number; name: string; typeId: number }
type Service = { id: number; name: string; price: number }

const ReservationPage = () => {
  // Стейты для данных
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [services, setServices] = useState<Service[]>([])

  // Стейты для выбора
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null)
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedServices, setSelectedServices] = useState<{ service: Service; count: number }[]>([])

  // Стоимости
  const [servicesCost, setServicesCost] = useState(0)
  const [totalCost, setTotalCost] = useState(0)

  // Заглушки для данных
  useEffect(() => {
    // Здесь вместо этого будут реальные запросы на бэкенд
    setRoomTypes([
      { id: 1, name: "Стандарт", pricePerNight: 3000 },
      { id: 2, name: "Люкс", pricePerNight: 6000 },
    ])
    setRooms([
      { id: 1, name: "101", typeId: 1 },
      { id: 2, name: "102", typeId: 1 },
      { id: 3, name: "201", typeId: 2 },
    ])
    setServices([
      { id: 1, name: "Завтрак", price: 500 },
      { id: 2, name: "SPA", price: 2000 },
    ])
  }, [])

  // Пересчет стоимости
  useEffect(() => {
    let nights = 0
    if (checkInDate && checkOutDate && checkOutDate.isAfter(checkInDate)) {
      nights = checkOutDate.diff(checkInDate, "day")
    }
    const roomCost = (selectedRoomType?.pricePerNight || 0) * nights
    const additionalCost = selectedServices.reduce(
      (acc, { service, count }) => acc + service.price * count,
      0
    )
    setServicesCost(additionalCost)
    setTotalCost(roomCost + additionalCost)
  }, [checkInDate, checkOutDate, selectedRoomType, selectedServices])

  // Обработчики
  const addService = (service: Service) => {
    setSelectedServices((prev) => {
      const found = prev.find((s) => s.service.id === service.id)
      if (found) {
        return prev.map((s) =>
          s.service.id === service.id ? { ...s, count: s.count + 1 } : s
        )
      } else {
        return [...prev, { service, count: 1 }]
      }
    })
  }

  const removeService = (service: Service) => {
    setSelectedServices((prev) =>
      prev
        .map((s) =>
          s.service.id === service.id ? { ...s, count: s.count - 1 } : s
        )
        .filter((s) => s.count > 0)
    )
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Бронирование
      </Typography>

      <DatePicker
        label="Дата заезда"
        value={checkInDate}
        onChange={(newValue) => setCheckInDate(newValue)}
        sx={{ mb: 2, width: "100%" }}
      />
      <DatePicker
        label="Дата выезда"
        value={checkOutDate}
        onChange={(newValue) => setCheckOutDate(newValue)}
        sx={{ mb: 2, width: "100%" }}
      />

      <Autocomplete
        options={roomTypes}
        getOptionLabel={(option) => option.name}
        value={selectedRoomType}
        onChange={(_, newValue) => {
          setSelectedRoomType(newValue)
          setSelectedRoom(null) // Сбросить выбранный номер при смене типа
        }}
        renderInput={(params) => <TextField {...params} label="Тип номера" />}
        sx={{ mb: 2 }}
      />

      <Autocomplete
        options={rooms.filter((r) => r.typeId === selectedRoomType?.id)}
        getOptionLabel={(option) => option.name}
        value={selectedRoom}
        onChange={(_, newValue) => setSelectedRoom(newValue)}
        renderInput={(params) => <TextField {...params} label="Номер" />}
        sx={{ mb: 2 }}
        disabled={!selectedRoomType}
      />

      <Typography variant="h6" sx={{ mt: 2 }}>
        Дополнительные услуги
      </Typography>
      {services.map((service) => (
        <Box key={service.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ flexGrow: 1 }}>{service.name} ({service.price}₽)</Typography>
          <IconButton onClick={() => removeService(service)}>
            <Remove />
          </IconButton>
          <Typography>
            {selectedServices.find((s) => s.service.id === service.id)?.count || 0}
          </Typography>
          <IconButton onClick={() => addService(service)}>
            <Add />
          </IconButton>
        </Box>
      ))}

      <Typography variant="h6" sx={{ mt: 2 }}>
        Стоимость доп. услуг: {servicesCost}₽
      </Typography>
      <Typography variant="h5" sx={{ mt: 1 }}>
        Итого: {totalCost}₽
      </Typography>

      <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
        Забронировать
      </Button>
    </Box>
  )
}

export default ReservationPage
