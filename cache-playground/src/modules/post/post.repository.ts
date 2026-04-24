import { prismaclient } from "../../db/prisma.client.js";

export interface Data{
    id:string;
    title:string;
}


export const postRepository={
    async getById(id:string){
        console.log("🔥 DB HIT !!");

        return prismaclient.post.findUnique({where:{id}});
    },

    async create(data:Data){
      return prismaclient.post.create({data});
    },

    async update(id:string,title:string){
        return prismaclient.post.update({
            where:{id},
            data:{title:title}
        });
    }

};