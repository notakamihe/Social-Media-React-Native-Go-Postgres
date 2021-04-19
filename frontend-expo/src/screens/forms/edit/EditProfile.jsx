import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Avatar, normalize } from 'react-native-elements'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { TextInputMask } from 'react-native-masked-text'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormError from '../../../components/FormError'

const EditProfile = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [dob, setDob] = useState("2000-01-01")
    const [country, setCountry] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState("")

    const errorRef = useRef()

    useEffect(() => {
        setUsername("johndoeisgreat")
        setEmail("johndoe@email.com")
        setCountry("US")
        setDescription(`Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et 
        tristique curabitur ullamcorper sem iaculis enim taciti praesent elementum sapien posuere 
        bibendum faucibus sagittis. Id facilisis dapibus vulputate condimentum parturient nulla 
        sociosqu odio dui ad a a pharetra eu augue molestie sodales euismod condimentum dignissim 
        himenaeos adipiscing a sem adipiscing. A porta parturient id parturient nunc ad 
        suspendisse faucibus odio facilisi vitae turpis dis justo quis primis a dictum bibendum 
        nascetur a at a vestibulum maecenas volutpat ut gravida. Parturient vestibulum elit 
        congue penatibus quis lectus himenaeos torquent justo a ac suspendisse commodo pulvinar 
        inceptos a a maecenas a blandit amet quam sagittis dis. `)
    })

    const saveChanges = () => {
        setError("")
        console.log(username, email, dob, country, description);
        setError("Error while updating user data")
        errorRef.current.scrollToEnd({animated: true})
    }

    return (
        <SafeAreaView>
            <ScrollView ref={errorRef} style={{marginTop: normalize(-16)}}>
                <View style={{alignItems: "center", marginVertical: normalize(32)}}>
                    <TouchableOpacity>
                        <Avatar 
                            source={require("./../../../../assets/images/defaultpfp.png")}
                            rounded
                            size={normalize(70)}
                        />
                    </TouchableOpacity>
                    <View style={{width: "90%", marginVertical: normalize(16)}}>
                        <Text
                            style={{
                                textTransform: "uppercase",
                                marginBottom: normalize(6),
                                fontWeight: "bold",
                                letterSpacing: normalize(3),
                                fontSize: normalize(12)
                            }}
                        >
                            Username
                        </Text>
                        <TextInput 
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                padding: normalize(8),
                                borderRadius: 10,
                                paddingLeft: normalize(16)
                            }}
                            onChangeText={text => setUsername(text)}
                            value={username}
                        />
                    </View>
                    <View style={{width: "90%", marginVertical: normalize(16)}}>
                        <Text
                            style={{
                                textTransform: "uppercase",
                                marginBottom: normalize(6),
                                fontWeight: "bold",
                                letterSpacing: normalize(3),
                                fontSize: normalize(12)
                            }}
                        >
                            Email
                        </Text>
                        <TextInput 
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                padding: normalize(8),
                                borderRadius: 10,
                                paddingLeft: normalize(16)
                            }}
                            onChangeText={text => setEmail(text)}
                            value={email}
                        />
                    </View>
                    <View style={{flexDirection: "row", marginVertical: normalize(16)}}>
                        <TextInputMask
                            onChangeText={text => setDob(text)}
                            value={dob}
                            type="datetime"
                            options={{
                                format: "YYYY-MM-DD"
                            }}
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                flex: 0.5,
                                padding: normalize(8),
                                borderRadius: 10,
                                paddingLeft: normalize(16)
                            }}
                        />
                        <TextInput 
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                flex: 0.3,
                                borderRadius: 10,
                                padding: normalize(8),
                                marginLeft: normalize(16),
                                textAlign: "center"
                            }}
                            placeholder="XX"
                            maxLength={2}
                            onChangeText={text => setCountry(text)}
                            value={country}
                        />
                    </View>
                    <View style={{width: "90%"}}>
                        <Text
                            style={{
                                textTransform: "uppercase",
                                marginBottom: normalize(0),
                                fontWeight: "bold",
                                letterSpacing: normalize(3),
                                fontSize: normalize(12)
                            }}
                        >
                            Description
                        </Text>
                        <TextInput 
                            multiline 
                            style={{
                                borderColor: "#000",
                                borderWidth: 2,
                                borderRadius: 10,
                                padding: normalize(16),
                                marginVertical: normalize(16),
                                textAlignVertical: "top"
                            }}
                            numberOfLines={8}
                            onChangeText={text => setDescription(text)}
                            value={description}
                        />
                    </View>
                    <TouchableOpacity
                        style={{
                            borderColor: "#000",
                            borderWidth: 2, 
                            padding: normalize(8),
                            borderRadius: 10
                        }}
                        onPress={() => saveChanges()}
                    >
                        <Text style={{fontWeight: "bold", textTransform: "uppercase"}}>Save</Text>
                    </TouchableOpacity>
                    <FormError msg={error} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditProfile
