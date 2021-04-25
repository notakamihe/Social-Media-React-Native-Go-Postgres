import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
import { Avatar } from "react-native-elements";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import { normalize } from '../../utils/utils';
import { flag } from "country-emoji";
import { VideoComponent, PhotoComponent, PollComponent, StatementComponent } from '../../components';
import moment from "moment";
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const UserDetail = (props) => {
    const {user, setUser} = useContext(UserContext)

    const [viewedUser, setViewedUser] = useState({})

    const [posts, setPosts] = useState([])
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])

    const [totalLikes, setTotalLikes] = useState(0)

    useEffect(() => {
        setViewedUser(props.route.params.user)
        getFollowers(props.route.params.user)
        getFollowing(props.route.params.user)

        axios.get(axios.defaults.baseURL + "posts").then(res => {
            const filtered = res.data.filter(p =>  p.post.userid == props.route.params.user.id)
            setPosts(filtered);

            filtered.forEach(p => {
                axios.get(axios.defaults.baseURL + "likes").then(r => {
                    setTotalLikes(prev => prev + r.data.filter(l => l.postid == p.post_id).length);
                })
            })
        })

        props.navigation.setOptions({
            title: `Profile of ${props.route.params.user.username}`
        })
    }, [])


    const getFollowers = (user) => {
        axios.get(axios.defaults.baseURL + "follows").then(res => {
            setFollowers(res.data ? res.data.filter(f => f.followed == user.id) : []);
        }).catch(err => {
            console.log(err);
        })
    }

    const getFollowing = (user) => {
        axios.get(axios.defaults.baseURL + "follows").then(res => {
            setFollowing(res.data ? res.data.filter(f => f.follower == user.id) : []);
        }).catch(err => {
            console.log(err);
        })
    }

    const isFollowed = () => {
        return followers.map(f => f.follower).includes(user.id)
    }

    const toggleFollow = () => {
        if (isFollowed()) {
            axios.delete(axios.defaults.baseURL + `follows/${viewedUser.id}/${user.id}`).then(res => {
                console.log(res.data);
                getFollowers(viewedUser)
            }).catch(err => {
                console.log(err);
            })
        } else {
            axios.post(axios.defaults.baseURL + "follows", {
                followed: viewedUser.id,
                follower: user.id
            }).then(res => {
                console.log(res.data);
                getFollowers(viewedUser)
            }).catch(err => {
                console.log(err);
            })
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={{paddingHorizontal: 16}}>
                <View style={{alignItems: "center", paddingVertical: normalize(32), p16addingBottom: normalize(32)}}>
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
                                    onPress={() => toggleFollow()}
                                >
                                    <Ionicons 
                                        name={isFollowed() ? "people" : "people-outline"} 
                                        size={normalize(18)} 
                                    />
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
                                <View style={{flexDirection: "row", alignItems: "center", marginRight: 8}}>
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
                                </View>
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
                                    {moment(viewedUser.joinedon).format("MMM DD, YYYY")}
                                </Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <View 
                                    style={{
                                        flexDirection: "row", 
                                        alignItems: "center", 
                                        marginHorizontal: normalize(4)
                                    }}
                                >
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
                                <View 
                                    style={{
                                        flexDirection: "row", 
                                        alignItems: "center", 
                                        marginHorizontal: normalize(6)
                                    }}
                                >
                                    <Ionicons name="heart-outline" size={normalize(18)} color="#000"/>
                                    <Text 
                                        style={{
                                            marginLeft: normalize(4), 
                                            fontWeight: "bold", 
                                            color: "#000",
                                            fontSize: normalize(16)
                                        }}
                                    >
                                        {totalLikes}
                                    </Text>
                                </View>
                                <View 
                                    style={{
                                        flexDirection: "row", 
                                        alignItems: "center", 
                                        marginHorizontal: normalize(6)
                                    }}
                                >
                                    <Ionicons name="chatbox-outline" size={normalize(18)} color="#000"/>
                                    <Text 
                                        style={{
                                            marginLeft: normalize(4), 
                                            fontWeight: "bold", 
                                            color: "#000",
                                            fontSize: normalize(16)
                                        }}
                                    >
                                        400K
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Text style={{marginTop: 16, fontSize: normalize(20)}}>{viewedUser.username}</Text>
                    <Text style={{fontSize: normalize(16)}}>{flag(viewedUser.country)}</Text>
                    <TouchableOpacity 
                        style={{marginTop: 16 }}
                        onPress={() => props.navigation.navigate("Description", {user: viewedUser})}
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
                            {viewedUser.description}
                        </Text>
                    </TouchableOpacity>
                    <Text 
                        style={{
                            marginVertical: normalize(32), 
                            fontWeight: "bold", 
                            fontSize: normalize(20)
                        }}
                    >
                        Posts ({posts.length})
                    </Text>
                    <View style={{alignItems: "center"}}>
                        {
                            posts.map((p, idx) => {
                                switch (p.post.category) {
                                    case "statement":
                                        return (
                                            <StatementComponent 
                                                key={idx} 
                                                navigation={props.navigation} 
                                                statement={p}
                                            />
                                        )

                                    case "video":
                                        return (
                                            <VideoComponent 
                                                key={idx}
                                                navigation={props.navigation} 
                                                video={p}
                                            />
                                        )

                                    case "photo":
                                        return (
                                            <PhotoComponent 
                                                key={idx} 
                                                navigation={props.navigation} 
                                                photo={p}
                                            />
                                        )

                                    case "poll":
                                        return (
                                            <PollComponent 
                                                key={idx} 
                                                navigation={props.navigation} 
                                                poll={p}
                                            />
                                        )
                                }
                            })    
                        }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default UserDetail
