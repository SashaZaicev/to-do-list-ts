import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {Toolbar, IconButton, AppBar, Typography, Button, Container, Grid, Paper} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    actionTodoC, addTodolistTC, fetchTodolistsTC, FilterValueType, TodolistDomainType

} from "./state/todolists-reduser";
import {
    actionTaskC, addTaskTC, removeTaskTC, TasksStateType, updateTaskTC
} from "./state/tasks-reduser";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskStatuses} from "./api/api";


// export type TodoListType = {
//     id: string,
//     title: string,
//     filter: FilterValueType
// }


function App() {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, []);

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        dispatch(removeTaskTC(taskId, todolistId))
        // const thunk = actionTaskC.removeTaskAC(taskId, todolistId)
        // dispatch(thunk)
    }, []);
    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskTC(title, todolistId))
        // const action = addTaskAC(title, todolistId)
        // dispatch(action)
    }, []);

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
        // const action = actionTodoC.addTodolistAC(title, todolistId)
        // dispatch(action)
    }, []);


    const removeTodolist = useCallback(function (id: string) {
        const action = actionTodoC.removeTodolistAC(id)
        dispatch(action)
    }, [dispatch]);

    const changeTodolistTitle = useCallback(function (id: string, newTitle: string) {
        const action = actionTodoC.changeTodolistTitleAC(id, newTitle)
        dispatch(action)
    }, [dispatch]);

    const changeFilter = useCallback(function (id: string, filter: FilterValueType) {
        const action = actionTodoC.changeTodolistFilterAC(id, filter)
        dispatch(action)
    }, []);

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskTC(taskId, {status}, todolistId))
        // dispatch(updateTaskStatusTC(taskId, status, todolistId))
        // }, []);
    }, []);

    const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
        updateTaskTC(taskId, {title: newTitle}, todolistId)
        // const action = actionTaskC.changeTaskTitleAC(taskId, newTitle, todolistId)
        // dispatch(action)
    }, []);

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
                        const allTodolistTasks = tasks[tl.id];
                        const tasksForTodolist = allTodolistTasks;

                        return <Grid item key={tl.id + tl.title}>
                            <Paper style={{padding: '10px'}}>
                                <TodoList
                                    todolist={tl}
                                    key={tl.id}
                                    todolistId={tl.id}
                                    title={tl.title}
                                    tasks={tasksForTodolist}
                                    removeTask={removeTask}
                                    removeTodolist={removeTodolist}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default App;

