import React, { useState, useEffect } from "react";
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = React.createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(undefined)

    useEffect(() =>  {
        getUserByToken()
    }, [])

    const getUserByToken = async () => {
        const token = await AsyncStorage.getItem("token")

        axios.get(axios.defaults.baseURL + "user", {
            headers: {
                'Authorization': token
            }
        }).then(res => {
            setUser(res.data)
        }).catch(err => {
            setUser(null)
        })
    }

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
            {children}
        </UserContext.Provider>
    );
};