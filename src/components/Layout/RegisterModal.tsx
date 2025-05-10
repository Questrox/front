import React, { useState } from "react"
import { Modal, Box, Typography, TextField, Button, Stack, CircularProgress } from "@mui/material"
import { authService } from "../../services/AuthService"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
}

interface RegisterModalProps {
  open: boolean
  onClose: () => void
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onClose }) => {
  const [fullName, setFullName] = useState("")
  const [passport, setPassport] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const {login} = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await authService.register({ fullName, passport, userName, password })
      await login(userName, password)
      onClose()
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={3}>Регистрация</Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="ФИО" value={fullName} onChange={(e) => setFullName(e.target.value)} required fullWidth 
              InputProps={{ sx: { background: "#fffafa", },}}/>
            <TextField label="Паспорт" value={passport} onChange={(e) => setPassport(e.target.value)} required fullWidth 
              InputProps={{ sx: { background: "#fffafa", },}}/>
            <TextField label="Логин" value={userName} onChange={(e) => setUserName(e.target.value)} required fullWidth 
             InputProps={{ sx: { background: "#fffafa", },}}/>
            <TextField label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth
            InputProps={{ sx: { background: "#fffafa", },}} />
            {error && <Typography color="error" sx={{ whiteSpace: 'pre-line' }}>{error}</Typography>}
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || fullName.length === 0 || passport.length === 0 || userName.length === 0 || password.length === 0}
              endIcon={isLoading ? <CircularProgress size={20} /> : null}
              fullWidth
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  )
}

export default RegisterModal
