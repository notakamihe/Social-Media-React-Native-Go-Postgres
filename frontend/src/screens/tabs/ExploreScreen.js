import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
import { Avatar } from "react-native-elements";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import { normalize } from '../../utils/utils';
import VideoComponent from '../../components/VideoComponent';
import PhotoComponent from '../../components/PhotoComponent';
import StatementComponent from '../../components/StatementComponent';
import PollComponent from '../../components/PollComponent';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import UserComponent from '../../components/UserComponent';

const ExploreScreen = (props) => {
    const {user, setUser} = useContext(UserContext)

    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [data, setData] = useState([])

    const [exploreFilterName, setExploreFilterName] = useState("explore")

    useEffect(() => {
        props.navigation.addListener("focus", () => {
            axios.get(axios.defaults.baseURL + "users").then(res => {
                setUsers(res.data);
            }).catch(err => {
                console.log(err);
            })

            axios.get(axios.defaults.baseURL + "posts").then(res => {
                setPosts(res.data)
            }).catch(err => {
                console.log(err);
            })
        })
    }, [])

    useEffect(() => {
        filterPostsAndUsers(exploreFilterName)
    }, [posts])

    const filterPostsAndUsers = (v) => {
        setExploreFilterName(v)

        switch (v) {
            case "explore":
                setData(posts.sort(() => 0.5 - Math.random()))
                break
            case "people":
                setData(users)
                break
            case "videos":
                setData(posts.filter(p => p.post.category == "video"))
                break
            case "photos":
                setData(posts.filter(p => p.post.category == "photo"))
                break
            case "statements":
                setData(posts.filter(p => p.post.category == "statement"))
                break
            case "polls":
                setData(posts.filter(p => p.post.category == "poll"))
                break
        }
    }

    return (
        <SafeAreaView style={{flex: 1, flexDirection: "row"}}>
            <ScrollView style={{paddingHorizontal: 8, flex: 0.85}} showsVerticalScrollIndicator={false}>
                <View style={{alignItems: "center", paddingVertical: normalize(32)}}>
                    <View style={{alignSelf: "flex-start", marginLeft: normalize(16)}}>
                        <Text 
                            style={{
                                marginBottom: normalize(32), 
                                fontWeight: "bold", 
                                fontSize: normalize(20),
                                textTransform: "capitalize",
                            }}
                        >
                            {exploreFilterName}
                        </Text>
                    </View>
                    <View style={{alignItems: "center"}}>
                        {
                            exploreFilterName != "people" ?

                            <View>
                            {
                                data.map((p, idx) => {
                                    if (p.post.userid == user.id)
                                        return null

                                    switch (p.post.category) {
                                        case "statement":
                                            return (
                                                <StatementComponent 
                                                    key={idx} 
                                                    navigation={props.navigation.dangerouslyGetParent()} 
                                                    statement={p}
                                                />
                                            )

                                        case "video":
                                            return (
                                                <VideoComponent 
                                                    key={idx}
                                                    navigation={props.navigation.dangerouslyGetParent()} 
                                                    video={p}
                                                    widthPercentage={0.83}
                                                />
                                            )

                                        case "photo":
                                            return (
                                                <PhotoComponent 
                                                    key={idx} 
                                                    navigation={props.navigation.dangerouslyGetParent()} 
                                                    photo={p}
                                                    widthPercentage={0.83}
                                                />
                                            )

                                        case "poll":
                                            return (
                                                <PollComponent 
                                                    key={idx} 
                                                    navigation={props.navigation.dangerouslyGetParent()} 
                                                    poll={p}
                                                />
                                            )
                                    }
                                })
                            }
                            </View> : 
                            <View>
                                {
                                    users.filter(u => !user || u.id != user.id).map((u, idx) => (
                                        <UserComponent 
                                            key={idx} 
                                            user={u} 
                                            navigation={props.navigation.dangerouslyGetParent()}
                                        />
                                    ))
                                }
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
            <View style={{flex: 0.15, alignItems: "center", justifyContent: "space-evenly", borderLeftColor: "#000", borderLeftWidth: 1}}>
                <TouchableOpacity onPress={() => filterPostsAndUsers("explore")}>
                    <Ionicons 
                        name={exploreFilterName == "explore" ? "compass" : "compass-outline"} 
                        size={normalize(25)}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => filterPostsAndUsers("people")}>
                    <Ionicons 
                        name={exploreFilterName == "people" ? "people" : "people-outline"} 
                        size={normalize(25)}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => filterPostsAndUsers("videos")}>
                    <Ionicons 
                        name={exploreFilterName == "videos" ? "videocam" : "videocam-outline"} 
                        size={normalize(25)}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => filterPostsAndUsers("photos")}>
                    <Ionicons 
                        name={exploreFilterName == "photos" ? "image" : "image-outline"} 
                        size={normalize(25)}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => filterPostsAndUsers("statements")}>
                    <Ionicons 
                        name={exploreFilterName == "statements" ? "reader" : "reader-outline"} 
                        size={normalize(25)}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => filterPostsAndUsers("polls")}>
                    <Ionicons 
                        name={exploreFilterName == "polls" ? "podium" : "podium-outline"} 
                        size={normalize(25)}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


export default ExploreScreen