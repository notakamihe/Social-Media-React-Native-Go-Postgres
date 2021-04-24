import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { CheckBox } from 'react-native-elements'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { launchImageLibrary } from 'react-native-image-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormError from '../../../components/FormError'
import { UserContext } from '../../../context/UserContext'
import { normalize } from '../../../utils/utils'

const CreatePhoto = (props) => {
    const {user, setUser} = useContext(UserContext)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [photoUri, setPhotoUri] = useState("")

    const [error, setError] = useState("")

    const errorRef = useRef()

    const createPhoto = async () => {
        let photoResponse
        let formData = new FormData()

        setError("")
        
        if (!photoUri) {
            setError("Must provide a photo.")
            errorRef.current.scrollToEnd({animated: true})
            return
        }

        try {
            photoResponse = await axios.post(axios.defaults.baseURL + "photos", {
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
            formData.append("file", {
                uri: photoUri,
                name: photoUri.split("/")[photoUri.split("/").length - 1],
                type: `image/${photoUri.substring(photoUri.lastIndexOf(".") + 1)}`
            })   

            await axios({
                method: "put",
                url: axios.defaults.baseURL + `photos/${photoResponse.data.postid}/file`,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" }
            })
        } catch (err) {
            setError(err.response.data)
            errorRef.current.scrollToEnd({animated: true})
            return
        }

        axios.get(axios.defaults.baseURL + `posts/${photoResponse.data.postid}`).then(res => {
            console.log(res.data);
            props.navigation.navigate("PhotoDetail", {photo: res.data})
        }).catch(err => {
            console.log(err);
        })
    }

    const openPicker = async () => {
        const options = {
            mediaType: "photo"
        }

        launchImageLibrary(options, response => {
            if (!response.didCancel && response.uri) {
                setPhotoUri(response.uri)
            }
        })
    }

    return (
        <SafeAreaView>
            <ScrollView ref={errorRef}>
                <View style={{flex: 1, alignItems: "center", paddingVertical : normalize(24)}}>
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
                        onChangeText={v => setTitle(v)}
                        value={title}
                    />
                    <View style={{position: "relative"}}>
                        <AutoHeightImage
                            source={
                                photoUri ? {uri: photoUri} :
                                require("./../../../../assets/images/image-placeholder.png")
                            } 
                            width={Dimensions.get("window").width}
                        />
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
                                onPress={() => openPicker()}
                            >
                                Select image
                            </Text>
                        </TouchableOpacity>
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
                            onPress={() => createPhoto()}
                        >
                            <Text 
                                style={{textTransform: "uppercase", fontWeight: "bold", fontSize: normalize(18)}}
                            >
                                Post
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <FormError msg={error} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CreatePhoto
