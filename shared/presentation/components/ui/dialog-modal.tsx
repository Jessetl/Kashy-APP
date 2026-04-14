import { AppPressable } from '@/shared/presentation/components/ui/app-pressable';
import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import { X } from 'lucide-react-native';
import React, { useCallback, useEffect } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface DialogModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Estilo opcional para el área de contenido (ej: height fija para ScrollViews) */
  bodyStyle?: StyleProp<ViewStyle>;
}

export const DialogModal = React.memo(function DialogModal({
  visible,
  onClose,
  title,
  children,
  bodyStyle,
}: DialogModalProps) {
  const colors = useThemeColors();

  // useAnimatedKeyboard corre en el UI thread — sin parpadeos ni re-renders de JS
  // react-native-edge-to-edge ya gestiona el translucent status bar en Android,
  // por eso no pasamos `isStatusBarTranslucentAndroid` (dispara un warning ignorable).
  const keyboard = useAnimatedKeyboard();

  const cardScale = useSharedValue(0.92);
  const cardOpacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 200 });
      cardOpacity.value = withTiming(1, { duration: 200 });
      cardScale.value = withSpring(1, { damping: 20, stiffness: 260, mass: 0.7 });
    } else {
      backdropOpacity.value = 0;
      cardOpacity.value = 0;
      cardScale.value = 0.92;
    }
  }, [visible, backdropOpacity, cardOpacity, cardScale]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { scale: cardScale.value },
      // Sube el card la mitad de la altura del teclado para mantenerlo
      // centrado en el espacio visible — sin tocar el layout
      { translateY: -(keyboard.height.value / 2) },
    ],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType='none'
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.root}>
        {/* Backdrop — toca fuera para cerrar */}
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
          />
        </Pressable>

        {/* Contenedor centrado — box-none para que toques al fondo pasen al backdrop */}
        <View style={styles.centeredContainer} pointerEvents='box-none'>
          <Animated.View
            style={[
              styles.dialog,
              { backgroundColor: colors.backgroundSecondary },
              cardStyle,
            ]}
          >
            {/* Cabecera */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textOnSurface }]}>
                {title}
              </Text>
              <AppPressable
                onPress={handleClose}
                style={[
                  styles.closeBtn,
                  { backgroundColor: colors.backgroundTertiary },
                ]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X
                  size={16}
                  color={colors.textSecondary}
                  pointerEvents='none'
                  strokeWidth={2.5}
                />
              </AppPressable>
            </View>

            {/* Contenido */}
            <View style={[styles.body, bodyStyle]}>{children}</View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialog: {
    width: '100%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
