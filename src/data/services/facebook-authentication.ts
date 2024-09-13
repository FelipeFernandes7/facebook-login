import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import { AuthenticationError } from "@/domain/errors/authentication";
import { FacebookAuthentication } from "@/domain/features";

export class FacebookAuthenticationService {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUser(params);
    return new AuthenticationError();
  }
}
