import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

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

  // 제목
  @Column()
  title: string;

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
}
