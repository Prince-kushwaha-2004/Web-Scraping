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
                const newdata = await page.evaluate(async () => {
                    await document.querySelectorAll('button')[3].click()
                    title = await document.querySelector('h1').innerText
                    main_folder = document.querySelectorAll('.order-first a')[0].innerText
                    sub_folder = document.querySelectorAll('.order-first a')[1].innerText

                    code = await document.querySelector('div code').innerText

                    return { main_folder, sub_folder, title, code }
                })
                // console.log(newdata)
                console.log("data_fetched")
                arr.push(newdata)
                path=`./react_component/${newdata.main_folder}/${newdata.sub_folder}`
                filename=`${newdata.title}.jsx`
                createfile(path,newdata.code,filename)
            }
            i++
        }
        // console.log(arr)

        await browser.close();
    }

    getcode()

}
getData()