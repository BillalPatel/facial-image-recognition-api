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
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.an('object')
      expect(res.body.length).to.be.eql(1);
    });
    done();
  });

  it('should return a 404 status code for an in valid request', (done) => {
    chai.request('http://localhost:5000')
      .get('/profile/invalid@1.com')
      .end((err, res) => {
        expect(res.body).to.be.a('string');
        expect(res).to.have.status(404);
      });
    done();
  });
});

describe('GET request', () => {
  it('should return a 200 status code for valid request', (done) => {
    chai.request('http://localhost:5000')
      .get('/profile/1@1.com')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.an('object')
        expect(res.body.length).to.be.eql(1);
      });
    done();
  });

  it('should return a 404 status code for an in valid request', (done) => {
    chai.request('http://localhost:5000')
      .get('/profile/invalid@1.com')
      .end((err, res) => {
        expect(res.body).to.be.a('string');
        expect(res).to.have.status(404);
      });
    done();
  });
});
