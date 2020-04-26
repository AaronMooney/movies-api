import mongoose from 'mongoose';
import Movie from '../movies/movieModel'

const Schema = mongoose.Schema;



const PersonSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    profile_path: { type: String},
    known_for_department: { type: String},
    name: {type: String},
    adult: {type: Boolean},
    birthday: {type: String},
    biography: {type: String},
    popularity: {type: String},
    place_of_birth: {type: String}

  });

  PersonSchema.statics.findByPersonDBId = function (id) {
    console.log('findByPersonDBId')
    return this.findOne({ id: id});
  };

export default mongoose.model('Person', PersonSchema);