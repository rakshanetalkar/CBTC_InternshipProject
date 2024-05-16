var default_days=document.querySelector('.default_day');
var default_date=document.querySelector('.default_date');
var btnSearch=document.querySelector('.btnSearch');
var input_field=document.querySelector('.input_field');
var iconsDetail=document.querySelector('.icons');
var listContent=document.querySelector('.list_content ul')

const API='2fc5aa24019aba9049d5a4e785aadda6';

const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

//display the day
const day=new Date();
const dayName=days[day.getDay()];//date wise names displayed
default_days.textContent=dayName;

//display the date
let date=day.getDate();
let month=day.toLocaleString('default',{month:'long'});
let year=day.getFullYear();
default_date.textContent=date+" "+month+" "+year

//display event

btnSearch.addEventListener('click',function(e){
    e.preventDefault();

    //Check empty value
    if (input_field.value=='') {
        alert('Please Enter City or Country Name')
    }else{
        const search=input_field.value;
        input_field.value='';
        findLocation(search);
    }
})

async function findLocation(name){
    iconsDetail.innerHTML='';
    listContent.innerHTML='';
    try {
        const api_url= `https://api.openweathermap.org/data/2.5/weather?q=${name}%20%20%20&appid=${API}`;
        const data=await fetch(api_url)
        const result=await data.json();
        console.log(result)

        if(result.cod =="404"){
            //display error message
            const message=`<h2 class="Weather_temp">${result.cod}</h2>
            <h3 class="cloudtxt">${result.message}</h3>`;
            iconsDetail.insertAdjacentHTML('afterbegin',message);
        }else{
           setTimeout(()=>{
            // Display image content & data
           const html=`<img src=" https://openweathermap.org/img/wn/${result.weather[0].icon}@4x.png">
           <h2 class="Weather_temp">${Math.round(result.main.temp-273.15)}°C</h2>
           <h3 class="cloudtxt">${result.weather[0].description}</h3>`
           iconsDetail.insertAdjacentHTML('afterbegin',html);
           iconsDetail.classList.add('fadeIn');
           //display right side content
           rightSideContent(result);
           },1500)
           displayForcast(result.coord.lat,result.coord.lon);
        }
    } catch (error) { }
}

function rightSideContent(result){
    var country=document.querySelector('.country');
    country.textContent=result.sys.country;
    
    var location=document.querySelector('.location');
    location.textContent=result.name;
    
    var temp=document.querySelector('.temp');
    temp.textContent=Math.round(result.main.temp-273.15)+'°C';

    var humidity=document.querySelector('.humidity');
    humidity.textContent=result.main.humidity+'%';

    var windSpeed=document.querySelector('.windSpeed');
    windSpeed.textContent=result.wind.speed+'km/h';
}

async function displayForcast(lat,long){
    const forCast_api=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
    const data=await fetch(forCast_api);
    const result=await data.json();
    console.log(result);

    //filter the forcast
    const uniqeforcastDays=[]
    const forcastDays=result.list.filter((forcast)=>{
        const forcastDate=new Date(forcast.dt_txt).getDate();
        if (!uniqeforcastDays.includes(forcastDate)) {
            return uniqeforcastDays.push(forcastDate)    
        }
    });
    console.log(forcastDays);

    forcastDays.forEach((content,index)=>{
        const day=new Date(content.dt_txt);
        const dayName=days[day.getDay()];
        console.log('DayName:'+dayName)

        const splitDay=dayName.split("",3);
        const joinDay=splitDay.join("");
        console.log(joinDay);

        if (index<=4) {
            const htmlList=`<li>
            <img src=" https://openweathermap.org/img/wn/${content.weather[0].icon}@2x.png">
            <span>${joinDay}</span>
            <span class="day_temp">${Math.round(content.main.temp-273.15)}°C</span>
        </li>`        
        listContent.insertAdjacentHTML('afterbegin',htmlList);
        }
    })
}