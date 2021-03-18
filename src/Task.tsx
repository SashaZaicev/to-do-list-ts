import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskType} from "./TodoList";

type TaskPropsType = {
    removeTask: (idTask: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    task: TaskType
    todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {
    let onClickHandler = () => {
        props.removeTask(props.task.id, props.todolistId)
    }
    let onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.changeTaskStatus(props.task.id, newIsDoneValue, props.todolistId)
    }
    let onChangeTitleHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.task.id, newValue, props.todolistId)
    }, [props.task.id, props.changeTaskTitle, props.todolistId])
    return <div key={props.task.id} className={props.task.isDone ? "is-done" : ""}>
        <Checkbox color='primary' checked={props.task.isDone} onChange={onChangeStatusHandler}/>
        <EditableSpan value={props.task.title} onChange={onChangeTitleHandler}/>
        <IconButton onClick={onClickHandler}><Delete style={{
            "width": "20px",
            "height": "20px"
        }}/>
        </IconButton>
    </div>
})