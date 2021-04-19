import React from 'react'
import { View, Text } from 'react-native'
import { Avatar, normalize } from 'react-native-elements'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from "react-native-vector-icons/Ionicons"

const DescriptionScreen = (props) => {
    return (
        <SafeAreaView>
            <ScrollView style={{marginTop: normalize(-16)}}>
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
                        />
                        <Text style={{marginLeft: normalize(16)}}>johndoeisgreat</Text>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", marginVertical: normalize(16)}}>
                        <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(4)}}>
                            <Ionicons name="people-outline" size={normalize(15)}/>
                            <Text style={{marginLeft: normalize(4), fontWeight: "bold"}}>146K</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(4)}}>
                            <Ionicons name="arrow-forward-outline" size={normalize(15)}/>
                            <Text style={{marginLeft: normalize(4), fontWeight: "bold"}}>132K</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(4)}}>
                            <Ionicons name="eye-outline" size={normalize(15)}/>
                            <Text style={{marginLeft: normalize(4), fontWeight: "bold"}}>3M</Text>
                        </View>
                    </View>
                    <Text style={{textAlign: "center", fontSize: normalize(16), color: "#000c"}}>
                        Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique 
                        curabitur ullamcorper sem iaculis enim taciti praesent elementum sapien posuere bibendum faucibus 
                        sagittis. Id facilisis dapibus vulputate condimentum parturient nulla sociosqu odio dui ad a a 
                        pharetra eu augue molestie sodales euismod condimentum dignissim himenaeos adipiscing a sem 
                        adipiscing. A porta parturient id parturient nunc ad suspendisse faucibus odio facilisi vitae turpis 
                        dis justo quis primis a dictum bibendum nascetur a at a vestibulum maecenas volutpat ut gravida. 
                        Parturient vestibulum elit congue penatibus quis lectus himenaeos torquent justo a ac suspendisse 
                        commodo pulvinar inceptos a a maecenas a blandit amet quam sagittis dis. 
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
                        <Text style={{textTransform: "uppercase", fontWeight: "bold"}}>Back</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DescriptionScreen
