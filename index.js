const { Builder, By, Key, until } = require("selenium-webdriver");
const { google } = require("googleapis");
var Assert = require("assert");
// const Builder = require("selenium-webdriver");
// console.log(Builder);

const googleSheetfn = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "keys.json", //the key file
        //url to spreadsheets API
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    //Client Auth
    const client = await auth.getClient();

    //googleSheets api

    const googleSheet = google.sheets({ version: "v4", auth: client });

    const SheetID = "1k5zLTvGs5DOxlhrrFhl_-z65Z07eoHCPsr5OtaGURv4";
    return {
        auth,
        client,
        googleSheet,
        SheetID
    }
}

const Automation = async (userName, Password) => {
    // let toestMessage = "";
    let driver = new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();
    await driver.get("https://stage-admin.eleveglobal.com").then(async function () {
        // await driver.findElement(By.placeholder("Email")).sendKeys("Selenium", Key.RETURN);
        // driver.wait(until.elementLocated(userName, Password), 10 * 1000);
        await driver.findElement(By.xpath(`//*[@placeholder="Email"]`)).sendKeys(userName);

        // driver.findElement(By.xpath(`//*[@class="toast-error"]`)).getText()
        // then((val) => val);
        // console.log("this is running on " + toastMessage);
        // console.log(toestMessage);
        // await driver.findElement(By.xpath(`//*[@type="submit"]`)).click();
        // await driver.findElement(By.xpath(`//*[@onclick="menu_icon()"]`)).click();
        // driver.findElement(By.)/
    }).then(async () => {
        await driver.findElement(By.xpath(`//*[@placeholder="password"]`)).sendKeys(Password, Key.RETURN)
        // await driver.findElement(By.xpath(`//*@title="Instagram"`)).click();
    }).then(async () => {
        setTimeout(async () => {
            let actualUrl = "https://stage-admin.eleveglobal.com/discover/list";
            let LoginURL = await driver.getCurrentUrl();
            let Result = "";
            // Assert.equal(LoginURL, actualUrl);
            if (actualUrl === LoginURL) {
                console.log(userName + " is loged in to appliction");
                Result = "YES";
                // let Sheet = await googleSheetfn();
                // await Sheet.googleSheet.spreadsheets.values.append({
                //     auth: Sheet.auth, //auth object
                //     spreadsheetId: Sheet.SheetID, //spreadsheet id
                //     range: "sheet1!C", //sheet name and range of cells
                //     valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
                //     resource: {
                //         values: [["YES"]]
                //     }
                // });
                // result = true;
            } else {
                console.log(userName + " is Not loged in sometiong is wrong");
                Result = "NO";
                // let Sheet = await googleSheetfn();
                // await Sheet.googleSheet.spreadsheets.values.append({
                //     auth: Sheet.auth, //auth object
                //     spreadsheetId: Sheet.SheetID, //spreadsheet id
                //     range: "sheet1", //sheet name and range of cells
                //     valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
                //     resource: {
                //         values: [["NO"]]
                //     }
                // });

                // result = false;
            }
            let Sheet = await googleSheetfn();
            await Sheet.googleSheet.spreadsheets.values.append({
                auth: Sheet.auth, //auth object
                spreadsheetId: Sheet.SheetID, //spreadsheet id
                range: "Auto Result", //sheet name and range of cells
                valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
                resource: {
                    values: [[userName, Password, Result]]
                }
            });
        }, 10000);

    })
}
console.log()


const sheetFetch = async () => {

    // const auth = new google.auth.GoogleAuth({
    //     keyFile: "keys.json", //the key file
    //     //url to spreadsheets API
    //     scopes: "https://www.googleapis.com/auth/spreadsheets",
    // });
    // //Client Auth
    // const client = await auth.getClient();

    // //googleSheets api

    // const googleSheet = google.sheets({ version: "v4", auth: client });

    // const SheetID = "1k5zLTvGs5DOxlhrrFhl_-z65Z07eoHCPsr5OtaGURv4";
    let Sheet = await googleSheetfn();
    const mataData = await Sheet.googleSheet.spreadsheets.values.get({
        auth: Sheet.auth,
        spreadsheetId: Sheet.SheetID,
        range: "Input Data",
    })
    const dataArray = mataData.data.values;
    for (let i = 0; i < dataArray.length; i++) {
        // console.log("data is running is here");
        let userName = "";
        let passWord = "";
        for (let j = 0; j < dataArray[i].length; j++) {
            if ([j] == 0) {
                userName = dataArray[i][j];
            } else {
                passWord = dataArray[i][j];
            }

        }
        console.log(userName);
        console.log(passWord);
        Automation(userName, passWord);

    }
}

sheetFetch();
// const fun = async () => {
//     const newvar = (await googleSheetfn()).googleSheet;
//     console.log(newvar);
// }
// fun();