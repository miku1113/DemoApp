import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import axios from 'axios';
import { Stack, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { Colors } from '../../constants/theme';
import { CommonStyles } from '../../styles/common';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

const CATEGORIES = ["All", "Smartphones", "Laptops", "Fragrances", "Skincare", "Groceries", "Home-Decoration"];

import { useTabBar } from '../../context/TabBarContext';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export default function Dashboard() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { isTabBarVisible, setTabBarVisible } = useTabBar();

    // Master data holding all >700 items
    const allProductsRef = useRef<Product[]>([]);
    // Filtered data based on search query AND category
    const filteredProductsRef = useRef<Product[]>([]);

    // Scroll & Animation Refs
    const listRef = useRef<FlashList<Product>>(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const fabTranslateY = useRef(new Animated.Value(0)).current;

    const lastContentOffset = useRef(0);
    // const isTabBarVisibleRef = useRef(true); // Removed local ref in favor of context state
    const [showScrollTop, setShowScrollTop] = useState(false);

    const BASE_TAB_HEIGHT = (Platform.select({ ios: 25, default: 40 }));

    // Sync FAB with Tab Bar
    useEffect(() => {
        Animated.timing(fabTranslateY, {
            toValue: isTabBarVisible ? 0 : BASE_TAB_HEIGHT,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isTabBarVisible, BASE_TAB_HEIGHT]);

    // Displayed data (paginated subset)
    const [displayedData, setDisplayedData] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [hasMore, setHasMore] = useState(true);

    const BATCH_SIZE = 21; // Divisible by 3 for proper grid layout

    // Initial Fetch (unchanged)
    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://dummyjson.com/products?limit=0');
                const products: Product[] = response.data.products;

                if (products.length > 0) {
                    let largeDataset: Product[] = [];
                    for (let i = 0; i < 5; i++) {
                        const batch = products.map(p => ({
                            ...p,
                            id: p.id + (i * 10000)
                        }));
                        largeDataset = [...largeDataset, ...batch];
                    }

                    allProductsRef.current = largeDataset;
                    applyFilters(searchQuery, 'All');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    // Scroll Handler Logic (JS thread)
    const handleScrollLogic = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = event.nativeEvent.contentOffset.y;

        // 1. Back to Top visibility
        if (currentOffset > 300 && !showScrollTop) {
            setShowScrollTop(true);
        } else if (currentOffset <= 300 && showScrollTop) {
            setShowScrollTop(false);
        }

        // 2. Tab Bar Toggle
        if (currentOffset < 0) return; // Ignore bouncing
        if (Math.abs(currentOffset - lastContentOffset.current) > 10) { // Threshold
            const direction = currentOffset > lastContentOffset.current ? 'down' : 'up';

            if (direction === 'down' && isTabBarVisible) {
                setTabBarVisible(false);
            } else if (direction === 'up' && !isTabBarVisible) {
                setTabBarVisible(true);
            }
            lastContentOffset.current = currentOffset;
        }
    };

    const scrollToTop = () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    // Apply Filters (Search + Category)
    const applyFilters = (query: string, category: string) => {
        if (allProductsRef.current.length === 0) return;

        let filtered = allProductsRef.current;
        if (category !== 'All') {
            filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
        }
        const q = query.toLowerCase();
        if (q) {
            filtered = filtered.filter(item => item.title.toLowerCase().includes(q));
        }

        filteredProductsRef.current = filtered;
        setDisplayedData(filteredProductsRef.current.slice(0, BATCH_SIZE));
        setHasMore(filteredProductsRef.current.length > BATCH_SIZE);
    };

    // Handle Text Input
    const handleSearch = (text: string) => {
        setSearchQuery(text);
        applyFilters(text, selectedCategory);
    };

    // Handle Category Select
    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        applyFilters(searchQuery, category);
    };

    // Pagination (Infinite Scroll)
    const handleLoadMore = () => {
        if (!loadingMore && hasMore && !loading) {
            setLoadingMore(true);
            setTimeout(() => {
                const currentLength = displayedData.length;
                const nextBatch = filteredProductsRef.current.slice(currentLength, currentLength + BATCH_SIZE);

                if (nextBatch.length > 0) {
                    setDisplayedData(prev => [...prev, ...nextBatch]);
                } else {
                    setHasMore(false);
                }
                setLoadingMore(false);
            }, 500);
        }
    };

    const renderFooter = () => {
        if (!loadingMore) return <View style={styles.footer} />;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={Colors.light.secondary} />
            </View>
        );
    };

    const renderItem = useCallback(({ item }: { item: Product }) => (
        <Card
            title={item.title}
            imageUrl={item.thumbnail}
            price={item.price}
            category={item.category}
            id={item.id}
        />
    ), []);

    // Animations & Constants
    const HEADER_HEIGHT = 60; // Logo area content height
    const SEARCH_HEIGHT = 110; // Search + Category area
    const TOP_INSET = insets.top;
    const FULL_HEADER_HEIGHT = HEADER_HEIGHT + SEARCH_HEIGHT + TOP_INSET;

    // 1. Header Animation: Only hide the Logo part (HEADER_HEIGHT), keep Search visible
    // We want to translate UP by (HEADER_HEIGHT + some spacing?)
    // Actually we just want to slide up the Logo.
    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, -HEADER_HEIGHT],
        extrapolate: 'clamp',
    });

    // Opacity for the logo part only
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT - 20],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Animated Header Wrapper (Logo + Search + Categories) */}
            <Animated.View style={{
                transform: [{ translateY: headerTranslateY }],
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                backgroundColor: Colors.light.white,
                paddingTop: TOP_INSET, // Proper Safe Area Padding
                height: FULL_HEADER_HEIGHT, // Dynamic height including insets
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            }}>
                {/* Top Logo Part */}
                <Animated.View style={[styles.header, { opacity: headerOpacity, height: HEADER_HEIGHT }]}>
                    <Image
                        source={require('../../assets/images/app-icon-white-bg.png')}
                        style={styles.headerLogo}
                        resizeMode="contain"
                    />
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconButton, { marginLeft: 12 }]}>
                        <Ionicons name="person-circle-outline" size={32} color={Colors.light.text} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Sticky Search & Category Part */}
                <View style={{ height: SEARCH_HEIGHT, backgroundColor: Colors.light.white }}>
                    <View style={styles.searchSection}>
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color={Colors.light.subtext} style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search products..."
                                placeholderTextColor={Colors.light.subtext}
                                value={searchQuery}
                                onChangeText={handleSearch}
                                clearButtonMode="while-editing"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.categorySection}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContent}>
                            {CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                                    onPress={() => handleCategorySelect(cat)}
                                >
                                    <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Animated.View>

            {/* Product List */}
            {loading ? (
                <View style={[styles.loadingContainer, { paddingTop: FULL_HEADER_HEIGHT }]}>
                    <ActivityIndicator size="large" color={Colors.light.secondary} />
                </View>
            ) : (
                <View style={styles.listContainer}>
                    <AnimatedFlashList
                        ref={listRef}
                        data={displayedData}
                        renderItem={renderItem}
                        estimatedItemSize={200}
                        keyExtractor={(item) => item.id.toString()}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            styles.listContent,
                            { paddingTop: FULL_HEADER_HEIGHT + 16, paddingBottom: 100 }
                        ]}
                        numColumns={3}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true, listener: handleScrollLogic }
                        )}
                        scrollEventThrottle={16}
                    />
                </View>
            )}

            {/* Back to Top FAB */}
            {showScrollTop && (
                <Animated.View
                    style={[
                        styles.fab,
                        {
                            bottom: BASE_TAB_HEIGHT + insets.bottom + 16, // Correctly sits above TabBar + Safe Area
                            transform: [{ translateY: fabTranslateY }]
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.fabButton}
                        onPress={scrollToTop}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="arrow-up" size={24} color={Colors.light.white} />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: Colors.light.white,
    },
    headerLogo: {
        width: 40,
        height: 40,
    },
    iconButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.error,
        borderWidth: 1,
        borderColor: Colors.light.white,
    },
    searchSection: {
        backgroundColor: Colors.light.white,
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.background, // Offset with bg color
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: Colors.light.text,
    },
    categorySection: {
        backgroundColor: Colors.light.white,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
        ...CommonStyles.shadowSmall,
        zIndex: 5,
    },
    categoryContent: {
        paddingHorizontal: 16,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.light.background,
        marginRight: 8,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    categoryChipActive: {
        backgroundColor: Colors.light.primary, // Deep Navy
        borderColor: Colors.light.primary,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.subtext,
    },
    categoryTextActive: {
        color: Colors.light.white,
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingTop: 16,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
        height: 60,
    },
    fab: {
        position: 'absolute',
        // Bottom handled dynamically in render to account for safe area
        right: 24,
        zIndex: 100,
    },
    fabButton: {
        backgroundColor: Colors.light.secondary,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        ...CommonStyles.shadowMedium,
    },
});
