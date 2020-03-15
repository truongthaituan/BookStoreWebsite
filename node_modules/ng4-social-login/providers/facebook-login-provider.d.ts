import { BaseLoginProvider } from '../entities/base-login-provider';
import { SocialUser, LoginProviderClass } from '../entities/user';
export declare class FacebookLoginProvider extends BaseLoginProvider {
    private clientId;
    isInitialize: boolean;
    static readonly PROVIDER_ID: string;
    loginProviderObj: LoginProviderClass;
    constructor(clientId: string);
    initialize(): Promise<SocialUser>;
    static drawUser(response: any): SocialUser;
    signIn(): Promise<SocialUser>;
    signOut(): Promise<any>;
}
