import React, { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { UserContext } from "../../context/UserContext"
import UserForm from "./UserForm"
import { User } from "../../models/user"
import {
  Typography,
  Box,
  Button,
  Stack,
  Card,
  CardContent,
} from "@mui/material"

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const context = useContext(UserContext)
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (context) {
      const foundUser = context.users.find((u) => u.id === id)
      setUser(foundUser || null)
    }
  }, [context, id])

  if (!user) {
    return <Typography>Пользователь не найден!</Typography>
  }

  if (isEditing) {
    return <UserForm existingUser={user} />
  }

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Детали пользователя
          </Typography>
          <Typography><strong>ФИО:</strong> {user.fullName}</Typography>
          <Typography><strong>Паспорт:</strong> {user.passport}</Typography>
          <Typography><strong>Скидка:</strong> {user.discount}%</Typography>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="contained" onClick={() => setIsEditing(true)}>
          Редактировать
        </Button>
        <Button variant="outlined" onClick={() => navigate("/users")}>
          Назад
        </Button>
      </Stack>
    </Box>
  )
}

export default UserDetails
