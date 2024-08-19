require('dotenv').config();
const express = require("express");
const cors = require("cors");
//const Sequelize = require('sequelize');
const router = express.Router();
const app = express();
const path = require("path");
//const dbConfig = require("./db.config.js");
const db = require("./index.model.js");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

  


// Static file serving (uncomment for production)
app.use(express.static(path.join(__dirname, 'build')));

// Synchronize Sequelize models with the database
db.sequelize.sync()
.then(() => {
  console.log("Database connection successful!");
})
.catch((error) => {
  console.error("Error connecting to database:", error);
});

const setQuestionIdSequence = async () => {
  try {
    const result = await db.sequelize.query("SELECT MAX(id) FROM questions;");
    const maxId = result[0][0].max || 268;  // If no questions, start from 268
    await db.sequelize.query(`ALTER SEQUENCE questions_id_seq RESTART WITH ${maxId + 1};`);
    console.log(`Question ID sequence set to start from ${maxId + 1}`);
  } catch (error) {
    console.error('Error setting question ID sequence:', error);
  }
};



// Admin credentials (in a real-world scenario, store these securely)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'kaabil'; // You should generate this securely
  

// Generate hashed password
bcryptjs.hash(ADMIN_PASSWORD, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Admin credentials:');
    console.log('Username:', ADMIN_USERNAME);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('Hashed Password:', hash);
  }
})


// Middleware for admin authentication
const adminAuth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};





/*
// Login route
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, await bcrypt.hash(ADMIN_PASSWORD, 10));

  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ username: ADMIN_USERNAME }, process.env.JWT_SECRET);
  res.json({ token });
});
*/

router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10);
  const isPasswordValid = await bcryptjs.compare(password, hashedPassword);

  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ username: ADMIN_USERNAME }, process.env.JWT_SECRET);
  res.json({ token });
});







