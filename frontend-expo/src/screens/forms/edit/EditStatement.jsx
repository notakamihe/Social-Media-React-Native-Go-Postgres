import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { CheckBox } from 'react-native-elements'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormError from '../../../components/FormError'
import { normalize } from '../../../utils/utils'

const EditStatement = () => {
    const [content, setContent] = useState("")
    const [error, setError] = useState("")

    const errorRef = useRef()

    useEffect(() => {
        setContent("Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur ullamcorper sem iaculis enim taciti praesent elementum sapien posuere bibendum faucibus sagittis. Id facilisis dapibus vulputate condimentum parturient nulla sociosqu odio dui ad a a pharetra eu augue molestie sodales euismod condimentum dignissim himenaeos adipiscing a sem adipiscing. A porta parturient id parturient nunc ad suspendisse faucibus odio facilisi vitae turpis dis justo quis primis a dictum bibendum nascetur a at a vestibulum maecenas volutpat ut gravida. Parturient vestibulum elit congue penatibus quis lectus himenaeos torquent justo a ac suspendisse commodo pulvinar inceptos a a maecenas a blandit amet quam sagittis dis.")
    }, [])

    useEffect(() => {
        if (error)
            errorRef.current.scrollToEnd({animated: true})
    }, [error])

    const editStatement = () => {
        console.log(content)
        setError("this is an error")
    }

    return (
        <SafeAreaView style={{marginTop: normalize(-16)}}>
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
                            textAlignVertical: "top"
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
                            onPress={() => editStatement()}
                        >
                            <Text style={{textTransform: "uppercase", fontWeight: "bold"}}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <FormError msg={error} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditStatement
