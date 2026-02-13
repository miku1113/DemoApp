import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { useTabBar } from '../context/TabBarContext';
import { CommonStyles } from '../styles/common';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { isTabBarVisible } = useTabBar();
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(0)).current;

    const TAB_BAR_HEIGHT = (Platform.select({ ios: 25, default: 40 })) + insets.bottom;

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: isTabBarVisible ? 0 : TAB_BAR_HEIGHT,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isTabBarVisible, TAB_BAR_HEIGHT]);

    return (
        <Animated.View style={[
            styles.container,
            {
                height: TAB_BAR_HEIGHT,
                paddingBottom: Platform.select({ ios: 0, default: insets.bottom }),
                transform: [{ translateY }],
            }
        ]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                // Helper to render icon
                const renderIcon = () => {
                    if (options.tabBarIcon) {
                        return options.tabBarIcon({
                            focused: isFocused,
                            color: isFocused ? Colors.light.primary : Colors.light.subtext,
                            size: 24,
                        });
                    }
                    return null;
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabButton}
                    >
                        {renderIcon()}
                        {/* Only showing label if requested, usually cleaner without or small */}
                        {/* <Text style={{ color: isFocused ? Colors.light.primary : Colors.light.subtext }}>
                            {label?.toString()}
                        </Text> */}
                    </TouchableOpacity>
                );
            })}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.light.white,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        ...CommonStyles.shadowSmall,
        elevation: 8,
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
