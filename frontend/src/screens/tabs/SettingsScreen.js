import React, { useContext } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { UserContext } from '../../context/UserContext'
import { normalize } from '../../utils/utils'

const SettingsScreen = (props) => {
    const {user, setUser} = useContext(UserContext)

    return (
        <SafeAreaView>
            <ScrollView>
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
                            {
                            user ?

                            <TouchableOpacity
                                style={{
                                    marginVertical: normalize(8),
                                    borderColor: "#000",
                                    borderWidth: 2,
                                    padding: normalize(12),
                                    borderRadius: 10
                                }}
                                disabled={!user}
                            >
                                <Text 
                                    style={{
                                        textTransform: "uppercase", 
                                        fontWeight: "bold",
                                        fontSize: normalize(16)
                                    }}
                                    onPress={() => props.navigation.dangerouslyGetParent().navigate("EditProfile")}
                                >
                                    Edit Profile
                                </Text>
                            </TouchableOpacity> : null
                            }
                            {
                            user ?

                            <TouchableOpacity
                                style={{
                                    marginVertical: normalize(8),
                                    borderColor: "#000",
                                    borderWidth: 2,
                                    padding: normalize(12),
                                    borderRadius: 10
                                }}
                                disabled={!user}
                                onPress={() => props.navigation.dangerouslyGetParent().navigate("ChangePassword")}
                            >
                                <Text 
                                    style={{
                                        textTransform: "uppercase", 
                                        fontWeight: "bold",
                                        fontSize: normalize(16)
                                    }}
                                >
                                    Change Password
                                </Text>
                            </TouchableOpacity> : null
                            }
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
                                        fontWeight: "bold",
                                        fontSize: normalize(16)
                                    }}
                                >
                                   {user ? "Log out" : "Log in"}
                                </Text>
                            </TouchableOpacity>
                            {
                            user ?

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
                                        color: "#f00",
                                        fontSize: normalize(16)
                                    }}
                                >
                                    Delete profile
                                </Text>
                            </TouchableOpacity> : null
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SettingsScreen