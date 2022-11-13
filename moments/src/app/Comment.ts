export interface Comment{
    id?: string;
    text: string;
    username: string;
    momentId: number;
    create_at?:string;
    update_at?: string;
}