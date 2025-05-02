import React, { useContext } from "react"
import { UserContext } from "../../context/UserContext"
import { Link, useNavigate } from "react-router-dom"
import {
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Box,
} from "@mui/material"

const UserList: React.FC = () => {
  const context = useContext(UserContext)
  const navigate = useNavigate()

  if (!context) return <Typography>No context available!</Typography>

  const { users, deleteUser } = context

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Пользователи
      </Typography>

      <Button variant="contained" color="primary" onClick={() => navigate("/users/add")}>
        Добавить нового пользователя
      </Button>

      <Stack spacing={2} mt={3}>
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent>
              <Typography variant="h6">{user.fullName}</Typography>
              <Button
                component={Link}
                to={`/users/${user.id}`}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                Детали
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteUser(user.id)}
              >
                Удалить
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Button sx={{ mt: 4 }} onClick={() => navigate("/adminPanel")}>
        Назад
      </Button>
    </Box>
  )
}

export default UserList
