import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import { AuthenticationError } from "@/domain/errors/authentication";
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
      CreateFacebookAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const data = await this.facebookApi.loadUser(params);
    if (data !== undefined) {
      await this.userAccountRepo.load({ email: data.email });
      await this.userAccountRepo.createFromFacebook(data);
    }
    return new AuthenticationError();
  }
}
