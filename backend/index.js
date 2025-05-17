import express from 'express'
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"
import bodyParser from 'body-parser';
import cors from 'cors'
dotenv.config()
const app=express();
app.use(bodyParser.text())
app.use(cors())
const ai=new GoogleGenAI({apiKey:process.env.api_key})
function removeOuterTripleBackticks(text) {
  const delimiter = "```";
  if (text.startsWith(delimiter) && text.endsWith(delimiter) && text.length >= 6) {
    return text.slice(delimiter.length+4, -delimiter.length);
  }
  return text;
}
const generate=async(text_to_summarize)=>{
    const prompt=`
    Please summarize this text to 70% of its original size in a single paragraph. 
    While summarizing make sure that no figures or data are mentioned in the summary. 
    Also, avoid including irrelevent content. 
    Also, provide a suitable title to the summary like Title: and the suitable title. 
    Return the text in a json file format like 
    {
     "title":THE TITLE,
     "summary":THE SUMMARY
    }
    Dont add json word before the json format
    Here is the text: ${text_to_summarize}`
    try{
        const response=await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents:prompt,
        })
        let rt=response.text;
        const response_text=JSON.parse(removeOuterTripleBackticks(rt))
        return response_text
    }
    catch(error){
        console.log(error);
    }
}
// generate()


app.listen(5000, ()=>{
    console.log("App running at http://localhost:5000");
})
app.get('/', (req, res)=>{
    res.send("HI there");
})
app.post('/get-summary', async (req, res)=>{
    const text=req.body
    const response=await generate(text);
    res.json(response);
})