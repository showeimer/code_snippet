const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const snippetSchema = new Schema({
  id : {type: String},
  title : {type: String, required: true},
  body : {type: String, required: true},
  optionalNotes: {type: String},
  language: {type: String, required: true},
  tags: {type: String, required: true},
  createdBy: {type: String, required: true}
});

const Snippet = mongoose.model('snippets', snippetSchema);

module.exports = Snippet;
