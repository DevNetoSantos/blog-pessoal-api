import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control';
import { AuthModule } from './app/auth/auth.module';
import { roles } from './app/auth/enum/user-roles';
import { CategoryModule } from './app/category/category.module';
import { PostModule } from './app/post/post.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
      host: 'localhost',
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: true,
  }),
  PostModule,
  CategoryModule,
  AuthModule,
  AccessControlModule.forRoles(roles)
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
