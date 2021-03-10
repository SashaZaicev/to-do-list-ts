import {useState} from "react";
import {FilterValueType, TodoListType} from "../App";
import {act} from "react-dom/test-utils";
import {v1} from "uuid";

// type ActionType = {
//     type: string
//     [key: string]: any
// }
// export enum ACTIONS_TYPE {
const REMOVE_TODOLIST = 'REMOVE-TODOLIST';
const CHANGE_TODOLIST_FILTER = 'CHANGE-TODOLIST-FILTER';
const ADD_TODOLIST = 'ADD-TODOLIST';
const CHANGE_TODOLIST_TITLE = 'CHANGE-TODOLIST-TITLE';
// }

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    title: string
    todolistId: string
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValueType
}
type ActionsType =
    RemoveTodolistActionType |
    AddTodolistActionType |
    ChangeTodolistTitleActionType |
    ChangeTodolistFilterActionType

export const todolistsReducer = (state: Array<TodoListType>, action: ActionsType): Array<TodoListType> => {
    switch (action.type) {
        case REMOVE_TODOLIST: {
            return state.filter(tl => tl.id != action.id)
        }
        case ADD_TODOLIST: {
            return [{
                id: action.todolistId,
                title: action.title,
                filter: "all"
            },...state]
        }
        case CHANGE_TODOLIST_TITLE: {
            let todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.title = action.title;
            }
            return [...state]
        }
        case CHANGE_TODOLIST_FILTER: {
            const todolist = state.find((tl => tl.id === action.id))
            if (todolist) {
                todolist.filter = action.filter
            }
            return [...state];
        }
        default:
            throw new Error("I don't understand this type")
    }
}
export const changeTodolistFilterAC = (id: string, filter: FilterValueType): ChangeTodolistFilterActionType => {

    return {type: CHANGE_TODOLIST_FILTER, filter, id}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {

    return {type: CHANGE_TODOLIST_TITLE, id, title}
}
export const addTodolistAC = (title: string): AddTodolistActionType => {

    return {type: ADD_TODOLIST, title, todolistId: v1()}
}
export const removeTodolistAC = (id: string): RemoveTodolistActionType => {

    return {type: REMOVE_TODOLIST, id}
}