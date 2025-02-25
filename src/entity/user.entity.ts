import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { PostModel } from './post.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserModel {
  // ID
  // 자동으로 ID를 생성한다.
  // @PrimaryGeneratedColumn()

  // Primary Column은 모든 테이블에서 기본적으로 존재해야 한다.
  // 테이블 안에서 각각의 Row를 구분 할 수 있는 컬럼이다.
  // @PrimaryColumn()

  // @PrimaryGeneratedColumn('uuid')
  // PrimaryGenetratedColumn => 순서대로 위로 올라간다.
  // 1, 2, 3, ... => 99999
  // UUID => 절대로 중복되지 않는 랜덤한 문자열이 생성된다.
  // 2919a858-ccdb-4569-9c9e-c40b803041f0
  //   @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  // 제목
  // @Column({
  //   // 데이터베이스에서 인지하는 칼럼 타입
  //   // 자동으로 유추됨 => 특정한 타입을 원할 경우 직접 입력
  //   type: 'varchar',
  //   // 데이터베이스 칼럼 이름
  //   // 프로퍼티 이름으로 부터 자동 유추됨
  //   name: 'title',
  //   // 값의 길이
  //   // 입력 할 수 있는 글자의 길이가 300
  //   length: 300,
  //   // null 허용 여부
  //   nullable: true,
  //   // true면 처음 저장할 때만 값 저장 가능
  //   // 이후에는 값 변경 불가능
  //   update: true,
  //   // find()를 실행할 때 기본으로 값을 불러올지 여부
  //   // 기본값이 true
  //   select: false,
  //   // 아무것도 입력하지 않았을 때 기본으로 입력되게 하는 값
  //   default: 'default value',
  //   // 칼럼중 유일무이한 값이 되어야 하는지 여부
  //   // 기본값은 false
  //   unique: false,
  // })
  // title: string;

  @Column({
    type: 'enum',
    enum: Role, // Role이라는 enum을 사용한다.
    default: Role.USER,
  })
  role: Role;

  // 데이터 생성 일자
  // 데이터가 생성되는 날짜와 시간이 자동으로 찍힌다.
  @CreateDateColumn()
  createdAt: Date;

  // 데이터 업데이트 일자
  // 데이터가 업데이트되는 날짜와 시간이 자동으로 찍힌다.
  @UpdateDateColumn()
  updatedAt: Date;

  // 데이터가 업데이트 될때마다 1씩 올라간다.
  // 처음 생성되면 값은 1이다.
  // save() 함수가 몇 번 불렸는지 기억한다.
  @VersionColumn()
  version: number;

  @Column()
  //   @Generated('increment')
  // 데이터를 생성할 때 마다 1씩 증가시킴 PrimaryGeneratedColumn과 비슷하지만 Primary Column이 아니다.
  // Generated Annotation은 Column Annotation과 항상 같이 사용해야 한다.
  @Generated('uuid')
  additionalId: string;

  @OneToOne(() => ProfileModel, (profile) => profile.user)
  @JoinColumn()
  profile: ProfileModel;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}
