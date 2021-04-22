import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext';
import { View, Text, Dimensions } from 'react-native'
import { normalize } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function StatsScreen() {
    const {user, setUser} = useContext(UserContext)

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
                            <Text style={{fontSize: 20}}>162,893</Text>
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
                            <Text style={{fontSize: 20}}>420</Text>
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
                            <Text style={{fontSize: 20}}>35,000</Text>
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
                            <Text style={{fontSize: 20}}>800,000</Text>
                        </View>
                    </View>
                    <View 
                        style={{backgroundColor: "#00000015", padding: 8, borderRadius: 5, alignItems: "center",
                    marginVertical: 8}}
                    >
                        <Text>Average Comments</Text>
                        <Text style={{fontSize: 24}}>1,300</Text>
                    </View>
                    <View 
                        style={{backgroundColor: "#00000015", padding: 8, borderRadius: 5, alignItems: "center",
                    marginVertical: 8}}
                    >
                        <Text>Average Likes</Text>
                        <Text style={{fontSize: 24}}>10,000</Text>
                    </View>
                    <View 
                        style={{backgroundColor: "#00000015", padding: 8, borderRadius: 5, alignItems: "center",
                    marginVertical: 8}}
                    >
                        <Text>Average Views</Text>
                        <Text style={{fontSize: 24}}>2,000,000</Text>
                    </View>
                    <View style={{flexDirection: "row", marginVertical: 8, alignItems: "flex-start"}}>
                        <View 
                            style={{
                                backgroundColor: "#00000015", 
                                padding: 8, 
                                borderRadius: 5, 
                                alignItems: "center",
                                flex: 0.3,
                                marginHorizontal: 8
                            }}
                        >
                            <Text style={{fontSize: normalize(12), textAlign: "center"}}>Comments{"\n"}Rank</Text>
                            <Text style={{fontSize: 24}}>4</Text>
                        </View>
                        <View 
                            style={{
                                backgroundColor: "#00000015", 
                                padding: 8, 
                                borderRadius: 5, 
                                alignItems: "center",
                                flex: 0.3,
                                marginHorizontal: 8
                            }}
                        >
                            <Text style={{fontSize: normalize(12), textAlign: "center"}}>Likes{"\n"}Rank</Text>
                            <Text style={{fontSize: 24}}>1</Text>
                        </View>
                        <View 
                            style={{
                                backgroundColor: "#00000015", 
                                padding: 8, 
                                borderRadius: 5, 
                                alignItems: "center",
                                flex: 0.3,
                                marginHorizontal: 8
                            }}
                        >
                            <Text style={{fontSize: normalize(12), textAlign: "center"}}>Views{"\n"}Rank</Text>
                            <Text style={{fontSize: 24}}>1</Text>
                        </View>
                    </View>
                    <Text style={{marginTop: normalize(32), fontSize: normalize(16)}}>
                        Joined on March 29, 2017
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
