import { Devvit, useState, Context } from '@devvit/public-api';
import {AnswerPostData} from "../../types.js";
import {FullPage} from "./FullPage.js";
import {ZoomedPage} from "./ZoomedZone.js";


export const AnswerPost = ({context,data}:{context:Context,data: AnswerPostData})=>{

    const [letters, setLetters] = useState<(string|null)[][][]>(()=>{
        return data.data
    })

    const locked = data.locked

    const [zone, setZone] = useState<0|1|2|3|null>(null)




    const onZoomedPress = (x:number, y:number, left:boolean, zone: number)=>{
        let isLocked = locked[zone][y] == x
        if(isLocked){
            return
        }

        if(left && x>0){
            if(locked[zone][y] != x-1){
                let currentText:string|null = letters[zone][y][x]
                letters[zone][y][x] = letters[zone][y][x-1]
                letters[zone][y][x-1] = currentText
            }else if(locked[zone][y] == x-1 && x>1){
                let currentText:string|null = letters[zone][y][x]
                letters[zone][y][x] = letters[zone][y][x-2]
                letters[zone][y][x-2] = currentText
            }
        }
        if(!left && x<10){
            if(locked[zone][y] != x+1){
                let currentText:string|null = letters[zone][y][x]
                letters[zone][y][x] = letters[zone][y][x+1]
                letters[zone][y][x+1] = currentText
            }else if (locked[zone][y] == x+1 && x<9){
                let currentText:string|null = letters[zone][y][x]
                letters[zone][y][x] = letters[zone][y][x+2]
                letters[zone][y][x+2] = currentText
            }
        }
        setLetters(letters)
    }


    if(zone == null){
        return <FullPage context={context} data={data} letters={letters} onSelect={(index:0|1|2|3)=>{
            setZone(index)
        }}/>
    }
    return <ZoomedPage context={context} data={data} letters={letters[zone]} onReturn={()=>{
        setZone(null)
    }}
                       onZoomPress={onZoomedPress}
                       zone={zone}
                       locked={locked}

    />
}