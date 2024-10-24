// __tests__/RequestService.test.js

// 1. Set environment variable before any mocks and imports
process.env.JWT_SECRET = "test_secret";

// 2. Mock dependencies before importing the modules under test
jest.mock("../src/main/DAO/RequestDAO");

const refundRequestDao = require("../src/main/DAO/RequestDAO");
const {
  getRefundRequestsByAccountId,
  getPendingRefundRequests,
  updateRefundRequestStatus,
} = require("../src/main/Service/RequestService");

// 3. Clear mocks before each test to ensure test isolation
beforeEach(() => {
  jest.clearAllMocks();
});

describe("RequestService - getRefundRequestsByAccountId function", () => {
  test("should return refund requests for a valid account ID", async () => {
    // Arrange
    const mockRequests = [{ RequestNumber: "123", Status: "Pending" }];
    refundRequestDao.fetchRefundRequestsByAccountId.mockResolvedValue(
      mockRequests
    );

    // Act
    const result = await getRefundRequestsByAccountId("valid-account-id");

    // Assert
    expect(
      refundRequestDao.fetchRefundRequestsByAccountId
    ).toHaveBeenCalledWith("valid-account-id");
    expect(result).toEqual(mockRequests);
  });

  test("should throw an error if no refund requests are found", async () => {
    // Arrange
    refundRequestDao.fetchRefundRequestsByAccountId.mockResolvedValue([]);

    // Act & Assert
    await expect(
      getRefundRequestsByAccountId("invalid-account-id")
    ).rejects.toThrow("You again? No refund requests found for this account");
  });

  test('should throw "Internal Server Error" if DAO throws an error', async () => {
    // Arrange
    refundRequestDao.fetchRefundRequestsByAccountId.mockRejectedValue(
      new Error("DB Error")
    );

    // Act & Assert
    await expect(
      getRefundRequestsByAccountId("error-account-id")
    ).rejects.toThrow("DB Error");
  });
});

describe("RequestService - getPendingRefundRequests function", () => {
  test("should return pending refund requests", async () => {
    // Arrange
    const mockRequests = [{ RequestNumber: "123", Status: "Pending" }];
    refundRequestDao.fetchPendingRefundRequests.mockResolvedValue(mockRequests);

    // Act
    const result = await getPendingRefundRequests();

    // Assert
    expect(refundRequestDao.fetchPendingRefundRequests).toHaveBeenCalled();
    expect(result).toEqual(mockRequests);
  });

  test("should return an empty array if no pending refund requests are found", async () => {
    // Arrange
    refundRequestDao.fetchPendingRefundRequests.mockResolvedValue([]);

    // Act
    const result = await getPendingRefundRequests();

    // Assert
    expect(result).toEqual([]);
  });

  test('should throw "Internal Server Error" if DAO throws an error', async () => {
    // Arrange
    refundRequestDao.fetchPendingRefundRequests.mockRejectedValue(
      new Error("DB Error")
    );

    // Act & Assert
    await expect(getPendingRefundRequests()).rejects.toThrow(
      "Error fetching pending refund requests from the database"
    );
  });
});

describe("RequestService - updateRefundRequestStatus function", () => {
  test("should update refund request status", async () => {
    // Arrange
    const mockUpdatedRequest = { RequestNumber: "123", Status: "Approved" };
    refundRequestDao.updateRefundRequestStatus.mockResolvedValue(
      mockUpdatedRequest
    );

    // Act
    const result = await updateRefundRequestStatus(
      "valid-account-id",
      "123",
      "Approved"
    );

    // Assert
    expect(refundRequestDao.updateRefundRequestStatus).toHaveBeenCalledWith(
      "valid-account-id",
      "123",
      "Approved"
    );
    expect(result).toEqual(mockUpdatedRequest);
  });

  test("should throw an error if no pending refund request is found", async () => {
    // Arrange
    refundRequestDao.updateRefundRequestStatus.mockResolvedValue(null);

    // Act & Assert
    await expect(
      updateRefundRequestStatus("valid-account-id", "123", "Approved")
    ).rejects.toThrow("Internal Server Error");
  });

  test('should throw "Internal Server Error" if DAO throws an error', async () => {
    // Arrange
    refundRequestDao.updateRefundRequestStatus.mockRejectedValue(
      new Error("DB Error")
    );

    // Act & Assert
    await expect(
      updateRefundRequestStatus("valid-account-id", "123", "Approved")
    ).rejects.toThrow("Internal Server Error");
  });
});
