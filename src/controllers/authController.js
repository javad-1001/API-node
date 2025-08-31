const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
const { sendVerificationEmail } = require('../services/emailService');


const register = async (req, res) => {
    const { strName, strEmail, strPassword } = req.body;

    if (!strName || !strEmail || !strPassword) {
        return res.status(400).json({ error: 'Name, email and password are required', status: null });
    }

    try {
        pool.query(`SELECT * FROM user_admin WHERE strEmail = ?`, [strEmail], async (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error', details: err.message, status: null });
            if (results.length > 0) return res.status(409).json({ error: 'Email already exists', status: results[0].status });

            const hashedPassword = await bcrypt.hash(strPassword, 10);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            const insertQuery = `
                INSERT INTO user_admin (strName, strEmail, strPassword, status, verification_code)
                VALUES (?, ?, ?, 1, ?)
            `;
            pool.query(insertQuery, [strName, strEmail, hashedPassword, verificationCode], async (insertErr, insertResult) => {
                if (insertErr) return res.status(500).json({ error: 'Database error', details: insertErr.message, status: null });

                const currentStatus = 1;

                try {
                    await sendVerificationEmail(strEmail, verificationCode);
                    res.status(201).json({
                        message: 'User registered successfully. Verification email sent.',
                        userId: insertResult.insertId,
                        status: currentStatus
                    });
                } catch (emailErr) {
                    res.status(500).json({
                        error: 'User created but failed to send verification email',
                        details: emailErr.message,
                        status: currentStatus
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', status: null });
    }
};

const verifyEmail = (req, res) => {
    const { strEmail, code } = req.body;

    if (!strEmail || !code) {
        return res.status(400).json({ error: 'Email and code are required' });
    }

    pool.query(
        `SELECT * FROM user_admin WHERE strEmail = ? AND verification_code = ?`,
        [strEmail, code],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error', details: err.message });
            if (results.length === 0) return res.status(400).json({ error: 'Invalid verification code' });

            pool.query(
                `UPDATE user_admin SET status = 2, verification_code = NULL WHERE strEmail = ?`,
                [strEmail],
                (updateErr) => {
                    if (updateErr) return res.status(500).json({ error: 'Database error', details: updateErr.message });
                    res.status(200).json({ message: 'Email verified successfully. Status updated to 2.' });
                }
            );
        }
    );
};

const login = async (req, res) => {
    const { strUsername, strPassword } = req.body;

    try {
        const query = `SELECT * FROM user_admin WHERE strUsername = ?`;
        pool.query(query, [strUsername], async (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ error: 'Database error', details: error.message });
            }

            if (results.length === 0) {
                return res.status(401).json({ result: false, error: 'Invalid credentials' });
            }

            const user = results[0];

            const isMatch = await bcrypt.compare(strPassword, user.strPassword);
            if (!isMatch) {
                return res.status(401).json({ result: false, error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET || 'your_secret_key',
                { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
            );

            res.status(200).json({
                result: true,
                message: 'Login successful',
                id: user.id,
                strToken: token,
                strMobile: user.strMobile,
                strName: user.strName,
                strFamily: user.strFamily,
                strEmail: user.strEmail,
                status: user.status,
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    register,
    verifyEmail,
    login
};