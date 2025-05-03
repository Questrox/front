import { RoomTypeContext } from "../../context/RoomTypeContext"
import React, { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Typography, Box, Button, Stack, Card, CardContent } from "@mui/material"

const RoomTypeList: React.FC = () =>
{
    const context = useContext(RoomTypeContext)
    const navigate = useNavigate();
    if (!context) return <Typography>No context available!</Typography>
    const { roomTypes, deleteType } = context
    return (
        <Box p={3}>
          <Typography variant="h4" gutterBottom align="center">
            Типы комнат
          </Typography>
    
          <Stack spacing={2} mt={3}>
            {roomTypes.map((rt) => (
              <Card key={rt.id}>
                <CardContent>
                  <Typography variant="h6">{`${rt.guestCapacity}-местный ${rt.roomCategory.category}`}</Typography>
                  <Button
                    component={Link}
                    to={`/roomTypes/${rt.id}`}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  >
                    Детали
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteType(rt.id)}
                  >
                    Удалить
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Stack>
    
          <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button
          variant="outlined"
          onClick={() => navigate("/adminPanel")}
          sx={{ flex: 1, maxWidth: 200 }}
        >
          Назад
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate("/roomTypes/add")}>
        Добавить тип комнаты
      </Button>
      </Stack>
        </Box>
      )
    }

export default RoomTypeList;