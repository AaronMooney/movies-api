import should from 'should';
import tvShowModel from '../tvShowModel';

describe('tvShowModelTests', () => {
    const testShow = {};
    const invalidShow = {};

    before(()=>{
        //valid Tv Show object
        testShow.id = 1;
        testShow.name = "Test TV Show"        
        //invalid Tv Show object
        invalidShow.name="dodgy";


    });

    it('should validate a tv show with id', (done) => {   
      const m = new tvShowModel(testShow);
      m.validate((err) => {
        should.not.exist(err);
        m.id.should.equal(testShow.id);
        m.name.should.equal(testShow.name);
        done();
      });
    });

    it('should require an id (tv)', (done) => {
      const m = new tvShowModel(invalidShow);
      m.validate((err) => {
        should.exist(err);
        const errors = err.errors;
        errors.should.have.property("id");
        done();
      });
    });
  
})