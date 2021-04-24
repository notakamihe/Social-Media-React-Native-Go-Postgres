import { decode } from 'html-entities';
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { normalize } from 'react-native-elements'
import { Avatar } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment"
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const StatementDetail = (props) => {
    const [statement, setStatement] = useState(props.route.params.statement || {})
    const [statementUser, setStatementUser] = useState({})
    const [isLiked, setIsLiked] = useState(false)
    const [isCommentedOn, setIsCommentedOn] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)
    const {user, setUser} = useContext(UserContext)

    useEffect(() => {
        const navigationRoutes = props.navigation.dangerouslyGetState().routes
        const prevNavigationName = navigationRoutes[navigationRoutes.length - 2]["name"]

        props.navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity 
                    style={{marginLeft: normalize(16)}}
                    onPress={() => prevNavigationName == "CreateStatement" || prevNavigationName == "EditStatement" ? 
                        props.navigation.navigate("Tabs") : 
                        props.navigation.goBack()
                    }
                >
                    <Ionicons name="arrow-back-sharp" size={normalize(25)} />
                </TouchableOpacity>
            ),
            title: `${statementUser.username || ""}:  ${statement.content}`
        })
    })

    useEffect(() => {
        if (!props.route.params.statement)
            props.navigation.goBack()

        setStatement(props.route.params.statement)

        axios.get(axios.defaults.baseURL + `users/${statement.post.userid}`).then(res => {
            setStatementUser(res.data);
        }).catch(err => {
            console.log(err);
        })
    }, [props.route.params.statement])

    const deleteStatement = () => {
        axios.delete(axios.defaults.baseURL + `posts/${statement.post_id}`).then(res => {
            console.log(res.data);
            props.navigation.navigate("Tabs")
        }).catch(err => {
            console.log(err);
        })
    }

    const viewCommentOrCreate = () => {
        if (!isCommentedOn)
            props.navigation.navigate("CreateComment")
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{paddingHorizontal: normalize(16), marginVertical: normalize(32)}}>
                    <View style={{width: "100%", borderBottomWidth: 1}}>
                        <Text style={{textAlign: "center", fontSize: normalize(16)}}>
                        {statement.content}
                        </Text>
                        <View>
                            <View style={{flexDirection: "row", flexGrow: 1}}>
                                <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: normalize(6)}}>
                                    <Ionicons name="eye-outline" size={normalize(16)}/>
                                    <Text style={{marginLeft: normalize(4), fontWeight: "bold", fontSize: normalize(16)}}>700K</Text>
                                </View>
                                <TouchableOpacity 
                                    style={{
                                        flexDirection: "row", 
                                        alignItems: "center", 
                                        marginHorizontal: normalize(6)
                                    }}
                                    onPress={() => setIsLiked(prev => !prev)}
                                >
                                    <Ionicons name={isLiked ? "heart" : "heart-outline"} size={normalize(16)}/>
                                    <Text style={{marginLeft: normalize(4), fontWeight: "bold", fontSize: normalize(16)}}>50K</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={{
                                        flexDirection: "row", 
                                        alignItems: "center", 
                                        marginHorizontal: normalize(6)
                                    }}
                                    onPress={() => viewCommentOrCreate()}
                                >
                                    <Ionicons name={isCommentedOn ? "chatbox" : "chatbox-outline"} size={normalize(16)}/>
                                    <Text style={{marginLeft: normalize(4), fontWeight: "bold", fontSize: normalize(16)}}>8K</Text>
                                </TouchableOpacity>
                                <View 
                                    style={{
                                        flexDirection: "row", 
                                        justifyContent: "center", 
                                        marginVertical: normalize(8),
                                        marginLeft: "auto"
                                    }}
                                >
                                    {
                                        user.id == statementUser.id ? 

                                        <View style={{flexDirection: "row"}}>
                                            <TouchableOpacity>
                                                <Ionicons 
                                                    name="create-outline" 
                                                    size={normalize(25)} 
                                                    color="#000"
                                                    onPress={() => props.navigation.navigate("EditStatement", {
                                                        statement: statement
                                                    })}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => deleteStatement()}>
                                                <Ionicons name="trash-outline" size={normalize(25)} color="#000"/>
                                            </TouchableOpacity>
                                        </View> : null
                                    }
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
                            <Text 
                                style={{flexShrink: 1, marginLeft: normalize(8), fontSize: normalize(16)}}
                            >
                                {statementUser.username}
                            </Text>
                        </TouchableOpacity>
                        <Text 
                            style={{marginLeft: normalize(16), color: "#0007", fontSize: normalize(16)}}
                        >
                            {moment(statement.post.createdon).format("MMM DD, YYYY")}
                        </Text>
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
                                    johndoeisgreat {decode("&#183")} 5/2/17
                                </Text>
                                <Text 
                                    style={{
                                        backgroundColor: "#00000015", 
                                        padding: normalize(8),
                                        borderRadius: normalize(5),
                                        marginTop: normalize(8),
                                        flexShrink: 1,
                                        fontSize: normalize(14)
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
                                    johndoeisgreat {decode("&#183")} 5/2/17
                                </Text>
                                <Text 
                                    style={{
                                        backgroundColor: "#00000015", 
                                        padding: normalize(8),
                                        borderRadius: normalize(5),
                                        marginTop: normalize(8),
                                        flexShrink: 1,
                                        fontSize: normalize(14)
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
