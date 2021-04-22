import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext';
import { View, Text, Dimensions, Image, Modal } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalize } from '../../utils/utils';
import { VideoComponent, PhotoComponent, PollComponent, StatementComponent } from "./../../components";
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';

const PostsScreen = (props) => {
    const [posts, setPosts] = useState([])
    const {user, setUser} = useContext(UserContext)

    useEffect(() => {
        getPosts()
    }, [props.route.params])

    useEffect(() => {
        const onFocus = props.navigation.addListener("focus", () => {
            getPosts()
        });
    
        return onFocus;
    }, [props.navigation]);

    const getPosts = () => {
        axios.get(axios.defaults.baseURL + "posts").then(res => {
            setPosts(res.data.filter(p => p.post.userid == user.id));
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        user ? 
        
        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={{paddingHorizontal: 16}}>
                <View style={{alignItems: "center", paddingVertical: normalize(32)}}>
                    <Text 
                        style={{
                            marginVertical: normalize(32), 
                            fontWeight: "bold", 
                            fontSize: normalize(20)
                        }}
                    >
                        Your posts
                    </Text>
                    <TextInput 
                        style={{
                            width: "95%", 
                            borderColor: "#000", 
                            borderWidth: 1, 
                            borderRadius: 10,
                            padding: normalize(8),
                            textAlign: "center",
                            fontSize: normalize(16)
                        }}
                        placeholder="Search"
                        placeholderTextColor="#0004"
                    />
                    <View 
                        style={{
                            width: "100%", 
                            justifyContent: "center", 
                            flexDirection: "row", 
                            marginVertical: normalize(16),
                            
                        }}
                    >
                        <View style={{borderWidth: 2, borderColor: "#000", borderRadius: 15, marginHorizontal: 8, flex: 0.5}}>
                            <Picker selectedValue="videos" mode="dropdown" style={{fontSize: normalize(16)}}>
                                <Picker.Item label="All" value="all"/>
                                <Picker.Item label="Videos" value="videos"/>
                                <Picker.Item label="Photos" value="photos"/>
                                <Picker.Item label="Statements" value="statements"/>
                                <Picker.Item label="Polls" value="Polls"/>
                            </Picker>
                        </View>
                        
                        <View style={{borderWidth: 2, borderColor: "#000", borderRadius: 15, marginHorizontal: 8, flex: 0.5}}>
                            <Picker selectedValue="recent" mode="dropdown">
                                <Picker.Item label="Recent" value="recent" />
                                <Picker.Item label="Popular" value="popular" />
                                <Picker.Item label="Oldest" value="oldest" />
                            </Picker>
                        </View>
                    </View>
                    <View style={{alignItems: "center"}}>
                        {
                            posts.map((p, idx) => {
                                if (p.post.category == "statement") {
                                    return (
                                        <StatementComponent 
                                            key={idx} 
                                            hideUser 
                                            showOptions 
                                            navigation={props.navigation.dangerouslyGetParent()} 
                                            statement={p}
                                            getPosts={getPosts}
                                        />
                                    )
                                } else if (p.post.category == "video") {
                                    return (
                                        <VideoComponent 
                                            key={idx} 
                                            hideUser 
                                            showOptions 
                                            navigation={props.navigation.dangerouslyGetParent()} 
                                            video={p}
                                            getPosts={getPosts}
                                        />
                                    )
                                }

                                return null
                            })
                        }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView> :
        <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
            <Text style={{fontSize: normalize(20), color: "#0009"}}>
                To see your posts,{" "}
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

export default PostsScreen