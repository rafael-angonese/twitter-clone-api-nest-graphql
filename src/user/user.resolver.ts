import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    const user = await this.userService.createUser(data);

    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async user(@Args('id') id: string): Promise<User> {
    const user = await this.userService.getUserById(id);

    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async userByEmail(@Args('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UpdateUserInput,
  ): Promise<User> {
    const user = this.userService.updateUser({ id, ...data });

    return user;
  }
  
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<true> {
    await this.userService.deleteUser(id);
    return true;
  }
}
