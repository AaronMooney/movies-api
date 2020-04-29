import should from 'should';
import personModel from '../personModel';

describe('personModelTests', () => {
    const testPerson = {};
    const invalidPerson = {};

    before(()=>{
        //valid Tv Show object
        testPerson.id = 1;
        testPerson.name = "Aaron"        
        //invalid Tv Show object
        invalidPerson.name="dodgy";


    });

    it('should validate a person with id', (done) => {   
      const m = new personModel(testPerson);
      m.validate((err) => {
        should.not.exist(err);
        m.id.should.equal(testPerson.id);
        m.name.should.equal(testPerson.name);
        done();
      });
    });

    it('should require an id (person)', (done) => {
      const m = new personModel(invalidPerson);
      m.validate((err) => {
        should.exist(err);
        const errors = err.errors;
        errors.should.have.property("id");
        done();
      });
    });
  
})