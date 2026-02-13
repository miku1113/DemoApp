import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';
import { CommonStyles } from '../styles/common';

interface CardProps {
    title: string;
    imageUrl: string;
    price: number;
    category: string;
    id: number;
}

const { width } = Dimensions.get('window');
// Calculate card width based on 3 columns with padding
const CARD_MARGIN = 6;
const CONTAINER_PADDING = 16;
const CARD_WIDTH = (width - (CONTAINER_PADDING * 2) - (CARD_MARGIN * 4)) / 3;

export const Card = ({ title, imageUrl, price, category, id }: CardProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [isFavorite, setIsFavorite] = useState(false);

    const onImageLoad = () => {
        setImageLoaded(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                {/* Real Image */}
                <Animated.Image
                    source={{ uri: imageUrl }}
                    style={[styles.image, { opacity: fadeAnim, zIndex: 1 }]}
                    onLoad={onImageLoad}
                />

                {/* Placeholder Image */}
                {!imageLoaded && (
                    <Image
                        source={require('../assets/images/placeholder-image.png')}
                        style={[styles.placeholderImage, { position: 'absolute', zIndex: 0 }]}
                    />
                )}

                {/* Favorite Button - Absolute positioned on top right of image */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => setIsFavorite(!isFavorite)}
                >
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={16}
                        color={isFavorite ? Colors.light.error : Colors.light.subtext}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.category} numberOfLines={1}>{category}</Text>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>

                <View style={styles.footer}>
                    <Text style={styles.price}>${price}</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Ionicons name="add" size={16} color={Colors.light.secondary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.light.cardBackground,
        borderRadius: 12,
        marginBottom: 12,
        marginHorizontal: 4, // Horizontal spacing for grid
        ...CommonStyles.shadowSmall,
        overflow: 'hidden',
        flexDirection: 'column', // Vertical layout
        width: 'auto', // Let flex handle width in grid, or use calculated if needed, but flex:1 in wrapper is better
        height: 200,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    imageContainer: {
        width: '100%',
        height: 100, // Fixed height for image
        position: 'relative',
        backgroundColor: Colors.light.background,
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    favoriteButton: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
        padding: 4,
        zIndex: 10,
    },
    content: {
        flex: 1,
        padding: 8,
        justifyContent: 'space-between',
    },
    category: {
        fontSize: 10,
        fontWeight: '600',
        color: Colors.light.subtext,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    title: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.light.text,
        lineHeight: 16,
        marginBottom: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    addButton: {
        backgroundColor: Colors.light.background,
        padding: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.light.secondary,
    },
});
