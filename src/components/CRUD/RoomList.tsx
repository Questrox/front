import { useContext, useEffect, useState } from "react"
import { RoomContext } from "../../context/RoomContext"
import { Link, useNavigate } from "react-router-dom"
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material"
import { Pagination } from "@mui/material"

const RoomList: React.FC = () => {
  const context = useContext(RoomContext)
  const navigate = useNavigate()

  if (!context) return <Typography>No context available!</Typography>

  const { rooms, deleteRoom, totalCount, pageSize, page, setPage } = context
  
  const handlePageChange = async (page: number) => {
    setPage(page);
    context.fetchRooms(page);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom align="center">
        Номера
      </Typography>

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
      {/* Пагинация */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(totalCount / pageSize)}
          page={page}
          onChange={(event, value) => handlePageChange(value)}
          color="primary"
        />
      </Box>
      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button
          variant="outlined"
          onClick={() => navigate("/adminPanel")}
          sx={{ flex: 1, maxWidth: 200 }}
        >
          Назад
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate("/rooms/add")}>
        Добавить новую комнату
      </Button>
      </Stack>
    </Box>
  )
}

export default RoomList
