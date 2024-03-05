const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const router = express.Router();

// Create a new Sequelize instance with your database credentials
const sequelize = new Sequelize('signup', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
  port: '5432',
});

const Project = sequelize.define('Project', {
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rollNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teamMember1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teamMember1RollNumber: {
    type: DataTypes.STRING, // Add a field for team member 1's roll number
    allowNull: true, // Change to false if it's required
  },
  teamMember2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  teamMember2RollNumber: {
    type: DataTypes.STRING, // Add a field for team member 2's roll number
    allowNull: true, // Change to false if it's required
  },
  teamMember3: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  teamMember3RollNumber: {
    type: DataTypes.STRING, // Add a field for team member 3's roll number
    allowNull: true, // Change to false if it's required
  },
  projectTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  guideName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  guideRollNumber: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  guideDepartment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  guideMobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  guideEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Synchronize the model with the database (create the table if it doesn't exist)
sequelize.sync().then(() => {
  console.log('Projects table created successfully.');
}).catch((error) => {
  console.error('Error creating Projects table:', error);
});



// Route for submitting a project
router.post('/formproject', async (req, res) => {
  const {
    studentName,
    rollNumber,
    teamMember1,
    teamMember1RollNumber,
    teamMember2,
    teamMember2RollNumber,
    teamMember3,
    teamMember3RollNumber,
    projectTitle,
    description,
    guideName,
    guideRollNumber,
    guideDepartment,
    guideMobile,
    guideEmail,
  } = req.body;

  try {
    // Check if the rollNumber field is provided and not null
    if (!rollNumber) {
      return res.status(400).json({ error: 'Roll number is required' });
    }

    // Find or create a project record in the database
    const [project, created] = await Project.findOrCreate({
      where: { rollNumber: String(rollNumber) }, // Explicitly cast to string
      defaults: {
        studentName,
        teamMember1,
        teamMember1RollNumber,
        teamMember2,
        teamMember2RollNumber,
        teamMember3,
        teamMember3RollNumber,
        projectTitle,
        description,
        guideName,
        guideRollNumber,
        guideDepartment,
        guideMobile,
        guideEmail,
      },
    });

    if (!created) {
      // If the project already exists, update its fields
      await Project.update(
        {
          studentName,
          teamMember1,
          teamMember1RollNumber,
          teamMember2,
          teamMember2RollNumber,
          teamMember3,
          teamMember3RollNumber,
          projectTitle,
          description,
          guideName,
          guideDepartment,
          guideMobile,
          guideEmail,
        },
        {
          where: { rollNumber: String(rollNumber) }, // Explicitly cast to string
        }
      );
    }

    res.status(created ? 201 : 200).json(project);
  } catch (error) {
    console.error('Error creating/updating project:', error);
    res.status(500).json({ error: 'Project creation/update failed' });
  }
});




// API endpoint to fetch the verified form submissions for a specific student
router.get('/formproject/student', async (req, res) => {
  const { rollNumber, verified } = req.query;

  // Check if the rollNumber is provided and not empty
  if (!rollNumber) {
    return res.status(400).json({ error: 'Roll number is required' });
  }

  try {
    let formSubmissions;

    if (verified === 'true') {
      // Fetch only the verified form submissions
      formSubmissions = await Project.findAll({ where: { rollNumber, verified: true } });
    } else {
      // Fetch all form submissions for the student (verified or not)
      formSubmissions = await Project.findAll({ where: { rollNumber } });
    }

    res.json(formSubmissions);
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    res.status(500).json({ error: 'Failed to fetch form submissions' });
  }
});

// API endpoint to fetch form submissions for a specific student
router.get('/formproject', async (req, res) => {
  const { rollNumber } = req.query;

  try {
    // Fetch all form submissions for the specified roll number
    const formSubmissions = await Project.findAll({ where: { rollNumber } });

    res.json(formSubmissions);
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    res.status(500).json({ error: 'Failed to fetch form submissions' });
  }
});



// API endpoint to fetch the form submissions for a specific guide's roll number
router.get('/formproject/guide', async (req, res) => {
  const { guideRollNumber } = req.query;

  // Check if the guideRollNumber is provided and not empty
  if (!guideRollNumber) {
    return res.status(400).json({ error: 'Guide roll number is required' });
  }

  try {
    const formSubmissions = await Project.findAll({ where: { guideRollNumber } });
    res.json(formSubmissions);
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    res.status(500).json({ error: 'Failed to fetch form submissions' });
  }
});

// Route to verify a student
router.post('/verify/student/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const updatedStudent = await Project.update(
      { verified: true },
      { where: { id: studentId } }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error verifying student:', error);
    res.status(500).json({ error: 'Failed to verify student' });
  }
});

// API endpoint to fetch the student's guide name based on the student's roll number from the submission
router.get('/formproject/student-guide', async (req, res) => {
  const { rollNumber } = req.query;

  // Check if the rollNumber is provided and not empty
  if (!rollNumber) {
    return res.status(400).json({ error: 'Roll number is required' });
  }

  try {
    // Find the student's record in the database
    const student = await Project.findOne({ where: { rollNumber } });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Retrieve the guide's name from the student's record
    const guideName = student.guideName;

    res.json({ guideName });
  } catch (error) {
    console.error('Error fetching student guide name:', error);
    res.status(500).json({ error: 'Failed to fetch student guide name' });
  }
});


// API endpoint to fetch the guide's roll number based on the student's roll number
router.get('/formproject/studguide', async (req, res) => {
  const { rollNumber } = req.query;

  // Check if the rollNumber is provided and not empty
  if (!rollNumber) {
    console.log('Error: Roll number is required');
    return res.status(400).json({ error: 'Roll number is required' });
  }

  try {
    // Find the student's record in the database
    const student = await Project.findOne({ where: { rollNumber } });

    if (!student) {
      console.log('Error: Student not found');
      return res.status(404).json({ error: 'Student not found' });
    }

    // Retrieve the guide's roll number from the student's record
    const guideRollNumber = student.guideRollNumber; // Update the field name here

    if (!guideRollNumber) {
      console.log("Error: Guide's roll number not found for the student");
      return res.status(404).json({ error: "Guide's roll number not found for the student" });
    }

    console.log('Guide Roll Number:', guideRollNumber);
    res.json({ guideRollNumber });
  } catch (error) {
    console.error('Error fetching guide roll number for student:', error);
    res.status(500).json({ error: 'Failed to fetch guide roll number for the student' });
  }
});

// Define a route to get all students in the same project team
router.get('/student/team', async (req, res) => {
  try {
    // Find all students who are part of the same project team
    const students = await Project.findAll({
      where: {
        verified: true, // Assuming verified is a field to indicate a valid project
      },
      attributes: ['guideName', 'projectTitle', 'teamMember1RollNumber', 'teamMember2RollNumber', 'teamMember3RollNumber', 'teamMember1', 'teamMember2', 'teamMember3'],
    });

    const uniqueTeamMembers = {};

    // Iterate through the students and store unique team members based on their roll numbers
    students.forEach((student) => {
      const guideName = student.guideName;
      const projectTitle = student.projectTitle;
      const teamMembersRollNumbers = [
        student.teamMember1RollNumber,
        student.teamMember2RollNumber,
        student.teamMember3RollNumber,
      ];

      const teamMembersNames = [student.teamMember1, student.teamMember2, student.teamMember3];

      // Remove null or empty values from the team members' roll numbers and names arrays
      const cleanedTeamMembers = teamMembersRollNumbers.filter((rollNumber) => rollNumber);
      const cleanedTeamMembersNames = teamMembersNames.filter((name) => name);

      if (cleanedTeamMembers.length > 0) {
        // Create a key for unique team members based on the sorted roll numbers
        const key = [guideName, projectTitle, ...cleanedTeamMembers].sort().join(', ');

        if (!uniqueTeamMembers[key]) {
          uniqueTeamMembers[key] = {
            guideName,
            projectTitle,
            teamMembersRollNumbers: cleanedTeamMembers,
            teamMembersNames: cleanedTeamMembersNames,
          };
        }
      }
    });

    const uniqueStudents = Object.values(uniqueTeamMembers);

    res.json(uniqueStudents);
  } catch (error) {
    console.error('Error fetching students in the same project team:', error);
    res.status(500).json({ error: 'Failed to fetch students in the same project team' });
  }
});


module.exports = router;
