import express from "express";
import {
  addFAQ,
  getFAQs,
  getFAQ,
  updateFAQ,
  deleteFAQ,
} from "../controllers/FaqController.js";

const faqRouter = express.Router();

faqRouter.post("/", addFAQ);        
faqRouter.get("/", getFAQs);       
faqRouter.get("/:id", getFAQ);      
faqRouter.put("/:id", updateFAQ);   
faqRouter.delete("/:id", deleteFAQ);
export default faqRouter;
