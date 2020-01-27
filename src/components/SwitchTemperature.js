import React from 'react'
import { Switch } from 'react-native'

export default class SwitchTemperature extends React.Component {
    state = {
        switchValue: true
    }

    handleToggleSwitch = () => this.setState(state => ({
        switchValue: !state.switchValue
    }))

    render() {
        return (
            <Switch onValueChange={this.handleToggleSwitch} value={this.state.switchValue} />
        )
    }
}