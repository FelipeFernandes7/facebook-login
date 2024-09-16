import { AuthenticationError } from "@/domain/errors/authentication";
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";

import { mock, MockProxy } from "jest-mock-extended";
import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services";
import { TokenGenerator } from "@/data/contracts/crypto";
import { AccessToken } from "@/domain/models";

jest.mock("@/domain/models/facebook-account");

describe("FacebookAuthenticationService", () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let crypto: MockProxy<TokenGenerator>;
  let userAccountRepo: MockProxy<
    LoadUserAccountRepository & SaveFacebookAccountRepository
  >;
  let sut: FacebookAuthenticationService;
  let token: string;

  beforeAll(() => {
    token = "any_token";
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: "any_facebook_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });
    crypto = mock();
    crypto.generateToken.mockResolvedValue("any_generated_token");
  });

  beforeEach(() => {
    userAccountRepo = mock();
    userAccountRepo.load.mockResolvedValue(undefined);
    userAccountRepo.saveWithFacebook.mockResolvedValueOnce({
      id: "any_account_id",
    });

    sut = new FacebookAuthenticationService(
      crypto,
      facebookApi,
      userAccountRepo
    );
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.execute({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should return Authentication Error when LoadFacebookUserApi return undefined", async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.execute({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it("should call LoadUserAccountRepo when LoadFacebookUserApi returns data", async () => {
    facebookApi.loadUser.mockResolvedValueOnce({
      name: "any_facebook_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });

    await sut.execute({ token });
    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: "any_facebook_email",
    });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it("should call SaveFacebookAccountRepository with FacebookAccount", async () => {
    await sut.execute({ token });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({});
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it("should call TokenGenerator with correct params", async () => {
    await sut.execute({ token });
    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: "any_account_id",
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it("should return an AccessToken on success", async () => {
    const result = await sut.execute({ token });

    expect(result).toEqual(new AccessToken("any_generated_token"));
  });

  it("should rethrow if loadFacebookUserApi throws", async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error("facebook_error"));
    const promise = sut.execute({ token });

    await expect(promise).rejects.toThrow(new Error("facebook_error"));
  });

  it("should rethrow if LoadUserAccountRepository throws", async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error("load_error"));
    const promise = sut.execute({ token });

    await expect(promise).rejects.toThrow(new Error("load_error"));
  });

  it("should rethrow if TokenGenerator throws", async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error("crypto_error"));
    const promise = sut.execute({ token });

    await expect(promise).rejects.toThrow(new Error("crypto_error"));
  });
});
