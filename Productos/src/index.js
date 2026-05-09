const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const routes = require('./routes');

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100
});
app.use(limiter);

// Rutas
app.use('/api', routes);

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'RUTA_NO_ENCONTRADA',
            message: 'La ruta solicitada no existe'
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}/api`);
});