import { SameSite } from '../enums/same-site.enum';

export class CookieConfig {
  public secure: boolean | undefined;
  public sameSite: SameSite | undefined;
  public httpOnly: boolean | undefined;
}
