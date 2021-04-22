import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext';
import { View, Text, Dimensions, Image, Modal } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalize } from '../../utils/utils';

const ActivityScreen = () => {
    const {user, setUser} = useContext(UserContext)

    return (
        user ? 

        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={{paddingHorizontal: 16}}>
                <View style={{alignItems: "center", paddingVertical: normalize(48)}}>
                    <Text 
                        style={{
                            marginVertical: normalize(32), 
                            fontWeight: "bold", 
                            fontSize: normalize(20)
                        }}
                    >
                        Recent activity
                    </Text>
                    <View>
                        <View style={{backgroundColor: "#00000015", padding: 16, borderRadius: 15, marginVertical: normalize(16)}}>
                            <Text style={{fontWeight: "bold", fontSize: normalize(14)}}>December 31, 2019</Text>
                            <Text style={{fontSize: normalize(16)}}>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur.
                            </Text>
                        </View>
                        <View style={{backgroundColor: "#00000015", padding: 16, borderRadius: 15, marginVertical: normalize(16)}}>
                            <Text style={{fontWeight: "bold", fontSize: normalize(14)}}>December 31, 2019</Text>
                            <Text style={{fontSize: normalize(16)}}>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur.
                            </Text>
                        </View>
                        <View style={{backgroundColor: "#00000015", padding: 16, borderRadius: 15, marginVertical: normalize(16)}}>
                            <Text style={{fontWeight: "bold", fontSize: normalize(14)}}>December 31, 2019</Text>
                            <Text style={{fontSize: normalize(16)}}>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur.
                            </Text>
                        </View>
                        <View style={{backgroundColor: "#00000015", padding: 16, borderRadius: 15, marginVertical: normalize(16)}}>
                            <Text style={{fontWeight: "bold", fontSize: normalize(14)}}>December 31, 2019</Text>
                            <Text style={{fontSize: normalize(16)}}>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur.
                            </Text>
                        </View>
                        <View style={{backgroundColor: "#00000015", padding: 16, borderRadius: 15, marginVertical: normalize(16)}}>
                            <Text style={{fontWeight: "bold", fontSize: normalize(14)}}>December 31, 2019</Text>
                            <Text style={{fontSize: normalize(16)}}>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur.
                            </Text>
                        </View>
                        <View style={{backgroundColor: "#00000015", padding: 16, borderRadius: 15, marginVertical: normalize(16)}}>
                            <Text style={{fontWeight: "bold", fontSize: normalize(14)}}>December 31, 2019</Text>
                            <Text style={{fontSize: normalize(16)}}>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView> :
        <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
            <Text style={{fontSize: normalize(20), color: "#0009"}}>
                To view your activity,{" "}
                <Text 
                    style={{fontWeight: "bold"}} 
                    onPress={() => props.navigation.dangerouslyGetParent().navigate("Register")}
                >
                    sign in
                </Text>
            </Text>
        </View>
    )
}

export default ActivityScreen