import React, {useCallback, useEffect} from 'react';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Task} from "./Task";
import {FilterValueType, TodolistDomainType} from "./state/todolists-reduser";
import {fetchTasksTC} from "./state/tasks-reduser";
import {useDispatch} from "react-redux";
import {TaskStatuses, TaskType} from "./api/api";

type TodoListPropsType = {
    // id: string
    title: string
    tasks: Array<TaskType>
    // changeFilter: (value: FilterValueType, todolistId: string,) => void
    changeFilter: (id: string, filter: FilterValueType) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (idTask: string, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    // filter: FilterValueType
    todolistId: string
    todolist: TodolistDomainType
}

export const TodoList = React.memo(function (props: TodoListPropsType) {
    const dispatch = useDispatch()
    useEffect(() => {
        const todoId = props.todolistId
        dispatch(fetchTasksTC(todoId))
    }, []);
    console.log('todolist call')

    //было
    // const addTask = (title: string) => {
    //     props.addTask(title, props.id)
    // }
    //Стало
    const addTask = useCallback((title: string) => {
        props.addTask(title, props.todolistId)
    }, [props.addTask, props.todolistId]);

    const removeTodolist = useCallback(() => {
        props.removeTodolist(props.todolistId)
    }, []);

    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolistId, title)
    }, [props.todolistId, props.changeTodolistTitle]);

    const onAllClickHandler = useCallback(() =>  {props.changeFilter(props.todolistId, "all")}, [props.todolistId, props.changeFilter])
    const onActiveClickHandler = useCallback(() => {props.changeFilter(props.todolistId, "active")}, [props.todolistId, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => {props.changeFilter(props.todolistId, "completed",)}, [props.changeFilter, props.todolistId])

    let tasksForTodolist = props.tasks;

    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    console.log(tasksForTodolist)
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
                {tasksForTodolist.map(t => <Task
                        task={t}
                        changeTaskStatus={props.changeTaskStatus}
                        changeTaskTitle={props.changeTaskTitle}
                        removeTask={props.removeTask}
                        todolistId={props.todolistId}
                        key={t.id}
                    />
                )}
            </div>
            <div>
                <Button variant={props.todolist.filter === "all" ? "outlined" : "text"}
                        onClick={onAllClickHandler}
                        color='default'
                >All
                </Button>
                <Button variant={props.todolist.filter === "active" ? "outlined" : "text"}
                        onClick={onActiveClickHandler}
                        color='primary'
                >Active
                </Button>
                <Button variant={props.todolist.filter === "completed" ? "outlined" : "text"}
                        onClick={onCompletedClickHandler}
                        color='secondary'
                >Completed
                </Button>
            </div>
        </div>
    )
})

