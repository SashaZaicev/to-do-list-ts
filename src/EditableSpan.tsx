import React, {ChangeEvent, useState} from "react";
import { TextField } from "@material-ui/core";

type EditableSpanPropsType = {
    value: string,
    onChange: (newValue: string) => void
}

export function EditableSpan(props: EditableSpanPropsType) {
    let [editMode, setEditMode] = useState(false)
    let [title, setTitle] = useState('')
    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.value)
    }
    const activateViewMode = () => {
        setEditMode(false)
        props.onChange(title)
    }
    const changeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return (
        editMode ?
            <TextField value={title} autoFocus
                   onBlur={activateViewMode}
                   onChange={changeTitleHandler}/>
            : <span
                onDoubleClick={activateEditMode}
            >
                {props.value}</span>
    )

}