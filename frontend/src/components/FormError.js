import React from 'react'
import { View, Text } from 'react-native'
import { normalize } from 'react-native-elements'

const FormError = (props) => {
    if (props.msg)
        return (
            <View 
                style={{
                    flexDirection: "row", 
                    backgroundColor: "#000", 
                    alignItems: "center",
                    padding: normalize(12),
                    marginVertical: normalize(16),
                    width: "100%"
                }}
            >
                <Text style={{flex: 0.1, color: "#fff", fontSize: normalize(24)}}>!!!</Text>
                <Text 
                    style={{
                        textTransform: "uppercase", 
                        fontWeight: "bold", 
                        color: "#fff", 
                        fontSize: normalize(14), 
                        marginHorizontal: normalize(16),
                        textAlign: "center",
                        flex: 0.8
                    }}
                >
                    {props.msg}
                </Text>
                <Text style={{flex: 0.1, color: "#fff", fontSize: normalize(24)}}>!!!</Text>
            </View>
        )

    return null
}

export default FormError
