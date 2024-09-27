var XMLHttpRequest = require("xhr2")
const unirest = require("unirest")
const dotenv = require("dotenv")
const fs = require("fs")

const Http = new XMLHttpRequest()

dotenv.config()

let videoC

const getData = async() => {
    try {
        const user_name = process.env.USER_NAME
        const response = await unirest.get(`https://tiktok.com/@${user_name}/`)
        const data = await response.body
        console.log("L0L")

        const video_count_n = process.env.VIDEO_COUNT

        const idx =  await data.lastIndexOf("videoCount")+12
        return data.substring(idx, idx+parseInt(video_count_n))
    } catch (e) {
        console.log(e)
    }
}

fs.readFile("data.json", (error, data) => {
    if (error) {
        // logging the error
        console.error(error);
    
        throw err;
      }
    videoC = JSON.parse(data)

})

// const main = async() => {
//     let videoC = await getData()

//     const timeout = async() => {
//         let vc = await getData()
//         setTimeout(() => {
//             if (vc != videoC) {
//                 console.log("ALERT")
//                 console.log(videoC)

//                 videoC = vc

//                 Http.open("GET", `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.ID}&text=new%20video`)
//                 Http.send()
//             } else {
//                 console.log("THE SAME")
//                 console.log(videoC, vc)
//             }
//             timeout()
//         }, 10000)
//     }
//     timeout()
// }

const timeout = async() => {
    let vc = await getData()
    setTimeout(() => {
        if (vc != videoC.views) {
            console.log(videoC.views, vc)
            console.log("ALERT")
            videoC.views = vc
            fs.writeFileSync("data.json", JSON.stringify({"views": vc}))
            
            Http.open("GET", `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.ID}&text=new%20video`)
            Http.send()
        } else {
            console.log("THE SAME")
        }
        timeout()
    }, 10000)
}
timeout()

// main()