router.get('/api/messages/', async (req, res) => {
  try {
    const { search, sort, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    let orderClause = [];

    // Search
    if (search) {
      whereClause[Op.or] = [
        { '$User.firstName$': { [Op.iLike]: `%${search}%` } },
        { '$User.lastName$': { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Sort
    const sortOptions = {
      newest: [['createdAt', 'DESC']],
      oldest: [['createdAt', 'ASC']],
      'a-z': [[db.sequelize.fn('LOWER', db.sequelize.col('User.firstName')), 'ASC']],
      'z-a': [[db.sequelize.fn('LOWER', db.sequelize.col('User.firstName')), 'DESC']],
    };
    orderClause = sortOptions[sort] || sortOptions.newest;

    const { rows, count } = await db.Message.findAndCountAll({
      where: whereClause,
      include: [{
        model: db.user,
        attributes: ['firstName', 'lastName'],
        as: 'User'
      }],
      order: orderClause,
      limit: parseInt(limit),
      offset: offset
    });

    const totalMessages = count;
    const numOfPages = Math.ceil(totalMessages / limit);

    res.status(200).json({
      totalMessages,
      numOfPages,
      currentPage: parseInt(page),
      messages: rows
    });
  } catch (error) {
    console.log("Error fetching messages: ", error);
    res.status(500).json({ error: error.message });
  }
});








/*

// GET route to retrieve all messages
router.get('/api/messages/', async (req, res) => {
  

  try {
    const messages = await db.Message.findAll({
      include: [{
        model: db.user,
        attributes: ['firstName', 'lastName'],
        as: 'User' // This alias should match the association name in your model definitions
      }],
      attributes: {
        include: [
          [db.sequelize.col('User.firstName'), 'firstName'],
          [db.sequelize.col('User.lastName'), 'lastName']
        ]
      }
    });

    res.status(200).json(messages);
  } catch (error) {
  console.log("Error fetching messages: ", error);
  res.status(500).json({ error: error.message });
}
})
*/

/*
router.get('/api/messages/', async (req, res) => {
  try {
      const { search, sortField, sortOrder, filterField, filterValue, page = 1 } = req.query;
      const limit = 10;  // Items per page
      const offset = (page - 1) * limit;

      let whereClause = {};
      let orderClause = [];

      if (search && search.length >= 3) {
          whereClause[Op.or] = [
              { '$User.firstName$': { [Op.iLike]: `%${search}%` } },
              { '$User.lastName$': { [Op.iLike]: `%${search}%` } },
              { questionIndex: { [Op.iLike]: `%${search}%` } },
              { chats: { [Op.iLike]: `%${search}%` } },
              { userInput: { [Op.iLike]: `%${search}%` } },
              db.sequelize.where(db.sequelize.cast(db.sequelize.col('Message.UserId'), 'VARCHAR'), { [Op.iLike]: `%${search}%` }),
              db.sequelize.where(db.sequelize.cast(db.sequelize.col('Message.QuestionId'), 'VARCHAR'), { [Op.iLike]: `%${search}%` })
          ];
      }

    // Filter
    if (filterField && filterValue) {
      if (filterField === 'firstName' || filterField === 'lastName') {
        whereClause[`$User.${filterField}$`] = { [Op.iLike]: `%${filterValue}%` };
      } else if (filterField === 'UserId' || filterField === 'QuestionId') {
        whereClause[filterField] = db.sequelize.where(db.sequelize.cast(db.sequelize.col(`Message.${filterField}`), 'VARCHAR'), { [Op.iLike]: `%${filterValue}%` });
      } else {
        whereClause[filterField] = { [Op.iLike]: `%${filterValue}%` };
      }
    }

    // Sort
    if (sortField) {
      if (sortField === 'firstName' || sortField === 'lastName') {
        orderClause.push([{ model: db.user, as: 'User' }, sortField, sortOrder.toUpperCase()]);
      } else {
        orderClause.push([sortField, sortOrder.toUpperCase()]);
      }
    }
    const { rows, count } = await db.Message.findAndCountAll({
      where: whereClause,
      include: [{
          model: db.user,
          attributes: ['firstName', 'lastName'],
          as: 'User'
      }],
      order: orderClause,
      limit,
      offset
  });

  res.status(200).json({
      messages: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
  });
} catch (error) {
  console.log("Error fetching messages: ", error);
  res.status(500).json({ error: error.message });
}
});
   */ 
  
    /*
// GET route to retrieve a message by ID
router.get('/api/messages/:messageId', async (req, res) => {
    try {
      const { messageId } = req.params;
      const messages = await db.Message.findAll({
        where: {
          id: messageId
        }
      });
      res.status(200).json(messages);
    } catch (error) {
      console.log("Error fetching message: ", error);
      res.status(500).json({ error: error.message });
    }
  });*/



  
// GET route to retrieve a message by ID with user details
router.get('/api/messages/:messageId', async (req, res) => {
    try {
      const { messageId } = req.params;
      const message = await db.Message.findOne({
        where: {
          id: messageId
        },
        include: [{
          model: db.user,
          attributes: ['firstName', 'lastName'],
          as: 'User' // This alias should match the association name in your model definitions
        }],
        attributes: {
          include: [
            [db.sequelize.col('User.firstName'), 'firstName'],
            [db.sequelize.col('User.lastName'), 'lastName']
          ]
        }
      });
  
console.log("messages =",message)

      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      res.status(200).json(message);
    } catch (error) {
      console.log("Error fetching message: ", error);
      res.status(500).json({ error: error.message });
    }
  });
  


// DELETE route to delete a message
router.delete('/api/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedCount = await db.Message.destroy({
      where: { id: messageId }
    });
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: error.message });
  }
});



/*

Questions Routes



*/


router.get('/api/question/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await db.question.findOne({
      where: { id: questionId },
      include: [{
        model: db.course,
        attributes: ['subjectName'],
        as: 'Course'
      }],
      attributes: {
        include: [
          [db.sequelize.col('Course.subjectName'), 'subjectName']
        ]
      }
    });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (question.options && typeof question.options === 'string') {
      question.options = JSON.parse(question.options);
    }

    res.status(200).json(question);
  } catch (error) {
    console.log("Error fetching question: ", error);
    res.status(500).json({ error: error.message });
  }
});

  
// GET route to retrieve all messages
router.get('/api/questions/', async (req, res) => {
 

try {
  const questions = await db.question.findAll({
    include: [{
      model: db.course,
      attributes: ['subjectName'],
      as: 'Course' // This alias should match the association name in your model definitions
    }],
    attributes: {
      include: [
        [db.sequelize.col('Course.subjectName'), 'subjectName']
       
      ]
    }
  });

  res.status(200).json(questions);
} catch (error) {
console.log("Error fetching questions: ", error);
res.status(500).json({ error: error.questions });
}
})
  

