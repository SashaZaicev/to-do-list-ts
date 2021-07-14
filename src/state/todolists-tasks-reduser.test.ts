import {TasksStateType, TodoListType} from "../AppWithRedux";
import {addTodolistAC, removeTodolistAC, setTodolistsAC, todolistsReducer} from "./todolists-reduser";
import {tasksReducer} from "./tasks-reduser";
import {v1} from "uuid";

let todolistId1: string;
let todolistId2: string;

// type StartTaskState = {
//     id: string
//     title: string
//     order: number
//     addedDate: string
// }
// let startState: StartTaskState[]
beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
//     startState = [
//         {id: todolistId1, title: "What to learn", order: 0, addedDate: ''},
//         {id: todolistId2, title: "New Todolist", order: 0, addedDate: ''}]
})

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodoListType> = [];

    const action = addTodolistAC("new todolist");

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolistId);
    expect(idFromTodolists).toBe(action.todolistId);
});
test('property with todolistId should be deleted', () => {
    const startTasksState: TasksStateType = {};
    const action = removeTodolistAC(todolistId2);

    const endState = tasksReducer(startTasksState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState[todolistId2]).not.toBeDefined();
});
test('empty array should be added when we set todolists', () => {
    const action = setTodolistsAC([
        {id: todolistId1, title: "What to learn",order:0, addedDate: ''},
        {id: todolistId2, title: "New Todolist",order:0, addedDate: ''}]
])

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState['1']).toStrictEqual([]);
    expect(endState['2']).toStrictEqual([]);
})
