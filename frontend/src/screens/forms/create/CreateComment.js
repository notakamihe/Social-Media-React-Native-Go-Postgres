import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text } from 'react-native'
import { Avatar } from 'react-native-elements'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormError from '../../../components/FormError'
import { UserContext } from '../../../context/UserContext'
import { normalize } from '../../../utils/utils'

const CreateComment = (props) => {
    const {user, setUser} = useContext(UserContext)

    const [post, setPost] = useState(props.route.params.post)
    const [postUser, setPostUser] = useState(props.route.params.user)
    const [content, setContent] = useState("")
    const [error, setError] = useState("")

    const errorRef = useRef()

    const createComment = () => {
        setError("")

        if (!content) {
            setError("Comment must not be blank.")
            errorRef.current.scrollToEnd({animated: true})
            return
        }

        axios.post(axios.defaults.baseURL + "comments", {
            postid: post.post_id,
            userid: user.id,
            content: content
        }).then(res => {
            console.log(res.data);
            props.navigation.goBack()
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView ref={errorRef}>
                <View style={{alignItems: "center", paddingVertical: normalize(32)}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Avatar 
                            source={require("./../../../../assets/images/defaultpfp.png")}
                            rounded
                            size={normalize(32)}
                        />
                        <Text style={{marginLeft: normalize(16), fontSize: normalize(16)}}>
                            {postUser.username}
                        </Text>
                    </View>
                    <Text 
                        style={{
                            marginVertical: normalize(24), 
                            fontWeight: "bold", 
                            fontSize: normalize(20),
                            textAlign: "center",
                            marginHorizontal: normalize(16)
                        }}
                        numberOfLines={3}
                    >
                        {post.post.category == "statement" ? post.content : post.title}
                    </Text>
                    <TextInput 
                        multiline
                        style={{
                            borderRadius: 10,
                            borderColor: "#000",
                            borderWidth: 2,
                            width: "90%",
                            padding: normalize(16),
                            textAlignVertical: "top",
                            color: "#000",
                            fontSize: normalize(16)
                        }}
                        numberOfLines={10}
                        value={content}
                        onChangeText={v => setContent(v)}
                        placeholderTextColor="#0004"
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
                                fontSize: normalize(18)
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
