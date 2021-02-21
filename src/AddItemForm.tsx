import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button, TextField, IconButton} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (title: string) => void
};

export function AddItemForm(props: AddItemFormPropsType) {
    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)
    let changeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    let onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (event.charCode === 13) {
            addTask()
        }
    }
    let addTask = () => {
        if (title.trim() !== "") {
            props.addItem(title.trim())
            setTitle('')
        } else {
            setError("Title is required")
        }
    }

    return <div>
        <TextField value={title}
                   onChange={changeInputHandler}
                   onKeyPress={onKeyPress}
                   variant='outlined'
                   error={!!error}
                   label="Title"
                   helperText={error}
        />
        {/*<Button variant='contained' color='primary' onClick={addTask}>+*/}
        {/*</Button>*/}
        <IconButton color='primary' onClick={addTask}><AddBox/></IconButton>
        {/*{error && <div className="error-message">{error}</div>}*/}
    </div>
}