import { createContext, ReactNode, useEffect, useState } from "react"
import { AdditionalService } from "../models/additionalService"
import AdditionalServiceService from "../services/AdditionalServiceService"

interface AdditionalServiceContextProps {
  services: AdditionalService[]
  addService: (service: Omit<AdditionalService, "id">) => void
  updateService: (service: AdditionalService) => void
  deleteService: (id: number) => void
}

export const AdditionalServiceContext = createContext<AdditionalServiceContextProps | undefined>(undefined)

export const AdditionalServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<AdditionalService[]>([])

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const data = await AdditionalServiceService.getServices()
      setServices(data || [])
    } catch (error) {
      console.error("Ошибка при загрузке услуг:", error)
    }
  }

  const addService = async (service: Omit<AdditionalService, "id">) => {
    try {
      const created = await AdditionalServiceService.createService(service)
      setServices(prev => [...prev, created])
    } catch (error) {
      console.error("Ошибка при добавлении услуги:", error)
    }
  }

  const updateService = async (updatedService: AdditionalService) => {
    try {
      const newService = await AdditionalServiceService.updateService(updatedService)
      setServices(prev => prev.map(service => service.id === newService.id ? newService : service))
    } catch (error) {
      console.error("Ошибка при обновлении услуги:", error)
      alert("Ошибка при обновлении услуги: " + error)
    }
  }

  const deleteService = async (id: number) => {
    try {
      await AdditionalServiceService.deleteService(id)
      setServices(prev => prev.filter(service => service.id !== id))
    } catch (error) {
      console.error("Ошибка при удалении услуги:", error)
    }
  }

  return (
    <AdditionalServiceContext.Provider value={{ services, addService, updateService, deleteService }}>
      {children}
    </AdditionalServiceContext.Provider>
  )
}
