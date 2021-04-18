import React, {useState} from 'react'
import { View, Text, Dimensions, Image, TouchableOpacity } from 'react-native'
import { navigate, normalize } from '../utils/utils'
import Ionicons from "react-native-vector-icons/Ionicons";
import { Avatar } from 'react-native-elements';
import {decode} from "html-entities";
import Popover from 'react-native-popover-view/dist/Popover';

const StatementComponent = (props) => {
    const [visible, setVisible] = useState(false)

    return (
        <TouchableOpacity 
            style={{
                marginVertical: normalize(16), 
                width: "100%",
                alignItems: "center"
            }}
            onPress={() => navigate(props.navigation, "StatementDetail")}
        >
            <Text 
                style={{
                    padding: normalize(15),
                    borderColor: "#000", 
                    borderWidth: 2, 
                    borderRadius: 15,
                    fontSize: normalize(15),
                    textAlign: "center",
                    fontStyle: "italic"
                }}
            >
            met a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur ullamcorper sem iaculis enim taciti praesent elementum sapien posuere bibendum faucibus sagittis. Id facilisis dapibus vulputate condimentum parturient nulla sociosqu odio dui ad a a pharetra eu augue df
            </Text>
            <View style={{flexDirection: "row", marginVertical: 8}}>
                <Avatar size={20} rounded source={require("./../../assets/images/defaultpfp.png")} />
                <Text style={{marginLeft: 16}}>johndoeisgreat {decode("&#183")} 2d</Text>
            </View>
            <View 
                style={{
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "center"
                }}
            >
                <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: 6}}>
                    <Ionicons name="eye-outline" size={18} color="#000"/>
                    <Text style={{marginLeft: normalize(4), fontWeight: "bold", color: "#000"}}>700K</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: 6}}>
                    <Ionicons name="thumbs-up-outline" size={18} color="#000"/>
                    <Text style={{marginLeft: normalize(4), fontWeight: "bold", color: "#000"}}>50K</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: 6}}>
                    <Ionicons name="chatbox-outline" size={18} color="#000"/>
                    <Text style={{marginLeft: normalize(4), fontWeight: "bold", color: "#000"}}>8K</Text>
                </View>
                {
                    props.showOptions ?
                
                    <Popover
                        from={(
                            <TouchableOpacity 
                                style={{flexDirection: "row", alignItems: "center", marginHorizontal: 6}}
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
                                    navigate(props.navigation, "EditStatementTouchableOpacity") 
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
        </TouchableOpacity>
    )
}

export default StatementComponent
