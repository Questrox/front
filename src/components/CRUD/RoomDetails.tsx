import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material"
import { RoomContext } from "../../context/RoomContext"
import { Room } from "../../models/room"
import RoomForm from "./RoomForm"

const RoomDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const context = useContext(RoomContext)
    const navigate = useNavigate()
    const [room, setRoom] = useState<Room | null>(null)
    const [isEditing, setIsEditing] = useState(false)
  
    //Загружаем комнаты
    useEffect(() => {
      if (context && id) {
        const foundRoom = context.rooms.find((u) => u.id === parseInt(id, 10))
        setRoom(foundRoom || null)
      }
    }, [context, id])
  
    if (!room) {
      return <Typography>Номер не найден!</Typography>
    }
  
    if (isEditing) {
      return <RoomForm existingRoom={room} />
    }

    return (
      <Box p={3}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Детали о комнате
            </Typography>
            <Typography><strong>Номер:</strong> {room.number}</Typography>
            <Typography><strong>Тип номера:</strong> {`${room.roomType.guestCapacity}-местный ${room.roomType.roomCategory.category}`}</Typography>
          </CardContent>
        </Card>
  
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" onClick={() => setIsEditing(true)}>
            Редактировать
          </Button>
          <Button variant="outlined" onClick={() => navigate("/rooms")}>
            Назад
          </Button>
        </Stack>
      </Box>
    )
  }
  
  export default RoomDetails
  