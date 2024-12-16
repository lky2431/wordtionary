import { Devvit, useState, Context, useForm } from '@devvit/public-api';
import {words} from "../../words/words.js";
import {Service} from "../../Service.js";
import {PostId} from "../../types.js";


export const QuestionPost = ({context, service}:{context:Context, service: Service})=>{
    const [letterss, setLetterss] = useState(
        ()=>Array.from({ length: 22 }, () =>Array.from({ length: 22 }, () => false)))

    const onPress=(x:number, y:number)=>{
        letterss[y][x] = !letterss[y][x]
        setLetterss(letterss)
    }

    function getWord(length: number|null){
        if(length == null){
            return null
        }
        const texts:string[]  = words[length]
        const randomIndex = Math.floor(Math.random() * texts.length);
        return texts[randomIndex]
    }

    const submitForm = useForm(
        {
            fields: [
                {
                    type: 'string',
                    name: 'answer',
                    label: 'Answer',
                    helpText:'Input your answer'
                },
            ],
        },
        async (values) => {
            if(values.answer){
                if(values.answer==""){
                    return
                }
                const post = await context.reddit.submitPost({
                title:'Guess what is this?',
                subredditName:"wordtionary",
                    preview: (
                        <vstack height="100%" width="100%" alignment="middle center">
                            <text size="large">Loading ...</text>
                        </vstack>
                    )
                })

                const submitData = onSubmit()

                await service.SubmitQuestion({
                    postId:context.postId as PostId,
                    data: submitData[0] as (string|null)[][][],
                    locked:submitData[1] as (number|null)[][],
                    answer: values.answer
                })
                context.ui.navigateTo(post);
            }
        }
    );

    function shuffle<T>(array: T[]): T[] {
        const shuffledArray = [...array]; // Create a copy of the original array
        let numberOfNull = array.filter((a)=>a==null).length
        let changeSeed = 0.9
        if(numberOfNull>1){
            changeSeed = 0.95
        }
        if(numberOfNull >2){
            changeSeed = 1
        }

        for (let i = shuffledArray.length - 1; i > 0; i--) {
            let seed = Math.random()
            if(shuffledArray[i]==null || seed>changeSeed){
                const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
            }
        }
        return shuffledArray; // Return the shuffled array
    }

    function createCharacterArray(input: (string|null)[]): any {
        let result:(string|null)[] = []
        for (let i of input){
            if(i==null){
                result.push(i)
            }else{
                result=[...result,...i.split('')]
            }
        }

        const shuffled = shuffle(result)
        let locked=[]
        for (let i=0; i<shuffled.length;i++){
            if(shuffled[i] == result[i] &&result[i] != null){
                locked.push(i)
            }
        }
        let lockedIndex = locked[Math.floor(Math.random()*locked.length)]
        return [shuffled,lockedIndex];
    }

    const onSubmit =()=>{
        let allBlocks:(number|null)[][][]=[]
        for (let x=0;x<2;x++){
            for (let y=0; y<2; y++){
                let block = []
                for (let i=0+x*11;i<11+x*11;i++){
                    let eachRow=[]
                    var count = 0
                    for (let j=0+y*11; j<11+y*11;j++){
                        if(letterss[i][j]){
                            if(count>0){
                                eachRow.push(count)
                                eachRow.push(null)
                            }else{
                                eachRow.push(null)
                            }
                            count = 0
                        }else{
                            count = count+1
                        }
                    }
                    if(count>0){
                        eachRow.push(count)
                    }
                    block.push(eachRow)
                }
                allBlocks.push(block)
            }
        }


        let textBlock:(string|null)[][][]= []
        let lockedBlock: (number|null)[][] = []
        for (let block of allBlocks){
            let rowArray : (string | null)[][]=[]
            let rowLockArray: (number|null)[] = []
            for (let rows of block){
                let created = createCharacterArray(rows.map((row)=>getWord(row)))
                rowArray.push(created[0])
                rowLockArray.push(created[1])
            }
            textBlock.push(rowArray)
            lockedBlock.push(rowLockArray)
        }
        return [textBlock,lockedBlock]

    }


    return <vstack alignment='center middle' height='100%'>
        <vstack height='242px' width="242px" backgroundColor="red" alignment='center middle'>
            {
                letterss.map((letters,y)=><Row blocks={letters} y={y} onPress={(x:number)=>{
                    onPress(x,y)
                }}/>)
            }
        </vstack>
        <spacer/>
        <vstack>
            <button onPress={()=>{
                context.ui.showForm(submitForm)
                //onSubmit()

            }}>Submit</button>
        </vstack>
    </vstack>
}

const Row =({blocks,y, onPress}:{blocks:boolean[],y:number, onPress: (x:number)=>void})=>{
    return <hstack width="100%" height="11px" alignment="center">
        {
            blocks.map((block,x)=><Block selected={block} x={x} y={y} onPress={()=>onPress(x)}/>)
        }
    </hstack>
}

const Block = ({selected,x,y, onPress}:{selected:boolean,x:number, y:number, onPress: ()=>void}) =>{
    let color: string = "#000000"
    if(x%2==y%2){
        color = "#333333"
    }
    if(selected){
        color = "white"
    }
    return <vstack width="11px" height="11px" backgroundColor={color} alignment='center middle' onPress={onPress}>
    </vstack>
}