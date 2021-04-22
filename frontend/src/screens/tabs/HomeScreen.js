import React, { useContext } from 'react'
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
import { flag } from "country-emoji";
import { UserContext } from '../../context/UserContext';
import moment from "moment"

const HomeScreen = (props) => {
    const {user, setUser} = useContext(UserContext)

    return (
        <SafeAreaView style={{flex: 1}}>
            {
            user ?

            <ScrollView style={{paddingHorizontal: 16}}>
                <View style={{alignItems: "center", paddingVertical: normalize(48)}}>
                    <View style={{marginTop: 16, flexDirection: "row", alignItems: "center"}}>
                        <Avatar 
                            source={require("./../../../assets/images/defaultpfp.png")} 
                            size={normalize(70)} 
                            rounded 
                            containerStyle={{borderColor: "#000", borderWidth: 2}} 
                        />
                        <View style={{marginLeft: 16}}>
                            <View style={{flexDirection: "row"}}>
                                <View style={{flexDirection: "row", alignItems: "center", marginRight: 8}}>
                                    <Ionicons name="people-outline" size={normalize(18)} />
                                    <Text 
                                        style={{
                                            marginLeft: normalize(4), 
                                            fontWeight: "bold", 
                                            fontSize: normalize(16)
                                        }}
                                    >
                                        146K
                                    </Text>
                                </View>
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
                                    {moment(user.joinedon).format("MMM DD, YYYY")}
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
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
                        </View>
                    </View>
                    <Text style={{marginTop: 16, fontSize: normalize(20)}}>{user.username}</Text>
                    <Text style={{fontSize: normalize(16)}}>{flag(user.country)}</Text>
                    <TouchableOpacity 
                        style={{marginTop: 16 }}
                        onPress={() => 
                            props.navigation.dangerouslyGetParent().navigate("Description", {
                                user: user
                            })
                        }
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
                            {user.description}
                        </Text>
                    </TouchableOpacity>
                    <Text 
                        style={{
                            marginVertical: normalize(32), 
                            fontWeight: "bold", 
                            fontSize: normalize(20)
                        }}
                    >
                        Favorites
                    </Text>
                    <View style={{alignItems: "center"}}>
                        <VideoComponent navigation={props.navigation.dangerouslyGetParent()} />
                        <PhotoComponent navigation={props.navigation.dangerouslyGetParent()}/>
                        <StatementComponent navigation={props.navigation.dangerouslyGetParent()}/>
                        <PollComponent navigation={props.navigation.dangerouslyGetParent()}/>
                    </View>
                </View>
            </ScrollView> : 
            <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
                <Text style={{fontSize: normalize(20), color: "#0009"}}>
                    To see profile information,{" "}
                    <Text 
                        style={{fontWeight: "bold"}} 
                        onPress={() => props.navigation.dangerouslyGetParent().navigate("Register")}
                    >
                        sign in
                    </Text>
                </Text>
            </View>
            }
        </SafeAreaView>
    )
}

export default HomeScreen