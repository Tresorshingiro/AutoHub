import axios from "axios";
import { createContext, useState } from "react";
import toast from "react-hot-toast";

export const ReceptionContext = createContext()

const ReceptionContextProvider = (props) => {
    const [vehicles, setVehicles] = useState([])
    const [dashData, setDashData] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getDashData = async() => {
        try{
            const token = localStorage.getItem('receptionToken')
            const {data} = await axios.get(backendUrl + '/api/reception/dashboard', {
                headers: { 
                    'rtoken': token
                }
            })
            if(data.success){
                setDashData(data.dashData)
            } else{
                toast.error(data.message)
            }
        } catch(error){
            console.error('Dashboard error:', error)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getAllVehicles = async() => {
        try{
            const token = localStorage.getItem('receptionToken')
            const {data} = await axios.get(backendUrl + '/api/reception/vehicles', {
                headers: { 
                    'rtoken': token
                }
            })
            if(data.success){
                setVehicles(data.vehicles)
            } else{
                toast.error(data.message)
            }
        }catch(error){
            console.error('Get vehicles error:', error)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const value = {
        vehicles,
        setVehicles,
        dashData,
        getDashData,
        getAllVehicles
    }

    return (
        <ReceptionContext.Provider value={value}>
            {props.children}
        </ReceptionContext.Provider>
    )
}

export default ReceptionContextProvider