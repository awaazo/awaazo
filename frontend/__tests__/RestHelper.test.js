/**
 * @jest-environment node
 */

import '@testing-library/jest-dom';
import RequestHelper, { EndpointHelper } from '../helpers/RestHelper';

// SETUP
const mockEmail = (Math.random() + 1).toString(36).substring(2, 5) + (Math.random() + 1).toString(36).substring(2, 5) + "@email.com"
const mockPassword = (Math.random()+1).toString(36).substring(2, 5)
const mockDateOfBirth = new Date(1995, 1, 1).toISOString()
const mockUsername = (Math.random() + 1).toString(36).substring(2, 5)

//#region EndpointHelper Tests

/**
 * Tests the getBackendAddress method.
 */
test('Test EndpointHelper.getBackendAddress() method', () => {
    // Get the current environment.
    const currentEnv = process.env.NODE_ENV;

    // Test that the correct address is returned, depending on the environment.
    if (currentEnv === 'development'|| currentEnv==='test') {
        const result = EndpointHelper.getBackendAddress();
        expect(result).toBe('http://localhost:32773');
    }
    else {
        const result = EndpointHelper.getBackendAddress();
        expect(result).toBe('http://backend:32773');
    }
});

/**
 * Tests the getAuthLoginEndpoint method.
 */
test('Test EndpointHelper.getAuthLoginEndpoint() method', () => {
    // Get the current environment.
    const currentEnv = process.env.NODE_ENV;

    // Test that the correct endpoint is returned, depending on the environment.
    if (currentEnv === 'development'|| currentEnv==='test') {
        const result = EndpointHelper.getAuthLoginEndpoint();
        expect(result).toBe('http://localhost:32773/auth/login');
    }
    else {
        const result = EndpointHelper.getAuthLoginEndpoint();
        expect(result).toBe('http://backend:32773/auth/login');
    }
});

/**
 * Tests the getAuthRegisterEndpoint method.
 */
test('Test EndpointHelper.getAuthRegisterEndpoint() method', () => {
    // Get the current environment.
    const currentEnv = process.env.NODE_ENV;

    // Test that the correct endpoint is returned, depending on the environment.
    if (currentEnv === 'development'|| currentEnv==='test') {
        const result = EndpointHelper.getAuthRegisterEndpoint();
        expect(result).toBe('http://localhost:32773/auth/register');
    }
    else {
        const result = EndpointHelper.getAuthRegisterEndpoint();
        expect(result).toBe('http://backend:32773/auth/register');
    }
});

//#endregion

//#region RestHelper Tests

/**
 * Tests the authRegisterRequest() method.
 */
test('Test RestHelper.authRegisterRequest() method', async () => {

    // Test that the correct request is made.
    const result = await RequestHelper.authRegisterRequest(mockEmail, mockPassword, mockDateOfBirth,"None",mockUsername);
    expect(result.status).toBe(200);

    // Test that the user can't be duplicated.
    const result2 = await RequestHelper.authRegisterRequest(mockEmail, mockPassword, mockDateOfBirth,"None",mockUsername);
    expect(result2.status).toBe(400);
    expect(result2.error_message).toBe('An Account with that Email already exists. Please Login or use a different Email address.');
});

test('Test RestHelper.authLoginRequest() method', async () => { 
    
    // Test that the correct request is made.
    const result = await RequestHelper.authLoginRequest(mockEmail, mockPassword);
    expect(result.status).toBe(200);

    // Test that the user can't login with a wrong password.
    const result2 = await RequestHelper.authLoginRequest(mockEmail, mockPassword+"wrong");
    expect(result2.status).toBe(400);
    expect(result2.error_message).toBe('Login failed. Invalid Email and/or Password.');
});


//#endregion