import React, { useState, useEffect } from 'react'
import { View, Text, Image } from 'react-native'
import { ScrollView, FlatList } from 'react-native-gesture-handler';

import api from '../services/api'
import TemperatureNumber from '../components/TemperatureNumber'

const itemStyle = {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between'
}

function LocationDay({ navigation }){
    const temperatures = navigation.getParam('temperatures')
    const temperatureType = navigation.getParam('temperatureType')
    const woeid = navigation.getParam('woeid')

    var dia  = temperatures[0].applicable_date.split("-")[2];
    var mes  = temperatures[0].applicable_date.split("-")[1];
    var ano  = temperatures[0].applicable_date.split("-")[0];

    const today = ano + '/' + mes + '/' + dia;

    const [my_temperature_list, setMy_temperature_list] = useState({
        applicable_date: '01/01/2022',
        max_temp: 0,
        weather_state_abbr: ''
    });

    useEffect(() => {
        async function loadInitialPosition() {
        const response = await api.get(`${woeid}/${today}`)
        
        setMy_temperature_list(response.data)

        }
        loadInitialPosition();
    }, []) //array vazio para rodar uma unica vez

    const renderItem = ({ item }) => {
        return (
            <View style={itemStyle}>
                <Text>{item.created}</Text>
                <Text>min: <TemperatureNumber temperature={item.min_temp} temperatureType={temperatureType}/> / max: <TemperatureNumber temperature={item.max_temp} temperatureType={temperatureType}/></Text>
                <Image style={{width: 30, height: 30}} source={{uri: `https://www.metaweather.com/static/img/weather/png/64/${item.weather_state_abbr}.png`}}></Image>
            </View>
        )
    }

    return (
        <ScrollView>
            <FlatList 
                data={my_temperature_list} 
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()} 
            />
        </ScrollView>
    )
}

export default LocationDay;


