import React from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

const DEFAULT_HIT_SLOP_VALUE = 8;

interface AppPressableProps extends Omit<PressableProps, 'hitSlop'> {
  hitSlop?: PressableProps['hitSlop'];
  hitSlopSize?: number;
  disableDefaultHitSlop?: boolean;
  debugTouchArea?: boolean;
  debugTouchColor?: string;
}

const DEFAULT_DEBUG_TOUCH_COLOR = 'rgba(255, 59, 48, 0.7)';
const DEFAULT_DEBUG_TOUCH_BACKGROUND = 'rgba(255, 59, 48, 0.08)';

function mergeDebugStyle(
  style: PressableProps['style'],
  debugStyle: StyleProp<ViewStyle>,
): PressableProps['style'] {
  if (typeof style === 'function') {
    return (state) => [style(state), debugStyle];
  }

  return [style, debugStyle];
}

function buildHitSlop(
  hitSlop: PressableProps['hitSlop'],
  hitSlopSize: number,
  disableDefaultHitSlop: boolean,
): PressableProps['hitSlop'] {
  if (hitSlop != null) {
    return hitSlop;
  }

  if (disableDefaultHitSlop) {
    return undefined;
  }

  return hitSlopSize;
}

export const AppPressable = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  AppPressableProps
>(function AppPressable(
  {
    hitSlop,
    hitSlopSize = DEFAULT_HIT_SLOP_VALUE,
    disableDefaultHitSlop = false,
    debugTouchArea = false,
    debugTouchColor = DEFAULT_DEBUG_TOUCH_COLOR,
    ...props
  },
  ref,
) {
  const resolvedHitSlop = buildHitSlop(
    hitSlop,
    hitSlopSize,
    disableDefaultHitSlop,
  );

  const shouldShowDebug = debugTouchArea && __DEV__;
  const debugStyle: StyleProp<ViewStyle> = shouldShowDebug
    ? {
        borderWidth: 1,
        borderColor: debugTouchColor,
        backgroundColor: DEFAULT_DEBUG_TOUCH_BACKGROUND,
      }
    : undefined;

  const resolvedStyle = shouldShowDebug
    ? mergeDebugStyle(props.style, debugStyle)
    : props.style;

  return (
    <Pressable
      ref={ref}
      hitSlop={resolvedHitSlop}
      {...props}
      style={resolvedStyle}
    />
  );
});

AppPressable.displayName = 'AppPressable';
