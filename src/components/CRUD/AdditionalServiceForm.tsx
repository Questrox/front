import { useContext, useEffect, useState } from "react"
import { AdditionalService } from "../../models/additionalService"
import { useNavigate } from "react-router-dom"
import { AdditionalServiceContext } from "../../context/AdditionalServiceContext"
import { Box, Button, Stack, TextField, Typography } from "@mui/material"

interface AdditionalServiceFormProps {
  existingService?: AdditionalService
}

const AdditionalServiceForm: React.FC<AdditionalServiceFormProps> = ({ existingService }) => {
  const context = useContext(AdditionalServiceContext)
  const navigate = useNavigate()

  const [service, setService] = useState<Omit<AdditionalService, "id">>({ name: "", price: 0 })

  useEffect(() => {
    if (existingService) {
      setService({
        name: existingService.name,
        price: existingService.price
      })
    }
  }, [existingService])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!service.name || service.price <= 0) {
      alert("Пожалуйста, заполните все поля корректно.")
      return
    }

    try {
      if (existingService) {
        await context?.updateService({ id: existingService.id, ...service })
      } else {
        await context?.addService(service)
      }
      navigate("/services")
    } catch (error) {
      alert("Ошибка при сохранении услуги.")
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {existingService ? "Редактировать услугу" : "Добавить новую услугу"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Название услуги"
            value={service.name}
            InputProps={{ sx: { background: "#fffafa", },}}
            required
            onChange={(e) => setService({ ...service, name: e.target.value })}
          />
          <TextField
            label="Цена"
            type="number"
            value={service.price}
            required
            InputProps={{ sx: { background: "#fffafa", },}}
            inputProps={{ min: 0 }}
            onChange={(e) => setService({ ...service, price: parseFloat(e.target.value) })}
          />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" type="submit">
              {existingService ? "Сохранить" : "Добавить"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/services")}>
              Назад
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default AdditionalServiceForm
