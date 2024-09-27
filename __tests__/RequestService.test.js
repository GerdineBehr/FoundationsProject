// __tests__/RequestService.test.js

// 1. Set environment variable before any mocks and imports
process.env.JWT_SECRET = 'test_secret';

// 2. Mock dependencies before importing the modules under test
jest.mock('../src/main/DAO/RequestDAO');

const refundRequestDao = require('../src/main/DAO/RequestDAO');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const {
    login,
    postRefundRequest,
} = require('../src/main/Service/RequestService');

// 3. Clear mocks before each test to ensure test isolation
beforeEach(() => {
    jest.clearAllMocks();
});

describe('RequestService - login function', () => {
    test('should return a token if credentials are valid', async () => {
        // Arrange
        refundRequestDao.login.mockResolvedValue(true);
        refundRequestDao.fetchUserRole.mockResolvedValue("Employee");

        // Act
        const result = await login("testuser", "testpass");

        // Assert
        expect(refundRequestDao.login).toHaveBeenCalledWith("testuser", "testpass");
        expect(refundRequestDao.fetchUserRole).toHaveBeenCalledWith("testuser");
        expect(result).toHaveProperty('message', 'Login successful');
        expect(result).toHaveProperty('token');
        expect(typeof result.token).toBe('string');

        // Verify the token's payload
        const decoded = jwt.verify(result.token, process.env.JWT_SECRET);
        expect(decoded).toMatchObject({ username: "testuser", role: "Employee" });
    });

    test('should throw an error if username or password is missing', async () => {
        await expect(login(null, "testpass")).rejects.toThrow("Username and Password are required");
        await expect(login("testuser", null)).rejects.toThrow("Username and Password are required");
    });

    test('should return "Invalid credentials" if login fails', async () => {
        // Arrange
        refundRequestDao.login.mockResolvedValue(false);

        // Act
        const result = await login("testuser", "wrongpass");

        // Assert
        expect(result).toEqual({ message: "Invalid credentials" });
    });

    test('should throw "Internal Server Error" if DAO throws an error', async () => {
        // Arrange
        refundRequestDao.login.mockRejectedValue(new Error("DB Error"));

        // Act & Assert
        await expect(login("testuser", "testpass")).rejects.toThrow("Internal Server Error");
    });
});

describe('RequestService - postRefundRequest function', () => {
    test('should successfully post a refund request', async () => {
        // Arrange
        const mockRequest = { AccountID: "123", Amount: 100 };

        // Mock the DAO to return the refund request with a generated UUID and Status
        refundRequestDao.postRefundRequest.mockImplementation(async (refundRequest) => {
            return {
                ...refundRequest,
                RequestNumber: refundRequest.RequestNumber,
                Status: "Pending"
            };
        });

        // Act
        const result = await postRefundRequest(mockRequest);

        // Assert
        expect(refundRequestDao.postRefundRequest).toHaveBeenCalled();

        const calledWith = refundRequestDao.postRefundRequest.mock.calls[0][0];
        expect(calledWith.AccountID).toBe(mockRequest.AccountID);
        expect(calledWith.Amount).toBe(mockRequest.Amount);
        expect(calledWith).toHaveProperty('RequestNumber');
        expect(calledWith).toHaveProperty('Status', 'Pending');

        // Validate that RequestNumber is a valid UUID
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(calledWith.RequestNumber);
        expect(isValidUUID).toBe(true);

        // Validate the result
        expect(result).toEqual({
            ...mockRequest,
            RequestNumber: calledWith.RequestNumber,
            Status: "Pending"
        });
    });

    test('should throw an error if the refund request is invalid', async () => {
        await expect(postRefundRequest({ AccountID: "123" })).rejects.toThrow("Invalid refund request data");
        await expect(postRefundRequest({ Amount: 100 })).rejects.toThrow("Invalid refund request data");
    });

    test('should throw "Internal Server Error" if DAO throws an error', async () => {
        // Arrange
        refundRequestDao.postRefundRequest.mockRejectedValue(new Error("DB Error"));

        // Act & Assert
        await expect(postRefundRequest({ AccountID: "123", Amount: 100 })).rejects.toThrow("Internal Server Error");
    });
});
