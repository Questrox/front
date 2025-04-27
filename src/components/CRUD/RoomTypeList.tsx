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
          <Typography variant="h4" gutterBottom>
            Типы комнат
          </Typography>
    
          <Button variant="contained" color="primary" onClick={() => navigate("/roomTypes/add")}>
            Добавить новый тип
          </Button>
    
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
    
          <Button sx={{ mt: 4 }} onClick={() => navigate("/adminPanel")}>
            Назад
          </Button>
        </Box>
      )
    }

export default RoomTypeList;