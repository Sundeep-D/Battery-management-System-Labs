const fs = require('fs');

let temperature = 10;

let temperatureRateOfChange = 10;

let socRateOfChange = 0;
let socRateOfChangeTime = 0;

function writeHeaderData(){
    // Clear contents of data.txt
    fs.writeFileSync('data.txt', '');

    fs.writeFileSync('data.txt', `This is SkyBMS. SkyBMS is a product that elevates the monitoring and gives valuable insights about the battery operations using the power of the Cloud environment.
    This is a class project and not for commercial purposes. Any insights provided by this tool or by the SkyBMS AI may sometimes be wrong or need revision.\n\n
    \n\n
    This project developed by Sundeep Dayalan. You may contact him using contact@sundeepdayalan.in
    \n\n
    Not for commercial use\n\n
    Battery used: EEMB 3.7V Lithium Polymer Battery Total capacity:250mAh Nominal voltage:3.7v Weight:5g 
    Charge temperature: 0 ~ 30 C 
    Discharge temperature: ~20 ~+ 60C\n\n

    Name: SkyBMS AI
    If someone ask whats your name tell them "SkyBMS AI"
    Description: I am a SkyBMS AI. I will provide usefull insigths about the battery and i have limited knowledge that are past 30 min only.
    If you ask more insights more than 30 min ago, I coulnt able to provide you information on that sorry\n\n

    
    `);
    
}


function writeData(rawData){
    writeHeaderData();
    writeAlerts(rawData);
    writePast1hrData(rawData);
    
}
function writePast1hrData(documents){
    if (documents.length === 0) {
        console.log("No documents found in the past 1 hour");
        return;
      }

      
  
      
      fs.appendFileSync('data.txt', `\n\nThe below data is used to provide insights about when the battery is lastly charged, currently charging or not, current soc, current temperature, whats the rate of change of temperature
      "Charging" means the battery is conencted to power source to chrage or charger is connected and"Not charging" its not connected to power source. If user ask when the charger us lastly connected pick a recent row that is in Charging status and say it correspodning time\n\n`);
  
  
      // Write header to data.txt
      fs.appendFileSync('data.txt', "Timestamp\t\t\t\tCurrent Capacity\t\t\tCharging Status\t\ttemperature\t\t\tsoc\t\t\tvoltage\n");
  let currentSoc;
      // Write each document to data.txt
          // Write each document to data.txt
          documents.forEach((doc,index) => {
            let { timestamp_human, current_capacity, is_charging, temperature, soc, voltage } = doc;
            if(index==0){
              timestamp_human="Now"
              currentSoc = soc
            }

  
            if(is_charging){
              is_charging="Charging"
            }else{
              is_charging="Not Charging"
            }
  
            let line;
            if(index==0){
              line = `${timestamp_human}\t\t\t\t\t\t\t${current_capacity}\t\t\t\t\t\t${is_charging}\t\t\t\t${temperature}\t\t\t\t${Math.floor(soc)}\t\t\t${voltage.toFixed(2)}\n`;
            
            }else{
              line = `${timestamp_human}\t\t${current_capacity}\t\t\t\t\t\t${is_charging}\t\t\t\t${temperature}\t\t\t\t${Math.floor(soc)}\t\t\t${voltage.toFixed(2)}\n`;
            
            }
            fs.appendFileSync('data.txt', line);
          });
      

          fs.appendFileSync('data.txt', `\n\n\n Current SOC or charge level of the battery is ${Math.round(currentSoc)}`);
  
      console.log("Latest 50 records within 1-hour timeframe written to data.txt");
}

function updateTemperature(temp) {
    console.log("Updating temperature"+temp);
    temperature = temp;
}

function updateTemperatureRateOfChange(tempRate) {
    console.log("Updating temperature rate of change"+tempRate);
    temperatureRateOfChange = tempRate;
}

function updateSocRateOfChange(socRate,socRateTime) {
    console.log("Updating soc rate of change"+socRate +" in "+socRateTime+" minutes");
    socRateOfChange = socRate;
    socRateOfChangeTime = socRateTime;
}


function writeAlerts(data){

    if(temperatureRateOfChange<0){
        fs.appendFileSync('data.txt', `\n\nTemperature rate of change:
        Battery temperature is decreasing in rate of change of ${temperatureRateOfChange}%. 
        \n\n`);
    }else if(temperatureRateOfChange>0){
        fs.appendFileSync('data.txt', `\n\nTemperature rate of change:
        Battery temperature is increasing in rate of change of ${temperatureRateOfChange}%. 
        \n\n`);
    }else{
        fs.appendFileSync('data.txt', `\n\nTemperature rate of change:
        Battery temperature is stable. 
        \n\n`);
    }
    

    if(socRateOfChange<0){
        fs.appendFileSync('data.txt', `\n\nSOC rate of change:
        Current state: Battery is discharging\n\n
        Battery is discharging at rate of change of ${socRateOfChange}% in ${socRateOfChangeTime} minutes. 
        \n\n`);
    }else if(socRateOfChange>0){
        fs.appendFileSync('data.txt', `\n\nSOC rate of change:
        Current state: Battery is charging\n\n
        Battery is charging at rate of change of ${socRateOfChange}%  in ${socRateOfChangeTime} minutes. 
        \n\n`);
    }else{
        fs.appendFileSync('data.txt', `\n\nSOC rate of change:
        Battery soc is stable. 
        \n\n`);
    }
    


    if(temperature>30){
        fs.appendFileSync('data.txt', `\n\nHIGH ALERT:
        Battery temperature is more than 30 deg C . Current temperature is ${temperature}. All the operations in the battery is suspended. Waiting for battery to cool down to resume all the operations normaally
        \n\n`);
    }else{
        fs.appendFileSync('data.txt', `\n\nALERTS:
        \nNo Alerts found in the battery\n\n`);
    }
    
}
module.exports = { writePast1hrData,updateSocRateOfChange,writeHeaderData,writeData,updateTemperature,updateTemperatureRateOfChange };