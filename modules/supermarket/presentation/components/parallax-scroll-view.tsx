import type { PropsWithChildren, ReactNode } from 'react';
import React from 'react';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

export type ParallaxIntensity = {
  stickyDistance: number;
  followAfterSticky?: number;
  liftMax?: number;
  liftRange?: number;
  pullDownScale?: number;
};

type ParallaxScrollViewProps = PropsWithChildren<{
  header: ReactNode;
  intensity: ParallaxIntensity;
  headerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  bottomPadding?: number;
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
}>;

const DEFAULT_CONFIG = {
  followAfterSticky: 0.9,
  liftMax: 14,
  liftRange: 120,
  pullDownScale: 1.03,
};

export function ParallaxScrollView({
  children,
  header,
  intensity,
  headerStyle,
  contentStyle,
  contentContainerStyle,
  bottomPadding = 0,
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = 'handled',
}: ParallaxScrollViewProps) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const followAfterSticky =
    intensity.followAfterSticky ?? DEFAULT_CONFIG.followAfterSticky;
  const liftMax = intensity.liftMax ?? DEFAULT_CONFIG.liftMax;
  const liftRange = intensity.liftRange ?? DEFAULT_CONFIG.liftRange;
  const pullDownScale = intensity.pullDownScale ?? DEFAULT_CONFIG.pullDownScale;

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const y = scrollOffset.value;
    const positiveY = Math.max(0, y);
    const stickyDistance = intensity.stickyDistance;

    const compensatedScroll =
      positiveY <= stickyDistance
        ? positiveY
        : stickyDistance + (positiveY - stickyDistance) * followAfterSticky;

    const subtleLift = interpolate(
      positiveY,
      [0, stickyDistance + liftRange],
      [0, -liftMax],
      Extrapolation.CLAMP,
    );

    const stretchScale = interpolate(
      y,
      [-stickyDistance, 0],
      [pullDownScale, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateY: compensatedScroll + subtleLift },
        { scale: stretchScale },
      ],
    };
  }, [
    intensity.stickyDistance,
    followAfterSticky,
    liftMax,
    liftRange,
    pullDownScale,
  ]);

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={styles.flex}
      contentContainerStyle={[
        styles.contentContainer,
        contentContainerStyle,
        { paddingBottom: bottomPadding },
      ]}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
    >
      <Animated.View style={[styles.header, headerStyle, headerAnimatedStyle]}>
        {header}
      </Animated.View>
      <View style={contentStyle}>{children}</View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    zIndex: 1,
    overflow: 'hidden',
  },
});
