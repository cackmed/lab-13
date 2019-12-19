require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User')

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  it('can sign up a user', () => {
    return request(app) 
      .post('/api/v1/auth/signup') 
      .send({ email: 'testerman@test.com', password: '123456' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'testerman@test.com',
          __v: 0  
        });
      });
  });
  it('can log a user in', async() => {
    const user = await User.create({ email: 'testerman@test.com', password: '123456' });
    return request(app) 
      .post('/api/v1/auth/login')
      .send({  email: 'testerman@test.com', password: '123456' })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: 'testerman@test.com',
          __v: 0
        });
      });
  });
});
