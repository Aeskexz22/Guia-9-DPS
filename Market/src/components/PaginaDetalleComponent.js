import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../utils/config';

export default function PaginaDetalleComponent() {
    const navigation = useNavigation();
    const route = useRoute();
    
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [preciocosto, setPreciocosto] = useState('');
    const [precioventa, setPrecioventa] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [fotografia, setFotografia] = useState('');

    useFocusEffect(
        useCallback(() => {
            if (route.params) {
                setId(String(route.params.id ?? ''));
                setNombre(route.params.nombre || '');
                setDescripcion(route.params.descripcion || '');
                setCantidad(String(route.params.cantidad ?? ''));
                setPreciocosto(String(route.params.preciocosto ?? ''));
                setPrecioventa(String(route.params.precioventa ?? ''));
                setFotografia(route.params.fotografia || '');
            }
        }, [route.params])
    );

    const Actualizar = async () => {
        if (!nombre || !precioventa || !cantidad) {
            Alert.alert('Aviso', 'Nombre, Precio de Venta y Cantidad son obligatorios');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'PUT',
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
            const mensaje = responseJson.message || 'Producto actualizado exitosamente';
            Alert.alert('Éxito', mensaje);
            navigation.goBack();
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            Alert.alert('Error', 'Error de Internet');
        }
    };

    const Eliminar = async () => {
        Alert.alert(
            'Confirmar',
            '¿Está seguro que desea eliminar este producto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API_URL}/productos/${id}`, {
                                method: 'DELETE'
                            });
                            if (response.ok) {
                                Alert.alert('Éxito', 'Producto eliminado exitosamente');
                                navigation.goBack();
                            } else {
                                const responseJson = await response.json();
                                const mensaje = responseJson.error?.message || 'Error al eliminar';
                                Alert.alert('Error', mensaje);
                            }
                        } catch (error) {
                            console.error('Error al eliminar el producto:', error);
                            Alert.alert('Error', 'Error de Internet');
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.editarButton} onPress={Actualizar}>
                    <Text style={styles.textButton}>Actualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.eliminarButton} onPress={Eliminar}>
                    <Text style={styles.textButton}>Eliminar</Text>
                </TouchableOpacity>
            </View>

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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20
    },
    input: {
        marginTop: 10
    },
    editarButton: {
        height: 50,
        backgroundColor: 'green',
        marginTop: 15,
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    eliminarButton: {
        height: 50,
        backgroundColor: 'red',
        marginTop: 15,
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    textButton: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    }
});