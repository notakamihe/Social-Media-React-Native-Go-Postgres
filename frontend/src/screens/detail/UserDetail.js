import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
import { Avatar } from "react-native-elements";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import { normalize } from '../../utils/utils';
import { flag } from "country-emoji";
import { VideoComponent, PhotoComponent, PollComponent, StatementComponent } from '../../components';
import moment from "moment";

const UserDetail = (props) => {
    const [isFollowed, setIsFollowed] = useState(false)
    const [viewedUser, setViewedUser] = useState({})

    useEffect(() => {
        setViewedUser(props.route.params.user)
    }, [])

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
                                    onPress={() => setIsFollowed(prev => !prev)}
                                >
                                    <Ionicons 
                                        name={isFollowed ? "people" : "people-outline"} 
                                        size={normalize(18)} 
                                    />
                                    <Text 
                                        style={{
                                            marginLeft: normalize(4), 
                                            fontWeight: "bold", 
                                            fontSize: normalize(16)
                                        }}
                                    >
                                        146K
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
                                        132K
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
                                        5M
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
                        Posts (4)
                    </Text>
                    <View style={{alignItems: "center"}}>
                        <VideoComponent navigation={props.navigation} />
                        <PhotoComponent navigation={props.navigation}/>
                        <StatementComponent navigation={props.navigation}/>
                        <PollComponent navigation={props.navigation}/>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default UserDetail
