import { useContext, useEffect, useState } from "react"
import {
  Typography,
  TextField,
  Autocomplete,
  Button,
  IconButton,
  Box,
  InputAdornment,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Add, Remove } from "@mui/icons-material"
import dayjs, { Dayjs } from "dayjs"
import { CreateReservationContext } from "../../context/CreateReservationContext"
import { Room } from "../../models/room"
import { AdditionalService } from "../../models/additionalService"
import { RoomType } from "../../models/roomType"
import { SelectedService } from "../../models/serviceString"
import { useNavigate } from "react-router-dom"
import { UserProfileContext } from "../../context/UserProfileContext"

const ReservationPage = () => {
  const context = useContext(CreateReservationContext)
  const profileContext = useContext(UserProfileContext) //Для того, чтобы обновлять бронирования в личном кабинете после создания нового
  const navigate = useNavigate()

  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(dayjs())
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(
    dayjs().add(1, "day")
  )
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(
    null
  )
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    []
  )
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    if (
      !context ||
      !selectedRoomType ||
      !checkInDate ||
      !checkOutDate
    ) {
      setAvailableRooms([])
      return
    }
    context
      .getAvailableRooms(
        checkInDate.format("YYYY-MM-DD"),
        checkOutDate.format("YYYY-MM-DD"),
        selectedRoomType.id
      )
      .then((rooms) => {
        setAvailableRooms(rooms)
        setSelectedRoom(null)
      })
      .catch(console.error)
  }, [context, selectedRoomType, checkInDate, checkOutDate])

  
  useEffect(() => {
    if (
      !context ||
      !selectedRoomType ||
      !checkInDate ||
      !checkOutDate
    ) {
      setTotalCost(0)
      return
    }
    context
      .calculatePrice(
        checkInDate.format("YYYY-MM-DD"),
        checkOutDate.format("YYYY-MM-DD"),
        selectedRoomType.id,
        selectedServices
      )
      .then((price) => setTotalCost(price))
      .catch(console.error)
  }, [
    context,
    selectedRoomType,
    checkInDate,
    checkOutDate,
    selectedServices,
  ])

  //Обработчик клика на кнопку "Забронировать"
  const handleReservation = async () => {
    if (!selectedRoomType || !selectedRoom) {
      alert("Пожалуйста, выберите тип номера и номер.")
      return
    }
  
    if (!checkInDate || !checkOutDate) {
      alert("Пожалуйста, выберите даты заезда и выезда.")
      return
    }
  
    const reservationPayload = {
      arrivalDate: checkInDate.toISOString(),
      departureDate: checkOutDate.toISOString(),
      fullPrice: totalCost,
      servicesPrice: 0,
      livingPrice: 0,
      roomID: selectedRoom.id,
      userID: "", //Айди будет получен на бэке
      reservationStatusID: 1, 
      services: selectedServices,
    }
  
    try {
      await context!.addReservation(reservationPayload)
      alert("Бронирование успешно создано.")
      profileContext?.refreshReservations()
      navigate("/userProfile")
    } catch (e: any) {
      alert(e.message || "Ошибка при создании бронирования.")
    }    
  }
  

  const handleServiceChange = ( //Обработчик изменения доп.услуг
    svc: AdditionalService,
    count: number
  ) => {
    setSelectedServices((prev) => {
      if (count <= 0) {
        return prev.filter((s) => s.additionalServiceID !== svc.id)
      }
      const idx = prev.findIndex((s) => s.additionalServiceID === svc.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], count, price: svc.price }
        return copy
      }
      return [
        ...prev,
        { additionalServiceID: svc.id, count, price: svc.price },
      ]
    })
  }

  
  if (!context) {
    return <Typography>Ошибка загрузки данных.</Typography>
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Бронирование
      </Typography>

        <DatePicker
          label="Дата заезда"
          value={checkInDate}
          disablePast
          onChange={(newDate) => {
            setCheckInDate(newDate)
            if (newDate && checkOutDate && !newDate.isBefore(checkOutDate)) {
              setCheckOutDate(newDate.add(1, "day"))
            }
          }}
          sx={{ mb: 2, width: "100%" }}
        />
        <DatePicker
          label="Дата выезда"
          value={checkOutDate}
          disablePast
          minDate={checkInDate?.add(1, "day")}
          onChange={setCheckOutDate}
          sx={{ mb: 2, width: "100%" }}
        />

      <Autocomplete
        options={context.roomTypes}
        getOptionLabel={(o) =>
          `${o.guestCapacity}-местный ${o.roomCategory.category}`
        }
        value={selectedRoomType}
        onChange={(_, v) => setSelectedRoomType(v)}
        renderInput={(params) => <TextField {...params} label="Тип номера" />}
        sx={{ mb: 2 }}
      />

      <Autocomplete
        options={availableRooms}
        getOptionLabel={(o) => String(o.number)}
        value={selectedRoom}
        onChange={(_, v) => setSelectedRoom(v)}
        renderInput={(params) => <TextField {...params} label="Номер" />}
        sx={{ mb: 2 }}
        disabled={!selectedRoomType}
      />

      <Typography variant="h6" sx={{ mt: 2 }}>
        Дополнительные услуги
      </Typography>
      {context.services.map((svc) => {
        const curr =
          selectedServices.find(
            (s) => s.additionalServiceID === svc.id
          )?.count || 0
        return (
          <Box
            key={svc.id}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <Typography sx={{ flexGrow: 1 }}>
              {svc.name} ({svc.price}₽)
            </Typography>
            <IconButton
              onClick={() => handleServiceChange(svc, curr - 1)}
              disabled={curr <= 0}
            >
              <Remove />
            </IconButton>
            <TextField
              type="number"
              size="small"
              value={curr}
              onChange={(e) =>
                handleServiceChange(
                  svc,
                  Math.max(0, parseInt(e.target.value) || 0)
                )
              }
              sx={{ width: 100, "& .MuiInputBase-input": { textAlign: "center" } }} //Выравнивание по центру
              inputProps={{ min: 0 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">×</InputAdornment>
                ),
              }}
            />
            <IconButton
              onClick={() => handleServiceChange(svc, curr + 1)}
            >
              <Add />
            </IconButton>
          </Box>
        )
      })}

      <Typography variant="h5" sx={{ mt: 2 }}>
        Итого: {totalCost}₽
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleReservation}>
        Забронировать
        </Button>

    </Box>
    
  )
}

export default ReservationPage
