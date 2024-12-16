import {Devvit, useState, Context, useForm} from '@devvit/public-api';
import {AnswerPostData, PostId} from "../../types.js";
import {blockColor} from "../../colors.js";


export const FullPage = (
    {context,data, letters, onSelect}:
        {
            context:Context,
            data: AnswerPostData,
            letters:(string|null)[][][] ,
            onSelect:(index:0|1|2|3)=>void

        }
)=> {

    const [correct, setCorrect] = useState<boolean>(false)

    const submitForm = useForm(
        {
            fields: [
                {
                    type: 'string',
                    name: 'answer',
                    label: 'Answer',
                    helpText:'Input your guess'
                },
            ],
        },
        async (values) => {
            if(values.answer){
                if(values.answer==""){
                    return
                }
                if(values.answer == data.answer){
                    context.ui.showToast("Correct")
                    setCorrect(true)
                }else{
                    context.ui.showToast("Please Try Again")
                }
            }
        }
    );


    return <vstack>
        <vstack height="242px" width="242px">
            <hstack height="121px" width="242px">
                <BlockView block={letters[0]} onSelect={() => {
                    onSelect(0)
                }}/>
                <BlockView block={letters[1]} onSelect={() => {
                    onSelect(1)
                }}/>
            </hstack>
            <hstack height="121px" width="242px">
                <BlockView block={letters[2]} onSelect={() => {
                    onSelect(2)
                }}/>
                <BlockView block={letters[3]} onSelect={() => {
                    onSelect(3)
                }}/>
            </hstack>
        </vstack>
        <spacer size="small"/>
        {correct?<text alignment={'center middle'} color="black">
        {data.answer}
    </text>:
        <button onPress={() => {
            context.ui.showForm(submitForm)
        }}>Guess</button>}
    </vstack>
}

const BlockView = ({block, onSelect}: { block: (string | null)[][], onSelect: () => void }) => {
    return <vstack height="121px" width="121px" onPress={onSelect}>
        {
            block.map((row) => {
                return <hstack height='11px' width='121px'>
                    {
                        row.map((letter) => {
                            return <BlockRow letter={letter}/>
                        })
                    }
                </hstack>
            })
        }
    </vstack>
}

const BlockRow = ({letter}: { letter: string | null }) => {
    return <vstack height="11px" width="11px" backgroundColor={letter==null?"white":blockColor}>
    </vstack>
}