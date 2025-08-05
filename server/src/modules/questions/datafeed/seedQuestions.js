// seedQuestions.js
const mongoose = require('mongoose');
const Question = require('../model/question.model');
const { QuestionType } = require('../types/enum');

const MONGODB_URI = 'mongodb+srv://techschoolshark:stGURkOjuSfggdVc@cluster0.f6csdd9.mongodb.net/';

const questionData = [
  {
    qType: QuestionType.TWO_CHOICE,
    questionText: 'Is this correct or not?',
    images: ['https://yourcdn.com/images/correct_or_not.png'],
    options: ['right', 'wrong'],
    correctAnswer: 'right'
  },
  {
    qType: QuestionType.TWO_CHOICE,
    questionText: 'What do you think about this? Give Your opinion.',
    questionOptions: ['A-Opinion A', 'B-Opinion B'],
    options: ['A', 'B'],
    correctAnswer: 'A'
  },
  {
    qType: QuestionType.OPTION_IN_QUESTION,
    questionSubHeading: 'Sexual harassment at the workplace mainly falls into two types:',
    questionText: '1. Quid Pro Quo Harassment (This for That)',
    questionSubText: 'When someone in power (like a boss or manager) asks for sexual favors in exchange for job benefits (promotion, salary hike, or even keeping the job).',
    options: ['right', 'wrong'],
    correctAnswer: 'right',
    explanation: `
          <div>
            <b>Let’s make it easy for you:</b>
      <br><br>

      Imagine your boss saying, “If you go on a date with me, I’ll give you a promotion.”<br>
      That’s quid pro quo harassment because they are offering something in exchange for a personal favor.
      <br><br>

      <b>Example:</b>
      <br><br>
      • A professor says, “If you spend time with me, I’ll make sure you pass the exam.”<br>
      • A manager tells an employee, “If you agree to go out with me, I’ll approve your leave.”
      <br><br><br>

          </div>
  `
  },
  {
    qType: QuestionType.OPTION_IN_QUESTION,
    questionSubHeading: 'Sexual harassment at the workplace mainly falls into two types:',
    questionText: '2. Hostile Work Environment',
    questionSubText: 'When someone’s repeated bad behavior (jokes, comments, touching, or messages) makes the workplace uncomfortable and unsafe.',
    options: ['right', 'wrong'],
    correctAnswer: 'right',
    explanation: `
      <div>
        <b>Let’s make it easy for you:</b>
        <br><br>
  
        Imagine going to work every day where people make fun of you, touch you without permission, or send inappropriate texts.<br>
        It makes you feel unsafe and distracted from work. That’s a hostile work environment.
        <br><br>
  
        <b>Example:</b>
        <br><br>
        • A group of employees constantly makes sexual jokes in the office.<br>
        • A coworker keeps standing too close or touching someone without consent.
        <br><br><br>
      </div>
    `
  }
];

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);
  });

async function seedDatabase() {
  try {
    await Question.deleteMany({});
    console.log('Deleted existing questions');

    const insertedQuestions = await Question.insertMany(questionData);
    console.log(`Added ${insertedQuestions.length} questions to the database`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}
