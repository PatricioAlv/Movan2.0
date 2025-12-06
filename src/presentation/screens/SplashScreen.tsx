import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import Svg, { Path, G, Circle, Line, Text as SvgText } from 'react-native-svg';
import SplashScreenStyles from '@presentation/theme/Splash-Styles/SplashScreenStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Componentes animados de SVG
const AnimatedG = Animated.createAnimatedComponent(G);

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  // Animaciones
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const truckPositionAnim = useRef(new Animated.Value(0)).current;
  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 360],
  });

  useEffect(() => {
    // Animación de las ruedas girando
    const wheelRotation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 800, 
        useNativeDriver: false, 
      })
    );
    
    wheelRotation.start();

    // Después de 3 segundos, detener las ruedas y hacer que el camión salga
    const exitTimer = setTimeout(() => {
      // Acelerar las ruedas para la salida
      Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 300, 
          useNativeDriver: false, 
        })
      ).start();

      // Animación de salida
      Animated.timing(truckPositionAnim, {
        toValue: SCREEN_WIDTH * 1.5, 
        duration: 1000, 
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

  return (
    <View style={SplashScreenStyles.container}>
      <Animated.View
        style={[
          SplashScreenStyles.truckContainer,
          {
            transform: [{ translateX: truckPositionAnim }],
          },
        ]}
      >
        <Svg width="300" height="200" viewBox="0 0 200 150">
          {/* Grupo del cuerpo del camión (Outline Style) */}
          <G stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Caja de carga */}
            <Path d="M 20 20 H 100 A 5 5 0 0 1 105 25 V 85 A 5 5 0 0 1 100 90 H 20 A 5 5 0 0 1 15 85 V 25 A 5 5 0 0 1 20 20 Z" />
            
            {/* Pin de ubicación */}
            <Path d="M 60 35 C 50 35 42 43 42 53 C 42 65 60 80 60 80 C 60 80 78 65 78 53 C 78 43 70 35 60 35 Z" />
            <Circle cx="60" cy="53" r="5" />

            {/* Cabina */}
            <Path d="M 110 90 V 45 A 5 5 0 0 1 115 40 H 135 L 155 60 V 85 A 5 5 0 0 1 150 90 H 110" />
            
            {/* Ventana */}
            <Path d="M 115 45 H 132 L 148 62 V 62 H 115 V 45 Z" />
          </G>

          {/* Rueda Trasera */}
          <G transform="translate(45, 90)">
            <AnimatedG
              rotation={rotateInterpolate}
              originX={0}
              originY={0}
            >
              <Circle cx="0" cy="0" r="14" stroke="#FFFFFF" strokeWidth="2.5" fill="#2c3e50" />
              <Circle cx="0" cy="0" r="4" fill="#FFFFFF" />
              <Line x1="0" y1="-14" x2="0" y2="14" stroke="#FFFFFF" strokeWidth="2" />
              <Line x1="-14" y1="0" x2="14" y2="0" stroke="#FFFFFF" strokeWidth="2" />
            </AnimatedG>
          </G>

          {/* Rueda Delantera */}
          <G transform="translate(130, 90)">
            <AnimatedG
              rotation={rotateInterpolate}
              originX={0}
              originY={0}
            >
              <Circle cx="0" cy="0" r="14" stroke="#FFFFFF" strokeWidth="2.5" fill="#2c3e50" />
              <Circle cx="0" cy="0" r="4" fill="#FFFFFF" />
              <Line x1="0" y1="-14" x2="0" y2="14" stroke="#FFFFFF" strokeWidth="2" />
              <Line x1="-14" y1="0" x2="14" y2="0" stroke="#FFFFFF" strokeWidth="2" />
            </AnimatedG>
          </G>
          
          {/* Texto Movan (Outline Style) */}
          <SvgText
            x="100"
            y="140"
            fontSize="45"
            fontWeight="bold"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            textAnchor="middle"
            letterSpacing="2"
          >
            Movan
          </SvgText>
        </Svg>
      </Animated.View>
    </View>
  );
};
