import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { AdminReservationContext } from "../context/AdminReservationsContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminReservationDetailsPage from "../components/Pages/AdminReservationDetailsPage";
import { Reservation } from "../models/reservation";

const mockReservation: Reservation = {
  id: 1,
  arrivalDate: "2025-05-01",
  departureDate: "2025-05-05",
  livingPrice: 10000,
  servicesPrice: 2000,
  fullPrice: 12000,
  roomID: 1,
  userID: "id",
  room: {
        id: 1,
        number: 101,
        roomTypeID: 1,
        roomType: {
          id: 1,
          guestCapacity: 2,
          price: 100,
          description: "Описание",
          roomCategoryID: 1,
          rooms: [],
          roomCategory: { id: 1, category: "Стандарт" }
        }
      },
  reservationStatusID: 1,
  reservationStatus: { id: 1, status: "Ожидание" },
  serviceStrings: [
    {
      id: 101,
      count: 2,
      deliveredCount: 0,
      price: 1000,
      serviceStatusID: 1,
      serviceStatus: { id: 1, status: "Ожидание" },
      additionalServiceID: 1,
      additionalService: { id: 1, price: 1000, name: "Одноразовое питание" },
      reservationID: 1
    }
  ]
};

//Бронирования со статусами 2, 3 и 4
const mockReservationPaid = {
  ...mockReservation,
  reservationStatusID: 2,
  reservationStatus: { id: 2, status: "Оплачено проживание" },
};

const mockReservationFinished = {
  ...mockReservation,
  reservationStatusID: 3,
  reservationStatus: { id: 3, status: "Оплачено полностью" },
};

const mockReservationCancelled = {
  ...mockReservation,
  reservationStatusID: 4,
  reservationStatus: { id: 4, status: "Отменено" },
};


const mockContext = {
  getReservationById: jest.fn().mockResolvedValue(mockReservation),
  deliverService: jest.fn().mockResolvedValue({}),
  confirmLivingPayment: jest.fn().mockResolvedValue({ ...mockReservation, reservationStatusID: 2 }),
  confirmServicesPayment: jest.fn().mockResolvedValue({ ...mockReservation, reservationStatusID: 3 }),
};

function renderWithRouter(id = "1") {
  return render(
    <AdminReservationContext.Provider value={mockContext as any}>
      <MemoryRouter initialEntries={[`/admin/reservation/${id}`]}>
        <Routes>
          <Route path="/admin/reservation/:id" element={<AdminReservationDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </AdminReservationContext.Provider>
  );
}

describe("AdminReservationDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockContext.getReservationById as jest.Mock).mockResolvedValue(mockReservation);
  });

  test("загружает и отображает данные бронирования", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Детали бронирования")).toBeInTheDocument();
    });

    // Проверяем, что дата отображается где-то на странице
    expect(screen.getByText("01.05.2025")).toBeInTheDocument();
    expect(screen.getByText("10000₽")).toBeInTheDocument();
    const chips = screen.getAllByText(/Ожидание/);
    expect(chips[0]).toBeInTheDocument();

    expect(screen.getByText(/Одноразовое питание/)).toBeInTheDocument();

  });

  test("отображается кнопка 'Подтвердить оплату проживания, если статус = 1'", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Подтвердить оплату проживания")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Подтвердить оплату проживания"));

    await waitFor(() => {
      expect(mockContext.confirmLivingPayment).toHaveBeenCalled();
    });
  });

  test("отображается кнопка 'Подтвердить оплату дополнительных услуг', если статус = 2", async () => {
    (mockContext.getReservationById as jest.Mock).mockResolvedValueOnce(mockReservationPaid);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Подтвердить оплату дополнительных услуг")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Подтвердить оплату дополнительных услуг"));

    await waitFor(() => {
      expect(mockContext.confirmServicesPayment).toHaveBeenCalled();
    });
  });

  test("не отображаются управляющие кнопки при статусе 3 (Оплачено полностью)", async () => {
    (mockContext.getReservationById as jest.Mock).mockResolvedValueOnce(mockReservationFinished);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Детали бронирования")).toBeInTheDocument();
    });

    // Проверяем, что нет ни одной управляющей кнопки
    expect(screen.queryByText(/Подтвердить оплату проживания/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Подтвердить оплату дополнительных услуг/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Оказать/i)).not.toBeInTheDocument();
  });

  test("не отображаются управляющие кнопки при статусе 4 (Отменено)", async () => {
    (mockContext.getReservationById as jest.Mock).mockResolvedValueOnce(mockReservationCancelled);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Детали бронирования")).toBeInTheDocument();
    });

    expect(screen.queryByText(/Подтвердить оплату проживания/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Подтвердить оплату дополнительных услуг/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Оказать/i)).not.toBeInTheDocument();
  });


  test("можно ввести количество и подтвердить оказание услуги", async () => {
    (mockContext.getReservationById as jest.Mock).mockResolvedValueOnce(mockReservationPaid);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByLabelText("Количество")).toBeInTheDocument();
    });

    const input = screen.getByLabelText("Количество") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "2" } });
    expect(input.value).toBe("2");

    fireEvent.click(screen.getByText("Оказать"));

    await waitFor(() => {
      expect(mockContext.deliverService).toHaveBeenCalledWith(101, 2);
    });
  });


  test("не вызывает deliverService, если введено 0 услуг", async () => {
    (mockContext.getReservationById as jest.Mock).mockResolvedValueOnce(mockReservationPaid);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByLabelText("Количество")).toBeInTheDocument();
    });

    const input = screen.getByLabelText("Количество") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "0" } });

    fireEvent.click(screen.getByText("Оказать"));

    await waitFor(() => {
      expect(mockContext.deliverService).not.toHaveBeenCalled();
    });
  });

  test("не показывается стандартный интерфейс при отсутствии бронирования", async () => {
    (mockContext.getReservationById as jest.Mock).mockResolvedValueOnce(null);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.queryByText("Детали бронирования")).not.toBeInTheDocument();
    });
  });
});
