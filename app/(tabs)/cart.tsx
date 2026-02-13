import React from 'react';
import { Text, View } from 'react-native';
import { CommonStyles } from '../../styles/common';

export default function CartScreen() {
    return (
        <View style={[CommonStyles.container, CommonStyles.center]}>
            <Text style={CommonStyles.subTitle}>Your Cart is Empty</Text>
        </View>
    );
}
