import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    const post = new Post();
    post.userId = user.id;
    Object.assign(post, createPostDto)

    this.postRepository.create();
    return await this.postRepository.save(post);
  }

  async findAll(query?: string) {
    const myQuery = await this.postRepository.createQueryBuilder('post')
    .leftJoinAndSelect('post.category', 'category')
    .leftJoinAndSelect('post.user', 'user');
    
    if(!(Object.keys(query).length === 0) && query.constructor === Object) {
      const queryKeys = Object.keys(query);

      if(queryKeys.includes('title')) {
        myQuery.where('post.title LIKE :title', {title: `%${query['title']}%` })
      }

      if(queryKeys.includes('sort')) {
        myQuery.orderBy('post.title', query['sort'].toUpperCase())
      }

      if(queryKeys.includes('category')) {
        myQuery.andWhere('category.title = :cat', {cat: query['category']});
      }

      return myQuery.getMany();

    } else {
      return await myQuery.getMany();
    }
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({where: {id}});

    if(!post) {
      throw new BadRequestException('POST NOT FOUND')
    }
    return post;
  }

  async findBySlug(slug: string) {
    try {
      return await this.postRepository.findOneByOrFail({slug});
    } catch (error) {
      throw new BadRequestException(`post with slug ${slug} not found`);
    }
  }

  async update(slug: string, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({where: {slug}});

    if(!post) {
      throw new BadRequestException('post not found');
    }

    post.updateAt = new Date(Date.now());
    post.category = updatePostDto.category;
    post.slug = post.title.split(" ").join('_').toLowerCase();

    Object.assign(post, updatePostDto)
    return this.postRepository.save(post);
  }

  async remove(id: number) {
    const post = await this.postRepository.findOne({where: {id}});

    if(!post) {
      throw new BadRequestException('post not found');
    }

    await this.postRepository.remove(post);
    return {success: true, post};
  }
  
}
