import httpStatus from 'http-status';
import bcrypt, { hash } from 'bcryptjs';
import { User } from '../models/user.model.js';
import { Meeting } from '../models/meeting.model.js';
import crypto from 'crypto';

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(httpStatus.BAD_REQUEST).send({ error: 'Username and password are required' });
    }
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({ error: 'User not found' });
        }
        if (await bcrypt.compare(password, user.password)) {
            let token = crypto.randomBytes(16).toString('hex');
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).send({ token: token, user: { name: user.name, username: user.username } });
        } else {
            // Fix: send response if password invalid
            return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Invalid Password' });
        }
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Login failed' });
    }
}

const register = async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).send({ error: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name: name, username: username, password: hashedPassword });
        await newUser.save();
        res.status(httpStatus.CREATED).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Registration failed' });
    }
}
const getUserHistory = async (req, res) => {
    const { token } = req.query;
    try {
        const user = await User.findOne({ token: token });
        // Fix: Use user_id matching the model
        const meeting = await Meeting.find({ user_id: user.username });
        res.json(meeting);
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Failed to get user history' });
    }
}
const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;
    try {
        const user = await User.findOne({ token: token });
        const newMeeting = new Meeting({ user_id: user.username, meetingCode: meeting_code });
        await newMeeting.save();
        res.status(httpStatus.CREATED).send({ message: 'Meeting added to history' });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Failed to add meeting to history' });
    }
}

const deleteHistory = async (req, res) => {
    const { token, meeting_code } = req.body;
    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({ error: "User not found" });
        }
        await Meeting.deleteOne({ user_id: user.username, meetingCode: meeting_code });
        res.status(httpStatus.OK).send({ message: "Meeting deleted from history" });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Failed to delete meeting" });
    }
}

export { login, register, getUserHistory, addToHistory, deleteHistory };