import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { normalize } from 'react-native-elements'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { TextInputMask } from 'react-native-masked-text'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from "react-native-vector-icons/FontAwesome5"
import Ionicons from "react-native-vector-icons/Ionicons"
import FormError from '../../components/FormError'

const LoginScreen = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
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
        console.log(username, password);
        setError("This is an error")

        if (error)
            errorRef.current.scrollToEnd({animated: true})
    }

    return (
        <SafeAreaView style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
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
                                padding: normalize(8),
                                borderRadius: 10,
                                width: "90%",
                                paddingLeft: normalize(16)
                            }}
                            placeholder="Password"
                            onChangeText={text => setPassword(text)}
                            value={password}
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
                                Log in
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
                                onPress={() => props.navigation.navigate("Register")}
                            >
                                <Ionicons name="person-add-outline" size={normalize(30)} />
                            </TouchableOpacity>
                        </View>
                        <FormError msg={error} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LoginScreen
