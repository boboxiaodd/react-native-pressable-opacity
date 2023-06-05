import React, { useCallback } from 'react';
import { PressableProps, Pressable, PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';
import _ from 'lodash-es';

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
		return _.throttle(onPress, timeout, {
			leading: true,
			trailing: false
		});
	}
	return <Pressable hitSlop={10} style={_style} onPress={checkPress()} disabled={disabled} {...passThroughProps} />;
}
