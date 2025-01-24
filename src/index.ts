interface Boba {
    id: string
}

export interface CalendarStorage {
    createTask(task: Task): Promise<void>
    readTask(id: string): Promise<Task | null>
    updateTask(id: string, updates: Partial<Task>): Promise<void>
    deleteTask(id: string): Promise<void>
    filterTasks(filters: TaskFilters): Promise<Task[]>
}

export interface Task {
    id: string
    title: string
    description?: string
    date: string
    status: 'pending' | 'completed' | 'canceled'
    tags?: string[]
}

export interface TaskFilters {
    text?: string
    date?: string
    status?: 'pending' | 'completed' | 'canceled'
    tags?: string[]
}

// localStorage
export class LocalStorageCalendar implements CalendarStorage {
    private storageKey = 'calendar_tasks'

    private getTasks(): Task[] {
        const data = localStorage.getItem(this.storageKey)
        return data ? JSON.parse(data) : []
    }

    private saveTasks(tasks: Task[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks))
    }

    async createTask(task: Task): Promise<void> {
        const tasks = this.getTasks()
        tasks.push(task)
        this.saveTasks(tasks)
    }

    async readTask(id: string): Promise<Task | null> {
        return this.getTasks().find(task => task.id === id) || null
    }

    async updateTask(id: string, updates: Partial<Task>): Promise<void> {
        let tasks = this.getTasks()
        tasks = tasks.map(task => (task.id === id ? { ...task, ...updates } : task))
        this.saveTasks(tasks)
    }

    async deleteTask(id: string): Promise<void> {
        const tasks = this.getTasks().filter(task => task.id !== id)
        this.saveTasks(tasks)
    }

    async filterTasks(filters: TaskFilters): Promise<Task[]> {
        return this.getTasks().filter(task => {
            return (
                (!filters.text || task.title.includes(filters.text) || (task.description && task.description.includes(filters.text))) &&
                (!filters.date || task.date === filters.date) &&
                (!filters.status || task.status === filters.status) &&
                (!filters.tags || filters.tags.every(tag => task.tags?.includes(tag)))
            )
        })
    }
}

// Firebase
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './configs/firebase.config'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export class FirebaseCalendar implements CalendarStorage {
    private collectionRef = collection(db, 'tasks')

    async createTask(task: Task): Promise<void> {
        await setDoc(doc(this.collectionRef, task.id), task)
    }

    async readTask(id: string): Promise<Task | null> {
        const docSnap = await getDoc(doc(this.collectionRef, id))
        return docSnap.exists() ? (docSnap.data() as Task) : null
    }

    async updateTask(id: string, updates: Partial<Task>): Promise<void> {
        const taskRef = doc(this.collectionRef, id)
        const existing = await this.readTask(id)
        if (existing) {
            await setDoc(taskRef, { ...existing, ...updates }, { merge: true })
        }
    }

    async deleteTask(id: string): Promise<void> {
        await deleteDoc(doc(this.collectionRef, id))
    }

    async filterTasks(filters: TaskFilters): Promise<Task[]> {
        let q = query(this.collectionRef)

        if (filters.status) {
            q = query(q, where('status', '==', filters.status))
        }
        if (filters.date) {
            q = query(q, where('date', '==', filters.date))
        }

        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => doc.data() as Task).filter(task => {
            return (
                (!filters.text || task.title.includes(filters.text) || (task.description && task.description.includes(filters.text))) &&
                (!filters.tags || filters.tags.every(tag => task.tags?.includes(tag)))
            )
        })
    }
}
