import React, { useState, useContext, useEffect } from "react"
import { UserContext } from "../../context/UserContext"
import { useNavigate } from "react-router-dom"
import { User } from "../../models/user"
import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material"

interface UserFormProps {
  existingUser?: User
}

const UserForm: React.FC<UserFormProps> = ({ existingUser }) => {
  const context = useContext(UserContext)
  const navigate = useNavigate()

  const [user, setUser] = useState<Omit<User, "id">>({
    fullName: existingUser?.fullName || "",
    passport: existingUser?.passport || "",
  })

  useEffect(() => {
    if (existingUser) {
      setUser({
        fullName: existingUser.fullName,
        passport: existingUser.passport,
      })
    }
  }, [existingUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user.fullName.trim() || !user.passport.trim()) {
      alert("Пожалуйста, заполните все поля.")
      return
    }

    try {
      if (existingUser) {
        await context?.updateUser({ id: existingUser.id, ...user })
      } else {
        await context?.addUser(user)
      }
      navigate("/users")
    } catch (error) {
      alert("Ошибка при сохранении пользователя.")
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom align="center">
        {existingUser ? "Редактировать пользователя" : "Добавить нового пользователя"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="ФИО"
            value={user.fullName}
            required
            InputProps={{ sx: { background: "#fffafa", } }}
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
          />
          <TextField
            label="Паспортные данные"
            value={user.passport}
            required
            InputProps={{ sx: { background: "#fffafa", } }}
            multiline
            onChange={(e) => setUser({ ...user, passport: e.target.value })}
          />

          <Stack direction="row" spacing={2}>
            <Button variant="contained" type="submit">
              {existingUser ? "Сохранить" : "Добавить"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/users")}>
              Назад
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default UserForm
