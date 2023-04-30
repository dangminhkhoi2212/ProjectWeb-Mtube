const app = require('./app');
const config = require('./app/config');
const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.set('strictPopulate', false);

async function startServer() {
    try {
        await mongoose.set('strictQuery', true).connect(config.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected database on ${config.db.url}`);
        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Sever is running on port ${PORT}`);
        });
    } catch (error) {
        console.log('Cannot connected to the database', error);
        process.exit();
    }
}
startServer();
