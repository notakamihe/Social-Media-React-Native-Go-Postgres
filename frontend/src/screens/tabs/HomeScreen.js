import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
import { Avatar } from "react-native-elements";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import { normalize } from '../../utils/utils';
import { flag } from "country-emoji";
import { UserContext } from '../../context/UserContext';
import moment from "moment"
import axios from 'axios';
import {StatementComponent, VideoComponent, PhotoComponent, PollComponent} from "./../../components"

const HomeScreen = (props) => {
    const {user, setUser} = useContext(UserContext)

    const [posts, setPosts] = useState([])
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])

    useEffect(() => {
        getData()

        props.navigation.addListener("focus", () => {
            getData()
        })
    }, [user, props.navigation])

    const getPosts = () => {
        setPosts([])

        axios.get(axios.defaults.baseURL + "favorites").then(res => {
            res.data.filter(f => f.userid == user.id).forEach(f => {
                axios.get(axios.defaults.baseURL + `posts/${f.postid}`).then(res => {
                    setPosts(prev => [...prev, res.data])
                }).catch(err => {
                })
            })
        }).catch(err => {
        })
    }

    const getData = () => {
        getPosts()

        axios.get(axios.defaults.baseURL + "follows").then(res => {
            setFollowers(res.data ? res.data.filter(f => f.followed == user.id) : []);
        }).catch(err => {
        })

        axios.get(axios.defaults.baseURL + "follows").then(res => {
            setFollowing(res.data ? res.data.filter(f => f.follower == user.id) : []);
        }).catch(err => {
        })
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            {
            user ?

            <ScrollView style={{paddingHorizontal: 16}}>
                <View style={{alignItems: "center", paddingVertical: normalize(48)}}>
                    <View style={{marginTop: 16, flexDirection: "row", alignItems: "center"}}>
                        <Avatar 
                            source={require("./../../../assets/images/defaultpfp.png")} 
                            size={normalize(70)} 
                            rounded 
                            containerStyle={{borderColor: "#000", borderWidth: 2}} 
                        />
                        <View style={{marginLeft: 16}}>
                            <View style={{flexDirection: "row"}}>
                                <TouchableOpacity 
                                    style={{flexDirection: "row", alignItems: "center", marginRight: 8}}
                                    onPress={() => props.navigation.dangerouslyGetParent().navigate("Follows", {
                                        listType: "followers",
                                        user: user,
                                        list: followers
                                    })}
                                    disabled={!followers.length}
                                >
                                    <Ionicons name="people-outline" size={normalize(18)} />
                                    <Text 
                                        style={{
                                            marginLeft: normalize(4), 
                                            fontWeight: "bold", 
                                            fontSize: normalize(16)
                                        }}
                                    >
                                        {followers.length}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={{flexDirection: "row", alignItems: "center", marginRight: 8}}
                                    onPress={() => props.navigation.dangerouslyGetParent().navigate("Follows", {
                                        listType: "following",
                                        user: user,
                                        list: following
                                    })}
                                    disabled={!following.length}
                                >
                                    <Ionicons name="arrow-forward-outline" size={normalize(18)} />
                                    <Text 
                                        style={{
                                            marginLeft: normalize(4), 
                                            fontWeight: "bold", 
                                            fontSize: normalize(16)
                                        }}
                                    >
                                        {following.length}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Ionicons name="calendar-outline" size={normalize(18)} color="#0005" />
                                <Text 
                                    style={{
                                        marginLeft: normalize(4), 
                                        fontWeight: "bold", 
                                        color: "#0005",
                                        fontSize: normalize(16)
                                    }}
                                >
                                    {moment(user.joinedon).format("MMM DD, YYYY")}
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Ionicons name="eye-outline" size={normalize(18)} color="#000"/>
                                <Text 
                                    style={{
                                        marginLeft: normalize(4), 
                                        fontWeight: "bold", 
                                        color: "#000",
                                        fontSize: normalize(16)
                                    }}
                                >
                                    3M
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{marginTop: 16, fontSize: normalize(20)}}>{user.username}</Text>
                    <Text style={{fontSize: normalize(16)}}>{flag(user.country)}</Text>
                    <TouchableOpacity 
                        style={{marginTop: 16 }}
                        onPress={() => 
                            props.navigation.dangerouslyGetParent().navigate("Description", {
                                user: user
                            })
                        }
                    >
                        <Text 
                            numberOfLines={8} 
                            style={{
                                color: "#0008", 
                                fontWeight: "bold", 
                                textAlign: "center", 
                                fontSize: normalize(14)
                            }}
                        >
                            {user.description}
                        </Text>
                    </TouchableOpacity>
                    <Text 
                        style={{
                            marginVertical: normalize(32), 
                            fontWeight: "bold", 
                            fontSize: normalize(20)
                        }}
                    >
                        Favorites
                    </Text>
                    <View style={{alignItems: "center"}}>
                        {
                            posts.map((p, idx) => {
                                switch (p.post.category) {
                                    case "statement":
                                        return (
                                            <StatementComponent 
                                                key={idx} 
                                                navigation={props.navigation.dangerouslyGetParent()} 
                                                statement={p}
                                                hideUser={p.post.userid == user.id}
                                            />
                                        )

                                    case "video":
                                        return (
                                            <VideoComponent 
                                                key={idx}
                                                navigation={props.navigation.dangerouslyGetParent()} 
                                                video={p}
                                                hideUser={p.post.userid == user.id}
                                            />
                                        )

                                    case "photo":
                                        return (
                                            <PhotoComponent 
                                                key={idx} 
                                                navigation={props.navigation.dangerouslyGetParent()} 
                                                photo={p}
                                                hideUser={p.post.userid == user.id}
                                            />
                                        )

                                    case "poll":
                                        return (
                                            <PollComponent 
                                                key={idx} 
                                                navigation={props.navigation.dangerouslyGetParent()} 
                                                poll={p}
                                                hideUser={p.post.userid == user.id}
                                            />
                                        )
                                }
                            })
                        }
                    </View>
                </View>
            </ScrollView> : 
            <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
                <Text style={{fontSize: normalize(20), color: "#0009"}}>
                    To see profile information,{" "}
                    <Text 
                        style={{fontWeight: "bold"}} 
                        onPress={() => props.navigation.dangerouslyGetParent().navigate("Register")}
                    >
                        sign in
                    </Text>
                </Text>
            </View>
            }
        </SafeAreaView>
    )
}

export default HomeScreen