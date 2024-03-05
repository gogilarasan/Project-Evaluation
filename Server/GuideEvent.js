const express = require('express');
const bodyParser = require('body-parser');

const { Sequelize, DataTypes } = require('sequelize');
const nodemailer = require('nodemailer');

const router = express.Router();
router.use(bodyParser.json());


const sequelize = new Sequelize('signup', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres',
    port: '5432',
});

const GuideEvent = sequelize.define('GuideEvent', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guideRollNo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});


(async () => {
    try {
        await sequelize.sync();
        console.log('Event Database synced');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
})();

router.post('/guide-events', async (req, res) => {
    const { title, start, end, guideRollNo, createdBy } = req.body;

    try {
        const guideEvent = await GuideEvent.create({
            title,
            start,
            end,
            guideRollNo,
            createdBy,
        });

        res.status(201).json(guideEvent);
    } catch (error) {
        console.error('Error creating guide event:', error);
        res.status(500).json({ error: 'Guide event creation failed' });
    }
});

// Fetch Guide Events by Guide Roll Number
router.get('/guide-events', async (req, res) => {
    const { guideRollNo } = req.query;

    // Check if guideRollNo is provided and not empty
    if (!guideRollNo) {
        return res.status(400).json({ error: 'Guide Roll Number is required' });
    }

    try {
        const guideEvents = await GuideEvent.findAll({
            where: {
                guideRollNo: guideRollNo,
            },
        });

        res.json(guideEvents);
    } catch (error) {
        console.error('Error fetching guide events:', error);
        res.status(500).json({ error: 'Failed to fetch guide events' });
    }
});

// DELETE a guide event by ID
router.delete('/guide-events/:eventId', async (req, res) => {
    const eventId = req.params.eventId;

    try {
        // Find the guide event by ID
        const guideEvent = await GuideEvent.findByPk(eventId);

        if (!guideEvent) {
            return res.status(404).json({ error: 'Guide event not found' });
        }

        // Perform the deletion
        await guideEvent.destroy();

        return res.status(204).send(); // 204 No Content indicates a successful deletion
    } catch (error) {
        console.error('Error deleting guide event:', error);
        res.status(500).json({ error: 'Failed to delete guide event' });
    }
});


module.exports = router;
