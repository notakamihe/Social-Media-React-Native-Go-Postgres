import { decode } from 'html-entities';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { normalize } from 'react-native-elements'
import { Avatar } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment"
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { CommentComponent } from '../../components';

const StatementDetail = (props) => {
    const {user, setUser} = useContext(UserContext)

    const [statement, setStatement] = useState(props.route.params.statement || {})
    const [statementUser, setStatementUser] = useState({})

    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])
    const [isFavorited, setIsFavorited] = useState(false)

    useEffect(() => {
        const navigationRoutes = props.navigation.dangerouslyGetState().routes
        const prevNavigationName = navigationRoutes[navigationRoutes.length - 2]["name"]

        props.navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity 
                    style={{marginLeft: normalize(16)}}
                    onPress={() => prevNavigationName == "CreateStatement" || prevNavigationName == "EditStatement" ? 
                        props.navigation.navigate("Tabs") : 
                        props.navigation.goBack()
                    }
                >
                    <Ionicons name="arrow-back-sharp" size={normalize(25)} />
                </TouchableOpacity>
            ),
            title: `${statementUser.username || ""}:  ${statement.content}`
        })
    })

    useEffect(() => {
        props.navigation.addListener("focus", () => { 
            if (!props.route.params.statement)
                props.navigation.goBack()
    
            setStatement(props.route.params.statement)
    
            axios.get(axios.defaults.baseURL + `users/${statement.post.userid}`).then(res => {
                setStatementUser(res.data);
            }).catch(err => {
                console.log(err);
            })
    
            getLikes()
            getFavorite()
            getComments()
        })
    }, [props.navigation])

    const deleteStatement = () => {
        axios.delete(axios.defaults.baseURL + `posts/${statement.post_id}`).then(res => {
            console.log(res.data);
            props.navigation.navigate("Tabs")
        }).catch(err => {
            console.log(err);
        })
    }

    const getComments = () => {
        axios.get(axios.defaults.baseURL + "comments").then(res => {
            let commentsData = res.data.filter(c => c.postid == statement.post_id && c.userid != user.id)
            const userComment = res.data.find(c => c.postid == statement.post_id && c.userid == user.id)

            if (userComment)
                commentsData.unshift(userComment)
                
            setComments(commentsData)
        })
    }

    const getFavorite = () => {
        axios.get(axios.defaults.baseURL + `favorites/${statement.post_id}/${user.id}`).then(res => {
            console.log(res.data);
            setIsFavorited(true)
        }).catch(err => {
            setIsFavorited(false)
        })
    }

    const getLikes = () => {
        axios.get(axios.defaults.baseURL + "likes").then(res => {
            setLikes(res.data ? res.data.filter(l => l.postid == statement.post_id) : []);
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
            axios.delete(axios.defaults.baseURL + `favorites/${statement.post_id}/${user.id}`).then(res => {
                console.log(res.data);
                getFavorite()
            }).catch(err => {
                console.log(err.response.data);
            })
        else
            axios.post(axios.defaults.baseURL + "favorites", {
                postid: statement.post_id,
                userid: user.id
            }).then(res => {
                console.log(res.data);
                getFavorite()
            }).catch(err => {
                console.log(err);
            })
    }

    const toggleLike = () => {
        console.log(likes);

        if (isLiked())
            axios.delete(axios.defaults.baseURL + `likes/${statement.post_id}/${user.id}`).then(res => {
                console.log(res.data);
                getLikes()
            }).catch(err => {
                console.log(err.response.data);
            })
        else
            axios.post(axios.defaults.baseURL + "likes", {
                postid: statement.post_id,
                userid: user.id
            }).then(res => {
                console.log(res.data);
                getLikes()
            }).catch(err => {
                console.log(err);
            })
    }

    const viewCommentOrCreate = () => {
        if (!isCommentedOn()) {
            props.navigation.navigate("CreateComment", {post: statement, user: statementUser})
        }
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{paddingHorizontal: normalize(16), marginVertical: normalize(32)}}>
                    <View style={{width: "100%", borderBottomWidth: 1}}>
                        <Text style={{textAlign: "center", fontSize: normalize(16)}}>
                        {statement.content}
                        </Text>
                        <View>
                            <View style={{flexDirection: "row", flexGrow: 1}}>
                                <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(6)}}>
                                    <Ionicons name="eye-outline" size={normalize(16)}/>
                                    <Text style={{marginLeft: normalize(4), fontWeight: "bold", fontSize: normalize(16)}}>700K</Text>
                                </View>
                                <TouchableOpacity 
                                    style={{
                                        flexDirection: "row", 
                                        alignItems: "center", 
                                        marginHorizontal: normalize(6)
                                    }}
                                    onPress={() => toggleLike()}
                                >
                                    <Ionicons name={isLiked() ? "thumbs-up" : "thumbs-up-outline"} size={normalize(16)}/>
                                    <Text style={{marginLeft: normalize(4), fontWeight: "bold", fontSize: normalize(16)}}>{likes.length}</Text>
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
                                            marginLeft: normalize(4), fontWeight: "bold", fontSize: normalize(16)
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
                                    {
                                        user.id == statementUser.id ? 

                                        <View style={{flexDirection: "row"}}>
                                            <TouchableOpacity>
                                                <Ionicons 
                                                    name="create-outline" 
                                                    size={normalize(25)} 
                                                    color="#000"
                                                    onPress={() => props.navigation.navigate("EditStatement", {
                                                        statement: statement
                                                    })}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => deleteStatement()}>
                                                <Ionicons name="trash-outline" size={normalize(25)} color="#000"/>
                                            </TouchableOpacity>
                                        </View> : null
                                    }
                                    <TouchableOpacity 
                                        onPress={() => toggleFavorite()} 
                                    >
                                        <Ionicons name={isFavorited ? "star" : "star-outline"} size={normalize(25)} color="#000" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", marginVertical: normalize(16), alignItems: "center"}}>
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
                                style={{flexShrink: 1, marginLeft: normalize(8), fontSize: normalize(16)}}
                            >
                                {statementUser.username}
                            </Text>
                        </TouchableOpacity>
                        <Text 
                            style={{marginLeft: normalize(16), color: "#0007", fontSize: normalize(16)}}
                        >
                            {moment(statement.post.createdon).format("MMM DD, YYYY")}
                        </Text>
                    </View>
                    <ScrollView>
                        <View style={{alignItems: "center", paddingVertical: normalize(16), width: "100%"}}>
                            {
                                comments.map((c, idx) => (
                                    <CommentComponent 
                                        key={idx} 
                                        comment={c} 
                                        readOnly={c && c.userid == user.id} 
                                        navigation={props.navigation}
                                        getComments={getComments}
                                        post={statement}
                                        user={statementUser}
                                    />
                                ))
                            }
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default StatementDetail
