import React, {ChangeEvent} from 'react';
import {FilterValueType} from "./App";
import {IconButton, Button, Checkbox} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {removeTodolistAC} from "./state/todolists-reduser";

type TodoListPropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (idTask: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    changeFilter: (value: FilterValueType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    filter: FilterValueType
}
export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export function TodoList(props: TodoListPropsType) {
    let onAllClickHandler = () => {
        props.changeFilter("all", props.id)
    };
    let onActiveClickHandler = () => {
        props.changeFilter("active", props.id)
    };
    let onCompletedClickHandler = () => {
        props.changeFilter("completed", props.id)
    };
    let removeTodolist = () => {
        props.removeTodolist(props.id)
    };
    let changeTodolistTitle = (newTitle: string) => {
        props.changeTodolistTitle(props.id, newTitle)
    };
    const addTask = (title: string) => {
        props.addTask(title, props.id)
    }
    return (
        <div>
            <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>

                <IconButton style={{
                    "padding": "0"
                }} onClick={removeTodolist}>
                    <Delete style={{
                        "width": "20px",
                        "height": "20px"
                    }}/></IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <div>
                {props.tasks.map(t => {
                        let onClickHandler = () => {
                            props.removeTask(t.id, props.id)
                        }
                        let onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                            let newIsDoneValue = e.currentTarget.checked;
                            props.changeTaskStatus(t.id, newIsDoneValue, props.id)
                        }
                        let onChangeTitleHandler = (newValue: string) => {
                            props.changeTaskTitle(t.id, newValue, props.id)
                        }
                        return <div key={t.id} className={t.isDone ? "is-done" : ""}>
                            <Checkbox color='primary' checked={t.isDone} onChange={onChangeStatusHandler}/>
                            <EditableSpan value={t.title} onChange={onChangeTitleHandler}/>
                            <IconButton onClick={onClickHandler}><Delete style={{
                                "width": "20px",
                                "height": "20px"
                            }}/>
                            </IconButton>
                        </div>
                    }
                )}
            </div>
            <div>
                <Button variant={props.filter === "all" ? "outlined" : "text"}
                        onClick={onAllClickHandler}
                        color='default'
                >All
                </Button>
                <Button variant={props.filter === "active" ? "outlined" : "text"}
                        onClick={onActiveClickHandler}
                        color='primary'
                >Active
                </Button>
                <Button variant={props.filter === "completed" ? "outlined" : "text"}
                        onClick={onCompletedClickHandler}
                        color='secondary'
                >Completed
                </Button>
            </div>
        </div>
    )
}

