const mongoose=require('mongoose')
const userSchema = new mongoose.Schema({
  name:{
    type: String,
  },
  email:{
    type: String,
  },
  password:{
    type: String,
  },
  phone:{
    type: String,
  },
  image:{
    type: String,
  },
  
  
  });
  
  // Create a model based on the schema
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;