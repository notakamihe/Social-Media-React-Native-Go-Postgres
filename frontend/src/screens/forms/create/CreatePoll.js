import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormError from '../../../components/FormError'
import { normalize } from '../../../utils/utils'
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios"
import {UserContext} from "./../../../context/UserContext"

const CreatePoll = (props) => {
    const {user, setUser} = useContext(UserContext)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [options, setOptions] = useState([
        {label: ""},
        {label: ""}
    ])

    const [error, setError] = useState("")

    const errorRef = useRef()

    const addOption = () => {
        const newOption = {
            content: ""
        }

        setOptions(prev => [...prev, newOption])
    }

    const createPoll = async () => {
        let pollResponse

        setError("")
        
        if (!options.every(o => o.label)) {
            setError("All poll choices must not be blank")
            errorRef.current.scrollToEnd({animated: true})
            return
        }

        try {
            pollResponse = await axios.post(axios.defaults.baseURL + "polls", {
                userid: user.id,
                title,
                description
            })
        } catch (err) {
            setError(err.response.data)
            errorRef.current.scrollToEnd({animated: true})
            return
        }

        options.forEach(async o => {
            let pollOptionResponse 

            try {
                pollOptionResponse = await axios.post(axios.defaults.baseURL + "poll-options", {
                    pollid: pollResponse.data.ID,
                    label: o.label
                })

            } catch (err) {
                console.log(err);
            }

            console.log(pollOptionResponse.data);
        })

        axios.get(axios.defaults.baseURL + `posts/${pollResponse.data.postid}`).then(res => {
            console.log(res.data);
            props.navigation.navigate("PollDetail", {poll: res.data})
        }).catch(err => {
            console.log(err);
        })
    }

    const setOptionContent = (idx, v) => {
        const newOptions = options.map((o, index) => {
            if (index === idx) {
                o.label = v
            }

            return o;
        })

        setOptions(newOptions)
    }

    const removeOption = (idx) => {
        if (options.length > 2) {
            const newOptions = options.slice(0, idx).concat(options.slice(idx + 1))
            setOptions(newOptions)
        }
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
                    
                   
                    <TextInput
                        style={{
                            borderColor: "#000",
                            borderWidth: 1.5,
                            marginBottom: normalize(16),
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
                    <View style={{width: "100%", alignItems: "center", marginVertical: normalize(16), marginBottom: normalize(32)}}>
                        <View style={{marginVertical: normalize(16), width: "80%"}}>
                            {
                                options.map((o, idx) => (
                                    <View
                                        key={idx}
                                        style={{
                                            backgroundColor: '#000',
                                            width: "100%",
                                            padding: normalize(8),
                                            borderRadius: 10,
                                            marginVertical: normalize(8),
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}
                                    >
                                        <TextInput 
                                            style={{
                                                flex: 0.9,
                                                color: "#fff",
                                                padding: normalize(8),
                                                fontSize: normalize(16)
                                            }}
                                            placeholder="Option label"
                                            placeholderTextColor="#fff9"
                                            multiline
                                            returnKeyType="none"
                                            blurOnSubmit={true}
                                            onChangeText={v => setOptionContent(idx, v)}
                                            value={o.label}
                                        />
                                        <TouchableOpacity 
                                            style={{marginLeft: "auto"}} 
                                            onPress={() => removeOption(idx)}
                                        >
                                            <Ionicons 
                                                name="remove-circle-outline" 
                                                color="#fff" size={normalize(25)} 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            }
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="add-circle-outline" size={normalize(45)} onPress={() => addOption()} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        style={{
                            borderRadius: 10,
                            borderColor: "#000",
                            borderWidth: 2,
                            padding: normalize(12)
                        }}
                        onPress={() => createPoll()}
                    >
                        <Text 
                            style={{textTransform: "uppercase", fontWeight: "bold", fontSize: normalize(18)}}
                        >
                            Create
                        </Text>
                    </TouchableOpacity>
                    <FormError msg={error} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CreatePoll
