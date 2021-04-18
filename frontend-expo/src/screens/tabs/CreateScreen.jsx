import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { normalize } from '../../utils/utils'

const CreateScreen = (props) => {
    const navigateToCreatePage = (name) => {
        props.navigation.dangerouslyGetParent().navigate(name)
    }

    return (
        <View style={{flex:1}}>
            <TouchableOpacity 
                style={{
                    flex: 1, 
                    alignItems: "center", 
                    justifyContent: "center",
                    backgroundColor: "#000"
                }}
                onPress={() => navigateToCreatePage("CreateVideo")}
            >
                <Text style={{color: "#fff", fontWeight: "bold", fontSize: normalize(20)}}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{
                    flex: 1, 
                    alignItems: "center", 
                    justifyContent: "center",
                    backgroundColor: "#444"
                }}
                onPress={() => navigateToCreatePage("CreatePhoto")}
            >
                <Text style={{color: "#fff", fontWeight: "bold", fontSize: normalize(20)}}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{
                    flex: 1, 
                    alignItems: "center", 
                    justifyContent: "center",
                    backgroundColor: "#888"
                }}
                onPress={() => navigateToCreatePage("CreateStatement")}
            >
                <Text  style={{color: "#fff", fontWeight: "bold", fontSize: normalize(20)}}>Statement</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{
                    flex: 1, 
                    alignItems: "center", 
                    justifyContent: "center",
                    backgroundColor: "#bbb"
                }}
                onPress={() => navigateToCreatePage("CreatePoll")}
            >
                <Text style={{color: "#fff", fontWeight: "bold", fontSize: normalize(20)}}>Poll</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CreateScreen