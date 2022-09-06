import { Component, OnInit } from '@angular/core';
import { ErrorInfo, remult } from 'remult';
import { Task } from '../../shared/Task';
import { TasksController } from '../../shared/TasksController';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  taskRepo = remult.repo(Task);
  tasks: (Task & { error?: ErrorInfo<Task> })[] = [];

  ngOnInit() {
    this.fetchTasks();
  }
  hideCompleted = false;
  async fetchTasks() {
    this.tasks = await this.taskRepo.find({
      limit: 20,
      orderBy: { completed: "asc" },
      where: { completed: this.hideCompleted ? false : undefined }
    });
  }
  async saveTask(task: typeof this.tasks[0]) {
    try {
      const savedTask = await this.taskRepo.save(task);
      this.tasks = this.tasks.map(t => t === task ? savedTask : t);
    } catch (error: any) {
      alert(error.message);
      task.error = error;
    }
  }
  async setAll(completed: boolean) {
    await TasksController.setAll(completed);
    this.fetchTasks();
  }

  async deleteTask(task: Task) {
    await this.taskRepo.delete(task);
    this.tasks = this.tasks.filter(t => t !== task);
  }


  addTask() {
    this.tasks.push(new Task());
  }

}
