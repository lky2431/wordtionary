import {
    Devvit,
    type Context,
    type Post,
    type RedditAPIClient,
    type RedisClient,
    type Scheduler,
    type ZRangeOptions,
} from '@devvit/public-api';

import {words} from "./words/words.js";

import {AnswerPostData, PostId, PostType, QuestionPostData} from "./types.js";

export class Service {
    readonly redis: RedisClient;
    readonly reddit?: RedditAPIClient;
    readonly scheduler?: Scheduler;
    readonly context: Context;

    constructor(context: Context) {
        this.redis = context.redis;
        this.reddit = context.reddit;
        this.scheduler = context.scheduler;
        this.context = context;
    }

    readonly tags = {
        scores: 'default',
    };

    async getPostType(postId: PostId) {
        const key = `post:${postId}`;
        const postType = await this.redis.hGet(key, 'postType');
        const defaultPostType = PostType.QUESTION;
        return (postType ?? defaultPostType) as PostType;
    }

    async getQuestionPost(postId: PostId): Promise<QuestionPostData> {
        const key = `post:${postId}`;
        const postType = await this.redis.hGet(key, 'postType');
        return {
            postId,
            postType: postType??PostType.QUESTION,
        };
    }

    async getAnswerPost(postId: PostId): Promise<AnswerPostData> {
        const key = `post:${postId}`;

        const [postType, data, answer,locked] = await Promise.all([
            this.redis.hGet(key, 'postType'),
            this.redis.hGet(key, 'data'),
            this.redis.hGet(key, 'answer'),
            this.redis.hGet(key, 'locked')
        ]);

        return {
            postId,
            postType: postType??PostType.ANSWER,
            data: JSON.parse(data??"[[[]]]"),
            locked: JSON.parse(locked??"[[]]"),
            answer: answer??""
        };
    }

    async SubmitQuestion(data:{postId: PostId,data:(string|null)[][][], answer: string, locked:(number|null)[][]}){
        const key = `post:${data.postId}`;
        await Promise.all([
            this.redis.hSet(key,{
                postId: data.postId,
                date: Date.now().toString(),
                data: JSON.stringify(data.data),
                locked: JSON.stringify(data.locked),
                answer: data.answer,
                postType: PostType.ANSWER
            })
        ])

    }


}
