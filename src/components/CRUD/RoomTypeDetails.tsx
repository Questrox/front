import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RoomTypeContext } from "../../context/RoomTypeContext"
import { RoomType } from "../../models/roomType"
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material"
import RoomTypeForm from "./RoomTypeForm"
import { Room } from "../../models/room"

const RoomTypeDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const context = useContext(RoomTypeContext)
    const navigate = useNavigate()
    const [type, setType] = useState<RoomType | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [rooms, setRooms] = useState<Room[]>([]);
  
    //Загружаем типы комнат и комнаты
    useEffect(() => {
      if (context && id) {
        const foundType = context.roomTypes.find((u) => u.id === parseInt(id, 10))
        setType(foundType || null)

        context.getRooms().then(setRooms);
      }
    }, [context, id])
  
    if (!type) {
      return <Typography>Тип не найден!</Typography>
    }
  
    if (isEditing) {
      return <RoomTypeForm existingType={type} />
    }
    const relatedRooms = rooms.filter(room => room.roomTypeID === type.id);
    return (
      <Box p={3}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Детали типа комнаты
            </Typography>
            <Typography><strong>Вместительность:</strong> {type.guestCapacity}</Typography>
            <Typography><strong>Цена за сутки:</strong> {type.price}</Typography>
            <Typography><strong>Описание:</strong> {type.description}</Typography>
            <Box mt={2}>
            <Typography variant="h6">Комнаты этого типа:</Typography>
            {relatedRooms.length > 0 ? (
              relatedRooms.map(room => (
                <Typography key={room.id}>Номер комнаты: {room.number}</Typography>
              ))
            ) : (
              <Typography>Нет комнат этого типа</Typography>
            )}
          </Box>
          </CardContent>
        </Card>
  
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" onClick={() => setIsEditing(true)}>
            Редактировать
          </Button>
          <Button variant="outlined" onClick={() => navigate("/roomTypes")}>
            Назад
          </Button>
        </Stack>
      </Box>
    )
  }
  
  export default RoomTypeDetails
  