import { Post } from "src/app/post/entities/post.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { UserRoles } from "../enum/user-roles";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column({select: false})
  password: string;

  @Column()
  profilePic: string;

  @Column({type: 'enum', enum: UserRoles, default: UserRoles.Admin})
  roles: UserRoles;

  @OneToMany(() => Post, (post) => post.user)
  post: Post[]

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10)
  }
}
