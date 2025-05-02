import { Typography, Button } from "@mui/material"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const AdminPanel = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleGoToUserManagement = () => {
    navigate("/users")
  }
  const handleGoToRoomTypesManagement = () => {
    navigate("/roomTypes")
  }
  const handleGoToRoomManagement = () => {
    navigate("/rooms")
  }
  const handleGoToServices = () => {
    navigate("/services")
  }

  const handleGoToReservations = () => {
    navigate("/adminReservations")
  }


  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Панель администратора
      </Typography>
      <Typography gutterBottom>
        Добро пожаловать, {user?.userName}!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoToUserManagement}
        sx={{ display: 'block', mt: 2 }}
      >
        Перейти к управлению пользователями
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoToRoomTypesManagement}
        sx={{ display: 'block', mt: 2 }}
      >
        Перейти к управлению типами комнат
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoToRoomManagement}
        sx={{ display: 'block', mt: 2 }}
      >
        Перейти к управлению комнатами
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoToServices}
        sx={{ display: 'block', mt: 2 }}
      >
        Перейти к управлению доп. услугами
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoToReservations}
        sx={{ display: 'block', mt: 2 }}
      >
        Перейти к управлению бронированиями
      </Button>
    </div>
  )
}

export default AdminPanel
