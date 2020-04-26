import mongoose from 'mongoose';
import {getMovie, getMovieReviews} from '../tmdb-api';

const Schema = mongoose.Schema;

const MovieReviewSchema = {
  author : { type: String},
  content : {type: String}
}

const GenreSchema = new Schema({
  name: {type: String}
});

const ProductionCompanySchema = new Schema({
  logo_path: {type: String},
  name: {type: String},
  origin_country: {type: String}
})

const MovieSchema = new Schema({
    adult: { type: Boolean},
    id: { type: Number, required: true, unique: true },
    poster_path: { type: String},
    overview: { type: String},
    release_date: { type: String},
    original_title: { type: String},
    genre_ids: [{type: Number}],
    original_language: { type: String},
    title: { type: String},
    backdrop_path: { type: String},
    popularity: { type: Number},
    vote_count: { type: Number},
    video: { type: Boolean},
    vote_average: { type: Number},
    production_countries : [ {
        iso_3166_1 : { type: String},
        name : { type: String}
      } ],
    reviews : [ MovieReviewSchema],
      runtime : {type:Number},
spoken_languages : [ {
  iso_639_1 : { type: String},
  name : { type: String}
} ],
status : { type: String},
tagline : { type: String},
genres: [GenreSchema],
production_companies: [ProductionCompanySchema]

  });

  MovieSchema.statics.findByMovieDBId = function (id) {
    console.log('findByMovieDBId')
    return this.findOne({ id: id});
  };

  MovieSchema.statics.findMovieReviews = function(id) {
    console.log("findMovieReviews")
    return this.findByMovieDBId(id).then(movie => {return movie ? {id:movie.id, results: movie.reviews} : null})
};


export default mongoose.model('Movie', MovieSchema);