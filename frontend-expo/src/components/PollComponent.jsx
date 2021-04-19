import React, {useState} from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { navigate, normalize } from '../utils/utils'
import Ionicons from "react-native-vector-icons/Ionicons";
import Popover from 'react-native-popover-view/dist/Popover';

const PollComponent = (props) => {
    const [visible, setVisible] = useState(false)

    const PollBar = (props) => (
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <View 
                style={{
                    height: normalize(25), 
                    width: `${props.barPercentage}%`,
                    backgroundColor: props.barColor,
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
                    color: props.barColor, 
                    fontWeight: "bold", 
                    fontSize: normalize(14),
                    minWidth: 20,
                    marginLeft: 5
                }}
            >
                {props.barPercentage}%
            </Text>
        </View>
    )

    return (
        <TouchableOpacity 
            style={{minWidth: "100%", alignItems: "center", marginVertical: normalize(16)}} 
            onPress={() => navigate(props.navigation, "PollDetail")}
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
                <Text style={{fontWeight: "bold"}}>Favorite team out of the 4</Text>
                <View style={{marginTop: 16, flexDirection: "row", paddingHorizontal: 8}}>
                    <View style={{flex: 1, paddingRight: 24}}>
                        <PollBar barColor="#000" barPercentage={60} />
                        <PollBar barColor="#555" barPercentage={25} />
                        <PollBar barColor="#888" barPercentage={10} />
                        <PollBar barColor="#bbb" barPercentage={5} />
                        
                        <View style={{marginTop: 16}}>
                            <Text style={{color: "#000"}} numberOfLines={2}>Los Angeles Lakers</Text>
                            <Text style={{color: "#555"}} numberOfLines={2}>Minnesota Timberwolves</Text>
                            <Text style={{color: "#888"}} numberOfLines={2}>Oklahoma City Thunder</Text>
                            <Text style={{color: "#bbb"}} numberOfLines={2}>Golden State Warriors</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text>1609 votes</Text>
                <View>
                    {
                        props.showOptions ?
                    
                        <Popover
                            from={(
                                <TouchableOpacity 
                                    style={{flexDirection: "row", alignItems: "center", marginHorizontal: 6, padding: normalize(8)}}
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
                                    if (props.navigation) {
                                        navigate(props.navigation, "EditPoll") 
                                        setVisible(false)
                                    }
                                }}
                            >
                                <Text>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{marginVertical: normalize(8)}}
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
