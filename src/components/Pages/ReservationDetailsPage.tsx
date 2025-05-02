import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Button,
    TextField,
    MenuItem,
    Autocomplete,
    Chip
  } from "@mui/material"
  import { useContext, useEffect, useState } from "react"
  import { UserProfileContext } from "../../context/UserProfileContext"
  import { useNavigate, useParams } from "react-router-dom"
  import { Reservation } from "../../models/reservation"
  import { ServiceString } from "../../models/serviceString"
  import { AdditionalService } from "../../models/additionalService"
  
  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const day = (`0${date.getDate()}`).slice(-2)
    const month = (`0${date.getMonth() + 1}`).slice(-2)
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }
  const getStatusColor = (statusId: number): 'default' | 'success' | 'error' | 'warning' => {
    switch (statusId) {
      case 1: return 'warning'; // ожидание
      case 2: return 'success'; // оплачена
      case 3: return 'error';   // отменена
      default: return 'default';
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
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Детали бронирования
        </Typography>
  
        <Typography><strong>Дата заезда:</strong> {formatDate(reservation.arrivalDate)}</Typography>
        <Typography><strong>Дата выезда:</strong> {formatDate(reservation.departureDate)}</Typography>
        <Typography><strong>Общая стоимость:</strong> {reservation.fullPrice}₽</Typography>
        <Typography><strong>Стоимость проживания:</strong> {reservation.livingPrice}₽</Typography>
        <Typography><strong>К оплате за услуги:</strong> {reservation.servicesPrice}₽</Typography>
  
        <Typography variant="h6" sx={{ mt: 3 }}>
            Дополнительные услуги
        </Typography>

        {reservation.serviceStrings.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 1 }}>
            Дополнительных услуг нет.
        </Typography>
        ) : (
        <List>
            {reservation.serviceStrings.map((service) => (
            <ListItem key={service.id} divider>
                <ListItemText
                primary={service.additionalService.name + ` (цена за штуку - ${service.price}₽)`}
                secondary={
                    <>
                    <Chip
                        label={service.serviceStatus.status}
                        color={getStatusColor(service.serviceStatusID)}
                        size="small"
                        sx={{ mr: 1 }}
                    />
                    {`Оказано: ${service.deliveredCount} / ${service.count}`}
                    </>
                }
                />
                {service.deliveredCount === 0 && service.serviceStatusID === 1 && (
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelService(service)}
                >
                    Отменить
                </Button>
                )}
            </ListItem>
            ))}
        </List>
        )}

  
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Добавить услугу</Typography>
          <Autocomplete
            options={context?.services || []}
            getOptionLabel={(option) => option.name + ` (${option.price}₽ за штуку)`}
            value={selectedService}
            onChange={(_, newValue) => setSelectedService(newValue)}
            renderInput={(params) => 
                <TextField {...params} label="Выберите услугу" sx={{ width: 500, mr: 2 }} />
            }
            sx={{ mt: 1, mb: 2 }}
            />

          <TextField
            label="Количество"
            type="number"
            value={selectedCount}
            inputProps={{ min: 1 }}
            onChange={(e) => setSelectedCount(Number(e.target.value))}
            sx={{ mr: 2, width: 100 }}
          />
          <Button variant="contained" onClick={handleAddService}>
            Добавить
          </Button>
        </Box>
      </Box>
    )
  }
  
  export default ReservationDetailsPage
  