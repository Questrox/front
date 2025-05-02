// AdminReservationDetailsPage.tsx
import { useContext, useEffect, useState } from "react";
import {
  Box, Typography, Chip, List, ListItem,
  ListItemText, TextField, Button, Container, Stack
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Reservation } from "../../models/reservation";
import { AdminReservationContext } from "../../context/AdminReservationsContext";
import ReservationService from "../../services/ReservationService";

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
        <Box>
          <Typography variant="h5" gutterBottom>Детали бронирования</Typography>
          <Typography><strong>Дата заезда:</strong> {formatDate(reservation.arrivalDate)}</Typography>
          <Typography><strong>Дата выезда:</strong> {formatDate(reservation.departureDate)}</Typography>
          <Typography><strong>Стоимость проживания:</strong> {reservation.livingPrice}₽</Typography>
          <Typography><strong>К оплате за услуги:</strong> {reservation.servicesPrice}₽</Typography>
          <Typography><strong>Общая стоимость:</strong> {reservation.fullPrice}₽</Typography>
          <Chip
                            label={reservation.reservationStatus.status}
                            color={getReservationStatusColor(reservation.reservationStatusID)}
                            size="small"
                            sx={{ mr: 1 }}
                          />

          <Typography variant="h6" sx={{ mt: 3 }}>Дополнительные услуги</Typography>
          {reservation.serviceStrings.length === 0 ? (
            <Typography>Дополнительных услуг нет.</Typography>
          ) : (
            <List>
              {reservation.serviceStrings.map(service => {
                const remaining = service.count - service.deliveredCount;
                return (
                  <ListItem key={service.id} divider>
                    <ListItemText
                      primary={`${service.additionalService.name} (цена за штуку - ${service.price}₽)`}
                      secondary={
                        <>
                          <Chip
                            label={service.serviceStatus.status}
                            color={getServiceStatusColor(service.serviceStatusID)}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          {`Оказано: ${service.deliveredCount} / ${service.count}`}
                        </>
                      }
                    />
                    <Stack direction="row" spacing={1} alignItems="center">
                      {remaining > 0 && service.serviceStatusID === 1 && reservation.reservationStatusID === 2 && (
                        <>
                          <TextField
                            label="Количество"
                            type="number"
                            size="small"
                            value={amounts[service.id] ?? 1}
                            onChange={(e) =>
                                setAmounts((prev) => ({
                                  ...prev,
                                  [service.id]: Number(e.target.value),
                                }))}
                            inputProps={{ min: 1, max: remaining }}
                            sx={{ width: 200 }}
                          />
                          <Button variant="contained" onClick={() => handleDeliverService(service.id)}>
                            Оказать
                          </Button>
                        </>
                      )}
                    </Stack>
                  </ListItem>
                );
              })}
            </List>
          )}

          <Box sx={{ mt: 4 }}>
            {reservation.reservationStatusID === 1 && (
              <Button variant="contained" onClick={handleConfirmLivingPayment}>
                Подтвердить оплату проживания
              </Button>
            )}
            {reservation.reservationStatusID === 2 && (
              <Button variant="contained" onClick={handleConfirmServicePayment}>
                Подтвердить оплату дополнительных услуг
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default AdminReservationDetailsPage;
