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
    const [filteredPosts, setFilteredPosts] = useState([])
    const [selectedPostType, setSelectedPostType] = useState("")
    const [selectedSort, setSelectedSort] = useState("")
    const [searchText, setSearchText] = useState("")

    const {user, setUser} = useContext(UserContext)

    useEffect(() => {
        getPosts()

        const onFocus = props.navigation.addListener("focus", () => {
            getPosts()
        });
    
        return onFocus;
    }, [user, props.navigation]);

    const filterByPostType = (v, data) => {
        setSelectedPostType(v)

        switch (v) {
            case "":
            case "all":
                setFilteredPosts(data)
                break
            case "videos":
                setFilteredPosts(data.filter(p => p.post.category == "video"))
                break
            case "photos":
                setFilteredPosts(data.filter(p => p.post.category == "photo"))
                break
            case "statements":
                setFilteredPosts(data.filter(p => p.post.category == "statement"))
                break
            case "polls":
                setFilteredPosts(data.filter(p => p.post.category == "poll"))
                break
        }
    }

    const getPosts = () => {
        axios.get(axios.defaults.baseURL + "posts").then(res => {
            const postsData = res.data.filter(p => p.post.userid == user.id).sort((a, b) => new Date(b.post.createdon) - new Date(a.post.createdon))
            setPosts(postsData);
            filterByPostType(selectedPostType, postsData)
        }).catch(err => {
            console.log(err);
        })
    }

    const sortBy = (v, data) => {
        setSelectedSort(v)

        switch (v) {
            case "recent":
                setFilteredPosts(filteredPosts.sort((a, b) => new Date(b.post.createdon) - new Date(a.post.createdon)))
                break
            case "popular":
                break
            case "oldest":
                setFilteredPosts(filteredPosts.sort((a, b) => new Date(a.post.createdon) - new Date(b.post.createdon)))
                break
        }
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
                        onChangeText={text => setSearchText(text)}
                        value={searchText}
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
                            <Picker 
                                selectedValue={selectedPostType}
                                mode="dropdown" 
                                style={{fontSize: normalize(16)}}
                                onValueChange={(v, i) => filterByPostType(v, posts)}
                            >
                                <Picker.Item label="All" value="all"/>
                                <Picker.Item label="Videos" value="videos"/>
                                <Picker.Item label="Photos" value="photos"/>
                                <Picker.Item label="Statements" value="statements"/>
                                <Picker.Item label="Polls" value="polls"/>
                            </Picker>
                        </View>
                        
                        <View style={{borderWidth: 2, borderColor: "#000", borderRadius: 15, marginHorizontal: 8, flex: 0.5}}>
                            <Picker 
                                selectedValue={selectedSort} 
                                mode="dropdown"
                                onValueChange={(v, i) => sortBy(v, posts)}
                            >
                                <Picker.Item label="Recent" value="recent" />
                                <Picker.Item label="Popular" value="popular" />
                                <Picker.Item label="Oldest" value="oldest" />
                            </Picker>
                        </View>
                    </View>
                    <View style={{alignItems: "center"}}>
                        {
                            filteredPosts.map((p, idx) => {
                                switch (p.post.category) {
                                    case "statement":
                                        if (p.content.toLowerCase().includes(searchText.toLowerCase()))
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

                                        return null
                                    case "video":
                                        if (p.title.toLowerCase().includes(searchText.toLowerCase()))
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

                                        return null
                                    case "photo":
                                        if (p.title.toLowerCase().includes(searchText.toLowerCase()))
                                            return (
                                                <PhotoComponent 
                                                    key={idx} 
                                                    hideUser 
                                                    showOptions 
                                                    navigation={props.navigation.dangerouslyGetParent()} 
                                                    photo={p}
                                                    getPosts={getPosts}
                                                />
                                            )

                                        return null
                                    case "poll":
                                        if (p.title.toLowerCase().includes(searchText.toLowerCase()))
                                            return (
                                                <PollComponent 
                                                    key={idx} 
                                                    hideUser 
                                                    showOptions 
                                                    navigation={props.navigation.dangerouslyGetParent()} 
                                                    poll={p}
                                                    getPosts={getPosts}
                                                />
                                            )

                                        return null
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