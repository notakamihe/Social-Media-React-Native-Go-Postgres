import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Avatar, normalize } from 'react-native-elements'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import numeral from "numeral"

const data = [
    {option: "Los Angeles Lakers", votes: 1000},
    {option: "Minnesota Timberwolves", votes: 200},
    {option: "Oklahoma City Thunder", votes: 700},
    {option: "Golden State Warriors", votes: 600},
    {option: "Milwaukee Bucks", votes: 800},
    {option: "Brooklyn Nets", votes: 1200},
    {option: "Philadelphia 76ers", votes: 400},
    {option: "Miami Heats", votes: 900},
]

const PollDetail = () => {
    const [pollData, setPollData] = useState(data.sort((a, b) => b.votes - a.votes))
    const [isFavorited, setIsFavorited] = useState(false)
    const [pollOptionIdx, setPollOptionIdx] = useState(-1)

    const getTotalVotes = () => {
        return pollData.map(o => o.votes).reduce((accumulator, currentValue) => accumulator + currentValue)
    }

    const PollBar = (props) => {
        const pollColor = props.option.selected ? "#56f" : `rgba(0, 0, 0, ${(1 - (props.pos + 1) / data.length) + 0.25})`

        return (
            <View style={{marginLeft: normalize(8)}}>
                <Text style={{color: pollColor}}>
                    {props.option.option}
                </Text>
                <View style={{flexDirection: "row", alignItems: "center", marginLeft: normalize(16)}}>
                    <View 
                        style={{
                            height: normalize(35), 
                            width: `${props.option.votes / getTotalVotes() * 100}%`,
                            backgroundColor: pollColor,
                            marginVertical: 4,
                            borderRadius: 0,
                            alignItems: "flex-end",
                            justifyContent: "center",
                            padding: 5
                        }}
                    >
                    </View>
                    <Text 
                        style={{
                            color: pollColor,
                            fontWeight: "bold", 
                            fontSize: normalize(14),
                            minWidth: 20,
                            marginLeft: 5
                        }}
                    >
                        {numeral((props.option.votes / getTotalVotes()) * 100).format("0.[0]")}%
                    </Text>
                </View>
            </View>
        )
    }

    const updateVotes = (idx) => {
        const newPollData = [...pollData]
        let deselect = false

        for (let i = 0; i < newPollData.length; i++) {
            if (newPollData[i].selected) {
                newPollData[i].selected = false
                newPollData[i].votes -= 1

                if (i == idx) {
                    deselect = true
                }
            }
        }

        if (!deselect) {
            newPollData[idx]["selected"] = true
            newPollData[idx].votes += 1
        }

        setPollData(newPollData.sort((a, b) => b.votes - a.votes))
    }

    return (
        <SafeAreaView>
            <ScrollView style={{marginTop: normalize(-16)}}>  
                <View style={{marginVertical: normalize(32)}}>
                    <View style={{paddingHorizontal: normalize(16)}}>
                        <Text 
                            style={{
                                textAlign: "center", 
                                fontWeight: "bold", 
                                fontSize: normalize(20)
                            }}
                        >
                            Favorite team of the four
                        </Text>
                        <Text style={{marginVertical: normalize(16), textAlign: "center"}}>
                        Id facilisis dapibus vulputate condimentum parturient nulla sociosqu odio dui ad a a pharetra eu augue molestie sodales euismod condimentum dignissim himenaeos adipiscing a sem adipiscing. A porta parturient id parturient nunc ad.
                        </Text>
                    </View>
                    <View style={{marginVertical: 16, flexDirection: "row", paddingHorizontal: 8}}>
                        <View style={{flex: 0.8}}>
                            {
                                pollData.map((o, idx) => (
                                    <TouchableOpacity key={idx} onPress={() => updateVotes(idx)}>
                                        <PollBar barColor="#000" option={o} pos={idx} />
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                        <View style={{flex: 0.2}}></View>
                    </View>
                    <View style={{paddingHorizontal: normalize(16)}}>
                        <View style={{flexDirection: "row", alignItems: "center", marginVertical: normalize(16)}}>
                            <View style={{flexDirection: "row", alignItems: "center", marginRight: "auto", flexShrink: 1}}>
                                <Avatar 
                                    source={require("./../../../assets/images/defaultpfp.png")}
                                    rounded
                                />
                                <Text style={{marginLeft: normalize(16), flexShrink: 1}}>johndoeisgreat</Text>
                            </View>
                            <TouchableOpacity 
                                onPress={() => setIsFavorited(prev => !prev)} 
                            >
                                <Ionicons name={isFavorited ? "star" : "star-outline"} size={normalize(25)} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <Text style={{marginRight: "auto", fontWeight: "bold"}}>{getTotalVotes()} votes</Text>
                            <Text style={{color: "#0007"}}>June 26, 2017</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PollDetail
