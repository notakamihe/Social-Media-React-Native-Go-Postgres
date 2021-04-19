import React, { useState } from 'react'
import { View, Text, Dimensions, Image, Touchable, TouchableOpacity } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import { Video } from "expo-av";
import { navigate, normalize } from '../utils/utils';
import { decode } from 'html-entities';
import { Avatar } from 'react-native-elements';
import Popover from 'react-native-popover-view';

const VideoComponent = (props) => {
    const widthPercentage = props.widthPercentage || 0.8
    const [visible, setVisible] = useState(false)

    return (
        <TouchableOpacity 
            style={{
                alignItems: "center",
                marginVertical: normalize(16)
            }}
            onPress={() => navigate(props.navigation, "VideoDetail")}
        >
            <Video 
                source={require("./../../assets/videos/video2.mp4")} 
                useNativeControls
                resizeMode="cover"
                style={{
                    width: Dimensions.get("window").width * widthPercentage, 
                    height: ( Dimensions.get("window").width * widthPercentage) * 9 / 16,
                    borderRadius: 5,
                    borderWidth: 2
                }}
            />
            <Text 
                style={{fontWeight: "bold", marginTop: 8}} 
                numberOfLines={1}
            >
                This is the title of my amazing video
            </Text>
            <View style={{flexDirection: "row", marginTop: 4}}>
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
                    <Ionicons name="heart-outline" size={18} color="#000"/>
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
                                    navigate(props.navigation, "EditVideo") 
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

export default VideoComponent
