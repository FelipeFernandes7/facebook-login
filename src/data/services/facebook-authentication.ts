import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";
import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import { AuthenticationError } from "@/domain/errors/authentication";
import { FacebookAccount } from "@/domain/models";
import { TokenGenerator } from "../contracts/crypto";

export class FacebookAuthenticationService {
  constructor(
    private readonly crypto: TokenGenerator,
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

      const facebookAccount = new FacebookAccount(data, accountData);
      const { id } = await this.userAccountRepo.saveWithFacebook(
        facebookAccount
      );
      await this.crypto.generateToken({ key: id });
    }
    return new AuthenticationError();
  }
}
