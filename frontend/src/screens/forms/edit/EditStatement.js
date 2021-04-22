import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormError from '../../../components/FormError'
import { normalize } from '../../../utils/utils'

const EditStatement = (props) => {
    const [statement, setStatement] = useState(props.route.params.statement)
    const [content, setContent] = useState(statement.content || "")
    const [error, setError] = useState("")

    const errorRef = useRef()

    useEffect(() => {
        if (!props.route.params.statement)
            props.navigation.goBack()
    }, [])

    const editStatement = () => {
        setError("")

        axios.put(axios.defaults.baseURL + `statements/${statement.post_id}`, {
            content
        }).then(res => {
            axios.get(axios.defaults.baseURL + `posts/${res.data.postid}`).then(r => {
                props.navigation.navigate("StatementDetail", {statement: r.data})
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            setError(err.response.data)
            errorRef.current.scrollToEnd({animated: true})
        })
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
                            onPress={() => editStatement()}
                        >
                            <Text 
                                style={{
                                    textTransform: "uppercase", 
                                    fontWeight: "bold", 
                                    fontSize: normalize(18)
                                }}
                            >
                                Edit
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <FormError msg={error} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditStatement
