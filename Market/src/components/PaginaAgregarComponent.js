import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../utils/config';

export default function PaginaAgregarComponent() {
    const navigation = useNavigation();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [preciocosto, setPreciocosto] = useState('');
    const [precioventa, setPrecioventa] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [fotografia, setFotografia] = useState('');

    const Agregar = async () => {
        if (!nombre || !precioventa || !cantidad) {
            Alert.alert('Aviso', 'Nombre, Precio de Venta y Cantidad son obligatorios');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    cantidad: parseInt(cantidad),
                    preciocosto: parseFloat(preciocosto) || 0,
                    precioventa: parseFloat(precioventa),
                    fotografia: fotografia || null
                })
            });
            const responseJson = await response.json();
            const mensaje = responseJson.message || 'Producto agregado exitosamente';
            Alert.alert('Éxito', mensaje);
            navigation.goBack();
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Error de Internet!!!');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Input
                placeholder="Nombre *"
                onChangeText={setNombre}
                value={nombre}
                inputStyle={styles.input}
            />
            <Input
                placeholder="Descripción"
                onChangeText={setDescripcion}
                value={descripcion}
                inputStyle={styles.input}
                multiline
            />
            <Input
                placeholder="Precio de Costo"
                onChangeText={setPreciocosto}
                value={preciocosto}
                inputStyle={styles.input}
                keyboardType="decimal-pad"
            />
            <Input
                placeholder="Precio de Venta *"
                onChangeText={setPrecioventa}
                value={precioventa}
                inputStyle={styles.input}
                keyboardType="decimal-pad"
            />
            <Input
                placeholder="Cantidad *"
                onChangeText={setCantidad}
                value={cantidad}
                inputStyle={styles.input}
                keyboardType="numeric"
            />
            <Input
                placeholder="URL de Fotografía"
                onChangeText={setFotografia}
                value={fotografia}
                inputStyle={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={Agregar}>
                <Text style={styles.textButton}>Guardar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    input: {
        marginTop: 10
    },
    button: {
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