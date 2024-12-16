import { Devvit, useState, Context } from '@devvit/public-api';
import {AnswerPostData} from "../../types.js";
import {blockColor} from "../../colors.js";


export const ZoomedPage = (
    {context,data, letters, onReturn, zone, onZoomPress, locked}:
        {
            context:Context,
            data: AnswerPostData,
            letters:(string|null)[][] ,
            onReturn:()=>void,
            zone: number
            onZoomPress: (raw_x:number, raw_y:number, left:boolean, zone: number)=>void,
            locked: (number|null)[][]
        }
)=> {

    const [left, setLeft] = useState<boolean>(true)
    return <vstack alignment='center top' height='100%'>
        <spacer size={"xsmall"}/>
        <TopBar onPress={onReturn}/>
        <spacer size={"xsmall"}/>
        <vstack height='242px' width="242px" backgroundColor="red" alignment='center middle'>
            {
                letters.map((row, y) => <ZoomedRow row={row} y={y} locked={locked[zone][y]} onPress={(x:number, y:number)=>{
                    onZoomPress(x,y,left, zone)
                }}/>)
            }
        </vstack>
        <spacer/>
        <LeftRightButton left={left} setLeft={setLeft}/>
    </vstack>
}



const ZoomedRow = ({row, y, onPress, locked}:{row: (string|null)[], y:number, onPress:(x:number, y:number)=>void, locked:number|null})=>{
    return <hstack width="242px" height="22px">
        {
            row.map((letter,x)=>{
                return <vstack width="22px" height="22px" backgroundColor={letter==null?"white":blockColor} borderColor="white">
                    (letter!=null) &&{
                    <ZoomedBlock text={letter!} onPress={onPress} x={x} y={y} locked={locked==x}/>
                }
                </vstack>
            })
        }
    </hstack>
}

const ZoomedBlock = ({text, onPress,x,y, locked}:{text: string, onPress:(x:number, y:number)=>void,x:number, y:number, locked:boolean})=>{
    return <vstack onPress={()=>{
        onPress(x,y)
    } } backgroundColor={locked?"black":blockColor}>
        <text color="white" alignment="center middle">{text}</text>
    </vstack>
}

const TopBar = ({onPress}: {onPress: ()=>void})=> {
    return <hstack width="242px" alignment="start middle">
        <button icon="back" size="small" appearance="primary" onPress={onPress}/>
        <spacer width="8px"/>
        <vstack width="14px" height="14px" backgroundColor="black"/>
        <spacer width="4px"/>
        <text color="black">locked</text>
        <spacer width="14px"/>
        <vstack width="14px" height="14px" backgroundColor={blockColor}/>
        <spacer width="4px"/>
        <text color="black">movable</text>


    </hstack>
}

const LeftRightButton = ({left, setLeft}: { left: boolean, setLeft: (value: boolean) => void }) => {
    return <hstack width="40px" alignment="center middle">
        <icon name="left-fill" size={left ? "small" : "xsmall"} color={left ? blockColor : "grey"} onPress={() => {
            setLeft(true)
        }}/>
        <icon name="right-fill" size={!left ? "small" : "xsmall"} color={!left ? blockColor : "grey"} onPress={() => {
            console.log(2)
            setLeft(false)
        }}/>
    </hstack>
}