import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';
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
  postUser() {
    return this.userRepository.save({
      email: '1234@naver.com',
    });
  }
  @Get('users')
  getUsers() {
    return this.userRepository.find({
      // 어떤 프로퍼티를 선택할지
      // 기본값은 모든 프로퍼티를 가져옴 => select를 정의하지 않았을 때
      select: {
        id: true,
        version: true,
        profile: {
          id: true,
        },
      },
      // 필터링할 조건을 입력하게 된다.
      // where 조건은 & 조건으로 묶인다.
      // 조건을 or로 설정하고 싶으면 []로 묶는다.
      where: [
        {
          id: 3,
        },
        {
          version: 1,
        },
      ],
      // 관계를 가져오는 방법
      // relations를 추가한느 순간 where 및 select에서도 사용 가능하다.
      relations: {
        profile: true,
      },
      // 오름차순, 내림차순 정렬
      // ASC
      // DESC
      order: {
        id: 'ASC',
      },
      // 처음 몇 개를 제외할지 => R의 tail과 동일
      skip: 0,
      // 몇 개를 가져올지 => R의 head와 동일
      take: 10,
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
