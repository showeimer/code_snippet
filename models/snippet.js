const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const snippetSchema = new Schema({
  // _id: {type: String},
  id : {type: String},
  title : {type: String, required: true},
  body : {type: String, required: true},
  optionalNotes: {type: String},
  language: {type: String, required: true},
  tags: {type: String, required: true}
});

const Snippet = mongoose.model('snippets', snippetSchema);

module.exports = Snippet;
