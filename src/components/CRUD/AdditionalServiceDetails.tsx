import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material"
import { AdditionalServiceContext } from "../../context/AdditionalServiceContext"
import { AdditionalService } from "../../models/additionalService"
import AdditionalServiceForm from "./AdditionalServiceForm"

const AdditionalServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const context = useContext(AdditionalServiceContext)
  const navigate = useNavigate()
  const [service, setService] = useState<AdditionalService | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (context && id) {
      const foundService = context.services.find(s => s.id === parseInt(id, 10))
      setService(foundService || null)
    }
  }, [context, id])

  if (!service) {
    return <Typography>Услуга не найдена!</Typography>
  }

  if (isEditing) {
    return <AdditionalServiceForm existingService={service} />
  }

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Детали услуги
          </Typography>
          <Typography><strong>Название:</strong> {service.name}</Typography>
          <Typography><strong>Цена:</strong> {service.price} ₽</Typography>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="contained" onClick={() => setIsEditing(true)}>
          Редактировать
        </Button>
        <Button variant="outlined" onClick={() => navigate("/services")}>
          Назад
        </Button>
      </Stack>
    </Box>
  )
}

export default AdditionalServiceDetails
