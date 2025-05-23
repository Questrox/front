import { useContext } from "react"
import { AdditionalServiceContext } from "../../context/AdditionalServiceContext"
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"

const AdditionalServiceList: React.FC = () => {
  const context = useContext(AdditionalServiceContext)
  const navigate = useNavigate()

  if (!context) return <Typography>No context available!</Typography>

  const { services, deleteService } = context

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom align="center">
        Дополнительные услуги
      </Typography>

      <Stack spacing={2} mt={3}>
        {services.map(service => (
          <Card key={service.id}>
            <CardContent>
              <Typography variant="h6">{service.name}</Typography>
              <Button
                component={Link}
                to={`/services/${service.id}`}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                Детали
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteService(service.id)}
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
        <Button variant="contained" color="primary" onClick={() => navigate("/services/add")}>
        Добавить новую услугу
      </Button>
      </Stack>
    </Box>
  )
}

export default AdditionalServiceList
