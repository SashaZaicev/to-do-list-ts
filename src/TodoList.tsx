import React, {useCallback} from 'react';
import {FilterValueType} from "./AppWithRedux";
import {Button, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Task} from "./Task";

type TodoListPropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    changeFilter: (todolistId: string, value: FilterValueType,) => void
    addTask: (title: string, todolistId: string) => void
    removeTask: (idTask: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    filter: FilterValueType
}
export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export const TodoList = React.memo(function (props: TodoListPropsType) {
    console.log("TodoList is called")
    let onAllClickHandler = useCallback(() => {
        props.changeFilter(props.id, "all")
    }, [props.changeFilter, props.id])
    let onActiveClickHandler = useCallback(() => {
        props.changeFilter(props.id, "active")
    }, [props.changeFilter, props.id])
    let onCompletedClickHandler = useCallback(() => {
        props.changeFilter(props.id, "completed")
    }, [props.changeFilter, props.id])
    let removeTodolist = () => {
        props.removeTodolist(props.id)
    };
    let changeTodolistTitle = (newTitle: string) => {
        props.changeTodolistTitle(props.id, newTitle)
    };
    //было
    // const addTask = (title: string) => {
    //     props.addTask(title, props.id)
    // }
    //Стало
    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id]);

    let tasksForTodolist = props.tasks;

    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.isDone === true)
    }
    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.isDone === false)
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
                {props.tasks.map(t => <Task
                        task={t}
                        changeTaskStatus={props.changeTaskStatus}
                        changeTaskTitle={props.changeTaskTitle}
                        removeTask={props.removeTask}
                        todolistId={props.id}
                        key={t.id}
                    />
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
})

