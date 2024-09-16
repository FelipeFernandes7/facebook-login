import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors/authentication";
import { mock, MockProxy } from "jest-mock-extended";

describe("FacebookAuthenticationService", () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let sut: FacebookAuthenticationService;

  beforeEach(() => {
    loadFacebookUserApi = mock();
    sut = new FacebookAuthenticationService(loadFacebookUserApi);
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({
      token: "any_token",
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token: "any_token",
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should return Authentication Error when LoadFacebookUserApi return undefined", async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    const authResult = await sut.perform({
      token: "any_token",
    });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
