type AccountData = {
  id?: string;
  name?: string;
};

type FacebookData = {
  id?: string;
  name: string;
  email: string;
  facebookId: string;
};

export class FacebookAccount {
  id?: string;
  name: string;
  email: string;
  facebookId: string;

  constructor(facebook: FacebookData, account?: AccountData) {
    this.id = account?.id;
    this.name = account?.name ?? facebook.name;
    this.email = facebook.email;
    this.facebookId = facebook.facebookId;
  }
}
