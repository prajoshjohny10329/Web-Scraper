const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');

//Other packages 
const axios = require('axios');
const cheerio = require('cheerio');
const ExcelJS = require('exceljs');

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet 1');

//modified File name by date
let currentDate = new Date()+''
const fileName = 'News of '+currentDate.substring(0, 25)+'.xlsx';
const modifiedFileName = fileName.replace(/[-:]/g, '-');

//section for webpage
const url = 'https://www.indiatoday.in/'

axios(url).then(response =>{
   const data =  response.data
   const $ = cheerio.load(data)
   const articles  = [];
   $('.B1S3_story__card__A_fhi',data).each(function(){
    // const title = $(this).text()
    const topHead = $(this).find('h4').text()
    const secondHead = $(this).find('a').text()
    const detail = $(this).find('p').text()
    articles.push({
        topHead,
        secondHead,
        detail
    })
   })
   worksheet.addRow(['Top Headline', 'Second Headline', 'Detail']);
   articles.forEach((article) => {
        worksheet.addRow([article.topHead, article.secondHead, article.detail]); 
    });
   workbook.xlsx.writeFile(modifiedFileName)
  .then(() => {
    console.log('Excel file created successfully!');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}).catch(err => console.log('error occurred'))

app.listen(PORT ,()=>{
    console.log('server running on port ${PORT}');
})
