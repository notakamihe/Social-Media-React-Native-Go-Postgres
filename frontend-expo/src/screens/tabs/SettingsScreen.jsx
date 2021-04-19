import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { normalize } from '../../utils/utils'

const SettingsScreen = (props) => {
    return (
        <SafeAreaView>
            <ScrollView style={{marginTop: normalize(-16)}}>
                <View style={{marginVertical: normalize(64)}}>
                    <View style={{alignItems: "center"}}>
                        <Text
                            style={{
                                textAlign: "center",
                                textTransform: "uppercase",
                                fontSize: normalize(20),
                                letterSpacing: normalize(5),
                                fontWeight: "bold",
                                color: "#000a",
                                marginBottom: normalize(16)
                            }}
                        >
                            Profile
                        </Text>
                        <View style={{alignItems: "center"}}>
                            <TouchableOpacity
                                style={{
                                    marginVertical: normalize(8),
                                    borderColor: "#000",
                                    borderWidth: 2,
                                    padding: normalize(12),
                                    borderRadius: 10
                                }}
                            >
                                <Text 
                                    style={{
                                        textTransform: "uppercase", 
                                        fontWeight: "bold"
                                    }}
                                    onPress={() => props.navigation.dangerouslyGetParent().navigate("EditProfile")}
                                >
                                    Edit Profile
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    marginVertical: normalize(8),
                                    borderColor: "#000",
                                    borderWidth: 2,
                                    padding: normalize(12),
                                    borderRadius: 10
                                }}
                                onPress={() => props.navigation.dangerouslyGetParent().navigate("ChangePassword")}
                            >
                                <Text 
                                    style={{
                                        textTransform: "uppercase", 
                                        fontWeight: "bold"
                                    }}
                                >
                                    Change Password
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    marginVertical: normalize(8),
                                    borderColor: "#000",
                                    borderWidth: 2,
                                    padding: normalize(12),
                                    borderRadius: 10
                                }}
                                onPress={() => props.navigation.dangerouslyGetParent().navigate("Login")}
                            >
                                <Text 
                                    style={{
                                        textTransform: "uppercase", 
                                        fontWeight: "bold"
                                    }}
                                >
                                    Log out
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    marginVertical: normalize(8),
                                    borderColor: "#f00",
                                    borderWidth: 2,
                                    padding: normalize(12),
                                    borderRadius: 10,
                                }}
                            >
                                <Text 
                                    style={{
                                        textTransform: "uppercase", 
                                        fontWeight: "bold",
                                        color: "#f00"
                                    }}
                                >
                                    Delete profile
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SettingsScreen