/*
router.post('/api/questions', async (req, res) => {
  try {
    const questionData = { ...req.body };
    if (Array.isArray(questionData.options)) {
      questionData.options = JSON.stringify(questionData.options);
    }
    const newQuestion = await db.question.create(questionData);
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: error.message });
  }
});
*/


router.post('/api/questions', async (req, res) => {
  try {
    const questionData = { ...req.body };
    if (Array.isArray(questionData.options)) {
      questionData.options = JSON.stringify(questionData.options);
    }
    // Remove id from questionData if it's present
    delete questionData.id;
    const newQuestion = await db.question.create(questionData);
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: error.message });
  }
});



// PUT route to update a question
router.put('/api/question/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const updatedQuestion = await db.question.update(req.body, {
      where: { id: questionId }
    });
    if (updatedQuestion[0] === 0) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json({ message: "Question updated successfully" });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE route to delete a question
router.delete('/api/question/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const deletedCount = await db.question.destroy({
      where: { id: questionId }
    });
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: error.message });
}
});



/*
Courses 
Routes


*/


// GET route to retrieve a course by ID with user details
router.get('/api/course/:subjectName', async (req, res) => {
  try {
    const { subjectName } = req.params;
    const course = await db.course.findOne({
      where: {
        subjectName: subjectName
      }
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    console.log("these are the courses=",course)
    res.status(200).json(course);
  } catch (error) {
    console.log("Error fetching course: ", error);
    res.status(500).json({ error: error.course });
  }
});


  
// GET route to retrieve all messages
router.get('/api/courses/', async (req, res) => {
 

try {
  const courses = await db.course.findAll({
  });

  res.status(200).json(courses);
} catch (error) {
console.log("Error fetching courses: ", error);
res.status(500).json({ error: error.courses });
}
})




// POST route to create a new course
router.post('/api/courses', async (req, res) => {
  try {
    const { subjectName, courseDescription, UserId } = req.body;

    console.log("req body= ",req.body)
     // Convert UserId to integer or set to null if empty
     const userIdValue = UserId === '' ? null : parseInt(UserId, 10);
    
     const newCourse = await db.course.create({
       subjectName,
       courseDescription,
       UserId: userIdValue
     });
//    const newCourse = await db.course.create(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT route to update a course
router.put('/api/course/:subjectName', async (req, res) => {
  try {
    const { subjectName } = req.params;
    const updatedCourse = await db.course.update(req.body, {
      where: { subjectName: subjectName }
    });
    if (updatedCourse[0] === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: error.message });
  }
});



// DELETE route to delete a course
router.delete('/api/course/:subjectName', async (req, res) => {
  try {
    const { subjectName } = req.params;
    const deletedCount = await db.course.destroy({
      where: { subjectName: subjectName }
    });
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: error.message });
  }
});


/*
User 
Routes

*/





router.get('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await db.user.findOne({
      where: {
        id: userId
      }
    });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error fetching user: ", error);
    res.status(500).json({ error: error.user });
  }
});

  
// GET route to retrieve all users
router.get('/api/users/', async (req, res) => {
 

try {
  const users = await db.user.findAll({
  });

  res.status(200).json(users);
} catch (error) {
console.log("Error fetching courses: ", error);
res.status(500).json({ error: error.users });
}
})


// DELETE route to delete a user
router.delete('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedCount = await db.user.destroy({
      where: { id: userId }
    });
    if (deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
});



setQuestionIdSequence();




// Uncomment for production
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});




/*
END

*/

// Apply adminAuth middleware to all routes
router.use(adminAuth);

app.use(router);
  
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Welcome to Kaabil application." });
  });


  
// Set port and start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
