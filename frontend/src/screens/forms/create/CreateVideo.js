import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { CheckBox } from 'react-native-elements'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormError from '../../../components/FormError'
import { normalize } from '../../../utils/utils'
import {launchImageLibrary} from "react-native-image-picker";
import axios from "axios";
import { UserContext } from "./../../../context/UserContext";
import Video from "react-native-video"

const CreateVideo = (props) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [videoUri, setVideoUri] = useState("")
    const [thumbnailUri, setThumbnailUri] = useState("")
    const [error, setError] = useState("")
    const {user, setUser} = useContext(UserContext)

    const [paused, setPaused] = useState(false)

    const errorRef = useRef()

    const createVideo = async () => {
        setError("")

        if (!videoUri) {
            setError("Must provide a video.")
            errorRef.current.scrollToEnd({animated: true})
            return
        }

        let videoResponse
        let formData = new FormData()

        formData.append("file", {
            uri: videoUri,
            name: videoUri.split("/")[videoUri.split("/").length - 1],
            type: "video/mp4"
        })

        formData.append('thumbnail', thumbnailUri ? {
            uri: thumbnailUri,
            name: thumbnailUri.split("/")[thumbnailUri.split("/").length - 1],
            type: `image/${thumbnailUri.substring(thumbnailUri.lastIndexOf(".") + 1)}`
        } : null)

        try {
            videoResponse = await axios.post(axios.defaults.baseURL + "videos", {
                userid: user.id,
                title,
                description,
                private: isPrivate
            })
        } catch (err) {
            setError(err.response.data)
            errorRef.current.scrollToEnd({animated: true})
            return
        }

        try {
            await axios({
                method: "put",
                url: axios.defaults.baseURL + `videos/${videoResponse.data.postid}/file`,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" }
            })
        } catch (err) {
            setError(err.response.data)
            errorRef.current.scrollToEnd({animated: true})
            return
        }

        if (thumbnailUri) {
            try {
                await axios({
                    method: "put",
                    url: axios.defaults.baseURL + `videos/${videoResponse.data.postid}/thumbnail`,
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" }
                })
            } catch (err) {
                setError(err.response.data)
                errorRef.current.scrollToEnd({animated: true})
                return
            }
        }

        axios.get(axios.defaults.baseURL + `posts/${videoResponse.data.postid}`).then(res => {
            console.log(res.data);
            props.navigation.navigate("VideoDetail", {video: res.data})
        }).catch(err => {
            console.log(err);
        })
    }

    const handleThumbnail = () => {
        if (thumbnailUri)
            return { uri: thumbnailUri || axios.defaults.baseURL + video.thumbnailurl }

        return require("./../../../../assets/images/image-placeholder.png")
    }

    const setVideoFrame = () => {
        setPaused(false)
        setTimeout(() => {
            setPaused(true)
        }, 100)
    }

    const openPicker = async (mediaType) => {
        const options = {
            mediaType: mediaType
        }

        launchImageLibrary(options, response => {
            if (!response.didCancel && response.uri) {
                switch (mediaType) {
                    case "video":
                        setVideoUri(response.uri)
                        setVideoFrame()
                        break
                    case "photo":
                        setThumbnailUri(response.uri)
                        break
                }
            }
        })
    }

    return (
        <SafeAreaView>
            <ScrollView ref={errorRef}>
                <View style={{flex: 1, alignItems: "center", paddingVertical: normalize(24)}}>
                    <TextInput
                        style={{
                            borderColor: "#000",
                            borderWidth: 1.5,
                            marginVertical: normalize(24),
                            width: "90%",
                            borderRadius: 15,
                            padding: normalize(8),
                            textAlign: "center",
                            fontSize: normalize(16)
                        }}
                        placeholder="Title"
                        placeholderTextColor="#0004"
                        onChangeText={v => setTitle(v)}
                        value={title}
                    />
                    <View style={{position: "relative"}}>
                        {
                            videoUri ?

                            <Video
                                source={{ uri: videoUri }}
                                style={{
                                    width: Dimensions.get("window").width,
                                    height: Dimensions.get("window").width * 9 / 16
                                }}
                                seek={1}
                                paused={paused}
                                resizeMode="cover"
                            /> :
                            <AutoHeightImage
                                source={require("./../../../../assets/images/video-placeholder.jpg")} 
                                width={Dimensions.get("window").width}
                            /> 
                        }

                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                bottom: normalize(8),
                                right: normalize(8),
                                padding: 8,
                                borderWidth: 1,
                                borderColor: "#000",
                                borderRadius: 30,
                                backgroundColor: "#fff"
                            }}
                        >
                            <Text 
                                style={{textTransform: "uppercase", fontWeight: "bold", fontSize: normalize(14)}}
                                onPress={() => openPicker("video")}
                            >
                                Select video
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{position: "relative"}}>
                        <AutoHeightImage
                            source={handleThumbnail()} 
                            width={Dimensions.get("window").width}
                        >
                            
                        </AutoHeightImage>
                        <View
                            style={{
                                position: "absolute",
                                bottom: normalize(8),
                                right: normalize(8),
                                flexDirection: "row"
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    padding: 8,
                                    borderWidth: 1,
                                    borderColor: "#000",
                                    borderRadius: 30,
                                    marginHorizontal: normalize(4),
                                    backgroundColor: "#fff"
                                }}
                            >
                                <Text 
                                    style={{textTransform: "uppercase", fontWeight: "bold", fontSize: normalize(14)}}
                                    onPress={() => openPicker("photo")}
                                >
                                    Select thumbnail
                                </Text>
                            </TouchableOpacity>
                            {
                                thumbnailUri ?

                                <TouchableOpacity
                                    style={{
                                        padding: 8,
                                        borderWidth: 1,
                                        borderColor: "#000",
                                        borderRadius: 30,
                                        marginHorizontal: normalize(4),
                                        backgroundColor: "#fff"
                                    }}
                                >
                                    <Text 
                                        style={{
                                            textTransform: "uppercase", 
                                            fontWeight: "bold", 
                                            fontSize: normalize(14)
                                        }}
                                        onPress={() => setThumbnailUri("")}
                                    >
                                        Remove thumbnail
                                    </Text>
                                </TouchableOpacity> : null
                            }
                        </View>
                    </View>
                   
                    <TextInput
                        style={{
                            borderColor: "#000",
                            borderWidth: 1.5,
                            marginVertical: normalize(24),
                            width: "90%",
                            borderRadius: 15,
                            padding: normalize(8),
                            textAlign: "center",
                            fontSize: normalize(16)
                        }}
                        placeholder="Description"
                        placeholderTextColor="#0004"
                        multiline
                        onChangeText={v => setDescription(v)}
                        value={description}
                    />
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", width: "80%"}}>
                        <CheckBox
                            title="Private"
                            checked={isPrivate}
                            checkedColor="#000"
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            iconRight
                            containerStyle={{
                                backgroundColor: "#0000",
                                borderColor: "#0000"
                            }}
                            textStyle={{
                                fontSize: normalize(16)
                            }}
                            onPress={() => setIsPrivate(prev => !prev)}
                        />
                        <TouchableOpacity 
                            style={{
                                marginLeft: normalize(16),
                                borderRadius: 10,
                                borderColor: "#000",
                                borderWidth: 2,
                                padding: normalize(12)
                            }}
                            onPress={() => createVideo()}
                        >
                            <Text 
                                style={{textTransform: "uppercase", fontWeight: "bold", fontSize: normalize(18)}}
                            >
                                Create
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <FormError msg={error} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CreateVideo
