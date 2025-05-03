import React, { useState } from "react"
import { Box } from "@mui/material"
import ReservationModal from "./ReservationModal"
import { useNavigate } from "react-router-dom"

const ReservationPage: React.FC = () => {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  return (
    <Box>
      <ReservationModal open={open} onClose={() => {setOpen(false); navigate("/userProfile")}} />
    </Box>
  )
}

export default ReservationPage
