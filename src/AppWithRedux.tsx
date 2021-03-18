import React, {useCallback, useReducer, useState} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {v1} from 'uuid';
import {AddItemForm} from "./AddItemForm";
import {Toolbar, IconButton, AppBar, Typography, Button, Container, Grid, Paper} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reduser";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reduser";
import {act} from "react-dom/test-utils";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";


export type FilterValueType = "all" | "completed" | "active"
export type TodoListType = {
    id: string,
    title: string,
    filter: FilterValueType
}
export type TasksStateType = { [key: string]: Array<TaskType> }

function AppWithRedux() {
    const todolists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()

    const addTask = useCallback(function (title: string, todolistId: string) {
        const action = addTaskAC(title, todolistId)
        dispatch(action)
    }, [dispatch]);

    const addTodolist = useCallback((title: string) => {
        const action = addTodolistAC(title)
        dispatch(action)
    }, [dispatch]);

    const removeTask = useCallback(function (id: string, todolistId: string) {
        const action = removeTaskAC(id, todolistId)
        dispatch(action)
    }, [dispatch]);

    const removeTodolist = useCallback(function (id: string) {
        const action = removeTodolistAC(id)
        dispatch(action)
    }, [dispatch]);

    const changeTodolistTitle = useCallback(function (id: string, newTitle: string) {
        const action = changeTodolistTitleAC(id, newTitle)
        dispatch(action)
    }, [dispatch]);

    const changeFilter = useCallback(function (id: string, value: FilterValueType) {
        const action = changeTodolistFilterAC(id, value)
        dispatch(action)
    }, [dispatch]);

    const changeStatus = useCallback(function (taskId: string, isDone: boolean, todolistId: string) {
        const action = changeTaskStatusAC(taskId, isDone, todolistId)
        dispatch(action)
    }, [dispatch]);

    const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
        const action = changeTaskTitleAC(taskId, newTitle, todolistId)
        dispatch(action)
    }, [dispatch]);

    return (
        <div className="App">
            <AppBar position='static'>
                <Toolbar>
                    <IconButton edge='start' color='inherit' arial-label='menu'>
                        <Menu/>
                    </IconButton>
                    <Typography variant='h6'>
                        News
                    </Typography>
                    <Button color='inherit'>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];
                        let tasksForTodolist = allTodolistTasks;

                        return <Grid item key={tl.id + tl.title}>
                            <Paper style={{padding: '10px'}}>
                                <TodoList
                                    key={tl.id}
                                    id={tl.id}
                                    title={tl.title}
                                    tasks={tasksForTodolist}
                                    removeTask={removeTask}
                                    removeTodolist={removeTodolist}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                    filter={tl.filter}
                                />
                            </Paper>
                        </Grid>
                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;

