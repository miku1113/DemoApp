import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';
import { CommonStyles } from '../styles/common';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });

  const validate = () => {
    let isValid = true;
    let newErrors = { username: '', password: '' };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Allows simulated success for demo purposes
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={CommonStyles.container}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.headerContainer}>
          <Image
            source={require('../assets/images/app-icon-white-bg.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={CommonStyles.headerTitle}>Welcome Back!</Text>
          <Text style={CommonStyles.subTitle}>Log in to your account to continue</Text>
        </View>

        <View style={styles.formContainer}>

          {/* Username Input */}
          <View style={[styles.inputWrapper, errors.username && styles.inputError]}>
            <Ionicons name="person-outline" size={20} color={Colors.light.subtext} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={Colors.light.subtext}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) setErrors({ ...errors, username: '' });
              }}
              autoCapitalize="none"
            />
          </View>
          {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

          {/* Password Input */}
          <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.light.subtext} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.light.subtext}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.light.subtext} />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.loginButtonContainer}>
            <LinearGradient
              colors={[Colors.light.primary, '#1e293b', '#0f172a']} // Dark Slate Gradient
              style={styles.loginButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color={Colors.light.white} />
              ) : (
                <Text style={styles.loginButtonText}>LOGIN</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={24} color={Colors.light.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  logo: {
    width: 120, // Slightly smaller per new design feel
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...CommonStyles.shadowSmall,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    height: '100%',
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 10,
    marginTop: -5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: Colors.light.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    ...CommonStyles.shadowMedium,
  },
  loginButton: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: Colors.light.white,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    marginHorizontal: 10,
    color: Colors.light.subtext,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...CommonStyles.shadowSmall,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: Colors.light.subtext,
    fontSize: 14,
  },
  signupText: {
    color: Colors.light.secondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
