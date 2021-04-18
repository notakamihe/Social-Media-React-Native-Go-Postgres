import React, { useEffect, useRef, useState } from 'react'
import { View, Text } from 'react-native'
import { Avatar } from 'react-native-elements'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormError from '../../../components/FormError'
import { normalize } from '../../../utils/utils'

const CreateComment = (props) => {
    const [content, setContent] = useState("")
    const [error, setError] = useState("")

    const errorRef = useRef()

    useEffect(() => {
        if (error)
            errorRef.current.scrollToEnd({animated: true})
    }, [error])

    const createComment = () => {
        console.log(content);
        setError("This is an error")
        //props.navigation.goBack()
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView ref={errorRef} style={{marginTop: normalize(-16)}}>
                <View style={{alignItems: "center", paddingVertical: normalize(16)}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Avatar 
                            source={require("./../../../../assets/images/defaultpfp.png")}
                            rounded
                        />
                        <Text style={{marginLeft: normalize(16)}}>johndoeisgreat</Text>
                    </View>
                    <Text 
                        style={{
                            marginVertical: normalize(24), 
                            fontWeight: "bold", 
                            fontSize: normalize(20),
                            textAlign: "center"
                        }}
                    >
                        This will be the placeholder of this video.
                    </Text>
                    <TextInput 
                        multiline
                        style={{
                            borderRadius: 10,
                            borderColor: "#000",
                            borderWidth: 2,
                            width: "90%",
                            padding: normalize(16),
                            textAlignVertical: "top"
                        }}
                        numberOfLines={10}
                        value={content}
                        onChangeText={v => setContent(v)}
                    />
                    <TouchableOpacity 
                        style={{
                            marginTop: normalize(32), 
                            borderWidth: 2, 
                            borderColor: "#000",
                            padding: normalize(8),
                            borderRadius: normalize(10)
                        }}
                        onPress={() => createComment()}
                    >
                        <Text 
                            style={{
                                textTransform: "uppercase", 
                                fontWeight: "bold",
                                fontSize: normalize(20)
                            }}
                        >
                            Add
                        </Text>
                    </TouchableOpacity>
                    <FormError msg={error} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CreateComment
