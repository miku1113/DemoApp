import React from 'react';
import { Text, View } from 'react-native';
import { CommonStyles } from '../../styles/common';

export default function ProfileScreen() {
    return (
        <View style={[CommonStyles.container, CommonStyles.center]}>
            <Text style={CommonStyles.subTitle}>User Profile</Text>
        </View>
    );
}
