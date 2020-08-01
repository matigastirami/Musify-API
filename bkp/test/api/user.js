
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var chai = require('chai');
var app = require('../../index');
var sql = require('../../services/mysql_service')

chai.use(chaiHttp);

describe('Test suite usuario', () => {

    before((done) => {
        sql.query('delete from users where email = \'test@unitario.com\'')
        done()
    })


    it('Crear un usuario', (done) => {
        chai.request(app)
        //chai.request('http://localhost:3000')
            .post('/auth/signup')
            .send({
                'name': 'unitario',
                'surname': 'unitario',
                'email': 'test@unitario.com',
                'password': 'test1234'
            })
            .end((err, res) => {
                
                expect(err).to.be.null;

                expect(res).to.have.status(200);

                expect(res.body.user.name).to.be.equal('unitario')

                expect(res.body.user.surname).to.be.equal('unitario')

                expect(res.body.user.email).to.be.equal('test@unitario.com')

                expect(res.body.user.role).to.be.equal('ROLE_USER')

                done()
            })
        
        
    })
})