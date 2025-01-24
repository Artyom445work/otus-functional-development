import { LocalStorageCalendar, FirebaseCalendar, Task } from './index'
import { LocalStorage } from 'node-localstorage'

Object.defineProperty(global, 'localStorage', {
    value: new LocalStorage('./scratch'),
    writable: false, // Можно попробовать true, если потребуется
    configurable: true,
});

describe('LocalStorageCalendar', () => {
    let storage: LocalStorageCalendar
    beforeEach(() => {
        storage = new LocalStorageCalendar()
        localStorage.clear()
    })

    it('should create a task', async () => {
        const task: Task = { id: '1', title: 'Test', date: '2025-01-01', status: 'pending' }
        await storage.createTask(task)
        expect(await storage.readTask('1')).toEqual(task)
    })

    it('should update a task', async () => {
        const task: Task = { id: '1', title: 'Test', date: '2025-01-01', status: 'pending' }
        await storage.createTask(task)
        await storage.updateTask('1', { status: 'completed' })
        expect((await storage.readTask('1'))?.status).toBe('completed')
    })

    it('should delete a task', async () => {
        const task: Task = { id: '1', title: 'Test', date: '2025-01-01', status: 'pending' }
        await storage.createTask(task)
        await storage.deleteTask('1')
        expect(await storage.readTask('1')).toBeNull()
    })
})

describe('FirebaseCalendar', () => {
    let storage: FirebaseCalendar
    beforeEach(() => {
        storage = new FirebaseCalendar()
    })

    it('should create a task', async () => {
        const task: Task = { id: '1', title: 'Test', date: '2025-01-01', status: 'pending' }
        await storage.createTask(task)
        expect(await storage.readTask('1')).toEqual(task)
    })

    it('should update a task', async () => {
        const task: Task = { id: '1', title: 'Test', date: '2025-01-01', status: 'pending' }
        await storage.createTask(task)
        await storage.updateTask('1', { status: 'completed' })
        expect((await storage.readTask('1'))?.status).toBe('completed')
    })

    it('should delete a task', async () => {
        const task: Task = { id: '1', title: 'Test', date: '2025-01-01', status: 'pending' }
        await storage.createTask(task)
        await storage.deleteTask('1')
        expect(await storage.readTask('1')).toBeNull()
    })
})