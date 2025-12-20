import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const slides = [
  require('../../assets/carousel-1.png'),
  require('../../assets/carousel-2.png'),
  require('../../assets/carousel-3.png'),
  require('../../assets/carousel-4.png'),
  require('../../assets/carousel-5.png'),
];

export default function LandingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Auto-sliding Carousel Background */}
      <Animated.View style={[styles.backgroundContainer, { opacity: fadeAnim }]}>
        <ImageBackground
          source={slides[currentSlide]}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>
      </Animated.View>

      {/* Content Overlay */}
      <View style={styles.content}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
                source={require('../../assets/images/logo-pawchive.png')}
                style={styles.logoImage}
                resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>PAWCHIVE</Text>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Bottom CTA Card */}
        <View style={styles.bottomCard}>
          <Text style={styles.welcomeTitle}>Welcome to PawChive</Text>
          <Text style={styles.welcomeSubtitle}>
            Start caring for campus strays today
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.signupText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark gradient overlay
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logoContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#57AFDB'},
  logoImage: { width: 40, height: 40},
  
  logoEmoji: {
    fontSize: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    marginLeft: 12
  },
  bottomCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 30,
    marginBottom: 50,
    padding: 32,
    borderRadius: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    backdropFilter: 'blur(10px)', // Note: not supported on RN, but visual is similar
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#57AFDB',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#FFB800',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  signupText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
});