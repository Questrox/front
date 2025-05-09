import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import dayjs from "dayjs"
import { UserProfileContext } from "../context/UserProfileContext"
import { CreateReservationContext } from "../context/CreateReservationContext"
import ReservationModal from "../components/Pages/ReservationModal"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import "dayjs/locale/ru";
import { Add } from "@mui/icons-material"
import userEvent from "@testing-library/user-event"

describe("ReservationModal", () => { 
  let mockGetAvailableRooms: jest.Mock;
  let mockAddReservation: jest.Mock;
  let mockCalculatePrice: jest.Mock;
  let mockRefreshReservations: jest.Mock;
  let contextValue: any;
  let mockUserProfileContext: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAvailableRooms = jest.fn().mockResolvedValue([
      {
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
      }
    ]);
    mockAddReservation = jest.fn();
    mockCalculatePrice = jest.fn().mockResolvedValue(1234);
    mockRefreshReservations = jest.fn();

    contextValue = {
      roomTypes: [
        {
          id: 1,
          guestCapacity: 2,
          price: 100,
          description: "Описание",
          roomCategoryID: 1,
          rooms: [],
          roomCategory: { id: 1, category: "Стандарт" }
        }
      ],
      services: [{ id: 1, name: "Завтрак", price: 500 }],
      addReservation: mockAddReservation,
      getAvailableRooms: mockGetAvailableRooms,
      calculatePrice: mockCalculatePrice,
    };

    mockUserProfileContext = {
      reservations: [],
      updateReservation: jest.fn(),
      services: [],
      addServiceString: jest.fn(),
      updateServiceString: jest.fn(),
      refreshReservations: mockRefreshReservations,
    };
  });

  const renderModal = () =>
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <BrowserRouter>
          <UserProfileContext.Provider value={mockUserProfileContext}>
            <CreateReservationContext.Provider value={contextValue as any}>
              <ReservationModal open={true} onClose={() => {}} />
            </CreateReservationContext.Provider>
          </UserProfileContext.Provider>
        </BrowserRouter>
      </LocalizationProvider>
    );

    
  test("загружается компонент со всеми полями", () => {
    renderModal()
    expect(screen.getByText("Бронирование")).toBeInTheDocument()
  })

  test("кнопка бронирования выключается, когда поля не заполнены", () => {
    renderModal()
    expect(screen.getByRole("button", { name: /забронировать/i })).toBeDisabled()
  })

  test("позволяет добавить доп.услугу", async () => {
    renderModal()

    const addIcons = screen.getAllByTestId("AddIcon")
    expect(addIcons.length).toBeGreaterThan(0)
    fireEvent.click(addIcons[0].closest("button")!)

    const countInput = screen.getByDisplayValue("1")
    expect(countInput).toBeInTheDocument()
  })

  test("создает бронирование", async () => {
    renderModal()

    // Открываем Autocomplete
    const typeInput = screen.getByLabelText("Тип номера")
    await userEvent.click(typeInput)

    // Ждём появления опций
    const options = await screen.findAllByRole('option')

    const typeOption = options.find(option => option.textContent?.includes('2-местный Стандарт'))
    expect(typeOption).toBeDefined()
    await userEvent.click(typeOption!)

    expect(screen.getByDisplayValue(/2-местный Стандарт/i)).toBeInTheDocument()

    await waitFor(() => {
        expect(mockGetAvailableRooms).toHaveBeenCalled();
    });

    // Открываем Autocomplete для номера
    const roomInput = screen.getByLabelText("Номер");

    // Ждём, что поле станет enabled
    await waitFor(() => expect(roomInput).not.toBeDisabled())

    await userEvent.type(roomInput, '101')

    await waitFor(() => {
        expect(screen.getByRole('option', { name: '101' })).toBeInTheDocument()
    })
    const roomOption = screen.getByRole('option', { name: '101' })
    await userEvent.click(roomOption)
    expect(screen.getByDisplayValue('101')).toBeInTheDocument()



    // Проверяем, что выбранное значение появилось в поле
    expect(screen.getByDisplayValue('101')).toBeInTheDocument()

    const button = screen.getByRole("button", { name: /забронировать/i })
    await waitFor(() => expect(button).not.toBeDisabled())

    fireEvent.click(button)

  
    await waitFor(() => {
        expect(mockAddReservation).toHaveBeenCalled()
        expect(mockRefreshReservations).toHaveBeenCalled()
    })
})
})