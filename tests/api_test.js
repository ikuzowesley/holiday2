const fetch = require('node-fetch'); // Assuming node-fetch is available or using built-in fetch in newer node
// In Node 18+ fetch is global.

const BASE_URL = 'http://localhost:3005/api';
const EMAIL = 'apitest_' + Date.now() + '@example.com';
const PASSWORD = 'password123';

async function test() {
    console.log('--- Starting API Verification Test ---');

    // 1. Register
    console.log(`\n1. Registering user: ${EMAIL}`);
    try {
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'API Tester', email: EMAIL, password: PASSWORD, role: 'admin' })
        });
        const regData = await regRes.json();
        console.log('Registration Response:', JSON.stringify(regData));

        if (!regData.userId && !regData.message) {
            throw new Error('Registration failed');
        }
    } catch (e) {
        console.error('Registration Error:', e.message);
        process.exit(1);
    }

    // 2. Login
    console.log(`\n2. Logging in...`);
    let token = '';
    try {
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD })
        });
        const loginData = await loginRes.json();
        console.log('Login Response:', JSON.stringify(loginData));

        if (loginData.token) {
            token = loginData.token;
            console.log('✅ Login successful! Token received.');
        } else {
            throw new Error('Login failed - no token');
        }
    } catch (e) {
        console.error('Login Error:', e.message);
        process.exit(1);
    }

    // 3. Verify Protected Route (Get Students)
    console.log(`\n3. Accessing Protected Route (/api/students)...`);
    try {
        const studentsRes = await fetch(`${BASE_URL}/students`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (studentsRes.status === 200) {
            const studentsData = await studentsRes.json();
            console.log('✅ Access granted! Response:', JSON.stringify(studentsData).substring(0, 100) + '...');
            console.log('\nSUCCESS: Authentication flow is working correctly.');
        } else {
            const errText = await studentsRes.text();
            console.error(`❌ Access denied! Status: ${studentsRes.status}. Body: ${errText}`);
            throw new Error('Access denied');
        }
    } catch (e) {
        console.error('Protected Route Error:', e.message);
        process.exit(1);
    }
}

test();
