
const corsOption = {
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        process.env.CLIENT_URL,
    ],
    methods:["GET",
              "POST",
              "PUT",
              "PATCH",
              "DELETE",
              "OPTIONS"],
    credentials: true,
}

export{corsOption}