import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Button,
    TextField,
    MenuItem,
    Divider,
    Autocomplete,
    Chip,
    Paper,
    Stack
  } from "@mui/material"
  import { useContext, useEffect, useState } from "react"
  import { UserProfileContext } from "../../context/UserProfileContext"
  import { useNavigate, useParams } from "react-router-dom"
  import { Reservation } from "../../models/reservation"
  import { ServiceString } from "../../models/serviceString"
  import { AdditionalService } from "../../models/additionalService"
  import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import CancelIcon from "@mui/icons-material/Cancel";
  
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  }
  const getStatusColor = (statusId: number): 'default' | 'success' | 'error' | 'warning' => {
    switch (statusId) {
      case 1: return 'warning'; // ожидание
      case 2: return 'success'; // оплачена
      case 3: return 'error';   // отменена
      default: return 'default';
    }
  };
  const getStatusIcon = (statusId: number) => {
    switch (statusId) {
      case 1: return <HourglassEmptyIcon /> ; // ожидание
      case 2: return <CheckCircleIcon /> ; // оплачена
      case 3: return <CancelIcon /> ;   // отменена
      default: return undefined;
    }
  };

  const ReservationDetailsPage: React.FC = () => {
    const context = useContext(UserProfileContext)
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [reservation, setReservation] = useState<Reservation | null>(null)
    const [selectedService, setSelectedService] = useState<AdditionalService | null>(null)
    const [selectedCount, setSelectedCount] = useState<number>(1)
  
    useEffect(() => {
      if (context && id) {
        const foundRes = context.reservations.find((r) => r.id === parseInt(id, 10))
        setReservation(foundRes || null)
      }
      if (context?.services.length && selectedService === null) {
        setSelectedService(context.services[0]);
      }
    }, [context, id])
  
    const handleCancelService = async (service: ServiceString) => {
        if (!reservation || !context) return;
      
        const updatedService: ServiceString = {
          ...service,
          serviceStatusID: 3
        };
      
        const result = await context.updateServiceString(updatedService);
        if (!result) return;
      
        const updatedServiceStrings = reservation.serviceStrings.map((s) =>
          s.id === result.id ? result : s
        );
      
        // Обновляем локальное состояние
        setReservation({
          ...reservation,
          serviceStrings: updatedServiceStrings
        });
        context.refreshReservations();
      };
      
  
    const handleAddService = async () => {
        if (!reservation || selectedService === null) return
      
        const newServiceData = {
          count: selectedCount,
          deliveredCount: 0,
          additionalServiceID: selectedService.id,
          additionalService: selectedService,
          reservationID: reservation.id,
          price: 0,
          serviceStatusID: 1,
        }
      
        const newService = await context?.addServiceString(newServiceData);
      
        if (newService) {
          setReservation({
            ...reservation,
            serviceStrings: [...reservation.serviceStrings, newService],
          })
        }
      
        setSelectedService(context!.services[0]);
        setSelectedCount(1);
        context?.refreshReservations();
      }
      
  
    if (!reservation) return <Typography>Бронирование не найдено!</Typography>
  
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
  <Typography variant="h5" gutterBottom align="center">
    Детали бронирования
  </Typography>

  <Stack spacing={1} sx={{ mb: 3 }}>
    <Typography><strong>Дата заезда:</strong> {formatDate(reservation.arrivalDate)}</Typography>
    <Typography><strong>Дата выезда:</strong> {formatDate(reservation.departureDate)}</Typography>
    <Typography><strong>Стоимость проживания:</strong> {reservation.livingPrice}₽</Typography>
    <Typography><strong>К оплате за услуги:</strong> {reservation.servicesPrice}₽</Typography>
    <Typography><strong>Общая стоимость:</strong> {reservation.fullPrice}₽</Typography>
  </Stack>

  <Divider sx={{ my: 2 }} />

  <Typography variant="h6" gutterBottom>
    Дополнительные услуги
  </Typography>

  {reservation.serviceStrings.length === 0 ? (
    <Typography color="text.secondary">Дополнительных услуг нет.</Typography>
  ) : (
    <Stack spacing={2}>
      {reservation.serviceStrings.map((service) => (
        <Paper
          key={service.id}
          variant="outlined"
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle1">
              {service.additionalService.name} ({service.additionalService.price}₽ / шт)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Chip
                label={service.serviceStatus.status}
                color={getStatusColor(service.serviceStatusID)}
                icon={getStatusIcon(service.serviceStatusID)}
                size="small"
                sx={{ mr: 1 }}
              />
              {`Оказано: ${service.deliveredCount} / ${service.count}`}
            </Typography>
          </Box>
          {service.deliveredCount === 0 && service.serviceStatusID === 1 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleCancelService(service)}
            >
              Отменить
            </Button>
          )}
        </Paper>
      ))}
    </Stack>
  )}

  <Divider sx={{ my: 3 }} />

  <Typography variant="h6" gutterBottom>
    Добавить услугу
  </Typography>

  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
    <Autocomplete
      options={context?.services || []}
      getOptionLabel={(option) => `${option.name} (${option.price}₽ / шт)`}
      value={selectedService}
      onChange={(_, newValue) => setSelectedService(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Выберите услугу" sx={{ minWidth: 500 }} />
      )}
    />
    <TextField
      label="Количество"
      type="number"
      value={selectedCount}
      inputProps={{ min: 1 }}
      onChange={(e) => setSelectedCount(Number(e.target.value))}
      sx={{ width: 120 }}
    />
    <Button
      variant="contained"
      onClick={handleAddService}
      disabled={!selectedService || selectedCount < 1}
    >
      Добавить
    </Button>
  </Stack>
</Paper>

    )
  }
  
  export default ReservationDetailsPage
  