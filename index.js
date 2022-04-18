
const express = require("express")
const app = express()
let {MongoClient, ClientSession} = require("mongodb")
let url = "mongodb+srv://kiran:esI50iDpvboyEyZh@cluster0.yo2mf.mongodb.net/test?authSource=admin&replicaSet=atlas-21lddk-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
app.use(express.json())
const port = process.env.PORT || 4000


// api to create mentor details
app.post("/mentor",async (req,res)=>{
    let client = await MongoClient.connect(url)
    let db = await client.db("Mentor")
    let table = await db.collection("table")
    let data = await table.insertOne(req.body) 
    res.json({
        data
    })
})


// api to create student details
app.post("/student",async (req,res)=> {
    let client = await MongoClient.connect(url)
    let db = await client.db("student")
    let table = await db.collection("table")
    let data = await table.insertOne(req.body)
    res.json({
        data
    })
})



// api to assign a particular mentor to students
app.get("/assign",async (req,res)=>{
    var mentorList = []
    var studentList = []

    // taking mentor data
    let client = await MongoClient.connect(url)
    let mentordb = await client.db("Mentor")
    let mentortable = await mentordb.collection("table")
    let mentordata = await mentortable.find({},{_id:0,name:1}).toArray()
    mentorList.push(mentordata)


    // taking srudent data
    let studentdb = await client.db("student")
    let studentTable = await studentdb.collection("table")
    let studentData = await studentTable.find({},{_id:0,name:1}).toArray()
    studentList.push(studentData)
    console.log(studentList[0].length)

    for(let i=0;i<studentList[0].length;i++){
        let randomMentor = (n=1) => {
            //[{},{}]
            return mentorList[0].sort(()=>0.5-Math.random()).splice(n,1)
        }
        if(studentList[0][i].Mentorname){

        }else{
            let data = randomMentor()
            console.log("====>",i,data)
            console.log(studentList[0][i])
            studentList[0][i].Mentorname = data[0].name
        }
    }
    let [finalStudentList] = studentList

    // deleteing studentlist and updating mentor name
    let studentMentorDelete = await studentTable.deleteMany({})
    let studentMentorInsert = await studentTable.insertMany(finalStudentList)
    res.json({
        ms:"hi",
        mentorList:mentorList[0],
        studentList:finalStudentList,
        studentMentorInsert
    })
})



// api to change mentor for a particular student
app.put("/changementor",async (req,res)=>{
    res.send(req.body)
    let client = await MongoClient.connect(url)
    let db = await client.db("student")
    let table = await db.collection("table")
    let list = await table.findOne({name:req.body.name})
    console.log(list)
    if(list.name){
        let updateList = await table.updateOne({name:req.body.name},{$set:{Mentorname:req.body.Mentorname}})
        res.send(updateList)
    }else{
        res.send("student record not found")
    }
})



// api to show students for a particular mentor
app.get("/particularmentor",async (req,res)=>{
    let client = await MongoClient.connect(url)
    let db = await client.db("student")
    let table = await db.collection("table")
    let list = await table.find({Mentorname:req.body.Mentorname}).toArray()
    res.json({
        list
    })
})
app.listen(4000)

