import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import { AuthenticationError } from "@/domain/errors/authentication";
import {
  UpdateFacebookAccountRepository,
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
      CreateFacebookAccountRepository &
      UpdateFacebookAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const data = await this.facebookApi.loadUser(params);
    if (data !== undefined) {
      const accountData = await this.userAccountRepo.load({
        email: data.email,
      });
      if (accountData !== undefined) {
        await this.userAccountRepo.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? data.name,
          facebookId: data.facebookId,
        });
      } else {
        await this.userAccountRepo.createFromFacebook(data);
      }
    }
    return new AuthenticationError();
  }
}
