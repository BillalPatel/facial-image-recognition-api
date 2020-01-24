const chai = require('chai');
const expect  = require('chai').expect;
const should  = require('chai').should;
const chaiHttp = require('chai-http');
const knex = require('knex');
const serverA = require('../server');

chai.use(chaiHttp);

describe('GET request', () => {
  it('should return a 200 status code for valid request', (done) => {
    chai.request('http://localhost:5000')
    .get('/profile/1@1.com')
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(err).to.be.null;
      expect(res).to.be.an('object')
      expect(res.body.length).to.be.eql(1);
    });

    done();
  });

  it('should return a 404 status code for an invalid request', (done) => {
    chai.request('http://localhost:5000')
      .get('/profile/invalid@1.com')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.a('string');
      });

    done();
  });
});

describe('POST request', () => {
  it('should return a 200 status code for valid request', (done) => {
    const person = {
      email: '1@1.com',
      password: '1'
    };
    
    chai.request('http://localhost:5000')
      .post('/signin')
      .send(person)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.an('object')
        expect(res.body.name).to.eql('1');
        expect(res.body.email).to.eql('1@1.com');
        expect(res.body.joined).to.include('2020');
      });

    done();
  });

  it('should return a 400 status code for a request that is missing an email address', (done) => {
    const person = {
      password: '1'
    };

    chai.request('http://localhost:5000')
      .post('/signin')
      .send(person)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('string');
      });

    done();
  });

  it('should return a 400 status code for a request that contains the incorrect password', (done) => {
    const person = {
      email: '1@1.com',
      password: 'wrong'
    };

    chai.request('http://localhost:5000')
      .post('/signin')
      .send(person)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('string');
      });

    done();
  });
});
