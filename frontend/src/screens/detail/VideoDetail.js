import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons"
import {Avatar, normalize} from "react-native-elements"
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { decode } from 'html-entities';
import Video from "react-native-video"
import moment from "moment"
import axios from 'axios';
import { UserContext } from "./../../context/UserContext";
import { CommentComponent } from '../../components';

const VideoDetail = (props) => {
    const {user, setUser} = useContext(UserContext)

    const [video, setVideo] = useState(props.route.params.video || {})
    const [videoUser, setVideoUser] = useState({})
    const [height, setHeight] = useState(Dimensions.get("window").width * 9 / 16)

    const [showThumbnail, setShowThumbnail] = useState(false)
    const [showComments, setShowComments] = useState(false)

    const [views, setViews] = useState(0)
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
                    onPress={() => prevNavigationName == "CreateVideo" || prevNavigationName == "EditVideo" ? 
                        props.navigation.navigate("Tabs") : 
                        props.navigation.goBack()
                    }
                >
                    <Ionicons name="arrow-back-sharp" size={normalize(25)} />
                </TouchableOpacity>
            ),
            title: `${videoUser.username || ""}:  ${video.title}`
        })
    })

    useEffect(() => {
        if (video.post.userid != user.id) {
            axios.put(axios.defaults.baseURL + `videos/${video.post_id}`, {
                title: video.title,
                description: video.description,
                private: video.private,
                views: video.views + 1
            }).then(res => {
                setViews(res.data.views);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [])

    useEffect(() => {
        props.navigation.addListener("focus", () => {
            if (!props.route.params.video)
                props.navigation.goBack()
    
            axios.get(axios.defaults.baseURL + `users/${video.post.userid}`).then(res => {
                setVideo(props.route.params.video)
                setVideoUser(res.data);
            }).catch(err => {
                console.log(err);
            })
    
            getLikes()
            getFavorite()
            getComments()
    
            setShowThumbnail(false)
        })

    }, [props.navigation, props.route.params.video])

    const deleteVideo = () => {
        axios.delete(axios.defaults.baseURL + `posts/${video.post_id}`).then(res => {
            console.log(res);
            props.navigation.navigate("Tabs")
        }).catch(err => {
            console.log(err);
        })
    }

    const getComments = () => {
        setShowComments(false)

        axios.get(axios.defaults.baseURL + "comments").then(res => {
            let commentsData = res.data.filter(c => c.postid == video.post_id && c.userid != user.id)
            const userComment = res.data.find(c => c.postid == video.post_id && c.userid == user.id)

            if (userComment)
                commentsData.unshift(userComment)
                
            setComments(commentsData)
        })
    }

    const getFavorite = () => {
        axios.get(axios.defaults.baseURL + `favorites/${video.post_id}/${user.id}`).then(res => {
            console.log(res.data);
            setIsFavorited(true)
        }).catch(err => {
            setIsFavorited(false)
        })
    }

    const getLikes = () => {
        axios.get(axios.defaults.baseURL + "likes").then(res => {
            setLikes(res.data ? res.data.filter(l => l.postid == video.post_id) : []);
        }).catch(err => {
            console.log(err);
        })
    }

    const toggleFavorite = () => {
        if (isFavorited)
            axios.delete(axios.defaults.baseURL + `favorites/${video.post_id}/${user.id}`).then(res => {
                console.log(res.data);
                getFavorite()
            }).catch(err => {
                console.log(err.response.data);
            })
        else
            axios.post(axios.defaults.baseURL + "favorites", {
                postid: video.post_id,
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
            axios.delete(axios.defaults.baseURL + `likes/${video.post_id}/${user.id}`).then(res => {
                console.log(res.data);
                getLikes()
            }).catch(err => {
                console.log(err.response.data);
            })
        else
            axios.post(axios.defaults.baseURL + "likes", {
                postid: video.post_id,
                userid: user.id
            }).then(res => {
                console.log(res.data);
                getLikes()
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

    const viewCommentOrCreate = () => {
        if (isCommentedOn()) {
            setShowComments(true)
            commentRef.current.scrollTo({x: 0, y: 0, animated: true})
        } else {
            props.navigation.navigate("CreateComment", {post: video, user: videoUser})
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 12, borderBottomWidth: 1}}>
                <ScrollView>
                    <View style={{width: "100%", marginTop: normalize(16)}}>
                        <View style={{width: "100%"}}>
                            <Ionicons 
                                name={video.private ? "lock-closed" : "lock-open-outline"} 
                                size={normalize(15)} 
                                color="#000"
                                style={{alignSelf: "center", marginBottom: normalize(8)}}
                            />
                            <Text 
                                style={{
                                    fontSize: normalize(18), 
                                    fontWeight: "bold", 
                                    marginHorizontal: normalize(16),
                                    textAlign: "center"
                                }}
                            >
                                {video.title}
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
                                        {videoUser.username}
                                    </Text>
                                </TouchableOpacity>
                                <Text style={{color: "#0007", fontSize: normalize(16)}}>
                                    {moment(video.post.createdon).format("MMM DD, YYYY")}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Video 
                                source={{
                                    uri: axios.defaults.baseURL + video.fileurl
                                }}
                                controls
                                resizeMode="contain"
                                style={{
                                    width: Dimensions.get("window").width, 
                                    height: height,
                                    borderWidth: 2,
                                    borderRightWidth: 0,
                                    borderLeftWidth: 0,
                                    display: showThumbnail ? "none" : 'flex'
                                }}
                                onLoad={e => {
                                    const ratio = e.naturalSize.height / e.naturalSize.width
                                    setHeight(Dimensions.get("window").width * ratio)
                                }}
                            />
                            <AutoHeightImage
                                source={{
                                    uri: axios.defaults.baseURL + video.thumbnailurl
                                }}
                                resizeMode="contain"
                                width={Dimensions.get("window").width}
                                style={{
                                    borderColor: "#000",
                                    borderWidth: 2,
                                    borderRightWidth: 0,
                                    borderLeftWidth: 0,
                                    display: showThumbnail ? "flex" : "none"
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
                                        {views}
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
                            </View>
                            <View style={{flexDirection: "row", justifyContent: "center", marginVertical: normalize(8)}}>
                                <TouchableOpacity 
                                    onPress={() => props.navigation.navigate("EditVideo", {video: video})}
                                >
                                    <Ionicons 
                                        name="create-outline" 
                                        size={normalize(25)} 
                                        color="#000"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteVideo()}>
                                    <Ionicons name="trash-outline" size={normalize(25)} color="#000"/>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => toggleFavorite()} 
                                >
                                    <Ionicons name={isFavorited ? "star" : "star-outline"} size={normalize(25)} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{marginBottom: normalize(16)}}>
                            <Text 
                                style={{
                                    textAlign: "center", 
                                    fontSize: normalize(16), 
                                    marginHorizontal: normalize(16)
                                }}
                            >
                                {video.description}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
            {
                comments.length || video.thumbnailurl ?

                <View style={{flex: showComments ? 6 : 1}}>
                    {
                        showComments ? null :
                        
                        <View style={{flexDirection: "row", justifyContent: "center", height: "100%"}}>
                            {
                                comments.length ? 

                                <TouchableOpacity 
                                    style={{justifyContent: "center", alignItems: "center", height: "100%", flex: 1}}
                                    onPress={() => setShowComments(prev => !prev)}
                                >
                                    <Text style={{fontWeight: "bold", fontSize: normalize(16)}}>
                                        Show {comments.length} comments
                                    </Text>
                                </TouchableOpacity> : null
                            }
                            {
                                video.thumbnailurl ?

                                <TouchableOpacity 
                                    style={{justifyContent: "center", alignItems: "center", height: "100%", flex: 1}}
                                    onPress={() => setShowThumbnail(prev => !prev)}
                                >
                                    <Text style={{fontWeight: "bold", fontSize: normalize(16)}}>Show thumbnail</Text>
                                </TouchableOpacity> : null
                            }
                        </View>
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
                                        post={video}
                                        user={videoUser}
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

export default VideoDetail
