import * as React from 'react';
import { View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    value?: number;
    max?: number;
    indicatorClassName?: string;
  }
>(({ className, value, max = 100, indicatorClassName, ...props }, ref) => {
  const progress = useDerivedValue(() => {
    return value ?? 0;
  });

  const indicator = useAnimatedStyle(() => {
    return {
      width: withSpring(
        `${interpolate(progress.value, [0, max], [1, 100], Extrapolation.CLAMP)}%`,
        { overshootClamping: true }
      ),
    };
  });

  return (
    <View
      ref={ref}
      role="progressbar"
      className={cn(
        'h-4 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
      {...props}
    >
      <Animated.View
        className={cn('h-full w-full flex-1 bg-primary', indicatorClassName)}
        style={indicator}
      />
    </View>
  );
});
Progress.displayName = 'Progress';

export { Progress };
