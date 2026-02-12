import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

export const CommonStyles = StyleSheet.create({
    // Containers
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },

    // Shadows
    shadowSmall: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    shadowMedium: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
    },

    // Text Styles
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.light.primary,
        letterSpacing: -0.5,
    },
    subTitle: {
        fontSize: 16,
        color: Colors.light.subtext,
        fontWeight: '500',
    },
    bodyText: {
        fontSize: 14,
        color: Colors.light.text,
    },

    // Layout Helpers
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
