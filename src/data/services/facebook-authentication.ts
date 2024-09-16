import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";
import { AccessToken, FacebookAccount } from "@/domain/models";
import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import { AuthenticationError } from "@/domain/errors/authentication";
import { TokenGenerator } from "../contracts/crypto";

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor(
    private readonly crypto: TokenGenerator,
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
      SaveFacebookAccountRepository
  ) {}

  async execute(
    params: FacebookAuthentication.Params
  ): Promise<FacebookAuthentication.Result> {
    const data = await this.facebookApi.loadUser(params);
    if (data !== undefined) {
      const accountData = await this.userAccountRepo.load({
        email: data.email,
      });

      const facebookAccount = new FacebookAccount(data, accountData);
      const { id } = await this.userAccountRepo.saveWithFacebook(
        facebookAccount
      );
      const token = await this.crypto.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs,
      });
      return new AccessToken(token);
    }
    return new AuthenticationError();
  }
}
