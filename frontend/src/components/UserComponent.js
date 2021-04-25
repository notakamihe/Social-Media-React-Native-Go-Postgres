import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { View, Text, Dimensions, Image } from 'react-native'
import { Avatar } from "react-native-elements";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from "react-native-vector-icons/Ionicons";
import { normalize } from './../utils/utils';

const UserComponent = (props) => {
    const [posts, setPosts] = useState([])
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])

    useEffect(() => {
        axios.get(axios.defaults.baseURL + "follows").then(res => {
            setFollowers(res.data.filter(f => f.followed == props.user.id));
            setFollowing(res.data.filter(f => f.follower == props.user.id));
        })

        axios.get(axios.defaults.baseURL + "posts").then(res => {
            setPosts(res.data.filter(p => p.post.userid == props.user.id));
        })
    }, [])

    return (
        <TouchableOpacity 
            style={{
                flexDirection: "row", 
                alignItems: "center", 
                borderColor: "#000", 
                borderWidth: 1,
                padding: 4,
                borderRadius: 10,
                minWidth: "100%",
                maxWidth: "100%",
                marginVertical: normalize(8)
            }}
            onPress={() => 
                props.navigation.navigate("UserDetail", {user: props.user})
            }
        >
            <Avatar 
                source={require("./../../assets/images/defaultpfp.png")}
                size={normalize(80)}
                avatarStyle={{
                    borderRadius: 10
                }}
            />
            <View style={{marginLeft: 16}}>
                <Text 
                    style={{fontSize: 18, fontWeight: "bold"}} 
                    numberOfLines={1}
                >
                    {props.user.username}
                </Text>
                <View style={{flexDirection: "row"}}>
                    <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(6)}}>
                        <Ionicons name="people-outline" size={normalize(20)}/>
                        <Text style={{marginHorizontal: 4, fontSize: normalize(16)}}>{followers.length}</Text>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(6)}}>
                        <Ionicons name="arrow-forward-outline" size={normalize(20)}/>
                        <Text style={{marginHorizontal: 4, fontSize: normalize(16)}}>{following.length}</Text>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(6)}}>
                        <Ionicons name="newspaper-outline" size={normalize(20)}/>
                        <Text style={{marginHorizontal: 4, fontSize: normalize(16)}}>{posts.length}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default UserComponent
