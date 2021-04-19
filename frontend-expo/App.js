import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { Tabs, StartScreen, DescriptionScreen, SettingsScreen } from './src/screens/index'
import { ChangePassword, CreateComment, CreatePhoto, CreatePoll, CreateStatement, CreateVideo } from './src/screens/forms/create'
import {EditVideo, EditPhoto, EditPoll, EditStatement, EditComment, EditProfile} from './src/screens/forms/edit'
import { PhotoDetail, PollDetail, StatementDetail, UserDetail, VideoDetail } from './src/screens/detail'
import RegisterScreen from './src/screens/forms/RegisterScreen'
import LoginScreen from './src/screens/forms/LoginScreen'
import { normalize } from './src/utils/utils'

const Stack = createStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Start">
                <Stack.Screen name="Start" component={StartScreen} options={{headerShown: false}} />
                <Stack.Screen name="Tabs" component={Tabs} options={{headerShown: false}} />

                <Stack.Screen name="Register" component={RegisterScreen} options={{title: "Register"}} />
                <Stack.Screen name="Login" component={LoginScreen} options={{title: "Login"}} />

                <Stack.Screen name="CreateVideo" component={CreateVideo}options={{title: "Create a video"}} />
                <Stack.Screen name="CreatePhoto" component={CreatePhoto} options={{title: "Post a photo"}} />
                <Stack.Screen name="CreateStatement" component={CreateStatement} options={{title:"Make a statement"}}/>
                <Stack.Screen name="CreatePoll" component={CreatePoll} options={{title: "Open a poll"}} />
                <Stack.Screen name="CreateComment" component={CreateComment} options={{title: "Add a comment"}} />

                <Stack.Screen name="EditVideo" component={EditVideo} options={{title: "Edit video"}} />
                <Stack.Screen name="EditPhoto" component={EditPhoto} options={{title: "Edit photo"}} />
                <Stack.Screen name="EditStatement" component={EditStatement} options={{title: "Edit statement"}} />
                <Stack.Screen name="EditPoll" component={EditPoll} options={{title: "Edit poll"}} />
                <Stack.Screen name="EditComment" component={EditComment} options={{title: "Edit comment"}} />
                <Stack.Screen name="EditProfile" component={EditProfile} options={{title: "Edit your profile"}} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} options={{title: "Change your password"}} />

                <Stack.Screen name="VideoDetail" component={VideoDetail} options={{title: ""}} />
                <Stack.Screen name="PhotoDetail" component={PhotoDetail} options={{title: ""}} />
                <Stack.Screen name="StatementDetail" component={StatementDetail} options={{title: ""}} />
                <Stack.Screen name="PollDetail" component={PollDetail} options={{title: ""}} />
                <Stack.Screen 
                    name="UserDetail" 
                    component={UserDetail} 
                    options={{
                        title:"Profile of johndoeisgreat",
                        headerTitleStyle: {
                            fontSize: normalize(16)
                        }
                    }}
                />

                <Stack.Screen 
                    name="Description" 
                    component={DescriptionScreen} 
                    options={{
                        title: "Description of johndoeisgreat",
                        headerTitleStyle: {
                            fontSize: normalize(16)
                        }
                    }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
