const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = 'my_secret_key';
const multer = require('multer');
const fs = require('fs');
const Student = require('../model/studentModel');
const User = require('../model/authModel');

const store = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir('images', { recursive: true }, function (err) {
      if (err) return cb(err);
      cb(null, './images');
    });
  },
  filename: function (req, file, cb) {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    cb(null, Date.now() + '-' + name);
  }
});
// path.join(__dirname + '/images'+ req.file.filename)
exports.upload = multer({ storage: store }).single('file');
exports.CreateUser = (async (req, res) => {
  const email = req.email;
  console.log("emaill=====>", email);
  let image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  console.log(image)
  let data = await User.findOneAndUpdate({ email: email }, { image: image},
    {
      new: true,
      upsert: true
    })
  console.log("==================>", data);
  return res.status(200).json({
    message: "success",
    data: data
  })

});





exports.UserRegister = (req, res) => {
  const userData = req.body;
  const saltRounds = 10;

  // Check if user already exists
  User.findOne({ email: userData.email })
    .then((user) => {
      if (user) {
        // User already exists
        console.log('User already exists');
        return res.status(409).send('User already exists');
      }

      // Hash the password
      bcrypt.hash(userData.password, saltRounds, function (err, hash) {
        if (err) {
          console.error(err);
          return res.status(500).send('Error creating user');
        }

        // Create a new User object
        const newUser = new User({
          name: userData.name,
          email: userData.email,
          password: hash,
          phone: userData.phone,
        });

        // Save the new user to the database
        newUser
          .save()
          .then(() => {
            console.log('User created successfully');
            res.send('User created successfully');
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Error creating user');
          });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error creating user');
    });
};


exports.userLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find the user with the provided email
  await User.findOne({ email: email })
    .then(async (user) => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      } else {
        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        // If the password is correct, generate a token and send it back to the client
        var token = jwt.sign({ userId: user._id , email, password }, secretKey);
        console.log("=====>token is ",token)
        res.status(200).json({
          massage: "Login",
          token
        })
      }
    })

}

exports.getUser = async (req, res) => {
  const email = req.email;
  const user = await User.findOne({ email });
  if (!user || !user.image) {
    return res.status(404).json({
      message: 'Image not found'
    });
  }
  const image = user.image;
  const name = user.name;
  const phone = user.phone;
  res.status(200).json({
    email,
    name,
    image,
    phone
  });
};


exports.forgotPassword = async (req, res) => {
  const { email, password } = req.body;
  console.log("=====>Email", email)

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  const data = await User.findOneAndUpdate({ email: email }, { password: hashedPassword })
  console.log("======> Data", data)

  if (data) {

    res.status(200).json({
      message: "Password updated successfully"
    })
  } else {
    res.status(404).json({
      message: "User not found"
    })
  }
}

exports.createStudent = async (req, res) => {
  const studentData = req.body;
  console.log("========>", studentData);
  try {
    const existingStudent = await Student.findOne({
      student_email: studentData.student_email
    });

    if (existingStudent) {
      return res.status(500).json({
        error: "Student already exists"
      });
    }

    const student = new Student({
      teacher_id: req.userId,
      student_name: studentData.student_name,
      student_email: studentData.student_email,
      student_password: studentData.student_password,
      roll_no: studentData.roll_no
    });

    console.log("==========>", student);
    await student.save();
    res.status(201).json({
      message: "Student created successfully"
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create student"
    });
  }
};


exports.getStudent = async (req, res) => {
  const teacher_id = req.userId;
  const student = await Student.find({ teacher_id }).select('student_email student_name roll_no');
  
  if (!student) {
    return res.status(404).json({
      message: 'Student not found'
    });
  }

  res.status(200).json({
    student: student
  });
};


exports.updateStudent = async (req, res) => {
  const  studentiddd  = req.body.student_id;
  console.log("data================>data",studentiddd)
  const studentData = req.body;

  try {
    const updatedStudent = await Student.findOneAndUpdate({ _id : studentiddd } ,studentData, 
      {
        new: true,
        upsert: true
      })

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ error: "Failed to update student" });
  }
};


exports.deleteStudent = async (req, res) => {
  const  student_id = req.params.id;
  console.log(student_id)

  try {
    const deletedStudent = await Student.findOneAndDelete(student_id,
      {
        new: true,
        upsert: true
      });

    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
};











