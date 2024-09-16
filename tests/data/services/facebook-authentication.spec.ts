import { LoadFacebookUserApi } from "@/data/contracts/apis";
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors/authentication";
import { mock, MockProxy } from "jest-mock-extended";

describe("FacebookAuthenticationService", () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepo: MockProxy<
    LoadUserAccountRepository & CreateFacebookAccountRepository
  >;
  let sut: FacebookAuthenticationService;
  const token = "any_token";

  beforeEach(() => {
    facebookApi = mock();
    userAccountRepo = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: "any_facebook_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo);
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should return Authentication Error when LoadFacebookUserApi return undefined", async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it("should call LoadUserAccountRepo when LoadFacebookUserApi returns data", async () => {
    facebookApi.loadUser.mockResolvedValueOnce({
      name: "any_facebook_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });

    await sut.perform({ token });
    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: "any_facebook_email",
    });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it("should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined", async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token });
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: "any_facebook_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1);
  });
});
