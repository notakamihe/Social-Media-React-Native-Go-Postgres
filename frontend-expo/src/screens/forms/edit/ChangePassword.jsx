import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import FormError from '../../../components/FormError'
import { normalize } from '../../../utils/utils'

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [error, setError] = useState("")

    const changePassword = () => {
        setError("")
        console.log(currentPassword, newPassword, confirmNewPassword);
        setError("Could not update password")
    }

    return (
        <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
            <TextInput 
                style={{
                    borderColor: "#000",
                    borderWidth: 2,
                    borderRadius: 10,
                    width: "90%",
                    padding: normalize(8),
                    marginVertical: normalize(12),
                    paddingLeft: normalize(16)
                }}
                onChangeText={text => setCurrentPassword(text)}
                value={currentPassword}
                placeholder="Current password"
            />
            <TextInput 
                style={{
                    borderColor: "#000",
                    borderWidth: 2,
                    borderRadius: 10,
                    width: "90%",
                    padding: normalize(8),
                    marginVertical: normalize(12),
                    paddingLeft: normalize(16)
                }}
                onChangeText={text => setNewPassword(text)}
                value={newPassword}
                placeholder="New password"
            />
            <TextInput 
                style={{
                    borderColor: "#000",
                    borderWidth: 2,
                    borderRadius: 10,
                    width: "90%",
                    padding: normalize(8),
                    marginVertical: normalize(12),
                    paddingLeft: normalize(16)
                }}
                onChangeText={text => setConfirmNewPassword(text)}
                value={confirmNewPassword}
                placeholder="Confirm new password"
            />
            <TouchableOpacity
                style={{
                    borderColor: "#000",
                    borderWidth: 2, 
                    padding: normalize(12),
                    borderRadius: 10,
                    marginTop: normalize(32)
                }}
                onPress={() => changePassword()}
            >
                <Text 
                    style={{fontWeight: "bold", textTransform: "uppercase"}}
                >
                    Change
                </Text>
            </TouchableOpacity>
            <FormError msg={error} />
        </View>
    )
}

export default ChangePassword
