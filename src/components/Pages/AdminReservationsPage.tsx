import { useContext, useState } from "react";
import {
  Paper,
  Button,
  TextField,
  Typography,
  Stack,
  Chip,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AdminReservationContext } from "../../context/AdminReservationsContext";
import {
  HourglassEmpty as HourglassIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Help as DefaultIcon
} from "@mui/icons-material";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU");
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

  const getStatusChip = (statusID: number, status: string) => {
    const iconProps = { fontSize: "small" as const, sx: { mr: 0.5 } };
    switch (statusID) {
      case 1:
        return <Chip icon={<HourglassIcon {...iconProps} />} label={status} color="warning" size="small" />;
      case 2:
        return <Chip icon={<InfoIcon {...iconProps} />} label={status} color="info" size="small" />;
      case 3:
        return <Chip icon={<CheckCircleIcon {...iconProps} />} label={status} color="success" size="small" />;
      case 4:
        return <Chip icon={<CancelIcon {...iconProps} />} label={status} color="error" size="small" />;
      default:
        return <Chip icon={<DefaultIcon {...iconProps} />} label={status} size="small" />;
    }
  };

  return (
    <Box maxWidth="md" mx="auto" mt={4}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Поиск бронирований по паспорту
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2, mb: 4 }}>
          <TextField
            fullWidth
            label="Паспорт"
            value={passport}
            onChange={(e) => setPassport(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleSearch}
            disabled={!passport.trim()}
          >
            Найти
          </Button>
        </Stack>

        {reservations.length > 0 ? (
          <Stack spacing={3}>
            {reservations.map((res) => (
              <Paper
                key={res.id}
                variant="outlined"
                sx={{ p: 3, borderRadius: 2 }}
              >
                <Stack spacing={1}>
                  <Typography><strong>Номер:</strong> {res.room.number}</Typography>
                  <Typography>
                    <strong>Тип номера:</strong>{" "}
                    {`${res.room.roomType.guestCapacity}-местный ${res.room.roomType.roomCategory.category}`}
                  </Typography>
                  <Typography>
                    <strong>Даты:</strong> {formatDate(res.arrivalDate)} – {formatDate(res.departureDate)}
                  </Typography>
                  <Typography component="div">
                    <strong>Статус:</strong>{" "}
                    {getStatusChip(res.reservationStatusID, res.reservationStatus.status)}
                  </Typography>
                  <Typography><strong>Проживание:</strong> {res.livingPrice}₽</Typography>
                  <Typography><strong>Доп. услуги:</strong> {res.servicesPrice}₽</Typography>
                  <Typography><strong>Итого:</strong> {res.fullPrice}₽</Typography>
                </Stack>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/adminReservations/${res.id}`)}
                  >
                    Подробнее
                  </Button>
                </Box>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Бронирования не найдены.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AdminReservationsPage;
