import Airtable from "airtable";
import dotenv from "dotenv";

dotenv.config();

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

export const airtable = Airtable.base(process.env.AIRTABLE_BASE_ID);
