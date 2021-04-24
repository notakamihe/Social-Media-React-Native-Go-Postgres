import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Avatar, normalize } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import numeral from "numeral"
import axios from 'axios';
import moment from "moment"
import {UserContext} from "./../../context/UserContext"

const PollDetail = (props) => {
    const {user, setUser} = useContext(UserContext)

    const [poll, setPoll] = useState(props.route.params.poll)
    const [pollUser, setPollUser] = useState({})
    const [pollOptions, setPollOptions] = useState([])

    const [isFavorited, setIsFavorited] = useState(false)

    useEffect(() => {
        const navigationRoutes = props.navigation.dangerouslyGetState().routes
        const prevNavigationName = navigationRoutes[navigationRoutes.length - 2]["name"]

        props.navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity 
                    style={{marginLeft: normalize(16)}}
                    onPress={() => prevNavigationName == "CreatePoll" || prevNavigationName == "EditPoll" ? 
                        props.navigation.navigate("Tabs") : 
                        props.navigation.goBack()
                    }
                >
                    <Ionicons name="arrow-back-sharp" size={normalize(25)} />
                </TouchableOpacity>
            ),
            title: `${pollUser.username || ""}:  ${poll.title}`
        })
    })

    useEffect(() => {
        axios.get(axios.defaults.baseURL + `users/${poll.post.userid}`).then(res => {
            setPollUser(res.data)
        }).catch(err => {
            console.log(err);
        })

        getPollOptions()
    }, [props.route.params.poll])

    const deletePoll = () => {
        axios.delete(axios.defaults.baseURL + `posts/${poll.post_id}`).then(res => {
            console.log(res.data);
            props.navigation.navigate("Tabs")
        }).catch(err => {
            console.log(err);
        })
    }

    const getPollOptions = async () => {
        setPollOptions([])

        axios.get(axios.defaults.baseURL + `poll-options/poll/${poll.id}`).then(async res => {
            for (var i = 0; i < res.data.length; i++) {
                let votes 
                
                try {
                    votes = (await axios.get(axios.defaults.baseURL + "votes")).data
                } catch (err) {
                    console.log(err);
                }
                
                res.data[i]["votes"] = votes ? votes.filter(v => v.polloptionid == res.data[i].ID) : []
            }
            
            setPollOptions(res.data.sort((a, b) => b.votes.length - a.votes.length));
        })
    }

    const getTotalVotes = () => {
        let sum = 0

        pollOptions.forEach(o => sum += o.votes.length)
        return sum
    }

    const isSelected = (option) => {
        return option.votes.map(v => v.userid).includes(user.id)
    }

    const PollBar = (props) => {
        const pollOptionColor = props.selected ? "#56f" : `rgba(0, 0, 0, ${(1 - (props.pos + 1) / pollOptions.length) + (1 / pollOptions.length)})`
        const percentage = props.option.votes.length / getTotalVotes() * 100

        return (
            <View style={{marginLeft: normalize(24)}}>
                <Text style={{color: pollOptionColor, fontSize: normalize(16)}}>
                    {props.option.label}
                </Text>
                <View style={{flexDirection: "row", alignItems: "center", marginLeft: normalize(16), marginRight: normalize(128)}}>
                    <View 
                        style={{
                            height: normalize(35), 
                            width: `${percentage}%`,
                            backgroundColor: pollOptionColor,
                            marginVertical: 4,
                            borderRadius: 0,
                            alignItems: "flex-end",
                            justifyContent: "center",
                            padding: 5,
                        }}
                    >
                    </View>
                    <Text 
                        style={{
                            color: pollOptionColor,
                            fontWeight: "bold", 
                            fontSize: normalize(14),
                            minWidth: 20,
                            marginLeft: 5
                        }}
                    >
                        {numeral(percentage).format("0.[0]")}%
                    </Text>
                </View>
            </View>
        )
    }

    const vote = (option) => {
        if (isSelected(option)) {
            axios.delete(axios.defaults.baseURL + `votes/${option.ID}/${user.id}`).then(res => {
                console.log(res.data);
                getPollOptions()
            }).catch(err => {
                console.log(err);
            })

            return
        }

        pollOptions.filter(o => o.ID != option.ID).forEach(o => {
            if (isSelected(o)) {
                axios.delete(axios.defaults.baseURL + `votes/${o.ID}/${user.id}`).then(res => {
                    console.log(res.data);
                }).catch(err => {
                    console.log(err);
                })
            }
        })

        axios.post(axios.defaults.baseURL + "votes", {
            polloptionid: option.ID,
            userid: user.id
        }).then(res => {
            console.log(res.data);
            getPollOptions()
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <SafeAreaView>
            <ScrollView>  
                <View style={{marginVertical: normalize(32)}}>
                    <View style={{paddingHorizontal: normalize(16)}}>
                        <Text 
                            style={{
                                textAlign: "center", 
                                fontWeight: "bold", 
                                fontSize: normalize(20)
                            }}
                        >
                            {poll.title}
                        </Text>
                        <Text 
                            style={{
                                marginVertical: normalize(16), 
                                textAlign: "center", 
                                fontSize: normalize(16)
                            }}
                        >
                            {poll.description}
                        </Text>
                    </View>
                    <View style={{marginVertical: normalize(16), flexDirection: "row"}}>
                        <View>
                            {
                                pollOptions.map((o, idx) => (
                                    <TouchableOpacity key={idx} onPress={() => vote(o)}>
                                        <PollBar barColor="#000" option={o} pos={idx} selected={isSelected(o)} />
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    </View>
                    <View style={{paddingHorizontal: normalize(16)}}>
                        <View style={{flexDirection: "row", alignItems: "center", marginVertical: normalize(16)}}>
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
                                    {pollUser.username}
                                </Text>
                            </TouchableOpacity>
                            <View style={{flexDirection: "row"}}>
                                <TouchableOpacity>
                                    <Ionicons 
                                        name="create-outline" 
                                        size={normalize(25)} 
                                        color="#000"
                                        onPress={() => props.navigation.navigate("EditPoll", {poll: poll})}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deletePoll()}>
                                    <Ionicons name="trash-outline" size={normalize(25)} color="#000"/>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => setIsFavorited(prev => !prev)} 
                                >
                                    <Ionicons name={isFavorited ? "star" : "star-outline"} size={normalize(25)} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <Text style={{marginRight: "auto", fontWeight: "bold", fontSize: normalize(16)}}>
                                {getTotalVotes()} votes
                            </Text>
                            <Text style={{color: "#0007", fontSize: normalize(16)}}>
                                {moment(poll.post.createdon).format("MMM DD, YYYY")}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PollDetail
