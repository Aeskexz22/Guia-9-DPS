import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '../utils/config';

export default function ListarProductosComponent() {
    const [productos, setProductos] = useState([]);
    const navigation = useNavigation();

    const cargarProductos = async () => {
        try {
            const response = await fetch(`${API_URL}/productos`, { method: 'GET' });
            const responseJson = await response.json();
            const listado = responseJson.data || [];
            setProductos(listado);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            cargarProductos();
        }, [])
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Detalles', item)}>
            <View style={styles.itemContainer}>
                <Text style={styles.itemNombre}>{item.nombre}</Text>
                <Text style={styles.itemPrecio}>${item.preciodeventa}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.total}>{productos.length} productos</Text>
            <FlatList
                data={productos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <TouchableOpacity style={styles.agregarButton} onPress={() => navigation.navigate('Agregar')}>
                <MaterialIcons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    total: { fontSize: 16, marginBottom: 10 },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    itemNombre: { fontSize: 16, fontWeight: 'bold' },
    itemPrecio: { fontSize: 16, color: 'green' },
    agregarButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'red',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    }
});