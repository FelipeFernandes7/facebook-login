import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import { AuthenticationError } from "@/domain/errors/authentication";
import { LoadUserAccountRepository } from "@/data/contracts/repos";

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const data = await this.loadFacebookUserApi.loadUser(params);
    if (data?.email !== undefined) {
      await this.loadUserAccountRepo.load({ email: data.email });
    }
    return new AuthenticationError();
  }
}
