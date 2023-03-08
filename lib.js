const { google } = require('googleapis');
const path = require('path');
const { JWT } = require('google-auth-library');
const fs = require('fs');

const getLatestDeviceData = async () => {
    try {
    const keys = JSON.parse(fs.readFileSync(path.resolve('./credentials/keyFile.json')));
    const authClient = new JWT(
        keys.client_email,
        path.resolve('./keyFile.json'),
        keys.private_key,
        [
            'https://www.googleapis.com/auth/admin.directory.user',
            'https://www.googleapis.com/auth/admin.directory.user.security',
            'https://www.googleapis.com/auth/admin.directory.user.readonly',
            'https://www.googleapis.com/auth/admin.directory.device.chromeos'
        ],
        process.env.ADMIN_GOOGLE_WORKSPACE_EMAIL,
    );

    const admin = google.admin({
        version: 'directory_v1',
        auth: authClient,
    });

    const device = await admin.chromeosdevices.list({
        customerId: process.env.ADMIN_GOOGLE_WORKSPACE_CUSTOMER_ID,
    });

    const responseUsers = await admin.users.list({
        domain: 'ceiamerica.org',
    });

    const users = (responseUsers?.data?.users ?? []).map(user => ({
        emails: (user.emails || []).map(email => email.address),
        userId: user.id,
        lastLoginTime: user.lastLoginTime,
        creationTime: user.creationTime,
    }));

    const chromeosdevices = device?.data?.chromeosdevices ?? [];
    const response = chromeosdevices.map(({
        deviceId, serialNumber, model, status, lastEnrollmentTime, lastSync, annotatedUser, osVersion, recentUsers,
    }) => {
        const userInformation = users.find(user => (user.emails || []).includes(annotatedUser));
        return {
            deviceId,
            serialNumber,
            model,
            status,
            lastEnrollmentTime,
            lastSync,
            annotatedUser,
            osVersion,
            recentUsers,
            userInformation,
        }
    });

    return response;
    } catch (err) {
        console.error(err)
        return false;
    }
}

module.exports = getLatestDeviceData;