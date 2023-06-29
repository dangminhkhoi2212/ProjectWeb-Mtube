const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    db: {
        url:
            process.env.MONGODB_URI ||
            'mongodb+srv://kkhoi600:dangminhkhoi2212@project.rflxno2.mongodb.net/Mtube',
    },
};
module.exports = config;
