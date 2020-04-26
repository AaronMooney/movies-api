import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  id: {type: Number},
  name: {type: String}
});

const NetworkSchema = new Schema({
  name: {type: String},
  id: {type: Number},
  logo_path: {type: String},
  origin_country: {type: String}
})

const ProductionCompanySchema = new Schema({
  id: {type: Number},
  logo_path: {type: String},
  name: {type: String},
  origin_country: {type: String}
})

const TvShowReviewSchema = {
  userName : { type: String},
  review : {type: String}
}

const TvShowSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    poster_path: { type: String},
    overview: { type: String},
    first_air_date: { type: String},
    original_name: { type: String},
    genre_ids: [{type: Number}],
    original_language: { type: String},
    name: { type: String},
    backdrop_path: { type: String},
    popularity: { type: Number},
    vote_count: { type: Number},
    vote_average: { type: Number},
    episode_run_time: [{type: Number}],
    genres: [GenreSchema],
    homepage: {type: String},
    last_air_date: {type: String},
    networks: [NetworkSchema],
    number_of_episodes: {type: Number},
    number_of_seasons: {type: Number},
    production_companies: [{ProductionCompanySchema}],
    reviews: [TvShowReviewSchema]

  });

  TvShowSchema.statics.findByTvShowDBId = id => {
    return this.findOne({ id: id});
  };

  MovieSchema.statics.findTvShowReviews = function(id) {
    return this.findByTvShowDBId(id)
    .then(tvShow => {return {id:tvShow.id, results: tvShow.reviews}})
};


export default mongoose.model('TvShow', TvShowSchema);