import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../utils/config';

export default function InicioComponent() {
    const [usuario, setUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const navigation = useNavigation();

    const Entrar = async () => {
        if (usuario && contrasenia) {
            try {
                const response = await fetch(`${API_URL}/usuarios/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, contrasenia })
                });
                const responseJson = await response.json();
                
                if (responseJson.success) {
                    navigation.navigate('ListarProductos');
                } else {
                    const mensaje = responseJson.error?.message || 'Credenciales incorrectas';
                    Alert.alert('Usuario', mensaje);
                }
            } catch (error) {
                console.error('Error:', error);
                Alert.alert('Aviso', 'Error de Internet!!!');
            }
        } else {
            Alert.alert('Aviso', 'No introdujo datos');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.bienvenida}>Bienvenidos</Text>
            <Image style={styles.logo} source={require('../../assets/market.jpg')} />
            <View style={styles.form}>
                <Input
                    placeholder='USUARIO'
                    onChangeText={setUsuario}
                    value={usuario}
                    leftIcon={<MaterialIcons name="person" size={24} color="black" />}
                />
                <Input
                    placeholder='CONTRASEÑA'
                    onChangeText={setContrasenia}
                    value={contrasenia}
                    secureTextEntry={true}
                    leftIcon={<MaterialIcons name="lock" size={24} color="black" />}
                />
                <TouchableOpacity style={styles.loginButton} onPress={Entrar}>
                    <Text style={styles.textButton}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff'
    },
    bienvenida: {
        fontSize: 34,
        marginTop: 25,
        alignSelf: 'center'
    },
    logo: {
        width: 200,
        height: 160,
        alignSelf: 'center',
        marginTop: 15
    },
    form: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20
    },
    loginButton: {
        height: 50,
        backgroundColor: 'red',
        marginTop: 15,
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20
    },
    textButton: {
        color: 'white',
        fontSize: 22,
        textAlign: 'center'
    }
});