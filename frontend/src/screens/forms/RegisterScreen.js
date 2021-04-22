import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { normalize } from 'react-native-elements'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { TextInputMask } from 'react-native-masked-text'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from "react-native-vector-icons/FontAwesome5"
import Ionicons from "react-native-vector-icons/Ionicons"
import { FormError } from "./../../components";
import axios from "axios"
import { flag } from 'country-emoji'
import { UserContext } from '../../context/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = (props) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [dob, setDob] = useState("")
    const [country, setCountry] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState("")
    const {user, setUser} = useContext(UserContext)

    const errorRef = useRef()

    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity 
                    style={{marginLeft: normalize(16)}}
                    onPress={() => props.navigation.navigate("Start")}
                >
                    <Ionicons name="arrow-back-sharp" size={normalize(25)} />
                </TouchableOpacity>
            )
        })

        if (user)
            props.navigation.navigate("Tabs")
    }, [])

    const register = () => {
        setError("")

        if (new Date().getFullYear() - new Date(dob).getFullYear() <= 13) {
            setError("Age must be at least 13.")
            errorRef.current.scrollToEnd({animated: true})
            return
        }

        if (password != confirmPassword) {
            setError("Passwords must match.")
            errorRef.current.scrollToEnd({animated: true})
            return
        }

        if (flag(country) == undefined) {
            setError("Invalid country code.")
            errorRef.current.scrollToEnd({animated: true})
            return
        }

        axios.post(axios.defaults.baseURL + "signup", {
            username,
            email,
            password,
            dob,
            country,
            description
        }).then(res => {
            AsyncStorage.setItem("token", res.data)
            
            axios.get(axios.defaults.baseURL + "user", {
                headers: {
                    "Authorization": res.data
                }
            }).then(r => {
                setUser(r.data)
                props.navigation.navigate("Tabs")
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            setError(err.response.data)
            errorRef.current.scrollToEnd({animated: true})
        })
    }

    return (
        <SafeAreaView>
            <ScrollView ref={errorRef}>
                <View style={{alignItems: "center"}}>
                    <View style={{alignItems: "center", marginVertical: normalize(32), width: "100%"}}>
                        <TextInput 
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                marginVertical: normalize(6),
                                width: "90%",
                                padding: normalize(8),
                                borderRadius: 10,
                                paddingLeft: normalize(16),
                                color: "#000",
                                fontSize: normalize(16)
                            }}
                            placeholder="Username"
                            placeholderTextColor="#0004"
                            onChangeText={text => setUsername(text)}
                            value={username}
                        />
                        <TextInput 
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                marginVertical: normalize(6),
                                width: "90%",
                                padding: normalize(8),
                                borderRadius: 10,
                                paddingLeft: normalize(16),
                                color: "#000",
                                fontSize: normalize(16)
                            }}
                            placeholder="Email"
                            placeholderTextColor="#0004"
                            onChangeText={text => setEmail(text)}
                            value={email}
                        />
                        <TextInput 
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                marginVertical: normalize(6),
                                padding: normalize(8),
                                borderRadius: 10,
                                width: "90%",
                                paddingLeft: normalize(16),
                                color: "#000",
                                fontSize: normalize(16)
                            }}
                            placeholder="Password"
                            placeholderTextColor="#0004"
                            secureTextEntry
                            onChangeText={text => setPassword(text)}
                            value={password}
                        />
                        <TextInput 
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                marginVertical: normalize(6),
                                padding: normalize(8),
                                borderRadius: 10,
                                width: "90%",
                                paddingLeft: normalize(16),
                                color: "#000",
                                fontSize: normalize(16)
                            }}
                            placeholder="Confirm password"
                            placeholderTextColor="#0004"
                            secureTextEntry
                            onChangeText={text => setConfirmPassword(text)}
                            value={confirmPassword}
                        />
                        <View style={{flexDirection: "row", marginVertical: normalize(4), width: "90%"}}>
                            <TextInputMask 
                                style={{
                                    borderColor: "#000",
                                    borderWidth: 2,
                                    marginHorizontal: normalize(6),
                                    flex: 0.6,
                                    padding: normalize(8),
                                    borderRadius: 10,
                                    justifyContent: "center",
                                    paddingLeft: normalize(16),
                                    color: "#000",
                                    fontSize: normalize(16)
                                }}
                                type="datetime"
                                options={{
                                    format: 'YYYY-MM-DD'
                                }}
                                value={dob}
                                onChangeText={text => setDob(text)}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#0004"
                            />
                            <TextInput 
                                style={{
                                    borderColor: "#000",
                                    borderWidth: 2,
                                    marginHorizontal: normalize(6),
                                    flex: 0.4,
                                    padding: normalize(8),
                                    borderRadius: 10,
                                    textAlign: "center",
                                    color: "#000",
                                    fontSize: normalize(16)
                                }}
                                maxLength={2}
                                placeholder="XX"
                                placeholderTextColor="#0004"
                                onChangeText={text => setCountry(text.toUpperCase())}
                                value={country}
                            />
                        </View>
                        <TextInput 
                            multiline
                            placeholder="Description"
                            placeholderTextColor="#0004"
                            style={{
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: "#000",
                                marginVertical: normalize(6),
                                width: "90%",
                                padding: normalize(8),
                                paddingLeft: normalize(16),
                                color: "#000",
                                fontSize: normalize(16)
                            }}
                            onChangeText={text => setDescription(text)}
                            value={description}
                        />
                        <TouchableOpacity 
                            style={{
                                marginTop: normalize(32),
                                borderColor: "#000",
                                borderWidth: 2,
                                padding: normalize(8),
                                borderRadius: 10
                            }}
                            onPress={() => register()}
                        >
                            <Text
                                style={{
                                    textTransform: "uppercase",
                                    fontWeight: "bold",
                                    fontSize: normalize(18)
                                }}
                            >
                                Sign up
                            </Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: normalize(16), flexDirection: "row" }}>
                            <TouchableOpacity>
                                <Icon 
                                    name="google" 
                                    color="black" 
                                    size={normalize(30)} 
                                    style={{ marginHorizontal: normalize(8) }} 
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon 
                                    name="facebook" 
                                    color="black" 
                                    size={normalize(30)} 
                                    style={{ marginHorizontal: normalize(8) }} 
                                />
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Icon 
                                    name="github" 
                                    color="black" 
                                    size={normalize(30)} 
                                    style={{ marginHorizontal: normalize(8) }} 
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{marginLeft: normalize(8)}}
                                onPress={() => props.navigation.navigate("Login")}
                            >
                                <Ionicons name="log-in-outline" size={normalize(30)} />
                            </TouchableOpacity>
                        </View>
                        <FormError msg={error} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RegisterScreen
