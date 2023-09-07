import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../constants/theme';
import Icon, {Icons} from '../constants/Icons';
import Header from '../component/Header';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

const button_size = 54;
const scalingCircleSize = (width / button_size).toFixed();
const circeSize = scalingCircleSize * button_size;
const radius = circeSize / 2 - button_size;
const middleRadius = radius / 1.42;

const ActionButton = ({navigation}) => {
  const [open, setOpen] = useState(false);

  const rotation = useDerivedValue(() => {
    return withSpring(open ? '0deg' : '135deg');
  }, [open]);

  const progress = useDerivedValue(() => {
    return open ? withSpring(1) : withSpring(0);
  }, [open]);

  const translation = useDerivedValue(() => {
    return open ? withSpring(1, {damping: 8, stiffness: 70}) : withSpring(0);
  }, [open]);

  const fabStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.red, COLORS.lightRed],
    );
    return {
      transform: [
        {
          rotate: rotation.value,
        },
      ],
      backgroundColor,
    };
  });

  const expandingCircleStyles = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0, scalingCircleSize]);
    return {
      transform: [
        {
          scale: scale,
        },
      ],
    };
  });

  const getIconButtonStyles = (x, y, value) => {
    return useAnimatedStyle(() => {
      const translate = interpolate(translation.value, [0, 1], [0, value], {
        extrapolateLeft: Extrapolate.CLAMP,
      });

      const scale = interpolate(progress.value, [0, 1], [0, 1], {
        extrapolateLeft: Extrapolate.CLAMP,
      });

      if (x && y) {
        return {
          transform: [
            {translateX: translate},
            {translateY: translate},
            {scale},
          ],
        };
      } else if (x) {
        return {
          transform: [{translateX: translate}, {scale}],
        };
      } else {
        return {
          transform: [{translateY: translate}, {scale}],
        };
      }
    });
  };

  //   Icon button Component
  const IconButton = ({icon, style, onPress = () => {}}) => {
    return (
      <Animated.View style={[styles.actionBtn, style]}>
        <TouchableHighlight
          underlayColor={COLORS.lightRed}
          style={styles.actionBtn}
          onPress={onPress}>
          <Icon
            type={Icons.EvilIcons}
            name={icon}
            size={30}
            color={COLORS.white}
            style={{
              marginTop: -5,
            }}
          />
        </TouchableHighlight>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Header label="Action Button" onPress={() => navigation.openDrawer()} />
      <View style={styles.fabContainer}>
        <Animated.View
          style={[
            styles.expandingCircle,
            expandingCircleStyles,
          ]}></Animated.View>
        <TouchableWithoutFeedback onPress={() => setOpen(p => !p)}>
          <Animated.View style={[styles.fab, fabStyles]}>
            <Icon
              type={Icons.Ionicons}
              name={'close-outline'}
              size={34}
              color={COLORS.white}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
        <IconButton
          icon={'image'}
          style={getIconButtonStyles(null, true, -radius)}
        />
        <IconButton
          icon={'lock'}
          style={getIconButtonStyles(true, true, -middleRadius)}
        />
        <IconButton
          icon={'calendar'}
          style={getIconButtonStyles(true, null, -radius)}
        />
      </View>
    </View>
  );
};

export default ActionButton;

const circleStyles = {
  width: button_size,
  height: button_size,
  borderRadius: button_size / 2,
  justifyContent: 'center',
  alignItems: 'center',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.headerColor,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },

  fab: {
    ...circleStyles,
    backgroundColor: COLORS.red,
  },

  expandingCircle: {
    ...circleStyles,
    position: 'absolute',
    zIndex: -1,
    backgroundColor: COLORS.red,
  },
  actionBtn: {
    ...circleStyles,
    backgroundColor: COLORS.darkRed,
    position: 'absolute',
    zIndex: -1,
  },
});
