import {Dispatch} from "redux";
import {todolistsAPI, TodoListType} from "../api/api";

// type ActionType = {
//     type: string
//     [key: string]: any
// }
// export enum ACTIONS_TYPE {
// const REMOVE_TODOLIST = 'REMOVE-TODOLIST';
// const CHANGE_TODOLIST_FILTER = 'CHANGE-TODOLIST-FILTER';
// const ADD_TODOLIST = 'ADD-TODOLIST';
// const CHANGE_TODOLIST_TITLE = 'CHANGE-TODOLIST-TITLE';
// const SET_TODOLISTS = 'SET-TODOLISTS';
// }

// export type RemoveTodolistActionType = {
//     type: 'REMOVE-TODOLIST'
//     id: string
// }
// export type AddTodolistActionType = {
//     type: 'ADD-TODOLIST'
//     title: string
//     todolistId: string
// }
// export type ChangeTodolistTitleActionType = {
//     type: 'CHANGE-TODOLIST-TITLE'
//     id: string
//     title: string
// }
// export type ChangeTodolistFilterActionType = {
//     type: 'CHANGE-TODOLIST-FILTER'
//     id: string
//     order: number
// }
// export type SetTodolistsActionType = {
//     type: 'SET-TODOLISTS'
//     todolists: Array<TodoListType>
// }

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof actionTodoC.changeTodolistTitleAC>
    | ReturnType<typeof actionTodoC.changeTodolistFilterAC>
    | SetTodolistsActionType

export type AddTodolistActionType = ReturnType<typeof actionTodoC.addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof actionTodoC.removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof actionTodoC.setTodolistsAC>;
export type FilterValueType = "all" | "completed" | "active"
export type TodolistDomainType = TodoListType & {
    filter: FilterValueType
}

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state:Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id != action.id)
        }
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all'}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            let todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }
        case 'SET-TODOLISTS': {
            return action.todolists.map((tl: any) => {
                return {
                    ...tl,
                    filter: "all"
                }
            })
        }
        default:
            return [...state]
    }
}

export const actionTodoC = {
    changeTodolistFilterAC: (id: string, filter: FilterValueType) => ({
        type: 'CHANGE-TODOLIST-FILTER', id, filter: filter
    } as const),
    changeTodolistTitleAC: (id: string, title: string) => ({
        type: 'CHANGE-TODOLIST-TITLE', id, title
    } as const),
    addTodolistAC : (todolist: TodoListType) => ({
        type: 'ADD-TODOLIST', todolist} as const),
    removeTodolistAC: (id: string) => ({
        type: 'REMOVE-TODOLIST', id
    } as const),
    setTodolistsAC: (todolists: Array<TodoListType>) => ({
        type: 'SET-TODOLISTS', todolists
    } as const)
}


export const fetchTodolistsTC = () => {
    //1. server request
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.getTodoLists()
            .then((res) => {
                //2. dispatch action (thunk)
                dispatch(actionTodoC.setTodolistsAC(res.data))
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.deleteTodoList(todolistId)
            .then((res) => {
                dispatch(actionTodoC.removeTodolistAC(todolistId))
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.createTodoList(title)
            .then((res) => {
                dispatch(actionTodoC.addTodolistAC(res.data.data.item))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.updateTodoList(id, title)
            .then((res) => {
                dispatch(actionTodoC.changeTodolistTitleAC(id, title))
            })
    }
}