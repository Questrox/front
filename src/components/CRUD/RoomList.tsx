import { useContext } from "react"
import { RoomContext } from "../../context/RoomContext"
import { Link, useNavigate } from "react-router-dom"
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material"

const RoomList: React.FC = () => {
  const context = useContext(RoomContext)
  const navigate = useNavigate()

  if (!context) return <Typography>No context available!</Typography>

  const { rooms, deleteRoom } = context

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Номера
      </Typography>

      <Button variant="contained" color="primary" onClick={() => navigate("/rooms/add")}>
        Добавить новый номер
      </Button>

      <Stack spacing={2} mt={3}>
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardContent>
              <Typography variant="h6">{room.number}</Typography>
              <Button
                component={Link}
                to={`/rooms/${room.id}`}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                Детали
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteRoom(room.id)}
              >
                Удалить
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Button sx={{ mt: 4 }} onClick={() => navigate("/adminPanel")}>
        Назад
      </Button>
    </Box>
  )
}

export default RoomList
