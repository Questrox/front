import React, { useContext, useEffect, useRef, useState } from "react"
import {
  Box,
  Typography,
  FormControl,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Autocomplete,
  useTheme,
  Stack,
  Divider
} from "@mui/material"
import HotelIcon from '@mui/icons-material/Hotel';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { OurRoomsContext } from "../../context/OurRoomsContext"
import { RoomTypeImage } from "../../models/dictionaries"

const OurRoomsPage: React.FC = () => {
  const context = useContext(OurRoomsContext)
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(null)
  const [images, setImages] = useState<RoomTypeImage[]>([])
  const theme = useTheme()

  useEffect(() => {
    if (context?.roomTypes.length) {
      const defaultId = context.roomTypes[0].id
      setSelectedRoomTypeId(defaultId)
      loadImages(defaultId)
    }
  }, [context?.roomTypes])

  const loadImages = async (roomTypeId: number) => {
    try {
      const data = await context?.getImages(roomTypeId)
      setImages(data || [])
    } catch {
      setImages([])
    }
  }

  const handleChange = (event: any) => {
    const id = event.target.value
    setSelectedRoomTypeId(id)
    loadImages(id)
  }

  const selectedRoom = context?.roomTypes.find((rt) => rt.id === selectedRoomTypeId)

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: 6,
        mb: 8,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 700,
          letterSpacing: 1,
          color: theme.palette.primary.main,
        }}
      >
        Наши номера
      </Typography>
      <Typography
        variant="h6"
        gutterBottom
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Здесь вы можете ознакомиться с нашими предложениями.
      </Typography>

      <FormControl fullWidth sx={{ mt: 3 }}>
        <Autocomplete
          sx={{
            mt: 1,
            background: "#fff",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(76,175,80,0.07)",
          }}
          fullWidth
          options={context?.roomTypes || []}
          getOptionLabel={(option) =>
            `${option.guestCapacity}-местный ${option.roomCategory.category}`
          }
          value={
            context?.roomTypes.find((rt) => rt.id === selectedRoomTypeId) || null
          }
          onChange={(_, newValue) => {
            handleChange({
              target: { value: newValue?.id || "" },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Выберите тип номера"
              InputProps={{
                ...params.InputProps,
                sx: {
                  background: "#fffafa",
                  borderRadius: 2,
                },
              }}
            />
          )}
        />
      </FormControl>

      <Card
        sx={{
          mt: 5,
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(76,175,80,0.10)",
          overflow: "hidden",
        }}
      >
        {images.length > 0 ? (
          <Swiper
            navigation
            modules={[Navigation]}
            style={{ height: 420, borderRadius: "16px 16px 0 0" }}
          >
            {images.map((img) => (
              <SwiperSlide key={img.id}>
                <CardMedia
                  component="img"
                  height="420"
                  src={img.imagePath}
                  alt="Фото номера"
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                    borderRadius: "16px 16px 0 0",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Box
            sx={{
              height: 420,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f5f5f5",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <Typography color="text.secondary">
              Изображения для этого типа не найдены
            </Typography>
          </Box>
        )}

        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <HotelIcon color="primary" />
            <Typography variant="h5" fontWeight={600}>
              {selectedRoom
                ? `${selectedRoom.guestCapacity}-местный ${selectedRoom.roomCategory.category}`
                : "Выберите номер"}
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Описание
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mb: 3 }}
          >
            {selectedRoom?.description || "Нет описания для выбранного типа номера."}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mt: 2 }}
          >
            <CurrencyRubleIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              {selectedRoom
                ? selectedRoom.price.toLocaleString("ru-RU", {
                    style: "currency",
                    currency: "RUB",
                  })
                : "-"}{" "}
              <Typography
                component="span"
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 400 }}
              >
                / ночь
              </Typography>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default OurRoomsPage
