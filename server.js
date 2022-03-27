const express=require('express')
const connectDB=require('./config/db.js')
const bodyparser=require('body-parser')
const path=require('path')
const dotenv=require('dotenv')

dotenv.config()

const usersRouter=require('./routes/api/users')
const profileRouter=require('./routes/api/profile.js')
const authRouter=require('./routes/api/auth.js')
const uploadRoutes=require('./routes/api/upload.js')

const app=express()
connectDB()

app.use(bodyparser.json())      //write these before routers
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.json())

app.use('/api/users',usersRouter)
app.use('/api/auth',authRouter)
app.use('/api/profile',profileRouter)
app.use('/api/upload', uploadRoutes)

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if(process.env.NODE_ENV==='production'){
    app.use(express.static('client/build'))

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

const PORT=process.env.PORT||5000

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})