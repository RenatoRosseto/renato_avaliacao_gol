import React from 'react'
import { Text } from 'react-native'
import * as moment from 'moment'

export default props => {
    

    var dia  = props.dateTemp.split("-")[2];
    var mes  = props.dateTemp.split("-")[1];
    var ano  = props.dateTemp.split("-")[0];

    const newDate = dia + '/' + mes;
    

    return (
        <Text>
            {newDate}
        </Text>
    )
}