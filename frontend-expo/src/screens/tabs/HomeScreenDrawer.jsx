import React from 'react'
import { View, Text, Touchable, TouchableOpacity, Linking } from 'react-native'
import { createDrawerNavigator, DrawerItemList } from "@react-navigation/drawer";

import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';
import { normalize } from '../../utils/utils';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator()

export default function HomeScreenDrawer() {
    const DrawerView = (props) => (
        <View style={{flex: 1, width: 30, paddingVertical: 32}}>
            <DrawerItemList {...props}
                activeTintColor="#00000000"
                activeBackgroundColor="#00000000"
                itemStyle={{
                    width: "120%",
                    alignSelf: "center"
                }}
            />
            <View>
                <TouchableOpacity>
                    <Ionicons 
                        name="contrast-outline" 
                        color="black" 
                        size={20} 
                        style={{alignSelf: "center", marginVertical: 12}}  
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:notakamihe@gmail.com') }>
                    <Ionicons 
                        name="help-circle-outline" 
                        color="black" 
                        size={22} 
                        style={{alignSelf: "center", marginVertical: 12}}  
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.dangerouslyGetParent().navigate("Login")}>
                    <Ionicons 
                        name="log-out-outline" 
                        color="black" 
                        size={22} 
                        style={{alignSelf: "center", marginVertical: 12}}  
                    />
                </TouchableOpacity>
            </View>
        </View>
    )

    return (
        <Drawer.Navigator
            drawerStyle={{
                width: normalize(60),
                justifyContent: "center",
                alignItems: "center"
            }}
            drawerContent={props => {
                return (
                    <DrawerView {...props} />
                )
            }}
            
        >
            <Drawer.Screen 
                name="Home" 
                component={HomeScreen}
                options={{
                    drawerLabel: () => null,
                    drawerIcon: ({focused}) => (
                        <Ionicons 
                            name={focused ? "person" : "person-outline"} 
                            color="black" 
                            size={20} 
                            style={{alignSelf: "center"}}  
                        />
                    )
                }}
            />
            <Drawer.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{
                    drawerLabel: () => null,
                    drawerIcon: ({focused}) => (
                        <Ionicons 
                            name={focused ? "settings" : "settings-outline"} 
                            color="black" 
                            size={20} 
                            style={{alignSelf: "center"}}  
                        />
                    ),
                    headerShown: true
                }}
            />
        </Drawer.Navigator>
    )
}
