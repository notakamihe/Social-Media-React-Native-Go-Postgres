import React, {useRef} from 'react'
import { View, Text, Dimensions, Image, Modal, Picker } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalize } from '../../utils/utils';

const ActivityScreen = () => {
    const dropdowmRef = useRef(null)

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={{paddingHorizontal: 16}}>
                <View style={{alignItems: "center", paddingVertical: normalize(48), paddingBottom: normalize(96)}}>
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
                            <Text>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur.
                            </Text>
                        </View>
                        <View style={{backgroundColor: "#00000015", padding: 16, borderRadius: 15, marginVertical: normalize(16)}}>
                            <Text style={{fontWeight: "bold", fontSize: normalize(14)}}>December 31, 2019</Text>
                            <Text>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur.
                            </Text>
                        </View>
                        <View style={{backgroundColor: "#00000015", padding: 16, borderRadius: 15, marginVertical: normalize(16)}}>
                            <Text style={{fontWeight: "bold", fontSize: normalize(14)}}>December 31, 2019</Text>
                            <Text>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur.
                            </Text>
                        </View>
                        <View style={{backgroundColor: "#00000015", padding: 16, borderRadius: 15, marginVertical: normalize(16)}}>
                            <Text style={{fontWeight: "bold", fontSize: normalize(14)}}>December 31, 2019</Text>
                            <Text>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur.
                            </Text>
                        </View>
                        <View style={{backgroundColor: "#00000015", padding: 16, borderRadius: 15, marginVertical: normalize(16)}}>
                            <Text style={{fontWeight: "bold", fontSize: normalize(14)}}>December 31, 2019</Text>
                            <Text>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur.
                            </Text>
                        </View>
                        <View style={{backgroundColor: "#00000015", padding: 16, borderRadius: 15, marginVertical: normalize(16)}}>
                            <Text style={{fontWeight: "bold", fontSize: normalize(14)}}>December 31, 2019</Text>
                            <Text>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ActivityScreen