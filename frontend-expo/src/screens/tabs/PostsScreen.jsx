import React, {useRef} from 'react'
import { View, Text, Dimensions, Image, Modal, Picker } from 'react-native'
import { Avatar } from "react-native-elements";
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import { normalize } from '../../utils/utils';
import VideoComponent from '../../components/VideoComponent';
import PhotoComponent from '../../components/PhotoComponent';
import StatementComponent from '../../components/StatementComponent';
import PollComponent from '../../components/PollComponent';

const PostsScreen = (props) => {
    const dropdowmRef = useRef(null)

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={{paddingHorizontal: 16}}>
                <View style={{alignItems: "center", paddingVertical: normalize(48), paddingBottom: normalize(96)}}>
                    <Text 
                        style={{
                            marginVertical: normalize(32), 
                            fontWeight: "bold", 
                            fontSize: normalize(20)
                        }}
                    >
                        Your posts
                    </Text>
                    <TextInput 
                        style={{
                            width: "95%", 
                            borderColor: "#000", 
                            borderWidth: 1, 
                            borderRadius: 15,
                            padding: 8,
                            textAlign: "center"
                        }}
                    />
                    <View 
                        style={{
                            width: "100%", 
                            justifyContent: "center", 
                            flexDirection: "row", 
                            marginVertical: normalize(16),
                            
                        }}
                    >
                        <View style={{borderWidth: 2, borderColor: "#000", borderRadius: 15, marginHorizontal: 8, flex: 0.5}}>
                            <Picker selectedValue="videos" mode="dropdown">
                                <Picker.Item label="All" value="all"/>
                                <Picker.Item label="Videos" value="videos"/>
                                <Picker.Item label="Photos" value="photos"/>
                                <Picker.Item label="Statements" value="statements"/>
                                <Picker.Item label="Polls" value="Polls"/>
                            </Picker>
                        </View>
                        
                        <View style={{borderWidth: 2, borderColor: "#000", borderRadius: 15, marginHorizontal: 8, flex: 0.5}}>
                            <Picker selectedValue="recent" mode="dropdown">
                                <Picker.Item label="Recent" value="recent" />
                                <Picker.Item label="Popular" value="popular" />
                                <Picker.Item label="Oldest" value="oldest" />
                            </Picker>
                        </View>
                    </View>
                    <View style={{alignItems: "center"}}>
                        <VideoComponent showOptions navigation={props.navigation.dangerouslyGetParent()} />
                        <PhotoComponent showOptions navigation={props.navigation.dangerouslyGetParent()} />
                        <StatementComponent showOptions navigation={props.navigation.dangerouslyGetParent()} />
                        <PollComponent showOptions navigation={props.navigation.dangerouslyGetParent()} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PostsScreen