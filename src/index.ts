import {app, settings} from "./settings";


app.listen(settings.port,async () => {
    console.log(`Example app listening on port ${settings.port}`)
})


