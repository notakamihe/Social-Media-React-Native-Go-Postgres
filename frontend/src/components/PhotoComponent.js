import React, {useEffect, useState} from 'react'
import { View, Text, Dimensions, Image, TouchableOpacity } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import { normalize, timeAgoShort } from '../utils/utils';
import AutoHeightImage from "react-native-auto-height-image";
import { Avatar } from 'react-native-elements';
import { decode } from 'html-entities';
import Popover from 'react-native-popover-view/dist/Popover';
import axios from 'axios';

const PhotoComponent = (props) => {
    const widthPercentage = props.widthPercentage || 0.9
    const [visible, setVisible] = useState(false)

    const [photoUser, setPhotoUser] = useState({})
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])

    useEffect(() => {
        if (props.photo) {
            axios.get(axios.defaults.baseURL + `users/${props.photo.post.userid}`).then(res => {
                setPhotoUser(res.data);
            }).catch(err => {
                console.log(err);
            })
            
            axios.get(axios.defaults.baseURL + `likes`).then(res => {
                setLikes(res.data.filter(l => l.postid == props.photo.post_id));
            })

            axios.get(axios.defaults.baseURL + `comments`).then(res => {
                setComments(res.data.filter(l => l.postid == props.photo.post_id));
            })
        }
    }, [])

    const deletePhoto = () => {
        axios.delete(axios.defaults.baseURL + `posts/${props.photo.post_id}`).then(res => {
            console.log(res.data);
            props.getPosts()
            setVisible(false)
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <TouchableOpacity
            style={{marginVertical: normalize(16), alignItems: "center"}} 
            onPress={() => props.navigation.navigate("PhotoDetail", {photo: props.photo})}
        >
            <Image 
                source={{uri: props.photo ? axios.defaults.baseURL + props.photo.fileurl : ""}}
                resizeMode="cover"
                style={{
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: "#000",
                    width: Dimensions.get("window").width * widthPercentage,
                    height: (Dimensions.get("window").width * widthPercentage) * 9 / 16
                }}
            />
            <Text 
                style={{fontWeight: "bold", marginTop: normalize(8), fontSize: normalize(16)}} 
                numberOfLines={1}
            >
                {props.photo ? props.photo.title : ""}
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
                        {photoUser.username} {decode("&#183") + " "} 
                        {props.photo ? timeAgoShort(props.photo.post.createdon) : ""}
                    </Text>
                </View>
            }
            <View 
                style={{
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "center",
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
                                props.navigation.navigate("EditPhoto", {photo: props.photo})
                            }}
                        >
                            <Text>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{marginVertical: normalize(8)}}
                            onPress={() => deletePhoto()}
                        >
                            <Text>Delete</Text>
                        </TouchableOpacity>
                    </Popover> : null
                }
            </View>
        </TouchableOpacity>
    )
}

export default PhotoComponent
