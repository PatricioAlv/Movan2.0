import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Path, Rect, G, Circle, Line } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Componentes animados de SVG
const AnimatedG = Animated.createAnimatedComponent(G);

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  // Animaciones
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const truckPositionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de las ruedas girando
    const wheelRotation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 300, // 0.3s por vuelta completa (igual que en el HTML)
        useNativeDriver: false, // Cambiar a false para animaciones SVG
      })
    );
    
    wheelRotation.start();

    // Después de 3 segundos, detener las ruedas y hacer que el camión salga
    const exitTimer = setTimeout(() => {
      wheelRotation.stop();
      
      // Animación de salida con cubic-bezier para simular "arrancada"
      Animated.timing(truckPositionAnim, {
        toValue: SCREEN_WIDTH * 1.5, // Sale completamente de la pantalla
        duration: 800, // 0.8s (igual que en el CSS)
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3000);

    return () => {
      clearTimeout(exitTimer);
      wheelRotation.stop();
    };
  }, []);

  // Interpolación para la rotación de las ruedas
  const wheelRotate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.truckContainer,
          {
            transform: [{ translateX: truckPositionAnim }],
          },
        ]}
      >
        <Svg width="250" height="120" viewBox="0 0 200 120">
          {/* Cuerpo del camión */}
          <Path
            d="M10,40 L130,40 L130,10 L160,10 L190,40 L190,85 L10,85 Z"
            fill="#E74C3C"
          />
          
          {/* Ventana */}
          <Rect x="140" y="20" width="30" height="20" fill="#ECF0F1" />
          
          {/* Rueda trasera */}
          <G transform="translate(45, 90)">
            <AnimatedG
              rotation={rotationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 360],
              })}
            >
              <Circle cx="0" cy="0" r="20" fill="#34495E" stroke="#BDC3C7" strokeWidth="3" />
              <Line x1="-15" y1="0" x2="15" y2="0" stroke="#BDC3C7" strokeWidth="2" />
              <Line x1="0" y1="-15" x2="0" y2="15" stroke="#BDC3C7" strokeWidth="2" />
            </AnimatedG>
          </G>
          
          {/* Rueda delantera */}
          <G transform="translate(155, 90)">
            <AnimatedG
              rotation={rotationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 360],
              })}
            >
              <Circle cx="0" cy="0" r="20" fill="#34495E" stroke="#BDC3C7" strokeWidth="3" />
              <Line x1="-15" y1="0" x2="15" y2="0" stroke="#BDC3C7" strokeWidth="2" />
              <Line x1="0" y1="-15" x2="0" y2="15" stroke="#BDC3C7" strokeWidth="2" />
            </AnimatedG>
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50', // Color de fondo igual que en el HTML
    justifyContent: 'center',
    alignItems: 'center',
  },
  truckContainer: {
    // Sombra similar al drop-shadow del HTML
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
});
