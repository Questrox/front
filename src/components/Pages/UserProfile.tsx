import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Stack,
  Chip,
  Divider,
  Paper,
} from "@mui/material"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { UserProfileContext } from "../../context/UserProfileContext"
import { Reservation } from "../../models/reservation"

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = (`0${date.getDate()}`).slice(-2)
  const month = (`0${date.getMonth() + 1}`).slice(-2)
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

const UserProfile: React.FC = () => {
  const context = useContext(UserProfileContext)
  const navigate = useNavigate()

  if (!context) {
    return <Typography>Загрузка...</Typography>
  }

  const { reservations, updateReservation } = context

  const handleCancel = (reservation: Reservation) => {
    updateReservation({
      ...reservation,
      reservationStatusID: 4,
    })
  }

  return (
    <Box maxWidth={900} mx="auto" mt={5} px={2}>
  <Typography variant="h4" component="h1" gutterBottom textAlign="center">
    Личный кабинет
  </Typography>

  <Box textAlign="center" mb={5}>
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate("/userProfile/booking")}
      size="large"
    >
      Забронировать номер
    </Button>
  </Box>

  <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 5 }}>
    <Typography variant="h5" component="h2" gutterBottom align="center">
      Мои бронирования
    </Typography>

    {reservations.length === 0 ? (
      <Typography color="text.secondary">
        У вас пока нет бронирований.
      </Typography>
    ) : (
      <Stack spacing={3}>
        {reservations.map((res) => (
          <Card key={res.id} variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography>
                  <strong>Номер:</strong> {res.room.number}
                </Typography>
                <Typography>
                  <strong>Тип номера:</strong>{" "}
                  {`${res.room.roomType.guestCapacity}-местный ${res.room.roomType.roomCategory.category}`}
                </Typography>
                <Typography>
                  <strong>Даты:</strong> {formatDate(res.arrivalDate)} – {formatDate(res.departureDate)}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontWeight="bold">Статус:</Typography>
                  <Chip
                    label={res.reservationStatus.status}
                    color={
                      res.reservationStatusID === 1
                        ? "warning"
                        : res.reservationStatusID === 2
                        ? "info"
                        : res.reservationStatusID === 3
                        ? "success"
                        : res.reservationStatusID === 4
                        ? "error"
                        : "default"
                    }
                    size="small"
                    icon={
                      res.reservationStatusID === 1 ? <HourglassEmptyIcon /> :
                      res.reservationStatusID === 2 ? <InfoIcon /> :
                      res.reservationStatusID === 3 ? <CheckCircleIcon /> :
                      res.reservationStatusID === 4 ? <CancelIcon /> : undefined
                    }
                  />
                </Box>
                <Typography>
                  <strong>Стоимость проживания:</strong> {res.livingPrice}₽
                </Typography>
                <Typography>
                  <strong>К оплате за доп. услуги:</strong> {res.servicesPrice}₽
                </Typography>
                <Typography>
                  <strong>Итого:</strong> {res.fullPrice}₽
                </Typography>
              </Stack>
            </CardContent>

            <Divider />

            <CardActions sx={{ justifyContent: "flex-end", gap: 1, p: 2 }}>
              {res.reservationStatusID < 3 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`./${res.id}`)}
                >
                  Управление
                </Button>
              )}
              {res.reservationStatusID === 1 && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleCancel(res)}
                >
                  Отменить
                </Button>
              )}
            </CardActions>
          </Card>
        ))}
      </Stack>
    )}
  </Paper>
</Box>

  )
}

export default UserProfile
