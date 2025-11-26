import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: any;
}

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../../assets/welcome-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
        style={styles.container}
      >
        <View style={styles.content}>
        {/* Icono del camión */}
        <View style={styles.iconContainer}>
          <FontAwesome name="truck" size={80} color="#FFFFFF" />
        </View>

        {/* Título principal */}
        <Text style={styles.title}>Tu carga, en las{'\n'}mejores manos.</Text>

        {/* Características */}
        <View style={styles.featuresContainer}>
          {/* Feature 1 */}
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <FontAwesome name="search" size={24} color="#4A90E2" />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Encuentra transportistas</Text>
              <Text style={styles.featureDescription}>
                Conecta con camioneros verificados de forma rápida y segura.
              </Text>
            </View>
          </View>

          {/* Feature 2 */}
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <FontAwesome name="map-marker" size={24} color="#4A90E2" />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Rastrea tu envío</Text>
              <Text style={styles.featureDescription}>
                Sigue tu carga en tiempo real desde la recogida hasta la entrega.
              </Text>
            </View>
          </View>

          {/* Feature 3 */}
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <FontAwesome name="shield" size={24} color="#4A90E2" />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Pagos seguros</Text>
              <Text style={styles.featureDescription}>
                Realiza transacciones con total confianza y seguridad.
              </Text>
            </View>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.startButtonText}>Empezar</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 40,
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 40,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  startButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  loginLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
