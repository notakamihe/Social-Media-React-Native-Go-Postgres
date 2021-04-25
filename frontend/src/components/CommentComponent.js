import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar'
import Ionicons from "react-native-vector-icons/Ionicons"
import { decode } from 'html-entities';
import { normalize } from '../utils/utils'
import moment from 'moment';
import axios from 'axios';

const CommentComponent = (props) => {
    const [commentUser, setCommentUser] = useState({})

    useEffect(() => {
        axios.get(axios.defaults.baseURL + `users/${props.comment.userid}`).then(res => {
            setCommentUser(res.data)
        }).catch(err => {
            console.log(err);
        })
    }, [])

    const deleteComment = () => {
        axios.delete(axios.defaults.baseURL + `comments/${props.comment.postid}/${props.comment.userid}`).then(res => {
            console.log(res.data);
            props.getComments()
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <View 
            style={{
                flexDirection: "row",
                borderColor: "#000",
                borderWidth: 1,
                width: "90%",
                borderRadius: 5,
                padding: 8,
                marginVertical: normalize(8)
            }}
        >
            <View style={{alignItems: "center"}}>
                <Avatar
                    source={require("./../../assets/images/defaultpfp.png")}
                    rounded
                />
                {
                    props.readOnly ?

                    <View style={{flexDirection: "row", marginTop: "auto"}}>
                        <TouchableOpacity 
                            onPress={() => props.navigation.navigate("EditComment", {
                                comment: props.comment,
                                post: props.post,
                                user: props.user
                            })}
                        >
                            <Ionicons name="create-outline" size={normalize(20)} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteComment()}>
                            <Ionicons name="trash-outline" size={normalize(20)} />
                        </TouchableOpacity>
                    </View> : null
                }
            </View>
            <View style={{marginLeft: 16, flexShrink: 1}}>
                <Text style={{fontSize: normalize(14), fontWeight: "bold"}}>
                    {commentUser.username} {decode("&#183")} {moment(props.comment.commented).format("M.D.YYYY")}
                </Text>
                <Text 
                    style={{
                        backgroundColor: "#00000015", 
                        padding: normalize(8),
                        borderRadius: normalize(5),
                        marginTop: normalize(8),
                        flexShrink: 1,
                        fontSize: normalize(16),
                        alignSelf: "flex-start"
                    }}
                >
                    {props.comment.content}
                </Text>
            </View>
        </View>
    )
}

export default CommentComponent
