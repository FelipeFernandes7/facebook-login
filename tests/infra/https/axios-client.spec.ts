import { HttpGetClient } from "@/infra/https";
import axios from "axios";

jest.mock("axios");

class AxiosHttpClient {
  async get(args: HttpGetClient.Params): Promise<any> {
    const result = await axios.get(args.url, { params: args.params });

    return result.data;
  }
}

describe("AxiosHttpClient", () => {
  let sut: AxiosHttpClient;
  let url: string;
  let params: object;
  let fakeAxios: jest.Mocked<typeof axios>;

  beforeAll(() => {
    url = "any_url";
    params = { any: "any" };
    fakeAxios = axios as jest.Mocked<typeof axios>;
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: "any_data",
    });
  });

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  describe("get", () => {
    it("should call get with corrects params", async () => {
      await sut.get({ url, params });

      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params });
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });

    it("should return data on success", async () => {
      const result = await sut.get({ url, params });

      expect(result).toEqual("any_data");
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });

    it("should rethrow if get throws", async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error("http_error"));
      const promise = sut.get({ url, params });

      await expect(promise).rejects.toThrow(new Error("http_error"));
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});
