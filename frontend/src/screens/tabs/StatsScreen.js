import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext';
import { View, Text, Dimensions } from 'react-native'
import { normalize } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import moment from 'moment';
import axios from 'axios';
import { set } from 'react-native-reanimated';
import numeral from 'numeral';

export default function StatsScreen() {
    const {user, setUser} = useContext(UserContext)

    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])
    const [posts, setPosts] = useState([])
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])

    useEffect(() => {
        getData()
    }, [user])

    const average = (n) => {
        return n / posts.filter(p => p.post.category != "poll").length
    }

    const getData = () => {
        axios.get(axios.defaults.baseURL + "follows").then(res => {
            setFollowers(res.data.filter(f => f.followed == user.id));
            setFollowing(res.data.filter(f => f.follower == user.id));
        }).catch(err => {
            console.log(err);
        })

        axios.get(axios.defaults.baseURL + "posts").then(res => {
            const postsData = res.data.filter(p => p.post.userid == user.id)
            setPosts(postsData)
            setLikes([])
            setComments([])

            postsData.forEach(p => {
                axios.get(axios.defaults.baseURL + "likes").then(res => {
                    setLikes(prev => [...prev, ...res.data.filter(l => l.postid == p.post_id)]);
                })

                axios.get(axios.defaults.baseURL + "comments").then(res => {
                    setComments(prev => [...prev, ...res.data.filter(c => c.postid == p.post_id)]);
                })
            })
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        user ?
        
        <SafeAreaView style={{flex: 1}}>
            <ScrollView>
                <View style={{alignItems: "center", paddingVertical: normalize(48)}}>
                    <Text 
                        style={{
                            marginVertical: normalize(32), 
                            fontWeight: "bold", 
                            fontSize: normalize(20)
                        }}
                    >
                        Stats
                    </Text>
                    <View 
                        style={{backgroundColor: "#00000015", padding: 8, borderRadius: 5, alignItems: "center",
                    marginVertical: 8}}
                    >
                        <Text>Total Views</Text>
                        <Text style={{fontSize: 40}}>69,000,000</Text>
                    </View>
                    <View style={{flexDirection: "row", marginVertical: 8, alignItems: "baseline"}}>
                        <View 
                            style={{
                                backgroundColor: "#00000015", 
                                padding: 8, 
                                borderRadius: 5, 
                                alignItems: "center",
                                flex: 0.45,
                                marginHorizontal: 8
                            }}
                        >
                            <Text>Followers</Text>
                            <Text style={{fontSize: 20}}>{followers.length}</Text>
                        </View>
                        <View 
                            style={{
                                backgroundColor: "#00000015", 
                                padding: 8, 
                                borderRadius: 5, 
                                alignItems: "center",
                                flex: 0.45,
                                marginHorizontal: 8
                            }}
                        >
                            <Text>Following</Text>
                            <Text style={{fontSize: 20}}>{following.length}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", marginVertical: 8, alignItems: "flex-end"}}>
                        <View 
                            style={{
                                backgroundColor: "#00000015", 
                                padding: 8, 
                                borderRadius: 5, 
                                alignItems: "center",
                                flex: 0.45,
                                marginHorizontal: 8
                            }}
                        >
                            <Text>Total comments</Text>
                            <Text style={{fontSize: 20}}>{comments.length}</Text>
                        </View>
                        <View 
                            style={{
                                backgroundColor: "#00000015", 
                                padding: 8, 
                                borderRadius: 5, 
                                alignItems: "center",
                                flex: 0.45,
                                marginHorizontal: 8
                            }}
                        >
                            <Text>Total Likes</Text>
                            <Text style={{fontSize: 20}}>{likes.length}</Text>
                        </View>
                    </View>
                    <View 
                        style={{backgroundColor: "#00000015", padding: 8, borderRadius: 5, alignItems: "center",
                    marginVertical: 8}}
                    >
                        <Text>Average Comments</Text>
                        <Text style={{fontSize: 24}}>
                            {numeral(average(comments.length)).format("0.[00]")}
                        </Text>
                    </View>
                    <View 
                        style={{backgroundColor: "#00000015", padding: 8, borderRadius: 5, alignItems: "center",
                    marginVertical: 8}}
                    >
                        <Text>Average Likes</Text>
                        <Text style={{fontSize: 24}}>
                            {numeral(average(likes.length)).format("0.[00]")}
                        </Text>
                    </View>
                    <View 
                        style={{backgroundColor: "#00000015", padding: 8, borderRadius: 5, alignItems: "center",
                    marginVertical: 8}}
                    >
                        <Text>Average Views</Text>
                        <Text style={{fontSize: 24}}>
                            2,000,000
                        </Text>
                    </View>
                    <Text style={{marginTop: normalize(32), fontSize: normalize(16)}}>
                        Joined on {moment(user.joinedon).format("MMM DD, YYYY")}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView> :
        <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
            <Text style={{fontSize: normalize(20), color: "#0009"}}>
                To read your stats,{" "}
                <Text 
                    style={{fontWeight: "bold"}} 
                    onPress={() => props.navigation.dangerouslyGetParent().navigate("Register")}
                >
                    sign in
                </Text>
            </Text>
        </View>
    )
}
