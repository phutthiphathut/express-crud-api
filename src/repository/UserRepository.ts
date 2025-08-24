import { Repository, Not } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: "DESC",
      },
    });

    const totalPages = Math.ceil(total / limit);

    return { data, total, page, totalPages };
  }

  async findOne(id: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const updateResult = await this.repository.update(id, userData);

    if (updateResult.affected === 0) {
      return null;
    }

    return await this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.repository.delete(id);
    return (
      deleteResult.affected !== undefined &&
      deleteResult.affected !== null &&
      deleteResult.affected > 0
    );
  }
}

export const userRepository = new UserRepository();
