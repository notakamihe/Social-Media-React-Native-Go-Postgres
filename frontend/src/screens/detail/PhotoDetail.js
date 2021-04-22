import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons"
import {Avatar, normalize} from "react-native-elements"
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { decode } from 'html-entities';

const PhotoDetail = (props) => {
    const [showComments, setShowComments] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isCommentedOn, setIsCommentedOn] = useState(false)
    const [isFavorited, setIsFavorited] = useState(true)
    const [isPrivate, setIsPrivate] = useState(true)

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
                <ScrollView>
                    <View style={{width: "100%", marginVertical: normalize(32)}}>
                        <View style={{width: "100%"}}>
                            <Text 
                                style={{
                                    fontSize: normalize(18), 
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    marginHorizontal: normalize(16)
                                }}
                            >
                                This will be the placeholder title of the image
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
                                    <Text 
                                        style={{
                                            flexShrink: 1, 
                                            marginLeft: normalize(8), 
                                            fontSize: normalize(16)
                                        }}
                                    >
                                        johndoeisgreat
                                    </Text>
                                </TouchableOpacity>
                                <Text 
                                    style={{color: "#0007", marginLeft: normalize(16), fontSize: normalize(16)}}
                                >
                                    Apr 17, 2017
                                </Text>
                            </View>
                        </View>
                        <View>
                            <AutoHeightImage
                                source={require("./../../../assets/images/image-placeholder.png")}
                                resizeMode="contain"
                                width={Dimensions.get("window").width}
                                style={{
                                    borderColor: "#000",
                                    borderRightWidth: 0,
                                    borderLeftWidth: 0,
                                    borderWidth: 2,
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
                                    <Ionicons name="eye-outline" size={normalize(16)}/>
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
                                    <Ionicons name={isLiked ? "heart" : "heart-outline"} size={normalize(16)}/>
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
                                    <Ionicons name={isCommentedOn ? "chatbox" : "chatbox-outline"} size={normalize(16)}/>
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
                                            onPress={() => props.navigation.navigate("EditPhoto")}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons name="trash-outline" size={normalize(25)} color="#000"/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={{padding: normalize(16)}}>
                            <Text style={{textAlign: "center", fontSize: normalize(16)}}>
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
                        <Text style={{fontWeight: "bold", fontSize: normalize(16)}}>Show comments</Text>
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
                                        flexShrink: 1,
                                        fontSize: normalize(14)
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

export default PhotoDetail