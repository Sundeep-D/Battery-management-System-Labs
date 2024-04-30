const fs = require('fs');


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
    Description: I am a SkyBMS AI. I will provide usefull insigths about the battery and i have limited knowledge that are past 30 min only.
    If you ask more insights more than 30 min ago, I coulnt able to provide you information on that sorry\n\n

    
    `);
    
}
function writePast1hrData(documents){
    if (documents.length === 0) {
        console.log("No documents found in the past 1 hour");
        return;
      }

      
  
      
      writeHeaderData();
  
      // Write header to data.txt
      fs.appendFileSync('data.txt', "Timestamp\t\t\t\tCurrent Capacity\t\t\tCharging Status\t\ttemperature\t\t\tsoc\t\t\tvoltage\n");
  
      // Write each document to data.txt
          // Write each document to data.txt
          documents.forEach((doc,index) => {
            let { timestamp_human, current_capacity, is_charging, temperature, soc, voltage } = doc;
            if(index==0){
              timestamp_human="Now"
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
      
  
      console.log("Latest 50 records within 1-hour timeframe written to data.txt");
}

module.exports = { writePast1hrData,writeHeaderData };