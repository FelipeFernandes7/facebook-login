import { HttpGetClient } from "./client";
import axios from "axios";

export class AxiosHttpClient {
  async get(args: HttpGetClient.Params): Promise<any> {
    const result = await axios.get(args.url, { params: args.params });

    return result.data;
  }
}
