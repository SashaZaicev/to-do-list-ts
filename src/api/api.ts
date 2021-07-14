import axios from "axios";


const instance = axios.create({
    withCredentials: true,
    headers: {
        "API-KEY": "39f6779d-eaae-4bd7-8915-a34646e60614"
    },
    baseURL: 'https://social-network.samuraijs.com/api/1.1/'
})

export type TodoListType = {
    id: string
    title: string
    addedDate: string
    order: number
}

type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    data: D
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}


type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}

export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export const todolistsAPI = {
    getTodoLists() {
        return instance.get<Array<TodoListType>>('todo-lists')
            .then((res) => {
                return (res)
            })
    },
    createTodoList(title: string) {
        return instance.post<ResponseType<{item: TodoListType}>>('todo-lists', {title: title})
            // .then((res) => {
            //     return (res.data)
            // })
    },
    deleteTodoList(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`)
            .then((res) => {
                return (res.data)
            })
    },
    updateTodoList(id: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${id}`, {title: title})
            .then((res) => {
                return (res.data)
            })
    }
}
export const tasksAPI = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
            // .then((res) => {
            //     return (res.data)
            // })
    },
    createTask(taskTitle: string, todolistId: string) {
        return instance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title: taskTitle})
            // .then((res) => {
            //     return (res.data)
            // })
    },
    deleteTask(taskId: string, todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
            // .then((res) => {
            //     return (res)
            // })
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
       //patch будет работать когда сделают на сервере
       //  instance.patch<UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, {model: model})
      return  instance.put<UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, {model: model})
            // .then((res) => {
            //     return (res.data)
            // })
    }
}