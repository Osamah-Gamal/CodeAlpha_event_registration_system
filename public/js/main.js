// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const { connectDB } = require('./config/database');

// const eventRoutes = require('./routes/events');
// const registrationRoutes = require('./routes/registrations');
// const userRoutes = require('./routes/users');

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// // EJS setup
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Routes
// app.use('/', eventRoutes);
// app.use('/', registrationRoutes);
// app.use('/', userRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(500).render('error', { message: 'Something went wrong!' });
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).render('error', { message: 'Page not found' });
// });

// // Start server
// async function startServer() {
//     try {
//         await connectDB();
//         app.listen(PORT, () => {
//             console.log(`🎪 Event Registration System running on http://localhost:${PORT}`);
//             console.log(`📊 Database: SQL Server`);
//         });
//     } catch (err) {
//         console.error('❌ Failed to start server:', err);
//         process.exit(1);
//     }
// }

// startServer();