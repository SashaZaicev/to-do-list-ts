import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from "./todolists-reduser";
import {tasksAPI, TaskType, TaskStatuses, TaskPriorities, UpdateTaskModelType} from "../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";


// const REMOVE_TASK = 'REMOVE-TASK';
// const CHANGE_TASK_STATUS = 'CHANGE-TASK-STATUS';
// const ADD_TASK = 'ADD-TASK';
// const CHANGE_TASK_TITLE = 'CHANGE-TASK-TITLE';

// export type RemoveTaskACType = {
//     type: 'REMOVE-TASK'
//     taskId: string
//     todolistId: string
// }
// export type AddTaskACType = {
//     type: 'ADD-TASK'
//     task: TaskType
//     todolistId: string
//     title: string
// }
// export type ChangeTaskStatusACType = {
//     type: 'CHANGE-TASK-STATUS'
//     taskId: string,
//     status: number,
//     todolistId: string
// }
// export type ChangeTaskTitleACType = {
//     type: 'CHANGE-TASK-TITLE'
//     id: string,
//     title: string,
//     todolistId: string
// }
// export type SetTasksActionType = {
//     type: 'SET-TASKS'
//     tasks: Array<TaskType>
//     todoId: string
// }

// type ActionsType =
// | ReturnType<typeof removeTaskAC>
// | ReturnType<typeof addTaskAC>
// | ReturnType<typeof updateTaskAC>
// | AddTodolistActionType
// | RemoveTodolistActionType
// | SetTodolistsActionType
// | ReturnType<typeof setTasksAC>

type ActionsType =
// RemoveTaskACType
    ReturnType<typeof actionTaskC.removeTaskAC>
    | ReturnType<typeof actionTaskC.addTaskAC>
    | ReturnType<typeof actionTaskC.updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof actionTaskC.setTasksAC>

// | SetAllTasksActionType
// | RemoveTasksActionType
// | AddTasksActionType
export type TasksStateType = { [key: string]: Array<TaskType> }
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            const stateCopy = {...state};
            const tasks = state[action.todolistId]
            const filteredTasks = tasks.filter(t => t.id !== action.taskId)
            stateCopy[action.todolistId] = filteredTasks
            return stateCopy
        }
        case "ADD-TASK": {
            const stateCopy = {...state};
            const newTask = action.task
            const tasks = stateCopy[newTask.todoListId]

            const newTasks = [newTask, ...tasks]
            stateCopy[newTask.todoListId] = newTasks
            return stateCopy
        }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        // case "CHANGE-TASK-STATUS": {
        //     let todolistTasks = state[action.todolistId];
        //     state[action.todolistId] = todolistTasks
        //         .map(t => t.id === action.taskId
        //             ? {...t, status: 0}
        //             : t);
        //     return ({...state});
        // }
        // case "CHANGE-TASK-TITLE": {
        //     let todolistTitle = state[action.todolistId];
        //     state[action.todolistId] = todolistTitle
        //         .map(t => t.id === action.id
        //             ? {...t, title: action.title}
        //             : t);
        //     return ({...state});
        // }
        case 'ADD-TODOLIST': {
            const stateCopy = {...state};
            stateCopy[action.todolist.id] = []
            return stateCopy
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state};
            delete stateCopy[action.id]
            return stateCopy
        }
        case 'SET-TODOLISTS': {
            const stateCopy = {...state};
            action.todolists.forEach((tl: any) => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case "SET-TASKS": {
            const stateCopy = {...state}
            stateCopy[action.todoId] = action.tasks
            return stateCopy
        }
        default:
            return {...state}
    }
}

export const actionTaskC = {
    removeTaskAC: (taskId: string, todolistId: string) => {
        return {type: 'REMOVE-TASK', taskId, todolistId} as const
    },
    addTaskAC: (task: TaskType) => {
        return {type: 'ADD-TASK', task} as const
    },
    updateTaskAC: (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => {
        return {type: 'UPDATE-TASK', model, todolistId, taskId} as const
    },
    setTasksAC: (tasks: Array<TaskType>, todoId: string) => {
        return {type: 'SET-TASKS', tasks, todoId} as const
    }
    // changeTaskStatusAC: (taskId: string, status: number, todolistId: string) => {
    //     return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
    // },
    // changeTaskTitleAC: (id: string, title: string, todolistId: string) => {
    //     return {type: 'CHANGE-TASK-TITLE', id, title, todolistId}
    // },

}

export const fetchTasksTC = (todoId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        tasksAPI.getTasks(todoId)
            .then((res) => {
                const tasks = res.data.items
                dispatch(actionTaskC.setTasksAC(tasks, todoId))
            })
    }
}

export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    tasksAPI.deleteTask(taskId, todolistId)
        .then(res => {
            const action = actionTaskC.removeTaskAC(taskId, todolistId)
            dispatch(action)
        })
}

export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    tasksAPI.createTask(title, todolistId )
        .then(res => {
            const task = res.data.data.item
            const action = actionTaskC.addTaskAC(task)
            dispatch(action)
        })
}
//
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        tasksAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                const action = actionTaskC.updateTaskAC(taskId, domainModel, todolistId)
                dispatch(action)
            })
    }

