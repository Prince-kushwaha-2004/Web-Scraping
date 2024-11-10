const puppeteer = require('puppeteer')
const fs = require('fs');
createfile = (path,code,filename) => {
    fs.access(path, (error) => {
        if (error) {
            fs.mkdir(path, { recursive: true }, (error) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log("folder created successfully")
                    fs.writeFile(`${path}/${filename}`, code, (err) => {
                        if (err) throw err;
                        console.log("file created Successfully")
                    })
                }
            })
            console.log()
        } else {
            console.log("folder already exist")
            fs.writeFile(`${path}/${filename}`, code, (err) => {
                if (err) throw err;
                console.log("file created Successfully")
            })
        }
    })
}


getData = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    const page = await browser.newPage();

    await page.goto("https://tailwindui.com/components", {
        waitUntil: "domcontentloaded",
    });

    const data = await page.evaluate(() => {

        const links = document.querySelectorAll("li div h4 a");

        return Array.from(links).map((link) => {
            return link.href
        });
    });

    getcode = async () => {
        i = 0;
        let arr = []
        while (i < data.length) {
            await page.goto(data[i], {
                waitUntil: "domcontentloaded",
            })
            const x = await page.$$('select')
            if (x.length) {
                await page.select('select', 'react');
                await page.waitForTimeout(1000)
                const newdata = await page.evaluate(async () => {
                    select=await document.querySelectorAll('select')
                    let data=[]
                    title = await document.querySelector('h1').innerText
                    main_folder =await document.querySelectorAll('.order-first a')[0].innerText
                    sub_folder =await document.querySelectorAll('.order-first a')[1].innerText

                    j=select.length
                    k=0
                    while(k<j){
                        filename=await select[k].parentElement.parentElement.parentElement.querySelector('div a').innerText
                        await select[k].parentElement.parentElement.parentElement.querySelectorAll('button')[1].click()
                        code=await select[k].parentElement.parentElement.parentElement.querySelector('code').innerText
                        data.push({ main_folder, sub_folder, title,filename,code })
                       k++
                    }
                    return data
                   
                })
                console.log(newdata)
                console.log("data_fetched")
                k=newdata.length
                while(k){
                    path=`./react_component/${newdata[k-1].main_folder}/${newdata[k-1].sub_folder}/${newdata[k-1].title}`
                    filename=`${newdata[k-1].filename}.jsx`
                    createfile(path,newdata[k-1].code,filename)
                    k--
                }
            }
            i++
        }
        // console.log(arr)

        await browser.close();
    }

    getcode()

}
getData()