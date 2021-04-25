import React, {useContext, useEffect, useState} from 'react'
import { View, Text, Dimensions, Image, TouchableOpacity } from 'react-native'
import { normalize, timeAgoShort } from '../utils/utils'
import Ionicons from "react-native-vector-icons/Ionicons";
import { Avatar } from 'react-native-elements';
import {decode} from "html-entities";
import Popover from 'react-native-popover-view/dist/Popover';
import axios from 'axios';

const StatementComponent = (props) => {
    const [visible, setVisible] = useState(false)

    const [statementUser, setStatementUser] = useState({})
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])

    useEffect(() => {
        if (props.statement) {
            axios.get(axios.defaults.baseURL + `users/${props.statement.post.userid}`).then(res => {
                setStatementUser(res.data);
            }).catch(err => {
                console.log(err);
            })

            axios.get(axios.defaults.baseURL + `likes`).then(res => {
                setLikes(res.data.filter(l => l.postid == props.statement.post_id));
            })

            axios.get(axios.defaults.baseURL + `comments`).then(res => {
                setComments(res.data.filter(l => l.postid == props.statement.post_id));
            })
        }
    }, [])

    const deleteStatement = () => {
        axios.delete(axios.defaults.baseURL + `posts/${props.statement.post_id}`).then(res => {
            console.log(res.data);
            props.getPosts()
            setVisible(false)
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <TouchableOpacity 
            style={{
                marginVertical: normalize(16), 
                width: "100%",
                alignItems: "center"
            }}
            onPress={() => props.navigation.navigate("StatementDetail", {
                statement: props.statement
            })}
        >
            <Text 
                style={{
                    padding: normalize(15),
                    borderColor: "#000", 
                    borderWidth: 1, 
                    borderBottomWidth: 6,
                    borderRightWidth: 6,
                    borderRadius: 5,
                    fontSize: normalize(16),
                    textAlign: "center",
                    fontStyle: "italic"
                }}
                numberOfLines={8}
            >
            {props.statement ? props.statement.content : null}
            </Text>
            {
                props.hideUser ? null :
                
                <View 
                    style={{
                        flexDirection: "row", 
                        marginVertical: props.showOptions ? 0 : normalize(4),
                        marginTop: normalize(8)
                    }}
                >
                    <Avatar size={normalize(20)} rounded source={require("./../../assets/images/defaultpfp.png")} />
                    <Text style={{marginLeft: 16, fontSize: normalize(16)}}>
                        {statementUser.username} {decode("&#183") + " "} 
                        {props.statement ? timeAgoShort(props.statement.post.createdon) : ""}
                    </Text>
                </View>
            }
            <View 
                style={{
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginVertical: props.hideUser ? normalize(8) : 0
                }}
            >
                <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: 6}}>
                    <Ionicons name="eye-outline" size={normalize(18)} color="#000"/>
                    <Text 
                        style={{
                            marginLeft: normalize(4), 
                            fontWeight: "bold", 
                            color: "#000",
                            fontSize: normalize(16)
                        }}
                    >
                        700K
                    </Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: 6}}>
                    <Ionicons name="thumbs-up-outline" size={normalize(18)} color="#000"/>
                    <Text 
                        style={{
                            marginLeft: normalize(4), 
                            fontWeight: "bold", 
                            color: "#000",
                            fontSize: normalize(16)
                        }}
                    >
                        {likes.length}
                    </Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: 6}}>
                    <Ionicons name="chatbox-outline" size={normalize(18)} color="#000"/>
                    <Text 
                        style={{
                            marginLeft: normalize(4), 
                            fontWeight: "bold", 
                            color: "#000",
                            fontSize: normalize(16)
                        }}
                    >
                        {comments.length}
                    </Text>
                </View>
                {
                    props.showOptions ?
                
                    <Popover
                        from={(
                            <TouchableOpacity 
                                style={{flexDirection: "row", alignItems: "center", marginHorizontal: 6, padding: normalize(4)}}
                                onPress={() => setVisible(true)}
                            >
                                <Ionicons name="ellipsis-horizontal-outline" size={normalize(18)} color="#000"/>
                            </TouchableOpacity>
                        )}
                        popoverStyle={{
                            paddingHorizontal: normalize(16),
                            paddingVertical: normalize(8)
                        }}
                        verticalOffset={normalize(-15)}
                        arrowStyle={{
                            backgroundColor: "#0000"
                        }}
                        isVisible={visible}
                        onRequestClose={() => setVisible(false)}
                    >
                        
                        <TouchableOpacity 
                            style={{marginVertical: normalize(8)}} 
                            onPress={() => { 
                                setVisible(false)
                                props.navigation.navigate("EditStatement", {
                                    statement: props.statement
                                })
                            }}
                        >
                            <Text>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{marginVertical: normalize(8)}}
                            onPress={() => deleteStatement()}
                        >
                            <Text>Delete</Text>
                        </TouchableOpacity>
                    </Popover> : null
                }
            </View>
        </TouchableOpacity>
    )
}

export default StatementComponent
