const mongoose=require('mongoose')
const studentSchema = new mongoose.Schema({
    student_name: {
        type:String,
    },
    student_email: {
        type:String,
    },
    student_password: {
        type:String,
    },
    roll_no: {
        type:String,
    },
    teacher_id: {
        type:String,
        // ref: 'User'
    }



})

  // Create a model based on the schema
  const Student = mongoose.model('Student', studentSchema);

  module.exports = Student;