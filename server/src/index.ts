import express from "express";
import type { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app: Express = express();
const PORT = 8080;
// JSONを扱う為のミドルウェアを設定
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.get("/allTodos", async (req: Request, res: Response) => {
    try {
        const todos = await prisma.todo.findMany();
        return res.json(todos);
    } catch (e) {
        console.log(res);
        return res.status(400).json(e);
    }
});

app.post("/createTodo", async (req: Request, res: Response) => {
    try {
        const { title, isCompleted } = req.body; //リクエストボディの中から値を取り出す
        const createTodo = await prisma.todo.create({
            data: {
                title,
                isCompleted,
            },
        });

        return res.json(createTodo);
    } catch (e) {
        return res.status(400).json(e);
    }
});

app.put("/editTodo/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id); //パラメーターから渡されたidはStringの為、Numberにキャストする
        const { title, isCompleted } = req.body;
        const editTodo = await prisma.todo.update({
            where: { id },
            data: {
                title,
                isCompleted,
            },
        });

        return res.json(editTodo);
    } catch (e) {
        return res.status(400).json(e);
    }
});

app.delete("/deleteTodo/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id); //パラメーターから渡されたidはStringの為、Numberにキャストする
        const deleteTodo = await prisma.todo.delete({
            where: { id },
        });

        return res.json(deleteTodo);
    } catch (e) {
        return res.status(400).json(e);
    }
});

app.listen(PORT, () => console.log("server is running"));
