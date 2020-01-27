import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Main from './pages/Main'
import LocationDay from './pages/LocationDay'

const Routes = createAppContainer(
    createStackNavigator({
        Main: {
            screen: Main,
            navigationOptions: {
                headerShown: false,
            }, 
        }, 
        LocationDay: {
            screen: LocationDay,
            navigationOptions: {
                title: 'Temperatures of day', 
                headerTitleAlign: 'center'
            }
        },
    }, {
        defaultNavigationOptions: {
            headerTintColor: '#FFF',
            headerBackTitleVisible: false,
            headerStyle: {
                backgroundColor: '#ff7020',
            }
        }
    })
)

export default Routes