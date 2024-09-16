import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import { AuthenticationError } from "@/domain/errors/authentication";
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
      SaveFacebookAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const data = await this.facebookApi.loadUser(params);
    if (data !== undefined) {
      const accountData = await this.userAccountRepo.load({
        email: data.email,
      });

      await this.userAccountRepo.saveWithFacebook({
        id: accountData?.id,
        name: accountData?.name ?? data.name,
        email: data.email,
        facebookId: data.facebookId,
      });
    }
    return new AuthenticationError();
  }
}
