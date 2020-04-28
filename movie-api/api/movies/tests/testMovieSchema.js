import should from 'should';
import movieModel from '../movieModel';

describe('movieModelTests', () => {
    const testMovie = {};
    const invalidMovie = {};

    before(()=>{
        //valid Tv Show object
        testMovie.id = 1;
        testMovie.title = "Test Movie"        
        //invalid Tv Show object
        invalidMovie.title="dodgy";


    });

    it('should validate a movie with id', (done) => {   
      const m = new movieModel(testMovie);
      m.validate((err) => {
        should.not.exist(err);
        m.id.should.equal(testMovie.id);
        m.title.should.equal(testMovie.title);
        done();
      });
    });

    it('should require an id (movie)', (done) => {
      const m = new movieModel(invalidMovie);
      m.validate((err) => {
        should.exist(err);
        const errors = err.errors;
        errors.should.have.property("id");
        done();
      });
    });
  
})