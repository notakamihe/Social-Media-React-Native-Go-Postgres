import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext';
import { View, Text, TouchableOpacity } from 'react-native'
import { normalize } from '../../utils/utils'

const CreateScreen = (props) => {
    const {user, setUser} = useContext(UserContext)

    const navigateToCreatePage = (name) => {
        props.navigation.dangerouslyGetParent().navigate(name)
    }

    return (
        user ?
        
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
        </View> :
        <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
            <Text style={{fontSize: normalize(20), color: "#0009"}}>
                To post something,{" "}
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

export default CreateScreen