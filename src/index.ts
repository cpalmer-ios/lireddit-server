import 'reflect-metadata';
import { COOKIE_NAME, __prod__ } from "./constants"; 
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
// import redis from 'redis';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Post } from './entities/Post';
import { User } from './entities/User';
import path from 'path';

const main = async () => {
//    const conn = await createConnection({
   await createConnection({
        type: 'postgres',
        database: 'postgres',
        username: 'postgres',
        password: 'root',
        logging: true,
        synchronize: true,
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: [Post, User]
    });

    // await conn.runMigrations()

    // const orm = await MikroORM.init(microConfig);
    // await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session)
    const redis = new Redis();
    
    app.use(
        cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

    app.use(
      session({
        name: COOKIE_NAME,
        store: new RedisStore({ 
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
            httpOnly: true,
            sameSite: 'lax', //csrf
            secure: __prod__,
        },
        saveUninitialized: false,
        secret: 'kjakhe123vjndfvuifd213',
        resave: false,
      })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({req, res}) => ({ req, res, redis })
    });

    apolloServer.applyMiddleware({ 
        app, 
        cors: false,
    });

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
    // const post = orm.em.create(Post, { title: 'my first post'});
    // await orm.em.persistAndFlush(post);

    // const posts =  await orm.em.find(Post, {});
    // console.log(posts);
};

main().catch(err => {
    console.log(err);
});