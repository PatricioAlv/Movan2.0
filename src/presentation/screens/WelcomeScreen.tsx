import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import WelcomeScreenStyles from '@presentation/theme/Welcome-Styles/WelcomeScreenStyles';

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: any;
}

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../../assets/welcome-bg.png')}
      style={WelcomeScreenStyles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
        style={WelcomeScreenStyles.container}
      >
        <View style={WelcomeScreenStyles.content}>
        {/* Icono del camión */}
        <View style={WelcomeScreenStyles.iconContainer}>
          <FontAwesome name="truck" size={80} color="#FFFFFF" />
        </View>

        {/* Título principal */}
        <Text style={WelcomeScreenStyles.title}>Tu carga, en las{'\n'}mejores manos.</Text>

        {/* Características */}
        <View style={WelcomeScreenStyles.featuresContainer}>
          {/* Feature 1 */}
          <View style={WelcomeScreenStyles.featureCard}>
            <View style={WelcomeScreenStyles.featureIconContainer}>
              <FontAwesome name="search" size={24} color="#4A90E2" />
            </View>
            <View style={WelcomeScreenStyles.featureTextContainer}>
              <Text style={WelcomeScreenStyles.featureTitle}>Encuentra transportistas</Text>
              <Text style={WelcomeScreenStyles.featureDescription}>
                Conecta con camioneros verificados de forma rápida y segura.
              </Text>
            </View>
          </View>

          {/* Feature 2 */}
          <View style={WelcomeScreenStyles.featureCard}>
            <View style={WelcomeScreenStyles.featureIconContainer}>
              <FontAwesome name="map-marker" size={24} color="#4A90E2" />
            </View>
            <View style={WelcomeScreenStyles.featureTextContainer}>
              <Text style={WelcomeScreenStyles.featureTitle}>Rastrea tu envío</Text>
              <Text style={WelcomeScreenStyles.featureDescription}>
                Sigue tu carga en tiempo real desde la recogida hasta la entrega.
              </Text>
            </View>
          </View>

          {/* Feature 3 */}
          <View style={WelcomeScreenStyles.featureCard}>
            <View style={WelcomeScreenStyles.featureIconContainer}>
              <FontAwesome name="shield" size={24} color="#4A90E2" />
            </View>
            <View style={WelcomeScreenStyles.featureTextContainer}>
              <Text style={WelcomeScreenStyles.featureTitle}>Pagos seguros</Text>
              <Text style={WelcomeScreenStyles.featureDescription}>
                Realiza transacciones con total confianza y seguridad.
              </Text>
            </View>
          </View>
        </View>

        {/* Botones */}
        <View style={WelcomeScreenStyles.buttonsContainer}>
          <TouchableOpacity
            style={WelcomeScreenStyles.startButton}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={WelcomeScreenStyles.startButtonText}>Empezar</Text>
          </TouchableOpacity>

          <View style={WelcomeScreenStyles.loginContainer}>
            <Text style={WelcomeScreenStyles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
              <Text style={WelcomeScreenStyles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </LinearGradient>
    </ImageBackground>
  );
};
