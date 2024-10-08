import { FacebookAccount } from "@/domain/models";

describe("FacebookAccount", () => {
  const data = {
    name: "any_facebook_name",
    email: "any_facebook_email",
    facebookId: "any_facebook_id",
  };
  it("should create with facebook data only", () => {
    const sut = new FacebookAccount(data);
    expect(sut).toEqual({
      name: "any_facebook_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });
  });

  it("should update name if its empty", () => {
    const accountData = { id: "any_id" };
    const sut = new FacebookAccount(data, accountData);
    expect(sut).toEqual({
      id: "any_id",
      name: "any_facebook_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });
  });

  it("should not update name if its not empty", () => {
    const accountData = { id: "any_id", name: "any_name" };
    const sut = new FacebookAccount(data, accountData);

    expect(sut).toEqual({
      id: "any_id",
      name: "any_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });
  });
});
