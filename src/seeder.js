require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
});

const users = [
  {
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: '123456',
    role: 'admin',
  },
];

const seedUsers = async () => {
  try {
    await User.deleteMany();
    await User.create(users);

    console.log('Admin User Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedUsers();
}
