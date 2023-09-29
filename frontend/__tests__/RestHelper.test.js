import '@testing-library/jest-dom';
import RequestHelper, { EndpointHelper } from '../helpers/RestHelper';

// SETUP
const mockEmail = (Math.random() + 1).toString(36).substring(2, 5) + (Math.random() + 1).toString(36).substring(2, 5) + "@email.com"
const mockPassword = (Math.random()+1).toString(36).substring(2, 5)
const mockDateOfBirth = new Date(1995, 1, 1).toISOString()

//#region EndpointHelper Tests

/**
 * Tests the getBackendAddress method.
 */
test('Test EndpointHelper.getBackendAddress() method', () => {
    // Get the current environment.
    const currentEnv = process.env.NODE_ENV;

    // Test that the correct address is returned, depending on the environment.
    if (currentEnv === 'development'|| process.env.NODE_ENV==='test') {
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
    if (currentEnv === 'development'|| process.env.NODE_ENV==='test') {
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
    if (currentEnv === 'development'|| process.env.NODE_ENV==='test') {
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
    const result = await RequestHelper.authRegisterRequest(mockEmail, mockPassword, mockDateOfBirth);
    expect(result.status).toBe(200);

    // Test that the correct data is returned.
    expect(result.data.user.email).toBe(mockEmail);
    expect(result.data.user.password).not.toBe(mockPassword);
    expect(new Date(result.data.user.dateOfBirth).toISOString()).toBe(mockDateOfBirth);

    // Test that the user can't be duplicated.
    const result2 = await RequestHelper.authRegisterRequest(mockEmail, mockPassword, mockDateOfBirth);
    expect(result2.status).toBe(400);
    expect(result2.data).toBe('User already exists');
});

test('Test RestHelper.authLoginRequest() method', async () => { 
    
    // Test that the correct request is made.
    const result = await RequestHelper.authLoginRequest(mockEmail, mockPassword);
    expect(result.status).toBe(200);

    // Test that the user can't login with a wrong password.
    const result2 = await RequestHelper.authLoginRequest(mockEmail, mockPassword+"wrong");
    expect(result2.status).toBe(401);
    expect(result2.data).toBe('Invalid password');
});


//#endregion