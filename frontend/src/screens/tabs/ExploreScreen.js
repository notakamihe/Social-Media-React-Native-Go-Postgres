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

const ExploreScreen = (props) => {
    const [exploreFilterName, setExploreFilterName] = useState("hottest")
    const [users, setUsers] = useState([])
    const {user, setUser} = useContext(UserContext)

    useEffect(() => {
        axios.get(axios.defaults.baseURL + "users").then(res => {
            setUsers(res.data);
        }).catch(err => {
            console.log(err);
        })
    }, [])

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
                                <VideoComponent 
                                    navigation={props.navigation.dangerouslyGetParent()}
                                    widthPercentage={0.8}
                                />
                                <PhotoComponent 
                                    navigation={props.navigation.dangerouslyGetParent()}
                                    widthPercentage={0.8}
                                />
                                <StatementComponent 
                                    navigation={props.navigation.dangerouslyGetParent()}
                                />
                                <PollComponent 
                                    navigation={props.navigation.dangerouslyGetParent()}
                                />
                            </View> : null
                        }
                        {
                            exploreFilterName == "people" ?

                            users.filter(u => u.id != user.id).map((u, idx) => (
                                <TouchableOpacity 
                                    key={idx}
                                    style={{
                                        flexDirection: "row", 
                                        alignItems: "center", 
                                        borderColor: "#000", 
                                        borderWidth: 1,
                                        padding: 4,
                                        borderRadius: 10,
                                        minWidth: "100%",
                                        maxWidth: "100%",
                                        marginVertical: normalize(16),
                                    }}
                                    onPress={() => 
                                        props.navigation.dangerouslyGetParent().navigate("UserDetail", {
                                            user: u
                                        })
                                    }
                                >
                                    <Avatar 
                                        source={require("./../../../assets/images/defaultpfp.png")}
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
                                            {u.username}
                                        </Text>
                                        <View style={{flexDirection: "row"}}>
                                            <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(6)}}>
                                                <Ionicons name="people-outline" size={normalize(20)}/>
                                                <Text style={{marginHorizontal: 4, fontSize: normalize(16)}}>146</Text>
                                            </View>
                                            <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(6)}}>
                                                <Ionicons name="arrow-forward-outline" size={normalize(20)}/>
                                                <Text style={{marginHorizontal: 4, fontSize: normalize(16)}}>132</Text>
                                            </View>
                                            <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(6)}}>
                                                <Ionicons name="newspaper-outline" size={normalize(20)}/>
                                                <Text style={{marginHorizontal: 4, fontSize: normalize(16)}}>240</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )) : null
                        }
                    </View>
                </View>
            </ScrollView>
            <View style={{flex: 0.15, alignItems: "center", justifyContent: "space-evenly", borderLeftColor: "#000", borderLeftWidth: 1}}>
                <TouchableOpacity onPress={() => setExploreFilterName("hottest")}>
                    <Ionicons 
                        name={exploreFilterName == "hottest" ? "flame" : "flame-outline"} 
                        size={normalize(25)}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setExploreFilterName("people")}>
                    <Ionicons 
                        name={exploreFilterName == "people" ? "people" : "people-outline"} 
                        size={normalize(25)}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setExploreFilterName("videos")}>
                    <Ionicons 
                        name={exploreFilterName == "videos" ? "videocam" : "videocam-outline"} 
                        size={normalize(25)}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setExploreFilterName("photos")}>
                    <Ionicons 
                        name={exploreFilterName == "photos" ? "image" : "image-outline"} 
                        size={normalize(25)}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setExploreFilterName("statements")}>
                    <Ionicons 
                        name={exploreFilterName == "statements" ? "reader" : "reader-outline"} 
                        size={normalize(25)}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setExploreFilterName("polls")}>
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