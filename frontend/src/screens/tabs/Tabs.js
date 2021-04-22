import React from 'react'
import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CreateScreen from "./CreateScreen";
import HomeScreenDrawer from "./HomeScreenDrawer";
import ExploreScreen from "./ExploreScreen";
import StatsScreen from "./StatsScreen";
import PostsScreen from "./PostsScreen";
import ActivityScreen from "./ActivityScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { normalize } from '../../utils/utils';

const Tab = createBottomTabNavigator()

export default function Tabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                showLabel: false,
                style: {
                    height: normalize(40)
                }
            }}
        >
            <Tab.Screen 
                name="HomeDrawer" 
                component={HomeScreenDrawer}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={normalize(25)} color="#000" />
                    )
                }}
            />
            <Tab.Screen 
                name="Posts" 
                component={PostsScreen} 
                options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons name={focused ? "newspaper" : "newspaper-outline"} size={normalize(25)} color="#000" />
                    )
                }}
            />
            <Tab.Screen 
                name="Create" 
                component={CreateScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={normalize(25)} color="#000"/>
                    )
                }} 
            />
            <Tab.Screen 
                name="Explore" 
                component={ExploreScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons name={focused ? "globe" : "globe-outline"} size={normalize(25)} color="#000" />
                    )
                }} 
            />
            <Tab.Screen 
                name="Stats" 
                component={StatsScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={normalize(25)} color="#000" />
                    )
                }} 
            />
            <Tab.Screen 
                name="Activity" 
                component={ActivityScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Ionicons name={focused ? "pulse" : "pulse-outline"} size={normalize(25)} color="#000" />
                    )
                }} 
            />
        </Tab.Navigator>
    )
}
