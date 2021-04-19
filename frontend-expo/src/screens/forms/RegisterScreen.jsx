import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { normalize } from 'react-native-elements'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { TextInputMask } from 'react-native-masked-text'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from "react-native-vector-icons/FontAwesome5"
import Ionicons from "react-native-vector-icons/Ionicons"
import FormError from '../../components/FormError'

const RegisterScreen = (props) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [dob, setDob] = useState("")
    const [country, setCountry] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState("")

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
    }, [])

    const register = () => {
        setError("")
        console.log(username, email, password, confirmPassword, dob, country, description);
        setError("This is an error")

        if (error)
            errorRef.current.scrollToEnd({animated: true})
    }

    return (
        <SafeAreaView>
            <ScrollView ref={errorRef} style={{marginTop: normalize(-16)}}>
                <View style={{alignItems: "center"}}>
                    <View style={{alignItems: "center", marginVertical: normalize(32), width: "100%"}}>
                        <TextInput 
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                marginVertical: normalize(4),
                                width: "90%",
                                padding: normalize(8),
                                borderRadius: 10,
                                paddingLeft: normalize(16)
                            }}
                            placeholder="Username"
                            onChangeText={text => setUsername(text)}
                            value={username}
                        />
                        <TextInput 
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                marginVertical: normalize(4),
                                width: "90%",
                                padding: normalize(8),
                                borderRadius: 10,
                                paddingLeft: normalize(16)
                            }}
                            placeholder="Email"
                            onChangeText={text => setEmail(text)}
                            value={email}
                        />
                        <TextInput 
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                marginVertical: normalize(4),
                                padding: normalize(8),
                                borderRadius: 10,
                                width: "90%",
                                paddingLeft: normalize(16)
                            }}
                            placeholder="Password"
                            onChangeText={text => setPassword(text)}
                            value={password}
                        />
                        <TextInput 
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                marginVertical: normalize(4),
                                padding: normalize(8),
                                borderRadius: 10,
                                width: "90%",
                                paddingLeft: normalize(16)
                            }}
                            placeholder="Confirm password"
                            onChangeText={text => setConfirmPassword(text)}
                            value={confirmPassword}
                        />
                        <View style={{flexDirection: "row", marginVertical: normalize(4), width: "90%"}}>
                            <TextInputMask 
                                style={{
                                    borderColor: "#000",
                                    borderWidth: 2,
                                    marginHorizontal: normalize(4),
                                    flex: 0.6,
                                    padding: normalize(8),
                                    borderRadius: 10,
                                    justifyContent: "center",
                                    paddingLeft: normalize(16)
                                }}
                                type="datetime"
                                options={{
                                    format: 'YYYY-MM-DD'
                                }}
                                value={dob}
                                onChangeText={text => setDob(text)}
                                placeholder="YYYY-MM-DD"
                            />
                            <TextInput 
                                style={{
                                    borderColor: "#000",
                                    borderWidth: 2,
                                    marginHorizontal: normalize(4),
                                    flex: 0.4,
                                    padding: normalize(8),
                                    borderRadius: 10,
                                    textAlign: "center"
                                }}
                                maxLength={2}
                                placeholder="XX"
                                onChangeText={text => setCountry(text)}
                                value={country}
                            />
                        </View>
                        <TextInput 
                            multiline
                            placeholder="Description"
                            style={{
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: "#000",
                                marginVertical: normalize(4),
                                width: "90%",
                                padding: normalize(8),
                                paddingLeft: normalize(16)
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
