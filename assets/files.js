const fs = require('fs');
const path = "./reactcomponent/comp2"

fs.access(path, (error) => {
    if (error) {
        fs.mkdir(path, { recursive: true }, (error) => {
            if (error) {
                console.log(error)
            } else {
                console.log("folder created successfully")
                let data = "Hello world."
                fs.writeFile(`${path}/Hello.html`, data, (err) => {
                    if (err) throw err;
                })        
            }
        })
        console.log()
    } else {
        console.log("folder already exist")
        let data = "<h1>Hello world.</h1>"
        fs.writeFile(`${path}/Hello.html`, data, (err) => {
            if (err) throw err;
        })
    }
})