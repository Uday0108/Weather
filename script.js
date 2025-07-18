document.getElementById("btn").addEventListener("click",fetchData);

var Temp_fetch;
var timeJson;
let lat;
let lon;
let loc;

async function fetchData(){
    try{
        loc = document.getElementById("location").value;
        if(loc==''){
            console.log('No city found...')
            return;
        }
        
        var Lat_Lon_fetch = await fetch(`https://nominatim.openstreetmap.org/search?q=${loc}&format=jsonv2`);
        
        if(!Lat_Lon_fetch.ok){
            console.log("error fetching the data ... (status not ok) ");
        return ;
        }

        const data = await Lat_Lon_fetch.json();        
        if(data.length==0){
            console.log(" -> No city or country found...");
        return ;
        }
        
        lat = data[0].lat;
        lon = data[0].lon;
        
        Temp_fetch = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=is_day,apparent_temperature,relative_humidity_2m,weather_code,temperature_2m&forecast_days=1`);
        
        if(!Temp_fetch.ok)
            console.log("error fetching temperature....")
        
        
        timeJson = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=E5MPA8P5WLC1&format=json&by=position&lat=${lat}&lng=${lon}`);
        
        if(!timeJson.ok)
        console.log("time error....")
        
        process();
    }
    catch(error){
        console.log("there is error in fetchng data...." + error);
    }
    
}


async function process(){    
    
    const temp_data = await Temp_fetch.json();
    var timeData = await timeJson.json();

    let formatted = timeData.formatted;
    let temperature = temp_data.current.temperature_2m;
    let app_temperature = temp_data.current.apparent_temperature;
    let humidity = temp_data.current.relative_humidity_2m;
    let hour =  formatted.substring(11,13);
    let hoursHand = (hour>12) ? (Math.abs(hour-12)) : hour ;
    let weather_code = temp_data.current.weather_code;

    document.getElementById('temp_c').textContent = temperature+` °C`;
    document.getElementById('app_temperature').textContent = Math.floor(app_temperature)+` °C`;
    document.getElementById('humidity').textContent = humidity;
    document.getElementById('lat_lon').textContent = lat+ ", " + lon;
    document.getElementById('time').textContent = hoursHand+":" + formatted.substring(14,16) + (hour >= 12 ? "pm " : "am ");
    document.getElementById('day').textContent = formatted.substring(0,10);  
    document.getElementById('weatherIcon').textContent  = openMeteoIconMap[weather_code];     
    document.getElementById('humidityPara').textContent  = "Humidity";     
    document.getElementById('app_temperaturePara').textContent  = "Apparent Temp";   
    
    var humidityImage = document.getElementById('humidImg');
    var apparentImage = document.getElementById('appImg');
    var dayOrNight = document.getElementById('dayOrNight');
    var apparentImage = document.getElementById('appImg');
    var locationImage = document.getElementById('locationImage');

    humidityImage.src  = "humidity.png";   
    apparentImage.src  = "apparent_temp.png";   
    
    humidityImage.height  = 40;   
    humidityImage.width  = 40;
    
    apparentImage.height  = 40;   
    apparentImage.width  = 40;   
    
    dayOrNight.src =  (hour <=5 || hour > 18 ) ? "moon.gif" : "sun.gif" ;
    dayOrNight.height = 35;
    dayOrNight.width = 35;

    locationImage.src = "location.png";
    locationImage.height = 25;
    locationImage.width = 25;
    
}



const openMeteoIconMap = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  56: "🌧️",
  57: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  66: "🌧️❄️",
  67: "🌧️❄️",
  71: "🌨️",
  73: "🌨️",
  75: "❄️",
  77: "🌨️",
  80: "🌧️",
  81: "🌧️",
  82: "🌧️",
  85: "🌨️",
  86: "🌨️",
  95: "⛈️",
  96: "⛈️⚡",
  99: "⛈️⚡"
};
