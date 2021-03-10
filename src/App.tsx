import React, {useState} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {v1} from 'uuid';
import {AddItemForm} from "./AddItemForm";
import {Toolbar, IconButton, AppBar, Typography, Button, Container, Grid, Paper} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {changeTodolistFilterAC, removeTodolistAC} from "./state/todolists-reduser";


export type FilterValueType = "all" | "completed" | "active"
export type TodoListType = {
    id: string,
    title: string,
    filter: FilterValueType
}
export type TasksStateType = { [key: string]: Array<TaskType> }

function App() {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let [todolists, setTodolists] = useState<Array<TodoListType>>([
        {
            id: todolistId1,
            title: "What to learn?",
            filter: 'all'
        },
        {
            id: todolistId2,
            title: "What to buy?",
            filter: 'all'
        }
    ])
    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistId1]: [
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "CSS", isDone: false},
            {id: v1(), title: "React", isDone: false},
            {id: v1(), title: "Angular", isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: "Bread", isDone: true},
            {id: v1(), title: "Milk", isDone: false},
        ]
    })

    function addTask(title: string, todolistId: string) {
        let newTask = {
            id: v1(),
            title: title,
            isDone: false
        };
        let todolistTasks = tasks[todolistId]
        tasks[todolistId] = [newTask, ...todolistTasks]
        setTasks({...tasks})
    }

    function addTodolist(title: string) {
        let newTodolistId = v1();
        let newTodolist: TodoListType = {
            id: newTodolistId,
            title: title,
            filter: "all"
        };
        setTodolists([newTodolist, ...todolists])
        setTasks({
            ...tasks,
            [newTodolistId]: []
        })
    }

    function removeTask(id: string, todolistId: string) {
        let todolistTasks = tasks[todolistId];
        tasks[todolistId] = todolistTasks.filter(t => t.id != id)
        setTasks({...tasks})
    }

    function removeTodolist(id: string) {
        // removeTodolistAC(id)
        setTodolists(todolists.filter(tl => tl.id != id))
        delete tasks[id];
        setTasks({...tasks})
    }

    function changeTodolistTitle(id: string, newTitle: string) {
        let todolist = todolists.find(tl => tl.id === id);
        if (todolist) {
            todolist.title = newTitle;
            setTodolists([...todolists]);
        }
    }

    function changeFilter(value: FilterValueType, id: string) {
        // changeTodolistFilterAC(value,id)
        let todolist = todolists.find(tl => tl.id === id);
        if (todolist) {
            todolist.filter = value
        }
        setTodolists([...todolists])
    }

    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        let todolistTasks = tasks[todolistId]
        let task = todolistTasks.find(t => t.id === taskId);
        if (task) {
            task.isDone = isDone
            setTasks({...tasks})
        }
    }

    function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
        let todolistTasks = tasks[todolistId]
        let task = todolistTasks.find(t => t.id === taskId);
        if (task) {
            task.title = newTitle
            setTasks({...tasks})
        }
    }

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
                        if (tl.filter === 'completed') {
                            tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true)
                        }
                        if (tl.filter === 'active') {
                            tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false)
                        }
                        return <Grid item>
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

export default App;

