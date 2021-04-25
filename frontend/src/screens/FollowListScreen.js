import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
import { Avatar } from "react-native-elements";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import UserComponent from '../components/UserComponent';
import { normalize } from './../utils/utils';

const FollowListScreen = (props) => {
    const [listType, setListType] = useState(props.route.params.listType);
    const [user, setUser] = useState(props.route.params.user)
    const [list, setList] = useState(props.route.params.list)
    const [users, setUsers] = useState([])

    useEffect(() => {
        props.navigation.setOptions({
            title: listType == "followers" ? `Followers of ${user.username}` : `Who ${user.username} follows`
        })

        getUsers()
    }, [])
    
    const getUsers = () => {
        setUsers([])

        list.forEach(f => {
            const endpoint = listType == "followers" ? f.follower : f.followed
            axios.get(axios.defaults.baseURL + `users/${endpoint}`).then(res => {
                setUsers(prev => [...prev, res.data])
            }).catch(err => {
                console.log(err);
            })
        })
    }

    return (
        <SafeAreaView style={{alignItems: "center", width: "100%"}}>
            <ScrollView>
                <View style={{alignItems: "center", width: "100%"}}>
                    <Text 
                        style={{
                            marginTop: normalize(32), 
                            fontWeight: "bold", 
                            fontSize: normalize(20),
                            textAlign: "center"
                        }}
                    >
                        {list.length} {listType == "followers" ? "Followers" : "Following"}
                    </Text>
                    <View 
                        style={{
                            flexDirection: "row", 
                            alignItems: "center", 
                            marginBottom: normalize(32),
                            marginTop: normalize(8)
                        }}
                    >
                        <Avatar 
                            source={require("./../../assets/images/defaultpfp.png")}
                            rounded
                            size={normalize(32)}
                        />
                        <Text style={{marginLeft: normalize(16), fontSize: normalize(16)}}>{user.username}</Text>
                    </View>
                    <View style={{alignItems: "center", marginBottom: normalize(32), paddingHorizontal: normalize(16)}}>
                        {
                            users.map((u, idx) => (
                                <UserComponent key={idx} user={u} navigation={props.navigation} />
                            ))
                        }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default FollowListScreen
