import React, { useState, useEffect } from 'react'
import { View, Text, Switch, Image, StyleSheet } from 'react-native'
import MapView, { Marker, Callout }  from 'react-native-maps'
import { requestPermissionsAsync, /* pede permissao para o usuário */
         getCurrentPositionAsync /* pega a localizacao do usuário */ } from 'expo-location'

import api from '../services/api'

import TemperatureNumber from '../components/TemperatureNumber'

import { ScrollView, FlatList } from 'react-native-gesture-handler';

import ConvertDate from '../components/ConvertDate'

function Main({ navigation }) {
    const [currentRegion, setCurrentRegion] = useState(null) //começa sem nenhuma regiao de inicio
    const [temperatureType, setTemperatureType] = useState(false);

    const [id, setId] = useState(0);
    const [weather_state_abbr, setWeather_state_abbr] = useState('');
    const [applicable_date, setApplicable_date] = useState('');

    const [title, setTitle] = useState('');
    const [woeid, setWoeid] = useState('');
    const [latt_long, setLatt_long] = useState('');
    const [max_temp, setMax_temp] = useState(0);
    const [min_temp, setMin_temp] = useState(0);

    const [my_temperature_list, setMy_temperature_list] = useState({
        applicable_date: '01/01/2022',
        max_temp: 0,
        weather_state_abbr: ''
    });

    useEffect(() => {
        async function loadInitialPosition() {
            //espera o usuário responder, retorna um obj se deu ou n permission
            const { granted } = await requestPermissionsAsync(); 

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true //usar gps do celular
                });

                const { latitude, longitude } = coords

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04, //zoom no mapa
                    longitudeDelta: 0.04
                })
            }
        }
        loadInitialPosition();
    }, []) //array vazio para rodar uma unica vez
    
    if (!currentRegion) {
        return null;
    }
    else {
        handleListStates();
    }

    async function handleListStates() {
        const response = await api.get(`search/?lattlong=${currentRegion.latitude},${currentRegion.longitude}`)
        
        setTitle (response.data[0].title) 
        setWoeid (response.data[0].woeid) 
        setLatt_long (response.data[0].latt_long) 
           
        handleListStates2()
    }
       
   

    async function handleListStates2() {
        const response = await api.get(`${woeid}`);
       
        setMax_temp(response.data.consolidated_weather[0].max_temp)
        setMin_temp(response.data.consolidated_weather[0].min_temp)

        setId(response.data.consolidated_weather[0].id)
        setWeather_state_abbr(response.data.consolidated_weather[0].weather_state_abbr)
        setApplicable_date(response.data.consolidated_weather[0].applicable_date)

        setMy_temperature_list(response.data.consolidated_weather)
    }

    function handleToggleSwitch () {
        setTemperatureType(!temperatureType)
    }

    const Temperature = temperatures =>
        <View style={styles.itemStyle}>
            <ConvertDate dateTemp={temperatures.applicable_date} />
            <TemperatureNumber temperature={temperatures.max_temp} temperatureType={temperatureType}/>
            <Image style={{width: 30, height: 30}} source={{uri: `https://www.metaweather.com/static/img/weather/png/64/${temperatures.weather_state_abbr}.png`}}></Image>
        </View>

    const renderItem = ({ item }) => {
        return <Temperature {...item} />
    }
    
    return (
        
        
        <View style={{flex: 1, padding: 10}}>
            <View style={{flex: 2.2,  alignItems: 'center', justifyContent: 'center', }}>
                <Text style={{fontSize: 22}}>{title}</Text>
                <Text style={{fontSize: 22}}><TemperatureNumber temperature={max_temp} temperatureType={temperatureType} /></Text>
            </View>

            <View style={{ flex: 2 }}>
                <MapView initialRegion={currentRegion} style={styles.map}>
                    <Marker coordinate={{ latitude: currentRegion.latitude, longitude: currentRegion.longitude }}>
                        <Image style={styles.temp} source={{uri: `https://www.metaweather.com/static/img/weather/png/${weather_state_abbr}.png`}} />
                        <Callout onPress={() => {
                            navigation.navigate('LocationDay', {temperatures: my_temperature_list, temperatureType: temperatureType, woeid: woeid} )
                        }}
                        >
                            <View style={styles.callout}>
                                <Text>min: <TemperatureNumber temperature={min_temp} temperatureType={temperatureType} /> / max: <TemperatureNumber temperature={max_temp} temperatureType={temperatureType}/></Text>
                                <Text>- Click here for more infos -</Text>
                            </View>
                        </Callout>
                    </Marker>
                </MapView>
            </View>

            <View style={{flex: 2}}>
                <ScrollView>
                    <FlatList 
                        data={my_temperature_list} 
                        renderItem={renderItem}
                        keyExtractor={(_, index) => index.toString()} 
                    />
                </ScrollView>
            </View>

            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text>Celsius / Fahrenheit</Text>
                <Switch onValueChange={handleToggleSwitch} value={temperatureType} />
            </View>
        </View>
    ) 
}

const styles = StyleSheet.create({
    itemStyle: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },

    map: {
        flex: 1
    },

    temp: {
        width:  32,
        height: 32,
    },
    callout: {
        width: 170,
        height: 35,
        alignItems: 'center'
    }
})

export default Main