import React from 'react'
import { Text } from 'react-native'

export default props => {
    return (
        <Text>
            {props.temperatureType ? ((props.temperature * 1.8 + 32).toFixed(0)) : ((props.temperature).toFixed(0))}º
        </Text>
    )
}