import { Typography } from "@mui/material"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Домашняя страница
      </Typography>
      <Typography>
        Добро пожаловать в нашу гостиницу! Выберите элемент меню для начала работы
      </Typography>
      <Link to="/page1">Просмотреть информацию о номерах</Link>
    </>
  )
}

export default Home
