import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';

import InicioComponent from './src/components/InicioComponent';
import ListarProductosComponent from './src/components/ListarProductosComponent';
import PaginaAgregarComponent from './src/components/PaginaAgregarComponent';
import PaginaDetalleComponent from './src/components/PaginaDetalleComponent';

const Stack = createNativeStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Inicio" component={InicioComponent} options={{ title: 'Login' }} />
            <Stack.Screen name="ListarProductos" component={ListarProductosComponent} options={{ title: 'Productos' }} />
            <Stack.Screen name="Agregar" component={PaginaAgregarComponent} options={{ title: 'Agregar Producto' }} />
            <Stack.Screen name="Detalles" component={PaginaDetalleComponent} options={{ title: 'Editar Producto' }} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}