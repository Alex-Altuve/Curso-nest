import axios, { AxiosInstance } from "axios";
import { Injectable } from "@nestjs/common";
import { HttpAdapter } from "../interfaces/http-adapter.interface";


@Injectable()
export class fecthAdapter implements HttpAdapter{
    
    async get<T>(url: string): Promise<T> {
        try{
            const resp = await fetch(url);
             const data: T = await resp.json();
            return data;
        }catch(e){
            throw new Error('This is an error - Check Logs')
        }
    }

}