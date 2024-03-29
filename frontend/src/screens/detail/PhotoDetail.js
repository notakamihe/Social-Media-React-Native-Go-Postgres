import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons"
import {Avatar, normalize} from "react-native-elements"
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { decode } from 'html-entities';
import moment from "moment"
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { CommentComponent } from '../../components';

const PhotoDetail = (props) => {
    const {user, setUser} = useContext(UserContext)

    const [photo, setPhoto] = useState(props.route.params.photo)
    const [photoUser, setPhotoUser] = useState({})

    const [showComments, setShowComments] = useState(false)

    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])
    const [isFavorited, setIsFavorited] = useState(true)

    const commentRef = useRef()

    useEffect(() => {
        const navigationRoutes = props.navigation.dangerouslyGetState().routes
        const prevNavigationName = navigationRoutes[navigationRoutes.length - 2]["name"]

        props.navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity 
                    style={{marginLeft: normalize(16)}}
                    onPress={() => prevNavigationName == "CreatePhoto" || prevNavigationName == "EditPhoto" ? 
                        props.navigation.navigate("Tabs") : 
                        props.navigation.goBack()
                    }
                >
                    <Ionicons name="arrow-back-sharp" size={normalize(25)} />
                </TouchableOpacity>
            ),
            title: `${photoUser.username || ""}:  ${photo.title}`
        })
    })

    useEffect(() => {
        props.navigation.addListener("focus", () => {
            axios.get(axios.defaults.baseURL + `users/${photo.post.userid}`).then(res => {
                setPhoto(props.route.params.photo)
                setPhotoUser(res.data)
            }).catch(err => {
                console.log(err);
            })

            getLikes()
            getFavorite()
            getComments()
        })
    }, [props.navigation])

    const deletePhoto = () => {
        axios.delete(axios.defaults.baseURL + `posts/${photo.post_id}`).then(res => {
            console.log(res.data);
            props.navigation.navigate("Tabs")
        }).catch(err => {
            console.log(err);
        })
    }

    const getComments = () => {
        setShowComments(false)

        axios.get(axios.defaults.baseURL + "comments").then(res => {
            let commentsData = res.data.filter(c => c.postid == photo.post_id && c.userid != user.id)
            const userComment = res.data.find(c => c.postid == photo.post_id && c.userid == user.id)

            if (userComment)
                commentsData.unshift(userComment)
                
            setComments(commentsData)
        })
    }
    const getFavorite = () => {
        axios.get(axios.defaults.baseURL + `favorites/${photo.post_id}/${user.id}`).then(res => {
            console.log(res.data);
            setIsFavorited(true)
        }).catch(err => {
            setIsFavorited(false)
        })
    }

    const getLikes = () => {
        axios.get(axios.defaults.baseURL + "likes").then(res => {
            setLikes(res.data ? res.data.filter(l => l.postid == photo.post_id) : []);
        }).catch(err => {
            console.log(err);
        })
    }

    const isCommentedOn = () => {
        return comments.map(c => c.userid).includes(user.id)
    }

    const isLiked = () => {
        return likes.map(l => l.userid).includes(user.id);
    }

    const toggleFavorite = () => {
        if (isFavorited)
            axios.delete(axios.defaults.baseURL + `favorites/${photo.post_id}/${user.id}`).then(res => {
                console.log(res.data);
                getFavorite()
            }).catch(err => {
                console.log(err.response.data);
            })
        else
            axios.post(axios.defaults.baseURL + "favorites", {
                postid: photo.post_id,
                userid: user.id
            }).then(res => {
                console.log(res.data);
                getFavorite()
            }).catch(err => {
                console.log(err);
            })
    }

    const toggleLike = () => {
        if (isLiked())
            axios.delete(axios.defaults.baseURL + `likes/${photo.post_id}/${user.id}`).then(res => {
                console.log(res.data);
                getLikes()
            }).catch(err => {
                console.log(err.response.data);
            })
        else
            axios.post(axios.defaults.baseURL + "likes", {
                postid: photo.post_id,
                userid: user.id
            }).then(res => {
                console.log(res.data);
                getLikes()
            }).catch(err => {
                console.log(err);
            })
    }


    const viewCommentOrCreate = () => {
        if (isCommentedOn()) {
            setShowComments(true)
            commentRef.current.scrollTo({x: 0, y: 0, animated: true})
        } else {
            props.navigation.navigate("CreateComment", {post: photo, user: photoUser})
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 12, borderBottomWidth: 1}}>
                <ScrollView>
                    <View style={{width: "100%", marginVertical: normalize(32)}}>
                        <View style={{width: "100%"}}>
                            <Ionicons 
                                name={photo.private ? "lock-closed" : "lock-open-outline"} 
                                size={normalize(15)} 
                                color="#000"
                                style={{alignSelf: "center", marginBottom: normalize(8)}}
                            />
                            <Text 
                                style={{
                                    fontSize: normalize(18), 
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    marginHorizontal: normalize(16)
                                }}
                            >
                                {photo.title}
                            </Text>
                            <View 
                                style={{
                                    flexDirection: "row", 
                                    width: "100%", 
                                    marginVertical: normalize(16),
                                    paddingHorizontal: normalize(16),
                                    alignItems: "center"
                                }}
                            >
                                <TouchableOpacity 
                                    style={{
                                        flexDirection: "row", 
                                        marginRight: "auto",
                                        flexShrink: 1,
                                        alignItems: "center"
                                    }}
                                    onPress={() => props.navigation.navigate("UserDetail")}
                                >
                                    <Avatar 
                                        size={normalize(30)} 
                                        rounded 
                                        source={require("./../../../assets/images/defaultpfp.png")}
                                    />
                                    <Text 
                                        style={{
                                            flexShrink: 1, 
                                            marginLeft: normalize(8), 
                                            fontSize: normalize(16)
                                        }}
                                    >
                                        {photoUser.username}
                                    </Text>
                                </TouchableOpacity>
                                <Text 
                                    style={{color: "#0007", marginLeft: normalize(16), fontSize: normalize(16)}}
                                >
                                    {moment(photo.post.createdon).format("MMM DD, YYYY")}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <AutoHeightImage
                                source={{uri: axios.defaults.baseURL + photo.fileurl}}
                                resizeMode="contain"
                                width={Dimensions.get("window").width}
                                style={{
                                    borderColor: "#000",
                                    borderRightWidth: 0,
                                    borderLeftWidth: 0,
                                    borderWidth: 2,
                                }}
                            />
                        </View>
                        <View 
                            style={{
                                flexDirection: "row", 
                                marginTop: normalize(8),
                                paddingHorizontal: normalize(16)}}
                            >
                            <View style={{flexDirection: "row", flexGrow: 1}}>
                                <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(6)}}>
                                    <Ionicons name="eye-outline" size={normalize(16)}/>
                                    <Text 
                                        style={{
                                            marginLeft: normalize(4), 
                                            fontWeight: "bold",
                                            fontSize: normalize(16)
                                        }}
                                    >
                                        700K
                                    </Text>
                                </View>
                                <TouchableOpacity 
                                    style={{
                                        flexDirection: "row", 
                                        alignItems: "center", 
                                        marginHorizontal: normalize(6)
                                    }}
                                    onPress={() => toggleLike()}
                                >
                                    <Ionicons name={isLiked() ? "heart" : "heart-outline"} size={normalize(16)}/>
                                    <Text 
                                        style={{
                                            marginLeft: normalize(4), 
                                            fontWeight: "bold",
                                            fontSize: normalize(16)
                                        }}
                                    >
                                        {likes.length}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={{
                                        flexDirection: "row", 
                                        alignItems: "center", 
                                        marginHorizontal: normalize(6)
                                    }}
                                    onPress={() => viewCommentOrCreate()}
                                >
                                    <Ionicons name={isCommentedOn() ? "chatbox" : "chatbox-outline"} size={normalize(16)}/>
                                    <Text 
                                        style={{
                                            marginLeft: normalize(4), 
                                            fontWeight: "bold",
                                            fontSize: normalize(16)
                                        }}
                                    >
                                        {comments.length}
                                    </Text>
                                </TouchableOpacity>
                                <View 
                                    style={{
                                        flexDirection: "row", 
                                        justifyContent: "center", 
                                        marginVertical: normalize(8),
                                        marginLeft: "auto"
                                    }}
                                >
                                    <TouchableOpacity 
                                        onPress={() => props.navigation.navigate("EditPhoto", {
                                            photo: photo
                                        })}
                                    >
                                        <Ionicons 
                                            name="create-outline" 
                                            size={normalize(25)} 
                                            color="#000"
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => deletePhoto()}>
                                        <Ionicons name="trash-outline" size={normalize(25)} color="#000"/>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => toggleFavorite()} 
                                    >
                                        <Ionicons name={isFavorited ? "star" : "star-outline"} size={normalize(25)} color="#000" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={{padding: normalize(16)}}>
                            <Text style={{textAlign: "center", fontSize: normalize(16)}}>
                                {photo.description}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
            {
                comments.length ?

                <View style={{flex: showComments ? 6 : 1}}>
                    {
                        showComments ? null :
                        
                        <TouchableOpacity 
                            style={{justifyContent: "center", alignItems: "center", height: "100%"}}
                            onPress={() => setShowComments(prev => !prev)}
                        >
                            <Text style={{fontWeight: "bold", fontSize: normalize(16)}}>
                                Show {comments.length || ""} comments
                            </Text>
                        </TouchableOpacity>
                    }

                    {
                        showComments ? 
                        <TouchableOpacity 
                            onPress={() => setShowComments(prev => !prev)} 
                            style={{
                                position: "absolute",
                                top: normalize(0),
                                right: normalize(0),
                                zIndex: 300
                            }}
                        >
                            <Ionicons name="close-circle" size={30} color="#0003" />
                        </TouchableOpacity> : null
                    }

                    <ScrollView ref={commentRef}>
                        <View style={{alignItems: "center", paddingVertical: normalize(16)}}>
                            {
                                comments.map((c, idx) => (
                                    <CommentComponent 
                                        key={idx} 
                                        comment={c} 
                                        readOnly={c && c.userid == user.id} 
                                        navigation={props.navigation}
                                        getComments={getComments}
                                        post={photo}
                                        user={photoUser}
                                    />
                                ))
                            }
                        </View>
                    </ScrollView>
                </View> : null
            }
        </SafeAreaView>
        
    )
}

export default PhotoDetail
