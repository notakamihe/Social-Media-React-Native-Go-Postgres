import React, { useState } from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
import { Avatar } from "react-native-elements";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import { normalize } from '../../utils/utils';
import { flag } from "country-emoji";
import { VideoComponent, PhotoComponent, PollComponent, StatementComponent } from '../../components';

const UserDetail = (props) => {
    const [isFollowed, setIsFollowed] = useState(false)

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={{paddingHorizontal: 16, marginTop: normalize(-16)}}>
                <View style={{alignItems: "center", paddingVertical: normalize(32), p16addingBottom: normalize(32)}}>
                    <View style={{flexDirection: "row"}}>
                        <Avatar 
                            source={require("./../../../assets/images/defaultpfp.png")} 
                            size={70} 
                            rounded 
                            containerStyle={{borderColor: "#000", borderWidth: 2}} 
                        />
                        <View style={{marginLeft: 16}}>
                            <View style={{flexDirection: "row"}}>
                                <TouchableOpacity 
                                    style={{flexDirection: "row", alignItems: "center", marginRight: 8}}
                                    onPress={() => setIsFollowed(prev => !prev)}
                                >
                                    <Ionicons name={isFollowed ? "people" : "people-outline"} size={18} />
                                    <Text style={{marginLeft: normalize(4), fontWeight: "bold"}}>146K</Text>
                                </TouchableOpacity>
                                <View style={{flexDirection: "row", alignItems: "center", marginRight: 8}}>
                                    <Ionicons name="arrow-forward-outline" size={18} />
                                    <Text style={{marginLeft: normalize(4), fontWeight: "bold"}}>132K</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Ionicons name="calendar-outline" size={18} color="#0005" />
                                <Text style={{marginLeft: normalize(4), fontWeight: "bold", color: "#0005"}}>Mar 29, 2017</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <View 
                                    style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(4)}}>
                                    <Ionicons name="eye-outline" size={18} color="#000"/>
                                    <Text 
                                        style={{marginLeft: normalize(4), fontWeight: "bold", color: "#000"}}
                                    >
                                        3M
                                    </Text>
                                </View>
                                <View 
                                    style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(4)}}>
                                    <Ionicons name="heart-outline" size={18} color="#000"/>
                                    <Text 
                                        style={{marginLeft: normalize(4), fontWeight: "bold", color: "#000"}}
                                    >
                                        5M
                                    </Text>
                                </View>
                                <View 
                                    style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(4)}}>
                                    <Ionicons name="chatbox-outline" size={18} color="#000"/>
                                    <Text 
                                        style={{marginLeft: normalize(4), fontWeight: "bold", color: "#000"}}
                                    >
                                        400K
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Text style={{marginTop: 16, fontSize: 20}}>johndoeisgreat</Text>
                    <Text>{flag("US")}</Text>
                    <TouchableOpacity 
                        style={{marginTop: 16 }}
                        onPress={() => props.navigation.navigate("Description")}
                    >
                        <Text numberOfLines={8} style={{color: "#0008", fontWeight: "bold", textAlign: "center"}}>
                            Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et 
                            tristique curabitur ullamcorper sem iaculis enim taciti praesent elementum sapien posuere 
                            bibendum faucibus sagittis. Id facilisis dapibus vulputate condimentum parturient nulla 
                            sociosqu odio dui ad a a pharetra eu augue molestie sodales euismod condimentum dignissim 
                            himenaeos adipiscing a sem adipiscing. A porta parturient id parturient nunc ad 
                            suspendisse faucibus odio facilisi vitae turpis dis justo quis primis a dictum bibendum 
                            nascetur a at a vestibulum maecenas volutpat ut gravida. Parturient vestibulum elit 
                            congue penatibus quis lectus himenaeos torquent justo a ac suspendisse commodo pulvinar 
                            inceptos a a maecenas a blandit amet quam sagittis dis. 
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
