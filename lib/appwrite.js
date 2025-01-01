import { Client,Databases ,ID,Query,Account} from 'appwrite';
const client = new Client();
client.setProject('6774bbe700369e392958');

const database = new Databases(client);
const account = new Account(client);
export { client,database,ID,Query,account};
