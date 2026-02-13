import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import CustomTabBar from '../../components/CustomTabBar';
import { TabBarProvider } from '../../context/TabBarContext';

export default function TabLayout() {
    return (
        <TabBarProvider>
            <Tabs
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{
                        title: 'Search',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="cart"
                    options={{
                        title: 'Cart',
                        tabBarIcon: ({ color, focused }) => (
                            <View>
                                <Ionicons name={focused ? 'cart' : 'cart-outline'} size={24} color={color} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </TabBarProvider>
    );
}
