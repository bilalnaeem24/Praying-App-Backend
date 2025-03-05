import User from "./user.model";
import { IUser } from "./user.types";

class UserService {
  public async createUser(userData: IUser): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (err) {
      throw new Error("Error while creating user");
    }
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (err) {
      throw new Error(
        `Error while fetching user by email: ${(err as Error).message}`,
      );
    }
  }

  public async getUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: IUser[]; total: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;

      const total = await User.countDocuments();

      const pages = Math.ceil(total / limit);

      const users = await User.find().skip(skip).limit(limit);

      return { users, total, pages };
    } catch (err) {
      throw new Error("Error while fetching users");
    }
  }

  public async getUserById(id: string): Promise<any> {
    try {
      const user = await User.findOne({ _id: id });
      return user;
    } catch (err) {
      throw new Error("Error while fetching users by id");
    }
  }
}

export default new UserService();
