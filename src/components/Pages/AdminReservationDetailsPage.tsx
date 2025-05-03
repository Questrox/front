// AdminReservationDetailsPage.tsx
import { useContext, useEffect, useState } from "react";
import {
  Box, Typography, Chip, List, ListItem,
  ListItemText, TextField, Button, Container, Stack,
  Paper, Divider
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Reservation } from "../../models/reservation";
import { AdminReservationContext } from "../../context/AdminReservationsContext";
import ReservationService from "../../services/ReservationService";
import { CheckCircle, HourglassEmpty, Info } from "@mui/icons-material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU");
}

function getReservationStatusColor(statusID: number): "warning" | "info" | "success" | "error" | "default" {
  switch (statusID) {
    case 1: return "warning";   // ожидание
    case 2: return "info";      // оплачено проживание
    case 3: return "success";   // оплачено всё
    case 4: return "error";     // отменено
    default: return "default";
  }
}

function getServiceStatusColor(statusId: number): 'default' | 'success' | 'error' | 'warning' {
    switch (statusId) {
      case 1: return 'warning'; // ожидание
      case 2: return 'success'; // оплачена
      case 3: return 'error';   // отменена
      default: return 'default';
    }
  };

const AdminReservationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [amounts, setAmounts] = useState<Record<number, number>>({}); //Словарь, чтобы у каждой услуги было свое количество
  const context = useContext(AdminReservationContext);

  useEffect(() => {
    const fetchReservation = async () => {
      if (context && id) {
        try {
          const foundRes = await context.getReservationById(parseInt(id, 10));
          setReservation(foundRes || null);
        } catch (error) {
          alert(`Ошибка при получении бронирования: ${error}`);
        }
      }
    };
  
    fetchReservation();
  }, [context, id]);
  

  const handleDeliverService = async (serviceStringID: number) => { //Подтверждение оказания услуги
    if (!context || !reservation) return;
    const amount = amounts[serviceStringID] ?? 1;
    if (amount == 0) return;
    try 
    {
      const updatedService = await context.deliverService(serviceStringID, amount);
      setReservation(await context.getReservationById(reservation.id));
      setAmounts(prev => ({ ...prev, [serviceStringID]: 1 })); //Обновление только для этой услуги
      alert("Оказание услуги подтверждено!");
    } catch (error){
      alert(`Ошибка при оказании услуги: ${error}`);
    }
  };

  const handleConfirmLivingPayment = async () => { //Подтверждение оплаты проживания
    if (!context || !reservation) return;
    try {
      const updatedRes = await context?.confirmLivingPayment(reservation);
      setReservation(updatedRes);
      alert("Оплата проживания подтверждена!");
    } catch (error) {
      alert(`Ошибка при обновлении бронирования: ${error}`);
    }
  };

  const handleConfirmServicePayment = async () => { //Подтверждение оплаты услуг
    if (!context || !reservation) return;
    try {
        const updatedRes = await context?.confirmServicesPayment(reservation);
        setReservation(updatedRes);
        alert("Оплата услуг подтверждена!");
      } catch (error) {
        alert(`Ошибка при обновлении бронирования: ${error}`);
      }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {reservation && (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom align="center">
            Детали бронирования
          </Typography>

          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography><strong>Дата заезда:</strong> {formatDate(reservation.arrivalDate)}</Typography>
            <Typography><strong>Дата выезда:</strong> {formatDate(reservation.departureDate)}</Typography>
            <Typography><strong>Стоимость проживания:</strong> {reservation.livingPrice}₽</Typography>
            <Typography><strong>К оплате за услуги:</strong> {reservation.servicesPrice}₽</Typography>
            <Typography><strong>Общая стоимость:</strong> {reservation.fullPrice}₽</Typography>
            <Chip
              label={reservation.reservationStatus.status}
              color={getReservationStatusColor(reservation.reservationStatusID)}
              icon={
                reservation.reservationStatusID === 1 ? <HourglassEmptyIcon /> :
                reservation.reservationStatusID === 2 ? <InfoIcon /> :
                reservation.reservationStatusID === 3 ? <CheckCircleIcon /> :
                reservation.reservationStatusID === 4 ? <CancelIcon /> : undefined
              }
              size="small"
              sx={{ mt: 1, alignSelf: "flex-start" }}
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Дополнительные услуги
          </Typography>

          {reservation.serviceStrings.length === 0 ? (
            <Typography color="text.secondary">
              Дополнительных услуг нет.
            </Typography>
          ) : (
            <Stack spacing={2} mt={2}>
              {reservation.serviceStrings.map((service: any) => {
                const remaining = service.count - service.deliveredCount;
                return (
                  <Paper
                    key={service.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        {service.additionalService.name} (цена за штуку - {service.price}₽)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <Chip
                          label={service.serviceStatus.status}
                          color={getServiceStatusColor(service.serviceStatusID)}
                          icon={
                            service.serviceStatusID === 1 ? <HourglassEmptyIcon /> :
                            service.serviceStatusID === 2 ? <CheckCircleIcon /> :
                            service.serviceStatusID === 3 ? <CancelIcon /> : undefined
                          }
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        {`Оказано: ${service.deliveredCount} / ${service.count}`}
                      </Typography>
                    </Box>

                    {remaining > 0 &&
                      service.serviceStatusID === 1 &&
                      reservation.reservationStatusID === 2 && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            label="Количество"
                            type="number"
                            size="small"
                            value={amounts[service.id] ?? 1}
                            onChange={(e) =>
                              setAmounts((prev: any) => ({
                                ...prev,
                                [service.id]: Number(e.target.value),
                              }))
                            }
                            inputProps={{ min: 1, max: remaining }}
                            sx={{ width: 100 }}
                          />
                          <Button
                            variant="contained"
                            onClick={() => handleDeliverService(service.id)}
                          >
                            Оказать
                          </Button>
                        </Stack>
                      )}
                  </Paper>
                );
              })}
            </Stack>
          )}

          <Divider sx={{ my: 3 }} />

          <Box>
            {reservation.reservationStatusID === 1 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmLivingPayment}
                sx={{ mr: 2 }}
              >
                Подтвердить оплату проживания
              </Button>
            )}
            {reservation.reservationStatusID === 2 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmServicePayment}
              >
                Подтвердить оплату дополнительных услуг
              </Button>
            )}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default AdminReservationDetailsPage;
