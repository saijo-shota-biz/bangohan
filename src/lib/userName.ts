import Cookies from 'js-cookie';

const USER_NAME_KEY = 'bangohan_user_name';

export class UserNameManager {
  static getUserName(): string | null {
    return Cookies.get(USER_NAME_KEY) || null;
  }

  static setUserName(name: string): void {
    // 30日間Cookieに保存
    Cookies.set(USER_NAME_KEY, name, { expires: 30 });
  }

  static clearUserName(): void {
    Cookies.remove(USER_NAME_KEY);
  }

  static hasUserName(): boolean {
    return !!this.getUserName();
  }
}