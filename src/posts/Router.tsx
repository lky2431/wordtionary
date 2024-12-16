import {Context, Devvit, useState} from '@devvit/public-api';
import {Service} from "../Service.js";
import {AnswerPostData, PostId, PostType, QuestionPostData} from "../types.js";
import {AnswerPost} from "./AnswerPost/AnswerPost.js";
import {QuestionPost} from "./QuestionPost/QuestionPost.js";
import {background} from "../colors.js";

export const Router: Devvit.CustomPostComponent = (context: Context) => {
    const postId:PostId = context.postId as PostId;
    const service = new Service(context);

    const getUsername = async () => {
        if (!context.userId) return null; // Return early if no userId
        const cacheKey = 'cache:userId-username';
        const cache = await context.redis.hGet(cacheKey, context.userId);
        if (cache) {
            return cache;
        } else {
            const user = await context.reddit.getUserById(context.userId);
            if (user) {
                await context.redis.hSet(cacheKey, {
                    [context.userId]: user.username,
                });
                return user.username;
            }
        }
        return null;
    };

    function getPostData(
        postType: PostType,
        postId: PostId
    ): Promise<QuestionPostData|AnswerPostData> {
        switch (postType) {
            case PostType.QUESTION:
                return service.getQuestionPost(postId)
            case PostType.ANSWER:
                return service.getAnswerPost(postId)

        }
    }

    const [data] = useState<{

        postData: QuestionPostData|AnswerPostData;
        postType: PostType;
        username: string | null;
    }>(async () => {
        // First batch
        const [postType, username] = await Promise.all([service.getPostType(postId), getUsername()]);
        // Second batch
        const [postData] = await Promise.all([
            getPostData(postType, postId),
        ]);
        return {
            postData,
            postType,
            username,
        };
    });

    const postTypes: Record<PostType, JSX.Element> = {
        answer: (
            <AnswerPost context={context} data={data.postData as AnswerPostData}/>
        ),
        question: (
            <QuestionPost context={context} service={service}/>
        ),
    };

    return (
        <zstack width="100%" height="100%" alignment="center middle" backgroundColor={background}>
            {postTypes[data.postType] || (
                <vstack alignment="center middle" grow>
                    <text>Error: Unknown post type</text>
                </vstack>
            )}
        </zstack>
    );
};
