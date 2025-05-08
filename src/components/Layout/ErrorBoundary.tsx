import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minHeight="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="#e6ebe6"
        >
          <Paper elevation={3} sx={{ p: 5, borderRadius: 2, textAlign: "center", color: "#c7d9ca" }}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Что-то пошло не так
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу.
            </Typography>
            <Button variant="contained" color="primary" onClick={this.handleReload}>
              Обновить страницу
            </Button>
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              Ошибка: {this.state.error?.message}
            </Typography>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
