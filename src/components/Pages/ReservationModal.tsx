import { useContext, useEffect, useState } from "react"
import {
  Typography,
  TextField,
  Autocomplete,
  Button,
  IconButton,
  Box,
  InputAdornment,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  Paper,
  Modal,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Add, Remove, ExpandMore, Hotel } from "@mui/icons-material"
import dayjs, { Dayjs } from "dayjs"
import { CreateReservationContext } from "../../context/CreateReservationContext"
import { Room } from "../../models/room"
import { AdditionalService } from "../../models/additionalService"
import { RoomType } from "../../models/roomType"
import { SelectedService } from "../../models/serviceString"
import { useNavigate } from "react-router-dom"
import { UserProfileContext } from "../../context/UserProfileContext"

interface ReservationModalProps {
  open: boolean
  onClose: () => void
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  open,
  onClose,
}) => {
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
    const result = context.getAvailableRooms(
  checkInDate.format("YYYY-MM-DD"),
  checkOutDate.format("YYYY-MM-DD"),
  selectedRoomType.id
)
console.log('Результат вызова getAvailableRooms:', result)
if (!result || typeof result.then !== 'function') {
  console.error('getAvailableRooms НЕ вернул промис!', result)
}
result.then((rooms) => {
  setAvailableRooms(rooms)
  setSelectedRoom(null)
})
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
    <Modal
    open={open} onClose={onClose} sx={{overflow: 'auto',}}
    >
    <Box sx={{ minHeight: "100vh", py: 6 }}>
      <Card
        sx={{
          maxWidth: 540,
          mx: "auto",
          p: 4,
          borderRadius: 4,
          boxShadow: 6,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Hotel color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" fontWeight={700}>
            Бронирование
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2} sx={{ mb: 2 }}>
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
              sx={{ width: "100%", background: "#fffafa" }}
            />
            <DatePicker
              label="Дата выезда"
              value={checkOutDate}
              disablePast
              minDate={checkInDate?.add(1, "day")}
              onChange={setCheckOutDate}
              sx={{ width: "100%", background: "#fffafa" }}
              
            />
            <Autocomplete
            disablePortal
              options={context.roomTypes}
              getOptionLabel={(o) =>
                `${o.guestCapacity}-местный ${o.roomCategory.category}`
              }
              value={selectedRoomType}
              onChange={(_, v) => setSelectedRoomType(v)}
              renderInput={(params) => <TextField {...params} label="Тип номера" />}
              sx={{ width: "100%", background: "#fffafa" }}
            />
            <Autocomplete
            disablePortal
              options={availableRooms}
              getOptionLabel={(o) => String(o.number)}
              value={selectedRoom}
              onChange={(_, v) => setSelectedRoom(v)}
              renderInput={(params) => <TextField {...params} label="Номер" />}
              sx={{ width: "100%", background: "#fffafa" }}
              disabled={!selectedRoomType}
            />
        </Grid>

        <Accordion
          defaultExpanded
          sx={{
            background: "#d2e3d3",
            borderRadius: 2,
            boxShadow: "none",
            mb: 2,
            border: "1px solid #e3e6ea",
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>Дополнительные услуги</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {context.services.length === 0 && (
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                Нет доступных услуг
              </Typography>
            )}
            {context.services.map((svc) => {
              const curr =
                selectedServices.find(
                  (s) => s.additionalServiceID === svc.id
                )?.count || 0
              return (
                <Box
                  key={svc.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1.5,
                    pl: 0.5,
                  }}
                >
                  <Typography sx={{ flexGrow: 1 }}>
                    {svc.name}{" "}
                    <span style={{ fontWeight: 500 }}>
                      ({svc.price}₽)
                    </span>
                  </Typography>
                  <IconButton
                    onClick={() => handleServiceChange(svc, curr - 1)}
                    disabled={curr <= 0}
                    size="small"
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
                    sx={{
                      width: 100,
                      mx: 1,
                      "& .MuiInputBase-input": { textAlign: "center" },
                    }}
                    inputProps={{ min: 0 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">×</InputAdornment>
                      ),
                    }}
                  />
                  <IconButton
                    onClick={() => handleServiceChange(svc, curr + 1)}
                    size="small"
                  >
                    <Add />
                  </IconButton>
                </Box>
              )
            })}
          </AccordionDetails>
        </Accordion>

        <Paper
          elevation={0}
          sx={{
            background: "#d2e3d3",
            p: 2,
            borderRadius: 2,
            mt: 2,
            mb: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Итого:{" "}
            <span style={{  }}>
              {totalCost}₽
            </span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (если будут оказаны все выбранные услуги)
          </Typography>
        </Paper>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={selectedRoom == null || selectedRoomType == null || checkInDate == null || checkOutDate == null}
          sx={{
            mt: 2,
            py: 1.3,
            fontWeight: 600,
            fontSize: "1.1rem",
            letterSpacing: 0.5,
            boxShadow: 2,
            borderRadius: 2,
          }}
          onClick={handleReservation}
          startIcon={<Hotel />}
        >
          Забронировать
        </Button>
      </Card>
    </Box>
    </Modal>
  )
}

export default ReservationModal
