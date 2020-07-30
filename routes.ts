import { Router } from "https://deno.land/x/oak/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Book } from "./types.ts"

const books: Book[] = [
    {
        id : v4.generate(),
        title : "Book One",
        author : "One"
    },
    {
        id : v4.generate(),
        title : "Book Two",
        author : "Two"
    },
    {
        id : v4.generate(),
        title : "Book Three",
        author : "Three"
    }
]

const router = new Router();
// context 내부에 req, res 둘다 들어있음
// 디스턱쳐링으로 {request, response} 로 꺼낼 수 있음 
router
    .get('/', (context) => {
        context.response.body = "Hello World";
    })
    .get("/books", (context) => {
        context.response.body = books;
    })
    .post("/book", async (context) => {
        // Promiose로 반납됨
        const body = context.request.body();

        if (!context.request.hasBody) {
            context.response.status = 400;
            context.response.body = "데이터가 없습니다.";
        } else {
            const book: Book = await body.value;
            book.id = v4.generate();
            context.response.status = 201
            context.response.body = book;
        }
    })
    .get("/book/:id", async (context) => {
        const book: Book | undefined = books.find((b) => b.id === context.params.id);
        if (book) {
            context.response.status = 200;
            context.response.body = book;    
        } else {
            context.response.status = 404;
            context.response.body = "책을 찾지 못했습니다.";
        }
    });

export default router