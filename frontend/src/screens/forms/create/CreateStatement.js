import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormError from '../../../components/FormError'
import { normalize } from '../../../utils/utils'
import {UserContext} from "./../../../context/UserContext";

const CreateStatement = (props) => {
    const [content, setContent] = useState("")
    const [error, setError] = useState("")
    const {user, setUser} = useContext(UserContext)

    const errorRef = useRef()

    useEffect(() => {
        if (!user)
            props.navigation.navigate("HomeDrawer")
    }, [])

    const createStatement = () => {
        axios.post(axios.defaults.baseURL + "statements", {
            userid: user.id,
            content: content
        }).then(res => {
            axios.get(axios.defaults.baseURL + `posts/${res.data.postid}`).then(r => {
                console.log(r.data);
                props.navigation.navigate("StatementDetail", {statement: r.data})
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            setError(err.response.data);
            errorRef.current.scrollToEnd({animated: true})
        })
    }

    const openPicker = async (mediaType) => {
    }

    return (
        <SafeAreaView>
            <ScrollView ref={errorRef}>
                <View style={{flex: 1, alignItems: "center", paddingVertical : normalize(24)}}>
                    <TextInput
                        style={{
                            borderColor: "#000",
                            borderWidth: 1.5,
                            marginVertical: normalize(24),
                            width: "95%",
                            borderRadius: 5,
                            padding: normalize(16),
                            textAlignVertical: "top",
                            fontSize: normalize(16)
                        }}
                        placeholder="Max characters: 300"
                        multiline
                        onChangeText={v => setContent(v)}
                        value={content}
                        maxLength={300}
                        numberOfLines={8}
                    />
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", width: "80%"}}>
                        <TouchableOpacity 
                            style={{
                                marginLeft: normalize(16),
                                borderRadius: 10,
                                borderColor: "#000",
                                borderWidth: 2,
                                padding: normalize(12)
                            }}
                            onPress={() => createStatement()}
                        >
                            <Text 
                                style={{textTransform: "uppercase", fontWeight: "bold", fontSize: normalize(18)}}
                            >
                                Post
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <FormError msg={error} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CreateStatement
