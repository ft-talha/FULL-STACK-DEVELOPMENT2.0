export interface UserRecord {
    id: number;
    name: string;
    email: string;
    password: string;
}
export interface SafeUser {
    id: number;
    name: string;
    email: string;
}
export declare class AuthService {
    private users;
    private nextId;
    private activeUser;
    login(email: string, password: string): {
        success: boolean;
        message: string;
        user: SafeUser;
    };
    register(name: string, email: string, password: string): {
        success: boolean;
        message: string;
        user: SafeUser;
    };
    getActiveUser(): SafeUser | null;
    logout(): {
        success: boolean;
        message: string;
    };
    getAllUsers(): SafeUser[];
}
