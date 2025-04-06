import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Link, Alert, Container, CssBaseline } from '@mui/material';
import axios from 'axios';

export default function Login({ setLoggedInUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [email, setEmail] = useState('');
    const [aadharNo, setAadharNo] = useState('');
    const [panNo, setPanNo] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateMobileNo = (mobileNo) => {
        const regex = /^[0-9]{10}$/;
        return regex.test(mobileNo);
    };

    const validateAadharNo = (aadharNo) => {
        const regex = /^[0-9]{12}$/;
        return regex.test(aadharNo);
    };

    const validatePanNo = (panNo) => {
        const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return regex.test(panNo);
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return (
            password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasDigit &&
            hasSpecialChar
        );
    };

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Username and password are required!');
            return;
        }

        try {
            const response = await axios.post('https://localhost:8080/api/users/login', null, {
                params: {
                    username,
                    password,
                },
            });

            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
                setLoggedInUser(response.data);
                alert('Login Successful!');
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.response?.data || 'Invalid credentials!');
        }
    };

    const handleSignUp = async () => {
        if (!fullName || !mobileNo || !email || !aadharNo || !panNo || !username || !password || !confirmPassword) {
            setError('All fields are required!');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!validateMobileNo(mobileNo)) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }

        if (!validateAadharNo(aadharNo)) {
            setError('Please enter a valid 12-digit Aadhar number.');
            return;
        }

        if (!validatePanNo(panNo)) {
            setError('Please enter a valid PAN number (e.g., ABCDE1234F).');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        const userData = {
            fullName,
            mobileNo,
            email,
            aadharNo,
            panNo,
            username,
            passwordHash: password,
        };

        try {
            const response = await axios.post('https://localhost:8080/api/users/register', userData);
            if (response.data) {
                const loginResponse = await axios.post('https://localhost:8080/api/users/login', null, {
                    params: {
                        username: userData.username,
                        password: userData.passwordHash,
                    },
                });
                if (loginResponse.data) {
                    localStorage.setItem("user", JSON.stringify(userData));
                    setLoggedInUser(userData);
                    alert('Sign Up and Login Successful!');
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            setError(error.response?.data || 'Registration failed. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundImage: 'url(https://t4.ftcdn.net/jpg/07/96/34/59/360_F_796345948_VoezX9GWSkPU35jEY2x6Zue3snUTBvlm.jpg)', // Ensure the path is correct
                backgroundSize: 'cover', // Ensures the image covers the entire background
                backgroundPosition: 'center', // Centers the image
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white background
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {isLogin ? (
                    // Login Form
                    <>
                        <TextField
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            variant="outlined"
                            required
                        />
                        <Button
                            variant="contained"
                            onClick={handleLogin}
                            sx={{ mb: 2, width: '100%', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
                        >
                            Login
                        </Button>
                        <Typography>
                            Don't have an account?{' '}
                            <Link
                                component="button"
                                onClick={() => setIsLogin(false)}
                                sx={{ color: '#1976d2', textDecoration: 'none' }}
                            >
                                Sign Up
                            </Link>
                        </Typography>
                    </>
                ) : (
                    // Sign Up Form
                    <>
                        <TextField
                            label="Full Name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Mobile No"
                            type="text"
                            value={mobileNo}
                            onChange={(e) => setMobileNo(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Aadhar No"
                            type="text"
                            value={aadharNo}
                            onChange={(e) => setAadharNo(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="PAN No"
                            type="text"
                            value={panNo}
                            onChange={(e) => setPanNo(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            variant="outlined"
                            required
                        />
                        <Button
                            variant="contained"
                            onClick={handleSignUp}
                            sx={{ mb: 2, width: '100%', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
                        >
                            Sign Up
                        </Button>
                        <Typography>
                            Already have an account?{' '}
                            <Link
                                component="button"
                                onClick={() => setIsLogin(true)}
                                sx={{ color: '#1976d2', textDecoration: 'none' }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </>
                )}
            </Box>
        </Box>
    );
}