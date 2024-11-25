import { writeFile } from 'fs'
// Open-Closed Principle

// Single Responsibility Principle generate report
class ClientsData {
  private _data: Client[]

  constructor() {
    this._data = [];
  }

  add(client: Client) {
    // Add new client
    this._data.push(client);
  }

  getAll() {
    return this._data;
  }
}



class ReportGenerator {

  constructor(private _data: ClientsData) {}

  generate(): string {
    let report = '';
    this._data.getAll().forEach((client) => {
      report += `Name: ${client.getName()} Address: ${client.getAddress()}\n`;
    });
    return report;
  }
}

class Report {
  save(data: string, filepath: string) {
    // Save on disk
    console.log('Guardando archivo...')
    console.time('Guardando archivo');
    writeFile(filepath, data, (err) => {
      if (err) {
        console.error("Guardando el archivo", err);
      }
      console.timeEnd("Guardando archivo");
    });
  }
}

class Client {
  constructor(private name: string, private address: string) {
    
  } 

  setName(name: string) {
    this.name = name;
  }

  setAddress(address: string) {
    this.address = address;
  }

  getName() {
    return this.name;
  }

  getAddress() {
    return this.address;
  }
}


const client1 = new Client('Client 1', 'Prueba address');
const client2 = new Client('Client 2', 'Prueba address 2');

const clientData = new ClientsData();
clientData.add(client1);
clientData.add(client2);

const reportGenerator = new ReportGenerator(clientData);
const reportData = reportGenerator.generate();

const report = new Report();
report.save(reportData, 'report.txt');