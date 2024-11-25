import { writeFile } from "fs";
// Open-Closed Principle

// Single Responsibility Principle generate report

/**
 * Clase con la unica responsabilidad de tener la lista de clientes a guardar
 */
class ClientsData {
  private _data: Client[];

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

/**
 * To implement the open/closed principle we need to create an interface so our class does not depend on the implementation
 * and we can easily extend our software without modifying the existing code
 */

interface IReportDataGenerator {
  generate(): string;
}

/**
 * Clase con la unica responsabilidad de generar la información para el reporte
 * Now, our class implements the interface IReportDataGenerator
 */
class ReportDataGenerator implements IReportDataGenerator {
  constructor(private _data: ClientsData) {}

  generate(): string {
    let report = "";
    this._data.getAll().forEach((client) => {
      report += `Name: ${client.getName()} Address: ${client.getAddress()}\n`;
    });
    return report;
  }
}

/**
 * We can create a new class that implements the IReportDataGenerator interface
 * and add a new feature, generate html report without affecting other classes,
 * 
 */

class ReportGeneratorHTML implements IReportDataGenerator {
  constructor(private _data: ClientsData) {}

  generate(): string {
    let report = "<html><head><title>Report</title></head><body><table><thead><tr><th>Name</th><th>Address</th></tr></thead><tbody>";
    this._data.getAll().forEach((client) => {
      report += `<tr><td>${client.getName()}</td><td>${client.getAddress()}</td></tr>`;
    });
    report += "</tbody></table></body></html>";
    return report;
  }
}

/**
 * Clase con la unica responsabilidad de guardar el archivo, generar el reporte
 */
class Report {
  save(reportGenerator: IReportDataGenerator , filepath: string) {
    // Save on disk
    console.log("Guardando archivo...");
    console.time("Guardando archivo");
    
    // Now our report depends on an abstraction
    const data = reportGenerator.generate();

    writeFile(filepath, data, (err) => {
      if (err) {
        console.error("Guardando el archivo", err);
      }
      console.timeEnd("Guardando archivo");
    });
  }
}

class Client {
  constructor(private name: string, private address: string) {}

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

const client1 = new Client("Client 1", "Prueba address");
const client2 = new Client("Client 2", "Prueba address 2");

const clientData = new ClientsData();
clientData.add(client1);
clientData.add(client2);

// We can use this report generator that generate plain text reports
const reportGenerator = new ReportDataGenerator(clientData);

// const reportData = reportGenerator.generate();
const reportGeneratorHTML = new ReportGeneratorHTML(clientData);

const report = new Report();
// Now we have interchangeable reports modes without changing the Report class
report.save(reportGeneratorHTML, "report.html");
