import axios from "axios";
import { getApiData } from "@/services/api.service";

jest.mock("axios");

describe("api.service", () => {
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(jest.fn());
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should successfully get data from the API", async () => {
    const mockData = { data: "sample data" };

    axios.get.mockResolvedValueOnce(mockData);

    const apiUrl = "https://sampleapi.com/data";
    const result = await getApiData(apiUrl);

    expect(result).toEqual(mockData.data);
    expect(axios.get).toHaveBeenCalledWith(apiUrl);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it("should return undefined when API URL is not provided", async () => {
    const result = await getApiData("");

    expect(result).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith("API URL is required");
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("should handle axios errors with response gracefully", async () => {
    const mockError = {
      response: {
        status: 404,
        data: { message: "Not found" },
      },
      isAxiosError: true,
    };
    axios.isAxiosError = jest.fn(() => true);
    axios.get.mockRejectedValueOnce(mockError);

    const apiUrl = "https://sampleapi.com/data";
    const result = await getApiData(apiUrl);

    expect(result).toBeUndefined();
    expect(axios.get).toHaveBeenCalledWith(apiUrl);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("should handle axios errors without response gracefully", async () => {
    const mockError = {
      request: {},
      isAxiosError: true,
    };
    axios.isAxiosError = jest.fn(() => true);
    axios.get.mockRejectedValueOnce(mockError);

    const apiUrl = "https://sampleapi.com/data";
    const result = await getApiData(apiUrl);

    expect(result).toBeUndefined();
    expect(axios.get).toHaveBeenCalledWith(apiUrl);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("should handle non-axios errors gracefully", async () => {
    const mockError = new Error("Unexpected error");
    axios.isAxiosError = jest.fn(() => false);
    axios.get.mockRejectedValueOnce(mockError);

    const apiUrl = "https://sampleapi.com/data";
    const result = await getApiData(apiUrl);

    expect(result).toBeUndefined();
    expect(axios.get).toHaveBeenCalledWith(apiUrl);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
