import { remultExpress } from "remult/remult-express";
import { Task } from "../shared/Task";
import { remult } from "remult";
import { TasksController } from "../shared/TasksController";
import { createPostgresConnection } from "remult/postgres";

export const api = remultExpress({
    dataProvider: process.env["NODE_ENV"] === "production" ?
        createPostgresConnection({
            configuration: "heroku"
        }) : undefined,
    getUser: request => request.session!['user'],
    entities: [Task],
    controllers: [TasksController],
    initApi: async () => {
        const taskRepo = remult.repo(Task);
        if (await taskRepo.count() === 0) {
            await taskRepo.insert([
                { title: "Task a" },
                { title: "Task b", completed: true },
                { title: "Task c" },
                { title: "Task d" },
                { title: "Task e", completed: true }
            ]);
        }
    }
});