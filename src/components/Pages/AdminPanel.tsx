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
    </div>
  )
}

export default AdminPanel
