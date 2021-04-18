import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { Tabs, StartScreen } from './src/screens/index'
import { CreateComment, CreatePhoto, CreatePoll, CreateStatement, CreateVideo } from './src/screens/forms/create'
import {EditVideo, EditPhoto, EditPoll, EditStatement, EditComment} from './src/screens/forms/edit'
import { PhotoDetail, PollDetail, StatementDetail, VideoDetail } from './src/screens/detail'

const Stack = createStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Start">
                <Stack.Screen name="Start" component={StartScreen} options={{headerShown: false}} />
                <Stack.Screen name="Tabs" component={Tabs} options={{headerShown: false}} />

                <Stack.Screen name="CreateVideo" component={CreateVideo}options={{title: "Create a video"}} />
                <Stack.Screen name="CreatePhoto" component={CreatePhoto} options={{title: "Post a photo"}} />
                <Stack.Screen name="CreateStatement" component={CreateStatement} options={{title: "Make a statment"}} />
                <Stack.Screen name="CreatePoll" component={CreatePoll} options={{title: "Open a poll"}} />
                <Stack.Screen name="CreateComment" component={CreateComment} options={{title: "Add a comment"}} />

                <Stack.Screen name="EditVideo" component={EditVideo} options={{title: "Edit video"}} />
                <Stack.Screen name="EditPhoto" component={EditPhoto} options={{title: "Edit photo"}} />
                <Stack.Screen name="EditStatement" component={EditStatement} options={{title: "Edit statment"}} />
                <Stack.Screen name="EditPoll" component={EditPoll} options={{title: "Edit poll"}} />
                <Stack.Screen name="EditComment" component={EditComment} options={{title: "Edit comment"}} />

                <Stack.Screen name="VideoDetail" component={VideoDetail} options={{title: ""}} />
                <Stack.Screen name="PhotoDetail" component={PhotoDetail} options={{title: ""}} />
                <Stack.Screen name="StatementDetail" component={StatementDetail} options={{title: ""}} />
                <Stack.Screen name="PollDetail" component={PollDetail} options={{title: ""}} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
