import React, { useCallback } from 'react';
import { PressableProps, Pressable, PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';

export interface PressableOpacityProps extends PressableProps {
	/**
	 * The opacity to use when `disabled={true}`
	 *
	 * @default 0.3
	 */
	disabledOpacity?: number;
	/**
	 * The opacity to animate to when the user presses the button
	 *
	 * @default 0.2
	 */
	activeOpacity?: number;

	/**
	 * The opacity to animate to when the user presses the button
	 *
	 * @default 1000
	 */
	timeout?: number;
}

export type StyleType = (state: PressableStateCallbackType) => StyleProp<ViewStyle>;

const preventDoublePress = {
	lastPressTime: Date.now(),  //  上次点击时间
	reponTime: 500,   //  间隔时间
	onPress(callback: () => void) {
		let curTime = Date.now();
		if (curTime - this.lastPressTime > this.reponTime) {
			this.lastPressTime = curTime;
			this.reponTime = 500;  //  这里的时间和上面的匹配
			callback();
		}else{
			console.log("无效点击",curTime - this.lastPressTime);
		}
	},
};

export function PressableOpacity({
									 onPress,
									 style,
									 disabled = false,
									 disabledOpacity = 0.3,
									 activeOpacity = 0.2,
									 timeout = 1000,
									 ...passThroughProps
								 }: PressableOpacityProps): React.ReactElement {
	const getOpacity = useCallback(
		(pressed: boolean) => {
			if (disabled) {
				return disabledOpacity;
			} else {
				if (pressed) return activeOpacity;
				else return 1;
			}
		},
		[activeOpacity, disabled, disabledOpacity],
	);
	const _style = useCallback<StyleType>(({ pressed }) => [style as ViewStyle, { opacity: getOpacity(pressed) }], [getOpacity, style]);
	const checkPress = () => {
		preventDoublePress.onPress(onPress);
	}
	return <Pressable hitSlop={10} style={_style} onPress={checkPress} disabled={disabled} {...passThroughProps} />;
}
