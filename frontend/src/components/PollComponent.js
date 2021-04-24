import React, {useContext, useEffect, useState} from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { normalize, timeAgoShort } from '../utils/utils'
import Ionicons from "react-native-vector-icons/Ionicons";
import Popover from 'react-native-popover-view/dist/Popover';
import { Avatar } from 'react-native-elements';
import { decode } from 'html-entities';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import numeral from "numeral"

const PollComponent = (props) => {
    const {user, setUser} = useContext(UserContext)

    const [pollOptions, setPollOptions] = useState([])
    const [pollUser, setPollUser] = useState({})

    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (props.poll) {
            axios.get(axios.defaults.baseURL + `users/${props.poll.post.userid}`).then(res => {
                setPollUser(res.data)
            }).catch(err => {
                console.log(err);
            })

            getPollOptions()
        }
    }, [])

    useEffect(() => {
        const onFocus = props.navigation.addListener("focus", () => {
            if (props.poll) {
                axios.get(axios.defaults.baseURL + `users/${props.poll.post.userid}`).then(res => {
                    setPollUser(res.data)
                }).catch(err => {
                    console.log(err);
                })
    
                getPollOptions()
            }
        });
    
        return onFocus;
    }, [props.navigation])

    const deletePoll = () => {
        axios.delete(axios.defaults.baseURL + `posts/${props.poll.post_id}`).then(res => {
            console.log(res.data);
            props.getPosts()
            setVisible(false)
        }).catch(err => {
            console.log(err);
        })
    }

    const getColor = (o, idx) => {
        return isSelected(o) ? "#56f" : `rgba(0, 0, 0, ${(1 - (idx + 1) / pollOptions.length) + (1 / pollOptions.length)})`
    }

    const getPollOptions = async () => {
        setPollOptions([])

        axios.get(axios.defaults.baseURL + `poll-options/poll/${props.poll.id}`).then(async res => {
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
        return user && option.votes.map(v => v.userid).includes(user.id)
    }

    const PollBar = (props) => {
        const color = getColor(props.option, props.pos)
        const percentage = props.option.votes.length / getTotalVotes() * 100

        return (
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <View 
                    style={{
                        height: normalize(16), 
                        width: `${percentage}%`,
                        backgroundColor: color,
                        marginVertical: 4,
                        borderRadius: 5,
                        alignItems: "flex-end",
                        justifyContent: "center",
                        padding: 5
                    }}
                >
                </View>
                <Text 
                    style={{
                        color: color, 
                        fontWeight: "bold", 
                        fontSize: normalize(14),
                        minWidth: 20,
                        marginLeft: 5
                    }}
                >
                    {numeral(percentage).format("0.[0]")}%
                </Text>
            </View>
        )
    }

    return (
        <TouchableOpacity 
            style={{minWidth: "100%", alignItems: "center", marginVertical: normalize(16)}} 
            onPress={() => props.navigation.navigate("PollDetail", {poll: props.poll})}
        >
            <View 
                style={{
                    marginVertical: normalize(16), 
                    borderWidth: 2,
                    minWidth: "100%",
                    padding: 8,
                    borderRadius: 10,
                    alignItems: 'center'
                }}
            >
                <Text style={{fontWeight: "bold", fontSize: normalize(16)}}>
                    {props.poll ? props.poll.title : ""}
                </Text>
                <View style={{marginTop: normalize(16), flexDirection: "row", paddingHorizontal: normalize(8)}}>
                    <View style={{flex: 1, paddingRight: normalize(32)}}>
                        {
                            pollOptions.map((o, idx) => (
                                <PollBar key={idx} option={o} pos={idx} />
                            ))
                        }
                        
                        <View style={{marginTop: 16}}>
                            {
                                pollOptions.map((o, idx) => (
                                    <Text 
                                        key={idx}
                                        style={{
                                            color: getColor(o, idx), 
                                            fontSize: normalize(16), 
                                            fontWeight: "bold"
                                        }} 
                                        numberOfLines={2}
                                    >
                                        {o.label}
                                    </Text>
                                ))
                            }
                        </View>
                    </View>
                </View>
            </View>
            {
                props.hideUser ? null :
                
                <View 
                    style={{
                        flexDirection: "row", 
                        marginVertical: props.showOptions ? 0 : normalize(4),
                        marginTop: normalize(4)
                    }}
                >
                    <Avatar size={normalize(20)} rounded source={require("./../../assets/images/defaultpfp.png")} />
                    <Text style={{marginLeft: 16, fontSize: normalize(16)}}>
                        {pollUser.username} {decode("&#183") + " "} 
                        {props.poll ? timeAgoShort(props.poll.post.createdon) : ""}
                    </Text>
                </View>
            }
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text style={{fontSize: normalize(16), marginRight: normalize(8)}}>{getTotalVotes()} votes</Text>
                <View>
                    {
                        props.showOptions ?
                    
                        <Popover
                            from={(
                                <TouchableOpacity 
                                    style={{flexDirection: "row", alignItems: "center", marginHorizontal: 6, padding: normalize(4)}}
                                    onPress={() => setVisible(true)}
                                >
                                    <Ionicons name="ellipsis-horizontal-outline" size={18} color="#000"/>
                                </TouchableOpacity>
                            )}
                            popoverStyle={{
                                paddingHorizontal: normalize(16),
                                paddingVertical: normalize(8)
                            }}
                            verticalOffset={normalize(-15)}
                            arrowStyle={{
                                backgroundColor: "#0000"
                            }}
                            isVisible={visible}
                            onRequestClose={() => setVisible(false)}
                        >
                            
                            <TouchableOpacity 
                                style={{marginVertical: normalize(8)}} 
                                onPress={() => { 
                                    setVisible(false)
                                    props.navigation.navigate("EditPoll", {poll: props.poll})
                                }}
                            >
                                <Text>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{marginVertical: normalize(8)}}
                                onPress={() => deletePoll()}
                            >
                                <Text>Delete</Text>
                            </TouchableOpacity>
                        </Popover> : null
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default PollComponent
