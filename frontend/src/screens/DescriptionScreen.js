import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Avatar, normalize } from 'react-native-elements'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from "react-native-vector-icons/Ionicons"

const DescriptionScreen = (props) => {
    const [user, setUser] = useState({})

    useState(() => {
        setUser(props.route.params.user)
        
        props.navigation.setOptions({
            title: `Description of ${props.route.params.user.username}`
        })
    }, [])

    return (
        <SafeAreaView>
            <ScrollView>
                <View 
                    style={{
                        marginTop: normalize(32), 
                        marginBottom: normalize(64), 
                        alignItems: "center",
                        paddingHorizontal: normalize(16)
                    }}
                >
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Avatar 
                            source={require("./../../assets/images/defaultpfp.png")}
                            rounded
                            size={normalize(32)}
                        />
                        <Text style={{marginLeft: normalize(16), fontSize: normalize(16)}}>{user.username}</Text>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", marginVertical: normalize(16)}}>
                        <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(4)}}>
                            <Ionicons name="people-outline" size={normalize(16)}/>
                            <Text 
                                style={{marginLeft: normalize(4), fontWeight: "bold", fontSize: normalize(16)}}
                            >
                                146K
                            </Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(4)}}>
                            <Ionicons name="arrow-forward-outline" size={normalize(16)}/>
                            <Text 
                                style={{marginLeft: normalize(4), fontWeight: "bold", fontSize: normalize(16)}}
                            >
                                132K
                            </Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(4)}}>
                            <Ionicons name="eye-outline" size={normalize(16)}/>
                            <Text 
                                style={{marginLeft: normalize(4), fontWeight: "bold", fontSize: normalize(16)}}
                            >
                                3M</
                            Text>
                        </View>
                    </View>
                    <Text style={{textAlign: "center", fontSize: normalize(16), color: "#000c"}}>
                        {user.description}
                    </Text>
                    <TouchableOpacity
                        style={{
                            marginTop: normalize(32),
                            borderColor: "#000",
                            borderWidth: 2,
                            padding: normalize(8),
                            borderRadius: 10
                        }}
                        onPress={() => props.navigation.goBack()}
                    >
                        <Text 
                            style={{textTransform: "uppercase", fontWeight: "bold", fontSize: normalize(18)}}
                        >
                            Back
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DescriptionScreen
