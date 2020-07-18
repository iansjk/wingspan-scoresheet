
import React from "react";
import { TextProps, TouchableHighlightProps, TouchableWithoutFeedbackProps } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

interface IconButtonProps {
    name: string,
    iconStyle?: object,
    backgroundColor?: string
}

export default class IconButton extends React.Component<IconButtonProps & TextProps & TouchableHighlightProps & TouchableWithoutFeedbackProps> {
    render() {
        const { style, ...otherProps } = this.props;
        return (
            <FontAwesome.Button
                name={this.props.name}
                iconStyle={{
                    ...(style as object),
                    marginRight: 0
                }}
                backgroundColor='transparent'
                size={26}
                underlayColor='lightgray'
                onPress={this.props.onPress}
                {...otherProps}
            />
        );
    }
}
