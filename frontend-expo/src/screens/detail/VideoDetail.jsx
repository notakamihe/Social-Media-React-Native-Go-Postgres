import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import { Video } from "expo-av";
import Ionicons from "react-native-vector-icons/Ionicons"
import {Avatar, normalize} from "react-native-elements"
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import Collapsible from "react-native-collapsible"
import { decode } from 'html-entities';
import { useScrollToTop } from '@react-navigation/native';

const VideoDetail = (props) => {
    const [showThumbnail, setShowThumbnail] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isCommentedOn, setIsCommentedOn] = useState(false)
    const [isFavorited, setIsFavorited] = useState(true)
    const [isPrivate, setIsPrivate] = useState(false)

    const commentRef = useRef()

    const viewCommentOrCreate = () => {
        if (isCommentedOn) {
            setShowComments(true)
            commentRef.current.scrollTo({x: 0, y: 0, animated: true})
        } else {
            props.navigation.navigate("CreateComment")
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 12, borderBottomWidth: 1}}>
                <ScrollView style={{marginTop: normalize(-16)}}>
                    <View style={{width: "100%"}}>
                        <View style={{width: "100%"}}>
                            <Text style={{fontSize: normalize(18), fontWeight: "bold", marginLeft: normalize(16)}}>
                                This will be the placeholder title of the video
                            </Text>
                            <View 
                                style={{
                                    flexDirection: "row", 
                                    width: "100%", 
                                    marginVertical: normalize(16),
                                    paddingHorizontal: normalize(16),
                                    alignItems: "center"
                                }}
                            >
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
                                <TouchableOpacity 
                                    style={{
                                        marginLeft: normalize(16),  
                                        backgroundColor: "#00000015", 
                                        padding: normalize(8),
                                        borderRadius: 5
                                    }}
                                    onPress={() => setShowThumbnail(prev => !prev)}
                                >
                                    <Text style={{fontSize: normalize(12)}}>Toggle thumbnail</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <Video 
                                source={require("./../../../assets/videos/video2.mp4")}
                                useNativeControls
                                resizeMode="contain"
                                style={{
                                    width: Dimensions.get("window").width, 
                                    height: Dimensions.get("window").width * 9 / 16,
                                    borderWidth: 2,
                                    borderRightWidth: 0,
                                    borderLeftWidth: 0,
                                    display: showThumbnail ? "none" : 'flex'
                                }}
                            />
                            <AutoHeightImage
                                source={require("./../../../assets/images/image-placeholder.png")}
                                resizeMode="contain"
                                width={Dimensions.get("window").width}
                                style={{
                                    borderColor: "#000",
                                    borderWidth: 2,
                                    borderRightWidth: 0,
                                    borderLeftWidth: 0,
                                    display: showThumbnail ? "flex" : "none"
                                }}
                            />
                            <View 
                                style={{
                                    position: "absolute",
                                    top: normalize(8),
                                    right: normalize(8),
                                    zIndex: 300,
                                    flexDirection: "row"
                                }}
                            >
                                <Ionicons 
                                    name={isPrivate ? "lock-closed-outline" : "lock-open-outline"} 
                                    size={20} 
                                    color="#000" 
                                />
                                <TouchableOpacity 
                                    onPress={() => setIsFavorited(prev => !prev)} 
                                >
                                    <Ionicons name={isFavorited ? "star" : "star-outline"} size={20} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View 
                            style={{
                                flexDirection: "row", 
                                marginTop: normalize(8),
                                paddingHorizontal: normalize(16)}}
                            >
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
                            </View>
                            <Text style={{color: "#0007"}}>Apr 17, 2017</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "center", marginVertical: normalize(8)}}>
                            <TouchableOpacity>
                                <Ionicons 
                                    name="create-outline" 
                                    size={normalize(25)} 
                                    color="#000"
                                    onPress={() => props.navigation.navigate("EditVideo")}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons name="trash-outline" size={normalize(25)} color="#000"/>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginBottom: normalize(16)}}>
                            <Text style={{textAlign: "center"}}>
                                Amet a nec senectus suspendisse a elit proin nec a condimentum fusce pulvinar a et tristique curabitur ullamcorper sem iaculis enim taciti praesent elementum sapien posuere bibendum faucibus sagittis.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <View style={{flex: showComments ? 6 : 1}}>
                {
                    showComments ? null :
                    <TouchableOpacity 
                        style={{justifyContent: "center", alignItems: "center", height: "100%"}}
                        onPress={() => setShowComments(prev => !prev)}
                    >
                        <Text style={{fontWeight: "bold"}}>Show comments</Text>
                    </TouchableOpacity>
                }

                {
                    showComments ? 
                    <TouchableOpacity 
                        onPress={() => setShowComments(prev => !prev)} 
                        style={{
                            position: "absolute",
                            top: normalize(0),
                            right: normalize(0),
                            zIndex: 300
                        }}
                    >
                        <Ionicons name="close-circle" size={30} color="#0003" />
                    </TouchableOpacity> : null
                }

                <ScrollView ref={commentRef}>
                    <View style={{alignItems: "center", paddingVertical: normalize(16)}}>
                        <View 
                            style={{
                                flexDirection: "row",
                                borderColor: "#000",
                                borderWidth: 1,
                                width: "90%",
                                borderRadius: 5,
                                padding: 8,
                                marginVertical: normalize(8)
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
                                width: "90%",
                                borderRadius: 5,
                                padding: normalize(8),
                                marginVertical: normalize(8)
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
                </ScrollView>
            </View>
        </SafeAreaView>
        
    )
}

export default VideoDetail
