import { User } from "../../auth/entities/user.entity";
import { Category } from "../../category/entities/category.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import slugify from "slugify";
import { Exclude } from "class-transformer";

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  slug: string;

  @Column()
  @Exclude()
  userId: number;

  @Column({default: 3})
  @Exclude()
  categoryId: number;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updateAt: Date;

  @Column()
  mainImageUrl: string;

  @ManyToOne(() => User, (user) => user.post, {
    eager: true
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id'
  })
  user: User;

  @ManyToOne(() => Category, (category) => category.post, {
    eager: true
  })
  @JoinColumn({
    name: 'categoryId',
    referencedColumnName: 'id'
  })
  category: Category;

  @BeforeInsert()
  slugifyPost() {
    this.slug = slugify(this.title.substring(0, 20), {
      lower: true,
      replacement: '_'
    });
  }

  constructor(post?: Partial<Post>) {
    this.id = post?.id;
    this.title = post?.title;
    this.content = post?.content;
    this.slug = post?.slug;
    this.createdAt = post?.createdAt;
    this.updateAt = post?.updateAt;
    this.mainImageUrl = post?.mainImageUrl;
  }
}
