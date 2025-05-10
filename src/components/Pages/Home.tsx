import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useTheme,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Hotel, EmojiPeople, LocationOn } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {user, isAdmin} = useAuth();
  
  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 8 } }}>
      {/* Hero section */}
      <Box
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          minHeight: 500,
          backgroundImage: "url('/images/hotel-exterior3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Темный оверлей поверх изображения */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 1,
          }}
        />
        <Fade in timeout={1000}>
          <Container
            maxWidth="md"
            sx={{
              textAlign: "center",
              zIndex: 2,
              position: "relative",
              py: { xs: 6, md: 8 },
              color: "white",
            }}
          >
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
              Добро пожаловать в нашу гостиницу
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, maxWidth: 600, mx: "auto", color: "rgba(255,255,255,0.9)" }}
            >
              Уют, комфорт и высокий уровень сервиса в самом сердце города.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="center"
              spacing={2}
            >
              <Button
                onClick={() => {
                  if (!user)
                    alert("Необходимо выполнить вход!");
                  else
                    navigate("/userProfile")}}
                variant="contained"
                size="large"
              >
                Забронировать сейчас
              </Button>
              <Button
                onClick={() => navigate("/ourRooms")}
                variant="outlined"
                color="inherit"
                size="large"
              >
                Просмотреть номера
              </Button>
            </Stack>
          </Container>
        </Fade>
      </Box>

      {/* Features section */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        sx={{ mt: 8 }}
        alignItems="stretch"
      >
        {[
          {
            icon: <Hotel sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            title: "Комфортабельные номера",
            text: "Просторные и уютные номера с современными удобствами.",
            img: "/images/roomExample2.jpg",
          },
          {
            icon: <EmojiPeople sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            title: "Высокий уровень сервиса",
            text: "Внимательный персонал и круглосуточная поддержка гостей.",
            img: "/images/staff.jpg",
          },
          {
            icon: <LocationOn sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            title: "Удобное расположение",
            text: "Мы находимся в шаговой доступности от главных достопримечательностей.",
            img: "/images/location.jpg",
          },
        ].map((feature, idx) => (
          <Box
            key={idx}
            sx={{
              flex: 1,
              borderRadius: 3,
              boxShadow: 3,
              overflow: "hidden",
              backgroundColor: "background.paper",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              component="img"
              src={feature.img}
              alt={feature.title}
              sx={{
                height: 400,
                width: "100%",
                objectFit: "cover",
              }}
            />
            <Box sx={{ p: 3, flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                {feature.icon}
                <Typography variant="h6" fontWeight={600}>
                  {feature.title}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {feature.text}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Home;
