import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, Image, Touchable, TouchableOpacity } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import { normalize, timeAgoShort } from '../utils/utils';
import { decode } from 'html-entities';
import { Avatar } from 'react-native-elements';
import Popover from 'react-native-popover-view';
import Video from "react-native-video"
import axios from 'axios';

const VideoComponent = (props) => {
    const widthPercentage = props.widthPercentage || 0.9

    const [visible, setVisible] = useState(false)
    const [videoUser, setVideoUser] = useState({})
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])

    useEffect(() => {
        if (props.video) {
            axios.get(axios.defaults.baseURL + `users/${props.video.post.userid}`).then(res => {
                setVideoUser(res.data);
            }).catch(err => {
                console.log(err);
            })

            axios.get(axios.defaults.baseURL + `likes`).then(res => {
                setLikes(res.data.filter(l => l.postid == props.video.post_id));
            })

            axios.get(axios.defaults.baseURL + `comments`).then(res => {
                setComments(res.data.filter(l => l.postid == props.video.post_id));
            })
        }
    }, [])

    const deleteVideo = () => {
        axios.delete(axios.defaults.baseURL + `posts/${props.video.post_id}`).then(res => {
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
                alignItems: "center",
                marginVertical: normalize(16)
            }}
            onPress={() => props.navigation.navigate("VideoDetail", {
                video: props.video
            })}
        >
            {
                props.video && props.video.thumbnailurl ? 

                <Image
                    source={{
                        uri: props.video ? axios.defaults.baseURL + props.video.thumbnailurl : ""
                    }} 
                    resizeMode="cover"
                    style={{
                        width: Dimensions.get("window").width * widthPercentage, 
                        height: ( Dimensions.get("window").width * widthPercentage) * 9 / 16,
                        borderRadius: 5,
                        borderWidth: 2,
                        borderColor: "#000"
                    }}
                /> :
                <Video 
                    source={{
                        uri: props.video ? axios.defaults.baseURL + props.video.fileurl : ""
                    }} 
                    resizeMode="cover"
                    style={{
                        width: Dimensions.get("window").width * widthPercentage, 
                        height: ( Dimensions.get("window").width * widthPercentage) * 9 / 16,
                        borderRadius: 5,
                        borderWidth: 2
                    }}
                    muted
                    
                />
            }
            <Text 
                style={{fontWeight: "bold", marginTop: normalize(8), fontSize: normalize(16)}} 
                numberOfLines={1}
            >
                {props.video ? props.video.title : ""}
            </Text>
            {
            props.hideUser ? null :

                <View 
                    style={{
                        flexDirection: "row", 
                        marginVertical: props.showOptions ? 0 : normalize(4),
                        marginTop: normalize(4)
                    }}
                >
                    <Avatar size={normalize(20)} rounded source={require("./../../assets/images/defaultpfp.png")} />
                    <Text style={{marginLeft: 16, fontSize: normalize(16)}}>
                        {videoUser.username} {decode("&#183") + " "} 
                        {props.video ? timeAgoShort(props.video.post.createdon) : ""}
                    </Text>
                </View>
            }
            <View 
                style={{
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "center"
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
                        {props.video.views}
                    </Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: 6}}>
                    <Ionicons name="heart-outline" size={normalize(18)} color="#000"/>
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
                                <Ionicons name="ellipsis-horizontal-outline" size={18} color="#000"/>
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
                                props.navigation.navigate("EditVideo", {
                                    video: props.video
                                })
                            }}
                        >
                            <Text>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{marginVertical: normalize(8)}}
                            onPress={() => deleteVideo()}
                        >
                            <Text>Delete</Text>
                        </TouchableOpacity>
                    </Popover> : null
                }
            </View>
        </TouchableOpacity>
    )
}

export default VideoComponent
