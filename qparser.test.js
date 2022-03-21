const question_parser = require('./qparser');

const qparser = new question_parser();

test('Welcome should return null', () => {
  expect(qparser.parse("Welcome to the Rival Chatbot Challenge.")).toBe(null);
});
test('Are you ready to begin? should return type YESNO', () => {
  expect(qparser.parse("Are you ready to begin?").type).toBe('YESNO');
});
test('What is the sum of the following numbers: 7, 12, 31? should return type MATH?', () => {
  expect(qparser.parse("What is the sum of the following numbers: 7, 12, 31?").type)
    .toBe('MATH');
});
test('What is the factor of the following numbers: 7, 12, 31? should return funcName factorOfNumbers?', () => {
  expect(qparser.parse("What is the factor of the following numbers: 7, 12, 31?").funcName)
    .toStrictEqual('factorOfNumbers');
});
test('What is the largest of the following numbers: 7, 12, 31? should return data [7, 12, 31]?', () => {
  expect(qparser.parse("What is the largest of the following numbers: 7, 12, 31?").data)
    .toStrictEqual([7, 12, 31]);
});
