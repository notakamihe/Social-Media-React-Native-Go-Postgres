import { decode } from 'html-entities';
import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { normalize } from 'react-native-elements'
import { Avatar } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";

const StatementDetail = (props) => {
    const [isLiked, setIsLiked] = useState(false)
    const [isCommentedOn, setIsCommentedOn] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)

    const viewCommentOrCreate = () => {
        if (!isCommentedOn)
            props.navigation.navigate("CreateComment")
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{paddingHorizontal: normalize(16)}}>
                    <View style={{width: "100%", borderBottomWidth: 1}}>
                        <Text style={{textAlign: "justify"}}>
                        Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur ullamcorper sem iaculis enim taciti praesent elementum sapien posuere bibendum faucibus sagittis. Id facilisis dapibus vulputate condimentum parturient nulla sociosqu odio dui ad a a pharetra eu augue molestie sodales euismod condimentum dignissim himenaeos adipiscing a sem adipiscing. A porta parturient id parturient nunc ad suspendisse faucibus odio facilisi vitae turpis dis justo quis primis a dictum bibendum nascetur a at a vestibulum maecenas volutpat ut gravida. Parturient vestibulum elit congue penatibus quis lectus himenaeos torquent justo a ac suspendisse commodo pulvinar inceptos a a maecenas a blandit amet quam sagittis dis.
                        </Text>
                        <View>
                            <View style={{flexDirection: "row", flexGrow: 1}}>
                                <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(6)}}>
                                    <Ionicons name="eye-outline" size={normalize(18)}/>
                                    <Text style={{marginLeft: normalize(4), fontWeight: "bold"}}>700K</Text>
                                </View>
                                <TouchableOpacity 
                                    style={{
                                        flexDirection: "row", 
                                        alignItems: "center", 
                                        marginHorizontal: normalize(6)
                                    }}
                                    onPress={() => setIsLiked(prev => !prev)}
                                >
                                    <Ionicons name={isLiked ? "heart" : "heart-outline"} size={normalize(18)}/>
                                    <Text style={{marginLeft: normalize(4), fontWeight: "bold"}}>50K</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={{
                                        flexDirection: "row", 
                                        alignItems: "center", 
                                        marginHorizontal: normalize(6)
                                    }}
                                    onPress={() => viewCommentOrCreate()}
                                >
                                    <Ionicons name={isCommentedOn ? "chatbox" : "chatbox-outline"} size={normalize(18)}/>
                                    <Text style={{marginLeft: normalize(4), fontWeight: "bold"}}>8K</Text>
                                </TouchableOpacity>
                                <View 
                                    style={{
                                        flexDirection: "row", 
                                        justifyContent: "center", 
                                        marginVertical: normalize(8),
                                        marginLeft: "auto"
                                    }}
                                >
                                    <TouchableOpacity>
                                        <Ionicons 
                                            name="create-outline" 
                                            size={normalize(25)} 
                                            color="#000"
                                            onPress={() => props.navigation.navigate("EditStatement")}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons name="trash-outline" size={normalize(25)} color="#000"/>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => setIsFavorited(prev => !prev)} 
                                    >
                                        <Ionicons name={isFavorited ? "star" : "star-outline"} size={normalize(25)} color="#000" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", marginVertical: normalize(16), alignItems: "center"}}>
                        <TouchableOpacity 
                            style={{
                                flexDirection: "row", 
                                marginRight: "auto",
                                flexShrink: 1,
                                alignItems: "center"
                            }}
                            onPress={() => props.navigation.navigate("UserDetail")}
                        >
                            <Avatar 
                                size={normalize(30)} 
                                rounded 
                                source={require("./../../../assets/images/defaultpfp.png")}
                            />
                            <Text style={{flexShrink: 1, marginLeft: normalize(8)}}>johndoeisgreat</Text>
                        </TouchableOpacity>
                        <Text style={{marginLeft: normalize(16), color: "#0007"}}>May 1, 2017</Text>
                    </View>
                    <View style={{alignItems: "center", paddingVertical: normalize(16), width: "100%"}}>
                        <View 
                            style={{
                                flexDirection: "row",
                                borderColor: "#000",
                                borderWidth: 1,
                                borderRadius: 5,
                                padding: 8,
                                marginVertical: normalize(8),
                                width: "100%"
                            }}
                        >
                            <View style={{alignItems: "center"}}>
                                <Avatar
                                    source={require("./../../../assets/images/defaultpfp.png")}
                                    rounded
                                />
                                <View style={{flexDirection: "row", marginTop: "auto"}}>
                                    <TouchableOpacity onPress={() => props.navigation.navigate("EditComment")}>
                                        <Ionicons name="create-outline" size={normalize(20)} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons name="trash-outline" size={normalize(20)} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{marginLeft: 16, flexShrink: 1}}>
                                <Text style={{fontSize: normalize(12), fontWeight: "bold"}}>
                                    johndoeisgreat {decode("&#183")} 4/18/17
                                </Text>
                                <Text 
                                    style={{
                                        backgroundColor: "#00000015", 
                                        padding: normalize(8),
                                        borderRadius: normalize(5),
                                        marginTop: normalize(8),
                                        flexShrink: 1
                                    }}
                                >
                                    Lorem ipsum, ipsum lorem
                                </Text>
                            </View>
                        </View>
                        <View 
                            style={{
                                flexDirection: "row",
                                borderColor: "#000",
                                borderWidth: 1,
                                borderRadius: 5,
                                padding: normalize(8),
                                marginVertical: normalize(8),
                                width: "100%"
                            }}
                        >
                            <Avatar
                                source={require("./../../../assets/images/defaultpfp.png")}
                                rounded
                            />
                            <View style={{marginLeft: 16, flexShrink: 1}}>
                                <Text style={{fontSize: normalize(12), fontWeight: "bold"}}>
                                    johndoeisgreat {decode("&#183")} 4/18/17
                                </Text>
                                <Text 
                                    style={{
                                        backgroundColor: "#00000015", 
                                        padding: normalize(8),
                                        borderRadius: normalize(5),
                                        marginTop: normalize(8),
                                        flexShrink: 1
                                    }}
                                >
                                    Lorem ipsum, ipsum lorem
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default StatementDetail
