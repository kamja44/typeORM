import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import {
  Between,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}
  @Post('users')
  async postUser() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@google.com`,
      });
    }
  }
  @Get('users')
  getUsers() {
    return this.userRepository.find({
      where: {
        // 아닌 경우 가져오기
        // id: Not(1),
        // 적은 경우 가져오기
        // id: LessThan(30),
        // 적은 경우 or 같은 경우
        // id: LessThanOrEqual(30),
        // 더 큰거 가져오기
        // id: MoreThan(30),
        // id: MoreThanOrEqual(30),
        // id: Equal(30),
        // 유사값
        // Like 조건
        // Like 연산의 문제점 => 대소문자 구분 못함
        // email: Like('%google%'),
        // 대문자 소문자 구분 안하는 유사값
        // email: ILike('%GOOGLE%'),
        // 사이 값
        // id: Between(10, 15),
        // 해당되는 여러개의 값
        // id: In([1, 5, 10, 35]),
        // id가 Null인 경우
        // id: IsNull(),
      },
      // 어떤 프로퍼티를 선택할지
      // 기본값은 모든 프로퍼티를 가져옴 => select를 정의하지 않았을 때
      // select: {
      //   id: true,
      //   version: true,
      //   profile: {
      //     id: true,
      //   },
      // },
      // 필터링할 조건을 입력하게 된다.
      // where 조건은 & 조건으로 묶인다.
      // 조건을 or로 설정하고 싶으면 []로 묶는다.
    });
  }
  @Patch('users/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    return this.userRepository.save({
      ...user,
      email: user.email + '0',
    });
  }

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Post('user/profile')
  async CreateUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'kamja@kamja.co',
      profile: {
        profileImg: 'asdf.jpg',
      },
    });

    // const profile = await this.profileRepository.save({
    //   profileImg: 'test.jpg',
    //   user,
    // });

    return user;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'postuser@kamja.co',
    });

    await this.postRepository.save({ author: user, title: 'post 1' });
    await this.postRepository.save({ author: user, title: 'post 2' });

    return user;
  }

  @Post('posts/Tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'NestJS LEcture',
    });
    const post2 = await this.postRepository.save({
      title: 'Programming Lecture',
    });

    const tag1 = await this.tagRepository.save({
      name: 'Javascript',
      posts: [post1, post2],
    });
    const tag2 = await this.tagRepository.save({
      name: 'typescript',
      posts: [post1],
    });

    const post3 = await this.postRepository.save({
      title: 'NextJS Lecture',
      tags: [tag1, tag2],
    });
    return true;
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
}
