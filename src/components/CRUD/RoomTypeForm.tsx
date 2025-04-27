import { useContext, useEffect, useState } from "react";
import { RoomCategory, RoomType } from "../../models/roomType";
import { RoomTypeContext } from "../../context/RoomTypeContext";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack, TextField, Button, Autocomplete } from "@mui/material";

interface RoomTypeFormProps {
  existingType?: RoomType
}

const RoomTypeForm: React.FC<RoomTypeFormProps> = ({ existingType }) => {
    const context = useContext(RoomTypeContext);
    const navigate = useNavigate();

    //Загрузка категорий комнат
    const [categories, setCategories] = useState<RoomCategory[]>([]);
    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesList = await context?.getRoomCategories();
            setCategories(categoriesList || []);
        };
        fetchCategories();
    }, [context]);

    const [type, setType] = useState<Omit<RoomType, "id">>({
        guestCapacity: existingType?.guestCapacity || 1,
        price: existingType?.price || 0,
        description: existingType?.description || "",
        roomCategoryID: existingType?.roomCategoryID || 1,
        roomCategory: existingType?.roomCategory || {id: 1, category: "Стандарт"},
        rooms: existingType?.rooms || []
    })

    useEffect(() => {
        if (existingType) {
          setType({
            guestCapacity: existingType.guestCapacity,
            price: existingType.price,
            description: existingType.description,
            roomCategoryID: existingType.roomCategoryID,
            roomCategory: existingType.roomCategory,
            rooms: existingType?.rooms
          })
        }
      }, [existingType])

      useEffect(() => {
        if (!existingType && categories.length > 0) {
          setType(prev => ({
            ...prev,
            roomCategory: categories[0],  // Подставляем первую категорию
            roomCategoryID: categories[0].id  // И обновляем roomCategoryID
          }));
        }
      }, [categories, existingType]);
      

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!type.guestCapacity || !type.price || !type.description || !type.roomCategory) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        try {
        if (existingType) {
            await context?.updateType({ id: existingType.id, ...type })
        } else {
            await context?.addType(type)
        }
        navigate("/roomTypes")
        } catch (error) {
        alert("Ошибка при сохранении типа комнаты.")
        }
    }
      return (
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            {existingType ? "Редактировать тип" : "Добавить новый тип комнаты"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Количество мест"
                type="number"
                value={type.guestCapacity}
                required
                inputProps={{ min: 1, max: 10 }}
                onChange={(e) => setType({ ...type, guestCapacity: parseInt(e.target.value, 10) })}
              />
              <TextField
                label="Цена за сутки"
                type="number"
                value={type.price}
                required
                inputProps={{ min: 0 }}
                onChange={(e) =>
                  setType({ ...type, price: parseInt(e.target.value, 10) || 0 })
                }
              />
              <TextField
                label="Описание"
                value={type.description}
                required
                multiline
                onChange={(e) => setType({ ...type, description: e.target.value })}
              />
              <Autocomplete
                value={type.roomCategory || null} // фактическое значение
                onChange={(event, newValue) => {
                    // Если newValue не null, обновляем состояние
                    if (newValue) {
                        setType(prev => ({
                            ...prev,
                            roomCategory: newValue,
                            roomCategoryID: newValue.id}));
                    } else {
                        // Если newValue равно null, сбрасываем на значение по умолчанию
                        setType({ ...type, roomCategory: { id: 1, category: "Стандарт" } }); 
                    }
                }}
                options={categories} // список объектов
                getOptionLabel={(option) => option.category} // отображаемое значение
                renderInput={(params) => <TextField {...params} label="Категория комнаты" required />}
                isOptionEqualToValue={(option, value) => option.id === value.id} // сравниваем объекты по уникальному идентификатору
                />

              
    
              <Stack direction="row" spacing={2}>
                <Button variant="contained" type="submit">
                  {existingType ? "Сохранить" : "Добавить"}
                </Button>
                <Button variant="outlined" onClick={() => navigate("/roomTypes")}>
                  Назад
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      )
}

export default RoomTypeForm;