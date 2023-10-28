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

