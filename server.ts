import { json } from 'body-parser'
import express from 'express'
import { Request } from 'express'
const app = express()
const port = 3000
app.use(json())

app.post('/', async (req: Request, res: any) => {
  console.log("Received request")
  console.log(req.body)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
