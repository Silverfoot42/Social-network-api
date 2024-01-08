const connection = require('../config/connection');
const { User, Thought } = require('../models');

const seedData = async () => {
  try {
    await User.deleteMany();
    await Thought.deleteMany();

    const users = await User.create([
      {
        username: 'AdventureSeeker',
        email: 'adventurer@example.com',
      },
      {
        username: 'TechEnthusiast42',
        email: 'techfan42@example.com',
      },
    ]);

    const thoughts = await Thought.create([
      {
        thoughtText: 'This is the first thought.',
        username: users[0].username,
      },
      {
        thoughtText: 'Another thought here.',
        username: users[1].username,
      },
    ]);

    const reactions = [
      {
        reactionBody: 'Interesting!',
        username: users[0].username,
      },
      {
        reactionBody: 'I agree!',
        username: users[1].username,
      },
    ];

    users[0].thoughts.push(thoughts[0]);
    users[1].thoughts.push(thoughts[1]);

    thoughts[0].reactions.push(reactions[1]);
    thoughts[1].reactions.push(reactions[0]);

    await Promise.all(users.map(user => user.save()));
    await Promise.all(thoughts.map(thought => thought.save()));

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    connection.close();
  }
};

seedData();