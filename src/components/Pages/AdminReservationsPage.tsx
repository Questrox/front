// AdminReservationsPage.tsx
import { useContext, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Stack,
  Card,
  CardContent,
  Chip,
  CardActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AdminReservationContext } from "../../context/AdminReservationsContext";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = (`0${date.getDate()}`).slice(-2);
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

const AdminReservationsPage: React.FC = () => {
  const [passport, setPassport] = useState("1234567890");
  const { reservations, getReservationsByPassport } = useContext(AdminReservationContext)!;
  const navigate = useNavigate();

  const handleSearch = () => {
    if (passport.trim()) {
      getReservationsByPassport(passport.trim());
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Введите паспорт
      </Typography>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          label="Паспорт"
          value={passport}
          onChange={(e) => setPassport(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Найти
        </Button>
      </Box>

      {reservations.length > 0 ? (
        <Stack spacing={2}>
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
                    <strong>Даты:</strong> {formatDate(res.arrivalDate)} - {formatDate(res.departureDate)}
                  </Typography>
                  <Typography component="div">
                    <strong>Статус:</strong>{" "}
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
                    />
                  </Typography>
                  <Typography>
                    <strong>Стоимость проживания:</strong> {res.livingPrice}₽
                  </Typography>
                  <Typography>
                    <strong>К оплате за дополнительные услуги:</strong> {res.servicesPrice}₽
                  </Typography>
                  <Typography>
                    <strong>Итого:</strong> {res.fullPrice}₽
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", gap: 1, p: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/adminReservations/${res.id}`)}
              >
                Подробнее
              </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      ) : (
        <Typography variant="body1">Бронирования не найдены.</Typography>
      )}
    </Container>
  );
};

export default AdminReservationsPage;
