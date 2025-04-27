import { useContext, useEffect, useState } from "react";
import { Room } from "../../models/room";
import { useNavigate } from "react-router-dom";
import { RoomContext } from "../../context/RoomContext";
import { RoomType } from "../../models/roomType";
import { Autocomplete, Box, Button, Stack, TextField, Typography } from "@mui/material";

interface RoomFormProps {
  existingRoom?: Room
}

const RoomForm: React.FC<RoomFormProps> = ({ existingRoom }) => {
    const context = useContext(RoomContext);
    const navigate = useNavigate();

    const [types, setTypes] = useState<RoomType[]>([]);
    const [room, setRoom] = useState<Omit<Room, "id"> | null>(null);

    useEffect(() => {
        const fetchTypes = async () => {
            const typesList = await context?.getRoomTypes();
            setTypes(typesList || []);
        };
        fetchTypes();
    }, [context]);

    useEffect(() => {
        if (types.length > 0) {
            if (existingRoom) {
                setRoom({
                    number: existingRoom.number,
                    roomTypeID: existingRoom.roomTypeID,
                    roomType: existingRoom.roomType,
                });
            } else {
                setRoom({
                    number: 0,
                    roomTypeID: types[0].id,
                    roomType: types[0],
                });
            }
        }
    }, [types, existingRoom]);

    if (!room) {
        return <div>Загрузка формы...</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!room.number || !room.roomType) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        try {
            if (existingRoom) {
                await context?.updateRoom({ id: existingRoom.id, ...room })
            } else {
                await context?.addRoom(room)
            }
            navigate("/rooms")
        } catch (error) {
            alert("Ошибка при сохранении комнаты.")
        }
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                {existingRoom ? "Редактировать комнату" : "Добавить новую комнату"}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="Номер комнаты"
                        type="number"
                        value={room.number}
                        required
                        inputProps={{ min: 1 }}
                        onChange={(e) => setRoom({ ...room, number: parseInt(e.target.value, 10) })}
                    />
                    <Autocomplete
                        value={room.roomType}
                        onChange={(event, newValue) => {
                            if (newValue) {
                                setRoom(prev => ({
                                    ...prev!,
                                    roomType: newValue,
                                    roomTypeID: newValue.id
                                }));
                            }
                        }}
                        options={types}
                        getOptionLabel={(option) => `${option.guestCapacity}-местный ${option.roomCategory.category}`}
                        renderInput={(params) => <TextField {...params} label="Тип номера" required />}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" type="submit">
                            {existingRoom ? "Сохранить" : "Добавить"}
                        </Button>
                        <Button variant="outlined" onClick={() => navigate("/rooms")}>
                            Назад
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}

export default RoomForm;
