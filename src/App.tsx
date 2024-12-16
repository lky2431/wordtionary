import {Devvit, useState} from '@devvit/public-api'


export const App = ()=>{
    const [letterss, setLetterss] = useState([
        ['h','I','a','b'],
        ['b','b','c','c'],
        ['z','w',null,'l'],
        ['u','g','h','i']
    ]);

    const onPressed = (x:number, y:number)=>{
        let letter = letterss[y][x]
        if(letterss[y][x] == null){
            return
        }
        let clone = [[...letterss[0]],[...letterss[1]],[...letterss[2]],[...letterss[3]]]
        if(x!=0){
            if(letterss[y][x-1]==null){
                clone[y][x-1]=letter
                clone[y][x]=null
            }
        }
        if(x!=3){
            if(letterss[y][x+1]==null){
                clone[y][x+1]=letter
                clone[y][x]=null
            }
        }
        if(y!=0){
            if(letterss[y-1][x]==null){
                clone[y-1][x]=letter
                clone[y][x]=null
            }
        }
        if(y!=3){
            if(letterss[y+1][x]==null){
                clone[y+1][x]=letter
                clone[y][x]=null
            }
        }
        setLetterss(clone)

    }



    return <vstack alignment='center middle' height='100%' gap='large'>
        <vstack height='70%' width="70%" backgroundColor="blue">
            {
                letterss.map((letters,y)=><TextBlock letters={letters} y={y} onPress={(x:number)=>{
                    onPressed(x,y)
                }}/>)
            }

        </vstack>
    </vstack>
}


const TextBlock = ({letters,y, onPress}:{letters:(string|null)[],y:number,onPress:(x:number)=>void})=>{
    return <hstack alignment="center middle" height="25%" width="100%">
        {
            letters.map((letter:string|null, x)=>{
                if(letter == null){
                    return <EmptyText/>
                }
                return <EachText letter={letter} y={y} x={x} onPress={()=>{
                    onPress(x)
                }}/>
            })
        }
    </hstack>
}

const EachText =({letter,x,y,onPress}:{letter:string,x:number, y:number, onPress: ()=>void}) =>{
    return <vstack width="25%" height="100%" padding='small' onPress={onPress}>
        <vstack grow backgroundColor="red" alignment="center middle" cornerRadius="small">
            <text >{letter}</text>
        </vstack>
    </vstack>
}

const EmptyText = ()=>{
    return <vstack width="25%" height="100%"></vstack>
}



type FigureArray = [
    [
        [5,4],
        [4,2,3],
        [3,4,2],
        [2,6,1],
        [1,8]

    ]
]



