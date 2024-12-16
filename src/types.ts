export type PostId = `t1_${string}`;

export enum PostType {
    QUESTION = 'question',
    ANSWER ='answer'
}

export type QuestionPostData = {
    postId: string;
    postType: string;
};

export type AnswerPostData ={
    postId: string;
    postType: string;
    data : (null|string)[][][]
    locked: (number|null)[][]
    answer: string
}