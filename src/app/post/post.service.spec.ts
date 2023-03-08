import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

const postList = [
  new Post({id: 1, title: 'Ola, Mundo', content: 'Este e um hellow word', slug: 'ola_mundo', mainImageUrl: 'https://google.com.br'}),
  new Post({id: 2, title: 'Ola, Mundo2', content: 'Este e um hellow word2', slug: 'ola_mundo_2', mainImageUrl: 'https://google.com.br'}),
]

describe('PostService', () => {
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {provide: getRepositoryToken(Post),
          useValue: {
            create: jest.fn(),
            getMany: jest.fn().mockResolvedValue(postList),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            findOneByOrFail:jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          }}
        ],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a post list entity successfuly', async () => {
      //Act
      const response = await postService.findAll();
      //Assert
      expect(response).toEqual(postList);
    });
  }); 
});
