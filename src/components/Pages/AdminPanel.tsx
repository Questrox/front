import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  useTheme,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const adminSections = [
  {
    title: "Пользователи",
    description: "Добавление, редактирование и удаление пользователей",
    icon: <PeopleIcon fontSize="large" color="primary" />,
    action: "/users",
  },
  {
    title: "Типы комнат",
    description: "Управление списком типов комнат",
    icon: <RoomPreferencesIcon fontSize="large" color="primary" />,
    action: "/roomTypes",
  },
  {
    title: "Комнаты",
    description: "Создание и редактирование комнат гостиницы",
    icon: <MeetingRoomIcon fontSize="large" color="primary" />,
    action: "/rooms",
  },
  {
    title: "Доп. услуги",
    description: "Управление списком дополнительных услуг",
    icon: <MiscellaneousServicesIcon fontSize="large" color="primary" />,
    action: "/services",
  },
  {
    title: "Бронирования",
    description: "Подтверждение бронирований и оказание дополнительных услуг",
    icon: <AssignmentIcon fontSize="large" color="primary" />,
    action: "/adminReservations",
  },
];

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box maxWidth="lg" mx="auto" mt={6} px={2}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: 700, letterSpacing: 1 }}
      >
        Панель администратора
      </Typography>
      <Typography
        gutterBottom
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Добро пожаловать, {user?.userName}!
      </Typography>

      <Stack
        direction="row"
        flexWrap="wrap"
        gap={3}
        justifyContent="center"
      >
        {adminSections.map((section) => (
          <Card
            key={section.title}
            sx={{
              width: { xs: "100%", sm: "45%", md: "30%" },
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(76,175,80,0.08)",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 24px rgba(76,175,80,0.18)",
              },
            }}
          >
            <CardActionArea onClick={() => navigate(section.action)}>
              <CardContent>
                <Stack
                  alignItems="center"
                  spacing={2}
                  sx={{
                    minHeight: 200,
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {section.icon}
                  <Typography variant="h6" fontWeight={600}>
                    {section.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ px: 1 }}
                  >
                    {section.description}
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default AdminPanel;
