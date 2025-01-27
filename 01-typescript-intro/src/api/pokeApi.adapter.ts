import axios from "axios";

export interface HttpAdapter {
    get<T>(url:string): Promise<T>; 
    // post<T>(url:string, data: T): Promise<T>;
    // patch<T>(url:string, data: T): Promise<T>;
    // post(url:string): Promise<boolean>;
}


export class PokeApiFecthAdapter implements HttpAdapter {
   
    
    async get<T>(url: string): Promise<T>{
        const resp = await fetch(url);
        const data: T = await resp.json();
        console.log('se hizo con fecth');
        return data;
    }

}

export class PokeApiAdapter implements HttpAdapter {
 
    private readonly axios = axios;

    //T es un generico
    async get<T>(url: string): Promise<T>{
        const { data } = await this.axios.get<T>(url);
        console.log('se hizo con axios');
        return data;
    }

    // async post(url: string, data: any){

    // }

    // async patch(url: string, data: any){

    // }

    // async delete(url: string){

    // }

}