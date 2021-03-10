import {FilterValueType, TasksStateType, TodoListType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reduser";


const REMOVE_TASK = 'REMOVE-TASK';
const CHANGE_TASK_STATUS = 'CHANGE-TASK-STATUS';
const ADD_TASK = 'ADD-TASK';
const CHANGE_TASK_TITLE = 'CHANGE-TASK-TITLE';

export type removeTaskACType = {
    type: 'REMOVE-TASK'
    taskId: string
    todolistId: string
}
export type addTaskACType = {
    type: 'ADD-TASK'
    title: string
    todolistId: string
}
export type changeTaskStatusACType = {
    type: 'CHANGE-TASK-STATUS'
    taskId: string,
    isDone: boolean,
    todolistId: string
}
export type changeTaskTitleACType = {
    type: 'CHANGE-TASK-TITLE'
    id: string,
    title: string,
    todolistId: string
}

type ActionsType =
    removeTaskACType |
    addTaskACType |
    changeTaskStatusACType |
    changeTaskTitleACType |
    AddTodolistActionType |
    RemoveTodolistActionType

export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case REMOVE_TASK: {
            const stateCopy = {...state};
            const tasks = state[action.todolistId]
            const filteredTasks = tasks.filter(t => t.id !== action.taskId)
            stateCopy[action.todolistId] = filteredTasks
            return stateCopy
        }
        case ADD_TASK: {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todolistId]
            const newTask = {id: v1(), title: action.title, isDone: false}
            //create new task
            const newTasks = [newTask, ...tasks]
            stateCopy[action.todolistId] = newTasks
            return stateCopy
        }
        case CHANGE_TASK_STATUS: {
            const stateCopy = {...state};

            let tasks = stateCopy[action.todolistId];
            // найдём нужную таску:
            let task = tasks.find(t => t.id === action.taskId);
            //изменим таску, если она нашлась
            if (task) {
                task.isDone = action.isDone;
            }
            return stateCopy;
        }
        case CHANGE_TASK_TITLE: {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todolistId]
            // найдём нужную таску:
            let task = tasks.find(t => t.id === action.id);
            //изменим таску, если она нашлась
            if (task) {
                task.title = action.title
            }
            return stateCopy
        }
        case 'ADD-TODOLIST': {
            const stateCopy = {...state};
            stateCopy[action.todolistId] = []
            return stateCopy
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state};
            delete stateCopy[action.id]
            return stateCopy
        }
        default:
            throw new Error("I don't understand this type")
    }
}
export const removeTaskAC = (taskId: string, todolistId: string): removeTaskACType => {
    return {type: 'REMOVE-TASK', taskId, todolistId}
}
export const addTaskAC = (title: string, todolistId: string): addTaskACType => {
    return {type: 'ADD-TASK', title, todolistId}
}
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string): changeTaskStatusACType => {
    return {type: 'CHANGE-TASK-STATUS', isDone, todolistId, taskId}
}
export const changeTaskTitleAC = (id: string, title: string, todolistId: string): changeTaskTitleACType => {
    return {type: 'CHANGE-TASK-TITLE', id, title, todolistId}
}
