import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { normalize } from '../utils/utils'

const StartScreen = (props) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ marginBottom: normalize(96) }}>

            </View>
            <TouchableOpacity
                style={{
                    backgroundColor: "#0003",
                    padding: normalize(16),
                    paddingHorizontal: normalize(24),
                    borderRadius: 15,
                    marginVertical: normalize(64)
                }}
                onPress={() => props.navigation.navigate("Tabs")}
            >
                <Text
                    style={{
                        fontSize: normalize(24),
                        textTransform: "uppercase",
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold"
                    }}
                >
                    Onward
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{
                    backgroundColor: "#000",
                    padding: normalize(8),
                    paddingHorizontal: normalize(24),
                    borderRadius: 30,
                    width: "50%",
                    marginVertical: normalize(8)
                }}
                onPress={() => props.navigation.navigate("Register")}
            >
                <Text 
                    style={{ 
                        fontSize: normalize(20), 
                        textTransform: "uppercase", 
                        color: "#fff", 
                        textAlign: "center" 
                    }}
                >
                    Sign up
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{
                    borderColor: "#000",
                    borderWidth: 2,
                    padding: normalize(8),
                    paddingHorizontal: normalize(24),
                    borderRadius: 30,
                    width: "50%",
                    marginVertical: normalize(8)
                }}
            >
                <Text 
                    style={{ 
                        fontSize: normalize(20), 
                        textTransform: "uppercase", 
                        color: "#000", 
                        textAlign: "center" 
                    }}
                    onPress={() => props.navigation.navigate("Login")}
                >
                    Log in
                </Text>
            </TouchableOpacity>
            <View style={{ marginTop: normalize(32), flexDirection: "row" }}>
                <TouchableOpacity>
                    <Icon name="google" color="black" size={normalize(30)} style={{ marginHorizontal: normalize(8) }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Icon name="facebook" color="black" size={normalize(30)} style={{ marginHorizontal: normalize(8) }} />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Icon name="github" color="black" size={normalize(30)} style={{ marginHorizontal: normalize(8) }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default StartScreen